import getStringLiteral from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getStringLiteral/_getStringLiteral';
import getNumberLiteral from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getNumberLiteral';
import getName from 'parse/Tokenizer/getExpression/shared/getName';

var identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

// http://mathiasbynens.be/notes/javascript-properties
// can be any name, string literal, or number literal
export default function ( tokenizer ) {
    var token;

    if ( token = getStringLiteral( tokenizer ) ) {
        return identifier.test( token.v ) ? token.v : '"' + token.v.replace( /"/g, '\\"' ) + '"';
    }

    if ( token = getNumberLiteral( tokenizer ) ) {
        return token.v;
    }

    if ( token = getName( tokenizer ) ) {
        return token;
    }
};
