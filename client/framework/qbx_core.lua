local QBX = exports['qb-core']:GetCoreObject()
local qb = {}
local officer = {}

qb.loadedEvent = 'QBCore:Client:OnPlayerLoaded'
qb.logoutEvent = 'QBCore:Client:OnPlayerUnload'
qb.setGroupEvent = 'QBCore:Client:OnJobUpdate'

function qb.getOfficerData()
    local playerData = QBX.Functions.GetPlayerData()

    officer.citizenid = playerData.citizenid
    officer.firstname = playerData.charinfo.firstname
    officer.lastname = playerData.charinfo.lastname
    officer.role = playerData.job.grade.name

    return officer
end

function qb.notify(text, type)
    exports.qbx_core:Notify(text, type)
end

function qb.isJobPolice()
    return QBX.Functions.GetPlayerData().job.type == 'leo' and true or false
end

function qb.isOnDuty()
    return QBX.Functions.GetPlayerData().job.onduty and true or false
end

function qb.GetVehiclesByName()
    return exports.qbx_core:GetVehiclesByName()
end

function qb.getPlayerGender()
    return QBX.Functions.GetPlayerData().charinfo.gender == 1 and "Female" or "Male"
end

return qb
