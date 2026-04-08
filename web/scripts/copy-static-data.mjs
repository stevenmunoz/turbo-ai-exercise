/**
 * Pre-build script: copies .context data into public/data/ so it's available as static files.
 * On CI (GitHub Actions), the data is already committed in public/data/.
 * Locally, this refreshes from .context/ to pick up the latest action log.
 */
import { cpSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const context = resolve(root, '..', '.context');
const dataDir = resolve(root, 'public', 'data');

// If .context/ doesn't exist (e.g. CI), check if data is already in public/
if (!existsSync(context)) {
  if (existsSync(resolve(dataDir, 'replay-log.md'))) {
    console.log('No .context/ found but public/data/ already has data. Skipping copy.');
  } else {
    console.warn('Warning: no .context/ directory and no public/data/. Replay data will be missing.');
  }
  process.exit(0);
}

mkdirSync(dataDir, { recursive: true });

// 1. Copy replay log
const logSrc = resolve(context, 'exercise-action-log.md');
if (existsSync(logSrc)) {
  copyFileSync(logSrc, resolve(dataDir, 'replay-log.md'));
  console.log('Copied replay log');
}

// 2. Copy design library
const libSrc = resolve(context, 'design-library.json');
if (existsSync(libSrc)) {
  copyFileSync(libSrc, resolve(dataDir, 'design-library.json'));
  console.log('Copied design library');
}

// 3. Copy attachments
const attachSrc = resolve(context, 'attachments');
const attachDest = resolve(dataDir, 'attachments');
if (existsSync(attachSrc)) {
  mkdirSync(attachDest, { recursive: true });
  cpSync(attachSrc, attachDest, { recursive: true });
  console.log('Copied attachments');
}

console.log('Static data copy complete.');
