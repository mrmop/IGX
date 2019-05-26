var concat = require('concat');
var compressor = require('node-minify');

var sources = [
	'../src/fbinstantx.js',
	'../src/fbinstantx_ext.js',
	'../src/lib_utils.js',
	'../src/lib_socials.js',
	'../src/lib_gameservice.js',
	'../src/lib_userservice.js',
	'../src/lib_storageservice.js',
	'../src/lib_leaderboardsservice.js',
	'../src/lib_messagingservice.js',
	'../src/lib_referralservice.js',
	'../src/lib_shareservice.js',
	'../src/lib_chatservice.js',
	'../src/vendors/lib_generic.js',
	'../src/vendors/lib_xtralife.js',			// Exclude if not needed
	'../src/vendors/lib_kongregate.js',			// Exclude if not needed
	'../src/vendors/lib_crazygames.js',			// Exclude if not needed
	'../src/vendors/lib_gamedistribution.js',	// Exclude if not needed
	'../src/vendors/lib_adinplay.js',			// Exclude if not needed
	'../src/vendors/lib_googleanalytics.js',	// Exclude if not needed
	'../src/vendors/lib_paypal.js',				// Exclude if not needed
	'../src/vendors/lib_unity.js',				// Exclude if not needed
	'../src/lib_adsservice.js',
	'../src/lib_paymentsservice.js',
	'../src/lib_analyticsservice.js',
];

concat(sources, "../lib/igx_debug.js").then(function()
{
	compressor.minify({
		compressor: "babel-minify",
		input: [
			"../lib/igx_debug.js",
		],
		output: "../lib/igx_min.js",
		options: {
			//language: "ECMASCRIPT6",
			/*warnings: true,
			mangle: true,
			compress: true*/
		},
		callback: function (err, min)
		{
			console.log(err);
		}
	});
});
 
