import types from 'config/types';
import voidElementNames from 'config/voidElementNames';
import filterAttributes from 'parse/Parser/getElement/utils/filterAttributes';
import processDirective from 'parse/Parser/getElement/utils/processDirective';
import getAttributeStubs from 'parse/Parser/getElement/utils/getAttributeStubs';
import siblingsByTagName from 'parse/Parser/getElement/utils/siblingsByTagName';

var leadingWhitespace = /^\s+/,
    trailingWhitespace = /\s+$/,
    onPattern = /^on[a-zA-Z]/;

export default function ( token, preserveWhitespace ) {
    var stub, lowerCaseTag, filtered, attrs, proxies, siblings, fragment, nextToken, item;

    // Not a tag?
    if ( token.type !== types.TAG ) {
        return null;
    }

    // Sanitize
    if ( this.options.sanitize && this.options.sanitize.elements ) {
        if ( this.options.sanitize.elements.indexOf( token.name.toLowerCase() ) !== -1 ) {
            return null;
        }
    }

    this.pos += 1;

    stub = {
        t: types.ELEMENT,
        e: token.name
    };

    lowerCaseTag = stub.e.toLowerCase();

    // if this is a <pre>/<style>/<script> element, preserve whitespace within
    preserveWhitespace = ( preserveWhitespace || lowerCaseTag === 'pre' || lowerCaseTag === 'style' || lowerCaseTag === 'script' );

    if ( token.attrs ) {
        filtered = filterAttributes( token.attrs );

        attrs = filtered.attrs;
        proxies = filtered.proxies;

        // remove event attributes (e.g. onclick='doSomething()') if we're sanitizing
        if ( this.options.sanitize && this.options.sanitize.eventAttributes ) {
            attrs = attrs.filter( sanitize );
        }

        if ( attrs.length ) {
            stub.a = getAttributeStubs( attrs );
        }

        // Process directives (proxy events, transitions, and decorators)
        if ( proxies.length ) {
            stub.v = {};

            proxies.map( processDirective ).forEach( function ( directive ) {
                stub.v[ directive.type ] = directive.value;
            });
        }

        if ( filtered.intro ) {
            stub.t1 = processDirective( filtered.intro ).value;
        }

        if ( filtered.outro ) {
            stub.t2 = processDirective( filtered.outro ).value;
        }

        if ( filtered.decorator ) {
            stub.o = processDirective( filtered.decorator ).value;
        }
    }

    if ( token.doctype ) {
        stub.y = 1;
    }

    // if self-closing or a void element, close
    if ( token.selfClosing || voidElementNames.indexOf( lowerCaseTag ) !== -1 ) {
        return stub;
    }

    siblings = siblingsByTagName[ lowerCaseTag ];
    fragment = [];

    nextToken = this.next();
    while ( nextToken ) {

        // section closing mustache should also close this element, e.g.
        // <ul>{{#items}}<li>{{content}}{{/items}}</ul>
        if ( nextToken.mustacheType === types.CLOSING ) {
            break;
        }

        if ( nextToken.type === types.TAG ) {

            // closing tag
            if ( nextToken.closing ) {
                // it's a closing tag, which means this element is closed...
                if ( nextToken.name.toLowerCase() === lowerCaseTag ) {
                    this.pos += 1;
                }

                break;
            }

            // sibling element, which closes this element implicitly
            else if ( siblings && ( siblings.indexOf( nextToken.name.toLowerCase() ) !== -1 ) ) {
                break;
            }

        }

        fragment.push( this.getItem( preserveWhitespace ) );

        nextToken = this.next();
    }

    if ( fragment.length ) {
        stub.f = fragment;
    }


    // if we're not preserving whitespace, we can eliminate inner leading and trailing whitespace
    // TODO tidy this up
    if ( !preserveWhitespace && stub.f ) {
        if ( typeof stub.f === 'string' ) {
            stub.f = stub.f.trim();
        }

        else {
            item = stub.f[0];
            if ( typeof item === 'string' ) {
                stub.f[0] = item.replace( leadingWhitespace, '' );
                if ( !stub.f[0] ) {
                    stub.f.shift();
                }
            }

            item = stub.f[ stub.f.length - 1 ];
            if ( typeof item === 'string' ) {
                stub.f[ stub.f.length - 1 ] = item.replace( trailingWhitespace, '' );
                if ( !stub.f[ stub.f.length - 1 ] ) {
                    stub.f.pop();
                }
            }
        }
    }

    return stub;
};

function sanitize ( attr ) {
    var valid = !onPattern.test( attr.name );
    return valid;
}
