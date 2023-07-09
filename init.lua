lib.locale()

local success, message = lib.checkDependency("ox_lib", "3.6.2")

if not success then
    return print(('^1Error: %s^0'):format(message))
end