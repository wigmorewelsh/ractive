module.exports = function ( grunt ) {

	'use strict';

	grunt.registerTask( 'saucelabs', [
		'build',
		'connect',
		'saucelabs-qunit'
	]);

};
