import types from 'config/types';
import getLogicalOr from 'parse/Tokenizer/getExpression/getLogicalOr';

// The conditional operator is the lowest precedence operator, so we start here
export default function ( tokenizer ) {
    var start, expression, ifTrue, ifFalse;

    expression = getLogicalOr( tokenizer );
    if ( !expression ) {
        return null;
    }

    start = tokenizer.pos;

    tokenizer.allowWhitespace();

    if ( !tokenizer.getStringMatch( '?' ) ) {
        tokenizer.pos = start;
        return expression;
    }

    tokenizer.allowWhitespace();

    ifTrue = tokenizer.getExpression();
    if ( !ifTrue ) {
        tokenizer.pos = start;
        return expression;
    }

    tokenizer.allowWhitespace();

    if ( !tokenizer.getStringMatch( ':' ) ) {
        tokenizer.pos = start;
        return expression;
    }

    tokenizer.allowWhitespace();

    ifFalse = tokenizer.getExpression();
    if ( !ifFalse ) {
        tokenizer.pos = start;
        return expression;
    }

    return {
        t: types.CONDITIONAL,
        o: [ expression, ifTrue, ifFalse ]
    };
};
