if not LoadResourceFile(lib.name, 'web/dist/index.html') then
	error('Unable to load UI. Please build the web folder')
end

do
	local success, msg = lib.checkDependency('oxmysql', '2.4.0')
	if not success then error(msg) end

	success, msg = lib.checkDependency('ox_lib', '3.0.0')
	if not success then error(msg) end
end

lib.locale()