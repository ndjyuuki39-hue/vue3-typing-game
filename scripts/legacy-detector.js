import { glob } from 'glob';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// レガシーパターン定義
const LEGACY_PATTERNS = [
  // Vue.js レガシーパターン
  { pattern: /export\s+default\s+\{[\s\S]*?methods:/, message: 'Vue Options API detected (methods)' },
  { pattern: /export\s+default\s+\{[\s\S]*?data\s*\(\s*\)/, message: 'Vue Options API detected (data function)' },
  { pattern: /Vue\.component/, message: 'Global Vue.component detected' },
  { pattern: /new Vue\(/, message: 'Vue constructor detected' },
  { pattern: /this\.\$emit/, message: 'Vue 2 style $emit detected' },
  { pattern: /this\.\$props/, message: 'Vue 2 style $props detected' },
  
  // TypeScript レガシーパターン
  { pattern: /:\s*any\b/, message: 'any type detected' },
  { pattern: /as\s+any\b/, message: 'any type assertion detected' },
  { pattern: /new\s+Function\s*\(/, message: 'Function constructor detected' },
  
  // JavaScript レガシーパターン  
  { pattern: /var\s+/, message: 'var declaration detected' },
  { pattern: /function\s+\w+\s*\(/, message: 'function declaration detected (use arrow functions)' },
  { pattern: /\.then\(.*\)\s*\.catch/, message: 'Promise chains detected (use async/await)' }
];

async function checkFiles() {
  const srcExists = existsSync(join(__dirname, '../src'));
  if (!srcExists) {
    console.log('✅ No src directory found - skipping legacy check');
    return;
  }

  const files = await glob('src/**/*.{ts,vue,js}', { cwd: join(__dirname, '..') });
  let hasLegacy = false;

  for (const file of files) {
    // Skip legacy-runtime-guard.ts itself as it's allowed to use advanced patterns
    if (file.includes('legacy-runtime-guard.ts')) {
      continue;
    }
    
    const fullPath = join(__dirname, '..', file);
    const content = readFileSync(fullPath, 'utf-8');
    
    for (const { pattern, message } of LEGACY_PATTERNS) {
      if (pattern.test(content)) {
        console.error(`❌ ${message} in ${file}`);
        hasLegacy = true;
      }
    }
  }

  if (hasLegacy) {
    console.error('🚫 Legacy code detected! Please modernize before proceeding.');
    process.exit(1);
  } else {
    console.log('✅ No legacy code detected! Code is modern and clean.');
  }
}

checkFiles().catch(console.error);