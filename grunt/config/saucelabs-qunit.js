module.exports = function ( grunt ) {
	return {
		all: {
			options: {
				testname: 'Ractive',
				build: process.env.TRAVIS_JOB_ID,
				urls: [ 'localhost:4000/tmp-build/test/tests/index.html' ],
				browsers: grunt.file.readJSON( 'saucelabs.json' )
			}
		}
	};
};