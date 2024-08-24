local config = require 'config'

camera = false
local cameraprop = nil

local FOV_MAX = 80.0
local FOV_MIN = 5.0 -- max zoom level (smaller fov is more zoom)
local ZOOM_SPEED = 10.0 -- camera zoom speed
local SPEED_LEFT_RIGHT = 8.0 -- speed by which the camera pans left-right
local SPEED_UP_DOWN = 8.0 -- speed by which the camera pans up-down

local fov = (FOV_MAX+FOV_MIN) * 0.5

local function hideHUDThisFrame()
    HideHelpTextThisFrame()
    HideHudAndRadarThisFrame()
    HideHudComponentThisFrame(1)
    HideHudComponentThisFrame(2)
    HideHudComponentThisFrame(3)
    HideHudComponentThisFrame(4)
    HideHudComponentThisFrame(6)
    HideHudComponentThisFrame(7)
    HideHudComponentThisFrame(8)
    HideHudComponentThisFrame(9)
    HideHudComponentThisFrame(13)
    HideHudComponentThisFrame(11)
    HideHudComponentThisFrame(12)
    HideHudComponentThisFrame(15)
    HideHudComponentThisFrame(18)
    HideHudComponentThisFrame(19)
end

local function checkInputRotation(cam, zoomvalue)
    local rightAxisX = GetDisabledControlNormal(0, 220)
    local rightAxisY = GetDisabledControlNormal(0, 221)
    local rotation = GetCamRot(cam, 2)
    if rightAxisX ~= 0.0 or rightAxisY ~= 0.0 then
        local new_z = rotation.z + rightAxisX * -1.0 * (SPEED_UP_DOWN) * (zoomvalue + 0.1)
        local new_x = math.max(math.min(20.0, rotation.x + rightAxisY * -1.0 * (SPEED_LEFT_RIGHT) * (zoomvalue + 0.1)), -89.5)
        SetCamRot(cam, new_x, 0.0, new_z, 2)
        -- Moves the entities body if they are not in a vehicle (else the whole vehicle will rotate as they look around)
        if not IsPedSittingInAnyVehicle(cache.ped) then
            SetEntityHeading(cache.ped, new_z)
        end
    end
end

local function handleZoom(cam)
    if not IsPedSittingInAnyVehicle(cache.ped) then
        if IsControlJustPressed(0,241) then
            fov = math.max(fov - ZOOM_SPEED, FOV_MIN)
        end
        if IsControlJustPressed(0,242) then
            fov = math.min(fov + ZOOM_SPEED, FOV_MAX)
        end
        local current_fov = GetCamFov(cam)
        if math.abs(fov-current_fov) < 0.1 then
            fov = current_fov
        end
        SetCamFov(cam, current_fov + (fov - current_fov)*0.05)
    else
        if IsControlJustPressed(0,17) then
            fov = math.max(fov - ZOOM_SPEED, FOV_MIN)
        end
        if IsControlJustPressed(0,16) then
            fov = math.min(fov + ZOOM_SPEED, FOV_MAX)
        end
        local current_fov = GetCamFov(cam)
        if math.abs(fov - current_fov) < 0.1 then
            fov = current_fov
        end
        SetCamFov(cam, current_fov + (fov - current_fov)*0.05)
    end
end

function CameraLoop(data)
    lib.requestAnimDict("amb@world_human_paparazzi@male@base")
    TaskPlayAnim(cache.ped, "amb@world_human_paparazzi@male@base", 'base', 6.0, 3.0, -1, 49, 1.0, false, false, false)

    local cameraModel = lib.requestModel(`prop_pap_camera_01`)

    if cameraModel then
        local coords = GetEntityCoords(cache.ped)

        cameraprop = CreateObject(cameraModel, coords.x, coords.y, coords.z + 0.2, true, true, true)
        AttachEntityToEntity(cameraprop, cache.ped, GetPedBoneIndex(cache.ped, 28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, true, 1, true)
    end

    CreateThread(function()
        Wait(500)

        SetTimecycleModifier("default")
        SetTimecycleModifierStrength(0.3)

        local cam = CreateCam("DEFAULT_SCRIPTED_FLY_CAMERA", true)
        AttachCamToEntity(cam, cache.ped, 0.0, 1.0, 0.8, true)
        SetCamRot(cam, 0.0, 0.0, GetEntityHeading(cache.ped), 2)
        SetCamFov(cam, fov)
        RenderScriptCams(true, false, 0, true, false)

        while camera and not IsEntityDead(cache.ped) do
            DisablePlayerFiring(cache.ped, true)
            if IsControlJustPressed(0, 177) then
                camera = false
                PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false)
                ClearPedTasks(cache.ped)
                DisablePlayerFiring(cache.ped, false)

                if cameraprop then
                    DeleteEntity(cameraprop)
                end
            elseif IsControlJustPressed(1, 176) then
                PlaySoundFrontend(-1, "Camera_Shoot", "Phone_Soundset_Franklin", false)
                exports['screenshot-basic']:requestScreenshotUpload('https://api.fivemanage.com/api/image?apiKey=' .. config.fivemanageAPIKey, 'image', function(imageData)
                    local resp = json.decode(imageData)
                    if resp then
                        camera = false

                        if cameraprop then
                            DeleteEntity(cameraprop)
                        end

                        ClearPedTasks(cache.ped)

                        local ImageData = {
                            id = data.id,
                            imageLabel = data.imageLabel,
                            imageURL = resp.url
                        }

                        if (data.type == 'report') then
                            lib.callback.await('mdt:addReportEvidenceFromPictureTaking', false, ImageData)
                            SendNUIMessage({
                                action = 'updateReportEvidence',
                                data = {
                                imageLabel = data.imageLabel,
                                imageURL = resp.url
                                }
                            })
                        else
                            lib.callback.await('mdt:addEvidenceFromPictureTaking', false, ImageData)
                            SendNUIMessage({
                                action = 'updateIncidentEvidence',
                                data = {
                                imageLabel = data.imageLabel,
                                imageURL = resp.url
                                }
                            })
                        end

                        if not IsEntityPlayingAnim(cache.ped, tabletAnimDict, 'base', 3) then
                            lib.requestAnimDict(tabletAnimDict)
                            TaskPlayAnim(cache.ped, tabletAnimDict, 'base', 6.0, 3.0, -1, 49, 1.0, false, false, false)
                        end
                    
                        if not tablet then
                            local tabletModel = lib.requestModel(`prop_cs_tablet`)
                        
                            if not tabletModel then return end
                        
                            local coords = GetEntityCoords(cache.ped)
                            tablet = CreateObject(tabletModel, coords.x, coords.y, coords.z, true, true, true)
                            AttachEntityToEntity(tablet, cache.ped, GetPedBoneIndex(cache.ped, 28422), 0.0, 0.0, 0.03, 0.0, 0.0, 0.0, true, true, false, true, 0, true)
                        end

                        SendNUIMessage({
                            action = 'setVisible',
                            data = {
                                visible = true,
                            }
                        })
                        SetNuiFocus(true, true)
                        isMdtOpen = true
                        DisablePlayerFiring(cache.ped, false)
                    end
                end)
            end

            local zoomvalue = (1.0 / (FOV_MAX - FOV_MIN)) * (fov - FOV_MIN)
            checkInputRotation(cam, zoomvalue)
            handleZoom(cam)
            hideHUDThisFrame()
            Wait(0)
        end

        DisablePlayerFiring(cache.ped, false)
        camera = false
        ClearTimecycleModifier()
        fov = (FOV_MAX + FOV_MIN) * 0.5
        RenderScriptCams(false, false, 0, true, false)
        DestroyCam(cam, false)
        SetNightvision(false)
        SetSeethrough(false)
    end)
end