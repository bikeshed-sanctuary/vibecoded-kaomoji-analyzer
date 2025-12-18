# Grammar Specification Format

This document describes a data-driven grammar format for defining structured patterns with both syntactic rules and semantic interpretations.

## Design Philosophy

This format follows a rule-engine architecture where behavior is defined by the shape of data, not imperative code. A grammar specification captures:

1. **Structural Rules** — The `grammar` section defines the syntactic anatomy of valid patterns: what elements exist and how they compose.

2. **Semantic Rules** — The `meanings` section maps structural patterns to interpretations using composable rules.

This separation enables:

- Machine interpretation of pattern meaning
- Generation of valid patterns from intent
- Fuzzy matching and similarity scoring

---

## Root Structure

A grammar specification is a JavaScript object with the following shape:

```javascript
{
    $: 'grammar',
    name: "...",
    description: "...",
    grammar: { /* structural rules */ },
    detection: { /* rules for recognizing valid input */ },
    meanings: { /* semantic rules */ }
}
```

The `$` property declares the node type throughout the specification.

---

## Node Types

### `grammar`

Root container for a complete grammar specification.

| Property | Type | Description |
|----------|------|-------------|
| `$` | `'grammar'` | Node type identifier |
| `name` | `string` | Grammar name |
| `description` | `string` | Human-readable description |
| `grammar` | `object` | Structural rule definitions |
| `detection` | `object` | Optional. Rules for determining if input matches this grammar |
| `meanings` | `object` | Semantic rule definitions |

### `sequence`

Ordered composition of grammar elements.

```javascript
{
    $: 'sequence',
    items: [ /* references or values */ ]
}
```

| Property | Type | Description |
|----------|------|-------------|
| `$` | `'sequence'` | Node type identifier |
| `items` | `array` | Ordered list of child nodes |

### `reference`

Pointer to another grammar rule, with optional hints for context.

```javascript
{
    $: 'reference',
    name: 'ruleName',
    hint: 'contextual-hint'
}
```

| Property | Type | Description |
|----------|------|-------------|
| `$` | `'reference'` | Node type identifier |
| `name` | `string` | Name of the referenced rule |
| `hint` | `string` | Optional contextual hint (e.g., position) |

### `value`

Terminal node representing an actual value.

```javascript
{
    $: 'value',
    programmingType: 'string',
    conceptualType: 'rune',
    variants: ['a', 'b', 'c']
}
```

| Property | Type | Description |
|----------|------|-------------|
| `$` | `'value'` | Node type identifier |
| `programmingType` | `string` | The programming language type |
| `conceptualType` | `string` | The semantic/conceptual type |
| `variants` | `array` | Optional. List of valid values for this terminal |

---

## Rule Types

Rules in the `meanings` and `detection` sections use the `rule:` prefix to declare their type. All rules return a score between 0 and 1.

### `rule:balance`

Combines multiple child rules, returning the maximum score among them.

```javascript
{
    $: 'rule:balance',
    children: [ /* child rules */ ]
}
```

| Property | Type | Description |
|----------|------|-------------|
| `$` | `'rule:balance'` | Rule type identifier |
| `children` | `array` | Child rules to combine (returns max score) |

### `rule:any`

Returns 1 if any child rule returns a perfect match (score of 1), otherwise 0. Useful for detection rules.

```javascript
{
    $: 'rule:any',
    children: [ /* child rules */ ]
}
```

| Property | Type | Description |
|----------|------|-------------|
| `$` | `'rule:any'` | Rule type identifier |
| `children` | `array` | Child rules to test (returns 1 if any matches) |

### `rule:regex`

Matches input against a regular expression pattern. Returns 1 for match, 0 for no match.

```javascript
{
    $: 'rule:regex',
    pattern: '^[><][_\\.][><]$'
}
```

| Property | Type | Description |
|----------|------|-------------|
| `$` | `'rule:regex'` | Rule type identifier |
| `pattern` | `string` | Regular expression pattern |

### `rule:string-similarity`

Matches patterns using fuzzy string comparison. Returns a score based on Levenshtein distance.

```javascript
{
    $: 'rule:string-similarity',
    to: '>_<',
    neutralCharacter: '_',
    mirror: true
}
```

| Property | Type | Description |
|----------|------|-------------|
| `$` | `'rule:string-similarity'` | Rule type identifier |
| `to` | `string` | Target pattern to match against |
| `neutralCharacter` | `string` | Optional. Treated as wildcard in pattern matching |
| `mirror` | `boolean` | Optional. Also test horizontally mirrored pattern |

---

## Example

A grammar for kaomoji (Japanese emoticons):

```javascript
export default {
    $: 'grammar',
    name: "kaomoji",
    description: "A grammar for kaomoji",
    grammar: {
        standard: {
            $: 'sequence',
            items: [
                { $: 'reference', name: 'eye', hint: 'left' },
                { $: 'reference', name: 'mouth' },
                { $: 'reference', name: 'eye', hint: 'right' },
            ],
        },
        eye: {
            $: 'value',
            programmingType: 'string',
            conceptualType: 'rune',
            variants: ['>', '<', ';', 'T', 'u', 'U', 'o', 'O', '^'],
        },
        mouth: {
            $: 'value',
            programmingType: 'string',
            conceptualType: 'rune',
            variants: ['_', '.', 'w', 'W', 'o', 'O', '~'],
        },
    },
    detection: {
        $: 'rule:any',
        children: [
            { $: 'rule:regex', pattern: '^[><;TuUoO^][_\\.wWoO~][><;TuUoO^]$' },
        ],
    },
    meanings: {
        frustration: {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', neutralCharacter: '_', to: '>_<' },
                { $: 'rule:string-similarity', mirror: true, neutralCharacter: '_', to: '<_<' },
            ]
        },
        'soft-crying': {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: ';w;' },
                { $: 'rule:string-similarity', to: ';_;' },
            ]
        },
    }
};
```

This defines:
- **Structure**: A kaomoji is a sequence of `left eye` + `mouth` + `right eye`
- **Detection**: Input is valid if it matches the eye-mouth-eye pattern
- **Meanings**: "frustration" matches `>_<` variants; "soft-crying" matches `;w;` and `;_;`

