import types from 'config/types';
import decodeCharacterReferences from 'parse/Parser/utils/decodeCharacterReferences';

var whitespace = /\s+/g;

export default function ( token, preserveWhitespace ) {
    var text;

    if ( token.type === types.TEXT ) {
        this.pos += 1;

        text = ( preserveWhitespace ? token.value : token.value.replace( whitespace, ' ' ) );
        return decodeCharacterReferences( text );
    }

    return null;
};
