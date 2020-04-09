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
    constructor(){
        this.tokens = []
        this.token = []
        this.operator = ['+', '-', '/', '*']
        this.atom = []
        for(let i = 0;i <= 9; i++) {
            this.atom.push(i + '')
        }
    }

    // 读取字符流
    read (str){
        let i = 0
        this.state = this.start
        for(const c of str.split('')){
            this.state = this.state(c)
        }
        if(this.token.length) { this.tokens.push(this.token.join('')) }
    }

    // 控制状态
    start(char){
        console.log(char) 
        if(char === ' ') { return this.start }

        const operator = this.operator
        const atom = this.atom

        for(let i = 0, length = atom.length ; i < length; i++) {
            if(char === atom[i]) {
                this.token.push(char)
                return this.inNumber
            }
        }
        for(let i = 0, length = operator.length; i < length; i++) {
            if(char === operator[i]) {
                this.emmitToken('op', char)
                return this.start
            }
        }
    }

    inNumber(char) {
        console.log(this.token, char)
        const atom = this.atom
        const length = atom.length
        
        for(let i = 0; i < length; i++){
            if(char === atom[i]) {
                this.token.push(char)
                return this.inNumber
            }
        }

        const token = this.token.join('')
            
        this.emmitToken('number', token)
        this.token = []

        return this.start(char)

    }

    emmitToken(type, value){
        this.tokens.push([type, value])
    }
}

const reader = new Reader()
const str = '2113 + 1203'

reader.read(str)
console.log(
    reader.tokens
)