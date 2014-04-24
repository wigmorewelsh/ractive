var fs = require( 'fs' ),
	path = require( 'path' ),
	recast = require( 'recast' ),
	glob = require( 'glob' ),
	mkdirp = require( 'mkdirp' ),

	queue;

glob( path.join( __dirname, '../src/**/*.js' ), function ( err, files ) {
	if ( err ) throw err;

	queue = files;
	next();
});

function next () {
	var file;

	file = queue.pop();

	if ( !file ) {
		done();
		return;
	}

	fs.readFile( file, function ( err, result ) {
		var source, ast, transformed, outputPath;

		if ( err ) throw err;

		source = result.toString();

		// ...then some magic happens...
		transformed = transform( source );

		outputPath = file.replace( '/src/', '/es6/' );
		mkdirp( path.join( outputPath, '..' ), function ( err ) {
			if ( err ) throw err;

			fs.writeFile( outputPath, transformed, function ( err ) {
				if ( err ) throw err;
				next();
			});
		});


	})
}

function transform ( source ) {
	var ast, defineCall, moduleFn, body, args, deps, importBlock, bodyString, transformed;

	ast = recast.parse( source );

	// program body should have a single node - the define() call
	if ( ast.program.body.length !== 1 ) {
		throw new Error( 'Wrong body length' );
	}

	defineCall = ast.program.body[0];

	if (defineCall.type !== 'ExpressionStatement' || defineCall.expression.type !== 'CallExpression' || defineCall.expression.callee.name !== 'define' ) {
		throw new Error( 'Wrong expression type' );
	}

	args = defineCall.expression.arguments;

	// simple define({...})
	if ( args[0].type === 'ObjectExpression' ) {
		return 'export default ' + source.replace( 'define(', '' ).replace( '})', '}' );
	}

	if ( args[0].type === 'ArrayExpression' ) {
		// we have some dependencies
		deps = args.shift().elements.map( function ( element ) {
			return { path: element.value };
		});
	}

	moduleFn = defineCall.expression.arguments[0];

	// get dependency names
	if ( moduleFn.params ) {
		moduleFn.params.forEach( function ( param, i ) {
			deps[i].name = param.name;
		});
	}

	importBlock = deps ? deps.map( function ( dep ) {
		return 'import ' + ( dep.name ? dep.name + ' from ' : '' ) + '\'' + dep.path + '\';'
	}).join( '\n' ) : '';

	body = moduleFn.body.body;

	ast.program.body = body;
	bodyString = recast.print( ast ).code;

	transformed = ( importBlock + '\n\n' + bodyString
		.replace( /^\t/gm, '' )
		.replace( "'use strict';\n", '' )
		.replace( /^return /gm, 'export default ' )
		.trim() ).split( '\n' );

	while ( /^\s*$/.test( transformed[0] ) ) {
		transformed.shift();
	}

	return transformed.join( '\n' ) + '\n';
}

function done () {
	console.log( 'done!' );
}
