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

    'rule:any': (rule, input) => {
        if (!rule.children || rule.children.length === 0) return 0;
        
        // Return 1 if any child matches, 0 otherwise
        for (const child of rule.children) {
            if (evaluateRule(child, input) >= 1) {
                return 1;
            }
        }
        return 0;
    },

    'rule:regex': (rule, input) => {
        try {
            const regex = new RegExp(rule.pattern);
            return regex.test(input) ? 1 : 0;
        } catch (e) {
            console.warn(`Invalid regex pattern: ${rule.pattern}`);
            return 0;
        }
    },

    'rule:string-similarity': (rule, input) => {
        const target = rule.to;
        const ignore = rule.ignoreCharacter || null;
        
        // Direct similarity
        let score = stringSimilarity(input, target, ignore);
        
        // If mirror is enabled, also check mirrored version
        if (rule.mirror) {
            const mirrored = mirrorString(target);
            const mirrorScore = stringSimilarity(input, mirrored, ignore);
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
 * 
 * ignoreCharacter: positions in the target pattern marked with this character
 * are spacers that don't count toward the comparison. Only the non-ignored
 * positions are compared.
 * 
 * Example: pattern `> <` with ignoreCharacter ` `:
 *   - Significant chars: `>` at pos 0, `<` at pos 2
 *   - Input `>_<`: pos 0 matches, pos 2 matches → 100%
 *   - Input `>.<`: pos 0 matches, pos 2 matches → 100%
 *   - Input `<_<`: pos 0 doesn't match, pos 2 matches → 50%
 */
function stringSimilarity(input, target, ignoreCharacter) {
    if (input === target) return 1;
    if (input.length === 0 || target.length === 0) return 0;
    
    // If we have an ignoreCharacter, do position-based matching
    if (ignoreCharacter !== null) {
        // For patterns with ignoreCharacter, lengths should match
        if (input.length !== target.length) {
            // Fall back to Levenshtein for length mismatch
            const distance = levenshtein(input, target.replace(new RegExp(escapeRegex(ignoreCharacter), 'g'), ''));
            const maxLen = Math.max(input.length, target.length);
            return 1 - (distance / maxLen);
        }
        
        let matches = 0;
        let significant = 0;
        
        for (let i = 0; i < target.length; i++) {
            if (target[i] === ignoreCharacter) {
                // This position is a spacer, don't count it
                continue;
            }
            significant++;
            if (input[i] === target[i]) {
                matches++;
            }
        }
        
        // If all positions were ignored, it's a match
        if (significant === 0) return 1;
        
        return matches / significant;
    }
    
    // No ignoreCharacter: use Levenshtein-based similarity
    const distance = levenshtein(input, target);
    const maxLen = Math.max(input.length, target.length);
    return 1 - (distance / maxLen);
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
 * Checks if input matches a grammar's detection rules.
 * Returns confidence score between 0 and 1.
 */
function detect(grammar, input) {
    if (!grammar.detection) {
        // No detection rules: assume valid if it has any meaning score
        return null;
    }
    return evaluateRule(grammar.detection, input);
}

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

const SCORE_THRESHOLD = 0.5; // Only show meanings above this score

function formatScore(score) {
    const percentage = (score * 100).toFixed(1);
    const barLength = Math.round(score * 20);
    const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
    return `${bar} ${percentage}%`;
}

function formatDetection(isKaomoji) {
    if (isKaomoji === null) return '  (no detection rules)';
    return isKaomoji ? '  ✓ Valid kaomoji' : '  ✗ Not recognized as kaomoji';
}

function printAnalysis(grammar, input, detection, results) {
    console.log();
    console.log(`  ┌─ ${grammar.name} ─────────────────────────────`);
    console.log(`  │  Input: ${input}`);
    console.log(`  │  ${formatDetection(detection)}`);
    console.log('  ├────────────────────────────────────────');
    
    const sorted = Object.entries(results)
        .filter(([, score]) => score >= SCORE_THRESHOLD)
        .sort((a, b) => b[1] - a[1]);
    
    if (sorted.length === 0) {
        console.log('  │  No strong matches found.');
    } else {
        for (const [name, score] of sorted) {
            console.log(`  │  ${name.padEnd(16)} ${formatScore(score)}`);
        }
    }
    
    // Show top meanings below threshold if nothing matched
    if (sorted.length === 0) {
        const weak = Object.entries(results)
            .filter(([, score]) => score > 0 && score < SCORE_THRESHOLD)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
        
        if (weak.length > 0) {
            console.log('  │');
            console.log('  │  Weak matches:');
            for (const [name, score] of weak) {
                console.log(`  │  ${name.padEnd(16)} ${formatScore(score)}`);
            }
        }
    }
    
    console.log('  └────────────────────────────────────────');
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
    >_<         Frustration
    ;w;         Soft crying
    T_T         Intense crying
    OwO         Surprise / curiosity
    UwU         Affection
    ^_^         Contentment
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
                const detection = detect(grammar, trimmed);
                const results = analyze(grammar, trimmed);
                printAnalysis(grammar, trimmed, detection, results);
            }
            
            prompt();
        });
    };
    
    prompt();
}

main();
