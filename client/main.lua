local framework = string.lower(Config.Framework)

if framework == 'qb' then
  local QBCore = exports['qb-core']:GetCoreObject()
else
  ESX = exports["es_extended"]:getSharedObject()
end

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

	-- local object = RequestModel(`prop_cs_tablet`)
	obj = CreateObject(`prop_cs_tablet`, GetEntityCoords(PlayerPedId()), 1, 1, 1)
	AttachEntityToEntity(obj, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), 28422), 0.0, 0.0, 0.03, 0.0, 0.0, 0.0, 1, 1, 0, 1, 0, 1)

	TaskPlayAnim(PlayerPedId(), "amb@code_human_in_bus_passenger_idles@female@tablet@idle_a", "idle_a", 2.0, 1.0, 2000, 16,0,false,false,false)

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

if framework == 'qb' then
  RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    local player = QBCore.Functions.GetPlayerData()

    if Config.Jobs[player.job.name] then
      TriggerServerEvent('bub-mdt:server:removeActiveOfficer')
    end
  end)

  RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    local player = QBCore.Functions.GetPlayerData()

    if Config.Jobs[player.job.name] then
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
else
  AddEventHandler("esx:onPlayerLogout", function()
    local player = ESX.GetPlayerData()
    if Config.Jobs[player.job.name] then
      TriggerServerEvent('bub-mdt:server:removeActiveOfficer')
    end
  end)
  AddEventHandler("esx:playerLoaded", function(playerData, isNew, skin)
    local player = playerData
    
    if Config.Jobs[player.job.name] then
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
end

RegisterCommand('restart', function()
  if framework == 'qb' then
    TriggerEvent('QBCore:Client:OnPlayerLoaded')
  end

  if obj ~= nil then
    DeleteEntity(obj)
    obj = nil
  end
  SetNuiFocus(false, false)
end, false)

RegisterNUICallback('exit', function(_, cb)
	cb(1)
	SetNuiFocus(false, false)
  DeleteEntity(obj)
  ClearPedTasks(PlayerPedId())
end)