module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{css,ttf,png,svg,html,js,less,txt,yml,json,scss,woff2}'
	],
	swDest: 'build/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};