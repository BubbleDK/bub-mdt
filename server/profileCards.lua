local utils = require 'server.utils'
local config = require 'config'
local framework = require(('server.framework.%s'):format(config.framework))


-- Credit to ox_mdt for this code. Check ox_mdt out here: (https://github.com/overextended/ox_mdt)
local customProfileCards = {}

local function checkCardExists(newCard)
    for i = 1, #customProfileCards do
        local card = customProfileCards[i]

        if card.id == newCard.id then
            assert(false, ("Custom card with id `%s` already exists!"):format(card.id))
            return true
        end
    end

    return false
end

local function createProfileCard(data)
    local arrLength = #data
    if arrLength > 0 then
        for i = 1, arrLength do
            local newCard = data[i]
            if not checkCardExists(newCard) then
                customProfileCards[#customProfileCards+1] = newCard
            end
        end

        return
    end

    if not checkCardExists(data.id) then
        customProfileCards[#customProfileCards+1] = data
    end
end

exports('createProfileCard', createProfileCard)

local function getAll()
    return customProfileCards
end

createProfileCard({
    {
        id = 'licenses',
        title = 'Licenses',
        icon = 'certificate',
        getData = function(profile)
            local licenses = framework.getLicenses(profile.citizenid)
            local licenseLabels = {}

            for key, value in pairs(licenses) do
                if (value and key ~= 'id') then
                    if (key == 'driver') then
                        table.insert(licenseLabels, key .. ' (' .. framework.getDriverPoints(profile.citizenid) .. ' points)')
                    else
                        table.insert(licenseLabels, key)
                    end
                end
            end

            return licenseLabels
        end
    },
    {
        id = 'vehicles',
        title = 'Vehicles',
        icon = 'car',
        getData = function(profile)
            local vehicles = framework.getVehiclesForProfile({profile.citizenid})
            local vehicleLabels = {}
            for i = 1, #vehicles do
                vehicleLabels[#vehicleLabels+1] = vehicles[i].label .. ' (' ..vehicles[i].plate.. ')'
            end

            return vehicleLabels
        end,
    },
    {
        id = 'jobs',
        title = 'Jobs',
        icon = 'briefcase',
        getData = function(profile)
            local jobs = framework.getJobs({profile.citizenid})
            local jobLabels = {}

            for i = 1, #jobs do
                jobLabels[#jobLabels+1] = jobs[i].job .. ' (' ..jobs[i].gradeLabel.. ')'
            end

            return jobLabels
        end,
    },
    {
        id = 'properties',
        title = 'Properties',
        icon = 'building-skyscraper',
        getData = function(profile)
            local properties = framework.getProperties({profile.citizenid})
            local propertyLabels = {}

            for i = 1, #properties do
                propertyLabels[#propertyLabels+1] = properties[i].label .. ' (' ..properties[i].type.. ')'
            end

            return propertyLabels
        end,
    },
})

utils.registerCallback('mdt:getCustomProfileCards', function()
    return customProfileCards
end)

return {
    getAll = getAll,
    create = createProfileCard
}