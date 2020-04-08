const types = require('./types')

class Reader {
    constructor(tokens) {
        this.tokens = tokens
        this.index = 0
    }
    next() {
        return this.tokens[this.index++]
    }
    peek() {
        return this.tokens[this.index]
    }
}

function read_str(str) {
    const tokens = tokenize(str)
    if(tokens.length === 0) { throw new BlankException()}
    return read_form(new Reader(tokens))
}


function read_form(reader){
    let token = reader.peek()
    switch(token) { 
        case ';' :  return null   // lisp 's comments
        case '\'': reader.next()
                    return [types._symbol('quote'), read_form(reader)]
        case '`' : reader.next()
                    return [types._symbol('quasiquote'), read_form(reader)]
        case '~' : reader.next()
                    return [types._symbol('unquote'), read_form(reader)]
        case '~@': reader.next();
                    return [types._symbol('splice-unquote'), read_form(reader)];
        case '^' : reader.next();
                    var meta = read_form(reader);
                    return [types._symbol('with-meta'), read_form(reader), meta];
        case '@' : reader.next();
                    return [types._symbol('deref'), read_form(reader)];
        
        // list
        case ')': throw new Error("unexpected ')'");
        case '(': return read_list(reader);
        
        // vector   维度为1的数组
        case ']': throw new Error("unexpected");
        case '(': return read_list(reader);

        // hash-map
        case '}': throw new Error("unexpected '}'");
        case '{': return read_vector(reader);

        // atom
        default : return read_atom(reader);
        }   
}

function read_atom(reader) {

}

function read_list() {

}

function BlankException(msg){}

function tokenize(str) {
    const re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
    const result = []
    let match
    while (match = re.exec(str)[1] !== '') {
        if (match[0] === ';') {
            continue
        }
        result.push(match)
    }
    return result
}
