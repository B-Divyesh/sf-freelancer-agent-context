import { readdir, readFile } from 'node:fs/promises';

const requiredFiles = [
  '.factory/brief.json',
  '.factory/plan.md',
  '.factory/design.md',
  '.factory/components.md',
  '.factory/claims.json',
  'src/styles/tokens.css',
];

const entries = await Promise.all(requiredFiles.map(async path => [path, await readFile(path, 'utf8')]));
const files = new Map(entries);
const claims = JSON.parse(files.get('.factory/claims.json'));
const testFiles = (await readdir('tests')).filter(path => /\.(?:spec|test)\.ts$/.test(path));
const testSource = (await Promise.all(testFiles.map(path => readFile(`tests/${path}`, 'utf8')))).join('\n');

if (!Array.isArray(claims) || claims.length === 0) throw new Error('M1 needs at least one claim.');

const ids = new Set();
for (const claim of claims) {
  for (const field of ['id', 'claim', 'where', 'test', 'sandbox']) {
    if (typeof claim[field] !== 'string' || !claim[field].trim()) {
      throw new Error(`Claim ${claim.id ?? '(missing id)'} has no ${field}.`);
    }
  }
  if (ids.has(claim.id)) throw new Error(`Duplicate claim id: ${claim.id}`);
  if (!claim.test.includes(`@claim:${claim.id}`)) {
    throw new Error(`Claim ${claim.id} test is missing its exact tag.`);
  }
  const tag = `@claim:${claim.id}`;
  const tagCount = testSource.split(tag).length - 1;
  if (tagCount !== 1) throw new Error(`Claim ${claim.id} has ${tagCount} tagged tests; expected exactly one.`);
  if (!files.get('.factory/plan.md').includes(`\`${claim.id}\``)) {
    throw new Error(`Claim ${claim.id} is not listed in the venture plan.`);
  }
  ids.add(claim.id);
}

for (const token of ['--color-background', '--color-text', '--color-accent', '--space-2', '--duration-print-pass']) {
  if (!files.get('src/styles/tokens.css').includes(token)) throw new Error(`Missing design token: ${token}`);
}

console.log(`Plan scaffold valid: ${requiredFiles.length} artifacts and ${claims.length} M1 claims.`);
