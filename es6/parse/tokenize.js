import initOptions from 'config/initOptions';
import stripHtmlComments from 'parse/utils/stripHtmlComments';
import stripStandalones from 'parse/utils/stripStandalones';
import stripCommentTokens from 'parse/utils/stripCommentTokens';
import Tokenizer from 'parse/Tokenizer/_Tokenizer';

export default function ( template, options ) {
    var tokenizer, tokens;

    options = options || {};

    if ( options.stripComments !== false ) {
        template = stripHtmlComments( template );
    }

    // TODO handle delimiters differently
    tokenizer = new Tokenizer( template, {
        delimiters: options.delimiters || initOptions.defaults.delimiters,
        tripleDelimiters: options.tripleDelimiters || initOptions.defaults.tripleDelimiters,
        interpolate: {
            script: options.interpolateScripts !== false ? true : false,
            style: options.interpolateStyles !== false ? true : false
        }
    });

    // TODO and this...
    tokens = tokenizer.tokens;

    stripStandalones( tokens );
    stripCommentTokens( tokens );

    return tokens;
};
