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
                // Eye patterns (any mouth)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '> <' },
                { $: 'rule:string-similarity', mirror: true, ignoreCharacter: ' ', to: '< <' },
                { $: 'rule:string-similarity', mirror: true, ignoreCharacter: ' ', to: '> >' },
                // Specific combinations
                { $: 'rule:string-similarity', to: '>.<' },
                { $: 'rule:string-similarity', to: '>_<' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Crying / Sadness Spectrum
        // Eyes: ; (tears), T (streaming tears)
        // ─────────────────────────────────────────────────────────────────
        'soft-crying': {
            $: 'rule:balance',
            children: [
                // Eye pattern (crying eyes, any mouth)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '; ;' },
                // Mouth pattern (trembling mouth, any eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' w ' },
                // Specific combinations
                { $: 'rule:string-similarity', to: ';w;' },
                { $: 'rule:string-similarity', to: ';_;' },
                { $: 'rule:string-similarity', to: "';w;'" },
                { $: 'rule:string-similarity', to: "';_;'" },
            ]
        },

        'intense-crying': {
            $: 'rule:balance',
            children: [
                // Eye pattern (T eyes = streaming tears)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'T T' },
                // Specific combinations
                { $: 'rule:string-similarity', to: 'T_T' },
                { $: 'rule:string-similarity', to: 'T.T' },
                { $: 'rule:string-similarity', to: 'ToT' },
                { $: 'rule:string-similarity', to: "T'T" },
            ]
        },

        'resigned-sadness': {
            $: 'rule:balance',
            children: [
                // Eye pattern (droopy u/n eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'u u' },
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'n n' },
                // Specific combinations
                { $: 'rule:string-similarity', to: 'u_u' },
                { $: 'rule:string-similarity', to: 'u.u' },
                { $: 'rule:string-similarity', to: 'n_n' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Affection / Warmth
        // Mouth: w (cat mouth, soft/cute)
        // ─────────────────────────────────────────────────────────────────
        affection: {
            $: 'rule:balance',
            children: [
                // Mouth pattern (w mouth = soft/cute, any eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' w ' },
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' W ' },
                // Eye pattern (soft U eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'U U' },
                // Specific combinations
                { $: 'rule:string-similarity', to: 'UwU' },
                { $: 'rule:string-similarity', to: 'uwu' },
                { $: 'rule:string-similarity', to: '^w^' },
                { $: 'rule:string-similarity', to: '^_^' },
                { $: 'rule:string-similarity', to: 'owo' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Surprise / Curiosity
        // Eyes: O o (wide open)
        // Mouth: o O (open mouth)
        // ─────────────────────────────────────────────────────────────────
        surprise: {
            $: 'rule:balance',
            children: [
                // Eye pattern (wide O/o eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'O O' },
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'o o' },
                // Mouth pattern (open o mouth)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' o ' },
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' O ' },
                // Specific combinations
                { $: 'rule:string-similarity', to: 'OwO' },
                { $: 'rule:string-similarity', to: 'owo' },
                { $: 'rule:string-similarity', to: 'OoO' },
                { $: 'rule:string-similarity', to: 'o_o' },
                { $: 'rule:string-similarity', to: 'O_O' },
                { $: 'rule:string-similarity', to: 'o.o' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Excitement / Joy
        // Eyes: ^ (happy squint), * (sparkling)
        // Mouth: w (energetic), o (exclaiming)
        // ─────────────────────────────────────────────────────────────────
        excitement: {
            $: 'rule:balance',
            children: [
                // Eye pattern (happy ^ eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '^ ^' },
                // Eye pattern (sparkling * eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '* *' },
                // Mouth pattern (energetic w)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' w ' },
                // Mouth pattern (exclaiming o)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' o ' },
                // Specific combinations
                { $: 'rule:string-similarity', to: '>w<' },
                { $: 'rule:string-similarity', to: '^w^' },
                { $: 'rule:string-similarity', to: '^o^' },
                { $: 'rule:string-similarity', to: '*w*' },
                { $: 'rule:string-similarity', to: '*o*' },
                { $: 'rule:string-similarity', to: '>.<' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Contentment / Calm
        // Eyes: ^ (relaxed), = - (closed)
        // Mouth: _ (neutral/relaxed)
        // ─────────────────────────────────────────────────────────────────
        contentment: {
            $: 'rule:balance',
            children: [
                // Eye patterns (relaxed/closed eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '^ ^' },
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '= =' },
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '- -' },
                // Mouth pattern (neutral _ mouth)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' _ ' },
                // Specific combinations
                { $: 'rule:string-similarity', to: '^_^' },
                { $: 'rule:string-similarity', to: '=_=' },
                { $: 'rule:string-similarity', to: '-_-' },
                { $: 'rule:string-similarity', to: '~_~' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Mischief / Playfulness  
        // Eyes: asymmetric or sideways glance
        // ─────────────────────────────────────────────────────────────────
        mischief: {
            $: 'rule:balance',
            children: [
                // Sideways glance patterns
                { $: 'rule:string-similarity', mirror: true, ignoreCharacter: ' ', to: '< <' },
                { $: 'rule:string-similarity', mirror: true, ignoreCharacter: ' ', to: '> >' },
                // Specific combinations
                { $: 'rule:string-similarity', to: ';>' },
                { $: 'rule:string-similarity', to: '<;' },
                { $: 'rule:string-similarity', to: '>;<' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Deadpan / Stoic
        // Eyes: - = (flat, expressionless)
        // Mouth: _ . (minimal)
        // ─────────────────────────────────────────────────────────────────
        deadpan: {
            $: 'rule:balance',
            children: [
                // Eye patterns (flat eyes)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '- -' },
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: '= =' },
                // Mouth pattern (minimal . mouth)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' . ' },
                // Specific combinations
                { $: 'rule:string-similarity', to: '-_-' },
                { $: 'rule:string-similarity', to: '=_=' },
                { $: 'rule:string-similarity', to: '._.' },
                { $: 'rule:string-similarity', to: '-.-' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Softness / Gentleness
        // Mouth: ~ (wavy, gentle)
        // ─────────────────────────────────────────────────────────────────
        softness: {
            $: 'rule:balance',
            children: [
                // Mouth pattern (~ = gentle/soft)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: ' ~ ' },
                // Specific combinations
                { $: 'rule:string-similarity', to: '~_~' },
                { $: 'rule:string-similarity', to: '^~^' },
                { $: 'rule:string-similarity', to: 'u~u' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Distress / Overwhelmed
        // Eyes: x X (crossed out, can't cope)
        // ─────────────────────────────────────────────────────────────────
        distress: {
            $: 'rule:balance',
            children: [
                // Eye pattern (x eyes = overwhelmed)
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'x x' },
                { $: 'rule:string-similarity', ignoreCharacter: ' ', to: 'X X' },
                // Specific combinations
                { $: 'rule:string-similarity', to: 'x_x' },
                { $: 'rule:string-similarity', to: 'X_X' },
                { $: 'rule:string-similarity', to: 'x.x' },
                { $: 'rule:string-similarity', to: '@_@' },
            ]
        },
    }
};
