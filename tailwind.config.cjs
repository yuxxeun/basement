const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				oranged: '#ff4500',
				primary: colors.blue,
				secondary: '#ff0080',
			},
			fontFamily: {
				sans: ["'InterVariable'", ...defaultTheme.fontFamily.sans],
				basement: 'BasementGrotesque-Black, sans-serif',
				display: 'BasementGrotesque-Display, sans-serif',
				space: 'SpaceMono-Regular, sans-serif',
				inter: 'Inter-Regular, sans-serif',
				montreal: 'Neue-Montreal-Medium, sans-serif',
				delight: 'Neue-Montreal-Regular-400, sans-serif',
				geistMono: 'GeistMono-Medium',
				geistBold: 'GeistMono-Bold',
				geistSansBold: 'Geist-Bold',
				geistSansRegular: 'GeistMono-Regular',
				grotesk: 'SpaceGrotesk-Medium, sans-serif',
				roobert: 'Roobert',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
	darkMode: 'class',
}

/* 

  Alternative tailwind.config.js
  
  NOTE: Add this fonts to <head>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700&display=swap" rel="stylesheet" />
*/

// module.exports = {
//   content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: colors.cyan,
//         secondary: colors.lime,
//       },
//       fontFamily: {
//         sans: ["'Nunito'", ...defaultTheme.fontFamily.sans],
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/typography")],
//   darkMode: "class",
// };
