import mime from 'mime';
import sharp$1 from 'sharp';
import 'kleur/colors';
import 'node:fs/promises';
import 'node:path';
import 'node:url';
import 'http-cache-semantics';
import 'node:os';
import 'image-size';
import 'magic-string';
import 'node:stream';
import 'slash';
import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, u as unescapeHTML, F as Fragment, d as addAttribute, e as renderHead, f as renderSlot, m as maybeRenderHead, s as spreadAttributes, g as createVNode } from '../astro.ff1242f6.mjs';
import { inject } from '@vercel/analytics';
import rss from '@astrojs/rss';
import { createClient } from '@supabase/supabase-js';
import moment from 'moment';
/* empty css                               */import path from 'path';
import { fileURLToPath } from 'url';
import { optimize } from 'svgo';
import slugify from 'limax';
import getReadingTime from 'reading-time';

function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp"].includes(value);
}
function isOutputFormatSupportsAlpha(value) {
  return ["avif", "png", "webp"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
function parseAspectRatio(aspectRatio) {
  if (!aspectRatio) {
    return void 0;
  }
  if (typeof aspectRatio === "number") {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(":");
    return parseInt(width) / parseInt(height);
  }
}
function isSSRService(service) {
  return "transform" in service;
}
class BaseSSRService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    searchParams.append("href", transform.src);
    return { searchParams };
  }
  parseTransform(searchParams) {
    if (!searchParams.has("href")) {
      return void 0;
    }
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
}

class SharpService extends BaseSSRService {
  async transform(inputBuffer, transform) {
    const sharpImage = sharp$1(inputBuffer, { failOnError: false, pages: -1 });
    sharpImage.rotate();
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      sharpImage.resize({
        width,
        height,
        fit: transform.fit,
        position: transform.position,
        background: transform.background
      });
    }
    if (transform.format) {
      sharpImage.toFormat(transform.format, { quality: transform.quality });
      if (transform.background && !isOutputFormatSupportsAlpha(transform.format)) {
        sharpImage.flatten({ background: transform.background });
      }
    }
    const { data, info } = await sharpImage.toBuffer({ resolveWithObject: true });
    return {
      data,
      format: info.format
    };
  }
}
const service = new SharpService();
var sharp_default = service;

const sharp = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sharp_default
}, Symbol.toStringTag, { value: 'Module' }));

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

function isRemoteImage(src) {
  return /^(https?:)?\/\//.test(src);
}
function removeQueryString(src) {
  const index = src.lastIndexOf("?");
  return index > 0 ? src.substring(0, index) : src;
}
function extname(src) {
  const base = basename(src);
  const index = base.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  return base.substring(index);
}
function basename(src) {
  return removeQueryString(src.replace(/^.*[\\\/]/, ""));
}

async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
const get$2 = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = sharp_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await sharp_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: new Date().toUTCString()
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$2
}, Symbol.toStringTag, { value: 'Module' }));

const SITE = {
	name: 'yuxxeun®',
	brand: 'basement',
	origin: 'https://yuxxeun.now.sh/',
	basePathname: '/',
	title: 'yuxxeun®',
	description: 'THE LIGHT THAT COMES FROM DOWNSTAIRS',
	image: 'https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/gradient.jpg?raw=true',
};

const BLOG = {
	disabled: false,
	postsPerPage: 5,

	blog: {
		disabled: false,
		pathname: 'lab',
	},

	post: {
		disabled: false,
		pathname: '',
	},

	category: {
		disabled: false,
		pathname: '', // set empty to change from /category/some-category to /some-category
	},

	tag: {
		disabled: false,
		pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
	},
};

const trim = (str, ch) => {
	let start = 0,
		end = str.length;
	while (start < end && str[start] === ch) ++start;
	while (end > start && str[end - 1] === ch) --end;
	return start > 0 || end < str.length ? str.substring(start, end) : str
};

const trimSlash = (s) => trim(trim(s, '/'));
const createPath = (...params) => '/' + params.filter((el) => !!el).join('/');

const basePathname = trimSlash(SITE.basePathname);

const cleanSlug = (text) => slugify(trimSlash(text));

const BLOG_BASE = cleanSlug(BLOG?.blog?.pathname);
const POST_BASE = cleanSlug(BLOG?.post?.pathname);
const CATEGORY_BASE = cleanSlug(BLOG?.category?.pathname);
const TAG_BASE = cleanSlug(BLOG?.tag?.pathname);

/** */
const getCanonical = (path = '') => new URL(path, SITE.origin);

/** */
const getPermalink = (slug = '', type = 'page') => {
	const _slug = cleanSlug(slug);

	switch (type) {
		case 'category':
			return createPath(basePathname, CATEGORY_BASE, _slug)

		case 'tag':
			return createPath(basePathname, TAG_BASE, _slug)

		case 'post':
			return createPath(basePathname, POST_BASE, _slug)

		case 'page':
		default:
			return createPath(basePathname, _slug)
	}
};

/** */
const getBlogPermalink = () => getPermalink(BLOG_BASE);

/** */
const getHomePermalink = () => {
	const permalink = getPermalink();
	return permalink !== '/' ? permalink + '/' : permalink
};

const defaults = {
  templateTitle: "",
  noindex: false,
  nofollow: false,
  defaultOpenGraphImageWidth: 0,
  defaultOpenGraphImageHeight: 0,
  defaultOpenGraphVideoWidth: 0,
  defaultOpenGraphVideoHeight: 0
};
const buildOpenGraphMediaTags = (mediaType, media = [], {
  defaultWidth,
  defaultHeight
} = {}) => {
  return media.reduce((tags, medium, index) => {
    tags.push(`<meta property="og:${mediaType}" content="${medium.url}" />`);
    if (medium.alt) {
      tags.push(`<meta property="og:${mediaType}:alt" content="${medium.alt}" />`);
    }
    if (medium.secureUrl) {
      tags.push(`<meta property="og:${mediaType}:secure_url" content="${medium.secureUrl.toString()}" />`);
    }
    if (medium.type) {
      tags.push(`<meta property="og:${mediaType}:type" content="${medium.type.toString()}" />`);
    }
    if (medium.width) {
      tags.push(`<meta property="og:${mediaType}:width" content="${medium.width.toString()}" />`);
    } else if (defaultWidth) {
      tags.push(`<meta property="og:${mediaType}:width" content="${defaultWidth.toString()}" />`);
    }
    if (medium.height) {
      tags.push(`<meta property="og:${mediaType}:height" content="${medium.height.toString()}" />`);
    } else if (defaultHeight) {
      tags.push(`<meta property="og:${mediaType}:height" content="${defaultHeight.toString()}" />`);
    }
    return tags;
  }, []);
};
const buildTags = (config) => {
  const tagsToRender = [];
  if (config.titleTemplate) {
    defaults.templateTitle = config.titleTemplate;
  }
  let updatedTitle = "";
  if (config.title) {
    updatedTitle = config.title;
    if (defaults.templateTitle) {
      updatedTitle = defaults.templateTitle.replace(/%s/g, () => updatedTitle);
    }
  } else if (config.defaultTitle) {
    updatedTitle = config.defaultTitle;
  }
  if (updatedTitle) {
    tagsToRender.push(`<title>${updatedTitle}</title>`);
  }
  const noindex = config.noindex || defaults.noindex || config.dangerouslySetAllPagesToNoIndex;
  const nofollow = config.nofollow || defaults.nofollow || config.dangerouslySetAllPagesToNoFollow;
  let robotsParams = "";
  if (config.robotsProps) {
    const {
      nosnippet,
      maxSnippet,
      maxImagePreview,
      maxVideoPreview,
      noarchive,
      noimageindex,
      notranslate,
      unavailableAfter
    } = config.robotsProps;
    robotsParams = `${nosnippet ? ",nosnippet" : ""}${maxSnippet ? `,max-snippet:${maxSnippet}` : ""}${maxImagePreview ? `,max-image-preview:${maxImagePreview}` : ""}${noarchive ? ",noarchive" : ""}${unavailableAfter ? `,unavailable_after:${unavailableAfter}` : ""}${noimageindex ? ",noimageindex" : ""}${maxVideoPreview ? `,max-video-preview:${maxVideoPreview}` : ""}${notranslate ? ",notranslate" : ""}`;
  }
  if (noindex || nofollow) {
    if (config.dangerouslySetAllPagesToNoIndex) {
      defaults.noindex = true;
    }
    if (config.dangerouslySetAllPagesToNoFollow) {
      defaults.nofollow = true;
    }
    tagsToRender.push(
      `<meta name="robots" content="${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}${robotsParams}" />`
    );
  } else {
    tagsToRender.push(`<meta name="robots" content="index,follow${robotsParams}" />`);
  }
  if (config.description) {
    tagsToRender.push(`<meta name="description" content="${config.description}" />`);
  }
  if (config.mobileAlternate) {
    tagsToRender.push(
      `<link rel="alternate" media="${config.mobileAlternate.media}" href="${config.mobileAlternate.href}" />`
    );
  }
  if (config.languageAlternates && config.languageAlternates.length > 0) {
    config.languageAlternates.forEach((languageAlternate) => {
      tagsToRender.push(
        `<link rel="alternate" hrefLang="${languageAlternate.hrefLang}" href="${languageAlternate.href}" />`
      );
    });
  }
  if (config.twitter) {
    if (config.twitter.cardType) {
      tagsToRender.push(`<meta name="twitter:card" content="${config.twitter.cardType}" />`);
    }
    if (config.twitter.site) {
      tagsToRender.push(`<meta name="twitter:site" content="${config.twitter.site}" />`);
    }
    if (config.twitter.handle) {
      tagsToRender.push(`<meta name="twitter:creator" content="${config.twitter.handle}" />`);
    }
  }
  if (config.facebook) {
    if (config.facebook.appId) {
      tagsToRender.push(`<meta property="fb:app_id" content="${config.facebook.appId}" />`);
    }
  }
  if (config.openGraph?.title || updatedTitle) {
    tagsToRender.push(`<meta property="og:title" content="${config.openGraph?.title || updatedTitle}" />`);
  }
  if (config.openGraph?.description || config.description) {
    tagsToRender.push(
      `<meta property="og:description" content="${config.openGraph?.description || config.description}" />`
    );
  }
  if (config.openGraph) {
    if (config.openGraph.url || config.canonical) {
      tagsToRender.push(`<meta property="og:url" content="${config.openGraph.url || config.canonical}" />`);
    }
    if (config.openGraph.type) {
      const type = config.openGraph.type.toLowerCase();
      tagsToRender.push(`<meta property="og:type" content="${type}" />`);
      if (type === "profile" && config.openGraph.profile) {
        if (config.openGraph.profile.firstName) {
          tagsToRender.push(`<meta property="profile:first_name" content="${config.openGraph.profile.firstName}" />`);
        }
        if (config.openGraph.profile.lastName) {
          tagsToRender.push(`<meta property="profile:last_name" content="${config.openGraph.profile.lastName}" />`);
        }
        if (config.openGraph.profile.username) {
          tagsToRender.push(`<meta property="profile:username" content="${config.openGraph.profile.username}" />`);
        }
        if (config.openGraph.profile.gender) {
          tagsToRender.push(`<meta property="profile:gender" content="${config.openGraph.profile.gender}" />`);
        }
      } else if (type === "book" && config.openGraph.book) {
        if (config.openGraph.book.authors && config.openGraph.book.authors.length) {
          config.openGraph.book.authors.forEach((author, index) => {
            tagsToRender.push(`<meta property="book:author" content="${author}" />`);
          });
        }
        if (config.openGraph.book.isbn) {
          tagsToRender.push(`<meta property="book:isbn" content="${config.openGraph.book.isbn}" />`);
        }
        if (config.openGraph.book.releaseDate) {
          tagsToRender.push(`<meta property="book:release_date" content="${config.openGraph.book.releaseDate}" />`);
        }
        if (config.openGraph.book.tags && config.openGraph.book.tags.length) {
          config.openGraph.book.tags.forEach((tag, index) => {
            tagsToRender.push(`<meta property="book:tag" content="${tag}" />`);
          });
        }
      } else if (type === "article" && config.openGraph.article) {
        if (config.openGraph.article.publishedTime) {
          tagsToRender.push(
            `<meta property="article:published_time" content="${config.openGraph.article.publishedTime}" />`
          );
        }
        if (config.openGraph.article.modifiedTime) {
          tagsToRender.push(
            `<meta property="article:modified_time" content="${config.openGraph.article.modifiedTime}" />`
          );
        }
        if (config.openGraph.article.expirationTime) {
          tagsToRender.push(
            `<meta property="article:expiration_time" content="${config.openGraph.article.expirationTime}" />`
          );
        }
        if (config.openGraph.article.authors && config.openGraph.article.authors.length) {
          config.openGraph.article.authors.forEach((author, index) => {
            tagsToRender.push(`<meta property="article:author" content="${author}" />`);
          });
        }
        if (config.openGraph.article.section) {
          tagsToRender.push(`<meta property="article:section" content="${config.openGraph.article.section}" />`);
        }
        if (config.openGraph.article.tags && config.openGraph.article.tags.length) {
          config.openGraph.article.tags.forEach((tag, index) => {
            tagsToRender.push(`<meta property="article:tag" content="${tag}" />`);
          });
        }
      } else if ((type === "video.movie" || type === "video.episode" || type === "video.tv_show" || type === "video.other") && config.openGraph.video) {
        if (config.openGraph.video.actors && config.openGraph.video.actors.length) {
          config.openGraph.video.actors.forEach((actor, index) => {
            if (actor.profile) {
              tagsToRender.push(`<meta property="video:actor" content="${actor.profile}" />`);
            }
            if (actor.role) {
              tagsToRender.push(`<meta property="video:actor:role" content="${actor.role}" />`);
            }
          });
        }
        if (config.openGraph.video.directors && config.openGraph.video.directors.length) {
          config.openGraph.video.directors.forEach((director, index) => {
            tagsToRender.push(`<meta property="video:director" content="${director}" />`);
          });
        }
        if (config.openGraph.video.writers && config.openGraph.video.writers.length) {
          config.openGraph.video.writers.forEach((writer, index) => {
            tagsToRender.push(`<meta property="video:writer" content="${writer}" />`);
          });
        }
        if (config.openGraph.video.duration) {
          tagsToRender.push(
            `<meta property="video:duration" content="${config.openGraph.video.duration.toString()}" />`
          );
        }
        if (config.openGraph.video.releaseDate) {
          tagsToRender.push(`<meta property="video:release_date" content="${config.openGraph.video.releaseDate}" />`);
        }
        if (config.openGraph.video.tags && config.openGraph.video.tags.length) {
          config.openGraph.video.tags.forEach((tag, index) => {
            tagsToRender.push(`<meta property="video:tag" content="${tag}" />`);
          });
        }
        if (config.openGraph.video.series) {
          tagsToRender.push(`<meta property="video:series" content="${config.openGraph.video.series}" />`);
        }
      }
    }
    if (config.defaultOpenGraphImageWidth) {
      defaults.defaultOpenGraphImageWidth = config.defaultOpenGraphImageWidth;
    }
    if (config.defaultOpenGraphImageHeight) {
      defaults.defaultOpenGraphImageHeight = config.defaultOpenGraphImageHeight;
    }
    if (config.openGraph.images && config.openGraph.images.length) {
      tagsToRender.push(
        ...buildOpenGraphMediaTags("image", config.openGraph.images, {
          defaultWidth: defaults.defaultOpenGraphImageWidth,
          defaultHeight: defaults.defaultOpenGraphImageHeight
        })
      );
    }
    if (config.defaultOpenGraphVideoWidth) {
      defaults.defaultOpenGraphVideoWidth = config.defaultOpenGraphVideoWidth;
    }
    if (config.defaultOpenGraphVideoHeight) {
      defaults.defaultOpenGraphVideoHeight = config.defaultOpenGraphVideoHeight;
    }
    if (config.openGraph.videos && config.openGraph.videos.length) {
      tagsToRender.push(
        ...buildOpenGraphMediaTags("video", config.openGraph.videos, {
          defaultWidth: defaults.defaultOpenGraphVideoWidth,
          defaultHeight: defaults.defaultOpenGraphVideoHeight
        })
      );
    }
    if (config.openGraph.locale) {
      tagsToRender.push(`<meta property="og:locale" content="${config.openGraph.locale}" />`);
    }
    if (config.openGraph.site_name) {
      tagsToRender.push(`<meta property="og:site_name" content="${config.openGraph.site_name}" />`);
    }
  }
  if (config.canonical) {
    tagsToRender.push(`<link rel="canonical" href="${config.canonical}" />`);
  }
  if (config.additionalMetaTags && config.additionalMetaTags.length > 0) {
    config.additionalMetaTags.forEach((tag) => {
      tagsToRender.push(
        `<meta key="meta:${tag.keyOverride ?? tag.name ?? tag.property ?? tag.httpEquiv}" ${Object.keys(tag).map((key) => `${key}="${tag[key]}"`).join(" ")} />`
      );
    });
  }
  if (config.additionalLinkTags?.length) {
    config.additionalLinkTags.forEach((tag) => {
      tagsToRender.push(
        `<link key="link${tag.keyOverride ?? tag.href}${tag.rel}" ${Object.keys(tag).map((key) => `${key}="${tag[key]}"`).join(" ")} />`
      );
    });
  }
  return tagsToRender ? tagsToRender.join("\n") : "";
};

const $$Astro$w = createAstro("https://yuxxeun.now.sh/");
const $$AstroSeo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$w, $$props, $$slots);
  Astro2.self = $$AstroSeo;
  const {
    title,
    noindex = false,
    nofollow,
    robotsProps,
    description,
    canonical,
    openGraph,
    facebook,
    twitter,
    additionalMetaTags,
    titleTemplate,
    defaultTitle,
    mobileAlternate,
    languageAlternates,
    additionalLinkTags
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(buildTags({
    title,
    noindex,
    nofollow,
    robotsProps,
    description,
    canonical,
    facebook,
    openGraph,
    additionalMetaTags,
    twitter,
    titleTemplate,
    defaultTitle,
    mobileAlternate,
    languageAlternates,
    additionalLinkTags
  }))}` })}`;
}, "D:/CRACK/DEV/basement/node_modules/@astrolib/seo/src/AstroSeo.astro");

function resolveSize(transform) {
  if (transform.width && transform.height) {
    return transform;
  }
  if (!transform.width && !transform.height) {
    throw new Error(`"width" and "height" cannot both be undefined`);
  }
  if (!transform.aspectRatio) {
    throw new Error(
      `"aspectRatio" must be included if only "${transform.width ? "width" : "height"}" is provided`
    );
  }
  let aspectRatio;
  if (typeof transform.aspectRatio === "number") {
    aspectRatio = transform.aspectRatio;
  } else {
    const [width, height] = transform.aspectRatio.split(":");
    aspectRatio = Number.parseInt(width) / Number.parseInt(height);
  }
  if (transform.width) {
    return {
      ...transform,
      width: transform.width,
      height: Math.round(transform.width / aspectRatio)
    };
  } else if (transform.height) {
    return {
      ...transform,
      width: Math.round(transform.height * aspectRatio),
      height: transform.height
    };
  }
  return transform;
}
async function resolveTransform(input) {
  if (typeof input.src === "string") {
    return resolveSize(input);
  }
  const metadata = "then" in input.src ? (await input.src).default : input.src;
  let { width, height, aspectRatio, background, format = metadata.format, ...rest } = input;
  if (!width && !height) {
    width = metadata.width;
    height = metadata.height;
  } else if (width) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    height = height || Math.round(width / ratio);
  } else if (height) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    width = width || Math.round(height * ratio);
  }
  return {
    ...rest,
    src: metadata.src,
    width,
    height,
    aspectRatio,
    format,
    background
  };
}
async function getImage(transform) {
  var _a, _b, _c;
  if (!transform.src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  let loader = (_a = globalThis.astroImage) == null ? void 0 : _a.loader;
  if (!loader) {
    const { default: mod } = await Promise.resolve().then(() => sharp).catch(() => {
      throw new Error(
        "[@astrojs/image] Builtin image loader not found. (Did you remember to add the integration to your Astro config?)"
      );
    });
    loader = mod;
    globalThis.astroImage = globalThis.astroImage || {};
    globalThis.astroImage.loader = loader;
  }
  const resolved = await resolveTransform(transform);
  const attributes = await loader.getImageAttributes(resolved);
  const isDev = (_b = (Object.assign({"PUBLIC_SUPABASE_URL":"https://kiuugqblxerrsztkhslu.supabase.co","PUBLIC_SUPABASE_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdXVncWJseGVycnN6dGtoc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY5Mjc1ODcsImV4cCI6MTk3MjUwMzU4N30.U1n1YHNId1aApLCXtVVCQ_3ohNTnQ891UDmdTVeVShY","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":"\"https://yuxxeun.now.sh/\""},{SSR:true,}))) == null ? void 0 : _b.DEV;
  const isLocalImage = !isRemoteImage(resolved.src);
  const _loader = isDev && isLocalImage ? globalThis.astroImage.defaultLoader : loader;
  if (!_loader) {
    throw new Error("@astrojs/image: loader not found!");
  }
  const { searchParams } = isSSRService(_loader) ? _loader.serializeTransform(resolved) : globalThis.astroImage.defaultLoader.serializeTransform(resolved);
  const imgSrc = !isLocalImage && resolved.src.startsWith("//") ? `https:${resolved.src}` : resolved.src;
  let src;
  if (/^[\/\\]?@astroimage/.test(imgSrc)) {
    src = `${imgSrc}?${searchParams.toString()}`;
  } else {
    searchParams.set("href", imgSrc);
    src = `/_image?${searchParams.toString()}`;
  }
  if ((_c = globalThis.astroImage) == null ? void 0 : _c.addStaticImage) {
    src = globalThis.astroImage.addStaticImage(resolved);
  }
  return {
    ...attributes,
    src
  };
}

async function resolveAspectRatio({ src, aspectRatio }) {
  if (typeof src === "string") {
    return parseAspectRatio(aspectRatio);
  } else {
    const metadata = "then" in src ? (await src).default : src;
    return parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
  }
}
async function resolveFormats({ src, formats }) {
  const unique = new Set(formats);
  if (typeof src === "string") {
    unique.add(extname(src).replace(".", ""));
  } else {
    const metadata = "then" in src ? (await src).default : src;
    unique.add(extname(metadata.src).replace(".", ""));
  }
  return Array.from(unique).filter(Boolean);
}
async function getPicture(params) {
  const { src, alt, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required. ex: `widths={[100]}`");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  const allFormats = await resolveFormats(params);
  const lastFormat = allFormats[allFormats.length - 1];
  const maxWidth = Math.max(...widths);
  let image;
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          alt,
          format,
          width,
          fit,
          position,
          background,
          aspectRatio
        });
        if (format === lastFormat && width === maxWidth) {
          image = img;
        }
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const sources = await Promise.all(allFormats.map((format) => getSource(format)));
  return {
    sources,
    image
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** */
const getProjectRootDir = () => {

	return path.join(__dirname, '../') 
};

const __srcFolder = path.join(getProjectRootDir(), '/src');

/** */
const getRelativeUrlByFilePath = (filepath) => {
	if (filepath) {
		return filepath.replace(__srcFolder, '')
	}

	return null
};

const defaultImageSrc = {"src":"/_astro/gradient.c6552caf.jpg","width":7183,"height":2885,"format":"jpg","orientation":1};

const gradient = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: defaultImageSrc
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$v = createAstro("https://yuxxeun.now.sh/");
const $$Fonts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$v, $$props, $$slots);
  Astro2.self = $$Fonts;
  return renderTemplate`<!-- Or Google Fonts -->`;
}, "D:/CRACK/DEV/basement/src/components/atoms/Fonts.astro");

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$u = createAstro("https://yuxxeun.now.sh/");
const $$ExtraMetaTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$u, $$props, $$slots);
  Astro2.self = $$ExtraMetaTags;
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<link rel="shortcut icon"', '>\n<link rel="icon" type="image/svg+xml"', '>\n<link rel="mask-icon"', ' color="#8D46E7">\n<script async defer data-website-id="139c3613-6e93-4760-8483-8b56c67aa1d0" src="https://v-umami.netlify.app/umami.js"><\/script>'])), addAttribute(`${SITE.basePathname}favicon.ico`, "href"), addAttribute(`${SITE.basePathname}favicon.ico`, "href"), addAttribute(`${SITE.basePathname}favicon.ico`, "href"));
}, "D:/CRACK/DEV/basement/src/components/atoms/ExtraMetaTags.astro");

const $$Astro$t = createAstro("https://yuxxeun.now.sh/");
const $$MetaTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$t, $$props, $$slots);
  Astro2.self = $$MetaTags;
  const { src: defaultImage } = await getImage({
    src: defaultImageSrc,
    width: 1200,
    height: 628
  });
  const {
    title = SITE.title,
    description = SITE.description,
    image: _image = defaultImage,
    canonical,
    noindex = false,
    nofollow = false,
    ogTitle = title,
    ogType = "website"
  } = Astro2.props;
  const image = typeof _image === "string" ? new URL(_image, Astro2.site) : _image && typeof _image["src"] !== "undefined" ? new URL(getRelativeUrlByFilePath(_image.src), Astro2.site) : null;
  return renderTemplate`<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site"${addAttribute(SITE.origin, "content")}>
<meta name="twitter:creator"${addAttribute(SITE.name, "content")}>
<meta name="twitter:title"${addAttribute(SITE.title, "content")}>
<meta name="twitter:description"${addAttribute(SITE.description, "content")}>
<meta name="twitter:image" content="https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/gradient.jpg?raw=true">
<link rel="sitemap" href="/sitemap-index.xml">

${renderComponent($$result, "AstroSeo", $$AstroSeo, { "title": title, "description": description, "canonical": canonical, "noindex": noindex, "nofollow": nofollow, "openGraph": {
    url: canonical,
    title: ogTitle,
    description,
    type: ogType,
    images: image ? [
      {
        url: image.toString(),
        alt: ogTitle
      }
    ] : void 0,
    site_name: "yuxxeun\xAE"
  }, "twitter": {
    handle: "yuxxeun\xAE",
    site: "https://yuxxeun.now.sh",
    cardType: image ? "summary_large_image" : void 0
  } })}

${renderComponent($$result, "Fonts", $$Fonts, {})}
${renderComponent($$result, "ExtraMetaTags", $$ExtraMetaTags, {})}`;
}, "D:/CRACK/DEV/basement/src/components/core/MetaTags.astro");

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$s = createAstro("https://yuxxeun.now.sh/");
const $$BasicScripts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
  Astro2.self = $$BasicScripts;
  return renderTemplate(_a || (_a = __template([`<script>
	// Set "light" theme as default
	// if (!localStorage.theme) {
	//   localStorage.theme = "light";
	// }

	if (
		localStorage.theme === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	) {
		document.documentElement.classList.add('dark')
	} else {
		document.documentElement.classList.remove('dark')
	}

	function attachEvent(selector, event, fn) {
		const matches = document.querySelectorAll(selector)
		if (matches && matches.length) {
			matches.forEach((elem) => {
				elem.addEventListener(event, () => fn(elem), false)
			})
		}
	}

	window.onload = function () {
		attachEvent('[data-aw-toggle-menu]', 'click', function (elem) {
			elem.classList.toggle('expanded')
			document.body.classList.toggle('overflow-hidden')
			document.getElementById('header')?.classList.toggle('h-screen')
			document.querySelector('#header nav')?.classList.toggle('hidden')
		})

		attachEvent('[data-aw-toggle-color-scheme]', 'click', function () {
			document.documentElement.classList.toggle('dark')
			localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
		})
	}
	window.onpageshow = function () {
		const elem = document.querySelector('[data-aw-toggle-menu]')
		if (elem) {
			elem.classList.remove('expanded')
		}
		document.body.classList.remove('overflow-hidden')
		document.getElementById('header')?.classList.remove('h-screen')
		document.querySelector('#header nav')?.classList.add('hidden')
	}
<\/script>`])));
}, "D:/CRACK/DEV/basement/src/components/core/BasicScripts.astro");

const $$Astro$r = createAstro("https://yuxxeun.now.sh/");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { meta = {} } = Astro2.props;
  return renderTemplate`<html lang="en" class="motion-safe:scroll-smooth 2xl:text-[20px]">
	<head>
		${renderComponent($$result, "MetaTags", $$MetaTags, { ...meta })}
	${renderHead($$result)}</head>

	<body class="antialiased text-gray-900 dark:text-slate-300 tracking-tight bg-white dark:bg-black">
		${renderSlot($$result, $$slots["default"])}
		${renderComponent($$result, "BasicScripts", $$BasicScripts, {})}
		
	</body>
</html>`;
}, "D:/CRACK/DEV/basement/src/layouts/BaseLayout.astro");

const $$Astro$q = createAstro("https://yuxxeun.now.sh/");
const $$Logo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$Logo;
  Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<span class="self-center ml-2 text-2xl text-gray-900 hover:text-oranged dark:hover:text-oranged whitespace-nowrap font-basement hover:ease-in-out hover:duration-150 transition duration-150 ease-in-linear tracking-normal dark:text-white">${`${SITE.brand}`}
</span>`;
}, "D:/CRACK/DEV/basement/src/components/atoms/Logo.astro");

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get$1(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load$2(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get;
    try {
      const files = /* #__PURE__ */ Object.assign({

});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get = mod.default;
    } catch (e) {
    }
    if (typeof get === "undefined") {
      get = get$1.bind(null, pack);
    }
    const contents = await get(name);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$p = createAstro("https://yuxxeun.now.sh/");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load$2(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "D:/CRACK/DEV/basement/node_modules/astro-icon/lib/Icon.astro");

const AstroIcon = Symbol("AstroIcon");
function trackSprite(result, name) {
  if (typeof result[AstroIcon] !== "undefined") {
    result[AstroIcon]["sprites"].add(name);
  } else {
    result[AstroIcon] = {
      sprites: /* @__PURE__ */ new Set([name])
    };
  }
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(result) {
  if (typeof result[AstroIcon] !== "undefined") {
    return Array.from(result[AstroIcon]["sprites"]);
  }
  const pathname = result._metadata.pathname;
  if (!warned.has(pathname)) {
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(pathname);
  }
  return [];
}

const $$Astro$o = createAstro("https://yuxxeun.now.sh/");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites($$result);
  const icons = await Promise.all(names.map((name) => {
    return load$2(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(`display: none; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}
</svg>`;
}, "D:/CRACK/DEV/basement/node_modules/astro-icon/lib/Spritesheet.astro");

const $$Astro$n = createAstro("https://yuxxeun.now.sh/");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}`;
}, "D:/CRACK/DEV/basement/node_modules/astro-icon/lib/SpriteProvider.astro");

const $$Astro$m = createAstro("https://yuxxeun.now.sh/");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite($$result, name);
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
}, "D:/CRACK/DEV/basement/node_modules/astro-icon/lib/Sprite.astro");

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$l = createAstro("https://yuxxeun.now.sh/");
const $$ToggleTheme = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$ToggleTheme;
  const {
    label = "Toggle between Dark and Light mode",
    class: className = "text-gray-500 focus:outline-none dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:ring-4 hover:ring-oranged rounded-lg text-sm p-2.5 inline-flex items-center",
    iconClass = "w-6 h-6",
    iconName = "tabler:sun"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<button type="button"${addAttribute(className, "class")}${addAttribute(label, "aria-label")} data-aw-toggle-color-scheme>
	${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "class": iconClass })}
</button>`;
}, "D:/CRACK/DEV/basement/src/components/core/ToggleTheme.astro");

const $$Astro$k = createAstro("https://yuxxeun.now.sh/");
const $$ToggleMenu = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$ToggleMenu;
  const {
    label = "Toggle Menu",
    class: className = "ml-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center transition",
    iconClass = "w-6 h-6",
    iconName = "tabler:menu"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<button type="button"${addAttribute(className, "class")}${addAttribute(label, "aria-label")} data-aw-toggle-menu>
	${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "class": iconClass, "optimize": false })}
</button>`;
}, "D:/CRACK/DEV/basement/src/components/core/ToggleMenu.astro");

const $$Astro$j = createAstro("https://yuxxeun.now.sh/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead($$result)}<header class="sticky sm:sticky top-0 z-40 flex-none mx-auto w-full bg-white/30 backdrop-blur-lg md:bg-white/30 dark:bg-black/30 dark:md:bg-black/30 border-b border-gray-300 md:backdrop-blur-md dark:border-b dark:border-white" id="header">
	<div class="py-3 px-3 mx-auto w-full md:flex md:justify-between max-w-6xl md:px-4">
		<div class="flex justify-between">
			<a class="flex text-2xl font-bold items-center"${addAttribute(getHomePermalink(), "href")}>
				${renderComponent($$result, "Logo", $$Logo, {})}
			</a>
			<div class="flex items-center md:hidden">
				${renderComponent($$result, "ToggleTheme", $$ToggleTheme, {})}
				${renderComponent($$result, "ToggleMenu", $$ToggleMenu, {})}
			</div>
		</div>
		<nav class="items-center hidden uppercase font-display tracking-wide w-full md:w-auto md:h-auto md:flex text-black dark:text-white h-screen" aria-label="Main navigation">
			<ul class="flex flex-col pt-8 md:pt-0 md:flex-row md:self-center w-full md:w-auto text-xl md:text-base">
				<li class="hover:ease-in-out hover:duration-150">
					<a class="px-4 py-3 flex hover:text-oranged items-center transition duration-150 ease-in-out"${addAttribute(getPermalink("/"), "href")}>home</a>
				</li>
				<li class="hover:ease-in-out hover:duration-150">
					<a class="px-4 py-3 flex hover:text-oranged items-center transition duration-150 ease-in-linear" rel="prefetch"${addAttribute(getBlogPermalink(), "href")}>laboratory</a>
				</li>
				<li class="md:hidden">
					<a class="hover:text-oranged px-4 py-3 flex items-center transition duration-150 ease-in-out" rel="prefetch" href="https://github.com/yuxxeun">github
					</a>
				</li>
			</ul>
			<div class="md:self-center flex items-center mb-4 md:mb-0 ml-2">
				<div class="hidden items-center md:flex">
					${renderComponent($$result, "ToggleTheme", $$ToggleTheme, { "iconClass": "w-5 h-5" })}
				</div>
			</div>
		</nav>
	</div>
</header>`;
}, "D:/CRACK/DEV/basement/src/components/widgets/Header.astro");

const $$Astro$i = createAstro("https://yuxxeun.now.sh/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer class="border-t font-delight border-black dark:border-white">
	<div class="max-w-6xl x-10 mx-auto px-4 sm:px-6">
		<div class="md:flex md:items-center md:justify-between py-6 md:py-8">
			<ul class="flex mb-4 md:order-1 -ml-2 md:ml-4 md:mb-0">
				<li>
					<a class="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Github" href="https://github.com/yuxxeun">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-github", "title": "github", "class": "w-6 h-6 text-oranged" })}
					</a>
				</li>
				<li>
					<a class="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="WE ARE VERO" href="https://github.com/wearevero">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:diamond", "title": "WE ARE VERO", "class": "w-6 h-6 text-oranged" })}
					</a>
				</li>
				<li>
					<a class="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Bookmarks" href="/bookmark">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:books", "disable": true, "title": "bookmarks", "class": "w-6 h-6 text-oranged" })}
					</a>
				</li>
				<li>
					<a class="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Journey" href="https://poly.work/yuxxeun">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:3d-cube-sphere", "title": "Journey", "class": "w-6 h-6 text-oranged" })}
					</a>
				</li>
				<li>
					<a class="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="RSS" href="/rss.xml">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:rss", "title": "RSS", "class": "w-6 h-6 text-oranged" })}
					</a>
				</li>
			</ul>
			<div class="text-md uppercase tracking-wide text-black mr-4 dark:text-white">
				v1.0.0.1 ㅡ the light that comes from downstairs.
			</div>
		</div>
	</div>
</footer>`;
}, "D:/CRACK/DEV/basement/src/components/widgets/Footer.astro");

const $$Astro$h = createAstro("https://yuxxeun.now.sh/");
const $$PageLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$PageLayout;
  const { meta } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, {})}${maybeRenderHead($$result2)}<main>
		${renderSlot($$result2, $$slots["default"])}
	</main>${renderComponent($$result2, "Footer", $$Footer, {})}` })}`;
}, "D:/CRACK/DEV/basement/src/layouts/PageLayout.astro");

const $$Astro$g = createAstro("https://yuxxeun.now.sh/");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    sizes,
    widths,
    aspectRatio = 1,
    formats = ["avif", "webp"],
    loading = "lazy",
    decoding = "async",
    class: className = "",
    ...attrs
  } = Astro2.props;
  let picture = null;
  try {
    picture = src && await getPicture({
      src,
      widths,
      formats,
      aspectRatio
    });
  } catch (e) {
  }
  const { image = {}, sources = [] } = picture || {};
  return renderTemplate`${src && image?.src && renderTemplate`${maybeRenderHead($$result)}<picture${spreadAttributes(attrs)}>
			${sources.map((attrs2) => renderTemplate`<source${spreadAttributes(attrs2)}${addAttribute(sizes, "sizes")}>`)}
			<img${spreadAttributes(image)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}${addAttribute(alt, "alt")}${addAttribute(className, "class")}>
		</picture>`}`;
}, "D:/CRACK/DEV/basement/src/components/core/Picture.astro");

const $$Astro$f = createAstro("https://yuxxeun.now.sh/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead($$result)}<section>
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<div class="py-12 md:py-20">
			<div>
				<div class="relative mb-5 m-auto max-w-xs p-3">
					${renderComponent($$result, "Picture", $$Picture, { "onclick": "{alert('thank you for coming, but hey, hows your day?')}", "src": import('../krido.5035a6b2.mjs'), "class": "mx-auto grayscale cursor-pointer p-1 rounded-full dark:bg-black w-full", "widths": [400, 768], "sizes": " (max-width: 767px) 400px, 768px", "alt": "yuxxeun cute avatar", "loading": "lazy", "aspectRatio": "1:1" })}
				</div>
			</div>
			<div class="text-center pb-10 md:pb-16">
				<h1 class="text-4xl uppercase font-display text-oranged md:text-[3.50rem] leading-tighter tracking-tighter mb-1 md:mb-2 font-heading">
					yuxxeun
				</h1>
				<div class="max-w-3xl mx-auto">
					<p class="lg:text-xl text-lg uppercase tracking-tight text-black font-delight mb-8 dark:text-white">
						constantly challenging my standards.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>`;
}, "D:/CRACK/DEV/basement/src/components/widgets/Hero.astro");

const $$Astro$e = createAstro("https://yuxxeun.now.sh/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Index;
  const meta = {
    title: SITE.title,
    description: SITE.description,
    canonical: getCanonical(getHomePermalink()),
    image: SITE.image
  };
  inject();
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Hero", $$Hero, {})}` })}`;
}, "D:/CRACK/DEV/basement/src/pages/index.astro");

const $$file$7 = "D:/CRACK/DEV/basement/src/pages/index.astro";
const $$url$7 = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$7,
  url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

function noop() { }
function is_promise(value) {
    return value && typeof value === 'object' && typeof value.then === 'function';
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
Promise.resolve();
const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;
/**
 * Note: this method is performance sensitive and has been optimized
 * https://github.com/sveltejs/svelte/pull/5701
 */
function escape(value, is_attr = false) {
    const str = String(value);
    const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
    pattern.lastIndex = 0;
    let escaped = '';
    let last = 0;
    while (pattern.test(str)) {
        const i = pattern.lastIndex - 1;
        const ch = str[i];
        escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : (ch === '"' ? '&quot;' : '&lt;'));
        last = i + 1;
    }
    return escaped + str.substring(last);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(context || (parent_component ? parent_component.$$.context : [])),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, $$slots, context);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    const assignment = (boolean && value === true) ? '' : `="${escape(value, true)}"`;
    return ` ${name}${assignment}`;
}

const supabase = createClient("https://kiuugqblxerrsztkhslu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdXVncWJseGVycnN6dGtoc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY5Mjc1ODcsImV4cCI6MTk3MjUwMzU4N30.U1n1YHNId1aApLCXtVVCQ_3ohNTnQ891UDmdTVeVShY");

/* src/components/widgets/Bookmark.svelte generated by Svelte v3.52.0 */

const Bookmark = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	async function getData() {
		const { data, error } = await supabase.from('books').select('*').order('time', { ascending: false });
		if (error) throw new Error(error.message);
		return data;
	}

	const promise = getData();

	const meta = {
		title: `Bookmark — ${SITE.name}`,
		description: SITE.description,
		ogType: 'Bookmark'
	};

	return `<section class="${"mx-auto font-delight tracking-wide my-10"}"><div class="${"text-center"}"><span class="${"font-display lg:text-6xl px-auto text-2xl text-center uppercase tracking-tight text-oranged"}">${escape(meta.ogType)}</span></div>
	<div class="${"max-w-6xl mx-auto text-left sm:px-6"}">${(function (__value) {
		if (is_promise(__value)) {
			__value.then(null, noop);

			return `
			<div class="${"my-3"}"><img src="${"/loading.svg"}" class="${"animate-spin mx-auto my-10"}" alt="${"Reactivity...."}" width="${"200"}"></div>
		`;
		}

		return (function (data) {
			return `
			${each(data, book => {
				return `<ul class="${"my-5 py-5"}"><li class="${"__inter"}"><div class="${"px-4 sm:px-6"}"><h3 class="${"text-lg lg:text-2xl font-display leading-6text-black dark:text-white"}"><a${add_attribute("href", book.link, 0)} target="${"blank"}" class="${"hover:text-gray-500"}">${escape(book.title)} by ${escape(book.author)}
								</a></h3>
							<p class="${"my-3 px-2 lg:max-w-3xl max-w-sm truncate font-delight text-md w-fit text-oranged hover:text-black dark:hover:text-white dark:text-oranged bg-oranged/30 dark:bg-oranged/20 border border-oranged rounded-lg"}"><a${add_attribute("href", book.link, 0)} target="${"blank"}">${escape(book.link)}
								</a></p>
							<p class="${"max-w-2xl font-delight tracking-wide text-md text-gray-500"}">${escape(book.time)}</p>
						</div></li>
				</ul>`;
			})}
		`;
		})(__value);
	})(promise)}</div></section>`;
});

const $$Astro$d = createAstro("https://yuxxeun.now.sh/");
const $$Bookmark = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Bookmark;
  const meta = {
    title: `Bookmark \u2014 ${SITE.name}`,
    description: SITE.description,
    ogType: "Bookmark"
  };
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="max-w-6xl mx-auto px-4 sm:px-6">
		${renderComponent($$result2, "Bookmark", Bookmark, { "client:load": true, "client:component-hydration": "load", "client:component-path": "~/components/widgets/Bookmark.svelte", "client:component-export": "default" })}
	</div>` })}`;
}, "D:/CRACK/DEV/basement/src/pages/bookmark.astro");

const $$file$6 = "D:/CRACK/DEV/basement/src/pages/bookmark.astro";
const $$url$6 = "/bookmark";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Bookmark,
  file: $$file$6,
  url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const html$9 = "<p>Arabella’s got some interstellar-gator skin boots</p>\n<p>And a Helter Skelter ‘round her little finger and I ride it endlessly</p>\n<p>She’s got a Barbarella silver swimsuit</p>\n<p>And when she needs to shelter from reality</p>\n<p>She takes a dip in my daydreams</p>\n<p>My days end best when this sunset gets itself</p>\n<p>Behind that little lady sitting on the passenger side</p>\n<p>It’s much less picturesque without her catching the light</p>\n<p>The horizon tries but it’s just not as kind on the eyes</p>\n<p>As Arabella</p>\n<p>Arabella</p>\n<p>Just might have tapped into your mind and soul</p>\n<p>You can’t be sure</p>\n<p>Arabella’s got a seventies head</p>\n<p>But she’s a modern lover</p>\n<p>It’s an exploration, she’s made of outer space</p>\n<p>And her lips are like the galaxy’s edge</p>\n<p>And her kiss the color of a constellation falling into place</p>\n<p>My days end best when this sunset gets itself</p>\n<p>Behind that little lady sitting on the passenger side</p>\n<p>It’s much less picturesque without her catching the light</p>\n<p>The horizon tries but it’s just not as kind on the eyes</p>\n<p>As Arabella</p>\n<p>As Arabella</p>\n<p>Just might have tapped into your mind and soul</p>\n<p>You can’t be sure</p>\n<p>That’s magic in a cheetah print coat</p>\n<p>Just a slip underneath it I hope</p>\n<p>Asking if I can have one of those</p>\n<p>Organic cigarettes that she smokes</p>\n<p>Wraps her lips round the Mexican coke</p>\n<p>Makes you wish that you were the bottle</p>\n<p>Takes a sip of your soul and it sounds like</p>\n<p>I just might have tapped into your mind and soul</p>\n<p>You can’t be sure</p>";

				const frontmatter$9 = {"pubDate":"Oct 6 2022","title":"Arabella","description":"Arabella's got some interstellar-gator skin","excerpt":"Arabella's got some interstellar-gator skin","image":"~/assets/images/arabella.jpg","tags":["music"]};
				const file$9 = "D:/CRACK/DEV/basement/data/blog/arabella.md";
				const url$9 = undefined;
				function rawContent$9() {
					return "\r\nArabella's got some interstellar-gator skin boots\r\n\r\nAnd a Helter Skelter 'round her little finger and I ride it endlessly\r\n\r\nShe's got a Barbarella silver swimsuit\r\n\r\nAnd when she needs to shelter from reality\r\n\r\nShe takes a dip in my daydreams\r\n\r\nMy days end best when this sunset gets itself\r\n\r\nBehind that little lady sitting on the passenger side\r\n\r\nIt's much less picturesque without her catching the light\r\n\r\nThe horizon tries but it's just not as kind on the eyes\r\n\r\nAs Arabella\r\n\r\nArabella\r\n\r\nJust might have tapped into your mind and soul\r\n\r\nYou can't be sure\r\n\r\nArabella's got a seventies head\r\n\r\nBut she's a modern lover\r\n\r\nIt's an exploration, she's made of outer space\r\n\r\nAnd her lips are like the galaxy's edge\r\n\r\nAnd her kiss the color of a constellation falling into place\r\n\r\nMy days end best when this sunset gets itself\r\n\r\nBehind that little lady sitting on the passenger side\r\n\r\nIt's much less picturesque without her catching the light\r\n\r\nThe horizon tries but it's just not as kind on the eyes\r\n\r\nAs Arabella\r\n\r\nAs Arabella\r\n\r\nJust might have tapped into your mind and soul\r\n\r\nYou can't be sure\r\n\r\nThat's magic in a cheetah print coat\r\n\r\nJust a slip underneath it I hope\r\n\r\nAsking if I can have one of those\r\n\r\nOrganic cigarettes that she smokes\r\n\r\nWraps her lips round the Mexican coke\r\n\r\nMakes you wish that you were the bottle\r\n\r\nTakes a sip of your soul and it sounds like\r\n\r\nI just might have tapped into your mind and soul\r\n\r\nYou can't be sure";
				}
				function compiledContent$9() {
					return html$9;
				}
				function getHeadings$9() {
					return [];
				}
				async function Content$9() {
					const { layout, ...content } = frontmatter$9;
					content.file = file$9;
					content.url = url$9;
					const contentFragment = createVNode(Fragment, { 'set:html': html$9 });
					return contentFragment;
				}
				Content$9[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$9,
  compiledContent: compiledContent$9,
  default: Content$9,
  file: file$9,
  frontmatter: frontmatter$9,
  getHeadings: getHeadings$9,
  rawContent: rawContent$9,
  url: url$9
}, Symbol.toStringTag, { value: 'Module' }));

const html$8 = "<p>Dalam mempelajari sesuatu, tidak jarang kita mempertanyakan apa yang ingin dicapai setelah mempelajari sesuatu tersebut. Entah sekadar untuk kepentingan ujian, kepentingan pribadi, ataupun bekal untuk praktik.</p>\n<p>Pengetahuan menurut definisi dari Wikipedia adalah informasi atau maklumat yang diketahui atau disadari oleh seseorang. Singkatnya, jika kamu memiliki pengetahuan tentang cara menggunakan komputer, berarti kamu memiliki informasi tentang cara menggunakan komputer tersebut.</p>\n<p>Pengetahuan pada dasarnya bersifat netral. Di sebagian kasus, justru tidak ada baik/buruk ataupun benar/salah terhadap pengetahuan itu sendiri. Seperti, apakah baik atau buruk bila mengetahui cara mencuri?</p>\n<p>Jawabannya selalu tergantung.</p>\n<h2 id=\"to-or-not-to\">To or not to</h2>\n<p>Anggap kamu memiliki pengetahuan terkait keamanan pada sebuah aplikasi. Kamu tau informasi terkait celah-celah keamanan yang terdapat pada suatu aplikasi, kamu tau aksi apa saja yang bisa dilakukan, kamu tau cara mencari pola nya, dsb.</p>\n<p>Berdasarkan informasi tersebut, setidaknya ada 2 aksi yang bisa kamu pilih: menutup celahnya atau meng-eksploitasinya.</p>\n<p>Dan pilihannya selalu tergantung.</p>\n<p>Khususnya tergantung apa yang ingin dicapai dari aksi tersebut.</p>\n<p>Berdasarkan pertimbangan tersebut, bisa dikatakan pengetahuan seperti pisau bermata dua.</p>\n<p>Seseorang yang mengetahui cara membobol suatu sistem bisa digunakan pengetahuannya untuk meng-eksploitasi ataupun untuk menutup bagian sistem yang rentan tersebut.</p>\n<p>Seseorang yang mengetahui cara melakukan korupsi bisa digunakan pengetahuannya untuk memberantas dan atau mencegah ataupun untuk melakukan korupsi.</p>\n<p>Seseorang yang mengetahui tentang riba, bisa digunakan pengetahuannya untuk menghindari riba ataupun untuk mendapatkan keuntungan dari praktik riba tersebut.</p>\n<p>Kamu tidak akan mengkhawatirkan dampak dari riba ketika kamu tidak mengetahuinya.</p>\n<p>Kamu tidak akan meninggalkan ibadah ketika kamu mengetahui apa yang terjadi bila melakukannya.</p>\n<p>Karena sekali lagi, pengetahuan seperti pisau bermata dua.</p>\n<p>Dan apa yang ingin dituju berdasarkan pengetahuan tersebut jawabannya adalah selalu tergantung.</p>\n<h2 id=\"sometimes-silence-is-gold\">Sometimes silence is gold</h2>\n<p>Selain baik/buruk dan benar/salah, salah satu sifat dari sebuah pengetahuan adalah confidentiality. Ada pengetahuan yang bersifat terbuka untuk umum dan ada yang bersifat rahasia. Dan sekali lagi, alasannya adalah selalu tergantung.</p>\n<p>Pengetahuan yang bersifat terbuka bisa didapat dari mana saja, buku pelajaran; artikel di internet, apapun.</p>\n<p>Untuk pengetahuan yang bersifat rahasia, selain sumbernya sangat terbatas juga distribusinya. Tidak sembarang orang yang boleh mengetahui dan memberitahu terkait informasi tersebut.</p>\n<p>Contoh pengetahuan yang bersifat rahasia sangat beragam. Dari “rahasia negara” sampai strategi bisnis dari sebuah perusahaan. Jika informasi tersebut sangat terbatas dalam siapa yang boleh mengetahui dan memberitahukan, besar kemungkinan informasi tersebut bersifat rahasia.</p>\n<p>Mengapa informasi tersebut ada yang bersifat terbuka/umum dan rahasia? Sekali lagi, jawabannya selalu tergantung.</p>\n<p>Namun di kebanyakan kasus, tujuannya adalah untuk menghindari penyalahgunaan dari informasi tersebut. Untuk menghindari penggunaan informasi yang bukan untuk semestinya.</p>\n<p>Berdasarkan pertimbangan tersebut, terkadang diam itu baik.</p>\n<p>Atau lebih spesifiknya, diam untuk menandakan bahwa kita seperti tidak tahu padahal tahu.</p>\n<h2 id=\"facts-in-everyday-things\">Facts in everyday things</h2>\n<p>Sampai hari ini gue pribadi tidak tahu tentang dampak dari praktik riba. Of course gue bisa mengetahuinya, apalagi di era teknologi informasi seperti sekarang. Namun gue tau sedikit tentang bahaya dari riba, dan setelah mengetahuinya, gue belum ingin menggali lebih dalam terkait informasi seputar riba tersebut.</p>\n<p>Di kasus lain yang sedang dialami oleh teman gue adalah mencari kabar tentang mantannya. Teman gue ingin mengetahui kabar tentang mantannya tersebut karena… dia ingin tahu informasi terbarunya terkait mantannya tersebut. Of course.</p>\n<p>Gue mengambil contoh menggunakan 2 kasus diatas karena 2 hal tersebut dampaknya seringkali mengarah ke hal yang kurang mengenakkan ketika sudah mengetahui informasinya.</p>\n<p>Ketika sudah mengetahui dampak dari praktik riba, besar kemungkinan kita seharusnya akan menghindari praktik riba tersebut.</p>\n<p>Ketika sudah mengetahui dampak dari stalking mantan tersebut, besar kemungkinan kita seharusnya tidak ingin melakukannya lagi.</p>\n<p>Dan penyesalan selalu di akhir.</p>\n<p>Seharusnya tidak perlu terkejut ketika sudah mengetahuinya karena yang pertama itu adalah faktanya dan kedua karena kamu sudah memilih untuk melakukannya.</p>\n<p>Jika kita mengetahui informasi kapan kita akan mati, besar kemungkinan kita akan terus melakukan kebaikan hanya karena sebentar lagi akan mati, bukan karena melakukan kebaikan adalah sebuah kewajiban.</p>\n<h2 id=\"if-you-know-you-know\">If you know, you know</h2>\n<p>Gue tidak terlalu pandai dalam menyimpan rahasia, tapi setidaknya gue sedikit tahu kapan harus berbicara atau diam. Bagaimana cara gue mengetahuinya? Di banyak kasus, berdasarkan pengalaman, baik dari diri sendiri ataupun orang lain.</p>\n<p>Menyimpan informasi untuk tetap rahasia dan mengetahui kapan dan kepada siapa harus memberitahukannya gue rasa adalah sebuah keterampilan yang harus terus diasah. Selain karena alasan untuk menjaga kepercayaan, juga untuk menyadari bahwa segala sesuatu itu ada waktunya.</p>\n<p>Ada momennya kapan kamu harus membagikan slip gajimu dan kepada siapa.</p>\n<p>Ada momennya kapan kamu harus berbicara dan kepada siapa.</p>\n<p>Dan sebagainya.</p>\n<p>Bagian menarik dari menentukan momen ini adalah dalam pemilihan waktu. Apakah harus menunggu sampai waktu yang pas? Apakah harus menunggu hal lain terlebih dahulu? Bahkan sampai Apakah memang harus diberitahukan?</p>\n<p>Gue teringat cerita SMP dulu ketika salah satu teman dekat gue diberi kabar. Awalnya teman gue disuruh untuk pulang karena suatu alasan, lalu ketika sudah sampai di rumah, barulah dia diberitahukan kabar sebenarnya bahwa  ada berita sedih di keluarganya. Alasan tidak langsung diberitahukannya menurut penjaga asrama tersebut adalah untuk tidak membuat teman gue gelisah. Dan gue rasa, kalau dipikir-pikir memang momen yang tepat untuk memberitahukannya adalah ketika sudah di rumahnya.</p>\n<p>Entah untuk menghindari kejadian yang tak terduga, ataupun untuk, membuatnya dirinya tidak gelisah.</p>\n<p>Pada suatu hari gue pernah memilih untuk diam untuk sesuatu yang sudah gue ketahui. Alasannya sederhana, gue ingin tahu sampai sejauh mana dia terus menutupi kebenaran. Dan setelah momennya tiba, baru gue mulai berbicara.</p>\n<p>Dan momen tersebut adalah ketika gue sudah siap untuk menjalani apa yang akan terjadi setelah gue berbicara tersebut.</p>\n<p>Tanpa perlu penjelasan lebih lanjut.</p>\n<h2 id=\"to-not-giving-a-fuck\">To not giving a fuck</h2>\n<p>Tidak semua yang kita ketahui harus kita terlalu perdulikan.</p>\n<p>Dalam kasus ini biasanya ketika gue berurusan dengan sesuatu yang sepertinya tidak perlu gue ketahui. Yang sering terjadi adalah ketika mempelajari hal baru, misal Kubernetes. Gue tahu sepertinya gue tidak butuh mempelajari Kubernetes, namun gue merasa sepertinya hanya mempelajarinya saja terasa sangat menarik.</p>\n<p>PR ketika akan mendapatkan informasi baru menurut gue ada 2: proses “unlearn” dan perencanaan ulang dalam mengatur prioritas.</p>\n<p>Proses unlearn ini sederhananya adalah sebuah proses dimana kita “melupakan” sebuah pengetahuan entah karena kurang tepat atau karena sudah tidak relevan lagi.</p>\n<p>Ketika 2020, gue selalu memilih Nginx dalam menentukan Reverse Proxy karena selain high performance juga gue cukup hafal dengan sintaksnya. Lalu gue mempelajari hal baru, ada reverse proxy lain seperti Caddy dan Traefik khususnya di era container seperti sekarang. Proses penerimaan teknologi baru tersebut relatif sulit bagi gue. Misal, di fitur provision TLS certs. Gue exactly bisa melakukan apa yang bisa dilakukan di Caddy namun bedanya bila gue biasanya melakukannya secara manual (via certbot) kalau pakai Nginx, di Caddy, itu dilakukan secara otomatis. Dan gue tidak keberatan dengan hal itu.</p>\n<p>Namun seiring dengan berjalannya waktu, gue tahu bahwa Caddy lebih relevan daripada Nginx (ataupun Traefik) jika melihat kebutuhan gue. Perlahan gue melupakan beberapa hal. Pertama, gue melupakan kalau provision TLS certs itu harus manual. Kedua, gue melupakan kalau membuat konfigurasi itu tidak harus sekompleks Nginx. Ketiga, gue melupakan kalau beberapa hal itu tidak harus dilakukan secara manual (seperti provide x-forwarded-host dan host explicitly).</p>\n<p>Dan PR yang lumayan berat dalam kasus gue diatas adalah menghiraukan Traefik. Sebelumnya gue selalu membandingkan perbedaan Caddy dan Traefik, Pro Cons nya, dsb. Gue selalu merasa yakin kalau yang gue butuhkan adalah Traefik bukan Caddy.</p>\n<p>Setelah banyak pertimbangan, gue stick di Caddy.</p>\n<p>Gue lebih memilih menjawab “Gak tau kalau Traefik” daripada harus menjelaskan perbedaan antara Caddy dan Traefik. Banyak tahu itu membahayakan, salah satunya adalah karena kamu akan berurusan dengan sesuatu yang seharusnya bukan urusanmu.</p>\n<h2 id=\"penutup\">Penutup</h2>\n<p>Gue kepikiran menulis ini setelah membahas tentang riba sama teman gue. Membahas tentang mengapa orang-orang korupsi. Membahas tentang kenapa kita berurusan dengan sesuatu yang seharusnya bukan urusan kita. Membahas tentang mengapa lebih menguntungkan jual data yang bocor daripada menyelanggarakan bug bounty.</p>\n<p>Mungkin gue naif karena tidak ingin menerima fakta.</p>\n<p>Tapi di beberapa hal gue lebih memilih untuk diam ataupun tidak mencari tahu daripada seperti menjadi bumerang untuk gue yang mungkin merugikan gue.</p>\n<p>Pengetahuan tidak pernah salah.</p>\n<p>Yang salah selalu subjeknya yang menyalahgunakan pengetahuan tersebut.</p>\n<p>Terkadang memilih untuk diam adalah yang terbaik.</p>\n<p>Entah agar tidak harus berurusan dengan sesuatu yang harusnya bukan urusan kita, ataupun untuk menghindari sesuatu yang menjadi bumerang untuk kita.</p>\n<p>Yang pasti, fakta adalah fakta.</p>\n<p>Dan semuanya membutuhkan momentum.</p>";

				const frontmatter$8 = {"pubDate":"Sep 25 2022","title":"Banyak tahu itu berbahaya","description":"Sometimes silence is gold, indeed.","excerpt":"Sometimes silence is gold, indeed","image":"~/assets/images/banyak-tahu.jpg","tags":["thoughts"]};
				const file$8 = "D:/CRACK/DEV/basement/data/blog/banyak-tahu.md";
				const url$8 = undefined;
				function rawContent$8() {
					return "\r\nDalam mempelajari sesuatu, tidak jarang kita mempertanyakan apa yang ingin dicapai setelah mempelajari sesuatu tersebut. Entah sekadar untuk kepentingan ujian, kepentingan pribadi, ataupun bekal untuk praktik.\r\n\r\nPengetahuan menurut definisi dari Wikipedia adalah informasi atau maklumat yang diketahui atau disadari oleh seseorang. Singkatnya, jika kamu memiliki pengetahuan tentang cara menggunakan komputer, berarti kamu memiliki informasi tentang cara menggunakan komputer tersebut.\r\n\r\nPengetahuan pada dasarnya bersifat netral. Di sebagian kasus, justru tidak ada baik/buruk ataupun benar/salah terhadap pengetahuan itu sendiri. Seperti, apakah baik atau buruk bila mengetahui cara mencuri?\r\n\r\nJawabannya selalu tergantung.\r\n\r\n## To or not to\r\nAnggap kamu memiliki pengetahuan terkait keamanan pada sebuah aplikasi. Kamu tau informasi terkait celah-celah keamanan yang terdapat pada suatu aplikasi, kamu tau aksi apa saja yang bisa dilakukan, kamu tau cara mencari pola nya, dsb.\r\n\r\nBerdasarkan informasi tersebut, setidaknya ada 2 aksi yang bisa kamu pilih: menutup celahnya atau meng-eksploitasinya.\r\n\r\nDan pilihannya selalu tergantung.\r\n\r\nKhususnya tergantung apa yang ingin dicapai dari aksi tersebut.\r\n\r\nBerdasarkan pertimbangan tersebut, bisa dikatakan pengetahuan seperti pisau bermata dua.\r\n\r\nSeseorang yang mengetahui cara membobol suatu sistem bisa digunakan pengetahuannya untuk meng-eksploitasi ataupun untuk menutup bagian sistem yang rentan tersebut.\r\n\r\nSeseorang yang mengetahui cara melakukan korupsi bisa digunakan pengetahuannya untuk memberantas dan atau mencegah ataupun untuk melakukan korupsi.\r\n\r\nSeseorang yang mengetahui tentang riba, bisa digunakan pengetahuannya untuk menghindari riba ataupun untuk mendapatkan keuntungan dari praktik riba tersebut.\r\n\r\nKamu tidak akan mengkhawatirkan dampak dari riba ketika kamu tidak mengetahuinya.\r\n\r\nKamu tidak akan meninggalkan ibadah ketika kamu mengetahui apa yang terjadi bila melakukannya.\r\n\r\nKarena sekali lagi, pengetahuan seperti pisau bermata dua.\r\n\r\nDan apa yang ingin dituju berdasarkan pengetahuan tersebut jawabannya adalah selalu tergantung.\r\n\r\n## Sometimes silence is gold\r\nSelain baik/buruk dan benar/salah, salah satu sifat dari sebuah pengetahuan adalah confidentiality. Ada pengetahuan yang bersifat terbuka untuk umum dan ada yang bersifat rahasia. Dan sekali lagi, alasannya adalah selalu tergantung.\r\n\r\nPengetahuan yang bersifat terbuka bisa didapat dari mana saja, buku pelajaran; artikel di internet, apapun.\r\n\r\nUntuk pengetahuan yang bersifat rahasia, selain sumbernya sangat terbatas juga distribusinya. Tidak sembarang orang yang boleh mengetahui dan memberitahu terkait informasi tersebut.\r\n\r\nContoh pengetahuan yang bersifat rahasia sangat beragam. Dari \"rahasia negara\" sampai strategi bisnis dari sebuah perusahaan. Jika informasi tersebut sangat terbatas dalam siapa yang boleh mengetahui dan memberitahukan, besar kemungkinan informasi tersebut bersifat rahasia.\r\n\r\nMengapa informasi tersebut ada yang bersifat terbuka/umum dan rahasia? Sekali lagi, jawabannya selalu tergantung.\r\n\r\nNamun di kebanyakan kasus, tujuannya adalah untuk menghindari penyalahgunaan dari informasi tersebut. Untuk menghindari penggunaan informasi yang bukan untuk semestinya.\r\n\r\nBerdasarkan pertimbangan tersebut, terkadang diam itu baik.\r\n\r\nAtau lebih spesifiknya, diam untuk menandakan bahwa kita seperti tidak tahu padahal tahu.\r\n\r\n## Facts in everyday things\r\nSampai hari ini gue pribadi tidak tahu tentang dampak dari praktik riba. Of course gue bisa mengetahuinya, apalagi di era teknologi informasi seperti sekarang. Namun gue tau sedikit tentang bahaya dari riba, dan setelah mengetahuinya, gue belum ingin menggali lebih dalam terkait informasi seputar riba tersebut.\r\n\r\nDi kasus lain yang sedang dialami oleh teman gue adalah mencari kabar tentang mantannya. Teman gue ingin mengetahui kabar tentang mantannya tersebut karena... dia ingin tahu informasi terbarunya terkait mantannya tersebut. Of course.\r\n\r\nGue mengambil contoh menggunakan 2 kasus diatas karena 2 hal tersebut dampaknya seringkali mengarah ke hal yang kurang mengenakkan ketika sudah mengetahui informasinya.\r\n\r\nKetika sudah mengetahui dampak dari praktik riba, besar kemungkinan kita seharusnya akan menghindari praktik riba tersebut.\r\n\r\nKetika sudah mengetahui dampak dari stalking mantan tersebut, besar kemungkinan kita seharusnya tidak ingin melakukannya lagi.\r\n\r\nDan penyesalan selalu di akhir.\r\n\r\nSeharusnya tidak perlu terkejut ketika sudah mengetahuinya karena yang pertama itu adalah faktanya dan kedua karena kamu sudah memilih untuk melakukannya.\r\n\r\nJika kita mengetahui informasi kapan kita akan mati, besar kemungkinan kita akan terus melakukan kebaikan hanya karena sebentar lagi akan mati, bukan karena melakukan kebaikan adalah sebuah kewajiban.\r\n\r\n## If you know, you know\r\nGue tidak terlalu pandai dalam menyimpan rahasia, tapi setidaknya gue sedikit tahu kapan harus berbicara atau diam. Bagaimana cara gue mengetahuinya? Di banyak kasus, berdasarkan pengalaman, baik dari diri sendiri ataupun orang lain.\r\n\r\nMenyimpan informasi untuk tetap rahasia dan mengetahui kapan dan kepada siapa harus memberitahukannya gue rasa adalah sebuah keterampilan yang harus terus diasah. Selain karena alasan untuk menjaga kepercayaan, juga untuk menyadari bahwa segala sesuatu itu ada waktunya.\r\n\r\nAda momennya kapan kamu harus membagikan slip gajimu dan kepada siapa.\r\n\r\nAda momennya kapan kamu harus berbicara dan kepada siapa.\r\n\r\nDan sebagainya.\r\n\r\nBagian menarik dari menentukan momen ini adalah dalam pemilihan waktu. Apakah harus menunggu sampai waktu yang pas? Apakah harus menunggu hal lain terlebih dahulu? Bahkan sampai Apakah memang harus diberitahukan?\r\n\r\nGue teringat cerita SMP dulu ketika salah satu teman dekat gue diberi kabar. Awalnya teman gue disuruh untuk pulang karena suatu alasan, lalu ketika sudah sampai di rumah, barulah dia diberitahukan kabar sebenarnya bahwa  ada berita sedih di keluarganya. Alasan tidak langsung diberitahukannya menurut penjaga asrama tersebut adalah untuk tidak membuat teman gue gelisah. Dan gue rasa, kalau dipikir-pikir memang momen yang tepat untuk memberitahukannya adalah ketika sudah di rumahnya.\r\n\r\nEntah untuk menghindari kejadian yang tak terduga, ataupun untuk, membuatnya dirinya tidak gelisah.\r\n\r\nPada suatu hari gue pernah memilih untuk diam untuk sesuatu yang sudah gue ketahui. Alasannya sederhana, gue ingin tahu sampai sejauh mana dia terus menutupi kebenaran. Dan setelah momennya tiba, baru gue mulai berbicara.\r\n\r\nDan momen tersebut adalah ketika gue sudah siap untuk menjalani apa yang akan terjadi setelah gue berbicara tersebut.\r\n\r\nTanpa perlu penjelasan lebih lanjut.\r\n\r\n## To not giving a fuck\r\nTidak semua yang kita ketahui harus kita terlalu perdulikan.\r\n\r\nDalam kasus ini biasanya ketika gue berurusan dengan sesuatu yang sepertinya tidak perlu gue ketahui. Yang sering terjadi adalah ketika mempelajari hal baru, misal Kubernetes. Gue tahu sepertinya gue tidak butuh mempelajari Kubernetes, namun gue merasa sepertinya hanya mempelajarinya saja terasa sangat menarik.\r\n\r\nPR ketika akan mendapatkan informasi baru menurut gue ada 2: proses \"unlearn\" dan perencanaan ulang dalam mengatur prioritas.\r\n\r\nProses unlearn ini sederhananya adalah sebuah proses dimana kita \"melupakan\" sebuah pengetahuan entah karena kurang tepat atau karena sudah tidak relevan lagi.\r\n\r\nKetika 2020, gue selalu memilih Nginx dalam menentukan Reverse Proxy karena selain high performance juga gue cukup hafal dengan sintaksnya. Lalu gue mempelajari hal baru, ada reverse proxy lain seperti Caddy dan Traefik khususnya di era container seperti sekarang. Proses penerimaan teknologi baru tersebut relatif sulit bagi gue. Misal, di fitur provision TLS certs. Gue exactly bisa melakukan apa yang bisa dilakukan di Caddy namun bedanya bila gue biasanya melakukannya secara manual (via certbot) kalau pakai Nginx, di Caddy, itu dilakukan secara otomatis. Dan gue tidak keberatan dengan hal itu.\r\n\r\nNamun seiring dengan berjalannya waktu, gue tahu bahwa Caddy lebih relevan daripada Nginx (ataupun Traefik) jika melihat kebutuhan gue. Perlahan gue melupakan beberapa hal. Pertama, gue melupakan kalau provision TLS certs itu harus manual. Kedua, gue melupakan kalau membuat konfigurasi itu tidak harus sekompleks Nginx. Ketiga, gue melupakan kalau beberapa hal itu tidak harus dilakukan secara manual (seperti provide x-forwarded-host dan host explicitly).\r\n\r\nDan PR yang lumayan berat dalam kasus gue diatas adalah menghiraukan Traefik. Sebelumnya gue selalu membandingkan perbedaan Caddy dan Traefik, Pro Cons nya, dsb. Gue selalu merasa yakin kalau yang gue butuhkan adalah Traefik bukan Caddy.\r\n\r\nSetelah banyak pertimbangan, gue stick di Caddy.\r\n\r\nGue lebih memilih menjawab \"Gak tau kalau Traefik\" daripada harus menjelaskan perbedaan antara Caddy dan Traefik. Banyak tahu itu membahayakan, salah satunya adalah karena kamu akan berurusan dengan sesuatu yang seharusnya bukan urusanmu.\r\n\r\n## Penutup\r\nGue kepikiran menulis ini setelah membahas tentang riba sama teman gue. Membahas tentang mengapa orang-orang korupsi. Membahas tentang kenapa kita berurusan dengan sesuatu yang seharusnya bukan urusan kita. Membahas tentang mengapa lebih menguntungkan jual data yang bocor daripada menyelanggarakan bug bounty.\r\n\r\nMungkin gue naif karena tidak ingin menerima fakta.\r\n\r\nTapi di beberapa hal gue lebih memilih untuk diam ataupun tidak mencari tahu daripada seperti menjadi bumerang untuk gue yang mungkin merugikan gue.\r\n\r\nPengetahuan tidak pernah salah.\r\n\r\nYang salah selalu subjeknya yang menyalahgunakan pengetahuan tersebut.\r\n\r\nTerkadang memilih untuk diam adalah yang terbaik.\r\n\r\nEntah agar tidak harus berurusan dengan sesuatu yang harusnya bukan urusan kita, ataupun untuk menghindari sesuatu yang menjadi bumerang untuk kita.\r\n\r\nYang pasti, fakta adalah fakta.\r\n\r\nDan semuanya membutuhkan momentum.\r\n";
				}
				function compiledContent$8() {
					return html$8;
				}
				function getHeadings$8() {
					return [{"depth":2,"slug":"to-or-not-to","text":"To or not to"},{"depth":2,"slug":"sometimes-silence-is-gold","text":"Sometimes silence is gold"},{"depth":2,"slug":"facts-in-everyday-things","text":"Facts in everyday things"},{"depth":2,"slug":"if-you-know-you-know","text":"If you know, you know"},{"depth":2,"slug":"to-not-giving-a-fuck","text":"To not giving a fuck"},{"depth":2,"slug":"penutup","text":"Penutup"}];
				}
				async function Content$8() {
					const { layout, ...content } = frontmatter$8;
					content.file = file$8;
					content.url = url$8;
					const contentFragment = createVNode(Fragment, { 'set:html': html$8 });
					return contentFragment;
				}
				Content$8[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$8,
  compiledContent: compiledContent$8,
  default: Content$8,
  file: file$8,
  frontmatter: frontmatter$8,
  getHeadings: getHeadings$8,
  rawContent: rawContent$8,
  url: url$8
}, Symbol.toStringTag, { value: 'Module' }));

const html$7 = "<p>Ever since you sit in your comfy room, you have a smart TV; high-end laptops &#x26; PCs, ~100MiB/s internet, comfort chair, even Nintendo Switch. You have a couple of good books to read, interesting thoughts to write, and some crazy reflection to draw.</p>\n<p>But you do nothing.</p>\n<p>You don’t know what to do.</p>\n<p>You spend time sitting in front of stupid computers for 8 hours a day, talking bullshit on the Slack channels every day and writing boring code just like everyone else does. You know who you are in your ~9to5 but the rest you are a nobody.</p>\n<p>Just a name with an empty soul.</p>\n<p>Maybe you have a dream, but you choose to keep your dream, dream.</p>\n<p>Maybe you have friends, but those are just Instagram users.</p>\n<p>Maybe you have a nice watch, but have no time.</p>\n<p>You then realize that you are not as strong as your sweet 17’s.</p>\n<p>You then realize that you don’t have as much time as before though every day is still 24 hours.</p>\n<p>Your energy is spent doing nothing but work.</p>\n<p>You have enough money in your savings, nice stocks to trade, and some cryptocurrencies to keep. You can buy anything yet happiness is always priceless.</p>\n<p>Who the hell needs happiness, anyway?</p>\n<p>Then you see how people live their lives.</p>\n<p>You sure you’re happy yet all you do is laugh.</p>\n<p>Mouth can lie but your heart can’t, as you know.</p>\n<p>There is a strange feeling in your little heart. You don’t know exactly what it is but you’re sure it feel like an emptiness as it’s not your very first time.</p>\n<p>You know what you have to do but you choose to not to.</p>\n<p>You need someone to talk and know it’s not Siri.</p>\n<p>Not even your phone.</p>\n<p>Or your refrigerator.</p>\n<p>You know the name but not the person.</p>\n<p>You have deep regrets but don’t want to change anything.</p>\n<p>You open Netflix but what you want to see is not there</p>\n<p>You open Discord, Telegram, Signal, but no one you want to contact there.</p>\n<p>Nobody knows what happened but you.</p>\n<p>Then you choose to sleep.</p>\n<p>Forget anything and forgive everything.</p>\n<p>Next morning you wake up, eat, and sit in front of stupid computer again.</p>\n<p>You say “new day, new me” yet it’s still the same just like yesterday.</p>\n<p>And then you write this shit and save it in a draft.</p>\n<p>You know it won’t change anything even if you publish it anywhere yet you know it won’t change anything if you keep it in draft anyway.</p>\n<p>You click publish.</p>\n<p>Emptiness is still there but you know it’s a different one.</p>\n<p>You know you just need to talk as your head can’t keep it any longer.</p>\n<p>Then something falls in your eyes.</p>\n<p>You know tears won’t change anything yet you know it won’t change anything if you don’t cry anyway.</p>\n<p>Then you realize that emptiness is a part of who you are.</p>\n<p>Because every time emptiness knocks on your door, you let it in.</p>\n<p>Always.</p>\n<p>Life is always about choice and that’s what you choose.</p>";

				const frontmatter$7 = {"pubDate":"May 28 2022","title":"Emptiness","description":"When you don't know what to do.","excerpt":"Ever since you sit in your comfy room, you have a smart TV; high-end laptops & PCs, ~100MiB/s internet, comfort chair, even Nintendo Switch. You have a couple of good books to read, interesting thoughts to write, and some crazy reflection to draw. But you do nothing.","image":"~/assets/images/emptyness.jpg","tags":["stories"]};
				const file$7 = "D:/CRACK/DEV/basement/data/blog/emptiness.md";
				const url$7 = undefined;
				function rawContent$7() {
					return "\r\nEver since you sit in your comfy room, you have a smart TV; high-end laptops & PCs, ~100MiB/s internet, comfort chair, even Nintendo Switch. You have a couple of good books to read, interesting thoughts to write, and some crazy reflection to draw.\r\n\r\nBut you do nothing.\r\n\r\nYou don't know what to do.\r\n\r\nYou spend time sitting in front of stupid computers for 8 hours a day, talking bullshit on the Slack channels every day and writing boring code just like everyone else does. You know who you are in your ~9to5 but the rest you are a nobody.\r\n\r\nJust a name with an empty soul.\r\n\r\nMaybe you have a dream, but you choose to keep your dream, dream.\r\n\r\nMaybe you have friends, but those are just Instagram users.\r\n\r\nMaybe you have a nice watch, but have no time.\r\n\r\nYou then realize that you are not as strong as your sweet 17's.\r\n\r\nYou then realize that you don't have as much time as before though every day is still 24 hours.\r\n\r\nYour energy is spent doing nothing but work.\r\n\r\nYou have enough money in your savings, nice stocks to trade, and some cryptocurrencies to keep. You can buy anything yet happiness is always priceless.\r\n\r\nWho the hell needs happiness, anyway?\r\n\r\nThen you see how people live their lives.\r\n\r\nYou sure you're happy yet all you do is laugh.\r\n\r\nMouth can lie but your heart can't, as you know.\r\n\r\nThere is a strange feeling in your little heart. You don't know exactly what it is but you're sure it feel like an emptiness as it's not your very first time.\r\n\r\nYou know what you have to do but you choose to not to.\r\n\r\nYou need someone to talk and know it's not Siri.\r\n\r\nNot even your phone.\r\n\r\nOr your refrigerator.\r\n\r\nYou know the name but not the person.\r\n\r\nYou have deep regrets but don't want to change anything.\r\n\r\nYou open Netflix but what you want to see is not there\r\n\r\nYou open Discord, Telegram, Signal, but no one you want to contact there.\r\n\r\nNobody knows what happened but you.\r\n\r\nThen you choose to sleep.\r\n\r\nForget anything and forgive everything.\r\n\r\nNext morning you wake up, eat, and sit in front of stupid computer again.\r\n\r\nYou say \"new day, new me\" yet it's still the same just like yesterday.\r\n\r\nAnd then you write this shit and save it in a draft.\r\n\r\nYou know it won't change anything even if you publish it anywhere yet you know it won't change anything if you keep it in draft anyway.\r\n\r\nYou click publish.\r\n\r\nEmptiness is still there but you know it's a different one.\r\n\r\nYou know you just need to talk as your head can't keep it any longer.\r\n\r\nThen something falls in your eyes.\r\n\r\nYou know tears won't change anything yet you know it won't change anything if you don't cry anyway.\r\n\r\nThen you realize that emptiness is a part of who you are.\r\n\r\nBecause every time emptiness knocks on your door, you let it in.\r\n\r\nAlways.\r\n\r\nLife is always about choice and that's what you choose.\r\n";
				}
				function compiledContent$7() {
					return html$7;
				}
				function getHeadings$7() {
					return [];
				}
				async function Content$7() {
					const { layout, ...content } = frontmatter$7;
					content.file = file$7;
					content.url = url$7;
					const contentFragment = createVNode(Fragment, { 'set:html': html$7 });
					return contentFragment;
				}
				Content$7[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$7,
  compiledContent: compiledContent$7,
  default: Content$7,
  file: file$7,
  frontmatter: frontmatter$7,
  getHeadings: getHeadings$7,
  rawContent: rawContent$7,
  url: url$7
}, Symbol.toStringTag, { value: 'Module' }));

const html$6 = "<p>Setidaknya ada 3 hal yang manusia benci baik sadar maupun tidak sadar.</p>\n<p>3 hal tersebut ialah:</p>\n<ul>\n<li>Ketakutan</li>\n<li>Ketidakpastian</li>\n<li>Keraguan</li>\n</ul>\n<p><em>Generally speaking</em>, bukan tanpa alasan mengapa terkadang kita berdoa sebelum melakukan perjalanan; menyisihkan uang gaji untuk ber-investasi, membayar lebih demi garansi, ataupun berlangganan pada salah satu produk asuransi.</p>\n<p>Semata-mata untuk melawan 3 hal diatas yang hasilnya membuahkan ketenangan, baik hanya untuk sementara ataupun selama mungkin. Gue pribadi melakukan hal serupa, beribadah sebisa mungkin; membuat anggaran dari uang gaji untuk menabung &#x26; ber-investasi (still not sure if it’s a <em>different thing</em>).</p>\n<p>Yang tujuannya untuk setidaknya mengurangi ketakutan, ketidakpastian, dan keraguan yang gue miliki dalam hidup.</p>\n<p>Dari 3 hal diatas, yang paling gue benci adalah <strong>ketidakpastian</strong>.</p>\n<p>Manusia selalu dihantui ketidakpastian dari bangun tidur sampai akan tertidur lagi nanti. Apa yang akan terjadi pada hari ini? Apa yang akan terjadi besok? Apakah besok gue masih bangun diatas ranjang atau di alam kubur? Akan ada masalah apa lagi pada hari ini?</p>\n<p>Bagaimanapun ketidakpastian adalah sesuatu yang tidak bisa dihindari, dan biasanya satu hal yang bisa gue lakukan untuk menghadapinya adalah dengan membiasakan. Karena sekali lagi, ada sesuatu yang bisa dan tidak bisa kita kontrol, maka apa lagi yang bisa kita lakukan selain pasrah setelah mempersiapkan &#x26; berusaha semaksimal mungkin?</p>\n<p>Kembali ke topik FUD, dalam dunia <em>InfoSec</em> topik ini lumayan laris khususnya ketika menanggapi orang-orang yang termakan akan hal itu khususnya oleh penyedia layanan “VPN komersil” yang selalu menyerukan bahwa jaringan internet kita tidak pribadi dan seseorang sedang menguntit kita.</p>\n<p>Meskipun di lain sisi hal diatas sedikit benar, tapi ada satu hal yang jarang sekali orang awam seperti kita perhatikan: <strong><em>Threat model</em></strong>.</p>\n<p>Misal bayangkan begini, lo naik motor malam-malam sendirian di suatu jalan random. Ada satu motor dengan dua penumpang yang mengikuti lo di belakang, lalu apa yang lo pikirkan dan yang paling penting apa yang bakal lo lakukan?</p>\n<p>Banyak kemungkinan yang bisa dipilih: Menyamakan kecepatan lalu menendangnya dari samping, berhenti dan memastikan bahwa mereka tidak mengikuti, ataupun tetap santai dan menganggap tidak ada yang salah.</p>\n<p>Apapun tindakan yang lo pilih, setidaknya lo sudah memikirkannya.</p>\n<p>Sekarang begini, bagaimana bila mereka memang mengikuti namun dengan maksud baik seperti menemani? Atau mereka pun ternyata merasakan hal yang sama dengan lo? Atau yang memang orang random aja yang lagi jalan-jalan malam?</p>\n<p>Atau bagaimana jika mereka memang gangster?</p>\n<p>Setelah memikirkannya kemungkinan-kemungkinan yang ada, baru lo memikirkan kemungkinan-kemungkinan apa yang akan terjadi bila hal diatas… terjadi.</p>\n<p>Sekarang begini, mengapa orang menabung? Misal, untuk persiapan di masa depan. Lalu bila ada pertanyaan lanjutan yang sekiranya menimbulkan keraguan terhadap kita seperti: <i>“Bagaimana bila ternyata besok kiamat? Bagaimana bila kita tidak akan pernah menikmati tabungan tersebut? Bagaimana bila hari ini adalah kesempatan terakhir kita untuk hidup?”</i>, dsb.</p>\n<p>Pada dasarnya dalam threat modeling ada 4 pertanyaan yang harus bisa dijawab:</p>\n<ol>\n<li>Apa yang kita lakukan?</li>\n<li>Apa yang sekiranya salah?</li>\n<li>Apa yang akan kita lakukan jika suatu hal terjadi?</li>\n<li>Apakah yang kita lakukan sudah baik?</li>\n</ol>\n<p>Kita ambil konteks dalam aktivitas menabung, jadi, mari kita jawab 4 pertanyaan diatas:</p>\n<ol>\n<li>Menggunakan dana dari tabungan untuk dana darurat</li>\n<li>Tidak menganggarkan uang darurat juga, mungkin?</li>\n<li>Mengambil dana yang ada di tabungan sebagai dana darurat</li>\n<li>Kurang efektif, harusnya dana darurat berada di anggaran terpisah sehingga tidak mempengaruhi tujuan dari aktivitas menabung tersebut</li>\n</ol>\n<p>Poin nomor empat diatas terasa sedikit negatif, mari kita buat <em>counterpart-nya</em> untuk yang sedikit positif: 4. Kurang efektif tapi lumayan efisien, karena masih ada kebutuhan primer lain dan sedangkan prioritas dalam tujuan dari menabung tersebut tidak sepenting apa yang harus dilakukan dengan kebutuhan dana darurat yang dibutuhkan.</p>\n<p>Idk, apakah ini relevan atau tidak dengan Threat Modeling yang ada di dunia InfoSec, sejauh yang gue pahami kira-kira seperti itu. Jawaban-jawaban yang ada bersifat relatif dan disesuaikan dengan keadaan masing-masing.</p>\n<h2 id=\"vulnerability\">Vulnerability</h2>\n<p>Dalam agama islam, beribadah—khususnya solat—adalah sebuah kewajiban selama 5 waktu dalam ~24jam. Jawaban dari pertanyaan <strong><em>“mengapa solat?”</em></strong> sangat beragam, dari yang tujuan ibadah secara harfiah seperti <em>“untuk mengingat tuhan”</em> sampai ke jawaban klasik seperti <em>“untuk mendapatkan pahala dan terhindar dari dosa”</em>.</p>\n<p>Dalam sebuah sistem, ada sebuah konsep bernama “vulnerability” yang tujuannya untuk melakukan exploit. Vulnerability (kerentanan) ini adalah sebuah celah keamanan, dan karena adanya kerentanan tersebut tujuannya dari si penyerang adalah untuk memanfaatkan agar bisa melakukan “eksploitasi” dengan “payload” yang benar.</p>\n<p>Mari kita ambil contoh dari para penyedia layanan VPN komersil yang memasarkan produk mereka. Apa yang mereka gunakan sebagai bahan utama dalam pemasaran? Ancaman. Seruan bahwa privasi di dunia digital kita sedang terancam, dan menggunakan VPN mereka adalah bentuk perlawanannya.</p>\n<p>Bagi yang masih sedikit awam khususnya dalam topik privasi; industri periklanan, data mining, dsb, besar kemungkinan iklan tersebut efektif. Siapa juga yang tidak tenang bila aktivitas ber-internet kita diawasi oleh “pihak ketiga” yang tertarik untuk mengolah data dari aktivitas kita tersebut?</p>\n<p>Siapa juga yang tidak tenang bila ada seorang “hacker” yang berada di jaringan kita dan menguntit (ataupun memodifikasi) data (alias paket internet) yang kita kirim dan terima?</p>\n<p>Dan siapa juga yang tidak risih ketika kita sedang mencari tentang “budget nikah” lalu tidak lama kemudian kita mendapatkan promosi terkait hotel murah di Jogja yang cocok untuk ber-bulan madu?</p>\n<p>Ketakutan dan ketidakpastian adalah hal yang paling laku dijual kepada manusia. Dari promo (hanya minggu ini!), cashback (kapan lagi ya ga?), jaminan (momen bagaimana jika…), dsb adalah hal yang lumrah kita lihat &#x26; rasakan pada hari ini.\r\nDan ketika sudah berada di titik keraguan, di sinilah eksploitasi bisa mulai dilakukan ketika kita sudah merasa rentan. Dengan “payload” yang pas, maka akan mendapatkan throughput yang diharapkan.</p>\n<p>Yang diuntungkan? entahlah.</p>\n<p>FUD menjadi alat menyerang yang efektif karena tidak ada satupun yang bisa melihat masa depan.</p>\n<p>Dan setidaknya, kita mendapatkan “ketenangan” karena keraguan tersebut mungkin sudah tidak dirasakan lagi kehadirannya.</p>\n<p>Yang berarti kita sebisa mungkin meyakinkan bahwa yang diuntungkan adalah kita, yang mungkin tanpa memikirkan jawaban akan 4 pertanyaan yang pernah disinggung.</p>\n<h2 id=\"penutup\">Penutup</h2>\n<p>Tentu saja maksud dan tujuan gue menulis tentang FUD disini topik utamanya bukanlah tentang membahas seputar layanan VPN komersil, InfoSec, bagaimana hacker melakukan hacking, atau apapun itu yang terlihat keren dan pintar.</p>\n<p>Somehow terkadang gue merasa lelah dengan ketidakpastian.</p>\n<p>Sampai kapan hidup gue akan terus begini?</p>\n<p>Akan menjadi apa gue pada 5 tahun kedepan nanti?</p>\n<p>Apakah gue masih akan bisa merasakan sesuatu yang bernama kebahagiaan (<i>in a literally way</i>)?</p>\n<p>Apakah suatu saat gue dapat mengerti arti dari cinta secara harfiah dan bukan sebatas kiasan semata?</p>\n<p>Apakah gue suatu saat nanti akan wisuda?</p>\n<p>Kapan nikah?</p>\n<p>Kapan punya anak?</p>\n<p>Kapan manusia dapat melihat bentuk asli bumi sehingga tidak ada lagi kubu bumi bulat dan datar?</p>\n<p>Kapan naik gaji lagi???? (ini bercanda tapi kalau mau diseriusin juga boleh. Karena hampir semua orang suka dengan uang yang banyak, benar?)</p>\n<p>Apakah surga dan neraka itu ada?</p>\n<p>Apakah ketika gue tidur sekarang gue akan terbangun lagi?</p>\n<p>Apakah kalau gue beli Mac Mini tahun ini di tahun depan nanti Apple mengeluarkan Mac Mini dengan chip M1 Pro dengan harga yang tidak beda jauh?</p>\n<p>Dan masih banyak lagi ketidakpastian lainnya.</p>\n<p>Oke oke, sekarang kita kembali ke konteks yang sebenarnya.</p>\n<p>Biasalah, kehidupan pribadi.</p>\n<p>Tidak sedikit yang menaruh kepercayaan kepada gue.</p>\n<p>Dari orang tua khususnya sebagai anak laki-laki satu-satunya, tauladan sebagai kakak, pekerjaan sebagai karyawan, hubungan sebagai pacar, pertemanan sebagai sahabat, muslim sebagai umatnya, dsb.</p>\n<p>Tentu saja gue tidak pernah meminta untuk mereka melakukan itu, terlebih karena kepercayaan itu seharusnya didapat bukan diminta.</p>\n<p>Dan apalagi yang bisa gue lakukan selain berusaha semaksimal mungkin dan meyakinkan mereka—baik langsung ataupun tidak langsung—bahwa mereka tidak menaruh kepercayaan kepada orang yang salah?</p>\n<p>Tapi sekali lagi, bagaimana bila gue ternyata mengecewakan mereka? Bagaimana bila usaha gue tidak semaksimal itu? Bagaimana bila ternyata hasil yang didapat tidak sesuai dengan harapan gue? Dan masih banyak lagi pertanyaan yang dimulai dengan <strong>“bagaimana”</strong>.</p>\n<p>Gue belum mengetahui jawabannya sampai gue mengetik ini.</p>\n<p>Jika sebelumnya gue hanya bisa pasrah terkait apa yang terjadi khususnya terhadap apa yang tidak bisa gue kontrol, setidaknya sekarang gue bisa mengetahui jawaban yang bisa membuat gue tenang: mengetahui jawaban dari 4 pertanyaan sialan dalam threat modeling, untuk setiap hal yang sedang gue hadapi.</p>\n<p>Karena setiap manusia pasti memiliki kerentanan, dan celah yang paling rentan adalah di ketakutan, ketidakpastian, dan keraguan.</p>\n<p>Dan gue sudah merasa lelah selalu dihantui 3 hal tersebut sehingga seringkali hari-hari gue selalu diselimuti dengan ketidaktenangan.</p>\n<p>Dan mengetahui jawabannya, somehow memberikan ketenangan.</p>\n<p>Tanpa perlu melakukan pelarian dengan menegak minuman ber-alkohol dengan tidak <em>responsibly</em>, tanpa perlu berpura-pura semuanya baik-baik saja dengan membohongi diri sendiri, tanpa perlu meditasi yang tidak menyelesaikan permasalahan utama.</p>\n<p>Cukup dengan mengetahui 4 jawaban terkait pertanyaan-pertanyaan yang ada.\r\nDan untuk bagian apakah jawabannya nanti sesuai dengan yang diinginkan atau tidak, itu urusan lain.</p>\n<p>Karena yang terjadi, terjadilah.</p>\n<p><strong>P.S: I’m pretty sure i’m sober as i wrote this. But if you feel otherwise, I’m sorry and take this post as just my conversation with my mind because my only enemies are my ego and myself (and javascript too maybe)</strong>.</p>";

				const frontmatter$6 = {"pubDate":"June 17 2022","title":"Fear. Uncertainty. Doubt.","description":"As title said.","excerpt":"Setidaknya ada 3 hal yang manusia benci baik sadar maupun tidak sadar.","image":"~/assets/images/fud.jpg","tags":["thoughts"]};
				const file$6 = "D:/CRACK/DEV/basement/data/blog/fud.md";
				const url$6 = undefined;
				function rawContent$6() {
					return "\r\nSetidaknya ada 3 hal yang manusia benci baik sadar maupun tidak sadar.\r\n\r\n3 hal tersebut ialah:\r\n\r\n- Ketakutan\r\n- Ketidakpastian\r\n- Keraguan\r\n\r\n_Generally speaking_, bukan tanpa alasan mengapa terkadang kita berdoa sebelum melakukan perjalanan; menyisihkan uang gaji untuk ber-investasi, membayar lebih demi garansi, ataupun berlangganan pada salah satu produk asuransi.\r\n\r\nSemata-mata untuk melawan 3 hal diatas yang hasilnya membuahkan ketenangan, baik hanya untuk sementara ataupun selama mungkin. Gue pribadi melakukan hal serupa, beribadah sebisa mungkin; membuat anggaran dari uang gaji untuk menabung & ber-investasi (still not sure if it's a _different thing_).\r\n\r\nYang tujuannya untuk setidaknya mengurangi ketakutan, ketidakpastian, dan keraguan yang gue miliki dalam hidup.\r\n\r\nDari 3 hal diatas, yang paling gue benci adalah **ketidakpastian**.\r\n\r\nManusia selalu dihantui ketidakpastian dari bangun tidur sampai akan tertidur lagi nanti. Apa yang akan terjadi pada hari ini? Apa yang akan terjadi besok? Apakah besok gue masih bangun diatas ranjang atau di alam kubur? Akan ada masalah apa lagi pada hari ini?\r\n\r\nBagaimanapun ketidakpastian adalah sesuatu yang tidak bisa dihindari, dan biasanya satu hal yang bisa gue lakukan untuk menghadapinya adalah dengan membiasakan. Karena sekali lagi, ada sesuatu yang bisa dan tidak bisa kita kontrol, maka apa lagi yang bisa kita lakukan selain pasrah setelah mempersiapkan & berusaha semaksimal mungkin?\r\n\r\nKembali ke topik FUD, dalam dunia _InfoSec_ topik ini lumayan laris khususnya ketika menanggapi orang-orang yang termakan akan hal itu khususnya oleh penyedia layanan \"VPN komersil\" yang selalu menyerukan bahwa jaringan internet kita tidak pribadi dan seseorang sedang menguntit kita.\r\n\r\nMeskipun di lain sisi hal diatas sedikit benar, tapi ada satu hal yang jarang sekali orang awam seperti kita perhatikan: **_Threat model_**.\r\n\r\nMisal bayangkan begini, lo naik motor malam-malam sendirian di suatu jalan random. Ada satu motor dengan dua penumpang yang mengikuti lo di belakang, lalu apa yang lo pikirkan dan yang paling penting apa yang bakal lo lakukan?\r\n\r\nBanyak kemungkinan yang bisa dipilih: Menyamakan kecepatan lalu menendangnya dari samping, berhenti dan memastikan bahwa mereka tidak mengikuti, ataupun tetap santai dan menganggap tidak ada yang salah.\r\n\r\nApapun tindakan yang lo pilih, setidaknya lo sudah memikirkannya.\r\n\r\nSekarang begini, bagaimana bila mereka memang mengikuti namun dengan maksud baik seperti menemani? Atau mereka pun ternyata merasakan hal yang sama dengan lo? Atau yang memang orang random aja yang lagi jalan-jalan malam?\r\n\r\nAtau bagaimana jika mereka memang gangster?\r\n\r\nSetelah memikirkannya kemungkinan-kemungkinan yang ada, baru lo memikirkan kemungkinan-kemungkinan apa yang akan terjadi bila hal diatas... terjadi.\r\n\r\nSekarang begini, mengapa orang menabung? Misal, untuk persiapan di masa depan. Lalu bila ada pertanyaan lanjutan yang sekiranya menimbulkan keraguan terhadap kita seperti: <i>\"Bagaimana bila ternyata besok kiamat? Bagaimana bila kita tidak akan pernah menikmati tabungan tersebut? Bagaimana bila hari ini adalah kesempatan terakhir kita untuk hidup?\"</i>, dsb.\r\n\r\nPada dasarnya dalam threat modeling ada 4 pertanyaan yang harus bisa dijawab:\r\n\r\n1. Apa yang kita lakukan?\r\n2. Apa yang sekiranya salah?\r\n3. Apa yang akan kita lakukan jika suatu hal terjadi?\r\n4. Apakah yang kita lakukan sudah baik?\r\n\r\nKita ambil konteks dalam aktivitas menabung, jadi, mari kita jawab 4 pertanyaan diatas:\r\n\r\n1. Menggunakan dana dari tabungan untuk dana darurat\r\n2. Tidak menganggarkan uang darurat juga, mungkin?\r\n3. Mengambil dana yang ada di tabungan sebagai dana darurat\r\n4. Kurang efektif, harusnya dana darurat berada di anggaran terpisah sehingga tidak mempengaruhi tujuan dari aktivitas menabung tersebut\r\n\r\nPoin nomor empat diatas terasa sedikit negatif, mari kita buat _counterpart-nya_ untuk yang sedikit positif: 4. Kurang efektif tapi lumayan efisien, karena masih ada kebutuhan primer lain dan sedangkan prioritas dalam tujuan dari menabung tersebut tidak sepenting apa yang harus dilakukan dengan kebutuhan dana darurat yang dibutuhkan.\r\n\r\nIdk, apakah ini relevan atau tidak dengan Threat Modeling yang ada di dunia InfoSec, sejauh yang gue pahami kira-kira seperti itu. Jawaban-jawaban yang ada bersifat relatif dan disesuaikan dengan keadaan masing-masing.\r\n\r\n## Vulnerability\r\n\r\nDalam agama islam, beribadah—khususnya solat—adalah sebuah kewajiban selama 5 waktu dalam ~24jam. Jawaban dari pertanyaan **_\"mengapa solat?\"_** sangat beragam, dari yang tujuan ibadah secara harfiah seperti _\"untuk mengingat tuhan\"_ sampai ke jawaban klasik seperti _\"untuk mendapatkan pahala dan terhindar dari dosa\"_.\r\n\r\nDalam sebuah sistem, ada sebuah konsep bernama \"vulnerability\" yang tujuannya untuk melakukan exploit. Vulnerability (kerentanan) ini adalah sebuah celah keamanan, dan karena adanya kerentanan tersebut tujuannya dari si penyerang adalah untuk memanfaatkan agar bisa melakukan \"eksploitasi\" dengan \"payload\" yang benar.\r\n\r\nMari kita ambil contoh dari para penyedia layanan VPN komersil yang memasarkan produk mereka. Apa yang mereka gunakan sebagai bahan utama dalam pemasaran? Ancaman. Seruan bahwa privasi di dunia digital kita sedang terancam, dan menggunakan VPN mereka adalah bentuk perlawanannya.\r\n\r\nBagi yang masih sedikit awam khususnya dalam topik privasi; industri periklanan, data mining, dsb, besar kemungkinan iklan tersebut efektif. Siapa juga yang tidak tenang bila aktivitas ber-internet kita diawasi oleh \"pihak ketiga\" yang tertarik untuk mengolah data dari aktivitas kita tersebut?\r\n\r\nSiapa juga yang tidak tenang bila ada seorang \"hacker\" yang berada di jaringan kita dan menguntit (ataupun memodifikasi) data (alias paket internet) yang kita kirim dan terima?\r\n\r\nDan siapa juga yang tidak risih ketika kita sedang mencari tentang \"budget nikah\" lalu tidak lama kemudian kita mendapatkan promosi terkait hotel murah di Jogja yang cocok untuk ber-bulan madu?\r\n\r\nKetakutan dan ketidakpastian adalah hal yang paling laku dijual kepada manusia. Dari promo (hanya minggu ini!), cashback (kapan lagi ya ga?), jaminan (momen bagaimana jika...), dsb adalah hal yang lumrah kita lihat & rasakan pada hari ini.\r\nDan ketika sudah berada di titik keraguan, di sinilah eksploitasi bisa mulai dilakukan ketika kita sudah merasa rentan. Dengan \"payload\" yang pas, maka akan mendapatkan throughput yang diharapkan.\r\n\r\nYang diuntungkan? entahlah.\r\n\r\nFUD menjadi alat menyerang yang efektif karena tidak ada satupun yang bisa melihat masa depan.\r\n\r\nDan setidaknya, kita mendapatkan \"ketenangan\" karena keraguan tersebut mungkin sudah tidak dirasakan lagi kehadirannya.\r\n\r\nYang berarti kita sebisa mungkin meyakinkan bahwa yang diuntungkan adalah kita, yang mungkin tanpa memikirkan jawaban akan 4 pertanyaan yang pernah disinggung.\r\n\r\n## Penutup\r\n\r\nTentu saja maksud dan tujuan gue menulis tentang FUD disini topik utamanya bukanlah tentang membahas seputar layanan VPN komersil, InfoSec, bagaimana hacker melakukan hacking, atau apapun itu yang terlihat keren dan pintar.\r\n\r\nSomehow terkadang gue merasa lelah dengan ketidakpastian.\r\n\r\nSampai kapan hidup gue akan terus begini?\r\n\r\nAkan menjadi apa gue pada 5 tahun kedepan nanti?\r\n\r\nApakah gue masih akan bisa merasakan sesuatu yang bernama kebahagiaan (<i>in a literally way</i>)?\r\n\r\nApakah suatu saat gue dapat mengerti arti dari cinta secara harfiah dan bukan sebatas kiasan semata?\r\n\r\nApakah gue suatu saat nanti akan wisuda?\r\n\r\nKapan nikah?\r\n\r\nKapan punya anak?\r\n\r\nKapan manusia dapat melihat bentuk asli bumi sehingga tidak ada lagi kubu bumi bulat dan datar?\r\n\r\nKapan naik gaji lagi???? (ini bercanda tapi kalau mau diseriusin juga boleh. Karena hampir semua orang suka dengan uang yang banyak, benar?)\r\n\r\nApakah surga dan neraka itu ada?\r\n\r\nApakah ketika gue tidur sekarang gue akan terbangun lagi?\r\n\r\nApakah kalau gue beli Mac Mini tahun ini di tahun depan nanti Apple mengeluarkan Mac Mini dengan chip M1 Pro dengan harga yang tidak beda jauh?\r\n\r\nDan masih banyak lagi ketidakpastian lainnya.\r\n\r\nOke oke, sekarang kita kembali ke konteks yang sebenarnya.\r\n\r\nBiasalah, kehidupan pribadi.\r\n\r\nTidak sedikit yang menaruh kepercayaan kepada gue.\r\n\r\nDari orang tua khususnya sebagai anak laki-laki satu-satunya, tauladan sebagai kakak, pekerjaan sebagai karyawan, hubungan sebagai pacar, pertemanan sebagai sahabat, muslim sebagai umatnya, dsb.\r\n\r\nTentu saja gue tidak pernah meminta untuk mereka melakukan itu, terlebih karena kepercayaan itu seharusnya didapat bukan diminta.\r\n\r\nDan apalagi yang bisa gue lakukan selain berusaha semaksimal mungkin dan meyakinkan mereka—baik langsung ataupun tidak langsung—bahwa mereka tidak menaruh kepercayaan kepada orang yang salah?\r\n\r\nTapi sekali lagi, bagaimana bila gue ternyata mengecewakan mereka? Bagaimana bila usaha gue tidak semaksimal itu? Bagaimana bila ternyata hasil yang didapat tidak sesuai dengan harapan gue? Dan masih banyak lagi pertanyaan yang dimulai dengan **\"bagaimana\"**.\r\n\r\nGue belum mengetahui jawabannya sampai gue mengetik ini.\r\n\r\nJika sebelumnya gue hanya bisa pasrah terkait apa yang terjadi khususnya terhadap apa yang tidak bisa gue kontrol, setidaknya sekarang gue bisa mengetahui jawaban yang bisa membuat gue tenang: mengetahui jawaban dari 4 pertanyaan sialan dalam threat modeling, untuk setiap hal yang sedang gue hadapi.\r\n\r\nKarena setiap manusia pasti memiliki kerentanan, dan celah yang paling rentan adalah di ketakutan, ketidakpastian, dan keraguan.\r\n\r\nDan gue sudah merasa lelah selalu dihantui 3 hal tersebut sehingga seringkali hari-hari gue selalu diselimuti dengan ketidaktenangan.\r\n\r\nDan mengetahui jawabannya, somehow memberikan ketenangan.\r\n\r\nTanpa perlu melakukan pelarian dengan menegak minuman ber-alkohol dengan tidak _responsibly_, tanpa perlu berpura-pura semuanya baik-baik saja dengan membohongi diri sendiri, tanpa perlu meditasi yang tidak menyelesaikan permasalahan utama.\r\n\r\nCukup dengan mengetahui 4 jawaban terkait pertanyaan-pertanyaan yang ada.\r\nDan untuk bagian apakah jawabannya nanti sesuai dengan yang diinginkan atau tidak, itu urusan lain.\r\n\r\nKarena yang terjadi, terjadilah.\r\n\r\n**P.S: I'm pretty sure i'm sober as i wrote this. But if you feel otherwise, I'm sorry and take this post as just my conversation with my mind because my only enemies are my ego and myself (and javascript too maybe)**.\r\n";
				}
				function compiledContent$6() {
					return html$6;
				}
				function getHeadings$6() {
					return [{"depth":2,"slug":"vulnerability","text":"Vulnerability"},{"depth":2,"slug":"penutup","text":"Penutup"}];
				}
				async function Content$6() {
					const { layout, ...content } = frontmatter$6;
					content.file = file$6;
					content.url = url$6;
					const contentFragment = createVNode(Fragment, { 'set:html': html$6 });
					return contentFragment;
				}
				Content$6[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$6,
  compiledContent: compiledContent$6,
  default: Content$6,
  file: file$6,
  frontmatter: frontmatter$6,
  getHeadings: getHeadings$6,
  rawContent: rawContent$6,
  url: url$6
}, Symbol.toStringTag, { value: 'Module' }));

const html$5 = "<p>Sebagai seseorang yang (kadang) suka menulis kode atau program random, gue rasa <em>text editor</em> adalah salah satu dari sekian banyak perangkat lunak yang wajib gue punya dan pasang.</p>\n<p>Belakangan ini gue sedang senang menggunakan text editor sejuta umat alias ehm <strong><em><a href=\"https://visualstudio.microsoft.com/\">Visual Studio Code</a></em></strong> (untuk mempermudah dalam penulisan alias gue males ngetik panjang x lebar, kedepannya kita singkat aja jadi <strong>VScode</strong>), sayangnya tampilan si VScode <em>by default</em> sedikit berantakan dan <em>kinda boring i guess</em>.</p>\n<p><img src=\"https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/konfigurasi-vscode/vscode-default.png?raw=true\" alt=\"VScode by default\"> </p><center><em>Visual Studio Code by default</em></center><p></p>\n<p>Maka dari itu gue mencoba untuk membuatnya sedikit bersih dan <em>aesthetic</em>.</p>\n<h2 id=\"tema\">Tema</h2>\n<p>Perubahan gue mulai dari tema, karena ini sangat mencolok perubahannya dan sangat mempengaruhi kenyamanan dalam menulis sebuah program (dibaca: kode). Saat ini gue menggunakan tema <strong><em><a href=\"https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night\">Tokyo Night</a></em></strong>.</p>\n<h2 id=\"font\">Font</h2>\n<p>Sekarang pindah ke font, gue rasa kegiatan menulis kode akan terasa membosankan apabila harus berhadapan dengan font <code>Comic Sans</code>, untuk itu gue mamakai <code>Cascadia Code</code> yang bisa lo unduh <a href=\"https://github.com/microsoft/cascadia-code/releases\">di sini</a>. Jika dirasa gue bosan dengan si Cascadia, gue memiliki alternatif lain, seperti:</p>\n<ul>\n<li><a href=\"https://www.jetbrains.com/lp/mono/\">JetBrains Mono</a></li>\n<li><a href=\"https://github.com/tonsky/FiraCode\">Fira Code</a></li>\n<li>dan <a href=\"https://fonts.google.com/specimen/Space+Mono\">Space Mono</a></li>\n</ul>\n<p>dengan <code>\"editor.fontLigatures\": true</code> yang bisa lo <em>enable</em> di file <code>settings.json</code>.</p>\n<h2 id=\"ikon\">Ikon</h2>\n<p>Ikon yang gue pakai yaitu <a href=\"https://marketplace.visualstudio.com/items?itemName=willi84.vikings-icon-theme\">Viking Icon Theme</a>, alasan gue memilih ikon ini… ga ada sih lucu aja ehe.</p>\n<h2 id=\"settingsjson\">Settings.json</h2>\n<p>Oke, sekarang masuk ke setting (MacOs: <code>cmd</code> + <code>,</code> &#x26; Windows / Linux: <code>ctrl</code> + <code>,</code>), perubahan yang gue lakukan di sini lumayan banyak dan ini juga yang membuat VScode gue terlihat lebih bersih (dan <em>aesthetic</em>) lagi.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">{</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.editor.showTabs\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"blade.format.enable\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.defaultFormatter\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"esbenp.prettier-vscode\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"[javascript]\"</span><span style=\"color: #C9D1D9\">: {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #7EE787\">\"editor.defaultFormatter\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"esbenp.prettier-vscode\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.formatOnSave\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.activityBar.visible\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.statusBar.visible\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.iconTheme\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"vikings-icon-theme\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.colorTheme\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"Tokyo Night\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"search.mode\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"reuseEditor\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.fontSize\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">15</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.fontFamily\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"Cascadia Code, JetBrains Mono, Fira Code, Space Mono\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.fontLigatures\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.renderLineHighlight\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"none\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.matchBrackets\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"never\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.occurrencesHighlight\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.renderIndentGuides\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.minimap.enabled\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"breadcrumbs.enabled\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.renderWhitespace\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"none\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.lineHeight\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">29</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"bracketPairColorizer.showVerticalScopeLine\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.tokenColorCustomizations\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">null</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"vikings-icon-theme.folders.color\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"#fff\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"window.menuBarVisibility\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"compact\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"vikings-icon-theme.opacity\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">1</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.startupEditor\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"none\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"kite.showWelcomeNotificationOnStartup\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"files.autoSave\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"onWindowChange\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"terminal.integrated.fontFamily\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"JetBrains Mono\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"javascript.updateImportsOnFileMove.enabled\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"never\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"explorer.confirmDelete\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.smoothScrolling\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"svelte.enable-ts-plugin\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">true</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span></code></pre>\n<p>Sejauh ini hasil yang gue dapatkan seperti ini:</p>\n<p><img src=\"https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/konfigurasi-vscode/hasil.png?raw=true\" alt=\"Look mom, this is my Visual Studio Code with aestethic look\"> </p><center><em>Look mom, this is my Visual Studio Code with aesthetic look</em></center><p></p>\n<p>Terlihat cukup bersih lah ya daripada yang disajikan oleh VScode <em>by default</em>.</p>";

				const frontmatter$5 = {"pubDate":"July 01 2022","title":"Konfigurasi Text Editor Sejuta Umat","description":"Visual Studio by default kinda sucks.","excerpt":"Visual Studio by default kinda sucks.","image":"~/assets/images/editor.jpg","tags":["ideas"]};
				const file$5 = "D:/CRACK/DEV/basement/data/blog/konfigurasi-vscode.md";
				const url$5 = undefined;
				function rawContent$5() {
					return "\r\nSebagai seseorang yang (kadang) suka menulis kode atau program random, gue rasa _text editor_ adalah salah satu dari sekian banyak perangkat lunak yang wajib gue punya dan pasang.\r\n\r\nBelakangan ini gue sedang senang menggunakan text editor sejuta umat alias ehm **_[Visual Studio Code](https://visualstudio.microsoft.com/)_** (untuk mempermudah dalam penulisan alias gue males ngetik panjang x lebar, kedepannya kita singkat aja jadi **VScode**), sayangnya tampilan si VScode _by default_ sedikit berantakan dan _kinda boring i guess_.\r\n\r\n![VScode by default](https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/konfigurasi-vscode/vscode-default.png?raw=true) <center>_Visual Studio Code by default_</center>\r\n\r\nMaka dari itu gue mencoba untuk membuatnya sedikit bersih dan _aesthetic_.\r\n\r\n## Tema\r\n\r\nPerubahan gue mulai dari tema, karena ini sangat mencolok perubahannya dan sangat mempengaruhi kenyamanan dalam menulis sebuah program (dibaca: kode). Saat ini gue menggunakan tema **_[Tokyo Night](https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night)_**.\r\n\r\n## Font\r\n\r\nSekarang pindah ke font, gue rasa kegiatan menulis kode akan terasa membosankan apabila harus berhadapan dengan font `Comic Sans`, untuk itu gue mamakai `Cascadia Code` yang bisa lo unduh [di sini](https://github.com/microsoft/cascadia-code/releases). Jika dirasa gue bosan dengan si Cascadia, gue memiliki alternatif lain, seperti:\r\n\r\n- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)\r\n- [Fira Code](https://github.com/tonsky/FiraCode)\r\n- dan [Space Mono](https://fonts.google.com/specimen/Space+Mono)\r\n\r\ndengan `\"editor.fontLigatures\": true` yang bisa lo _enable_ di file `settings.json`.\r\n\r\n## Ikon\r\n\r\nIkon yang gue pakai yaitu [Viking Icon Theme](https://marketplace.visualstudio.com/items?itemName=willi84.vikings-icon-theme), alasan gue memilih ikon ini... ga ada sih lucu aja ehe.\r\n\r\n## Settings.json\r\n\r\nOke, sekarang masuk ke setting (MacOs: `cmd` + `,` & Windows / Linux: `ctrl` + `,`), perubahan yang gue lakukan di sini lumayan banyak dan ini juga yang membuat VScode gue terlihat lebih bersih (dan _aesthetic_) lagi.\r\n\r\n```json\r\n{\r\n  \"workbench.editor.showTabs\": false,\r\n  \"blade.format.enable\": false,\r\n  \"editor.defaultFormatter\": \"esbenp.prettier-vscode\",\r\n  \"[javascript]\": {\r\n    \"editor.defaultFormatter\": \"esbenp.prettier-vscode\"\r\n  },\r\n  \"editor.formatOnSave\": true,\r\n  \"workbench.activityBar.visible\": false,\r\n  \"workbench.statusBar.visible\": false,\r\n  \"workbench.iconTheme\": \"vikings-icon-theme\",\r\n  \"workbench.colorTheme\": \"Tokyo Night\",\r\n  \"search.mode\": \"reuseEditor\",\r\n  \"editor.fontSize\": 15,\r\n  \"editor.fontFamily\": \"Cascadia Code, JetBrains Mono, Fira Code, Space Mono\",\r\n  \"editor.fontLigatures\": true,\r\n  \"editor.renderLineHighlight\": \"none\",\r\n  \"editor.matchBrackets\": \"never\",\r\n  \"editor.occurrencesHighlight\": false,\r\n  \"editor.renderIndentGuides\": false,\r\n  \"editor.minimap.enabled\": false,\r\n  \"breadcrumbs.enabled\": false,\r\n  \"editor.renderWhitespace\": \"none\",\r\n  \"editor.lineHeight\": 29,\r\n  \"bracketPairColorizer.showVerticalScopeLine\": false,\r\n  \"editor.tokenColorCustomizations\": null,\r\n  \"vikings-icon-theme.folders.color\": \"#fff\",\r\n  \"window.menuBarVisibility\": \"compact\",\r\n  \"vikings-icon-theme.opacity\": 1,\r\n  \"workbench.startupEditor\": \"none\",\r\n  \"kite.showWelcomeNotificationOnStartup\": false,\r\n  \"files.autoSave\": \"onWindowChange\",\r\n  \"terminal.integrated.fontFamily\": \"JetBrains Mono\",\r\n  \"javascript.updateImportsOnFileMove.enabled\": \"never\",\r\n  \"explorer.confirmDelete\": false,\r\n  \"editor.smoothScrolling\": true,\r\n  \"svelte.enable-ts-plugin\": true\r\n}\r\n```\r\n\r\nSejauh ini hasil yang gue dapatkan seperti ini:\r\n\r\n![Look mom, this is my Visual Studio Code with aestethic look](https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/konfigurasi-vscode/hasil.png?raw=true) <center>_Look mom, this is my Visual Studio Code with aesthetic look_</center>\r\n\r\nTerlihat cukup bersih lah ya daripada yang disajikan oleh VScode _by default_.\r\n";
				}
				function compiledContent$5() {
					return html$5;
				}
				function getHeadings$5() {
					return [{"depth":2,"slug":"tema","text":"Tema"},{"depth":2,"slug":"font","text":"Font"},{"depth":2,"slug":"ikon","text":"Ikon"},{"depth":2,"slug":"settingsjson","text":"Settings.json"}];
				}
				async function Content$5() {
					const { layout, ...content } = frontmatter$5;
					content.file = file$5;
					content.url = url$5;
					const contentFragment = createVNode(Fragment, { 'set:html': html$5 });
					return contentFragment;
				}
				Content$5[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$5,
  compiledContent: compiledContent$5,
  default: Content$5,
  file: file$5,
  frontmatter: frontmatter$5,
  getHeadings: getHeadings$5,
  rawContent: rawContent$5,
  url: url$5
}, Symbol.toStringTag, { value: 'Module' }));

const html$4 = "<p>Gue tipe orang yang konsumtif, dan gue rasa hampir setiap orang juga konsumtif. Bedanya ada yang melakukan konsumsi karena memang benar-benar butuh atau yang engga butuh-butuh banget.</p>\n<p>Konsumtif, less produktif, at least worth.</p>\n<p>Prinsip gue dalam mengkonsumsi sesuatu adalah tentang hasil yang gue dapat dari proses\r\nkonsumsi tersebut. Singkatnya, minimal konsumtif harus berbanding lurus dengan produktif,\r\ngue ga akan ngomongin seputar kesehatan, karena gue bukan tipe orang yang sehat-sehat\r\nbanget.</p>\n<p>Oke, misal gini, apa yang gue dapet setelah membeli kopi seharga ~50ribu dan duduk\r\nberjam-jam di warkop atau kafe? 2 tulisan baru dan 5 task resolved, contohnya.</p>\n<p>Apakah pengeluaran 50ribu tersebut worth dengan apa yang sudah gue lakukan? Well,\r\nselama gue produktif gue akan memaafkan diri gue yang konsumtif ini.</p>\n<h2 id=\"cashback\">Cashback…</h2>\n<p>Gue bukan tipe orang yang gila cashback, tapi akhir-akhir ini enjoy menggunakan cashback,\r\nintinya cashback gue anggap sebagai “thank you” dari suatu layanan, karena telah\r\nmenggunakan layanan tersebut.</p>\n<p>Ambil contoh kalau gue mendapatkan cashback 20% bila menggunakan aplikasi go***pay,\r\ngopay ngasih gue ~10ribu sebagai tanda terima kasih karena telah menggunakan aplikasi\r\nmereka untuk ber-transaksi sekitar ~50ribu.</p>\n<p>Cashback bukanlah hal yang permanent, namun selagi ada program cashback… ya kenapa\r\nengga dinikmati?</p>\n<h2 id=\"health\">Health?</h2>\n<p>Oke oke, gue cuma membicarakan tentang output belum membicarakan tentang efek.\r\nDan inilah alasan gue mengapa memilih kata pintar daripada cerdas, kalau lo cerdas lo pasti mempertimbangkan beberala hal juga, sebagai contoh: faktor kesehatan, ekonomi negara dunia ketiga, dan sebagainya.</p>\n<p>Oke oke berlebihan ya.</p>\n<p>Mari kita persingkat ke kesehatan.</p>\n<p>Meskipun kopi 50ribu kita anggap worth dengan 2 tulisan baru dan 5 task resolved, namun apakah efek yang ada di dalam kopi tersebut worth terhadap diri lo? Misal, efek kafein, gula, dsb.</p>\n<p><strong>Percuma</strong> ㅡ sengaja gue tekankan.</p>\n<p>Misal apa yang kita hasilkan tersebut menyebabkan hal lain ㅡ jatuh sakit misalnya.\r\nSejujurnya gue tidak terlalu peduli dengan masalah kesehatan, ingat, tidak terlalu bukan berarti tidak ya.</p>\n<p>Setiap hari gue berurusan dengan hal tidak sehat, baik langsung seperti merokok ataupun tidak lamgsung terserah lo mau namain apa.\r\nJadi, untuk apa membicarakan buruknya neraka jika kita sedang tinggal di dalamnya?</p>\n<p>Kalau lo hidup sehat <em>by design</em>, faktor kesehatan mungkin harus dipertimbangkan untuk hari ini atau untuk hari yang akan datang.\r\nApalah aku yang tidak sehat ini ya, meskipun selalu bermimpi untuk hidup sehat.</p>\n<h2 id=\"terukur\">Terukur</h2>\n<p>Hal terakhir yang ingin gue bahas adalah terukur.\r\nKalau gue bisa mengukur apakah layak ~50ribu something + duduk berjam-jam di warkop per hari dengan apa yang gue hasilnkan, harusnya gue bisa mengukur hal lain juga; pengeluaran tiap bulan untuk itu, misalnya.</p>\n<p>Gue menggunakan metode <em>zero-budget</em> yang mana pemasukan + pengeluaran sama dengan nol.\r\nPengeluaran ini banyak macamnya; nabung dan investasi pun termasuk pengeluaran.</p>\n<p>Pemasukan juga banyak macamnya, tapi di sini gue ambil dari gaji utama gue.\r\nPengeluaran pun mostly ke perilaku konsumtif pangan, entertainment dan self improvement.\r\nGue sekarang sejujurnya belum ada rencana buat melakukan investasi, karena gue rasa dan yakin investasi yang worth untuk gue saat ini yaitu investasi ke diri sendiri (self improvement).</p>";

				const frontmatter$4 = {"pubDate":"March 25 2022","title":"Menjadi Konsumen Pintar","description":"Konsumtif, less produktif, at least worth.","excerpt":"Konsumtif, less produktif, at least worth.","image":"~/assets/images/konsumen-pintar.jpg","tags":["thoughts"]};
				const file$4 = "D:/CRACK/DEV/basement/data/blog/konsumen-pintar.md";
				const url$4 = undefined;
				function rawContent$4() {
					return "\r\n\r\nGue tipe orang yang konsumtif, dan gue rasa hampir setiap orang juga konsumtif. Bedanya ada yang melakukan konsumsi karena memang benar-benar butuh atau yang engga butuh-butuh banget.\r\n\r\nKonsumtif, less produktif, at least worth.\r\n\r\nPrinsip gue dalam mengkonsumsi sesuatu adalah tentang hasil yang gue dapat dari proses\r\nkonsumsi tersebut. Singkatnya, minimal konsumtif harus berbanding lurus dengan produktif,\r\ngue ga akan ngomongin seputar kesehatan, karena gue bukan tipe orang yang sehat-sehat\r\nbanget.\r\n\r\nOke, misal gini, apa yang gue dapet setelah membeli kopi seharga ~50ribu dan duduk\r\nberjam-jam di warkop atau kafe? 2 tulisan baru dan 5 task resolved, contohnya.\r\n\r\nApakah pengeluaran 50ribu tersebut worth dengan apa yang sudah gue lakukan? Well,\r\nselama gue produktif gue akan memaafkan diri gue yang konsumtif ini.\r\n\r\n## Cashback...\r\n\r\nGue bukan tipe orang yang gila cashback, tapi akhir-akhir ini enjoy menggunakan cashback,\r\nintinya cashback gue anggap sebagai \"thank you\" dari suatu layanan, karena telah\r\nmenggunakan layanan tersebut.\r\n\r\nAmbil contoh kalau gue mendapatkan cashback 20% bila menggunakan aplikasi go\\*\\*\\*pay,\r\ngopay ngasih gue ~10ribu sebagai tanda terima kasih karena telah menggunakan aplikasi\r\nmereka untuk ber-transaksi sekitar ~50ribu.\r\n\r\nCashback bukanlah hal yang permanent, namun selagi ada program cashback... ya kenapa\r\nengga dinikmati?\r\n\r\n## Health?\r\n\r\nOke oke, gue cuma membicarakan tentang output belum membicarakan tentang efek.\r\nDan inilah alasan gue mengapa memilih kata pintar daripada cerdas, kalau lo cerdas lo pasti mempertimbangkan beberala hal juga, sebagai contoh: faktor kesehatan, ekonomi negara dunia ketiga, dan sebagainya.\r\n\r\nOke oke berlebihan ya.\r\n\r\nMari kita persingkat ke kesehatan.\r\n\r\nMeskipun kopi 50ribu kita anggap worth dengan 2 tulisan baru dan 5 task resolved, namun apakah efek yang ada di dalam kopi tersebut worth terhadap diri lo? Misal, efek kafein, gula, dsb.\r\n\r\n**Percuma** ㅡ sengaja gue tekankan.\r\n\r\nMisal apa yang kita hasilkan tersebut menyebabkan hal lain ㅡ jatuh sakit misalnya.\r\nSejujurnya gue tidak terlalu peduli dengan masalah kesehatan, ingat, tidak terlalu bukan berarti tidak ya.\r\n\r\nSetiap hari gue berurusan dengan hal tidak sehat, baik langsung seperti merokok ataupun tidak lamgsung terserah lo mau namain apa.\r\nJadi, untuk apa membicarakan buruknya neraka jika kita sedang tinggal di dalamnya?\r\n\r\nKalau lo hidup sehat _by design_, faktor kesehatan mungkin harus dipertimbangkan untuk hari ini atau untuk hari yang akan datang.\r\nApalah aku yang tidak sehat ini ya, meskipun selalu bermimpi untuk hidup sehat.\r\n\r\n## Terukur\r\n\r\nHal terakhir yang ingin gue bahas adalah terukur.\r\nKalau gue bisa mengukur apakah layak ~50ribu something + duduk berjam-jam di warkop per hari dengan apa yang gue hasilnkan, harusnya gue bisa mengukur hal lain juga; pengeluaran tiap bulan untuk itu, misalnya.\r\n\r\nGue menggunakan metode _zero-budget_ yang mana pemasukan + pengeluaran sama dengan nol.\r\nPengeluaran ini banyak macamnya; nabung dan investasi pun termasuk pengeluaran.\r\n\r\nPemasukan juga banyak macamnya, tapi di sini gue ambil dari gaji utama gue.\r\nPengeluaran pun mostly ke perilaku konsumtif pangan, entertainment dan self improvement.\r\nGue sekarang sejujurnya belum ada rencana buat melakukan investasi, karena gue rasa dan yakin investasi yang worth untuk gue saat ini yaitu investasi ke diri sendiri (self improvement).\r\n";
				}
				function compiledContent$4() {
					return html$4;
				}
				function getHeadings$4() {
					return [{"depth":2,"slug":"cashback","text":"Cashback…"},{"depth":2,"slug":"health","text":"Health?"},{"depth":2,"slug":"terukur","text":"Terukur"}];
				}
				async function Content$4() {
					const { layout, ...content } = frontmatter$4;
					content.file = file$4;
					content.url = url$4;
					const contentFragment = createVNode(Fragment, { 'set:html': html$4 });
					return contentFragment;
				}
				Content$4[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$4,
  compiledContent: compiledContent$4,
  default: Content$4,
  file: file$4,
  frontmatter: frontmatter$4,
  getHeadings: getHeadings$4,
  rawContent: rawContent$4,
  url: url$4
}, Symbol.toStringTag, { value: 'Module' }));

const html$3 = "<p>Ditahun 2018, sesuatu yang disebut “transformasi digital” sedang naik daun, dari proses digitasi sampai digitalisasi. Masyarakat dari berbagai lapisan berlomba untuk menerapkan teknologi di berbagai aspek, berkat era informasi ini pada pertengahan abad 21 ini.</p>\n<p>Penggunaan personal komputer (PC) sudah relatif banyak namun satu hal yang membuat gelembung ini besar adalah satu: internet. Internet salah satunya dapat menghubungkan penjual emping yang misal berada di Banjarnegara dengan pembeli yang berada di Sragen.</p>\n<p>Internet memungkinan sesuatu yang sebelumnya tidak mungkin karena terdapat bingkai pemisah yang bernama geografis.</p>\n<p>Jika internet diibaratkan sebuah pulau, alamat IP berarti sebuah tanah kosong. Bangunannya adalah sesuatu yang disebut dengan situs, dan tidak jarang satu bangunan dihuni oleh banyak… penghuni.</p>\n<p>Setiap bangunan memiliki rancangan yang berbeda-beda, tergantung si <em>arsitek</em>. Pada sekitaran tahun 2018, kebanyakan bangunan tersebut memiliki rancangan yang sama: dibangun menggunakan sesuatu bernama HTML, CSS, JavaScript, PHP, dan basis data rasional yang kemungkinan besar MySQL. Dan jenis bangunan tersebut ada dua: statis dan dinamis. Perbedaan utamanya pada dasarnya hanyalah sumber data yang diambil untuk menampilkan sebuah halaman situs: apakah langsung dari kode, atau diambil dari sebuah penyimpanan data.</p>\n<p>Umumnya, jika jenis situs yang ingin dibuat berjenis aplikasi, situs tersebut kemungkinan besar bersifat dinamis karena adanya interaksi yang dilakukan oleh pengguna dan aplikasi harus bisa menangani interaksi tersebut. Misal, bila aplikasi tersebut memiliki sistem “autentikasi” untuk dapat mengenali siapa pengguna X dengan tanda pengenal Y di aplikasi tersebut, maka si aplikasi harus menyimpan data Y tersebut.</p>\n<p>Data tersebut secara teknis bisa disimpan dimana saja, namun yang paling umum adalah di penyimpanan data yang persisten sehingga aplikasi tidak kehilangan data yang sudah dimasukkan sebelumnya oleh si pengguna ketika misalnya aplikasi tersebut mati.</p>\n<p>Penyimpanan data yang persisten tersebut biasa disebut dengan basis data atau database. Tidak banyak pilihan database yang bisa digunakan pada kala itu, namun yang paling populer penggunaannya adalah basis data rasional yang salah satunya adalah <a href=\"https://mariadb.org/about\">MySQL</a>.</p>\n<p>Karena MySQL juga pada dasarnya adalah sebuah aplikasi, cara agar membuat aplikasi kita bisa berkomunikasi dengan aplikasi lain adalah melalui sesuatu yang disebut dengan <a href=\"https://en.wikipedia.org/wiki/API\"><em>Application Programming Interface</em></a> (API). <em>API</em> biasa memiliki berbagai lapisan tergantung seberapa banyak detail yang ingin disembunyikan atau yang biasa disebut dengan abstraksi.</p>\n<p>Dulu gue pernah ingin menjadi seorang “Fullstack Engineer” dan pekerjaan di Front-End kurang lebih adalah melakukan slicing yang sederhananya adalah tentang mengubah berkas PSD ke HTML, berbeda dengan sekarang yang sepertinya harus mengetahui semua lapisan yang ada di OSI model.</p>\n<p>Just kidding.</p>\n<p>Di bagian back-end, mereka besar kemungkinan bertanggung jawab akan <em>business/domain logic</em> yang sederhananya “mengkodekan” aturan bisnis dunia nyata yang menentukan bagaimana data dapat dibuat, disimpan, dan diubah.</p>\n<p>Jika ada kesalahan “logic” yang menyebabkan bisnis rugi 10 milyar karena kegagalan ataupun kesalahan dalam penyimpanan data ke basis data, tidak perlu berpikir lama siapa yang harus disalahkan.</p>\n<p>Sekarang kita fokus ke bagian teknis.</p>\n<p>Basis data disebut “rasional” salah satunya adalah karena data dipresentasikan dalam bentuk tabel yang mana terdiri dari baris dan kolom. Sistem dari basis data yang rasional ini disebut dengan <em>Relational Database Management System</em> (RDBMS) yang maksudnya, bila basis data tersebut menggunakan RDBMS, cara untuk berinteraksi dengan si database ini menggunakan sesuatu bernama <em>Structured Query Language</em> (SQL).</p>\n<p>Kala itu bahasa pemrograman yang gue gunakan adalah PHP: Hypertext Preprocessor. Alasannya? Tuntutan (educational purpose) dan Pasar. Gue kurang mengerti kenapa PHP populer kala itu, yang gue yakin karena alasan ekosistem yang menjadikan pengembang PHP sebagai warga negara kelas satu seperti munculnya Web Hosting khusus untuk Web Server yang bisa menjalankan kode PHP, Content Management System (CMS) yang dibuat menggunakan PHP, dan yang paling penting dukungan PHP terhadap driver MySQL secara native.</p>\n<h3 id=\"php--mysql-in-the-nutshell\">PHP + MySQL in the nutshell</h3>\n<p>Untuk membuat aplikasi yang dibuat menggunakan PHP dapat berkomunikasi dengan MySQL, kita perlu menghubungkannya terlebih dahulu, yakni melalui API. PHP menawarkan dua cara (jika gue tidak salah ingat) yakni melalui PDO atau langsung menggunakan <em>driver</em> resmi terkait basis data yang digunakan.</p>\n<p>Mari kita fokus ke penggunaan <em>driver</em> resmi. Dalam penggunaan driver resminya pun terdapat 2 paradigma yang ada: Prosedural dan object-oriented. Karena gue suka ribet, mari kita pilih cara prosedural.</p>\n<p>Untuk menghubungkan aplikasi PHP kita ke basis data MySQL, method dari API yang ada yang bisa kita gunakan adalah <code>mysqli_connect</code> yang umumnya membutuhkan 3 parameter: hostname, username, dan password. Jika parameter hostname ter-definisi, maka komunikasi dengan MySQL harusnya menggunakan TCP daripada via UNIX socket (IPC).</p>\n<p>Kode nya kurang lebih seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Kita akan menggunakan <em>variable</em> <code>$conn</code> tersebut untuk memanggil method lain seperti untuk melakukan <em>query</em> misalnya dengan memanggil <code>mysqli_query</code>. Let’s do it, I guess?</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$database_list </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_query</span><span style=\"color: #C9D1D9\">( $conn, </span><span style=\"color: #A5D6FF\">\"show databases\"</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( $database_list ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $database_list );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Hasilnya jika memiliki 4 database, kurang lebih seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [current_field] </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [field_count] </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [lengths] </span><span style=\"color: #FF7B72\">=></span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [num_rows] </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">4</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [type] </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span></code></pre>\n<p>That’s it.</p>\n<h3 id=\"very-select\">Very SELECT</h3>\n<p>Cara untuk menampilkan data menggunakan SQL adalah menggunakan statement <code>SELECT</code>. Argumen paling penting dari <code>SELECT</code> ini adalah nama table yang ingin diambil dan daftar kolom yang ingin ditampilkan.</p>\n<p>Umumnya kita harus mendefinisikan nama kolom yang ingin diambil karena alasan privasi daripada menggunakan <code>*</code> yang chaotic-evil sehingga menampilkan data lain yang mungkin tidak kita butuhkan dalam konteks tertentu.</p>\n<p>Menggunakan statement <code>SELECT</code> di <code>mysqli_query</code> tidak terlalu sulit, mungkin seperti ini dengan konteks kita ingin mengambil data di kolom <code>email</code> dari table <code>users</code>:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password, $dbname );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$users </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_query</span><span style=\"color: #C9D1D9\">( $conn, </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #FF7B72\">SELECT</span><span style=\"color: #A5D6FF\"> email </span><span style=\"color: #FF7B72\">FROM</span><span style=\"color: #A5D6FF\"> users\"</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #D2A8FF\">mysqli_num_rows</span><span style=\"color: #C9D1D9\">( $users ) </span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\"> ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">while</span><span style=\"color: #C9D1D9\">( $row </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_fetch_assoc</span><span style=\"color: #C9D1D9\">( $users ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $row );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Diatas kita sudah mendefinisikan <code>$dbname</code> dan juga kita memanggil <code>mysqli_num_rows</code> untuk memastikan bahwa ada data yang bisa kita proses dan juga memanggil <code>mysqli_fetch_assoc</code> untuk menyimpan hasil <em>query</em> yang kita lakukan sebagai <em>associative</em> array.</p>\n<p>Hasilnya kurang lebih seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">Array</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [email] =</span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> anggun@acme.inc</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">Array</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [email] =</span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> kiko@enak.tau</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">Array</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [email] =</span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> krido@hey.io </span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span></code></pre>\n<p>Sekarang kita ke bagian yang menarik, bagaimana kita ingin mengambil data untuk user <code>anggun@acme.inc</code> saja? Kita bisa menambahkan <code>WHERE</code> didalam sintaks SQL kita sebelumnya!</p>\n<p>Tapi sedikit lucu jika menggunakan kolom <code>email</code> sebagai kunci utama. Biasanya kolom yang digunakan sebagai kunci utama adalah <code>id</code> dengan tipe data integer agar bisa di <em>auto increment</em> sehingga data yang disimpan bisa dijamin unik.</p>\n<p>Berarti sekarang mari kita ambil data <code>email</code> berdasarkan <code>id</code> dari si <code>users</code> tersebut!</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password, $dbname );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user_id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1337</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_query</span><span style=\"color: #C9D1D9\">( $conn, </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #FF7B72\">SELECT</span><span style=\"color: #A5D6FF\"> email </span><span style=\"color: #FF7B72\">FROM</span><span style=\"color: #A5D6FF\"> users </span><span style=\"color: #FF7B72\">where</span><span style=\"color: #A5D6FF\"> id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #A5D6FF\"> </span><span style=\"color: #C9D1D9\">$user_id</span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #D2A8FF\">mysqli_num_rows</span><span style=\"color: #C9D1D9\">( $user ) </span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\"> ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">while</span><span style=\"color: #C9D1D9\">( $row </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_fetch_assoc</span><span style=\"color: #C9D1D9\">( $user ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $row );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Dan hasilnya kurang lebih seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">Array</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [email] =</span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> anggun@acme.inc</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span></code></pre>\n<p>Very ez. Tapi nilai <code>$user_id</code> diatas masih statis, harusnya dinamis entah diambil dari <code>$_GET</code>, <code>$_POST</code> atau bahkan <code>$_COOKIE</code>.</p>\n<p>Anggap kita ambil dari <em>cookie</em> dengan <em>key</em> bernama <code>user_id</code> karena jika menggunakan <em>query parameter</em> terlalu jelas. Kode nya seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password, $dbname );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #79C0FF\">isset</span><span style=\"color: #C9D1D9\">( $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ] ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'no user_id'</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user_id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ];</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_query</span><span style=\"color: #C9D1D9\">( $conn, </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #FF7B72\">SELECT</span><span style=\"color: #A5D6FF\"> email </span><span style=\"color: #FF7B72\">FROM</span><span style=\"color: #A5D6FF\"> users </span><span style=\"color: #FF7B72\">where</span><span style=\"color: #A5D6FF\"> id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #A5D6FF\"> </span><span style=\"color: #C9D1D9\">$user_id</span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #D2A8FF\">mysqli_num_rows</span><span style=\"color: #C9D1D9\">( $user ) </span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\"> ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">while</span><span style=\"color: #C9D1D9\">( $row </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_fetch_assoc</span><span style=\"color: #C9D1D9\">( $user ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $row );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Jika nilai <code>$_COOKIE['user_id']</code> adalah <code>1337</code>, maka hasilnya kurang lebih sama seperti yang sebelumnya.</p>\n<p>Bagaimana bila nilainya adalah <code>1337 or 1 = 1</code>?</p>\n<p>You guessed it right.</p>\n<p>(and yes, $_SESSION and/or JWT exist for a reason — just in case)</p>\n<h3 id=\"abstractions\">Abstractions</h3>\n<p>Meskipun sintaks SQL bersifat deklaratif, jurangnya justru ada di API nya. Ya, PHP memiliki PDO tapi bahasa pemrograman bukan hanya PHP di dunia ini.</p>\n<p>Jika kita melihat cuplikan kode diatas, kita bisa membuat abstraksi seperti untuk:</p>\n<ul>\n<li>membuat koneksi dan menutupnya</li>\n<li>menangani data yang didapat dari input pengguna</li>\n<li>menangani ketika data yang diminta tidak ada</li>\n<li>memberikan ketika data yang diminta ada</li>\n</ul>\n<p>…terlepas bahasa pemrograman ataupun basis data yang digunakan.</p>\n<p>Pseudocode nya mungkin seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$db </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">new</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">DB</span><span style=\"color: #C9D1D9\">( $ENV[ </span><span style=\"color: #A5D6FF\">'DB'</span><span style=\"color: #C9D1D9\"> ] );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #79C0FF\">isset</span><span style=\"color: #C9D1D9\">( $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ] ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'no user_id'</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">select</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #A5D6FF\">'users'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'email'</span><span style=\"color: #C9D1D9\"> ),</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ] )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $user );</span></span></code></pre>\n<p>Yes, kita bisa buat abstraksi lagi untuk terus menutupi aib yang ada di kode kita yang mungkin menjadi seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">isset</span><span style=\"color: #C9D1D9\">( $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ] ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'no user_id'</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">User</span><span style=\"color: #FF7B72\">::</span><span style=\"color: #D2A8FF\">find</span><span style=\"color: #C9D1D9\">( $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ], </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'email'</span><span style=\"color: #C9D1D9\"> ) );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $user );</span></span></code></pre>\n<p>Dan, ya, mungkin kamu sedikit familiar dengan sintaks diatas.</p>\n<h3 id=\"the-abstraction-dilemma\">The abstraction dilemma</h3>\n<p>Bangun tidur cek Twitter ada unpopular opinion tentang <em>ORMs are often overused</em>. Meskipun gue seringnya cuman tertarik bahas unpopular opinion tentang buna raven, but I can’t stand this one.</p>\n<p>Yes man, ORMs are often overused. We can literally put a very raw SQL queries on something like <code>/sql.php?query=select * from users --because why not</code> dan sanitization berada di level reverse proxy or something ataupun bisa pakai GraphQL biar lebih gaya.</p>\n<p>Tapi sebelum kita julidin ORM, mari kita bahas sedikit apa itu ORM.</p>\n<h3 id=\"object-relational-mapping-orm\">Object-relational Mapping (ORM)</h3>\n<p>ORM singkatnya adalah sebuah teknik untuk melakukan query dan memanipulasi data dari sebuah database menggunakan paradigma berorientasi objek.</p>\n<p>Seperti, untuk memanggil <code>SELECT email FROM users where id = 1337</code> kita bisa hanya dengan memanggil method <code>find</code> dari instance <code>User</code> misalnya seperti <code>User::find( 1337, [ 'email' ] )</code> dan hasilnya terserah ingin kita apa kan.</p>\n<p>Yang membedakan ORM dengan <em>“query builder”</em> pada dasarnya hanyalah level abstraksi alias API yang ditawarkan, seperti mungkin kita bisa menggunakan <code>$db->select( 'users', [ 'email' ], [ 'id' => 1337 ] )</code> yang misalnya karena kita tidak percaya dengan apa yang dilakukan oleh method <code>find</code>. Tapi ORM ada bukan karena tanpa alasan, fitur umum yang dijual oleh ORM salah duanya adalah “association” dan “hooks”.</p>\n<p>Dengan <em>query builder</em> tentu kita bisa melakukan ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">transaction</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\">( $db ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">insert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'addresses'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'address'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Jl. Dipayuda'</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $address_id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">id</span><span style=\"color: #C9D1D9\">();</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">insert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'shipping_address'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'address'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Jl. Mayjend Panjaitan No.69'</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $shipping_address_id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">id</span><span style=\"color: #C9D1D9\">();</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">insert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'users'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #A5D6FF\">'name'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'krido'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #A5D6FF\">'address_id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> $address_id,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #A5D6FF\">'shipping_address_id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> $shipping_address_id</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">commit</span><span style=\"color: #C9D1D9\">();</span></span></code></pre>\n<p>Dengan ORM, mungkin bisa seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #79C0FF\">DB</span><span style=\"color: #FF7B72\">::</span><span style=\"color: #D2A8FF\">transaction</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\">() {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $address </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">new</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Address</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'address'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Jl. Dipayuda'</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $shipping_address </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">new</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">ShippingAddress</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'address'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Jl. Mayjend Panjaitan No.69'</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">User</span><span style=\"color: #FF7B72\">::</span><span style=\"color: #D2A8FF\">find</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #79C0FF\">69</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $user</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">address</span><span style=\"color: #C9D1D9\">()</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">save</span><span style=\"color: #C9D1D9\">( $address );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $user</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">shipping_address</span><span style=\"color: #C9D1D9\">()</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">save</span><span style=\"color: #C9D1D9\">( $shipping_address );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">} );</span></span></code></pre>\n<p>Atau contoh hooks, dengan query builder mungkin kita bisa saja melakukan seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">transaction</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\">( $db ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">delete</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'users'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1337</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">delete</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'logs'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1337</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">commit</span><span style=\"color: #C9D1D9\">();</span></span></code></pre>\n<p>Dengan ORM, mungkin bisa seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">self::</span><span style=\"color: #D2A8FF\">deleting</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\">( $user ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $user</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">logs</span><span style=\"color: #C9D1D9\">()</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">each</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> ( $log ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $log</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">delete</span><span style=\"color: #C9D1D9\">();</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  } );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">} );</span></span></code></pre>\n<p>Ya mungkin tidak sesederhana diatas, tapi semoga mendapat gambarannya.</p>\n<h3 id=\"testing\">Testing</h3>\n<p>Misal ada kasus: <em>Ambil data artikel yang memiliki id 10</em>, bagaimana kita menulis test untuk skenario diatas?</p>\n<p>Kita pasti harus mengsimulasikan basis data yang ada karena tidak mungkin bila menggunakan basis data beneran. Berdasarkan contoh diatas, untuk menandakan bahwa artikel yang diambil adalah yang memiliki id 10 dan bukan 6969, misal pseudocode nya seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">get_article_by_id</span><span style=\"color: #C9D1D9\">( $article_id ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #8B949E\">// ... query to db</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">return</span><span style=\"color: #C9D1D9\"> $article;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span></code></pre>\n<p>Dengan query builder, kemungkinan besar untuk mengetahui apakah yang kita query tersebut “benar” adalah dengan melakukan pencocokan dengan raw query nya, misalnya seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$query </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $article</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">get_article_by_id</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #79C0FF\">10</span><span style=\"color: #C9D1D9\"> )</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #C9D1D9\">queryString;</span></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">assert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $query,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #FF7B72\">SELECT</span><span style=\"color: #A5D6FF\"> id, title, content </span><span style=\"color: #FF7B72\">FROM</span><span style=\"color: #A5D6FF\"> articles </span><span style=\"color: #FF7B72\">WHERE</span><span style=\"color: #A5D6FF\"> id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #A5D6FF\"> </span><span style=\"color: #79C0FF\">10</span><span style=\"color: #A5D6FF\">\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span></code></pre>\n<p>Dengan ORM, kita bisa melakukannya misal seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$article </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Article</span><span style=\"color: #FF7B72\">::</span><span style=\"color: #D2A8FF\">find</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #79C0FF\">10</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">assert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $article</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #C9D1D9\">id,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #79C0FF\">10</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span></code></pre>\n<p>Karena dengan ORM kita bisa melakukan seeding data dengan mudah dan hal yang perlu kita gunakan untuk berinteraksi dengan basis data adalah sesuatu bernama “model”.</p>\n<h3 id=\"the-abstraction-dilemma-dilemma\">‘The abstraction dilemma’ dilemma</h3>\n<p>Sekarang begini, pada akhirnya, kita—sebagai pengembang—pun akan membuat abstraksi.</p>\n<p>Ingin support driver berbeda agar ketika menggunakan SQLite dan MySQL bisa menggunakan API yang sama di aplikasi kita? Cute, maybe let’s write our own driver compatibility layer.</p>\n<p>Ingin mengatur connection pooling terhadap database yang kita gunakan? Sweet, let’s write one too!</p>\n<p>What if we want to use MVC but still want to say fuck you to ORM? Writing models is cheap, let’s write our own FactoryModel base class!</p>\n<p>Also, input sanitization.</p>\n<p>And parameter interpolation might sound sexy too!</p>\n<p>Gue mendingan nulis library gue sendiri (dan nulis test + dokumentasi + maintain + fix bug + rilis + update deps) daripada harus menarik barang random dari internet yang berukuran 291kB hanya untuk sesuatu bernama ORM ini (plus harus mengingat API yang ada di docs yang enggak banget buat level gue).</p>\n<p>And, damn, ORM (and MVC pattern) is so over-engineering. Apa susahnya coba pas pengguna klik tombol login, kirim <code>SELECT email, password FROM users WHERE email = (email_input) and password = bcrypt(sha256(md5((password_input))), (very_salt))</code> mungkin di payload POST, proses whatever yang didapat dari response backend, and that’s that.</p>\n<p>Data pengguna yang ada di basis data kita kan milik pengguna juga, dengan bantuan “row-level security” mungkin harusnya oke oke aja klo interface yang digunakan user adalah SQL editor (atau bisa stream SQL query via netcat or something).</p>\n<p>Dan hey, sekarang 2022 dan RDBMS itu terlalu kuno. Kita punya firebase, supabase, fauna, mongodb, couchdb, anything yang mana memiliki nice API dan very serverless.</p>\n<p>Oh, kita juga ada Ethereum Blockchain sekarang.</p>\n<p>Pengetahuan tentang ORM lo akan kadaluarsa karena web3 is the future, database scaling for internet-scale is hard (good luck in using vitess &#x26; cockroachdb) and the future is now.</p>\n<h3 id=\"penutup\">Penutup</h3>\n<p>Gue mengerti maksud dan tujuan menghindari ORM adalah untuk menghindari overhead (yang mungkin tidak seberapa) dan yang paling penting agar siapapun ingin melihat ke lower-level view dengan menulis sintaks raw SQL agar siapaun tahu apa yang dia lakukan mungkin untuk mencegah “script kiddies problem”.</p>\n<p>Dan, ya, ORM is overused. Hampir setiap framework dari mirco sampai macro pasti menawarkan ORM sekalipun mungkin kita tidak membutuhkannya.</p>\n<p>Dari pengalaman gue yang pernah menulis raw SQL query, menggunakan query builder, sampai ke penggunaan ORM, yang paling cocok dengan gue adalah tidak berinteraksi dengan basis data sama sekali.</p>\n<p>That’s why I’m here, as a Frontend Engineer.</p>\n<p>Just kidding.</p>\n<p>JIKA GUE HANYA MEMENTINGKAN EGO, GUE LEBIH SUKA QUERY BUILDER. JARI GUE PEGEL HARUS NAHAN SHIFT TIAP KALI NGETIK SELECT, FROM, ORDER BY, WHERE, JOIN, BLABLABLA SEKALIPUN TIDAK WAJIB DITULIS DENGAN FORMAT UPPERCASE (SEPERTI YANG ADA DI BAGIAN LIMITATIONS DI MIT LICENSE) SEPERTI INI DAN JUGA GUE MALES BUKA DOKUMENTASI BUAT MENGINGAT API APA AJA YANG BISA DIGUNAKAN DI ORM YANG GUE GUNAKAN.</p>\n<p>TAPI MENULIS KODE (ATAU LEBIH SPESIFIKNYA MENGEMBANGKAN APLIKASI) ADALAH SEBUAH KERJA SAMA TIM. KITA TIDAK BISA MEMAKSA ORANG LAIN UNTUK MENYESUAIKAN DENGAN SELERA KITA APALAGI SAMPAI MENJADI BAGIAN DARI “ENGINEERING CULTURE” HANYA KARENA GUE LEAD DI ORGANISASI TERSEBUT, MISALNYA.</p>\n<p>GUE SEDANG TIDAK TERIAK BY THE WAY.</p>\n<p>SEBAGAI PENUTUP, UNTUK PERTANYAAN TO ORM OR NOT TO, JAWABANNYA ADALAH ✨TERGANTUNG✨.</p>\n<p>SEKIAN.</p>";

				const frontmatter$3 = {"pubDate":"November 3 2022","title":"ORM: The Abstraction Dilemma","description":"And, damn, ORM (and MVC pattern) is so over-engineering","excerpt":"And, damn, ORM (and MVC pattern) is so over-engineering","image":"~/assets/images/orm.png","tags":["software engineering"]};
				const file$3 = "D:/CRACK/DEV/basement/data/blog/orm.md";
				const url$3 = undefined;
				function rawContent$3() {
					return "\r\nDitahun 2018, sesuatu yang disebut \"transformasi digital\" sedang naik daun, dari proses digitasi sampai digitalisasi. Masyarakat dari berbagai lapisan berlomba untuk menerapkan teknologi di berbagai aspek, berkat era informasi ini pada pertengahan abad 21 ini.\r\n\r\nPenggunaan personal komputer (PC) sudah relatif banyak namun satu hal yang membuat gelembung ini besar adalah satu: internet. Internet salah satunya dapat menghubungkan penjual emping yang misal berada di Banjarnegara dengan pembeli yang berada di Sragen.\r\n\r\nInternet memungkinan sesuatu yang sebelumnya tidak mungkin karena terdapat bingkai pemisah yang bernama geografis.\r\n\r\nJika internet diibaratkan sebuah pulau, alamat IP berarti sebuah tanah kosong. Bangunannya adalah sesuatu yang disebut dengan situs, dan tidak jarang satu bangunan dihuni oleh banyak... penghuni.\r\n\r\nSetiap bangunan memiliki rancangan yang berbeda-beda, tergantung si *arsitek*. Pada sekitaran tahun 2018, kebanyakan bangunan tersebut memiliki rancangan yang sama: dibangun menggunakan sesuatu bernama HTML, CSS, JavaScript, PHP, dan basis data rasional yang kemungkinan besar MySQL. Dan jenis bangunan tersebut ada dua: statis dan dinamis. Perbedaan utamanya pada dasarnya hanyalah sumber data yang diambil untuk menampilkan sebuah halaman situs: apakah langsung dari kode, atau diambil dari sebuah penyimpanan data.\r\n\r\nUmumnya, jika jenis situs yang ingin dibuat berjenis aplikasi, situs tersebut kemungkinan besar bersifat dinamis karena adanya interaksi yang dilakukan oleh pengguna dan aplikasi harus bisa menangani interaksi tersebut. Misal, bila aplikasi tersebut memiliki sistem \"autentikasi\" untuk dapat mengenali siapa pengguna X dengan tanda pengenal Y di aplikasi tersebut, maka si aplikasi harus menyimpan data Y tersebut.\r\n\r\nData tersebut secara teknis bisa disimpan dimana saja, namun yang paling umum adalah di penyimpanan data yang persisten sehingga aplikasi tidak kehilangan data yang sudah dimasukkan sebelumnya oleh si pengguna ketika misalnya aplikasi tersebut mati.\r\n\r\nPenyimpanan data yang persisten tersebut biasa disebut dengan basis data atau database. Tidak banyak pilihan database yang bisa digunakan pada kala itu, namun yang paling populer penggunaannya adalah basis data rasional yang salah satunya adalah [MySQL](https://mariadb.org/about).\r\n\r\nKarena MySQL juga pada dasarnya adalah sebuah aplikasi, cara agar membuat aplikasi kita bisa berkomunikasi dengan aplikasi lain adalah melalui sesuatu yang disebut dengan [*Application Programming Interface*](https://en.wikipedia.org/wiki/API) (API). *API* biasa memiliki berbagai lapisan tergantung seberapa banyak detail yang ingin disembunyikan atau yang biasa disebut dengan abstraksi.\r\n\r\nDulu gue pernah ingin menjadi seorang \"Fullstack Engineer\" dan pekerjaan di Front-End kurang lebih adalah melakukan slicing yang sederhananya adalah tentang mengubah berkas PSD ke HTML, berbeda dengan sekarang yang sepertinya harus mengetahui semua lapisan yang ada di OSI model.\r\n\r\nJust kidding.\r\n\r\nDi bagian back-end, mereka besar kemungkinan bertanggung jawab akan *business/domain logic* yang sederhananya \"mengkodekan\" aturan bisnis dunia nyata yang menentukan bagaimana data dapat dibuat, disimpan, dan diubah.\r\n\r\nJika ada kesalahan \"logic\" yang menyebabkan bisnis rugi 10 milyar karena kegagalan ataupun kesalahan dalam penyimpanan data ke basis data, tidak perlu berpikir lama siapa yang harus disalahkan.\r\n\r\nSekarang kita fokus ke bagian teknis.\r\n\r\nBasis data disebut \"rasional\" salah satunya adalah karena data dipresentasikan dalam bentuk tabel yang mana terdiri dari baris dan kolom. Sistem dari basis data yang rasional ini disebut dengan *Relational Database Management System* (RDBMS) yang maksudnya, bila basis data tersebut menggunakan RDBMS, cara untuk berinteraksi dengan si database ini menggunakan sesuatu bernama *Structured Query Language* (SQL).\r\n\r\n\r\nKala itu bahasa pemrograman yang gue gunakan adalah PHP: Hypertext Preprocessor. Alasannya? Tuntutan (educational purpose) dan Pasar. Gue kurang mengerti kenapa PHP populer kala itu, yang gue yakin karena alasan ekosistem yang menjadikan pengembang PHP sebagai warga negara kelas satu seperti munculnya Web Hosting khusus untuk Web Server yang bisa menjalankan kode PHP, Content Management System (CMS) yang dibuat menggunakan PHP, dan yang paling penting dukungan PHP terhadap driver MySQL secara native.\r\n\r\n### PHP + MySQL in the nutshell\r\n\r\nUntuk membuat aplikasi yang dibuat menggunakan PHP dapat berkomunikasi dengan MySQL, kita perlu menghubungkannya terlebih dahulu, yakni melalui API. PHP menawarkan dua cara (jika gue tidak salah ingat) yakni melalui PDO atau langsung menggunakan *driver* resmi terkait basis data yang digunakan.\r\n\r\nMari kita fokus ke penggunaan *driver* resmi. Dalam penggunaan driver resminya pun terdapat 2 paradigma yang ada: Prosedural dan object-oriented. Karena gue suka ribet, mari kita pilih cara prosedural.\r\n\r\nUntuk menghubungkan aplikasi PHP kita ke basis data MySQL, method dari API yang ada yang bisa kita gunakan adalah `mysqli_connect` yang umumnya membutuhkan 3 parameter: hostname, username, dan password. Jika parameter hostname ter-definisi, maka komunikasi dengan MySQL harusnya menggunakan TCP daripada via UNIX socket (IPC).\r\n\r\nKode nya kurang lebih seperti ini:\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nKita akan menggunakan *variable* `$conn` tersebut untuk memanggil method lain seperti untuk melakukan *query* misalnya dengan memanggil `mysqli_query`. Let's do it, I guess?\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\n$database_list = mysqli_query( $conn, \"show databases\" );\r\n\r\nif ( $database_list ) {\r\n  print_r( $database_list );\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nHasilnya jika memiliki 4 database, kurang lebih seperti ini:\r\n\r\n```sql\r\n(\r\n    [current_field] => 0\r\n    [field_count] => 1\r\n    [lengths] =>\r\n    [num_rows] => 4\r\n    [type] => 0\r\n)\r\n```\r\n\r\nThat's it.\r\n\r\n### Very SELECT\r\n\r\nCara untuk menampilkan data menggunakan SQL adalah menggunakan statement `SELECT`. Argumen paling penting dari `SELECT` ini adalah nama table yang ingin diambil dan daftar kolom yang ingin ditampilkan.\r\n\r\nUmumnya kita harus mendefinisikan nama kolom yang ingin diambil karena alasan privasi daripada menggunakan `*` yang chaotic-evil sehingga menampilkan data lain yang mungkin tidak kita butuhkan dalam konteks tertentu.\r\n\r\nMenggunakan statement `SELECT` di `mysqli_query` tidak terlalu sulit, mungkin seperti ini dengan konteks kita ingin mengambil data di kolom `email` dari table `users`:\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password, $dbname );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\n$users = mysqli_query( $conn, \"SELECT email FROM users\" );\r\n\r\nif ( mysqli_num_rows( $users ) > 0 ) {\r\n  while( $row = mysqli_fetch_assoc( $users ) ) {\r\n    print_r( $row );\r\n  }\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nDiatas kita sudah mendefinisikan `$dbname` dan juga kita memanggil `mysqli_num_rows` untuk memastikan bahwa ada data yang bisa kita proses dan juga memanggil `mysqli_fetch_assoc` untuk menyimpan hasil *query* yang kita lakukan sebagai *associative* array.\r\n\r\nHasilnya kurang lebih seperti ini:\r\n\r\n```shell\r\nArray\r\n(\r\n    [email] => anggun@acme.inc\r\n)\r\nArray\r\n(\r\n    [email] => kiko@enak.tau\r\n)\r\nArray\r\n(\r\n    [email] => krido@hey.io \r\n)\r\n```\r\n\r\nSekarang kita ke bagian yang menarik, bagaimana kita ingin mengambil data untuk user `anggun@acme.inc` saja? Kita bisa menambahkan `WHERE` didalam sintaks SQL kita sebelumnya!\r\n\r\nTapi sedikit lucu jika menggunakan kolom `email` sebagai kunci utama. Biasanya kolom yang digunakan sebagai kunci utama adalah `id` dengan tipe data integer agar bisa di *auto increment* sehingga data yang disimpan bisa dijamin unik.\r\n\r\nBerarti sekarang mari kita ambil data `email` berdasarkan `id` dari si `users` tersebut!\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password, $dbname );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\n$user_id = 1337;\r\n$user = mysqli_query( $conn, \"SELECT email FROM users where id = $user_id\" );\r\n\r\nif ( mysqli_num_rows( $user ) > 0 ) {\r\n  while( $row = mysqli_fetch_assoc( $user ) ) {\r\n    print_r( $row );\r\n  }\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nDan hasilnya kurang lebih seperti ini:\r\n\r\n```shell\r\nArray\r\n(\r\n    [email] => anggun@acme.inc\r\n)\r\n```\r\n\r\nVery ez. Tapi nilai `$user_id` diatas masih statis, harusnya dinamis entah diambil dari `$_GET`, `$_POST` atau bahkan `$_COOKIE`.\r\n\r\nAnggap kita ambil dari *cookie* dengan *key* bernama `user_id` karena jika menggunakan *query parameter* terlalu jelas. Kode nya seperti ini:\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password, $dbname );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\nif ( !isset( $_COOKIE[ 'user_id' ] ) ) {\r\n  die( 'no user_id' );\r\n}\r\n\r\n$user_id = $_COOKIE[ 'user_id' ];\r\n$user = mysqli_query( $conn, \"SELECT email FROM users where id = $user_id\" );\r\n\r\nif ( mysqli_num_rows( $user ) > 0 ) {\r\n  while( $row = mysqli_fetch_assoc( $user ) ) {\r\n    print_r( $row );\r\n  }\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nJika nilai `$_COOKIE['user_id']` adalah `1337`, maka hasilnya kurang lebih sama seperti yang sebelumnya.\r\n\r\nBagaimana bila nilainya adalah `1337 or 1 = 1`?\r\n\r\nYou guessed it right.\r\n\r\n(and yes, $_SESSION and/or JWT exist for a reason — just in case)\r\n\r\n### Abstractions\r\n\r\nMeskipun sintaks SQL bersifat deklaratif, jurangnya justru ada di API nya. Ya, PHP memiliki PDO tapi bahasa pemrograman bukan hanya PHP di dunia ini.\r\n\r\nJika kita melihat cuplikan kode diatas, kita bisa membuat abstraksi seperti untuk:\r\n\r\n- membuat koneksi dan menutupnya\r\n- menangani data yang didapat dari input pengguna\r\n- menangani ketika data yang diminta tidak ada\r\n- memberikan ketika data yang diminta ada\r\n\r\n...terlepas bahasa pemrograman ataupun basis data yang digunakan.\r\n\r\nPseudocode nya mungkin seperti ini:\r\n\r\n```php\r\n$db = new DB( $ENV[ 'DB' ] );\r\n\r\nif ( !isset( $_COOKIE[ 'user_id' ] ) ) {\r\n  die( 'no user_id' );\r\n}\r\n\r\n$user = $db->select(\r\n  'users',\r\n  array( 'email' ),\r\n  array( 'id' => $_COOKIE[ 'user_id' ] )\r\n);\r\n\r\nprint_r( $user );\r\n```\r\n\r\nYes, kita bisa buat abstraksi lagi untuk terus menutupi aib yang ada di kode kita yang mungkin menjadi seperti ini:\r\n\r\n```php\r\nif ( ! isset( $_COOKIE[ 'user_id' ] ) ) {\r\n  die( 'no user_id' );\r\n}\r\n\r\n$user = User::find( $_COOKIE[ 'user_id' ], array( 'email' ) );\r\n\r\nprint_r( $user );\r\n```\r\n\r\nDan, ya, mungkin kamu sedikit familiar dengan sintaks diatas.\r\n\r\n### The abstraction dilemma\r\n\r\nBangun tidur cek Twitter ada unpopular opinion tentang *ORMs are often overused*. Meskipun gue seringnya cuman tertarik bahas unpopular opinion tentang buna raven, but I can't stand this one.\r\n\r\nYes man, ORMs are often overused. We can literally put a very raw SQL queries on something like `/sql.php?query=select * from users --because why not` dan sanitization berada di level reverse proxy or something ataupun bisa pakai GraphQL biar lebih gaya.\r\n\r\nTapi sebelum kita julidin ORM, mari kita bahas sedikit apa itu ORM.\r\n\r\n### Object-relational Mapping (ORM)\r\n\r\nORM singkatnya adalah sebuah teknik untuk melakukan query dan memanipulasi data dari sebuah database menggunakan paradigma berorientasi objek.\r\n\r\nSeperti, untuk memanggil `SELECT email FROM users where id = 1337` kita bisa hanya dengan memanggil method `find` dari instance `User` misalnya seperti `User::find( 1337, [ 'email' ] )` dan hasilnya terserah ingin kita apa kan.\r\n\r\nYang membedakan ORM dengan *\"query builder\"* pada dasarnya hanyalah level abstraksi alias API yang ditawarkan, seperti mungkin kita bisa menggunakan `$db->select( 'users', [ 'email' ], [ 'id' => 1337 ] )` yang misalnya karena kita tidak percaya dengan apa yang dilakukan oleh method `find`. Tapi ORM ada bukan karena tanpa alasan, fitur umum yang dijual oleh ORM salah duanya adalah \"association\" dan \"hooks\".\r\n\r\nDengan *query builder* tentu kita bisa melakukan ini:\r\n\r\n```php\r\n$db->transaction(\r\n  function( $db ) {\r\n    $db->insert(\r\n      'addresses',\r\n      array( 'address' => 'Jl. Dipayuda' )\r\n    );\r\n\r\n    $address_id = $db->id();\r\n\r\n    $db->insert(\r\n      'shipping_address',\r\n      array( 'address' => 'Jl. Mayjend Panjaitan No.69' )\r\n    );\r\n\r\n    $shipping_address_id = $db->id();\r\n\r\n    $db->insert(\r\n      'users',\r\n      array(\r\n        'name' => 'krido',\r\n        'address_id' => $address_id,\r\n        'shipping_address_id' => $shipping_address_id\r\n      )\r\n    );\r\n  }\r\n);\r\n\r\n$db->commit();\r\n```\r\n\r\nDengan ORM, mungkin bisa seperti ini:\r\n\r\n```php\r\nDB::transaction( function() {\r\n  $address = new Address(\r\n    array( 'address' => 'Jl. Dipayuda' )\r\n  );\r\n\r\n  $shipping_address = new ShippingAddress(\r\n    array( 'address' => 'Jl. Mayjend Panjaitan No.69' )\r\n  );\r\n\r\n  $user = User::find( 69 );\r\n\r\n  $user->address()->save( $address );\r\n  $user->shipping_address()->save( $shipping_address );\r\n} );\r\n```\r\n\r\nAtau contoh hooks, dengan query builder mungkin kita bisa saja melakukan seperti ini:\r\n\r\n```php\r\n$db->transaction(\r\n  function( $db ) {\r\n    $db->delete(\r\n      'users',\r\n      array( 'user_id' => 1337 )\r\n    );\r\n\r\n    $db->delete(\r\n      'logs',\r\n      array( 'user_id' => 1337 )\r\n    );\r\n  }\r\n);\r\n\r\n$db->commit();\r\n```\r\n\r\nDengan ORM, mungkin bisa seperti ini:\r\n\r\n```php\r\nself::deleting( function( $user ) {\r\n  $user->logs()->each( function ( $log ) {\r\n    $log->delete();\r\n  } );\r\n} );\r\n```\r\n\r\nYa mungkin tidak sesederhana diatas, tapi semoga mendapat gambarannya.\r\n\r\n### Testing\r\n\r\nMisal ada kasus: *Ambil data artikel yang memiliki id 10*, bagaimana kita menulis test untuk skenario diatas?\r\n\r\nKita pasti harus mengsimulasikan basis data yang ada karena tidak mungkin bila menggunakan basis data beneran. Berdasarkan contoh diatas, untuk menandakan bahwa artikel yang diambil adalah yang memiliki id 10 dan bukan 6969, misal pseudocode nya seperti ini:\r\n\r\n```php\r\nfunction get_article_by_id( $article_id ) {\r\n  // ... query to db\r\n  return $article;\r\n}\r\n```\r\n\r\nDengan query builder, kemungkinan besar untuk mengetahui apakah yang kita query tersebut \"benar\" adalah dengan melakukan pencocokan dengan raw query nya, misalnya seperti ini:\r\n\r\n```php\r\n$query = $article->get_article_by_id( 10 )->queryString;\r\nassert(\r\n  $query,\r\n  \"SELECT id, title, content FROM articles WHERE id = 10\"\r\n);\r\n```\r\n\r\nDengan ORM, kita bisa melakukannya misal seperti ini:\r\n\r\n```php\r\n$article = Article::find( 10 );\r\n\r\nassert(\r\n  $article->id,\r\n  10\r\n);\r\n```\r\n\r\nKarena dengan ORM kita bisa melakukan seeding data dengan mudah dan hal yang perlu kita gunakan untuk berinteraksi dengan basis data adalah sesuatu bernama \"model\".\r\n\r\n### 'The abstraction dilemma' dilemma\r\n\r\nSekarang begini, pada akhirnya, kita—sebagai pengembang—pun akan membuat abstraksi.\r\n\r\nIngin support driver berbeda agar ketika menggunakan SQLite dan MySQL bisa menggunakan API yang sama di aplikasi kita? Cute, maybe let's write our own driver compatibility layer.\r\n\r\nIngin mengatur connection pooling terhadap database yang kita gunakan? Sweet, let's write one too!\r\n\r\nWhat if we want to use MVC but still want to say fuck you to ORM? Writing models is cheap, let's write our own FactoryModel base class!\r\n\r\nAlso, input sanitization.\r\n\r\nAnd parameter interpolation might sound sexy too!\r\n\r\nGue mendingan nulis library gue sendiri (dan nulis test + dokumentasi + maintain + fix bug + rilis + update deps) daripada harus menarik barang random dari internet yang berukuran 291kB hanya untuk sesuatu bernama ORM ini (plus harus mengingat API yang ada di docs yang enggak banget buat level gue).\r\n\r\nAnd, damn, ORM (and MVC pattern) is so over-engineering. Apa susahnya coba pas pengguna klik tombol login, kirim `SELECT email, password FROM users WHERE email = (email_input) and password = bcrypt(sha256(md5((password_input))), (very_salt))` mungkin di payload POST, proses whatever yang didapat dari response backend, and that's that.\r\n\r\nData pengguna yang ada di basis data kita kan milik pengguna juga, dengan bantuan \"row-level security\" mungkin harusnya oke oke aja klo interface yang digunakan user adalah SQL editor (atau bisa stream SQL query via netcat or something).\r\n\r\nDan hey, sekarang 2022 dan RDBMS itu terlalu kuno. Kita punya firebase, supabase, fauna, mongodb, couchdb, anything yang mana memiliki nice API dan very serverless.\r\n\r\nOh, kita juga ada Ethereum Blockchain sekarang.\r\n\r\nPengetahuan tentang ORM lo akan kadaluarsa karena web3 is the future, database scaling for internet-scale is hard (good luck in using vitess & cockroachdb) and the future is now.\r\n\r\n### Penutup\r\n\r\nGue mengerti maksud dan tujuan menghindari ORM adalah untuk menghindari overhead (yang mungkin tidak seberapa) dan yang paling penting agar siapapun ingin melihat ke lower-level view dengan menulis sintaks raw SQL agar siapaun tahu apa yang dia lakukan mungkin untuk mencegah \"script kiddies problem\".\r\n\r\nDan, ya, ORM is overused. Hampir setiap framework dari mirco sampai macro pasti menawarkan ORM sekalipun mungkin kita tidak membutuhkannya.\r\n\r\nDari pengalaman gue yang pernah menulis raw SQL query, menggunakan query builder, sampai ke penggunaan ORM, yang paling cocok dengan gue adalah tidak berinteraksi dengan basis data sama sekali.\r\n\r\nThat's why I'm here, as a Frontend Engineer.\r\n\r\nJust kidding.\r\n\r\nJIKA GUE HANYA MEMENTINGKAN EGO, GUE LEBIH SUKA QUERY BUILDER. JARI GUE PEGEL HARUS NAHAN SHIFT TIAP KALI NGETIK SELECT, FROM, ORDER BY, WHERE, JOIN, BLABLABLA SEKALIPUN TIDAK WAJIB DITULIS DENGAN FORMAT UPPERCASE (SEPERTI YANG ADA DI BAGIAN LIMITATIONS DI MIT LICENSE) SEPERTI INI DAN JUGA GUE MALES BUKA DOKUMENTASI BUAT MENGINGAT API APA AJA YANG BISA DIGUNAKAN DI ORM YANG GUE GUNAKAN.\r\n\r\nTAPI MENULIS KODE (ATAU LEBIH SPESIFIKNYA MENGEMBANGKAN APLIKASI) ADALAH SEBUAH KERJA SAMA TIM. KITA TIDAK BISA MEMAKSA ORANG LAIN UNTUK MENYESUAIKAN DENGAN SELERA KITA APALAGI SAMPAI MENJADI BAGIAN DARI \"ENGINEERING CULTURE\" HANYA KARENA GUE LEAD DI ORGANISASI TERSEBUT, MISALNYA.\r\n\r\nGUE SEDANG TIDAK TERIAK BY THE WAY.\r\n\r\nSEBAGAI PENUTUP, UNTUK PERTANYAAN TO ORM OR NOT TO, JAWABANNYA ADALAH ✨TERGANTUNG✨.\r\n\r\nSEKIAN.\r\n";
				}
				function compiledContent$3() {
					return html$3;
				}
				function getHeadings$3() {
					return [{"depth":3,"slug":"php--mysql-in-the-nutshell","text":"PHP + MySQL in the nutshell"},{"depth":3,"slug":"very-select","text":"Very SELECT"},{"depth":3,"slug":"abstractions","text":"Abstractions"},{"depth":3,"slug":"the-abstraction-dilemma","text":"The abstraction dilemma"},{"depth":3,"slug":"object-relational-mapping-orm","text":"Object-relational Mapping (ORM)"},{"depth":3,"slug":"testing","text":"Testing"},{"depth":3,"slug":"the-abstraction-dilemma-dilemma","text":"‘The abstraction dilemma’ dilemma"},{"depth":3,"slug":"penutup","text":"Penutup"}];
				}
				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
					const contentFragment = createVNode(Fragment, { 'set:html': html$3 });
					return contentFragment;
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$3,
  compiledContent: compiledContent$3,
  default: Content$3,
  file: file$3,
  frontmatter: frontmatter$3,
  getHeadings: getHeadings$3,
  rawContent: rawContent$3,
  url: url$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "<p>Semakin dewasa gue semakin sadar bahwa waktu dan kesempatan yang gue miliki semakin berkurang. Dan somehow udah males dengan adanya drama, entah karena udah bosan atau karena udah capek.</p>\n<p>Drama hampir terjadi di berbagai lapisan kehidupan, di pekerjaan; pertemanan, percintaan, keluarga, sampai sampai ke sesederhana internet mati pas lagi netflixan. Ada banyak cara tanggapan yang bisa gue pilih, tapi kebanyakan tanggapan yang gue ambil adalah “yaudah lah ya”.</p>\n<p>Sekilas tanggapan tersebut terlihat seperti pasrah, tapi pasrah adalah tentang tidak melakukan apa-apa. Seperti, ketika internet brengsek ini masih mati ketika gue nonton sekarang pada saat ini sekalipun gue udah cek &#x26; restart DNS; cek &#x26; restart perangkat, dan cek &#x26; restart router, apalagi yang bisa gue lakukan selain yaudah lah ya?</p>\n<p>Dan itu bukan pasrah. Ada sesuatu yang bisa dan tidak bisa kita kontrol, dan gue sudah melakukan bagian gue. Mungkin gue bisa aja bikin drama, marah-marah di Twitter nyalahin <del>indiehome</del> penyedia internet yang sedang gue gunakan sambil skrinsut presentase <em>packet loss</em> dari hasil <code>ping</code> di <code>command promp</code>, tapi pada akhirnya meskipun gue engga marah-marah di Twitter-pun internet gue akan kembali normal.</p>\n<p>…seperti saat ini yang mana gue udah engga mood buat lanjut nonton lagi.</p>\n<p>Oke somehow marah-marah dapat membuat lega, tapi gue rasa untuk bisa lega marah-marah bukanlah satu-satunya cara.</p>\n<p>Di konteks lain, misal pertemanan. Gue udah males drama-drama di pertemanan, kalau mau berteman dengan gue ya yo kalau engga ataupun udah engga mau, yaudah. Kalau ada sesuatu yang bisa diperbaiki mari perbaiki, kalau gak mau diperbaiki ya udah. Itu hak lo. Gue engga akan menghalangi pintu keluar untuk mereka yang berusaha keras ingin keluar.</p>\n<p>…pertemanan gue sejauh ini lumayan tenang-tenang aja, dan yang di atas itu hanya sebatas sebagai contoh.</p>\n<h2 id=\"the-farewell\">The farewell(?)</h2>\n<p>Hal yang paling sering dialami dalam urusan “perpisahan” ini pertama di pekerjaan.\r\nManusia datang dan pergi. Ketika ada teman kantor gue yang memutuskan untuk pindah kantor, gue tidak akan merasa sedih dengan keputusan yang telah dia pilih. Itu pasti keputusan terbaik yang sudah dia pikirkan dengan sangat matang. dan yang pasti untuk kebaikan dia juga. Tentu gue merasa sedih —khususnya apabila gue sangat dekat dengan dia— karena gue dan dia sudah tidak bisa bekerja bersama kembali, tapi gue akan lebih memilih “good luck for whatever next” daripada “yah sedih blablabla” karena itu adalah sebuah perayaan, bukan perpisahan.</p>\n<p>Gue memikirkan ulang konsep tentang perpisahan yang dibanyak kasus ternyata lebih cocok disebut sebagai perayaan.</p>\n<p>Contoh lain yang sering dialamin juga dalah di percintaan. kasusnya hampir sama dengan paragraf sebelumnya, namun konteks hubungannya adalah perasaan daripada pekerjaan. terkadang kita merasa sulit unutuk meninggalkan ataupun ditinggalkan, namun bagaimanapun mungkin itu adalah jalan yang terbaik.</p>\n<p>Mungkin hubungan yang ada terkesan toxic dan tidak ada yang bisa diubah karena salah satu pihak tidak benar-benar berubah. Mungkin hubugan yang ada berat sebelah sehingga yang merasa diuntungkan hanya satu pihak. Masih banyak lagi kemungkinan yang ada, namun intinya selalu mengarah ke perpisahan yang tidak jarang terasa menyakitkan.</p>\n<p>Entah kita yang menjadi pelaku ataupun korban, bagaimanapun kita tidak bisa terus egois baik terhadap diri kita sendiri ataupun orang lain.</p>\n<p>Dan perpisahan adalah sebuah bentuk perayaan, untuk kebaikan diri sendiri ataupun orang lain. Dan ingat, segala sesuatu selalu memiliki <em>tradeoff</em>, dan tugas kita dalah memilih yang terbaik untuk kita.</p>\n<p>Sebagai penutup, kepada siapapun yang sedang merasakan sakitnya perpisahan, relakanlah. Jangan menutup pintu keluar untuk mereka yang berusaha keras ingin keluar.</p>\n<p>Dan untuk siapapun yang sedang tidak terima dengan apa yang sedang terjadi, berbesar hatilah. Segala sesuatu terjadi pasti karena sebuah alasan dan pasti ada alasannya, dan pada akhirnya kita akan mengetahuinya jika memang itu cukup berdampak.</p>\n<p>Que sera, sera.</p>\n<p>Apa yang terjadi, terjadilah.</p>\n<p>Ketahui apa yang bisa dan tidak bisa diperbaiki serta mana yang bisa dan tidak bisa dikontrol, maka seharusnya kita bisa lebih sedikit mengkhawatirkan atas apa yang akan terjadi, baik yang diharapkan ataupun yang tidak diharapkan.</p>\n<p>The future’s not ours to see.</p>\n<p>So, good luck for whatever comes next, everyone!</p>";

				const frontmatter$2 = {"pubDate":"january 10 2023","title":"Que sera, sera","description":"Whatever will be, will be","excerpt":"Whatever will be, will be","image":"~/assets/images/que-sera.jpg","tags":["life"]};
				const file$2 = "D:/CRACK/DEV/basement/data/blog/que-sera.md";
				const url$2 = undefined;
				function rawContent$2() {
					return "\r\nSemakin dewasa gue semakin sadar bahwa waktu dan kesempatan yang gue miliki semakin berkurang. Dan somehow udah males dengan adanya drama, entah karena udah bosan atau karena udah capek.\r\n\r\nDrama hampir terjadi di berbagai lapisan kehidupan, di pekerjaan; pertemanan, percintaan, keluarga, sampai sampai ke sesederhana internet mati pas lagi netflixan. Ada banyak cara tanggapan yang bisa gue pilih, tapi kebanyakan tanggapan yang gue ambil adalah \"yaudah lah ya\".\r\n\r\nSekilas tanggapan tersebut terlihat seperti pasrah, tapi pasrah adalah tentang tidak melakukan apa-apa. Seperti, ketika internet brengsek ini masih mati ketika gue nonton sekarang pada saat ini sekalipun gue udah cek & restart DNS; cek & restart perangkat, dan cek & restart router, apalagi yang bisa gue lakukan selain yaudah lah ya?\r\n\r\nDan itu bukan pasrah. Ada sesuatu yang bisa dan tidak bisa kita kontrol, dan gue sudah melakukan bagian gue. Mungkin gue bisa aja bikin drama, marah-marah di Twitter nyalahin ~indiehome~ penyedia internet yang sedang gue gunakan sambil skrinsut presentase _packet loss_ dari hasil `ping` di `command promp`, tapi pada akhirnya meskipun gue engga marah-marah di Twitter-pun internet gue akan kembali normal.\r\n\r\n...seperti saat ini yang mana gue udah engga mood buat lanjut nonton lagi.\r\n\r\nOke somehow marah-marah dapat membuat lega, tapi gue rasa untuk bisa lega marah-marah bukanlah satu-satunya cara.\r\n\r\nDi konteks lain, misal pertemanan. Gue udah males drama-drama di pertemanan, kalau mau berteman dengan gue ya yo kalau engga ataupun udah engga mau, yaudah. Kalau ada sesuatu yang bisa diperbaiki mari perbaiki, kalau gak mau diperbaiki ya udah. Itu hak lo. Gue engga akan menghalangi pintu keluar untuk mereka yang berusaha keras ingin keluar.\r\n\r\n...pertemanan gue sejauh ini lumayan tenang-tenang aja, dan yang di atas itu hanya sebatas sebagai contoh.\r\n\r\n## The farewell(?)\r\n\r\nHal yang paling sering dialami dalam urusan \"perpisahan\" ini pertama di pekerjaan.\r\nManusia datang dan pergi. Ketika ada teman kantor gue yang memutuskan untuk pindah kantor, gue tidak akan merasa sedih dengan keputusan yang telah dia pilih. Itu pasti keputusan terbaik yang sudah dia pikirkan dengan sangat matang. dan yang pasti untuk kebaikan dia juga. Tentu gue merasa sedih —khususnya apabila gue sangat dekat dengan dia— karena gue dan dia sudah tidak bisa bekerja bersama kembali, tapi gue akan lebih memilih \"good luck for whatever next\" daripada \"yah sedih blablabla\" karena itu adalah sebuah perayaan, bukan perpisahan.\r\n\r\nGue memikirkan ulang konsep tentang perpisahan yang dibanyak kasus ternyata lebih cocok disebut sebagai perayaan.\r\n\r\nContoh lain yang sering dialamin juga dalah di percintaan. kasusnya hampir sama dengan paragraf sebelumnya, namun konteks hubungannya adalah perasaan daripada pekerjaan. terkadang kita merasa sulit unutuk meninggalkan ataupun ditinggalkan, namun bagaimanapun mungkin itu adalah jalan yang terbaik.\r\n\r\nMungkin hubungan yang ada terkesan toxic dan tidak ada yang bisa diubah karena salah satu pihak tidak benar-benar berubah. Mungkin hubugan yang ada berat sebelah sehingga yang merasa diuntungkan hanya satu pihak. Masih banyak lagi kemungkinan yang ada, namun intinya selalu mengarah ke perpisahan yang tidak jarang terasa menyakitkan.\r\n\r\nEntah kita yang menjadi pelaku ataupun korban, bagaimanapun kita tidak bisa terus egois baik terhadap diri kita sendiri ataupun orang lain.\r\n\r\nDan perpisahan adalah sebuah bentuk perayaan, untuk kebaikan diri sendiri ataupun orang lain. Dan ingat, segala sesuatu selalu memiliki _tradeoff_, dan tugas kita dalah memilih yang terbaik untuk kita.\r\n\r\nSebagai penutup, kepada siapapun yang sedang merasakan sakitnya perpisahan, relakanlah. Jangan menutup pintu keluar untuk mereka yang berusaha keras ingin keluar.\r\n\r\nDan untuk siapapun yang sedang tidak terima dengan apa yang sedang terjadi, berbesar hatilah. Segala sesuatu terjadi pasti karena sebuah alasan dan pasti ada alasannya, dan pada akhirnya kita akan mengetahuinya jika memang itu cukup berdampak.\r\n\r\nQue sera, sera.\r\n\r\nApa yang terjadi, terjadilah.\r\n\r\nKetahui apa yang bisa dan tidak bisa diperbaiki serta mana yang bisa dan tidak bisa dikontrol, maka seharusnya kita bisa lebih sedikit mengkhawatirkan atas apa yang akan terjadi, baik yang diharapkan ataupun yang tidak diharapkan.\r\n\r\nThe future's not ours to see.\r\n\r\nSo, good luck for whatever comes next, everyone!\r\n";
				}
				function compiledContent$2() {
					return html$2;
				}
				function getHeadings$2() {
					return [{"depth":2,"slug":"the-farewell","text":"The farewell(?)"}];
				}
				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return contentFragment;
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$2,
  compiledContent: compiledContent$2,
  default: Content$2,
  file: file$2,
  frontmatter: frontmatter$2,
  getHeadings: getHeadings$2,
  rawContent: rawContent$2,
  url: url$2
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<p>Sometimes all the complicated things begin from the simple one. From a simple hello turned into romantic visions. From a simple meeting turned into a wedding. From a simple swipe right turned into a blowjob or two.</p>\n<p>We may be wondering about everything: How did it all really begin?</p>\n<p>And why?</p>\n<p>We don’t understand and never will. Just that’s how the universe works.</p>\n<p>And then life goes on, for the best or the worst. Sometimes we just feel like a piece is missing in some particular time. It’s like how the brain yearns for nicotine when you used to smoke. Or the blood longs for caffeine when you used to drink coffee. Or maybe the pain in your back when you used to sit in a very comfortable fucking ergonomic chair.</p>\n<p>That’s how addiction works: You feel different when something you’re used to is not there.</p>\n<p>Then you stare at the door. Or maybe at your phone. Wondering to meet the things you used to see or find the voice you used to hear. A simple call or meeting may turn into something complicated, either for the best or the worst. That’s how it all should have started and not how it all ended.</p>\n<p>And the clock is ticking and always will be.</p>\n<p>You just lock the door or place the phone away.</p>\n<p>Then you close your eyes. You call a name quietly hoping they can hear you back or maybe wondering if they’re doing the same.</p>\n<p>“See you when I see you”, you both said.</p>\n<p>Maybe in the next life, or in the next day.</p>\n<p>No farewells or promises.</p>\n<p>Just let the universe work,</p>\n<p>and then the clock keeps ticking.</p>";

				const frontmatter$1 = {"pubDate":"Oct 13 2022","title":"See you when I see you","description":".........","excerpt":".........","image":"~/assets/images/see-you.jpg","tags":["scenario"]};
				const file$1 = "D:/CRACK/DEV/basement/data/blog/see-you-when-i-see-you.md";
				const url$1 = undefined;
				function rawContent$1() {
					return "\r\nSometimes all the complicated things begin from the simple one. From a simple hello turned into romantic visions. From a simple meeting turned into a wedding. From a simple swipe right turned into a blowjob or two.\r\n\r\nWe may be wondering about everything: How did it all really begin?\r\n\r\nAnd why?\r\n\r\nWe don't understand and never will. Just that's how the universe works.\r\n\r\nAnd then life goes on, for the best or the worst. Sometimes we just feel like a piece is missing in some particular time. It's like how the brain yearns for nicotine when you used to smoke. Or the blood longs for caffeine when you used to drink coffee. Or maybe the pain in your back when you used to sit in a very comfortable fucking ergonomic chair.\r\n\r\nThat's how addiction works: You feel different when something you're used to is not there.\r\n\r\nThen you stare at the door. Or maybe at your phone. Wondering to meet the things you used to see or find the voice you used to hear. A simple call or meeting may turn into something complicated, either for the best or the worst. That's how it all should have started and not how it all ended.\r\n\r\nAnd the clock is ticking and always will be.\r\n\r\nYou just lock the door or place the phone away.\r\n\r\nThen you close your eyes. You call a name quietly hoping they can hear you back or maybe wondering if they're doing the same.\r\n\r\n\"See you when I see you\", you both said.\r\n\r\nMaybe in the next life, or in the next day.\r\n\r\nNo farewells or promises.\r\n\r\nJust let the universe work,\r\n\r\nand then the clock keeps ticking.";
				}
				function compiledContent$1() {
					return html$1;
				}
				function getHeadings$1() {
					return [];
				}
				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return contentFragment;
				}
				Content$1[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$1,
  compiledContent: compiledContent$1,
  default: Content$1,
  file: file$1,
  frontmatter: frontmatter$1,
  getHeadings: getHeadings$1,
  rawContent: rawContent$1,
  url: url$1
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<p>Bagian yang paling sulit dalam memulai adalah mengakhiri yang meskipun di beberapa kasus ataupun kondisi terlihat relatif mudah, namun gue rasa tidak untuk dibanyak kasus. Memulai sesuatu adalah seperti berhadapan dengan banyak pintu, disini lo seperti harus memilih pintu mana dulu yang ingin dimasuki dari sekian banyak pintu yang dimiliki.</p>\n<p>Pada akhirnya, hanya satu pintu yang akan dimasuki dalam satu waktu. Dan ketika masuk ke ruangan dibalik pintu tersebut, brengseknya, terdapat banyak jalan keluar yang berbeda-beda.</p>\n<p>Dan ini seperti masuk ke labirin namun memiliki jalan keluar lebih dari satu.</p>\n<p>Lebih brengseknya lagi, terkadang jalan keluar yang dipilih mengarah ke pintu masuk lainnya. Dan yang paling brengsek, tidak ada jalan untuk kembali. Dan yang paling menyebalkan adalah ketika sadar bahwa lo ternyata sudah terkurung dalam labirin tersebut dari pintu yang paling pertama yang lo masuki, yang bahkan lo tidak memiliki kontrol dalam memasuki pintu pertama tersebut.</p>\n<p>Dan tidak ada jalan untuk keluar selain dijemput oleh sesuatu yang tugasnya hanyalah untuk menjemput lo.</p>\n<h2 id=\"iterasi\">Iterasi</h2>\n<p>Yang menarik dari membuat teh adalah sekali teh terbuat, cepat atau lambat ia akan habis. Meskipun proses pembuatan teh bisa terus terulang, pada akhirnya, hasil dari proses tersebut bisa dianggap selesai yang dalam konteks ini adalah ketika teh tersebut habis diminum ataupun dibuang.</p>\n<p>Mengambil contoh lain adalah dalam membuat program, atau aplikasi bila menggunakan bahasa yang umum diketahui. Membuat aplikasi brengseknya bukanlah proses yang sekali jadi lalu selesai meskipun sama-sama untuk dikonsumsi. Google sebagai salah satu mesin pencari yang ada di internet saja berumur sekitar 26 tahun di tahun 2022. Sudah 25 tahun program tersebut ditulis dan dikembangkan sampai hari ini yang mungkin sampai akhir dari internet nanti.</p>\n<p>Tampilan dan performanya selalu berubah dari tahun ke tahun, yang pasti harapannya selalu mengarah ke perubahan yang lebih baik dari yang sebelumnya.</p>\n<p>Yang menjadi pertanyaan adalah “Kapan Google akan berhenti merilis versi baru?”</p>\n<p>Tidak ada yang tahu pastinya, namun dibanyak kasus, jawaban objektifnya adalah “ketika akan memberhentikan operasionalnya”.</p>\n<p>Yang berarti, dia akan berhenti memperbaiki “bug” yang ada ataupun yang akan ada di aplikasi tersebut dan di lain sisi, dia juga akan berhenti membuat sesuatu (yang dalam konteks ini adalah fitur) menjadi lebih baik lagi.</p>\n<h2 id=\"stabilitas\">Stabilitas</h2>\n<p>Mungkin tidak jarang kita mendengar kata “stabil”, dari kata “stabil secara finansial”, “kondisi mental sudah kembali stabil”, “menggunakan versi aplikasi yang stabil”, apapun.</p>\n<p>Jika mengambil arti dari KBBI, arti dari stabil adalah: <em><strong>1. mantap; kukuh; tidak goyah</strong></em> (tentang bangunan, pemerintah, dan sebagainya): situasi politik dalam negeri kita —; <em><strong>2. tetap jalannya; tenang; tidak goyang</strong></em> (tentang kendaraan, kapal, dan sebagainya): setelah barang-barang dibuang ke laut, kapal — kembali; <em><strong>3. tidak berubah-ubah; tetap; tidak naik turun</strong></em> (tentang harga barang, nilai uang, dan sebagainya): harga kopra sekarang mulai —;</p>\n<p>Mari kita ambil kesimpulan bahwa stabil artinya adalah sebuah kondisi yang bersifat netral dan berada di tengah. Tidak cenderung ke A ataupun ke B.</p>\n<p>Pertama, gue ingin mengambil contoh dari rilis aplikasi. Aplikasi dirilis ke versi stabil sederhananya ketika sudah memenuhi tes penerimaan pengguna. Versi tersebut tidak harus sempurna, namun setidaknya pengguna dapat menerima pembaruan dari versi tersebut.</p>\n<p>Dan gue rasa bukan berarti di versi tersebut bebas dari kesalahan, mungkin setidaknya kesalahan tersebut tidak (terlalu) mengganggu pengguna jika memang ada.</p>\n<p>Kedua, gue ingin mengambil contoh dari finansial. Seseorang dikatakan “stabil secara finansial” ketika misalnya seseorang tersebut tidak khawatir membayar tagihan karena seseorang tersebut tahu bahwa dia akan memiliki uang yang cukup.</p>\n<p>Dan gue rasa bukan berarti bila seseorang tersebut misalnya memiliki tagihan, dia dianggap tidak stabil secara finansial.</p>\n<p>Ketiga, gue ingin mengambil contoh dari kesehatan. Seseorang dikatakan “kesehatannya stabil” ketika misalnya seseorang tersebut tidak merasa sakit.</p>\n<p>Dan gue rasa bukan berarti bila seseorang tersebut misalnya tidak memiliki penyakit apapun di tubuhnya.</p>\n<p>Berdasarkan tiga contoh diatas, bisa disimpulkan bahwa kestabilan selalu memiliki tolak ukur dan juga nilainya tidak cenderung ke salah satu ukuran.</p>\n<p>Sejujurnya gue baru tahu tentang adanya konsep “healthy relationship” di dunia ini. Sebelumnya gue tidak tahu bahwa ternyata ada “healthy” dan “unhealthy” dalam sebuah relationship.</p>\n<p>Sebuah hubungan singkatnya dianggap “healthy” ketika suatu hubungan yang dijalani oleh dua pihak tersebut menjadi stabil dan yang mana adalah “kesalingan” sebagai tolak ukurnya.</p>\n<p>Sederhananya, mungkin, bila dua belah pihak tersebut saling percaya; saling berjuang, saling mendukung, saling menjaga kepercayaan, saling mengerti, dan sebagainya, hubungan tersebut mungkin bisa disebut sebagai hubungan yang sehat.</p>\n<p>Pasti ada kondisi ketika “kesalingan” tersebut cenderung ke salah satu pihak, dan PR nya kemungkinan besar adalah bagaimana membuat kondisi tersebut kembali menjadi stabil alias kondisi “kesalingan” tersebut berarti kembali lagi ke yang mungkin tanpa kecenderungan ke salah satu pihak.</p>\n<p>Tapi gue rasa PR tersulitnya bukanlah itu.</p>\n<p>Melainkan di mempertahankan “kestabilan” tersebut selama mungkin dan mengembalikannya kembali ketika sedang tidak.</p>\n<p>Karena bukankah perubahan adalah sesuatu yang tidak dapat dihindari?</p>\n<p>Yang berarti, gue rasa, peran terbesar dari kondisi diatas adalah di “bagaimana menyikapinya”.</p>\n<p>Berhubungan adalah salah satu hal yang tidak bisa dihindari.</p>\n<p>Dari hubungan dengan keluarga, teman, rekan kerja, ataupun orang lain secara umum. Atau dengan kekasih bila memiliki.</p>\n<p>Pasti ada saja hal yang membuat hubungan tersebut… berjalan tidak semestinya.</p>\n<p>Apapun alasannya, penyebab utamanya adalah selalu tentang sesuatu yang disebut dengan ‘kesalahan’.</p>\n<p>Dan pilihannya gue rasa ada dua: mengembalikan keadaan tersebut menjadi seperti semula, atau membiarkannya apa adanya sampai keadaan ‘semula’ tersebut sudah memiliki bentuk berbeda.</p>\n<p>Jika berurusan dengan lebih dari satu pihak, berarti harus ada “kesalingan” dalam sesuatu untuk mencapai sesuatu. Dalam konteks hubungan, mungkin sesuatu tersebut adalah saling maaf dan memaafkan.</p>\n<p>Namun yang paling berat justru di saling “menyetujui” untuk meminta maaf dan memaafkan.</p>\n<p>Dan bagian yang ingin gue soroti adalah: kata “menyetujui” diatas ialah bentuk dari sebuah penyikapan. Dan sayangnya tidak ada kata “keterpaksaan” dari sebuah “kesalingan”.</p>\n<p>Gue kepikiran menulis ini ketika sedang kepikiran tentang konsep “healthy relationship” and for what it’s worth I’m not good on this relationship thing but I learn over time.</p>\n<p>Satu hal yang paling penting dari “kestabilan” gue rasa adalah resilience. Like, it doesn’t really matter how stable or unstable the thing was as long as it could recover.</p>\n<p>Hubungan bukanlah seperti sesuatu yang sudah dibuat lalu selesai. Semoga masih ingat pembahasan tentang teh yang berada peragraf awal sebelumnya. Melainkan hubungan adalah sesuatu yang diharapkan berlangsung selama mungkin, jika memang kata ‘selamanya’ lebih terdengar seperti omong kosong.</p>\n<p>Dan berbicara tentang “kelangsungan” pastinya tidak lepas dengan “proses”.</p>\n<p>Dan mungkin proses tersebut sedang stabil, atau sedang di titik rendah, atau sedang berada di puncak. Terlepas sedang berada di titik mana, sikap yang harus dilakukan untuk sesuatu yang diharapkan berlangsung selama mungkin adalah mempertahankan “kestabilan” tersebut selama mungkin dan mengembalikannya kembali ketika sedang tidak.</p>\n<p>Ya, yang mana adalah PR terberat yang tadi sudah disinggung sebelumnya.</p>\n<p>Sejujurnya gue belum pernah menjalin hubungan seperti konsep healthy relationship ini jika memang tanda-tandanya adalah seperti yang dijabarkan di artikel <a href=\"https://www.idntimes.com/life/relationship/mia-rahmawati/10-tanda-kamu-sudah-berhasil-menjalankan-healthy-relationship-c1c2/\"><em>10 Tanda Kamu Sudah Berhasil Menjalankan Healthy Relationship versi IDN Times</em></a> karena beberapa poinnya pernah ada yang tidak terpenuhi.</p>\n<p>Tapi arti healthy relationship menurut gue sederhana: sebuah hubungan yang terjalin selama mungkin, karena memang dari awal tujuannya adalah untuk itu.</p>\n<p>Ada beragam cara untuk membuatnya tetap healthy, dan ada beragam cara juga untuk membuatnya kembali stabil. Cara yang gue pakai untuk membuat tetap healthy sampai hari ini adalah dengan tidak melakukan sesuatu yang membuat unhealthy, dan cara untuk membuatnya kembali stabil… I don’t know, saling maaf dan memaafkan? Mencari solusi bersama? Glad that I’m not in that state yet, but I’m always ready for anything.</p>\n<p>Anyway my relationship today is pretty stable after long fluctuations as in the cryptocurrencies market, and I’m glad we made it through.</p>\n<p>Maintaining stability is not an easy job yet nobody said it was easy at the first place.</p>\n<p>And I usually write here when I have a somewhat big problem, but apparently someone is looking for some reading so here we are as you always give me energy.</p>\n<p>Thank you for having me.</p>";

				const frontmatter = {"pubDate":"October 23 2022","title":"Stabilitas","description":"Thank you for having me.","excerpt":"Thank you for having me.","image":"~/assets/images/stabilitas.jpg","tags":["thoughts"]};
				const file = "D:/CRACK/DEV/basement/data/blog/stabilitas.md";
				const url = undefined;
				function rawContent() {
					return "\r\nBagian yang paling sulit dalam memulai adalah mengakhiri yang meskipun di beberapa kasus ataupun kondisi terlihat relatif mudah, namun gue rasa tidak untuk dibanyak kasus. Memulai sesuatu adalah seperti berhadapan dengan banyak pintu, disini lo seperti harus memilih pintu mana dulu yang ingin dimasuki dari sekian banyak pintu yang dimiliki.\r\n\r\nPada akhirnya, hanya satu pintu yang akan dimasuki dalam satu waktu. Dan ketika masuk ke ruangan dibalik pintu tersebut, brengseknya, terdapat banyak jalan keluar yang berbeda-beda.\r\n\r\nDan ini seperti masuk ke labirin namun memiliki jalan keluar lebih dari satu.\r\n\r\nLebih brengseknya lagi, terkadang jalan keluar yang dipilih mengarah ke pintu masuk lainnya. Dan yang paling brengsek, tidak ada jalan untuk kembali. Dan yang paling menyebalkan adalah ketika sadar bahwa lo ternyata sudah terkurung dalam labirin tersebut dari pintu yang paling pertama yang lo masuki, yang bahkan lo tidak memiliki kontrol dalam memasuki pintu pertama tersebut.\r\n\r\nDan tidak ada jalan untuk keluar selain dijemput oleh sesuatu yang tugasnya hanyalah untuk menjemput lo.\r\n\r\n## Iterasi\r\nYang menarik dari membuat teh adalah sekali teh terbuat, cepat atau lambat ia akan habis. Meskipun proses pembuatan teh bisa terus terulang, pada akhirnya, hasil dari proses tersebut bisa dianggap selesai yang dalam konteks ini adalah ketika teh tersebut habis diminum ataupun dibuang.\r\n\r\nMengambil contoh lain adalah dalam membuat program, atau aplikasi bila menggunakan bahasa yang umum diketahui. Membuat aplikasi brengseknya bukanlah proses yang sekali jadi lalu selesai meskipun sama-sama untuk dikonsumsi. Google sebagai salah satu mesin pencari yang ada di internet saja berumur sekitar 26 tahun di tahun 2022. Sudah 25 tahun program tersebut ditulis dan dikembangkan sampai hari ini yang mungkin sampai akhir dari internet nanti.\r\n\r\nTampilan dan performanya selalu berubah dari tahun ke tahun, yang pasti harapannya selalu mengarah ke perubahan yang lebih baik dari yang sebelumnya.\r\n\r\nYang menjadi pertanyaan adalah \"Kapan Google akan berhenti merilis versi baru?\"\r\n\r\nTidak ada yang tahu pastinya, namun dibanyak kasus, jawaban objektifnya adalah \"ketika akan memberhentikan operasionalnya\".\r\n\r\nYang berarti, dia akan berhenti memperbaiki \"bug\" yang ada ataupun yang akan ada di aplikasi tersebut dan di lain sisi, dia juga akan berhenti membuat sesuatu (yang dalam konteks ini adalah fitur) menjadi lebih baik lagi.\r\n\r\n## Stabilitas\r\nMungkin tidak jarang kita mendengar kata \"stabil\", dari kata \"stabil secara finansial\", \"kondisi mental sudah kembali stabil\", \"menggunakan versi aplikasi yang stabil\", apapun.\r\n\r\nJika mengambil arti dari KBBI, arti dari stabil adalah: ***1. mantap; kukuh; tidak goyah*** (tentang bangunan, pemerintah, dan sebagainya): situasi politik dalam negeri kita --; ***2. tetap jalannya; tenang; tidak goyang*** (tentang kendaraan, kapal, dan sebagainya): setelah barang-barang dibuang ke laut, kapal -- kembali; ***3. tidak berubah-ubah; tetap; tidak naik turun*** (tentang harga barang, nilai uang, dan sebagainya): harga kopra sekarang mulai --;\r\n\r\nMari kita ambil kesimpulan bahwa stabil artinya adalah sebuah kondisi yang bersifat netral dan berada di tengah. Tidak cenderung ke A ataupun ke B.\r\n\r\nPertama, gue ingin mengambil contoh dari rilis aplikasi. Aplikasi dirilis ke versi stabil sederhananya ketika sudah memenuhi tes penerimaan pengguna. Versi tersebut tidak harus sempurna, namun setidaknya pengguna dapat menerima pembaruan dari versi tersebut.\r\n\r\nDan gue rasa bukan berarti di versi tersebut bebas dari kesalahan, mungkin setidaknya kesalahan tersebut tidak (terlalu) mengganggu pengguna jika memang ada.\r\n\r\nKedua, gue ingin mengambil contoh dari finansial. Seseorang dikatakan \"stabil secara finansial\" ketika misalnya seseorang tersebut tidak khawatir membayar tagihan karena seseorang tersebut tahu bahwa dia akan memiliki uang yang cukup.\r\n\r\nDan gue rasa bukan berarti bila seseorang tersebut misalnya memiliki tagihan, dia dianggap tidak stabil secara finansial.\r\n\r\nKetiga, gue ingin mengambil contoh dari kesehatan. Seseorang dikatakan \"kesehatannya stabil\" ketika misalnya seseorang tersebut tidak merasa sakit.\r\n\r\nDan gue rasa bukan berarti bila seseorang tersebut misalnya tidak memiliki penyakit apapun di tubuhnya.\r\n\r\nBerdasarkan tiga contoh diatas, bisa disimpulkan bahwa kestabilan selalu memiliki tolak ukur dan juga nilainya tidak cenderung ke salah satu ukuran.\r\n\r\nSejujurnya gue baru tahu tentang adanya konsep \"healthy relationship\" di dunia ini. Sebelumnya gue tidak tahu bahwa ternyata ada \"healthy\" dan \"unhealthy\" dalam sebuah relationship.\r\n\r\nSebuah hubungan singkatnya dianggap \"healthy\" ketika suatu hubungan yang dijalani oleh dua pihak tersebut menjadi stabil dan yang mana adalah \"kesalingan\" sebagai tolak ukurnya.\r\n\r\nSederhananya, mungkin, bila dua belah pihak tersebut saling percaya; saling berjuang, saling mendukung, saling menjaga kepercayaan, saling mengerti, dan sebagainya, hubungan tersebut mungkin bisa disebut sebagai hubungan yang sehat.\r\n\r\nPasti ada kondisi ketika \"kesalingan\" tersebut cenderung ke salah satu pihak, dan PR nya kemungkinan besar adalah bagaimana membuat kondisi tersebut kembali menjadi stabil alias kondisi \"kesalingan\" tersebut berarti kembali lagi ke yang mungkin tanpa kecenderungan ke salah satu pihak.\r\n\r\nTapi gue rasa PR tersulitnya bukanlah itu.\r\n\r\nMelainkan di mempertahankan \"kestabilan\" tersebut selama mungkin dan mengembalikannya kembali ketika sedang tidak.\r\n\r\nKarena bukankah perubahan adalah sesuatu yang tidak dapat dihindari?\r\n\r\nYang berarti, gue rasa, peran terbesar dari kondisi diatas adalah di \"bagaimana menyikapinya\".\r\n\r\nBerhubungan adalah salah satu hal yang tidak bisa dihindari.\r\n\r\nDari hubungan dengan keluarga, teman, rekan kerja, ataupun orang lain secara umum. Atau dengan kekasih bila memiliki.\r\n\r\nPasti ada saja hal yang membuat hubungan tersebut... berjalan tidak semestinya.\r\n\r\nApapun alasannya, penyebab utamanya adalah selalu tentang sesuatu yang disebut dengan 'kesalahan'.\r\n\r\nDan pilihannya gue rasa ada dua: mengembalikan keadaan tersebut menjadi seperti semula, atau membiarkannya apa adanya sampai keadaan 'semula' tersebut sudah memiliki bentuk berbeda.\r\n\r\nJika berurusan dengan lebih dari satu pihak, berarti harus ada \"kesalingan\" dalam sesuatu untuk mencapai sesuatu. Dalam konteks hubungan, mungkin sesuatu tersebut adalah saling maaf dan memaafkan.\r\n\r\nNamun yang paling berat justru di saling \"menyetujui\" untuk meminta maaf dan memaafkan.\r\n\r\nDan bagian yang ingin gue soroti adalah: kata \"menyetujui\" diatas ialah bentuk dari sebuah penyikapan. Dan sayangnya tidak ada kata \"keterpaksaan\" dari sebuah \"kesalingan\".\r\n\r\nGue kepikiran menulis ini ketika sedang kepikiran tentang konsep \"healthy relationship\" and for what it's worth I'm not good on this relationship thing but I learn over time.\r\n\r\nSatu hal yang paling penting dari \"kestabilan\" gue rasa adalah resilience. Like, it doesn't really matter how stable or unstable the thing was as long as it could recover.\r\n\r\nHubungan bukanlah seperti sesuatu yang sudah dibuat lalu selesai. Semoga masih ingat pembahasan tentang teh yang berada peragraf awal sebelumnya. Melainkan hubungan adalah sesuatu yang diharapkan berlangsung selama mungkin, jika memang kata 'selamanya' lebih terdengar seperti omong kosong.\r\n\r\nDan berbicara tentang \"kelangsungan\" pastinya tidak lepas dengan \"proses\".\r\n\r\nDan mungkin proses tersebut sedang stabil, atau sedang di titik rendah, atau sedang berada di puncak. Terlepas sedang berada di titik mana, sikap yang harus dilakukan untuk sesuatu yang diharapkan berlangsung selama mungkin adalah mempertahankan \"kestabilan\" tersebut selama mungkin dan mengembalikannya kembali ketika sedang tidak.\r\n\r\nYa, yang mana adalah PR terberat yang tadi sudah disinggung sebelumnya.\r\n\r\nSejujurnya gue belum pernah menjalin hubungan seperti konsep healthy relationship ini jika memang tanda-tandanya adalah seperti yang dijabarkan di artikel [*10 Tanda Kamu Sudah Berhasil Menjalankan Healthy Relationship versi IDN Times*](https://www.idntimes.com/life/relationship/mia-rahmawati/10-tanda-kamu-sudah-berhasil-menjalankan-healthy-relationship-c1c2/) karena beberapa poinnya pernah ada yang tidak terpenuhi.\r\n\r\nTapi arti healthy relationship menurut gue sederhana: sebuah hubungan yang terjalin selama mungkin, karena memang dari awal tujuannya adalah untuk itu.\r\n\r\nAda beragam cara untuk membuatnya tetap healthy, dan ada beragam cara juga untuk membuatnya kembali stabil. Cara yang gue pakai untuk membuat tetap healthy sampai hari ini adalah dengan tidak melakukan sesuatu yang membuat unhealthy, dan cara untuk membuatnya kembali stabil... I don't know, saling maaf dan memaafkan? Mencari solusi bersama? Glad that I'm not in that state yet, but I'm always ready for anything.\r\n\r\nAnyway my relationship today is pretty stable after long fluctuations as in the cryptocurrencies market, and I'm glad we made it through.\r\n\r\nMaintaining stability is not an easy job yet nobody said it was easy at the first place.\r\n\r\nAnd I usually write here when I have a somewhat big problem, but apparently someone is looking for some reading so here we are as you always give me energy.\r\n\r\nThank you for having me.\r\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"iterasi","text":"Iterasi"},{"depth":2,"slug":"stabilitas","text":"Stabilitas"}];
				}
				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content,
  compiledContent,
  default: Content,
  file,
  frontmatter,
  getHeadings,
  rawContent,
  url
}, Symbol.toStringTag, { value: 'Module' }));

const getNormalizedPost = async (post) => {
	const { frontmatter, compiledContent, rawContent, file } = post;
	const ID = file.split('/').pop().split('.').shift();

	return {
		id: ID,

		pubDate: frontmatter.pubDate,
		draft: frontmatter.draft,

		canonical: frontmatter.canonical,
		slug: frontmatter.slug || ID,

		title: frontmatter.title,
		description: frontmatter.description,
		body: compiledContent(),
		image: frontmatter.image,

		excerpt: frontmatter.excerpt,
		authors: frontmatter.authors,
		category: frontmatter.category,
		tags: frontmatter.tags,
		readingTime: Math.ceil(getReadingTime(rawContent()).minutes),
	}
};

const load$1 = async function () {
	const posts = /* #__PURE__ */ Object.assign({"/data/blog/arabella.md": __vite_glob_0_0,"/data/blog/banyak-tahu.md": __vite_glob_0_1,"/data/blog/emptiness.md": __vite_glob_0_2,"/data/blog/fud.md": __vite_glob_0_3,"/data/blog/konfigurasi-vscode.md": __vite_glob_0_4,"/data/blog/konsumen-pintar.md": __vite_glob_0_5,"/data/blog/orm.md": __vite_glob_0_6,"/data/blog/que-sera.md": __vite_glob_0_7,"/data/blog/see-you-when-i-see-you.md": __vite_glob_0_8,"/data/blog/stabilitas.md": __vite_glob_0_9

});

	const normalizedPosts = Object.keys(posts).map(async (key) => {
		const post = await posts[key];
		return await getNormalizedPost(post)
	});

	const results = (await Promise.all(normalizedPosts))
		.sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf())
		.filter((post) => !post.draft);
	return results
};

let _posts;

/** */
const fetchPosts = async () => {
	_posts = _posts || load$1();

	return await _posts
};

const get = async () => {

	const posts = await fetchPosts();

	return rss({
		title: `${SITE.name}`,
		description: SITE.description,
		site: "https://yuxxeun.now.sh/",

		items: posts.map((post) => ({
			link: getPermalink(post.slug, 'post'),
			title: post.title,
			description: post.description,
			pubDate: post.pubDate,
		})),
	})
};

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/widgets/Secreto.svelte generated by Svelte v3.52.0 */

const Secreto = create_ssr_component(($$result, $$props, $$bindings, slots) => {

	// fetch the data
	async function getData() {
		const { data, error } = await supabase.from('comments').select('*').order('id', { ascending: false });
		if (error) throw new Error(error.message);
		return data;
	}

	// insert data
	let newComment = '';

	let inputField;

	return `<section><form class="${"text-white text-center my-5"}"><input required minlength="${"5"}" type="${"text"}" placeholder="${"give me some jokes"}" class="${"input rounded-md p-2 focus:outline-none border border-white bg-black mx-auto input-bordered items-center text-oranged w-full max-w-xs"}"${add_attribute("this", inputField, 0)}${add_attribute("value", newComment, 0)}>
		<button value="${"Submit"}" class="${"btn m-2 btn-outline btn-secondary font-basement italic"}">Send</button></form>
	${``}

	
	<div>${(function (__value) {
		if (is_promise(__value)) {
			__value.then(null, noop);

			return `
			<div class="${"alert mx-auto md:w-5/6 my-5 items-center text-center font-semibold font-space alert-warning shadow-lg"}"><div><span>Conneting to database...</span></div></div>
		`;
		}

		return (function (data) {
			return `
			${each(data, comment => {
				return `<div class="${"mockup-code card w-96 my-2 mx-auto bg-base-100 shadow-xl"}"><div class="${"card-body items-center text-center"}"><div class="${"badge badge-secondary font-space"}">${escape(moment(comment.created_at).format('Do MMMM, YYYY'))}</div>
						<p class="${"font-inter text-lg"}">${escape(comment.txt)}</p></div>
				</div>`;
			})}
		`;
		})(__value);
	})(getData())}</div></section>`;
});

const $$Astro$c = createAstro("https://yuxxeun.now.sh/");
const $$Secreto = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Secreto;
  const meta = {
    title: `Secreto \u2014 ${SITE.name}`,
    description: SITE.description,
    ogType: "Secreto"
  };
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="max-w-6xl mx-auto px-4 sm:px-6">
		${renderComponent($$result2, "Secreto", Secreto, { "client:load": true, "client:component-hydration": "load", "client:component-path": "~/components/widgets/Secreto.svelte", "client:component-export": "default" })}
	</div>` })}`;
}, "D:/CRACK/DEV/basement/src/pages/secreto.astro");

const $$file$5 = "D:/CRACK/DEV/basement/src/pages/secreto.astro";
const $$url$5 = "/secreto";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Secreto,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$b = createAstro("https://yuxxeun.now.sh/");
const $$Error404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Error404;
  return renderTemplate`${maybeRenderHead($$result)}<section class="flex items-center h-full p-16">
	<div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
		<div class="max-w-md text-left">
			<h2 class="mb-8 font-basement font-bold text-9xl">
				<span class="sr-only">Error</span>
				<span class="text-oranged">451</span>
			</h2>
			<p class="text-3xl font-semibold md:text-3xl font-montreal">Unavailable For Legal Reasons</p>
			<p class="mt-4 mb-8 text-lg text-gray-600 dark:text-slate-400">
				Why show a generic 404 when I can make it sound mysterious? It seems you've found something that used to
				exist, or you spelled something wrong. I'm guessing you spelled something wrong. Can you double check
				that URL?
			</p>
			<a rel="noopener noreferrer prefetch"${addAttribute(getHomePermalink(), "href")} class="btn text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-800 ml-4">Return Home</a>
		</div>
	</div>
</section>`;
}, "D:/CRACK/DEV/basement/src/components/widgets/Error404.astro");

const $$Astro$a = createAstro("https://yuxxeun.now.sh/");
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$404;
  const title = `404 \u2014 ${SITE.name}`;
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "meta": { title } }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Error404", $$Error404, {})}` })}`;
}, "D:/CRACK/DEV/basement/src/pages/404.astro");

const $$file$4 = "D:/CRACK/DEV/basement/src/pages/404.astro";
const $$url$4 = "/404";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$9 = createAstro("https://yuxxeun.now.sh/");
const $$BlogLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { meta } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<section class="px-6 overflow-x-auto sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-3xl">
		<header>
			<h1 class="text-center text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-8 md:mb-16 font-heading">
				${renderSlot($$result2, $$slots["title"])}
			</h1>
		</header>
		${renderSlot($$result2, $$slots["default"])}
	</section>` })}`;
}, "D:/CRACK/DEV/basement/src/layouts/BlogLayout.astro");

const $$Astro$8 = createAstro("https://yuxxeun.now.sh/");
const $$Tags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Tags;
  const { tags, class: className = "text-sm" } = Astro2.props;
  return renderTemplate`${tags && Array.isArray(tags) && renderTemplate`${maybeRenderHead($$result)}<ul${addAttribute(className, "class")}>
			${tags.map((tag) => renderTemplate`<li class="mr-2 mb-2 inline-block rounded-md border bg-oranged/30 border-oranged dark:border-oranged py-1 text-md px-2 dark:bg-oranged/20 hover:text-black dark:hover:text-white font-delight tracking-wide text-oranged">
					<a${addAttribute(getPermalink(tag, "tag"), "href")}>${tag}</a>
				</li>`)}
		</ul>`}`;
}, "D:/CRACK/DEV/basement/src/components/atoms/Tags.astro");

const load = async function () {
	let images = [];
	try {
		images = /* #__PURE__ */ Object.assign({"/src/assets/images/arabella.jpg": () => import('../arabella.f9d48940.mjs'),"/src/assets/images/banyak-tahu.jpg": () => import('../banyak-tahu.197368c5.mjs'),"/src/assets/images/editor.jpg": () => import('../editor.a011f04f.mjs'),"/src/assets/images/emptyness.jpg": () => import('../emptyness.1bfb253a.mjs'),"/src/assets/images/fud.jpg": () => import('../fud.ab378ef4.mjs'),"/src/assets/images/gradient.jpg": () => Promise.resolve().then(() => gradient),"/src/assets/images/konfigurasi-vscode/hasil.png": () => import('../hasil.58cfa885.mjs'),"/src/assets/images/konfigurasi-vscode/vscode-default.png": () => import('../vscode-default.2ed24e37.mjs'),"/src/assets/images/konsumen-pintar.jpg": () => import('../konsumen-pintar.f8b67d2d.mjs'),"/src/assets/images/orm.png": () => import('../orm.4df207b3.mjs'),"/src/assets/images/que-sera.jpg": () => import('../que-sera.1f6d83ad.mjs'),"/src/assets/images/see-you.jpg": () => import('../see-you.7fa9f4ce.mjs'),"/src/assets/images/stabilitas.jpg": () => import('../stabilitas.4cfd178a.mjs')});
	} catch (e) {
		// continue regardless of error
	}
	return images
};

let _images;

/** */
const fetchLocalImages = async () => {
	_images = _images || load();
	return await _images
};

/** */
const findImage = async (imagePath) => {
	if (typeof imagePath !== 'string') {
		return null
	}

	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath
	}

	if (!imagePath.startsWith('~/assets')) {
		return null
	} // For now only consume images using ~/assets alias (or absolute)

	const images = await fetchLocalImages();
	const key = imagePath.replace('~/', '/src/');

	return typeof images[key] === 'function' ? (await images[key]())['default'] : null
};

/** */
const getFormattedDate = (date) =>
	date
		? new Date(date).toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
		  })
		: '';

const $$Astro$7 = createAstro("https://yuxxeun.now.sh/");
const $$ListItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$ListItem;
  const { post } = Astro2.props;
  const image = await findImage(post.image);
  return renderTemplate`${maybeRenderHead($$result)}<article class="max-w-md mx-auto md:max-w-none grid md:grid-cols-2 gap-6 md:gap-8">
	<a class="relative block group"${addAttribute(getPermalink(post.slug, "post"), "href")}>
		<div class="relative h-0 pb-[56.25%] md:pb-[75%] md:h-80 lg:pb-[56.25%] overflow-hidden bg-gray-400 dark:bg-slate-700 rounded shadow-lg">
			${renderComponent($$result, "Picture", $$Picture, { "src": image, "class": "absolute inset-0 object-center object-fill w-full h-full mb-6 rounded shadow-lg bg-gray-400 dark:bg-slate-700", "widths": [400, 900], "sizes": "(max-width: 900px) 400px, 900px", "alt": post.title, "aspectRatio": "16:9" })}
		</div>
	</a>
	<div>
		<header>
			<h2 class="text-xl sm:text-2xl font-bold leading-snug mb-2 font-heading">
				<a class="font-montreal text-oranged uppercase hover:text-black dark:hover:text-white underline underline-offset-4 decoration-1 decoration-dotted transition ease-in duration-200"${addAttribute(getPermalink(post.slug, "post"), "href")}>
					${post.title}
				</a>
			</h2>
		</header>
		<p class="text-md font-delight tracking-wide dark:text-white text-black sm:text-lg flex-grow">
			${post.excerpt || post.description}
		</p>
		<footer class="mt-4">
			<div>
				<span class="text-gray-500 font-delight tracking-wide dark:text-slate-400">
					<time${addAttribute(post.pubDate, "datetime")}>${getFormattedDate(post.pubDate)}</time> &bull;
					${Math.ceil(post.readingTime)} min read
				</span>
			</div>
			<div class="mt-4">
				${renderComponent($$result, "PostTags", $$Tags, { "tags": post.tags })}
			</div>
		</footer>
	</div>
</article>`;
}, "D:/CRACK/DEV/basement/src/components/blog/ListItem.astro");

const $$Astro$6 = createAstro("https://yuxxeun.now.sh/");
const $$List = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$List;
  const { posts } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<ul>
	${posts.map((post) => renderTemplate`<li class="mb-10 md:mb-16">
				${renderComponent($$result, "Item", $$ListItem, { "post": post })}
			</li>`)}
</ul>`;
}, "D:/CRACK/DEV/basement/src/components/blog/List.astro");

const $$Astro$5 = createAstro("https://yuxxeun.now.sh/");
const $$Pagination = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Pagination;
  const { prevUrl, nextUrl, prevText = "Prev", nextText = "Next" } = Astro2.props;
  return renderTemplate`${(prevUrl || nextUrl) && renderTemplate`${maybeRenderHead($$result)}<div class="container flex font-display">
			<div class="container mx-auto flex flex-row justify-between">
				<a${addAttribute(prevUrl, "href")}${addAttribute(`btn mr-2 px-2 font-medium text-gray-600 shadow-none hover:text-gray-900 dark:text-gray-400 dark:hover:text-white
      ${!prevUrl ? "invisible" : ""}`, "class")}>
					<div class="flex flex-row align-middle">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:arrow-left", "class": "h-6 w-6" })}
						<p class="ml-2">${prevText}</p>
					</div>
				</a>
				<a${addAttribute(nextUrl, "href")}${addAttribute(`btn px-2 font-medium text-gray-600 shadow-none hover:text-gray-900 dark:text-gray-400 dark:hover:text-white ${!nextUrl ? "invisible" : ""}`, "class")}>
					<div class="flex flex-row align-middle">
						<span class="mr-2">${nextText}</span>
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:arrow-right", "class": "h-6 w-6" })}
					</div>
				</a>
			</div>
		</div>`}`;
}, "D:/CRACK/DEV/basement/src/components/atoms/Pagination.astro");

const $$Astro$4 = createAstro("https://yuxxeun.now.sh/");
async function getStaticPaths$3({ paginate }) {
  const posts = await fetchPosts();
  const tags = /* @__PURE__ */ new Set();
  posts.map((post) => {
    Array.isArray(post.tags) && post.tags.map((tag) => tags.add(tag.toLowerCase()));
  });
  return Array.from(tags).map(
    (tag) => paginate(
      posts.filter((post) => Array.isArray(post.tags) && post.tags.includes(tag)),
      {
        params: { tag: cleanSlug(tag), tags: TAG_BASE || void 0 },
        pageSize: BLOG.postsPerPage,
        props: { tag }
      }
    )
  );
}
const $$$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$$2;
  const { page, tag } = Astro2.props;
  const currentPage = page.currentPage ?? 1;
  const meta = {
    title: `Tag: '${tag}' ${currentPage > 1 ? `\u2014 Page ${currentPage} ` : ""}\u2014 ${SITE.name}`,
    description: SITE.description,
    canonical: getCanonical(getPermalink(page.url.current)),
    ogType: "Tag",
    noindex: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result2, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result3) => renderTemplate`${maybeRenderHead($$result3)}<span class="font-display lg:text-6xl text-2xl text-center uppercase tracking-tight text-oranged">${meta.ogType}: ${tag}
		</span>` })}` })}`;
}, "D:/CRACK/DEV/basement/src/pages/[...tags]/[tag]/[...page].astro");

const $$file$3 = "D:/CRACK/DEV/basement/src/pages/[...tags]/[tag]/[...page].astro";
const $$url$3 = "/[...tags]/[tag]/[...page]";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$2,
  file: $$file$3,
  getStaticPaths: getStaticPaths$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro("https://yuxxeun.now.sh/");
async function getStaticPaths$2({ paginate }) {
  const posts = await fetchPosts();
  const categories = /* @__PURE__ */ new Set();
  posts.map((post) => {
    typeof post.category === "string" && categories.add(post.category.toLowerCase());
  });
  return Array.from(categories).map(
    (category) => paginate(
      posts.filter((post) => typeof post.category === "string" && category === post.category.toLowerCase()),
      {
        params: { category: cleanSlug(category), categories: CATEGORY_BASE || void 0 },
        pageSize: BLOG.postsPerPage,
        props: { category }
      }
    )
  );
}
const $$$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$$1;
  const { page, category } = Astro2.props;
  const currentPage = page.currentPage ?? 1;
  const meta = {
    title: `Category '${category}' ${currentPage > 1 ? `\u2014 Page ${currentPage} ` : ""}\u2014 ${SITE.name}`,
    description: SITE.description,
    canonical: getCanonical(getPermalink(page.url.current)),
    noindex: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result2, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result3) => renderTemplate`
		Category: ${category}` })}` })}`;
}, "D:/CRACK/DEV/basement/src/pages/[...categories]/[category]/[...page].astro");

const $$file$2 = "D:/CRACK/DEV/basement/src/pages/[...categories]/[category]/[...page].astro";
const $$url$2 = "/[...categories]/[category]/[...page]";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$1,
  file: $$file$2,
  getStaticPaths: getStaticPaths$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("https://yuxxeun.now.sh/");
const $$SinglePost = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SinglePost;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<section class="py-8 sm:py-16 lg:py-20 mx-auto">
	<article class="overflow-x-auto">
		<header>
			<p class="max-w-3xl mx-auto font-semibold font-delight tracking-wide text-md lg:text-lg text-center">
				<time${addAttribute(post.pubDate, "datetime")}>${getFormattedDate(post.pubDate)}</time> &bull; ${Math.ceil(post.readingTime)} min read
			</p>
			<h1 class="px-4 uppercase text-oranged font-display text-2xl tracking-tight sm:px-6 max-w-3xl mx-auto text-center md:text-5xl font-bold leading-tighter mb-8 mt-4 font-heading">
				${post.title}
			</h1>
			${post.image && renderTemplate`${renderComponent($$result, "Picture", $$Picture, { "src": post.image, "class": "mx-auto mt-4 mb-6 max-w-full bg-gray-400  dark:bg-slate-700 sm:rounded-md lg:max-w-6xl", "widths": [400, 900], "sizes": "(max-width: 900px) 400px, 900px", "alt": post.description, "aspectRatio": "16:9" })}`}
		</header>
		<div class="overflow-x-hidden tracking-wide text-black dark:text-white container mx-auto px-6 font-delight sm:px-6 max-w-3xl prose prose-lg lg:prose-xl dark:prose-invert prose-headings:text-oranged prose-md prose-headings:font-extrabold prose-headings:font-heading prose-headings:leading-wide prose-headings:tracking-normal prose-headings:font-delight prose-a:text-oranged prose-img:rounded-md prose-img:shadow-lg mt-8">
			${renderComponent($$result, "Fragment", Fragment, { "class": "fragment" }, { "default": ($$result2) => renderTemplate`${unescapeHTML(post.body)}` })}
		</div>
		<div class="container mx-auto px-6 max-w-3xl mt-8">
			${renderComponent($$result, "PostTags", $$Tags, { "tags": post.tags })}
		</div>
	</article>
</section>`;
}, "D:/CRACK/DEV/basement/src/components/blog/SinglePost.astro");

const $$Astro$1 = createAstro("https://yuxxeun.now.sh/");
async function getStaticPaths$1() {
  const posts = await fetchPosts();
  return posts.map((post) => ({
    params: {
      slug: cleanSlug(post.slug),
      blog: POST_BASE || void 0
    },
    props: { post }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$slug;
  const { post } = Astro2.props;
  const meta = {
    title: `${post.title} \u2014 ${SITE.name}`,
    description: post.description,
    canonical: post.canonical || getCanonical(getPermalink(post.slug, "post")),
    image: await findImage(post.image),
    ogTitle: post.title,
    ogType: "lab"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "SinglePost", $$SinglePost, { "post": { ...post, image: meta.image } })}` })}`;
}, "D:/CRACK/DEV/basement/src/pages/[...blog]/[slug].astro");

const $$file$1 = "D:/CRACK/DEV/basement/src/pages/[...blog]/[slug].astro";
const $$url$1 = "/[...blog]/[slug]";

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file$1,
  getStaticPaths: getStaticPaths$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("https://yuxxeun.now.sh/");
async function getStaticPaths({ paginate }) {
  const posts = await fetchPosts();
  return paginate(posts, {
    params: { blog: BLOG_BASE || void 0 },
    pageSize: BLOG.postsPerPage
  });
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page } = Astro2.props;
  const currentPage = page.currentPage ?? 1;
  const meta = {
    title: `Laboratory ${currentPage > 1 ? `\u2014 ${currentPage} ` : ""}\u2014 ${SITE.name}`,
    description: SITE.description,
    canonical: getCanonical(getPermalink(page.url.current)),
    ogType: "Laboratory",
    noindex: currentPage > 1
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result2, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result3) => renderTemplate`${maybeRenderHead($$result3)}<span class="font-display lg:text-6xl text-2xl text-center uppercase tracking-tight text-oranged">${meta.ogType}
		</span>` })}` })}`;
}, "D:/CRACK/DEV/basement/src/pages/[...blog]/[...page].astro");

const $$file = "D:/CRACK/DEV/basement/src/pages/[...blog]/[...page].astro";
const $$url = "/[...blog]/[...page]";

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c, _page4 as d, _page5 as e, _page6 as f, _page7 as g, _page8 as h, _page9 as i };
