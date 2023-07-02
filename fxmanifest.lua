--[[ FX Information ]]--
fx_version   'cerulean'
use_experimental_fxv2_oal 'yes'
lua54        'yes'
game         'gta5'

--[[ Resource Information ]]--
name         'bub-mdt'
version      '0.0.0'
license      'GPL-3.0-or-later'
author       'Bubble'
repository   'https://github.com/BubbleDK/bub-mdt'

--[[ Manifest ]]--
shared_scripts {
	'@ox_lib/init.lua',
	'config.lua',
}

client_scripts {
	'client/main.lua',
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
	'server/main.lua',
  'server/framework/*.lua',
}

ui_page 'web/dist/index.html'

files {
	'web/dist/index.html',
	'web/dist/**/*',
	'locales/*.json'
}

dependencies {
	'oxmysql',
	'ox_lib',
}