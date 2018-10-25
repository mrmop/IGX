var concat = require('concat');
var compressor = require('node-minify');

var sources = [
	'../src/lib_socials.js',
	'../src/lib_gameservice.js',
	'../src/lib_xtralife.js',
	'../src/lib_crazygames.js',
	'../src/lib_ads.js',
	'../src/fbinstantx.js',
	'../src/fbinstantx_ext.js',
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
 
