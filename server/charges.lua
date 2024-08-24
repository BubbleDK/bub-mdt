local utils = require 'server.utils'

local chargeCategories = {
	['OFFENSES AGAINST PERSONS'] = 'Offenses Against Persons',
	['OFFENSES INVOLVING THEFT'] = 'Offenses Involving Theft',
	['OFFENSES INVOLVING FRAUD'] = 'Offenses Involving Fraud',
	['OFFENSES INVOLVING DAMAGE TO PROPERTY'] = 'Offenses Involving Damage To Property',
	['OFFENSES AGAINST PUBLIC ADMINISTRATION'] = 'Offenses Against Public Administration',
	['OFFENSES AGAINST PUBLIC ORDER'] = 'Offenses Against Public Order',
	['OFFENSES AGAINST HEALTH AND MORALS'] = 'Offenses Agaisnt Health And Morals',
	['OFFENSES AGAINST PUBLIC SAFETY'] = 'Offenses Against Public Safety',
	['OFFENSES INVOLVING THE OPERATION OF A VEHICLE'] = 'Offenses Involving The Operation Of A Vehicle',
	['OFFENSES INVOLVING THE WELL-BEING OF WILDLIFE'] = 'Offenses Involving The Well-Being Of Wildlife',
}

local charges = {}

for category in pairs(chargeCategories) do
	charges[category] = {}
end

MySQL.ready(function()
	local dbCharges = MySQL.rawExecute.await('SELECT * FROM `mdt_offenses`')

	for i = 1, #dbCharges do
		local charge = dbCharges[i]
		charges[charge.category][#charges[charge.category]+1] = charge
	end
end)

utils.registerCallback('mdt:getAllCharges', function()
	return charges
end)