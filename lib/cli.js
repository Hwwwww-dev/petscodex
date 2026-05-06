import {
  DEFAULT_BRANCH,
  DEFAULT_REPOSITORY,
  catalogUrl,
  downloadPet,
  listPets,
  localCatalog,
  resolvePet,
} from './github.js';
import {
  codexPetsDir,
  ensureDir,
  installDownloadedPet,
  pathExists,
  removeDir,
} from './fs.js';

const helpText = `Pets Codex

Usage:
  petscodex list
  petscodex install <pet>
  petscodex info <pet>

Options:
  --dir <path>         Install into a custom Codex pets directory
  --repo <owner/repo>  GitHub repository to download from
  --branch <branch>    Git branch, tag, or commit to download from
  --force              Replace an existing installed pet
  --source local       Use bundled local catalog metadata
  -h, --help           Show this help message

Examples:
  npx petscodex list
  npx petscodex install cat
  npx petscodex install tiga --force
  npx github:mn8821236/petscodex install ikun
`;

export async function main(argv) {
  const { command, args, flags } = parseArgs(argv);

  if (!command || flags.help) {
    console.log(helpText);
    return;
  }

  const repo = flags.repo || DEFAULT_REPOSITORY;
  const branch = flags.branch || DEFAULT_BRANCH;
  const source = flags.source || 'github';

  if (command === 'list') {
    const pets = source === 'local' ? localCatalog().pets : await listPets({ repo, branch });
    printPets(pets);
    return;
  }

  if (command === 'info') {
    const slug = args[0];
    requireSlug(slug, 'info');
    const pet = await resolvePet(slug, { repo, branch, source });
    printPetInfo(pet, repo, branch);
    return;
  }

  if (command === 'install') {
    const slug = args[0];
    requireSlug(slug, 'install');

    const targetRoot = flags.dir || codexPetsDir();
    const pet = await resolvePet(slug, { repo, branch, source });
    const targetDir = `${targetRoot}/${pet.id}`;

    if ((await pathExists(targetDir)) && !flags.force) {
      throw new Error(`"${pet.id}" is already installed. Re-run with --force to replace it.`);
    }

    const downloaded = await downloadPet(pet, { repo, branch });
    if (flags.force) {
      await removeDir(targetDir);
    }
    await ensureDir(targetRoot);
    await installDownloadedPet(downloaded, targetDir);

    console.log(`Installed ${pet.displayName || pet.id} to ${targetDir}`);
    console.log(`Source: ${rawPetBaseUrl(pet, repo, branch)}`);
    return;
  }

  throw new Error(`Unknown command "${command}". Run "petscodex --help".`);
}

function parseArgs(argv) {
  const flags = {};
  const positional = [];

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === '--help' || item === '-h') {
      flags.help = true;
      continue;
    }
    if (item === '--force') {
      flags.force = true;
      continue;
    }
    if (item === '--dir' || item === '--repo' || item === '--branch' || item === '--source') {
      const key = item.slice(2);
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`${item} requires a value.`);
      }
      flags[key] = value;
      index += 1;
      continue;
    }
    positional.push(item);
  }

  return {
    command: positional[0],
    args: positional.slice(1),
    flags,
  };
}

function requireSlug(slug, command) {
  if (!slug) {
    throw new Error(`Missing pet id. Usage: petscodex ${command} <pet>`);
  }
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    throw new Error('Pet id may only contain letters, numbers, and hyphens.');
  }
}

function printPets(pets) {
  if (!pets.length) {
    console.log('No pets found.');
    return;
  }

  const width = Math.max(...pets.map((pet) => pet.id.length), 2);
  for (const pet of pets) {
    console.log(`${pet.id.padEnd(width)}  ${pet.displayName || pet.id} - ${pet.description || ''}`);
  }
}

function printPetInfo(pet, repo, branch) {
  console.log(`${pet.displayName || pet.id} (${pet.id})`);
  if (pet.description) {
    console.log(pet.description);
  }
  console.log(`pet.json: ${rawPetBaseUrl(pet, repo, branch)}/pet.json`);
  console.log(`spritesheet: ${rawPetBaseUrl(pet, repo, branch)}/${pet.spritesheetPath || 'spritesheet.webp'}`);
}

function rawPetBaseUrl(pet, repo, branch) {
  return `${catalogUrl(repo, branch).replace('/catalog.json', '')}/${pet.path || pet.id}`;
}
