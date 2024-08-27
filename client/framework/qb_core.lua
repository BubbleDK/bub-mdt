local QBCore = exports['qb-core']:GetCoreObject()
local qb = {}
local officer = {}

qb.loadedEvent = 'QBCore:Client:OnPlayerLoaded'
qb.logoutEvent = 'QBCore:Client:OnPlayerUnload'
qb.setGroupEvent = 'QBCore:Client:OnJobUpdate'

function qb.getOfficerData()
    local playerData = QBCore.Functions.GetPlayerData()

    officer.citizenid = playerData.citizenid
    officer.firstname = playerData.charinfo.firstname
    officer.lastname = playerData.charinfo.lastname
    officer.role = playerData.job.grade.name
    officer.grade = playerData.job.grade.level

    return officer
end

function qb.notify(text, type)
    QBCore.Functions.Notify(text, type)
end

function qb.isJobPolice()
    return QBCore.Functions.GetPlayerData().job.type == 'leo' and true or false
end

function qb.isOnDuty()
    return QBCore.Functions.GetPlayerData().job.onduty and true or false
end

function qb.GetVehiclesByName()
    return QBCore.Shared.Vehicles
end

function qb.getPlayerGender()
    return QBCore.Functions.GetPlayerData().charinfo.gender == 1 and "Female" or "Male"
end

return qb
