local obj = nil
local firstTimeOpening = true

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

  if firstTimeOpening then
    print('first time opening')

    local uiLocales = {}
    local locales = lib.getLocales()

    for k, v in pairs(locales) do
      if k:find('^ui_') then
        uiLocales[k] = v
      end
    end

    local personalInformation = lib.callback.await('bub-mdt:server:getPersonalInformation', false)

    SendNUIMessage({
      action = 'init',
      data = {
        locale = uiLocales,
        personalInformation = personalInformation,
      }
    })

    firstTimeOpening = false
  end

  SetNuiFocus(true, true)
  SendNUIMessage({
    action = 'setupMdt',
    data = {
      announcements = {},
      officers = {},
      recentActivity = {},
    }
  })
end

RegisterNetEvent('bub_mdt:client:openMDT', function()
  openMdt()
end)

RegisterCommand('resetNUI', function()
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