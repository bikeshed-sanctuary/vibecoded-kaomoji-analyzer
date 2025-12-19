export default {
    $: 'grammar',
    name: "kaomoji",
    description: "A grammar for kaomoji",
    grammar: {
        standard: {
            $: 'sequence',
            items: [
                {
                    $: 'reference',
                    name: 'eye',
                    hint: 'left',
                },
                {
                    $: 'reference',
                    name: 'mouth',
                },
                {
                    $: 'reference',
                    name: 'eye',
                    hint: 'right',
                },
            ],
        },
        eye: {
            $: 'value',
            programmingType: 'string',
            conceptualType: 'rune',
            variants: ['>', '<', ';', 'T', 'u', 'U', 'o', 'O', '^', '=', "'", '*', '@', 'x', 'X', '-', 'n', '~'],
        },
        mouth: {
            $: 'value',
            programmingType: 'string',
            conceptualType: 'rune',
            variants: ['_', '.', 'w', 'W', 'o', 'O', '~', 'ω', '▽', '︿', 'ε', '3'],
        },
    },

    // Detection: rules to determine if input is likely a kaomoji
    detection: {
        $: 'rule:any',
        children: [
            // Standard 3-char patterns: eye + mouth + eye
            { $: 'rule:regex', pattern: '^[><;TuUoO^=\'*@xXn~-][_\\.wWoO~ω▽︿ε3][><;TuUoO^=\'*@xXn~-]$' },
            // With tears or modifiers
            { $: 'rule:regex', pattern: '^[\']*[><;TuUoO^=*@xXn~-][_\\.wWoO~ω▽︿ε3][><;TuUoO^=*@xXn~-][\']*$' },
        ],
    },

    meanings: {
        // ─────────────────────────────────────────────────────────────────
        // Frustration / Discomfort
        // Eyes: > < (squinting, bracing)
        // ─────────────────────────────────────────────────────────────────
        frustration: {
            $: 'rule:balance',
            children: [
                // Eye patterns (high weight - eyes are primary indicator)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '> <' } },
                { weight: 0.8, rule: { $: 'rule:string-similarity', mirror: true, ignoreCharacter: ' ', to: '< <' } },
                { weight: 0.8, rule: { $: 'rule:string-similarity', mirror: true, ignoreCharacter: ' ', to: '> >' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '>.<' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '>_<' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Crying / Sadness Spectrum
        // Eyes: ; (tears) — primary indicator
        // Mouth: w — secondary (trembling, but more associated with affection)
        // ─────────────────────────────────────────────────────────────────
        'soft-crying': {
            $: 'rule:balance',
            children: [
                // Eye pattern (high weight - crying eyes are primary)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '; ;' } },
                // Mouth pattern (low weight - w is more about affection)
                { weight: 0.3, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' w ' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: ';w;' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: ';_;' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: "';w;'" } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: "';_;'" } },
            ]
        },

        'intense-crying': {
            $: 'rule:balance',
            children: [
                // Eye pattern (T eyes = streaming tears)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'T T' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'T_T' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'T.T' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'ToT' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: "T'T" } },
            ]
        },

        'resigned-sadness': {
            $: 'rule:balance',
            children: [
                // Eye pattern (droopy u/n eyes)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'u u' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'n n' } },
                // Mouth pattern (low weight - _ is neutral)
                { weight: 0.3, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' _ ' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'u_u' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'u.u' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'n_n' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Affection / Warmth
        // Mouth: w (cat mouth, soft/cute) — PRIMARY indicator
        // Eyes: U (soft) — secondary
        // ─────────────────────────────────────────────────────────────────
        affection: {
            $: 'rule:balance',
            children: [
                // Mouth pattern (HIGH weight - w is the primary affection signal)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' w ' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' W ' } },
                // Eye pattern (medium weight - U eyes are soft but secondary)
                { weight: 0.7, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'U U' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'UwU' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'uwu' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '^w^' } },
                { weight: 0.6, rule: { $: 'rule:string-similarity', to: '^_^' } }, // less affectionate, more content
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'owo' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Surprise / Curiosity
        // Eyes: O o (wide open) — primary indicator
        // Mouth: o O (open mouth) — reinforces surprise
        // ─────────────────────────────────────────────────────────────────
        surprise: {
            $: 'rule:balance',
            children: [
                // Eye pattern (high weight - wide eyes are primary)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'O O' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'o o' } },
                // Mouth pattern (medium weight - open mouth reinforces)
                { weight: 0.6, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' o ' } },
                { weight: 0.6, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' O ' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'OwO' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'owo' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'OoO' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'o_o' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'O_O' } },
                { weight: 0.8, rule: { $: 'rule:string-similarity', to: 'o.o' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Excitement / Joy
        // Eyes: ^ (happy squint), * (sparkling) — primary
        // Mouth: w, o — secondary
        // ─────────────────────────────────────────────────────────────────
        excitement: {
            $: 'rule:balance',
            children: [
                // Eye pattern (high weight - happy eyes are primary)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '^ ^' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '* *' } },
                // Mouth pattern (lower weight - shared with other meanings)
                { weight: 0.4, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' w ' } },
                { weight: 0.5, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' o ' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '>w<' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '^w^' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '^o^' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '*w*' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '*o*' } },
                { weight: 0.8, rule: { $: 'rule:string-similarity', to: '>.<' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Contentment / Calm
        // Eyes: ^ (relaxed), = - (closed) — primary
        // Mouth: _ (neutral/relaxed) — reinforces calm
        // ─────────────────────────────────────────────────────────────────
        contentment: {
            $: 'rule:balance',
            children: [
                // Eye patterns (high weight - relaxed eyes are primary)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '^ ^' } },
                { weight: 0.8, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '= =' } },
                { weight: 0.7, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '- -' } },
                // Mouth pattern (high weight - _ is the quintessential content mouth)
                { weight: 0.9, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' _ ' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '^_^' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '=_=' } },
                { weight: 0.9, rule: { $: 'rule:string-similarity', to: '-_-' } },
                { weight: 0.8, rule: { $: 'rule:string-similarity', to: '~_~' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Mischief / Playfulness  
        // Eyes: asymmetric or sideways glance — primary
        // ─────────────────────────────────────────────────────────────────
        mischief: {
            $: 'rule:balance',
            children: [
                // Sideways glance patterns (primary indicator)
                { weight: 1.0, rule: { $: 'rule:string-similarity', mirror: true, ignoreCharacter: ' ', to: '< <' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', mirror: true, ignoreCharacter: ' ', to: '> >' } },
                // Specific combinations
                { weight: 0.8, rule: { $: 'rule:string-similarity', to: ';>' } },
                { weight: 0.8, rule: { $: 'rule:string-similarity', to: '<;' } },
                { weight: 0.7, rule: { $: 'rule:string-similarity', to: '>;<' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Deadpan / Stoic
        // Eyes: - = (flat, expressionless) — primary
        // Mouth: _ . (minimal) — reinforces
        // ─────────────────────────────────────────────────────────────────
        deadpan: {
            $: 'rule:balance',
            children: [
                // Eye patterns (high weight - flat eyes are primary)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '- -' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '= =' } },
                // Mouth pattern (medium weight - minimal mouth reinforces)
                { weight: 0.7, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' . ' } },
                { weight: 0.5, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' _ ' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '-_-' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '=_=' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '._.' } },
                { weight: 0.9, rule: { $: 'rule:string-similarity', to: '-.-' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Softness / Gentleness
        // Mouth: ~ (wavy, gentle) — primary
        // ─────────────────────────────────────────────────────────────────
        softness: {
            $: 'rule:balance',
            children: [
                // Mouth pattern (primary indicator)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' ~ ' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '~_~' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '^~^' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'u~u' } },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Distress / Overwhelmed
        // Eyes: x X (crossed out, can't cope) — primary
        // ─────────────────────────────────────────────────────────────────
        distress: {
            $: 'rule:balance',
            children: [
                // Eye pattern (primary indicator)
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'x x' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'X X' } },
                { weight: 0.9, rule: { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '@ @' } },
                // Specific combinations
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'x_x' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: 'X_X' } },
                { weight: 0.9, rule: { $: 'rule:string-similarity', to: 'x.x' } },
                { weight: 1.0, rule: { $: 'rule:string-similarity', to: '@_@' } },
            ]
        },
    }
};
