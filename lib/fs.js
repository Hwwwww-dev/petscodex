import { constants } from 'node:fs';
import { access, cp, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

export function codexPetsDir() {
  return join(homedir(), '.codex', 'pets');
}

export async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

export async function removeDir(path) {
  await rm(path, { recursive: true, force: true });
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export async function tempPetDir() {
  return mkdtemp(join(tmpdir(), 'petscodex-'));
}

export async function installDownloadedPet(downloaded, targetDir) {
  await ensureDir(targetDir);
  await cp(downloaded.petJsonPath, join(targetDir, 'pet.json'));
  await cp(downloaded.spritesheetPath, join(targetDir, downloaded.spritesheetName));
}
