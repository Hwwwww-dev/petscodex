# Pets Codex

Discover and install community desktop pets for Codex.

Visit the gallery: [petscodex.com](https://petscodex.com)

```bash
npx petscodex install cat
```

Pets Codex is a lightweight catalog and installer for Codex desktop pets. The
npm package provides the `petscodex` command, while this GitHub repository hosts
the pet manifests and spritesheets used by the installer.

## Quick Start

List available pets:

```bash
npx petscodex list
```

Install a pet:

```bash
npx petscodex install cat
```

Replace an existing pet:

```bash
npx petscodex install cat --force
```

Install into a custom directory:

```bash
npx petscodex install cat --dir ./tmp-pets
```

By default, pets are installed into:

```text
~/.codex/pets/<pet-id>
```

On Windows, that resolves to:

```text
C:\Users\<you>\.codex\pets\<pet-id>
```

## Available Pets

```bash
npx petscodex install cat
npx petscodex install ikun
npx petscodex install tiga
```

Current catalog:

- `cat` - Cat
- `ikun` - IKUN
- `tiga` - Tiga

## How It Works

`npx petscodex install <pet>` downloads two files from this repository:

```text
<pet-id>/pet.json
<pet-id>/spritesheet.webp
```

For example:

```text
https://raw.githubusercontent.com/mn8821236/petscodex/main/cat/pet.json
https://raw.githubusercontent.com/mn8821236/petscodex/main/cat/spritesheet.webp
```

Then the CLI copies them into:

```text
~/.codex/pets/cat/
```

## Repository Layout

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
bin/
  petscodex.js
lib/
  cli.js
  fs.js
  github.js
package.json
```

## Add a Pet

Create a new folder named with a lowercase slug:

```text
my-pet/
  pet.json
  spritesheet.webp
```

Example `pet.json`:

```json
{
  "id": "my-pet",
  "displayName": "My Pet",
  "description": "A friendly Codex desktop pet.",
  "spritesheetPath": "spritesheet.webp"
}
```

Then add it to `catalog.json`:

```json
{
  "id": "my-pet",
  "displayName": "My Pet",
  "description": "A friendly Codex desktop pet.",
  "path": "my-pet"
}
```

## CLI Development

Run locally:

```bash
node ./bin/petscodex.js list --source local
node ./bin/petscodex.js install cat --dir ./tmp-pets --force
```

Test the package contents:

```bash
npm pack --dry-run
```

## Links

- Website: [petscodex.com](https://petscodex.com)
- npm: [petscodex](https://www.npmjs.com/package/petscodex)
- GitHub: [mn8821236/petscodex](https://github.com/mn8821236/petscodex)

## License

MIT
