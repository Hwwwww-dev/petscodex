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
        id: 'musk',
        displayName: 'Musk',
        description: 'A cute chibi anime Elon Musk-style Codex pet.',
        path: 'musk',
      },
      {
        id: 'tiga',
        displayName: 'Tiga',
        description: 'A chibi Ultraman Tiga-style Codex pet with a tiny color timer.',
        path: 'tiga',
      },
      {
        id: 'trump',
        displayName: 'Trump',
        description: 'A cute chibi anime Donald Trump-style Codex pet.',
        path: 'trump',
      },
      {
        id: 'chenbo',
        displayName: 'Chenbo',
        description: 'A QQ Speed streamer-inspired chibi Codex pet character.',
        path: 'bo',
      },
      {
        id: 'zhubajie',
        displayName: 'Zhu Bajie',
        description: 'A cute chibi anime Zhu Bajie Codex pet wearing a monk travel robe and carrying a tiny nine-toothed rake.',
        path: 'zhubajie',
      },
      {
        id: 'sunwukong',
        displayName: 'Sun Wukong',
        description: 'A cute chibi anime Sun Wukong Codex pet wearing a golden headband and waving a tiny golden cudgel.',
        path: 'sunwukong',
      },
      {
        id: 'anime-burnout',
        displayName: 'Anime Burnout',
        description: 'A dead-fish-eye chibi office programmer Codex pet running on coffee and unresolved tickets.',
        path: 'anime-burnout',
      },
      {
        id: 'villain-coder',
        displayName: 'Villain Coder',
        description: 'A smug chibi villain-executive programmer Codex pet with cape, headset, and dramatic bug-report energy.',
        path: 'villain-coder',
      },
      {
        id: 'jrpg-hero',
        displayName: 'JRPG Hero',
        description: 'A retro chibi JRPG hero programmer Codex pet with a cursor sword, tiny shield, and excessive victory poses.',
        path: 'jrpg-hero',
      },
      {
        id: 'labubu',
        displayName: 'Labubu',
        description: 'A fuzzy mischievous elf-doll Codex pet with oversized ears, tiny teeth, playful charms, and cozy toy-box energy.',
        path: 'labubu',
      },
      {
        id: 'chiikawa',
        displayName: 'Chiikawa',
        description: 'A tiny round white comfort-mascot Codex pet with shy smiles, sleepy poses, and cheerful sticker-sprite energy.',
        path: 'chiikawa',
      },
      {
        id: 'usagi',
        displayName: 'Usagi',
        description: 'An energetic cream bunny Codex pet with floppy ears, snack poses, power-up cheers, and chaotic joyful charm.',
        path: 'usagi',
      },
      {
        id: 'hachiware',
        displayName: 'Hachiware',
        description: 'A blue-and-white kitten Codex pet with shy helper energy, running loops, cozy naps, and cheerful tiny celebrations.',
        path: 'hachiware',
      },
      {
        id: 'mofusand-kitten',
        displayName: 'Mofusand Kitten',
        description: 'A fashionable tabby kitten Codex pet with cozy costumes, snack poses, tiny naps, and bright sticker-sprite charm.',
        path: 'mofusand-kitten',
      },
      {
        id: 'sonny-angel',
        displayName: 'Sonny Angel',
        description: 'A tiny cherub doll Codex pet with soft wings, innocent smiles, sleepy cloud poses, and playful costume hats.',
        path: 'sonny-angel',
      },
      {
        id: 'smiski',
        displayName: 'Smiski',
        description: 'A shy glow-spirit Codex pet with quiet peeking poses, soft mint light, tiny naps, and bashful corner-hiding charm.',
        path: 'smiski',
      },
      {
        id: 'crybaby',
        displayName: 'Crybaby',
        description: 'A pastel teary doll Codex pet with glossy eyes, pouty moods, cozy hooded outfits, and soft emotional charm.',
        path: 'crybaby',
      },
      {
        id: 'dimoo',
        displayName: 'Dimoo',
        description: 'A dreamy cloud-haired Codex pet with soft pajama poses, moonlit naps, starry cheers, and gentle bedtime curiosity.',
        path: 'dimoo',
      },
      {
        id: 'skullpanda',
        displayName: 'Skullpanda',
        description: 'A gothic panda-doll Codex pet with skull face paint, spooky-cute moods, starry naps, and mischievous dark charm.',
        path: 'skullpanda',
      },
      {
        id: 'hirono',
        displayName: 'Hirono',
        description: 'A melancholic wanderer-doll Codex pet with tousled hair, shy walking loops, soft sitting moods, and quiet art-toy charm.',
        path: 'hirono',
      },
      {
        id: 'pesto-penguin',
        displayName: 'Pesto Penguin',
        description: 'A chunky baby penguin Codex pet with waddling loops, fish snacks, cozy naps, and round viral-chick charm.',
        path: 'pesto-penguin',
      },
      {
        id: 'moo-deng',
        displayName: 'Moo Deng',
        description: 'A shiny baby hippo Codex pet with tiny waddles, snack chomps, splashy moods, and round pygmy-hippo charm.',
        path: 'moo-deng',
      },
      {
        id: 'gween-bean',
        displayName: 'Gween Bean',
        description: 'A minty bean-sprout Codex pet with tiny rolling poses, shy smiles, cozy naps, and soft viral-bean charm.',
        path: 'gween-bean',
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
