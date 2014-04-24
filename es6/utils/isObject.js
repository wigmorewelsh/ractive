var toString = Object.prototype.toString;

export default function ( thing ) {
    return ( typeof thing === 'object' && toString.call( thing ) === '[object Object]' );
};
