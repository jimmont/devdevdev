module.exports = function(config) {
config.set({
	basePath: '',
	client: {
		clearContext: false
	},
	frameworks: [],
	//frameworks: ['mocha', 'chai'],
	// see https://github.com/karma-runner/karma/issues/3335
	files: [
		 {pattern: 'www/**/*.js', type: 'module'}
		//,{pattern: 'www/**/*.js', included: false}
	],
	exclude: [ ],
	// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	preprocessors: { },
	// test results reporter to use
	// possible values: 'dots', 'progress'
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	//reporters: ['progress'],
	reporters: ['progress', 'mocha'],
	plugins: [
		//'karma-htmlfile-reporter'
		,'karma-chrome-launcher'
		,'karma-mocha-reporter'
		//,'karma-mocha'
		//,'karma-chai'
	],
	port: 9876,
	colors: true,
	// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	logLevel: config.LOG_INFO,
	autoWatch: true,
	// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
	browsers: ['Chrome'],
	// Continuous Integration mode: if true, Karma captures browsers, runs the tests and exits
	singleRun: false,
	// Concurrency level: how many browser should be started simultaneous
	concurrency: Infinity
})
}
