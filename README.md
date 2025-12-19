# Kaomoji Analyzer ✧･ﾟ: *✧･ﾟ:*

A fuzzy rule-engine for understanding the emotional sentiment of text-based faces.

```
  > ^w^

  ┌─ kaomoji ─────────────────────────────
  │  Input: ^w^
  │    ✓ Valid kaomoji
  ├────────────────────────────────────────
  │  excitement       ████████████████████ 99.8%
  │  affection        ████████████████████ 98.5%
  │  contentment      ██████████████████░░ 88.1%
  └────────────────────────────────────────
```

## What is this?

This is an informal research project exploring how to formally describe the *grammar* and *semantics* of kaomoji - those ascii faces that look like `;w;`, `>_<`, and `OwO`.

Where 🙂 says "I am happy", the kaomoji `;w;` says "I feel sad, but I trust you with it."

We're building a **data-driven rule engine** that can:
- Detect if something is a kaomoji
  - But generalized! `kaomoji.js` is just one possible "emoji grammar"
- Analyze what emotions it expresses
- Score confidence using neural-network-inspired activation functions
- Anything else that is cool and seems like a natural fit for the repo

## Try it

```bash
node cli.js
```

Type a kaomoji and get a confidence score for various sentiments.

## The Vibe

This project exists at the intersection of:
- **Linguistics** — kaomoji have grammar (sequence: eyes, mouth, eyes)
- **Semiotics** — symbols carry meaning beyond their literal form  
- **Machine learning concepts** — weighted rules, activation functions, fuzzy matching
- **Just having fun** — it's kaomoji analysis, not rocket surgery

The goal is to **have fun while doing informal research**, hopefully creating unexpectedly interesting things along the way.

## Architecture

```
┌─────────────────┐
│  Grammar Spec   │  ← Data-driven rules (kaomoji.js)
│  (meanings,     │
│   detection)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Rule Engine    │  ← Evaluates rules against input (cli.js)
│  (sigmoid,      │
│   similarity)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Confidence     │  ← "How much does this feel like frustration?"
│  Scores         │
└─────────────────┘
```

See [grammar-format.md](./grammar-format.md) for the full specification.

## Send Your Vibe-Coding Here! ૮₍ ˃ ⤙ ˂ ₎ა

**Contributions are welcome and encouraged!**

This is a low-stakes, high-fun project. The code quality matters, but we're analyzing kaomoji, not launching satellites. If you have an idea - weird, experimental, half-baked - bring it.

### Ideas for contribution:

- **New meanings** — Add emotional categories we're missing (embarrassment? smugness? existential dread?)
- **New grammars** — Other emoji grammars (`:-)`, `XD`, unicode, etc)
- **Better rules** — Tune the weights, add new patterns, improve detection
- **Activation experiments** — Try different functions (softmax? tanh? something ***cursed***?)
- **Visualizations** — Plot the emotional space of kaomoji
- **Cursed features** — Generate kaomoji from emotions? Kaomoji autocomplete? `--cursed` flag?

### How to contribute:

1. Fork it
2. Do programming or ask AI to do programming for you ^_^
   - (understanding of code is encouraged, even if AI is used)
3. Open a PR with a fun description
4. We'll probably merge it if it's cool

No issue templates. ~~Just vibes~~ Mostly vibes.

## File Guide

| File | What it does |
|------|--------------|
| `cli.js` | Interactive CLI + rule engine implementation |
| `kaomoji.js` | Grammar specification for kaomoji |
| `kaomoji.md` | Reference doc on kaomoji meanings |
| `grammar-format.md` | Specification for the grammar format |
| `design.md` | High-level architecture notes |

## Rule Types

The engine supports these rule types:

- **`rule:balance`** — Weighted sum through sigmoid activation (neural-network style)
- **`rule:string-similarity`** — Fuzzy matching with Levenshtein distance
- **`rule:regex`** — Pattern matching
- **`rule:any`** — Boolean OR of child rules

## Example: How `;w;` is analyzed

```javascript
'soft-crying': {
    $: 'rule:balance',
    children: [
        // Crying eyes are the PRIMARY signal
        { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '; ;' } },
        
        // Trembling 'w' mouth is secondary (more about affection)
        { weight: 0.3, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' w ' } },
        
        // Exact matches
        { weight: 1.0, rule: { $: 'rule:string-similarity', to: ';w;' } },
    ]
}
```

The sigmoid activation combines these weighted signals:
- `;w;` → **100%** soft-crying (exact match + eye pattern)
- `^w^` → **~30%** soft-crying (only the `w` mouth matches, at low weight)

## License

> Do whatever you want with this. It's kaomoji analysis.

Also:
> Don't use... kaomoji analysis for evil?

(officially licensed under the MIT license)

---

*Made with `;w;` and `>w<` by humans and AI vibing together*

