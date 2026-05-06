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

Here are a few pets you can install right away:

```bash
npx petscodex install cat
npx petscodex install ikun
npx petscodex install musk
npx petscodex install tiga
npx petscodex install trump
```

- `cat` - Cat
- `ikun` - IKUN
- `musk` - Musk
- `tiga` - Tiga
- `trump` - Trump

Explore more pets at [petscodex.com](https://petscodex.com).

## Links

- Website: [petscodex.com](https://petscodex.com)
- npm: [petscodex](https://www.npmjs.com/package/petscodex)
- GitHub: [mn8821236/petscodex](https://github.com/mn8821236/petscodex)

## License

MIT
