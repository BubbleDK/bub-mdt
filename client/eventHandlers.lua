local config = require 'config'
if config.isDispatchEnabled then
    local framework = require(('client.framework.%s'):format(config.framework))
    local timer = {}

    local function WaitTimer(name, action, ...)
        if not timer[name] then
            timer[name] = true
            action(...)
            Wait(config.defaultAlertsDelay * 1000)
            timer[name] = false
        end
    end

    local function isPedAWitness(witnesses, ped)
        for _, v in pairs(witnesses) do
            if v == ped then
                return true
            end
        end
        return false
    end

    AddEventHandler('CEventGunShot', function(witnesses, ped)
        if IsPedCurrentWeaponSilenced(cache.ped) then return end
            
        WaitTimer('Shooting', function()
            if cache.ped ~= ped then return end

            if framework.isJobPolice() then
                if not config.debug then
                    return
                end
            end

            if witnesses and not isPedAWitness(witnesses, ped) then return end

            if cache.vehicle then
                exports['bub-mdt']:VehicleShooting()
            else
                exports['bub-mdt']:Shooting()
            end
        end)
    end)

    AddEventHandler('CEventPedJackingMyVehicle', function(_, ped)
        WaitTimer('Autotheft', function()
            if cache.ped ~= ped then return end

            local vehicle = GetVehiclePedIsUsing(ped, true)
            exports['bub-mdt']:CarJacking(vehicle)
        end)
    end)

    AddEventHandler('CEventShockingCarAlarm', function(_, ped)
        WaitTimer('Autotheft', function()
            if cache.ped ~= ped then return end

            local vehicle = GetVehiclePedIsUsing(ped, true)
            exports['bub-mdt']:VehicleTheft(vehicle)
        end)
    end)

    AddEventHandler('gameEventTriggered', function(name, args)
        if name ~= 'CEventNetworkEntityDamage' then return end
        local victim = args[1]
        local isDead = args[6] == 1

        WaitTimer('PlayerDowned', function()
            if not victim or victim ~= cache.ped then return end
            if not isDead then return end

            if framework.isJobPolice() then
                exports['bub-mdt']:OfficerDown()
            end
        end)
    end)

    local SpeedingEvents = {
    'CEventShockingCarChase',
    'CEventShockingDrivingOnPavement',
    'CEventShockingBicycleOnPavement',
    'CEventShockingMadDriverBicycle',
    'CEventShockingMadDriverExtreme',
    'CEventShockingEngineRevved',
    'CEventShockingInDangerousVehicle'
    }

    local SpeedTrigger = 0
    for i = 1, #SpeedingEvents do
        local event = SpeedingEvents[i]
        AddEventHandler(event, function(_, ped)
            WaitTimer('Speeding', function()
                local currentTime = GetGameTimer()
                
                if currentTime - SpeedTrigger < 10000 then
                    return
                end

                if cache.ped ~= ped then return end

                if framework.isJobPolice() then
                    if not config.debug then
                        return
                    end
                end
                
                if GetEntitySpeed(cache.vehicle) * 3.6 < (80 + math.random(0, 20)) then return end

                if cache.ped ~= GetPedInVehicleSeat(cache.vehicle, -1) then return end

                exports['bub-mdt']:SpeedingVehicle()
                SpeedTrigger = GetGameTimer()
            end)
        end)
    end
end