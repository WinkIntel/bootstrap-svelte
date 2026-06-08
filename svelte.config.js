import adapter from '@sveltejs/adapter-node';
import sass from 'sass';
import { sveltePreprocess } from 'svelte-preprocess'; // replace vitePreprocess with sveltePreprocess to use sass or sass-embedded

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {
        dev: process.env.NODE_ENV === 'development',
        runes: true
    },
    kit: {
        adapter: adapter()
    },
    preprocess: sveltePreprocess({
        sourceMap: process.env.NODE_ENV === 'development',
        scss: {
            implementation: sass
        }
    })
};

export default config;
