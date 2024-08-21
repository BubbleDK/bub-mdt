local officers = require 'server.officers'

lib.addCommand('mdt', {
    help = 'Opens MDT'
}, function(source)
    TriggerClientEvent('mdt:OpenMDT', source)
end)

lib.addCommand('createOfficer', {
    help = 'Creates a new officer in the MDT',
    params = {
        { name = 'citizenid', type = 'string', help = 'The citizenid of the player' },
        { name = 'callsign', help = 'The callsign for the officer' },
    },
    restricted = 'group.admin',
}, function(source, args)
    TriggerEvent('mdt:server:CreateMDTProfile', { citizenid = args.citizenid, callsign = args.callsign })
end)

lib.addCommand('closeMDT', {
    help = 'Closes MDT'
}, function(source)
    local hasPerms = officers.get(source) and true or false
    if hasPerms then
        TriggerClientEvent('mdt:client:CloseMDT', source)
    end
end)

lib.addCommand('closeDispatch', {
    help = 'Closes Mini Dispatch'
}, function(source)
    local hasPerms = officers.get(source) and true or false
    if hasPerms then
        TriggerClientEvent('mdt:client:CloseMiniDispatch', source)
    end
end)