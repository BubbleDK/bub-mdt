local officersCache = {}
local QBCore = exports['qb-core']:GetCoreObject()

lib.callback.register('bub-mdt:server:getOfficers', function(source)
  if officersCache then
      return officersCache
  end

  local result = MySQL.query.await('SELECT * FROM mdt_officers', {})
  officersCache = json.encode(result)

  return officersCache
end)

lib.callback.register('bub-mdt:server:getPersonalInformation', function(source)
  local src = source
  local Player = QBCore.Functions.GetPlayer(src)

  if not Player then return false end
  local CID = Player.PlayerData.citizenid

  local result = MySQL.query.await('SELECT firstname, lastname, role, callsign, phone, image FROM mdt_officers WHERE citizenid = ?', { CID })

  if result then
    return {
      citizenid = CID,
      firstname = result[1].firstname,
      lastname = result[1].lastname,
      role = result[1].role,
      callsign = result[1].callsign,
      phone = result[1].phone,
      image = result[1].image,
    } 
  end

  return nil
end)

lib.addCommand('mdt', {
  help = 'Open mdt',
  params = {},
  restricted = false
}, function(source, args)
  TriggerClientEvent('bub_mdt:client:openMDT', source)
end)