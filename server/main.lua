local framework = string.lower(Config.Framework)

if framework == 'qb' then
  local QBCore = exports['qb-core']:GetCoreObject()
else
  ESX = exports["es_extended"]:getSharedObject()
end

local officersCache = {}
local activeOfficersCache = {}

local function findActiveOfficer(citizenid)
  for k, v in pairs(activeOfficersCache) do
    if v.citizenid == citizenid then
      return k
    end
  end

  return false
end

local function removeActiveOfficer(citizenid)
  local index = findActiveOfficer(citizenid)

  if index then
    table.remove(activeOfficersCache, index)

    return true
  end

  return false
end

lib.callback.register('bub-mdt:server:getActiveOfficers', function(source)
  return activeOfficersCache
end)

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

RegisterNetEvent('bub-mdt:server:removeActiveOfficer', function()
  local src = source
  local Player = nil
  if framework == 'qb' then
    Player = QBCore.Functions.GetPlayer(src)
  else
    Player = ESX.GetPlayerFromId(src)
  end

  if not Player then return end
  local CID = Player.PlayerData.citizenid

  removeActiveOfficer(CID)
end)

RegisterNetEvent('bub-mdt:server:addActiveOfficer', function()
  local src = source
  local Player = nil
  if framework == 'qb' then
    Player = QBCore.Functions.GetPlayer(src)
  else
    Player = ESX.GetPlayerFromId(src)
  end

  if not Player then return end
  local CID = Player.PlayerData.citizenid

  local result = MySQL.query.await('SELECT firstname, lastname, role, callsign, phone, image FROM mdt_officers WHERE citizenid = ?', { CID })

  if result then
    table.insert(activeOfficersCache, {
      citizenid = CID,
      firstname = result[1].firstname,
      lastname = result[1].lastname,
      role = result[1].role,
      callsign = result[1].callsign,
      phone = result[1].phone,
      image = result[1].image,
    })
  end
end)

lib.addCommand('mdt', {
  help = 'Open mdt',
  params = {},
  restricted = false
}, function(source, args)
  TriggerClientEvent('bub_mdt:client:openMDT', source)
end)