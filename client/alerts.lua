local config = require 'config'
if config.isDispatchEnabled then
    local framework = require(('client.framework.%s'):format(config.framework))
    local utils = require 'client.utils'

    local function CustomAlert(data)
        local coords = data.coords
        local disptachInfo = {}

        for i = 1, #data.info do
            disptachInfo[#disptachInfo+1] = {
                label = data.info[i].label,
                icon = data.info[i].icon
            }
        end

        local dispatchData = {
            code = data.code or '10-80',
            offense = data.offense,
            coords = {
                coords.x,
                coords.y
            },
            info = disptachInfo,
            blip = data.blip or 162,
            isEmergency = data.isEmergency or false,
            blipCoords = coords,
        }

        TriggerServerEvent('mdt:server:CreateCall', dispatchData)
    end
    exports('CustomAlert', CustomAlert)

    local function VehicleTheft()
        local coords = GetEntityCoords(cache.ped)
        local closestVehicle = lib.getClosestVehicle(GetEntityCoords(cache.ped))

        local dispatchData = {
            code = '10-35',
            offense = "Vehicle Theft",
            coords = {
                coords.x,
                coords.y
            },
            info = {
                {
                    label = GetLabelText(GetDisplayNameFromVehicleModel(GetEntityModel(closestVehicle))),
                    icon = 'car',
                },
                {
                    label = GetVehicleNumberPlateText(closestVehicle),
                    icon = 'badge-tm',
                },
                {
                    label = utils.GetVehicleColor(closestVehicle),
                    icon = 'palette'
                }
            },
            blip = 67,
            isEmergency = false,
            blipCoords = coords,
        }

        TriggerServerEvent('mdt:server:CreateCall', dispatchData)
    end
    exports('VehicleTheft', VehicleTheft)

    local function Shooting()
        local coords = GetEntityCoords(cache.ped)

        local dispatchData = {
            code = '10-11',
            offense = "Shooting in progress",
            coords = {
                coords.x,
                coords.y
            },
            info = {
                {
                    label = utils.GetWeaponName(),
                    icon = 'gun',
                },
                {
                    label = framework.getPlayerGender(),
                    icon = 'gender-bigender',
                }
            },
            blip = 60,
            isEmergency = false,
            blipCoords = coords,
        }

        TriggerServerEvent('mdt:server:CreateCall', dispatchData)
    end
    exports('Shooting', Shooting)

    local function VehicleShooting()
        local coords = GetEntityCoords(cache.ped)

        local dispatchData = {
            code = '10-60',
            offense = "Shots Fired from Vehicle",
            coords = {
                coords.x,
                coords.y
            },
            info = {
                {
                    label = utils.GetWeaponName(),
                    icon = 'gun',
                },
                {
                    label = framework.getPlayerGender(),
                    icon = 'gender-bigender',
                },
                {
                    label = GetLabelText(GetDisplayNameFromVehicleModel(GetEntityModel(cache.vehicle))),
                    icon = 'car',
                },
                {
                    label = GetVehicleNumberPlateText(cache.vehicle),
                    icon = 'badge-tm',
                },
                {
                    label = utils.GetVehicleColor(cache.vehicle),
                    icon = 'palette'
                }
            },
            blip = 60,
            isEmergency = false,
            blipCoords = coords,
        }

        TriggerServerEvent('mdt:server:CreateCall', dispatchData)
    end
    exports('VehicleShooting', VehicleShooting)

    local function SpeedingVehicle()
        local coords = GetEntityCoords(cache.ped)

        local dispatchData = {
            code = '10-11',
            offense = "Reckless driving",
            coords = {
                coords.x,
                coords.y
            },
            info = {
                {
                    label = GetLabelText(GetDisplayNameFromVehicleModel(GetEntityModel(cache.vehicle))),
                    icon = 'car',
                },
                {
                    label = GetVehicleNumberPlateText(cache.vehicle),
                    icon = 'badge-tm',
                },
                {
                    label = utils.GetVehicleColor(cache.vehicle),
                    icon = 'palette'
                }
            },
            blip = 162,
            isEmergency = false,
            blipCoords = coords,
        }

        TriggerServerEvent('mdt:server:CreateCall', dispatchData)
    end
    exports('SpeedingVehicle', SpeedingVehicle)

    local function CarJacking(vehicle)
        local coords = GetEntityCoords(cache.ped)

        local dispatchData = {
            code = '10-35',
            offense = "Car Jacking",
            coords = {
                coords.x,
                coords.y
            },
            info = {
                {
                    label = GetLabelText(GetDisplayNameFromVehicleModel(GetEntityModel(vehicle))),
                    icon = 'car',
                },
                {
                    label = GetVehicleNumberPlateText(vehicle),
                    icon = 'badge-tm',
                },
                {
                    label = utils.GetVehicleColor(vehicle),
                    icon = 'palette'
                }
            },
            blip = 67,
            isEmergency = false,
            blipCoords = coords,
        }

        TriggerServerEvent('mdt:server:CreateCall', dispatchData)
    end
    exports('CarJacking', CarJacking)

    local function OfficerDown()
        local coords = GetEntityCoords(cache.ped)

        local dispatchData = {
            code = '10-99',
            offense = "Officer Down",
            coords = {
                coords.x,
                coords.y
            },
            info = {
                {
                    label = framework.getPlayerGender(),
                    icon = 'gender-bigender',
                },
            },
            blip = 310,
            isEmergency = true,
            blipCoords = coords,
        }

        TriggerServerEvent('mdt:server:CreateCall', dispatchData)
    end
    exports('OfficerDown', OfficerDown)
    RegisterNetEvent("mdt:client:officerdown", OfficerDown)
end