import getNumberLiteral from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getNumberLiteral';
import getBooleanLiteral from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getBooleanLiteral';
import getStringLiteral from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getStringLiteral/_getStringLiteral';
import getObjectLiteral from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getObjectLiteral/_getObjectLiteral';
import getArrayLiteral from 'parse/Tokenizer/getExpression/getPrimary/getLiteral/getArrayLiteral';

export default function ( tokenizer ) {
    var literal = getNumberLiteral( tokenizer )   ||
                  getBooleanLiteral( tokenizer )  ||
                  getStringLiteral( tokenizer )   ||
                  getObjectLiteral( tokenizer )   ||
                  getArrayLiteral( tokenizer );

    return literal;
};
