class Env {
    constructor(outer, binds, exprs) {
        this.data = {}
        this.outer = outer || null

        if (bind && exprs) {
            for (let i = 0; i < binds.length; i++) {
                if (bind[i].value === '&') {
                    this.data[binds[i + 1].value] = Array.prototype.slice.call(exprs, i);
                    break
                } else {
                    this.data[binds[i].value] = exprs[i];
                }
            }
        }
    }
    find(key) {
        if (!key.constructor || key.constructor.name !== 'Symbol') {
            throw new Error("env.find key must be a symbol")
        }
        if (key.value in this.data) { return this; }
        else if (this.outer) {  return this.outer.find(key); }
        else { return null; }
    }
    set(key, value) {
        if (!key.constructor || key.constructor.name !== 'Symbol') {
            throw new Error("env.set key must be a symbol")
        }
        this.data[key.value] = value;
        return value;
    }
    get(key) {
        if (!key.constructor || key.constructor.name !== 'Symbol') {
            throw new Error("env.get key must be a symbol")
        }
        var env = this.find(key);
        if (!env) { throw new Error("'" + key.value + "' not found"); }
        return env.data[key.value];
    }
}

exports.Env = Env
