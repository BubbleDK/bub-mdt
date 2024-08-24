RegisterNetEvent('mdt:addBlip', function(data)
    local street1, street2 = GetStreetNameAtCoord(data.blipCoords.x, data.blipCoords.y, data.blipCoords.z)
    local transG = 250
    local blip = AddBlipForCoord(data.blipCoords.x, data.blipCoords.y, data.blipCoords.z)
    local blip2 = AddBlipForCoord(data.blipCoords.x, data.blipCoords.y, data.blipCoords.z)
    
    SetBlipSprite(blip, 60)
    SetBlipSprite(blip2, 161)
    SetBlipColour(blip, 38)
    SetBlipColour(blip2, 38)
    SetBlipDisplay(blip, 4)
    SetBlipDisplay(blip2, 8)
    SetBlipAlpha(blip, transG)
    SetBlipAlpha(blip2, transG)
    SetBlipScale(blip, 0.8)
    SetBlipScale(blip2, 2.0)
    SetBlipAsShortRange(blip, false)
    SetBlipAsShortRange(blip2, false)
    PulseBlip(blip2)
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName(data.text)
    EndTextCommandSetBlipName(blip)
    while transG ~= 0 do
        Wait(180 * 4)
        transG = transG - 1
        SetBlipAlpha(blip, transG)
        SetBlipAlpha(blip2, transG)
        if transG == 0 then
            RemoveBlip(blip)
            return
        end
    end
end)