const { read_str, Reader } = require('./reader')
const types = require('./types')
const Env = require('./repl_env').Env

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
        const a0 = ast[0], a1 = ast[1], a2 = ast[2], a3 = ast[3]
        switch(a0.value) {
        case "def!": 
            const res = EVAL(a2,env)
            return env.set(a1, res)
        case "let*":
            const let_env = new Env(env)
            for (var i=0; i < a1.length; i+=2) {
                let_env.set(a1[i], EVAL(a1[i+1], let_env));
            }
            return EVAL(a2, let_env);
        case "if":
            const cond = EVAL(a1, env)
            if( cond === null || cond === false) {
                return typeof a3 !== "undefined"
            }else {
                return EVAL(a2, env)
            }
        case "fn*":
            return function(){
                return EVAL(a2, new Env(env, a1, arguments))
            }
        case "do":
            const el = eval_ast(ast.slice(1), env)
            return el[el.length - 1]
        default: 
            const el = eval_ast(ast, env),
                fn = el[0]
                return fn(el.slice(1))
        }
    }

    function eval_ast(ast, env) {
        if (types._symbol_Q(ast)) {
           return env.get(ast)
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
const reply_env = new Env()

reply_env.set(types._symbol('+'), (a,b)=> a+b)
reply_env.set(types._symbol('-'), (a,b)=> a-b)
reply_env.set(types._symbol('*'), (a,b)=> a*b)
reply_env.set(types._symbol('/'), (a,b)=> a/b)

PRINT(
    EVAL(
        READ(list), 
        env
    )
)