# mini-tab-suspender

Tampermonkey script to suspend your chrome tab on inactivity

## Use the tampermonkey script

First we need to build the script:

```bash
npm run build
```

Then you can copy the content of the file in [`dist/tampermonkey.js`](dist/tampermonkey.js) to a newly created tampermonkey script.

By default, it will run on every webpage, but you can edit the `@match` rule in the script to restrict this.

## Develop locally

```bash
npm run dev
```

This command will watch the [`src/index.ts`](src/index.ts) file and rebuild the tampermonkey script anytime changes are detected.
