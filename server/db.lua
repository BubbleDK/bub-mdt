local db = {}
local config = require 'config'
local framework = require(('server.framework.%s'):format(config.framework))
local profileCards = require 'server.profileCards'

function createRecentActivity(citizenid, category, type, activityid)
    local insertRecentActivityQuery = [[
        INSERT INTO `mdt_recent_activity` (`citizenid`, `category`, `type`, `activityid`)
        VALUES (?, ?, ?, ?);
    ]]

    local success = MySQL.prepare.await(insertRecentActivityQuery, { citizenid, category, type, activityid })
    return success
end

-- Dashboard
function db.selectAnnouncements()
    return framework.getAnnouncements()
end

function db.createAnnouncement(creator, contents)
    return MySQL.prepare.await('INSERT INTO `mdt_announcements` (`creator`, `contents`) VALUES (?, ?)', { creator, contents })
end

local selectRecentActivities = [[
    SELECT
        activity.citizenid,
        p.charinfo,
        activity.category,
        activity.type,
        DATE_FORMAT(activity.date, "%Y-%m-%d %T") as date,
        activity.activityid
    FROM
        mdt_recent_activity activity
    JOIN
        players p
    ON
        activity.citizenid = p.citizenid
    ORDER BY 
        activity.date DESC
    LIMIT 6;
]]

function db.getRecentActivity()
    local queryResult = MySQL.rawExecute.await(selectRecentActivities)
    local recentActivity = {}

    for _, v in pairs(queryResult) do
        local charinfo = json.decode(v.charinfo)
        recentActivity[#recentActivity+1] = {
        type = v.type,
        category = v.category,
        firstname = charinfo.firstname,
        lastname = charinfo.lastname,
        date = v.date,
        activityid = v.activityid,
        citizenid = v.citizenid,
        }
    end

    return recentActivity
end

function db.getWarrants()
    return framework.getWarrants()
end

-- Profiles
function db.selectAllProfiles()
    return framework.getAllProfiles()
end

function db.selectCharacterProfile(citizenid)
    local parameters = { citizenid }
    local profile = framework.getCharacterProfile(parameters)

    if not profile then return end

    local cards = profileCards.getAll()

    for i = 1, #cards do
        local card = cards[i]
        profile[card.id] = card.getData(profile)
    end

    profile.relatedReports = MySQL.rawExecute.await('SELECT DISTINCT `id`, `title`, `author`, DATE_FORMAT(`date`, "%Y-%m-%d") as date FROM `mdt_reports` r JOIN `mdt_reports_citizens` rc ON r.id = rc.reportid WHERE `citizenid` = ?', parameters) or {}
    profile.relatedIncidents = MySQL.rawExecute.await('SELECT DISTINCT `id`, `title`, `author`, DATE_FORMAT(`date`, "%Y-%m-%d") as date FROM `mdt_incidents` a LEFT JOIN `mdt_incidents_charges` b ON b.incidentid = a.id WHERE `citizenid` = ?', parameters) or {}

    return profile
end

function db.updateProfileNotes(citizenid, notes)
    createRecentActivity(citizenid, 'profiles', 'updated')
    return MySQL.prepare.await('INSERT INTO `mdt_profiles` (`citizenid`, `image`, `notes`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `notes` = ?', { citizenid, nil, notes, notes })
end

function db.isProfileWanted(citizenId)
    return framework.isProfileWanted(citizenId)
end

function db.updateProfileImage(citizenid, imageURL)
    return MySQL.prepare.await('INSERT INTO `mdt_profiles` (`citizenid`, `image`, `notes`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `image` = ?', { citizenid, imageURL, nil, imageURL })
end

function db.addFingerprintToProfile(citizenid, fingerprint)
    return MySQL.prepare.await('INSERT INTO `mdt_profiles` (`citizenid`, `fingerprint`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `fingerprint` = ?', { citizenid, fingerprint, fingerprint })
end

function db.createMDTProfile(data)
    return MySQL.prepare.await('INSERT INTO `mdt_profiles` (`citizenid`, `callsign`, `lastActive`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `callsign` = ?, `lastActive` = ?', { data.citizenid, data.callsign, os.date("%Y-%m-%d %H:%M:%S"), data.callsign, os.date("%Y-%m-%d %H:%M:%S") })
end

-- Incidents

local selectIncidents = 'SELECT `id`, `title`, `author`, DATE_FORMAT(`date`, "%Y-%m-%d %T") as date FROM `mdt_incidents`'
local selectIncidentsById = selectIncidents .. 'WHERE `id` = ?'

function db.selectIncidentById(id)
    return MySQL.prepare.await('SELECT `id`, `title`, `description` FROM `mdt_incidents` WHERE `id` = ?', { id })
end

local selectIncidentsDesc = selectIncidents .. 'ORDER BY `id` DESC'

function db.selectIncidents()
    return MySQL.rawExecute.await(selectIncidentsDesc)
end

function db.createIncident(title, author, citizenid)
    local response  = MySQL.insert.await('INSERT INTO `mdt_incidents` (`title`, `author`) VALUES (?, ?)', { title, author })

    createRecentActivity(citizenid, 'incidents', 'created', response)

    return response 
end

function db.deleteIncident(incidentId, citizenid)
    local queries = {
        { 'DELETE FROM `mdt_recent_activity` WHERE `activityid` = ?', { incidentId } },
        { 'DELETE FROM `mdt_incidents_evidence` WHERE `incidentid` = ?', { incidentId } },
        { 'DELETE FROM `mdt_incidents_charges` WHERE `incidentid` = ?', { incidentId } },
        { 'DELETE FROM `mdt_incidents_officers` WHERE `incidentid` = ?', { incidentId } },
        { 'DELETE FROM `mdt_incidents_criminals` WHERE `incidentid` = ?', { incidentId } },
        { 'DELETE FROM `mdt_incidents` WHERE `id` = ?', { incidentId } },
    }

    local result = MySQL.transaction.await(queries)

    -- Add logs
    createRecentActivity(citizenid, 'incidents', 'deleted', incidentId)

    return result
end

function db.selectOfficersInvolved(incidentId)
    return framework.getOfficersInvolved({ incidentId })
end

function db.selectEvidence(incidentId)
    return MySQL.rawExecute.await('SELECT `label`, `image` FROM `mdt_incidents_evidence` WHERE incidentid = ?', { incidentId })
end

function db.selectCriminalsInvolved(incidentId)
    local parameters = { incidentId }
    local criminals = framework.getCriminalsInvolved(parameters) or {}
    local charges = framework.getCriminalCharges(parameters) or {}

    for _, criminal in pairs(criminals) do
        criminal.charges = {}
        local chargesN = 0

        criminal.penalty = {
            time = 0,
            fine = 0,
            reduction = criminal.reduction,
            points = 0
        }

        for _, charge in pairs(charges) do
            if charge.label and charge.citizenid == criminal.citizenid then
                charge.citizenid = nil
                criminal.penalty.time += charge.time or 0
                criminal.penalty.fine += charge.fine or 0
                criminal.penalty.points += charge.points or 0
                chargesN += 1
                criminal.charges[chargesN] = charge
            end
        end

        if criminal.warrantExpiry then
            criminal.issueWarrant = true
        end

        criminal.processed = criminal.processed or false
        criminal.pleadedGuilty = criminal.pleadedGuilty or false
    end

    return criminals
end

function db.addOfficer(incidentId, citizenId)
    return MySQL.prepare.await('INSERT INTO `mdt_incidents_officers` (`incidentid`, `citizenid`) VALUES (?, ?)', { incidentId, citizenId })
end

function db.removeOfficer(incidentId, citizenId)
    return MySQL.prepare.await('DELETE FROM `mdt_incidents_officers` WHERE `incidentid` = ? AND `citizenid` = ?', { incidentId, citizenId })
end

function db.addCriminal(incidentId, citizenId)
    return MySQL.prepare.await('INSERT INTO `mdt_incidents_criminals` (`incidentid`, `citizenid`) VALUES (?, ?)', { incidentId, citizenId })
end

function db.removeCriminal(incidentId, citizenId)
    return MySQL.prepare.await('DELETE FROM `mdt_incidents_criminals` WHERE `incidentid` = ? AND `citizenid` = ?', { incidentId, citizenId })
end

function db.addEvidence(id, label, image)
    return MySQL.prepare.await('INSERT INTO `mdt_incidents_evidence` (`incidentid`, `label`, `image`) VALUES (?, ?, ?)', { id, label, image })
end

function db.removeEvidence(id, label, image)
    return MySQL.prepare.await('DELETE FROM `mdt_incidents_evidence` WHERE `incidentid` = ? AND `label` = ? AND `image` = ?', { id, label, image })
end

function db.updateIncidentContents(id, value)
    return MySQL.prepare.await('UPDATE `mdt_incidents` SET `description` = ? WHERE `id` =  ?', { value, id })
end

function db.createWarrant(incidentId, citizenId, expiry)
    local warrantExists = MySQL.prepare.await('SELECT COUNT(1) FROM `mdt_warrants` WHERE `incidentid` = ? AND `citizenid` = ?', { incidentId, citizenId }) > 0

    if warrantExists then
        return MySQL.prepare.await('UPDATE `mdt_warrants` SET `expiresAt` = ? WHERE `incidentid` = ? AND `citizenid` = ?', { expiry, incidentId, citizenId })
    end

    return MySQL.prepare.await('INSERT INTO `mdt_warrants` (`incidentid`, `citizenid`, `expiresAt`) VALUES (?, ?, ?)', { incidentId, citizenId, expiry })
end

function db.removeWarrant(incidentId, citizenId)
    return MySQL.prepare.await('DELETE FROM `mdt_warrants` WHERE `incidentid` = ? AND `citizenid` = ?', { incidentId, citizenId })
end

function db.removeOldWarrants()
    return MySQL.prepare.await('DELETE FROM `mdt_warrants` WHERE `expiresAt` < (NOW() - INTERVAL 1 HOUR)')
end

function db.saveCriminal(incidentId, criminal, officerCitizenid)
    createRecentActivity(officerCitizenid, 'incidents', 'updated', incidentId)
    local queries = {
        { 'DELETE FROM `mdt_incidents_charges` WHERE `incidentId` = ? AND `citizenid` = ?', { incidentId, criminal.citizenid } },
        { 'UPDATE IGNORE `mdt_incidents_criminals` SET `reduction` = ?, `warrantExpiry` = ?, `processed` = ?, `pleadedGuilty` = ? WHERE `incidentId` = ? AND `citizenid` = ?', { criminal.penalty.reduction, criminal.issueWarrant and criminal.warrantExpiry or nil, criminal.processed, criminal.pleadedGuilty, incidentId, criminal.citizenid } },
    }
    local queryN = #queries

    if next(criminal.charges) then
        for _, v in pairs(criminal.charges) do
            queryN += 1
            queries[queryN] = { 'INSERT INTO `mdt_incidents_charges` (`incidentId`, `citizenid`, `charge`, `type`, `count`, `time`, `fine`, `points`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', { incidentId, criminal.citizenid, v.label, v.type, v.count, v.time, v.fine, v.points } }
        end
    end

    return MySQL.transaction.await(queries)
end

function db.getOfficers()
    return framework.getOfficers()
end

function db.searchCharacters()
    return framework.getCharacters()
end

-- Reports
local selectReports = 'SELECT `id`, `title`, `author`, DATE_FORMAT(`date`, "%Y-%m-%d %T") as date FROM `mdt_reports`'
local selectReports = selectReports .. 'ORDER BY `id` DESC'

function db.selectReportById(id)
    return MySQL.prepare.await('SELECT `id`, `title`, `description` FROM `mdt_reports` WHERE `id` = ?', { id })
end

function db.selectReports()
    return MySQL.rawExecute.await(selectReports)
end

function db.selectOfficersInvolvedReport(reportId)
    return framework.getOfficersInvolvedReport({ reportId })
end

function db.selectEvidenceReport(reportId)
    return MySQL.rawExecute.await('SELECT `label`, `image` FROM `mdt_reports_evidence` WHERE reportid = ?', { reportId })
end

function db.selectCitizensInvolvedReport(reportId)
    return framework.getCitizensInvolvedReport({ reportId })
end

function db.removeReportOfficer(reportId, citizenId)
    return MySQL.prepare.await('DELETE FROM `mdt_reports_officers` WHERE `reportid` = ? AND `citizenid` = ?', { reportId, citizenId })
end

function db.removeReportCitizen(reportId, citizenId)
    return MySQL.prepare.await('DELETE FROM `mdt_reports_citizens` WHERE `reportid` = ? AND `citizenid` = ?', { reportId, citizenId })
end

function db.updateReportContents(id, value)
    return MySQL.prepare.await('UPDATE `mdt_reports` SET `description` = ? WHERE `id` =  ?', { value, id })
end

function db.removeReportEvidence(id, label, image)
    return MySQL.prepare.await('DELETE FROM `mdt_reports_evidence` WHERE `reportid` = ? AND `label` = ? AND `image` = ?', { id, label, image })
end

function db.createReport(title, author, citizenid)
    local response  = MySQL.insert.await('INSERT INTO `mdt_reports` (`title`, `author`) VALUES (?, ?)', { title, author })

    createRecentActivity(citizenid, 'reports', 'created', response)

    return response 
end

function db.addReportOfficer(reportId, citizenId)
    return MySQL.prepare.await('INSERT INTO `mdt_reports_officers` (`reportid`, `citizenid`) VALUES (?, ?)', { reportId, citizenId })
end

function db.addReportEvidence(id, label, image)
    return MySQL.prepare.await('INSERT INTO `mdt_reports_evidence` (`reportid`, `label`, `image`) VALUES (?, ?, ?)', { id, label, image })
end

function db.addReportCitizen(reportId, citizenId)
    return MySQL.prepare.await('INSERT INTO `mdt_reports_citizens` (`reportid`, `citizenid`) VALUES (?, ?)', { reportId, citizenId })
end

-- Vehicles
function db.selectVehicles()
    return framework.getVehicles()
end

function db.selectVehicle(plate)
    return framework.getVehicle(plate)
end

function db.updateVehicleInformation(plate, knownInformation)
    local query = [[
        INSERT INTO `mdt_vehicles` (`plate`, `image`, `notes`, `known_information`) 
        VALUES (?, NULL, NULL, ?) 
        ON DUPLICATE KEY UPDATE `known_information` = VALUES(`known_information`)
    ]]

    return MySQL.prepare.await(query, { plate, json.encode(knownInformation) })
end

function db.updateVehicleNotes(plate, notes)
    return MySQL.prepare.await('INSERT INTO `mdt_vehicles` (`plate`, `image`, `notes`, `known_information`) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE `notes` = ?', { plate, nil, notes, nil, notes })
end

function db.isVehicleBOLO(plate)
    local response = MySQL.rawExecute.await('SELECT * FROM `mdt_bolos` WHERE `plate` = ?', {
        plate
    })
    
    return response[1] and true or false
end

function db.getBOLOExpirationDate(plate)
    local response = MySQL.prepare.await('SELECT DATE_FORMAT(`expiresAt`, "%d-%m-%Y") FROM `mdt_bolos` WHERE plate = ?', { plate })
    return response
end

function db.updateVehicleImage(plate, imageURL)
    return MySQL.prepare.await('INSERT INTO `mdt_vehicles` (`plate`, `image`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `image` = ?', { plate, imageURL, imageURL })
end

function db.createBOLO(plate, expirationDate, reason)
    local boloExists = MySQL.prepare.await('SELECT COUNT(1) FROM `mdt_bolos` WHERE `plate` = ?', { plate }) > 0

    if boloExists then
        return MySQL.prepare.await('UPDATE `mdt_bolos` SET `reason` = ?, `expiresAt` = ? WHERE `plate` = ?', { reason, expirationDate, plate })
    end

    return MySQL.prepare.await('INSERT INTO `mdt_bolos` (`plate`, `reason`, `expiresAt`) VALUES (?, ?, ?)', { plate, reason, expirationDate })
end

function db.deleteBOLO(plate)
    return MySQL.prepare.await('DELETE FROM `mdt_bolos` WHERE `plate` = ?', { plate })
end

function db.removeOldBolos()
    return MySQL.prepare.await('DELETE FROM `mdt_bolos` WHERE `expiresAt` < (NOW() - INTERVAL 1 HOUR)')
end

function db.getBolos()
    return MySQL.rawExecute.await('SELECT `plate`, `reason`, DATE_FORMAT(`expiresAt`, "%d-%m-%Y") as expiresAt FROM `mdt_bolos`')
end

function db.getBolo(plate)
    return MySQL.prepare.await('SELECT `plate`, `reason`, DATE_FORMAT(`expiresAt`, "%d-%m-%Y") as expiresAt FROM `mdt_bolos` WHERE plate = ?', {
        plate
    })
end

-- Roster
function db.selectOfficerCallSign(callsign)
    return MySQL.prepare.await('SELECT `callsign` FROM `mdt_profiles` WHERE callsign = ?', { callsign })
end

function db.updateOfficerCallSign(citizenid, callsign)
    return MySQL.prepare.await('INSERT INTO `mdt_profiles` (`citizenid`, `image`, `notes`, `callSign`) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE `callsign` = ?', { citizenid, nil, nil, callsign, callsign })
end

-- Charges
function db.deleteCharge(label)
    return MySQL.prepare.await('DELETE FROM `mdt_offenses` WHERE `label` = ?', { label })
end

function db.createCharge(data)
    return MySQL.prepare.await('INSERT INTO `mdt_offenses` (`label`, `type`, `category`, `description`, `time`, `fine`, `points`) VALUES (?, ?, ?, ?, ?, ?, ?)', { 
        data.label, 
        data.type,
        data.category,
        data.description,
        data.time,
        data.fine,
        data.points
    })
end

function db.editCharge(label, fine, time, points)
    return MySQL.prepare.await('UPDATE `mdt_offenses` SET `time` = ?, `fine` = ?, `points` = ? WHERE `label` =  ?', { fine, time, points, label })
end

function db.setOfficerRoles(data)
    MySQL.prepare.await('UPDATE `mdt_profiles` SET `apu` = ?, `air` = ?, `mc` = ?, `k9` = ?, `fto` = ? WHERE `citizenid` = ?', 
    {
        data.roles.apu, 
        data.roles.air,
        data.roles.mc,
        data.roles.k9,
        data.roles.fto,
        data.citizenid
    })

    return true
end

return db