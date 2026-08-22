import adapter from '@sveltejs/adapter-static';
import sass from 'sass';
import { sveltePreprocess } from 'svelte-preprocess'; // replace vitePreprocess with sveltePreprocess to use sass or sass-embedded
import { withAgentRoutes } from './src/routes/(common)/vercel-agent-routes.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {
        dev: process.env.NODE_ENV === 'development',
        runes: true
    },
    kit: {
        // adapter-static's zero-config mode detects Vercel and writes .vercel/output/static plus config.json.
        // withAgentRoutes then adds Markdown content negotiation, Vary/Link headers, and 404/406 routes to that config.
        adapter: withAgentRoutes(adapter()),
        prerender: {
            handleMissingId: ({ id, message }) => {
                if (id === '!' || /^nav-link-\d+$/.test(id)) return;
                throw new Error(message);
            }
        }
    },
    preprocess: sveltePreprocess({
        sourceMap: process.env.NODE_ENV === 'development',
        scss: {
            implementation: sass
        }
    })
};

export default config;
