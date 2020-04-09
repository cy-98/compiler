function _symbol(name) { return new Symbol(name) }
function _symbol_Q(obj) { return obj instanceof Symbol }

function _list() { return Array.prototype.slice.call(arguments,0) }
function _list_Q(obj) { return Array.isArray(obj) && !obj.__isvector__ }

function _vector() {
    var v = Array.prototype.slice.call(arguments, 0);
    v.__isvector__ = true;
    return v;
}
function _vector_Q(obj) { return Array.isArray(obj) && !!obj.__isvector__; }


function _hash_map() {
    if (arguments.length % 2 === 1) {
        throw new Error("Odd number of hash map arguments");
    }
    var args = [{}].concat(Array.prototype.slice.call(arguments, 0));
    return _assoc_BANG.apply(null, args);
}
function _hash_map_Q(hm) {
    return typeof hm === "object" &&
           !Array.isArray(hm) &&
           !(hm === null) &&
           !(hm instanceof Symbol) &&
           !(hm instanceof Atom);
}
function _assoc_BANG(hm) {
    if (arguments.length % 2 !== 1) {
        throw new Error("Odd number of assoc arguments");
    }
    for (var i=1; i<arguments.length; i+=2) {
        var ktoken = arguments[i],
            vtoken = arguments[i+1];
        if (typeof ktoken !== "string") {
            throw new Error("expected hash-map key string, got: " + (typeof ktoken));
        }
        hm[ktoken] = vtoken;
    }
    return hm;
}

function Atom(val) { this.val = val; }
function _atom(val) { return new Atom(val); }
function _atom_Q(atm) { return atm instanceof Atom; }

function _keyword(obj) {
    if(typeof obj === 'string' && obj[0] === '\u029e') {
        return obj
    } else {
        return "\u029e" + obj;
    }
}
function _keyword_Q(obj) {
    return typeof obj === 'string' && obj[0] === '\u029e';
}




exports._symbol = _symbol
exports._symbol_Q = _symbol_Q
exports._keyword = _keyword
exports._keyword_Q = _keyword_Q
exports._list = _list
exports._list_Q = _list_Q
exports._vector = _vector
exports._vector_Q = _vector_Q
exports._hash_map = _hash_map
exports._hash_map_Q = _hash_map_Q
exports._atom = _atom
exports._atom_Q = _atom_Q