# Pets Codex

Community pets for Codex desktop, plus a tiny npm CLI that installs pets from
this GitHub repository.

## Install pets

After the package is published to npm:

```bash
npx petscodex list
npx petscodex install cat
npx petscodex install ikun
npx petscodex install tiga
```

Before npm publishing, test directly from GitHub:

```bash
npx github:mn8821236/petscodex list
npx github:mn8821236/petscodex install cat
```

By default, pets are installed into:

```text
~/.codex/pets/<pet-id>
```

Use `--dir` to install somewhere else:

```bash
npx petscodex install cat --dir ./tmp-pets
```

Use `--force` to replace an existing pet:

```bash
npx petscodex install cat --force
```

## Repository layout

```text
catalog.json
cat/
  pet.json
  spritesheet.webp
ikun/
  pet.json
  spritesheet.webp
tiga/
  pet.json
  spritesheet.webp
```

The CLI downloads files from:

```text
https://raw.githubusercontent.com/mn8821236/petscodex/main/<pet-id>/
```

## Publish CLI to npm

```bash
npm login
npm publish --access public
```
