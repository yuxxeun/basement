# BSMNT.

<p align="center">
<img src="./public/bsmnt.png" width="100%" height="auto" />
</p>

Pssst... this project was build with [Astro](https://astro.build), astro serve it fast with Astro's next-gen island architecture.

## Project structure
All routes are lives in `src/pages/*` directory. I use common (read: boring) naming conventions in naming directory and file. So you should be familiar.

```
/
├── data/
|   └── blog/
|       ├── post-slug-1.md
|       └── ...
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
|   |   └── styles/
|   |       └── base.css
│   ├── components/
│   │   ├── atoms/
│   │   ├── blog/
│   │   ├── core/
|   |   └── widgets/
|   |       ├── Header.astro
|   |       ├── Footer.astro
|   |       └── ...
│   ├── layouts/
│   |   |── BaseLayout.astro
│   |   └── ...
│   ├── pages/
│   |   ├── [...blog]/
|   |   |   ├── [...page].astro
|   |   |   └── [slug].astro
│   |   ├── [...categories]/
|   |   |   └── [category]/
|   |   |       └── [...page].astro
│   |   ├── [...tags]/
|   |   |   └── [tag]/
|   |   |       └── [...page].astro
│   |   ├── index.astro
|   |   ├── 404.astro
|   |   └-- rss.xml.js
│   ├── utils/
│   └── config.mjs
├── package.json
└── ...
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory if they do not require any transformation or in the `assets/` directory if they are imported directly.

<br>

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs all dependencies                    |
| `npm run dev`     | Starts local dev server at `127.0.0.1:3000`  |
| `npm run build`   | Build to production site to `./dist/`        | 
| `npm run preview` | Preview your build locally, before deploying |
| `node ./scripts/compose.js` | To bootstrap a new post |



## Build to production (manual)

This site is should be statically generated so you need to run `npm run build` or `yarn build` or even `pnpm build`, choose whatever you want.

You can create an optimized production build with:

```shell
npm run build
```

Now, your website is ready to be deployed. All generated files are located at
`dist` folder, which you can deploy the folder to any hosting service you
prefer.

<br>

## Contributing

If you have any idea, suggestions or find any bugs, feel free to open a discussion, an issue or create a `pull request`. 
That would be very useful for me personally and i would be happy to listen and take action.

## Maintainer
- [yuxxeun](https://github.com/yuxxeun)

## License
**BSMNT** is licensed under the MIT license, of course — see the [LICENSE](./LICENSE.md) file for details.
