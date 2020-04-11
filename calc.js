/* 
1.定义四则运算

TOKEN: 
    Number, Operator, Whitespace, LineTerminator(换行符)

文法
    expr: 
        <addExpr> |
        <mulExpr> |
        <addExpr> ± <mulExpr> |

    mulExpr:
        <Number> |
        <mulExpr> * <Number> |
        <mulExpr> / <Number> |
*/

/*
2. 词法分析  状态机
*/

class Reader {
    constructor() {
        this.tokens = []
        this.token = []
        this.operator = ['+', '-', '/', '*']
        this.atom = []
        for (let i = 0; i <= 9; i++) {
            this.atom.push(i + '')
        }
    }

    // 读取字符流
    read(str) {
        let i = 0
        this.state = this.start
        for (const c of str.split('')) {
            this.state = this.state(c)
        }
        if (this.token.length) {
            this.emmitToken(null, this.token.join(''))
        }

        // parse token 
        this.expression(this.tokens)
    }

    // 控制状态
    start(char) {
        if (char === ' ') {
            return this.start
        }

        const operator = this.operator
        const atom = this.atom

        for (let i = 0, length = atom.length; i < length; i++) {
            if (char === atom[i]) {
                this.token.push(char)
                return this.inNumber
            }
        }

        for (let i = 0, length = operator.length; i < length; i++) {
            if (char === operator[i]) {
                this.emmitToken(char, char)
                return this.start
            }
        }
    }

    inNumber(char) {
        const atom = this.atom
        const length = atom.length

        for (let i = 0; i < length; i++) {
            if (char === atom[i]) {
                this.token.push(char)
                return this.inNumber
            }
        }

        const token = this.token.join('')

        this.emmitToken('number', token)
        this.token = []

        return this.start(char)

    }

    emmitToken(type, value) {
        if (!type) {
            type = typeof - value === 'number' ? 'number' : 'op'
        }
        const token = {
            type,
            value
        }
        this.tokens.push(token)
    }

    // expr
    expression(source) {
        const MULTYPE = 'MultiplicativeExpression'
        const ADDTYPE = 'AdditiveExpression'
        const EXPRTYPE = "Expression"
        if (source[0].type === ADDTYPE && source[1] && source[1].type === 'EOF') {
            let node = {
                type: "Expression",
                children: [source.shift(), source.shift()]
            }
            source.unshift(node)
            return node
        }
        this.AdditiveExpression(source)
        return this.expression(source)
    }

    AdditiveExpression(source) {
        const MULTYPE = 'MultiplicativeExpression'
        const ADDTYPE = 'AdditiveExpression'

        if (source[0].type === MULTYPE) {
            let node = {
                type: ADDTYPE,
                children: [source[0]]
            }
            source[0] = node
            return this.AdditiveExpression(source)
        }
        if (source[0].type === ADDTYPE && source[1]) {
            if (source[1].type === '+') {
                let node = {
                    type: ADDTYPE,
                    operator: '+',
                    children: [source.shift(), source.shift(), this.MultiplicaltiveExpression(source)]
                }

                node.children.push(source.shift())
                node.children.push(source.shift())
                this.MultiplicaltiveExpression(source)
                node.children.push(source.shift())
                source.unshift(node)
                return this.AdditiveExpression(source)
            }
            if (source[1].type === '-') {
                let node = {
                    type: ADDTYPE,
                    operator: '-',
                    children: []
                }

                node.children.push(source.shift())
                node.children.push(source.shift())
                this.MultiplicaltiveExpression(source)
                node.children.push(source.shift())
                source.unshift(node)
                return this.AdditiveExpression(source)
            }
            if (source[0].type === ADDTYPE) {
                return source[0]
            }
        }
        this.MultiplicaltiveExpression(source)
        return this.AdditiveExpression(source)
    }

    MultiplicaltiveExpression(source) {
        const MULTYPE = 'MultiplicativeExpression'
        const ADDTYPE = 'AdditiveExpression'
        console.dir(source)
        if (source[0].type === 'number') {
            let node = {
                type: MULTYPE,
                children: [source[0]]
            }
            console.log(source)

            source[0] = node
            return this.MultiplicaltiveExpression(source)
        }
        if (source[0].type === MULTYPE && source[1] && source[1].type === '*') {
            let node = {
                type: MULTYPE,
                operator: "*",
                children: []
            }

            node.children.push(source.shift())
            node.children.push(source.shift())
            node.children.push(source.shift())
            source.unshift(node)
            return this.MultiplicaltiveExpression(source)
        }
        if (source[0].type === MULTYPE && source[1] && source[1].type === "/") {
            let node = {
                type: MULTYPE,
                operator: "/",
                children: []
            }

            node.children.push(source.shift())
            node.children.push(source.shift())
            node.children.push(source.shift())
            source.unshift(node)
            return this.MultiplicaltiveExpression(source)
        }
        if(source[0].type === MULTYPE) return source[0]

        return this.MultiplicaltiveExpression(source)
    }
}

const reader = new Reader()
const str = '2113 + 1203 * 2'

reader.read(str)