import types from 'config/types';

var mustacheTypes = {
    '#': types.SECTION,
    '^': types.INVERTED,
    '/': types.CLOSING,
    '>': types.PARTIAL,
    '!': types.COMMENT,
    '&': types.TRIPLE
};

export default function ( tokenizer ) {
    var type = mustacheTypes[ tokenizer.str.charAt( tokenizer.pos ) ];

    if ( !type ) {
        return null;
    }

    tokenizer.pos += 1;
    return type;
};
