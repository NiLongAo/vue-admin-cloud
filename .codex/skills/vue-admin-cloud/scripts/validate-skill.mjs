import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.codex/skills/vue-admin-cloud');
const skillPath = path.join(root, 'SKILL.md');
const agentPath = path.join(root, 'agents/openai.yaml');

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const skill = read(skillPath);
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/);

if (frontmatter) {
  const fields = Object.fromEntries(
    frontmatter[1].split('\n').map((line) => {
      const index = line.indexOf(':');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
  );

  if (fields.name !== 'vue-admin-cloud') {
    fail(`Unexpected skill name: ${fields.name}`);
  }

  if (!fields.description?.startsWith('Use when')) {
    fail('Description must start with "Use when"');
  }

  if (frontmatter[1].length > 1024) {
    fail('Frontmatter exceeds 1024 characters');
  }
} else {
  fail('SKILL.md missing YAML frontmatter');
}

const agent = read(agentPath);
for (const required of [
  'interface:',
  'display_name:',
  'short_description:',
  'default_prompt:',
  '$vue-admin-cloud',
]) {
  if (!agent.includes(required)) {
    fail(`agents/openai.yaml missing ${required}`);
  }
}

const files = walk(root);
for (const file of files) {
  const text = read(file);
  if ([...text].some((char) => char.codePointAt(0) > 0x7F)) {
    fail(`Non-ASCII content found in ${path.relative(root, file)}`);
  }
}

const links = [...skill.matchAll(/`((?:references|workflows|examples|checklists)\/[^`]+)`/g)]
  .map((match) => match[1])
  .filter((value) => value.endsWith('.md'));

for (const link of links) {
  const linkedPath = path.join(root, link);
  if (!fs.existsSync(linkedPath)) {
    fail(`Missing linked resource: ${link}`);
  }
}

if (!process.exitCode) {
  process.stdout.write('vue-admin-cloud skill ok\n');
}
