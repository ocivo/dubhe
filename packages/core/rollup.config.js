import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const isProductionEnv = process.env.NODE_ENV === 'production'

export default {
    input: 'src/index.tsx',
    output: {
        file: 'dist/index.js',
        format: 'es',
    },
    sourceMap: false,
    plugins: [
        peerDepsExternal(),
        postcss({
            extract: true,
            minimize: isProductionEnv,
        }),
        resolve({
            browser: true,
        }),
        typescript({
            tsconfig: 'tsconfig.json',
            declaration: true,
            declarationDir: 'types',
        }),
        commonjs({ sourceMap: false }),
        babel({
            exclude: 'node_modules/**',
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            compact: false,
        }),
        terser(), // 可选：用于压缩输出
    ],
    onwarn(warning, warn) {
        // react-query@3.39.2 warning
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return
        }
        // antd@5.2.0
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return
        }
        warn(warning)
    },
}
