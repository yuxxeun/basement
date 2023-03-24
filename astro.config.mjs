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

export default defineConfig({
	site: 'https://yuxxeun.now.sh/',
	base: '/',
	preprocess: vitePreprocess(),
	output: 'static',
	compilerOptions: { dev: true, hydratable: true },
	integrations: [
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
		sitemap({ customPages: ['https://yuxxeun.now.sh/'] }),
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}) /* Disable this integration if you don't use Google Analytics (or other external script). */,
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
})
