# Vite SWC

Vite SWC compiler. Straightforward minimal implementation.

No config options. Supports legacy decorators, emitDecoratorMetadata, etc.

This library is entirely intended to close that gap while maintaining the fastest build times possible.

## Installation

```ts
yarn add @fast.me/swc
```

## Usage

In your Vite config import, and add to plugins, passing in the path to your entry file.

```ts
import { swc } from '@fast.me/vite-swc';

export default defineConfig({
  plugins: [swc('./src/fast.ts')],
});
```

## Copyright

Licensed under MIT. Enjoy
