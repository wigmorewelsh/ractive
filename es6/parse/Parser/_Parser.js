import circular from 'circular';
import getText from 'parse/Parser/getText';
import getComment from 'parse/Parser/getComment';
import getMustache from 'parse/Parser/getMustache';
import getElement from 'parse/Parser/getElement/_getElement';

var Parser;

Parser = function ( tokens, options ) {
    var item, items;

    this.tokens = tokens || [];
    this.pos = 0;
    this.options = options;
    this.preserveWhitespace = options.preserveWhitespace;

    items = [];

    while ( item = this.getItem() ) {
        items.push( item );
    }

    this.result = items;
};

Parser.prototype = {
    getItem: function ( preserveWhitespace ) {
        var token = this.next();

        if ( !token ) {
            return null;
        }

        return this.getText( token, this.preserveWhitespace || preserveWhitespace ) ||
               this.getMustache( token ) ||
               this.getComment( token )  ||
               this.getElement( token );
    },

    getText: getText,
    getComment: getComment,
    getMustache: getMustache,
    getElement: getElement,

    next: function () {
        return this.tokens[ this.pos ];
    }
};

circular.Parser = Parser;
export default Parser;
