local QBCore = exports['qb-core']:GetCoreObject()

local obj = nil
local firstTimeOpening = true

local function fetchActiveOfficers()
  lib.callback('bub-mdt:server:getActiveOfficers', false, function(officers)
    if officers then
      SendNUIMessage({ action = 'updateActiveOfficers', data = { activeOfficers = officers }})
    end
  end)
end

local function openMdt()
  if obj ~= nil then
    DeleteEntity(obj)
    obj = nil
  end

  local object = lib.requestModel(`prop_cs_tablet`)
  
  obj = CreateObject(object, GetEntityCoords(cache.ped), 1, 1, 1)
  AttachEntityToEntity(obj, cache.ped, GetPedBoneIndex(cache.ped, 28422), 0.0, 0.0, 0.03, 0.0, 0.0, 0.0, 1, 1, 0, 1, 0, 1)

      
  lib.requestAnimDict('amb@world_human_seat_wall_tablet@female@base')    
  TaskPlayAnim(cache.ped, "amb@world_human_seat_wall_tablet@female@base", "generic_radio_enter", 8.0, 2.0, -1, 50, 2.0, 0, 0, 0)

  SetNuiFocus(true, true)
  SendNUIMessage({
    action = 'setupMdt',
    data = {
      announcements = {},
      activeOfficers = {},
      recentActivity = {},
    }
  })
end

RegisterNetEvent('bub_mdt:client:openMDT', function()
  openMdt()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
  local player = QBCore.Functions.GetPlayerData()

  if player.job.name == 'police' then
    TriggerServerEvent('bub-mdt:server:removeActiveOfficer')
  end
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
  local player = QBCore.Functions.GetPlayerData()

  if player.job.name == 'police' then
    local uiLocales = {}
    local locales = lib.getLocales()

    for k, v in pairs(locales) do
      if k:find('^ui_') then
        uiLocales[k] = v
      end
    end

    local personalInformation = lib.callback.await('bub-mdt:server:getPersonalInformation', false)

    SendNUIMessage({ action = 'init', data = { locale = uiLocales, personalInformation = personalInformation }})
    TriggerServerEvent('bub-mdt:server:addActiveOfficer')
    Wait(500)
    fetchActiveOfficers()
  end
end)

RegisterCommand('restart', function()
  TriggerEvent('QBCore:Client:OnPlayerLoaded')

  if obj ~= nil then
    DeleteEntity(obj)
    obj = nil
  end
  SetNuiFocus(false, false)
end, false)

RegisterNUICallback('exit', function(_, cb)
	cb(1)
	SetNuiFocus(false, false)
end)