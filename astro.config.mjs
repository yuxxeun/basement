import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import image from '@astrojs/image'
import partytown from '@astrojs/partytown'
import prefetch from '@astrojs/prefetch'
import svelte from '@astrojs/svelte'
import { vitePreprocess } from '@astrojs/svelte'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://astro.build/config
export default defineConfig({
	site: 'https://yuxxeun.tech',
	base: '/',
	preprocess: vitePreprocess(),
	compilerOptions: {
		dev: true,
		hydratable: true,
	},
	output: 'static',
	integrations: [
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
		sitemap({
			customPages: ['https://yuxxeun.tech'],
		}),
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
		prefetch({
			selector: "a[href^='/']",
		}),
		svelte(),
	],
	vite: {
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
			},
		},
	},
	supabase: {
		client: {
			auth: {
				persistSession: false,
			},
		},
	},
})
