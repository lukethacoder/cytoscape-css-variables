import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const input = 'src/index.ts'
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]
const plugins = [
  typescript({
    typescript: require('typescript'),
  }),
]

export default [
  {
    input,
    plugins,
    external,
    output: [
      {
        file: pkg.unpkg,
        format: 'umd',
        name: 'cytoscapeAnywherePanning',
        global: {
          cytoscape: 'Cytoscape',
        },
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
  },
]
