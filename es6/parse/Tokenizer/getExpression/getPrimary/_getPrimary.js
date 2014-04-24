import getLiteral from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/_getLiteral';
import getReference from 'parse/Tokenizer/getExpression/getPrimary/getReference';
import getBracketedExpression from 'parse/Tokenizer/getExpression/getPrimary/getBracketedExpression';

export default function ( tokenizer ) {
    return getLiteral( tokenizer )
        || getReference( tokenizer )
        || getBracketedExpression( tokenizer );
};
