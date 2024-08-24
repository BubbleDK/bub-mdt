local activeCalls = {}

local callId = 0
local units = require 'server.units'
local officers = require 'server.officers'
local utils = require 'server.utils'

function createCall(data)
    activeCalls[callId] = {
        id = callId,
        code = data.code,
        offense = data.offense,
        units = {},
        coords = {data.coords[2], data.coords[1]},
        blip = data.blip,
        isEmergency = data.isEmergency,
        time = os.time() * 1000,
        location = '',
        info = data.info
    }

    officers.triggerEvent('mdt:createCall', { id = callId, call = activeCalls[callId] })
    officers.triggerEvent('mdt:addBlip', { blipCoords = data.blipCoords, text = '(' .. data.code .. ') ' .. data.offense })
    callId += 1

    return callId - 1
end

exports('createCall', createCall)

function updateCallCoords(callId, coords)
    if not activeCalls[callId] then return end

    activeCalls[callId].coords = coords

    officers.triggerEvent('mdt:updateCallCoords', { id = callId, coords = coords })
end

exports('updateCallCoords', updateCallCoords)

local function removeExpiredCalls()
    local currentTime = os.time() * 1000
    local amountRemoved = 0
    for id, call in pairs(activeCalls) do
        if currentTime - call.time >= 1800000 then
            activeCalls[id] = nil
            amountRemoved += 1
        end
    end

    officers.triggerEvent('mdt:updateCalls', { calls = utils.cleanTable(activeCalls) })
end

function getActiveCalls()
    return activeCalls
end

utils.registerCallback('mdt:getCalls', function(source, data)
    return activeCalls
end)

utils.registerCallback('mdt:respondToCall', function(source, id)
    local playerUnitId = Player(source).state.mdtUnitId

    if not playerUnitId or activeCalls[id].units[playerUnitId] then
        TriggerClientEvent('mdt:client:notify', source, locale('already_responding_or_part_of_unit'), 'error')
        return false
    end

    activeCalls[id].units[playerUnitId] = units.getUnit(playerUnitId)

    officers.triggerEvent('mdt:editCallUnits', { id = id, units = activeCalls[id].units })
    TriggerClientEvent('mdt:client:notify', source, locale('responded_to_recent_call'), 'success')

    return true
end)

function detachFromCall(unitId, id)
    if not activeCalls[id].units[unitId] then return false end

    activeCalls[id].units[unitId] = nil

    officers.triggerEvent('mdt:editCallUnits', { id = id, units = activeCalls[id].units })

    return true
end

utils.registerCallback('mdt:detachFromCall', function(source, id)
    local playerUnitId = Player(source).state.mdtUnitId
    if not playerUnitId then return false end

    if not activeCalls[id].units[playerUnitId] then return false end

    activeCalls[id].units[playerUnitId] = nil

    officers.triggerEvent('mdt:editCallUnits', { id = id, units = activeCalls[id].units })

    return true
end)

utils.registerCallback('mdt:setCallUnits', function(source, data)
    activeCalls[data.id].units = {}
    for i = 1, #data.units do
        local unitId = data.units[i]
        activeCalls[data.id].units[unitId] = units.getUnit(tostring(unitId))
    end

    officers.triggerEvent('mdt:setCallUnits', { id = data.id, units = activeCalls[data.id].units })

    return true
end)

lib.cron.new('*/5 * * * *', function()
    removeExpiredCalls()
end)