import circular from 'circular';

var Parser, empty = {};

circular.push( function () {
    Parser = circular.Parser;
});

export default function getStringFragment ( tokens ) {
    var parser = new Parser( tokens, empty );
    return parser.result;
};
