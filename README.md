# Skype Roller
> Skype bot that rolls dice

## Usage

This bot responds to patterns of the form `{EXPR}`, where `EXPR` is:

```
EXPR = EXPR + EXPR
     | EXPR - EXPR
     | EXPR d EXPR
     | <number>
```

The expression is evaluated in the D&D dice roll style, so `1d20+5` rolls
a 20-sided die and adds 5. `3d4` would roll 3 4-sided dice, and add the results.
The bot won't respond if `EXPR` is syntactically invalid.

## Deploy

Google how to deploy a skype bot
