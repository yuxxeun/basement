import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import image from '@astrojs/image'
import partytown from '@astrojs/partytown'
import { SITE } from './src/config.mjs'
import prefetch from '@astrojs/prefetch'
import svelte from '@astrojs/svelte'
import vercel from '@astrojs/vercel/static'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://astro.build/config
export default defineConfig({
	site: SITE.origin,
	base: SITE.basePathname,
	output: 'static',
	integrations: [
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
		sitemap(),
		image(),
		/* Disable this integration if you don't use Google Analytics (or other external script). */
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
