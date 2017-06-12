const TOKEN_REGEX = /(\d+|d|[+\-])/
const WHITESPACE_REGEX = /^\s*$/

// EXPR = EXPR + EXPR
//      | EXPR - EXPR
//      | EXPR d EXPR
//      | number

function parseExpr (tokens) {
  for (const operator of ['+', '-', 'd']) {
    const index = tokens.indexOf(operator)
    if (index >= 0) {
      return [ operator,
        parseExpr(tokens.slice(0, index)),
        parseExpr(tokens.slice(index + 1)) ]
    }
  }

  if (tokens.length === 1 && tokens[0].match(/^\d+$/)) {
    return tokens[0]
  }
}

function eval (ast, log) {
  if (!ast) throw new Error('eval error: undefined arg')
  if (typeof ast === 'string') {
    return +ast
  }

  switch (ast[0]) {
    case '+':
      return eval(ast[1] || '0', log) + eval(ast[2], log)
    case '-':
      return eval(ast[1] || '0', log) - eval(ast[2], log)
    case 'd':
      return roll(eval(ast[1] || '1', log), eval(ast[2]), log)
    default:
      throw new Error('eval error: invalid operator')
  }
}

function roll (n, s, log) {
  let total = 0
  const stack = []
  if (n > 1000) {
    log[0] += ' [...]'
    return Math.floor(n * (s / 2 + 0.5))
  }
  for (let i = 0; i < n; ++i) {
    const res = Math.floor(Math.random() * s) + 1
    stack.push(res)
    total += res
  }
  let logList = ' [' + stack.join(',') + ']'
  if (logList.length > 1000) {
    logList = ' [...]'
  }
  log[0] += logList
  return total
}

function prettyPrint (tokens, i = 0) {
  if (i >= tokens.length) return ''
  const next = i + 1
  if (tokens[next] === 'd' && tokens[i].match(/\d/)) return tokens[i] + prettyPrint(tokens, next)
  if (tokens[i] === 'd') return 'd' + prettyPrint(tokens, next)
  return tokens[i] + ' ' + prettyPrint(tokens, next)
}

function parse (str) {
  if (str.length > 500) throw new Error('too long')

  const tokens = str
    .split(TOKEN_REGEX)
    .filter((e) => !e.match(WHITESPACE_REGEX))


  tokens.map((e) => {
    if (!e.match(TOKEN_REGEX)) throw new Error('syntax error')
  })

  if (tokens.length === 1) throw new Error('useless expr')

  const ast = parseExpr(tokens)
  const log = ['']
  const res = eval(ast, log)

  const singleRoll = (tokens[0] === 'd' || tokens[0] === '1')
  const diceView = (tokens.length <= 3 && singleRoll) ? ' ' : (log[0] + (log[0] ? ' -> ' : ' '))
  return prettyPrint(tokens) + '=' + diceView + res
}

module.exports = parse
