const { read_str, Reader } = require('./reader')
const types = require('./types')
const env = require('./repl_env').reply_env

function READ(str) {
    const AST = read_str(str)
    return AST
}

function EVAL(ast, env) {
    const result = _EVAL(ast, env)
    return (typeof result !== "undefined") ? result : null

    function _EVAL(ast, env) {
        if (ast.length === 0) return ast
        if (!types._list_Q(ast)) {
            return eval_ast(ast, env)
        }
        const el = eval_ast(ast, env),
            f = el[0]
        return f.apply(f, el.slice(1))
    }

    function eval_ast(ast, env) {
        if (types._symbol_Q(ast)) {
            if (ast in env) {
                return env[ast];
            } else { throw new Error("'" + ast.value + "' not found"); }
        } else if (types._list_Q(ast)) {
            return ast.map(function (a) { return EVAL(a, env); });
        } else if (types._vector_Q(ast)) {
            var v = ast.map(function (a) { return EVAL(a, env); });
            v.__isvector__ = true;
            return v;
        } else if (types._hash_map_Q(ast)) {
            var new_hm = {};
            for (k in ast) {
                new_hm[EVAL(k, env)] = EVAL(ast[k], env);
            }
            return new_hm;
        } else {
            return ast;
        }
    }
}

function PRINT(exp) {
    let result = exp
    console.info(result)
}

const lists = ``

PRINT(
    EVAL(
        READ(list), 
        env
    )
)