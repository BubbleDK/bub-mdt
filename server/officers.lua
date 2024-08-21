-- Credit to ox_mdt for this code. Check ox_mdt out here: (https://github.com/overextended/ox_mdt)
local activeOfficers = {}
local officersArray = {}

local function triggerOfficerEvent(eventName, eventData)
    for playerId in pairs(activeOfficers) do
        TriggerClientEvent(eventName, playerId, eventData)
    end
end

SetInterval(function()
    local n = 0

    for _, officer in pairs(activeOfficers) do
        local coords = GetEntityCoords(officer.ped)
        officer.position[1] = coords.y
        officer.position[2] = coords.x
        officer.position[3] = coords.z
        n += 1
        officersArray[n] = officer
    end

    triggerOfficerEvent('mdt:updateOfficerPositions', officersArray)
    table.wipe(officersArray)
end, math.max(500, 5000))

local function addOfficer(playerId, firstName, lastName, citizenid)
    activeOfficers[playerId] = {
        firstname = firstName,
        lastname = lastName,
        citizenid = citizenid,
        callsign = MySQL.prepare.await('SELECT `callSign` FROM `mdt_profiles` WHERE citizenid = ?', { citizenid }) or 99,
        playerId = playerId,
        ped = GetPlayerPed(playerId),
        position = {},
    }
end

local function removeOfficer(playerId)
    activeOfficers[playerId] = nil
end

local function getOfficer(playerId)
    return activeOfficers[playerId]
end

local function getAll() return activeOfficers end

return {
    add = addOfficer,
    remove = removeOfficer,
    get = getOfficer,
    getAll = getAll,
    triggerEvent = triggerOfficerEvent
}