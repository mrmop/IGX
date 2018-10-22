var compressor = require('node-minify');

compressor.minify({
	compressor: "babel-minify",
	publicFolder: '../src/',
	input: [
		'lib_socials.js',
		'lib_gameservice.js',
		'lib_xtralife.js',
		'lib_ads.js',
		'fbinstantx.6.2.js',
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
 
