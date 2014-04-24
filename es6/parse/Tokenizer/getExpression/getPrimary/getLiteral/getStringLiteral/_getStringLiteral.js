import types from 'config/types';
import getSingleQuotedString from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getStringLiteral/getSingleQuotedString';
import getDoubleQuotedString from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getStringLiteral/getDoubleQuotedString';

export default function ( tokenizer ) {
    var start, string;

    start = tokenizer.pos;

    if ( tokenizer.getStringMatch( '"' ) ) {
        string = getDoubleQuotedString( tokenizer );

        if ( !tokenizer.getStringMatch( '"' ) ) {
            tokenizer.pos = start;
            return null;
        }

        return {
            t: types.STRING_LITERAL,
            v: string
        };
    }

    if ( tokenizer.getStringMatch( "'" ) ) {
        string = getSingleQuotedString( tokenizer );

        if ( !tokenizer.getStringMatch( "'" ) ) {
            tokenizer.pos = start;
            return null;
        }

        return {
            t: types.STRING_LITERAL,
            v: string
        };
    }

    return null;
};
