local utils = {}

---@param event string
---@param cb fun(playerId: number, ...: any): any
---@param permission string | false | nil
function utils.registerCallback(event, cb, permission)
    lib.callback.register(event, function(source, ...)
        return cb(source, ...)
    end)
end

function utils.cleanTable(tab)
    local newTable = {}
    for _, value in ipairs(tab) do
        if value ~= nil then
            table.insert(newTable, value)
        end
    end
    return newTable
end

return utils