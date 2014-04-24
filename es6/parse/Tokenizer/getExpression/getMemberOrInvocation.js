import types from 'config/types';
import getPrimary from 'parse/Tokenizer/getExpression/getPrimary/_getPrimary';
import getExpressionList from 'parse/Tokenizer/getExpression/shared/getExpressionList';
import getRefinement from 'parse/Tokenizer/getExpression/shared/getRefinement';

export default function ( tokenizer ) {
    var current, expression, refinement, expressionList;

    expression = getPrimary( tokenizer );

    if ( !expression ) {
        return null;
    }

    while ( expression ) {
        current = tokenizer.pos;

        if ( refinement = getRefinement( tokenizer ) ) {
            expression = {
                t: types.MEMBER,
                x: expression,
                r: refinement
            };
        }

        else if ( tokenizer.getStringMatch( '(' ) ) {
            tokenizer.allowWhitespace();
            expressionList = getExpressionList( tokenizer );

            tokenizer.allowWhitespace();

            if ( !tokenizer.getStringMatch( ')' ) ) {
                tokenizer.pos = current;
                break;
            }

            expression = {
                t: types.INVOCATION,
                x: expression
            };

            if ( expressionList ) {
                expression.o = expressionList;
            }
        }

        else {
            break;
        }
    }

    return expression;
};
