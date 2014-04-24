import types from 'config/types';
import getExpressionList from 'parse/Tokenizer/getExpression/shared/getExpressionList';

export default function ( tokenizer ) {
    var start, expressionList;

    start = tokenizer.pos;

    // allow whitespace before '['
    tokenizer.allowWhitespace();

    if ( !tokenizer.getStringMatch( '[' ) ) {
        tokenizer.pos = start;
        return null;
    }

    expressionList = getExpressionList( tokenizer );

    if ( !tokenizer.getStringMatch( ']' ) ) {
        tokenizer.pos = start;
        return null;
    }

    return {
        t: types.ARRAY_LITERAL,
        m: expressionList
    };
};
