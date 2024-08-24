--[[ FX Information ]]--
fx_version   'cerulean'
use_experimental_fxv2_oal 'yes'
lua54        'yes'
game         'gta5'

--[[ Resource Information ]]--
name         'bub-mdt'
version      '0.0.21'
license      'GPL-3.0-or-later'
author       'Bubble'

--[[ Manifest ]]--
ox_libs {
  'locale',
}

shared_scripts {
	'@ox_lib/init.lua',
}

client_scripts {
	'client/main.lua',
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
  'server/main.lua',
}

ui_page 'web/build/index.html'

files {
  'web/build/index.html',
  'web/build/**/*',
  'locales/*.json',
  'client/*.lua',
  'client/framework/*.lua',
  'config.lua'
}