# tf2-dynamic-schema

Fetch and inject schema into tf2-item-format.

### Installation

```bash
# Yarn
yarn add tf2-dynamic-schema
# NPM
npm install tf2-dynamic-schema
```

### Usage

```ts
import { fetchSchema } from 'tf2-dynamic-schema';

const format = await fetchSchema('STEAM-API-KEY');

console.log(format.stringify(format.parseSKU('5021;6'))); // Mann Co. Supply Crate Key
```
