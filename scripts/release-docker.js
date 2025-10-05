import { execSync } from 'child_process';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(await readFile(path.join(dir, '../package.json'), 'utf-8'));
const { version } = pkg;

const tags = [
  'brni05/quoteosch:latest',
  `brni05/quoteosch:${version}`
];

execSync('docker buildx create --use || true', { stdio: 'inherit' });

console.log('Building Docker image with tags: ', tags.join(', '));

execSync(
  `docker buildx build --platform linux/amd64,linux/arm64 ${tags.map(t => '-t ' + t).join(' ')} --push .`,
  { stdio: 'inherit' }
);

console.log('Multi-platform build & push done.');