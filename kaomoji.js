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
            variants: ['>', '<', ';', 'T', 'u', 'U', 'o', 'O', '^', '=', "'", '*', '@', 'x', 'X', '-', 'n'],
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
            { $: 'rule:regex', pattern: '^[><;TuUoO^=\'*@xXn-][_\\.wWoO~ω▽︿ε3][><;TuUoO^=\'*@xXn-]$' },
            // With tears or modifiers
            { $: 'rule:regex', pattern: '^[\']*[><;TuUoO^=*@xXn-][_\\.wWoO~ω▽︿ε3][><;TuUoO^=*@xXn-][\']*$' },
        ],
    },

    meanings: {
        // ─────────────────────────────────────────────────────────────────
        // Frustration / Discomfort
        // ─────────────────────────────────────────────────────────────────
        frustration: {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', neutralCharacter: '_', to: '>_<' },
                { $: 'rule:string-similarity', neutralCharacter: '_', to: '>.<' },
                { $: 'rule:string-similarity', mirror: true, neutralCharacter: '_', to: '<_<' },
                { $: 'rule:string-similarity', mirror: true, neutralCharacter: '_', to: '>_>' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Crying / Sadness Spectrum
        // ─────────────────────────────────────────────────────────────────
        'soft-crying': {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: ';w;' },
                { $: 'rule:string-similarity', to: ';_;' },
                { $: 'rule:string-similarity', to: "';w;'" },
            ]
        },

        'intense-crying': {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: 'T_T' },
                { $: 'rule:string-similarity', to: 'T.T' },
                { $: 'rule:string-similarity', to: 'ToT' },
                { $: 'rule:string-similarity', to: "T'T" },
            ]
        },

        'resigned-sadness': {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: 'u_u' },
                { $: 'rule:string-similarity', to: 'u.u' },
                { $: 'rule:string-similarity', to: 'n_n' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Affection / Warmth
        // ─────────────────────────────────────────────────────────────────
        affection: {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: 'UwU' },
                { $: 'rule:string-similarity', to: 'uwu' },
                { $: 'rule:string-similarity', to: 'OwO' },
                { $: 'rule:string-similarity', to: 'owo' },
                { $: 'rule:string-similarity', to: '^w^' },
                { $: 'rule:string-similarity', to: '^_^' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Surprise / Curiosity
        // ─────────────────────────────────────────────────────────────────
        surprise: {
            $: 'rule:balance',
            children: [
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
        // ─────────────────────────────────────────────────────────────────
        excitement: {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: '>w<' },
                { $: 'rule:string-similarity', to: '^w^' },
                { $: 'rule:string-similarity', to: '^o^' },
                { $: 'rule:string-similarity', to: '*w*' },
                { $: 'rule:string-similarity', to: '>.<' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Contentment / Calm
        // ─────────────────────────────────────────────────────────────────
        contentment: {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: '^_^' },
                { $: 'rule:string-similarity', to: '=_=' },
                { $: 'rule:string-similarity', to: 'u_u' },
                { $: 'rule:string-similarity', to: '-_-' },
                { $: 'rule:string-similarity', to: '~_~' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Mischief / Playfulness
        // ─────────────────────────────────────────────────────────────────
        mischief: {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: ';>' },
                { $: 'rule:string-similarity', mirror: true, to: '<_<' },
                { $: 'rule:string-similarity', mirror: true, to: '>_>' },
                { $: 'rule:string-similarity', to: '^>;' },
            ]
        },

        // ─────────────────────────────────────────────────────────────────
        // Deadpan / Stoic
        // ─────────────────────────────────────────────────────────────────
        deadpan: {
            $: 'rule:balance',
            children: [
                { $: 'rule:string-similarity', to: '-_-' },
                { $: 'rule:string-similarity', to: '=_=' },
                { $: 'rule:string-similarity', to: '._.' },
            ]
        },
    }
};
