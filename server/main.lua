local utils = require 'server.utils'
local db = require 'server.db'
local officers = require 'server.officers'
local config = require 'config'
local framework = require(('server.framework.%s'):format(config.framework))

require 'server.commands'
require 'server.units'
require 'server.charges'
require 'server.calls'

utils.registerCallback('mdt:openMdt', function()
    local officerData = officers.get(source)

    if not officerData then return end
    
    local isAuthorised = officerData and true or false
    local callSign = officerData.callsign
    
    return isAuthorised, callSign
end)

utils.registerCallback('mdt:openDispatch', function()  
    return officers.get(source) and true or false
end)

utils.registerCallback('mdt:getAnnouncements', function(source, page)
    local announcements = db.selectAnnouncements()

    return {
        announcements = announcements
    }
end)

utils.registerCallback('mdt:createAnnouncement', function(source, data)
    local officer = officers.get(source)

    return officer and db.createAnnouncement(officer.citizenid, data.contents)
end)

utils.registerCallback('mdt:getRecentActivity', function(source)
    return db.getRecentActivity()
end)


utils.registerCallback('mdt:getAllProfiles', function(source, data)
    local profiles = db.selectAllProfiles()

    return {
        profiles = profiles
    }
end)

utils.registerCallback('mdt:getProfile', function(source, data)
    return db.selectCharacterProfile(data)
end)

utils.registerCallback('mdt:saveProfileNotes', function(source, data)
    return db.updateProfileNotes(data.citizenid, data.notes)
end)

utils.registerCallback('mdt:isProfileWanted', function(source, data)
    return db.isProfileWanted(data)
end)

utils.registerCallback('mdt:getActiveOfficers', function()
    return officers.getAll()
end)

utils.registerCallback('mdt:getWarrants', function()
    return db.getWarrants()
end)

utils.registerCallback('mdt:getIncidents', function(source, data)
    local incidents = db.selectIncidents()

    return {
        incidents = incidents
    }
end)

utils.registerCallback('mdt:createIncident', function(source, title)
    local officer = officers.get(source)

    return officer and db.createIncident(title, ('%s %s'):format(officer.firstname, officer.lastname), officer.citizenid)
end)

utils.registerCallback('mdt:deleteIncident', function(source, data)
    local officer = officers.get(source)

    return db.deleteIncident(data.id, officer.citizenid)
end)

utils.registerCallback('mdt:getIncident', function(source, incidentId)
    local response = db.selectIncidentById(incidentId)

    if response then
        response.officersInvolved = db.selectOfficersInvolved(incidentId)
        response.evidence = db.selectEvidence(incidentId)
        response.criminals = db.selectCriminalsInvolved(incidentId)
    end

    return response
end)

utils.registerCallback('mdt:saveIncidentContents', function(source, data)
    return db.updateIncidentContents(data.incidentId, data.contents)
end)

utils.registerCallback('mdt:addOfficer', function(source, data)
    return db.addOfficer(data.id, data.citizenid)
end)

utils.registerCallback('mdt:removeOfficer', function(source, data)
    return db.removeOfficer(data.id, data.citizenid)
end)

utils.registerCallback('mdt:addCriminal', function(source, data)
    return db.addCriminal(data.id, data.criminalId)
end)

utils.registerCallback('mdt:removeCriminal', function(source, data)
    return db.removeCriminal(data.id, data.criminalId)
end)

utils.registerCallback('mdt:getCriminalProfiles', function(source)
    return db.searchCharacters()
end)

utils.registerCallback('mdt:saveCriminal', function(source, data)
    local officer = officers.get(source)
    if data.criminal.issueWarrant then
        db.createWarrant(data.id, data.criminal.citizenid, data.criminal.warrantExpiry)
    else
        db.removeWarrant(data.id, data.criminal.citizenid)
    end

    return db.saveCriminal(data.id, data.criminal, officer.citizenid)
end)

utils.registerCallback('mdt:addEvidence', function(source, data)
    return db.addEvidence(data.id, data.evidence.label, data.evidence.image)
end)

utils.registerCallback('mdt:addEvidenceFromPictureTaking', function(source, data)
    return db.addEvidence(data.id, data.imageLabel, data.imageURL)
end)

utils.registerCallback('mdt:removeEvidence', function(source, data)
    return db.removeEvidence(data.id, data.label, data.image)
end)

utils.registerCallback('mdt:deleteCharge', function(source, data)
    return db.deleteCharge(data.label)
end)

utils.registerCallback('mdt:createCharge', function(source, data)
    return db.createCharge(data)
end)

utils.registerCallback('mdt:editCharge', function(source, data)
    return db.editCharge(data.chargelabel, data.fine, data.time, data.points)
end)

utils.registerCallback('mdt:getRecommendedWarrantExpiry', function(source, charges)
    local currentTime = os.time(os.date("!*t"))
    local baseWarrantDuration = 259200000 -- 72 hours
    local addonTime = 0

    for i = 1, #charges do
        local charge = charges[i]
        if charge.time ~= 0 then
            addonTime = addonTime + (charge.time * 60 * 60000 * charge.count)  -- 1 month of penalty time = 1 hour of warrant time
        end
    end

    return currentTime * 1000 + addonTime + baseWarrantDuration
end)

utils.registerCallback('mdt:getReports', function()
    local reports = db.selectReports()

    return reports
end)

utils.registerCallback('mdt:getReport', function(source, reportId)
    local response = db.selectReportById(reportId)

    if response then
        response.officersInvolved = db.selectOfficersInvolvedReport(reportId)
        response.evidence = db.selectEvidenceReport(reportId)
        response.citizensInvolved = db.selectCitizensInvolvedReport(reportId)
    end

    return response
end)

utils.registerCallback('mdt:removeReportOfficer', function(source, data)
    return db.removeReportOfficer(data.id, data.citizenid)
end)

utils.registerCallback('mdt:removeReportCitizen', function(source, data)
    return db.removeReportCitizen(data.id, data.citizenid)
end)

utils.registerCallback('mdt:saveReportContents', function(source, data)
    return db.updateReportContents(data.reportId, data.contents)
end)

utils.registerCallback('mdt:removeReportEvidence', function(source, data)
    return db.removeReportEvidence(data.id, data.label, data.image)
end)

utils.registerCallback('mdt:createReport', function(source, title)
    local officer = officers.get(source)

    return officer and db.createReport(title, ('%s %s'):format(officer.firstname, officer.lastname), officer.citizenid)
end)

utils.registerCallback('mdt:addReportOfficer', function(source, data)
    return db.addReportOfficer(data.id, data.citizenid)
end)

utils.registerCallback('mdt:addReportEvidenceFromPictureTaking', function(source, data)
    return db.addReportEvidence(data.id, data.imageLabel, data.imageURL)
end)

utils.registerCallback('mdt:addReportEvidence', function(source, data)
    return db.addReportEvidence(data.id, data.evidence.label, data.evidence.image)
end)

utils.registerCallback('mdt:addReportCitizen', function(source, data)
    return db.addReportCitizen(data.id, data.citizenid)
end)

utils.registerCallback('mdt:getAllVehicles', function(source, data)
    return db.selectVehicles()
end)

utils.registerCallback('mdt:getVehicle', function(source, data)
    return db.selectVehicle(data.plate)
end)

utils.registerCallback('mdt:saveVehicleInformation', function(source, data)
    return db.updateVehicleInformation(data.plate, data.knownInformation)
end)

utils.registerCallback('mdt:saveVehicleNotes', function(source, data)
    return db.updateVehicleNotes(data.plate, data.notes)
end)

utils.registerCallback('mdt:updateVehicleImage', function(source, data)
    return db.updateVehicleImage(data.plate, data.image)
end)

local function isVehicleBOLO(plate)
    return db.isVehicleBOLO(plate)
end exports('isVehicleBOLO', isVehicleBOLO)

utils.registerCallback('mdt:isVehicleBOLO', function(source, data)
    return isVehicleBOLO(data.plate)
end)

utils.registerCallback('mdt:getBOLOExpirationDate', function(source, data)
    return db.getBOLOExpirationDate(data.plate)
end)

utils.registerCallback('mdt:createBOLO', function(source, data)
    return db.createBOLO(data.plate, data.expirationDate, data.reason)
end)

utils.registerCallback('mdt:deleteBOLO', function(source, data)
    return db.deleteBOLO(data.plate)
end)

utils.registerCallback('mdt:getBolos', function(source, data)
    return db.getBolos()
end)

utils.registerCallback('mdt:getBolo', function(source, data)
    return db.getBolo(data.plate)
end)

utils.registerCallback('mdt:getOfficers', function(source, data)
    return db.getOfficers()
end)

utils.registerCallback('mdt:setOfficerCallSign', function(source, data)
    if db.selectOfficerCallSign(data.callsign) then return false end

    db.updateOfficerCallSign(data.citizenid, data.callsign)

    return true
end)

local function updateProfileImage(citizenId, image)
    return db.updateProfileImage(citizenId, image)
end exports('updateProfileImage', updateProfileImage)

utils.registerCallback('mdt:updateProfileImage', function(source, data)
    return db.updateProfileImage(data.citizenId, data.image)
end)

utils.registerCallback('mdt:setOfficerRoles', function(source, data)
    return db.setOfficerRoles(data)
end)

utils.registerCallback('mdt:hireOfficer', function(source, data)
    return framework.hireOfficer(data)
end)

utils.registerCallback('mdt:fireOfficer', function(source, data)
    return framework.fireOfficer(data)
end)

utils.registerCallback('mdt:setOfficerRank', function(source, data)
    return framework.setOfficerRank(data)
end)

utils.registerCallback('mdt:fetchRoster', function(source)
    return framework.fetchRoster()
end)

RegisterServerEvent("mdt:updateProfileImage", function(playerId, image)
    local player = exports.qbx_core:GetPlayer(playerId)

    db.updateProfileImage(player.PlayerData.citizenid, image)
end)

RegisterServerEvent("mdt:server:CreateCall", function(data)
    createCall(data)
end)

RegisterServerEvent("mdt:server:CreateMDTProfile", function(data)
    db.createMDTProfile(data)
end)

RegisterServerEvent("mdt:server:AddFingerprintToProfile", function(citizenid, fingerprint)
    db.addFingerprintToProfile(citizenid, fingerprint)
end)

if config.enableWraithPlateReader then
    RegisterServerEvent("wk:onPlateScanned", function(_, plate)
        db.isVehicleBOLO(plate)
    end)
end

AddEventHandler('onResourceStop', function(resource)
    if resource ~= cache.resource then return end

    for playerId, officer in pairs(officers.getAll()) do
        if officer.unitId then
            Player(playerId).state.mdtUnitId = nil
        end
    end
end)

lib.cron.new('0 */1 * * *', function()
    db.removeOldWarrants()
    db.removeOldBolos()
end)