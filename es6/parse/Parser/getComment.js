import types from 'config/types';

export default function ( token ) {
    if ( token.type === types.COMMENT ) {
        this.pos += 1;

        return {
            t: types.COMMENT,
            c: token.content
        };
    }

    return null;
};
