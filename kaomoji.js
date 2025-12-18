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
        },
    },
    meanings: {
        frustration: {
            $: 'rule:balance',
            children: [
                {
                    $: 'rule:string-similarity',
                    neutralCharacter: '_',
                    to: '>_<',
                },
                {
                    $: 'rule:string-similarity',
                    mirror: true,
                    neutralCharacter: '_',
                    to: '<_<',
                },
            ]
        },
    }
};
