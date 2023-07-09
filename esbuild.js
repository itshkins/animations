import fs from 'node:fs'
import {dtsPlugin} from 'esbuild-plugin-d.ts'
import {build} from 'esbuild'

build({
  bundle: true,
  platform: `node`,
  format: undefined,
  entryPoints: [`./src/index.ts`],
  outfile: `./dist/index.js`,
  plugins: [
    dtsPlugin({}),
  ],
}).then(() => {
  fs.unlinkSync(`./dist/index.js`)
  fs.renameSync(`./dist/index.d.ts`, `./dist/js-utils.d.ts`)
})
