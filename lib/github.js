import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDir, readJson, tempPetDir } from './fs.js';

export const DEFAULT_REPOSITORY = 'mn8821236/petscodex';
export const DEFAULT_BRANCH = 'main';

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = dirname(currentDir);

export function catalogUrl(repo = DEFAULT_REPOSITORY, branch = DEFAULT_BRANCH) {
  return `https://raw.githubusercontent.com/${repo}/${branch}/catalog.json`;
}

export function petFileUrl(pet, filename, repo = DEFAULT_REPOSITORY, branch = DEFAULT_BRANCH) {
  const petPath = pet.path || pet.id;
  return `https://raw.githubusercontent.com/${repo}/${branch}/${petPath}/${filename}`;
}

export function localCatalog() {
  return {
    repository: DEFAULT_REPOSITORY,
    branch: DEFAULT_BRANCH,
    pets: [
      {
        id: 'cat',
        displayName: 'Cat',
        description: 'A chibi gray-and-white Scottish Fold cat Codex pet based on the reference photo.',
        path: 'cat',
      },
      {
        id: 'ikun',
        displayName: 'IKUN',
        description: 'A hoodie chick with hot path stage energy.',
        path: 'ikun',
      },
      {
        id: 'tiga',
        displayName: 'Tiga',
        description: 'A chibi Ultraman Tiga-style Codex pet with a tiny color timer.',
        path: 'tiga',
      },
    ],
  };
}

export async function fetchCatalog({ repo = DEFAULT_REPOSITORY, branch = DEFAULT_BRANCH } = {}) {
  try {
    return await fetchJson(catalogUrl(repo, branch));
  } catch (error) {
    if (repo === DEFAULT_REPOSITORY && branch === DEFAULT_BRANCH) {
      return readJson(join(packageRoot, 'catalog.json')).catch(() => localCatalog());
    }
    throw error;
  }
}

export async function listPets(options = {}) {
  const catalog = await fetchCatalog(options);
  return normalizeCatalog(catalog).pets;
}

export async function resolvePet(slug, { repo = DEFAULT_REPOSITORY, branch = DEFAULT_BRANCH, source = 'github' } = {}) {
  const catalog = source === 'local' ? localCatalog() : await fetchCatalog({ repo, branch });
  const pets = normalizeCatalog(catalog).pets;
  const pet = pets.find((item) => item.id === slug || item.path === slug);
  if (!pet) {
    throw new Error(`Pet "${slug}" was not found in ${repo}. Run "petscodex list".`);
  }

  const petJson = await fetchJson(petFileUrl(pet, 'pet.json', repo, branch));
  return {
    ...pet,
    ...petJson,
    id: petJson.id || pet.id,
    path: pet.path || petJson.id || pet.id,
    spritesheetPath: petJson.spritesheetPath || 'spritesheet.webp',
  };
}

export async function downloadPet(pet, { repo = DEFAULT_REPOSITORY, branch = DEFAULT_BRANCH } = {}) {
  const dir = await tempPetDir();
  const petJsonPath = join(dir, 'pet.json');
  const spritesheetName = pet.spritesheetPath || 'spritesheet.webp';
  const spritesheetPath = join(dir, spritesheetName);

  await ensureDir(dir);
  await writeFile(petJsonPath, `${JSON.stringify(toInstallManifest(pet), null, 2)}\n`);
  await downloadToFile(petFileUrl(pet, spritesheetName, repo, branch), spritesheetPath);

  return {
    petJsonPath,
    spritesheetPath,
    spritesheetName,
  };
}

function normalizeCatalog(catalog) {
  const pets = Array.isArray(catalog.pets) ? catalog.pets : [];
  return {
    ...catalog,
    pets: pets
      .filter((pet) => pet && pet.id)
      .map((pet) => ({
        ...pet,
        path: pet.path || pet.id,
      })),
  };
}

function toInstallManifest(pet) {
  return {
    id: pet.id,
    displayName: pet.displayName || pet.id,
    description: pet.description || '',
    spritesheetPath: pet.spritesheetPath || 'spritesheet.webp',
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'petscodex-cli',
    },
  });
  if (!response.ok) {
    throw new Error(`Unable to fetch ${url} (${response.status})`);
  }
  return response.json();
}

async function downloadToFile(url, path) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'petscodex-cli',
    },
  });
  if (!response.ok) {
    throw new Error(`Unable to download ${url} (${response.status})`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(path, bytes);
}
