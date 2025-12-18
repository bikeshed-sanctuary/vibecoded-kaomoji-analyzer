#!/usr/bin/env node

import * as readline from 'readline';
import kaomoji from './kaomoji.js';

// ============================================================================
// Rule Engine
// ============================================================================

/**
 * Evaluates a rule tree against an input string.
 * Returns a score between 0 and 1.
 */
function evaluateRule(rule, input) {
    const handler = ruleHandlers[rule.$];
    if (!handler) {
        console.warn(`Unknown rule type: ${rule.$}`);
        return 0;
    }
    return handler(rule, input);
}

const ruleHandlers = {
    'rule:balance': (rule, input) => {
        if (!rule.children || rule.children.length === 0) return 0;
        
        const scores = rule.children.map(child => evaluateRule(child, input));
        // Take the maximum score among children (best match wins)
        return Math.max(...scores);
    },

    'rule:string-similarity': (rule, input) => {
        const target = rule.to;
        const neutral = rule.neutralCharacter || '';
        
        // Direct similarity
        let score = stringSimilarity(input, target, neutral);
        
        // If mirror is enabled, also check mirrored version
        if (rule.mirror) {
            const mirrored = mirrorString(target);
            const mirrorScore = stringSimilarity(input, mirrored, neutral);
            score = Math.max(score, mirrorScore);
        }
        
        return score;
    },
};

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Computes similarity between two strings.
 * neutralCharacter is treated as a wildcard that matches any single character.
 */
function stringSimilarity(input, target, neutralCharacter) {
    // Normalize: remove spaces
    const a = input.replace(/\s/g, '');
    const b = target.replace(/\s/g, '');
    
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;
    
    // Check for pattern match with neutral character as wildcard
    if (neutralCharacter && a.length === b.length) {
        let matches = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] === b[i] || b[i] === neutralCharacter) {
                matches++;
            }
        }
        return matches / a.length;
    }
    
    // Levenshtein-based similarity
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return 1 - (distance / maxLen);
}

/**
 * Levenshtein distance between two strings.
 */
function levenshtein(a, b) {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

/**
 * Mirror a string horizontally (swap directional characters).
 */
function mirrorString(str) {
    const mirrorMap = {
        '<': '>',
        '>': '<',
        '(': ')',
        ')': '(',
        '[': ']',
        ']': '[',
        '{': '}',
        '}': '{',
        '/': '\\',
        '\\': '/',
    };
    
    return str
        .split('')
        .reverse()
        .map(c => mirrorMap[c] || c)
        .join('');
}

// ============================================================================
// Analyzer
// ============================================================================

/**
 * Analyzes an input against a grammar's meanings.
 * Returns an object mapping meaning names to confidence scores.
 */
function analyze(grammar, input) {
    const results = {};
    
    for (const [name, rule] of Object.entries(grammar.meanings || {})) {
        const score = evaluateRule(rule, input);
        results[name] = score;
    }
    
    return results;
}

// ============================================================================
// CLI Interface
// ============================================================================

function formatScore(score) {
    const percentage = (score * 100).toFixed(1);
    const barLength = Math.round(score * 20);
    const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
    return `${bar} ${percentage}%`;
}

function printAnalysis(input, results) {
    console.log();
    console.log(`  Input: ${input}`);
    console.log('  ─'.repeat(20));
    
    const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
    
    if (sorted.length === 0) {
        console.log('  No meanings defined in grammar.');
    } else {
        for (const [name, score] of sorted) {
            console.log(`  ${name.padEnd(15)} ${formatScore(score)}`);
        }
    }
    console.log();
}

function printHelp() {
    console.log(`
  Commands:
    <emoji>     Analyze the emoji
    :grammars   List loaded grammars
    :help       Show this help
    :quit       Exit

  Examples:
    >_<         Analyze frustration kaomoji
    ;w;         Analyze crying kaomoji
    OwO         Analyze surprised kaomoji
`);
}

function printGrammars(grammars) {
    console.log('\n  Loaded grammars:');
    for (const g of grammars) {
        console.log(`    • ${g.name}: ${g.description}`);
    }
    console.log();
}

async function main() {
    // Load grammars (extensible: add more here in the future)
    const grammars = [kaomoji];
    
    console.log(`
╔════════════════════════════════════════╗
║        Emoji Analyzer (POC)            ║
╠════════════════════════════════════════╣
║  Type an emoji to analyze it.          ║
║  Type :help for commands.              ║
╚════════════════════════════════════════╝
`);
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    const prompt = () => {
        rl.question('  > ', (input) => {
            const trimmed = input.trim();
            
            if (!trimmed) {
                prompt();
                return;
            }
            
            // Commands
            if (trimmed === ':quit' || trimmed === ':q') {
                console.log('\n  Goodbye! (´• ω •`)ノ\n');
                rl.close();
                return;
            }
            
            if (trimmed === ':help' || trimmed === ':h') {
                printHelp();
                prompt();
                return;
            }
            
            if (trimmed === ':grammars' || trimmed === ':g') {
                printGrammars(grammars);
                prompt();
                return;
            }
            
            // Analyze against all grammars
            for (const grammar of grammars) {
                const results = analyze(grammar, trimmed);
                printAnalysis(trimmed, results);
            }
            
            prompt();
        });
    };
    
    prompt();
}

main();

