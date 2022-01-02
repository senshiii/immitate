import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/app/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'dist/app/index.js'
    },
    {
      format: 'esm',
      file: 'dist/app/index.esm.js'
    }
  ],
  plugins: [
    commonjs(),
    nodeResolve({ modulesOnly: true }),
    typescript()
  ]
}

