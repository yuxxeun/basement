## Let's dive in

### Project structure

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

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

<br>

### Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:3000`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

<br>

### Configuration

Basic configuration file: `./src/config.mjs`

```javascript
export const SITE = {
  name: "Example",

  origin: "https://example.com",
  basePathname: "/", // Change this if you need to deploy to Github Pages, for example

  title: "Example - This is the homepage title of Example",
  description: "This is the homepage description of Example",

  googleAnalyticsId: false, // or "G-XXXXXXXXXX",
  googleSiteVerificationId: false // or some value,
};

export const BLOG = {
  disabled: false,
  postsPerPage: 4,

  blog: {
    disabled: false,
    pathname: 'readme', // blog main path, you can change this to "articles" (/articles)
  },

  post: {
    disabled: false,
    pathname: '', // empty for /some-post, value for /pathname/some-post 
  },

  category: {
    disabled: false,
    pathname: 'category', // set empty to change from /category/some-category to /some-category
  },

  tag: {
    disabled: false,
    pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
  },
};


```

<br>

### Deploy

#### Deploy to production (manual)

You can create an optimized production build with:

```shell
npm run build
```

Now, your website is ready to be deployed. All generated files are located at
`dist` folder, which you can deploy the folder to any hosting service you
prefer.

#### Deploy to Vercel

Clone this repository from this GitHub account and deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyuxxeun%2Fhoneypod)


<br>

## Roadmap

- *Project*:
  - **(DONE)** Reduce the complexity in the components folder and simplify the other folders to make it very easy to use.
  - Create simple and clear strategy to get template updates
  - Move specific configurations to a specialized file
  - Fix some bugs with prettier
  - Make the use of images clean and intuitive
- *SEO*:
  - **(DONE)** Add support to easily manage SEO meta-tags (title, description, canonical, social sharing, ...)
- *Blog (readme)*:
  - **(DONE)** Support to Fast and SEO friendly blog
  - **(DONE)** Add support for categories and tags.
  - Improve blog design
  - Create component or utilities for latest posts
  - Create component or utilities for related posts
  - Add more *shortcodes* or *embed* functions to posts in Markdown: (eg video, tweet...)
- *More widgets*:
  - ~~Add more Tailwind components useful for most scenarios (Features, Contact, Call to Actions, Content, FAQs ...)~~
  - Create external library or place with useful Tailwind components
- *More Examples*: Add commonly used example pages (Ex: About, Terms, Services...)
- *Documentation*: Create detailed documentation with best practices and redesign tips

<br>

## Contributing

If you have any idea, suggestions or find any bugs, feel free to open a discussion, an issue or create a pull request. 
That would be very useful for me personally and i would be happy to listen and take action.

## License
**honeypod** is licensed under the MIT license, why not, of course — see the [LICENSE](https://github.com/yuxxeun/honeypod/blob/main/LICENSE.md) file for details.
