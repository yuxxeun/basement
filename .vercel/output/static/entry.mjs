import { escape as escape$1 } from 'html-escaper';
import slugify from 'limax';
/* empty css                                     */import 'http-cache-semantics';
import 'kleur/colors';
import 'node:fs/promises';
import 'node:os';
import 'node:path';
import 'node:url';
import 'magic-string';
import 'node:stream';
import 'slash';
import 'image-size';
import mime from 'mime';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimize } from 'svgo';
import { inject } from '@vercel/analytics';
import { createClient } from '@supabase/supabase-js';
import rss from '@astrojs/rss';
import getReadingTime from 'reading-time';

function check$1(Component) {
	return Component['render'] && Component['$$render'];
}

async function renderToStaticMarkup$1(Component, props, slotted) {
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		slots[key] = () =>
			`<astro-slot${key === 'default' ? '' : ` name="${key}"`}>${value}</astro-slot>`;
	}
	const { html } = Component.render(props, { $$slots: slots });
	return { html };
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.6.3";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape$1;
class HTMLBytes extends Uint8Array {
}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  }
});
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
async function* unescapeChunksAsync(iterable) {
  for await (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
  }
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = {"PUBLIC_SUPABASE_URL":"https://kiuugqblxerrsztkhslu.supabase.co","PUBLIC_SUPABASE_ANON_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdXVncWJseGVycnN6dGtoc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY5Mjc1ODcsImV4cCI6MTk3MjUwMzU4N30.U1n1YHNId1aApLCXtVVCQ_3ohNTnQ891UDmdTVeVShY","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true}) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue (jsx)"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component ?? Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } = await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2 ? slotInstructions2.map((instr) => stringifyChunk(result, instr)).join("") : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const SITE = {
	name: 'yuxxeun®',
	brand: 'v1.0.0.1',
	origin: 'https://yuxxeun.now.sh',
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

const $$Astro$C = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/@astrolib/seo/src/AstroSeo.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$AstroSeo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$C, $$props, $$slots);
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
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(buildTags({
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
  }))}` })}
`;
});

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

function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp"].includes(value);
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
    const { default: mod } = await import('./chunks/squoosh.a9e40279.mjs').catch(() => {
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
  const isDev = (_b = (Object.assign({"PUBLIC_SUPABASE_URL":"https://kiuugqblxerrsztkhslu.supabase.co","PUBLIC_SUPABASE_ANON_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdXVncWJseGVycnN6dGtoc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY5Mjc1ODcsImV4cCI6MTk3MjUwMzU4N30.U1n1YHNId1aApLCXtVVCQ_3ohNTnQ891UDmdTVeVShY","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{SSR:true,}))) == null ? void 0 : _b.DEV;
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
  const { src, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          format,
          width,
          fit,
          position,
          background,
          height: Math.round(width / aspectRatio)
        });
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const allFormats = await resolveFormats(params);
  const image = await getImage({
    src,
    width: Math.max(...widths),
    aspectRatio,
    fit,
    position,
    background,
    format: allFormats[allFormats.length - 1]
  });
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

var __freeze$7 = Object.freeze;
var __defProp$7 = Object.defineProperty;
var __template$7 = (cooked, raw) => __freeze$7(__defProp$7(cooked, "raw", { value: __freeze$7(raw || cooked.slice()) }));
var _a$7;
const $$Astro$B = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-analytics/src/Fathom.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Fathom = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$B, $$props, $$slots);
  Astro2.self = $$Fathom;
  const { site, src = "https://cdn.usefathom.com/script.js" } = Astro2.props;
  return renderTemplate(_a$7 || (_a$7 = __template$7(["<script", "", " defer><\/script>\n"])), addAttribute(src, "src"), addAttribute(site, "data-site"));
});

var __freeze$6 = Object.freeze;
var __defProp$6 = Object.defineProperty;
var __template$6 = (cooked, raw) => __freeze$6(__defProp$6(cooked, "raw", { value: __freeze$6(raw || cooked.slice()) }));
var _a$6;
const $$Astro$A = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-analytics/src/GoogleAnalytics.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$GoogleAnalytics = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$A, $$props, $$slots);
  Astro2.self = $$GoogleAnalytics;
  const { id } = Astro2.props;
  const gtagUrl = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  return renderTemplate(_a$6 || (_a$6 = __template$6(["<!-- Global site tag (gtag.js) - Google Analytics --><script async", "><\/script>\n<script>(function(){", "\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', id);\n})();<\/script>\n"])), addAttribute(gtagUrl, "src"), defineScriptVars({ id }));
});

var __freeze$5 = Object.freeze;
var __defProp$5 = Object.defineProperty;
var __template$5 = (cooked, raw) => __freeze$5(__defProp$5(cooked, "raw", { value: __freeze$5(raw || cooked.slice()) }));
var _a$5;
const $$Astro$z = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-analytics/src/Metrical.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Metrical = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$z, $$props, $$slots);
  Astro2.self = $$Metrical;
  const { app } = Astro2.props;
  return renderTemplate(_a$5 || (_a$5 = __template$5(['<script async src="https://cdn.metrical.xyz/script.js" type="text/javascript"><\/script>\n<script>(function(){', "\nwindow.metrical = {\n  app,\n};\n})();<\/script>\n"])), defineScriptVars({ app }));
});

var __freeze$4 = Object.freeze;
var __defProp$4 = Object.defineProperty;
var __template$4 = (cooked, raw) => __freeze$4(__defProp$4(cooked, "raw", { value: __freeze$4(raw || cooked.slice()) }));
var _a$4;
const $$Astro$y = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-analytics/src/Plausible.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Plausible = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$y, $$props, $$slots);
  Astro2.self = $$Plausible;
  const { domain, src = "https://plausible.io/js/script.js" } = Astro2.props;
  return renderTemplate(_a$4 || (_a$4 = __template$4(["<script", "", " defer><\/script>\n"])), addAttribute(src, "src"), addAttribute(domain, "data-domain"));
});

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(raw || cooked.slice()) }));
var _a$3;
const $$Astro$x = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-analytics/src/SimpleAnalytics.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$SimpleAnalytics = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$x, $$props, $$slots);
  Astro2.self = $$SimpleAnalytics;
  return renderTemplate(_a$3 || (_a$3 = __template$3(['<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"><\/script>\n', '<noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade"></noscript>\n'])), maybeRenderHead($$result));
});

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(raw || cooked.slice()) }));
var _a$2;
const $$Astro$w = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-analytics/src/Umami.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Umami = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$w, $$props, $$slots);
  Astro2.self = $$Umami;
  const { dataId, site, host = "/umami.js" } = Astro2.props;
  return renderTemplate(_a$2 || (_a$2 = __template$2(["<script defer", "", "", "><\/script>\n"])), addAttribute(site, "src"), addAttribute(host, "host"), addAttribute(dataId, "data-website-id"));
});

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$v = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-analytics/src/Amplitude.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Amplitude = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$v, $$props, $$slots);
  Astro2.self = $$Amplitude;
  Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="text/javascript">\n!function(){"use strict";!function(e,t){var r=e.amplitude||{_q:[],_iq:[]};if(r.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{r.invoked=!0;var n=t.createElement("script");n.type="text/javascript",n.integrity="sha384-KhsNZzlMl/yE+u/MowsLKm9jvghmBxiXW8aKvciqaaMaeHrm5uGeQluaVkpD9C7I",n.crossOrigin="anonymous",n.async=!0,n.src="https://cdn.amplitude.com/libs/analytics-browser-1.5.1-min.js.gz",n.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var s=t.getElementsByTagName("script")[0];function v(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}}s.parentNode.insertBefore(n,s);for(var o=function(){return this._q=[],this},i=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],a=0;a<i.length;a++)v(o,i[a]);r.Identify=o;for(var u=function(){return this._q=[],this},c=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],l=0;l<c.length;l++)v(u,c[l]);r.Revenue=u;var p=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset"],d=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"];function f(e){function t(t,r){e[t]=function(){var n={promise:new Promise((r=>{e._q.push({name:t,args:Array.prototype.slice.call(arguments,0),resolve:r})}))};if(r)return n}}for(var r=0;r<p.length;r++)t(p[r],!1);for(var n=0;n<d.length;n++)t(d[n],!0)}f(r),r.createInstance=function(){var e=r._iq.push({_q:[]})-1;return f(r._iq[e]),r._iq[e]},e.amplitude=r}}(window,document)}();\n\namplitude.init(apiKey);\n<\/script>\n'])));
});

const defaultImageSrc = {"src":"/assets/gradient.f8344fdd.jpg","width":7183,"height":2885,"format":"jpg","orientation":1};

const gradient = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: defaultImageSrc
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$u = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/atoms/Fonts.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Fonts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$u, $$props, $$slots);
  Astro2.self = $$Fonts;
  return renderTemplate`<!-- Or Google Fonts -->`;
});

const $$Astro$t = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/atoms/ExtraMetaTags.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$ExtraMetaTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$t, $$props, $$slots);
  Astro2.self = $$ExtraMetaTags;
  return renderTemplate`<link rel="shortcut icon"${addAttribute(`${SITE.basePathname}favicon.ico`, "href")}>
<link rel="icon" type="image/svg+xml"${addAttribute(`${SITE.basePathname}favicon.ico`, "href")}>
<link rel="mask-icon"${addAttribute(`${SITE.basePathname}favicon.ico`, "href")} color="#8D46E7">
`;
});

const $$Astro$s = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/core/MetaTags.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$MetaTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
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

${renderComponent($$result, "Umami", $$Umami, { "async": true, "defer": true, "data-website-id": "63e0d48a-f0b4-44c6-80d5-5f79df38654d", "src": "https://v-umami.netlify.app/umami.js", "partytown": true })}

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
${renderComponent($$result, "ExtraMetaTags", $$ExtraMetaTags, {})}
`;
});

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$r = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/core/BasicScripts.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$BasicScripts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
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
<\/script>
`])));
});

const $$Astro$q = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/layouts/BaseLayout.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { meta = {} } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html lang="en" class="motion-safe:scroll-smooth 2xl:text-[20px]">
	<head>
		${renderComponent($$result, "MetaTags", $$MetaTags, { ...meta })}
	${renderHead($$result)}</head>

	<body class="antialiased text-gray-900 dark:text-slate-300 tracking-tight bg-white dark:bg-black">
		${renderSlot($$result, $$slots["default"])}
		${renderComponent($$result, "BasicScripts", $$BasicScripts, {})}
		
	</body>
</html>`;
});

const $$Astro$p = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/atoms/Logo.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Logo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$Logo;
  Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<span class="self-center ml-2 text-2xl text-gray-900 hover:text-oranged dark:hover:text-oranged whitespace-nowrap font-delight hover:ease-in-out hover:duration-150 transition duration-150 ease-in-linear tracking-tighter uppercase dark:text-white">${`${SITE.brand}`}
</span>`;
});

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
      const files = /* #__PURE__ */ Object.assign({});
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

const $$Astro$o = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-icon/lib/Icon.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
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
});

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

const $$Astro$n = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-icon/lib/Spritesheet.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
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
});

const $$Astro$m = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-icon/lib/SpriteProvider.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}
`;
});

const $$Astro$l = createAstro("E:/yuxxeun/yuxxeun/honeypod/node_modules/astro-icon/lib/Sprite.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
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
});

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$k = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/core/ToggleTheme.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$ToggleTheme = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
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
});

const $$Astro$j = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/core/ToggleMenu.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$ToggleMenu = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
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
});

const $$Astro$i = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/widgets/Header.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead($$result)}<header class="sticky sm:sticky top-0 z-40 flex-none mx-auto w-full bg-white/30 backdrop-blur-lg md:bg-white/30 dark:bg-black/30 dark:md:bg-black/30 md:backdrop-blur-md border-b-0 dark:border-b-0" id="header">
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
					<!-- <a
						class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center"
						aria-label="RSS Feed"
						href="/rss.xml"
					>
						<Icon name="tabler:rss" class="w-5 h-5" />
					</a>
					<a
						href="https://github.com/yuxxeun"
						class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
						aria-label="yuxxeun Github"
					>
						<Icon name="tabler:brand-github" class="w-5 h-5" />
					</a> -->
				</div>
			</div>
		</nav>
	</div>
</header>`;
});

const $$Astro$h = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/widgets/Footer.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
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
					<a class="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Area 13" href="https://github.com/valinatic">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:cpu", "title": "init(8)", "class": "w-6 h-6 text-oranged" })}
					</a>
				</li>
				<li>
					<a class="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Bookmarks" href="/bookmark">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:book", "disable": true, "title": "bookmarks", "class": "w-6 h-6 text-oranged" })}
					</a>
				</li>
				<li>
					<a class="hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="RSS" href="/rss.xml">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:rss", "title": "RSS", "class": "w-6 h-6 text-oranged" })}
					</a>
				</li>
			</ul>
			<div class="text-md uppercase tracking-wide text-black mr-4 dark:text-white">
				the light that comes from downstairs
			</div>
		</div>
	</div>
</footer>`;
});

const $$Astro$g = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/layouts/PageLayout.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$PageLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$PageLayout;
  const { meta } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main>
		${renderSlot($$result, $$slots["default"])}
	</main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
});

const $$Astro$f = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/core/Picture.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
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
});

const $$Astro$e = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/widgets/Hero.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead($$result)}<section>
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<div class="py-12 md:py-20">
			<div>
				<div class="relative mb-5 m-auto max-w-xs p-3">
					${renderComponent($$result, "Picture", $$Picture, { "onclick": "{alert('not currently implemented but seems promising, right?')}", "src": import('./chunks/krido.34309068.mjs'), "class": "mx-auto grayscale cursor-pointer p-1 rounded-full shadow-lg bg-white dark:bg-black w-full", "widths": [400, 768], "sizes": " (max-width: 767px) 400px, 768px", "alt": "yuxxeun cute avatar", "loading": "lazy", "aspectRatio": "1:1" })}
				</div>
			</div>
			<div class="text-center pb-10 md:pb-16">
				<h1 class="text-4xl uppercase font-display text-oranged md:text-[3.50rem] leading-tighter tracking-tighter mb-3 font-heading">
					yuxxeun
				</h1>
				<div class="max-w-3xl mx-auto">
					<p class="lg:text-xl text-md uppercase tracking-tight text-black font-delight mb-8 dark:text-white">
						making cool shit that performs
					</p>
				</div>
			</div>
		</div>
	</div>
</section>`;
});

const $$Astro$d = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/pages/index.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Index;
  const meta = {
    title: SITE.title,
    description: SITE.description,
    canonical: getCanonical(getHomePermalink()),
    image: SITE.image
  };
  inject();
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}` })}`;
});

const $$file$6 = "E:/yuxxeun/yuxxeun/honeypod/src/pages/index.astro";
const $$url$6 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file$6,
	url: $$url$6
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

const supabase = createClient((Object.assign({"PUBLIC_SUPABASE_URL":"https://kiuugqblxerrsztkhslu.supabase.co","PUBLIC_SUPABASE_ANON_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdXVncWJseGVycnN6dGtoc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY5Mjc1ODcsImV4cCI6MTk3MjUwMzU4N30.U1n1YHNId1aApLCXtVVCQ_3ohNTnQ891UDmdTVeVShY","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{PUBLIC:process.env.PUBLIC,BASE_URL:'/',})).PUBLIC_SUPABASE_URL, (Object.assign({"PUBLIC_SUPABASE_URL":"https://kiuugqblxerrsztkhslu.supabase.co","PUBLIC_SUPABASE_ANON_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdXVncWJseGVycnN6dGtoc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY5Mjc1ODcsImV4cCI6MTk3MjUwMzU4N30.U1n1YHNId1aApLCXtVVCQ_3ohNTnQ891UDmdTVeVShY","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{PUBLIC:process.env.PUBLIC,BASE_URL:'/',})).PUBLIC_SUPABASE_ANON_KEY);

/* E:/yuxxeun/yuxxeun/honeypod/src/components/widgets/Bookmark.svelte generated by Svelte v3.52.0 */

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
				return `<ul class="${"my-5 py-5"}"><li class="${"__inter"}"><div class="${"px-4 sm:px-6"}"><h3 class="${"text-lg font-display leading-6 text-black dark:text-white"}"><a${add_attribute("href", book.link, 0)} target="${"blank"}" class="${"hover:text-gray-500"}">${escape(book.title)} by ${escape(book.author)}
								</a></h3>
							<p class="${"mt-1 max-w-2xl font-delight truncate text-oranged hover:text-gray-500 text-sm"}"><a${add_attribute("href", book.link, 0)} target="${"blank"}">${escape(book.link)}
								</a></p>
							<p class="${"mt-3 max-w-2xl font-space text-sm text-gray-500"}">${escape(book.time)}</p>
						</div></li>
				</ul>`;
			})}
		`;
		})(__value);
	})(promise)}</div></section>`;
});

const $$Astro$c = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/pages/bookmark.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Bookmark = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Bookmark;
  const meta = {
    title: `Bookmark \u2014 ${SITE.name}`,
    description: SITE.description,
    ogType: "Bookmark"
  };
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "meta": meta }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="max-w-6xl mx-auto px-4 sm:px-6">
		${renderComponent($$result, "Bookmark", Bookmark, { "client:load": true, "client:component-hydration": "load", "client:component-path": "~/components/widgets/Bookmark.svelte", "client:component-export": "default" })}
	</div>` })}`;
});

const $$file$5 = "E:/yuxxeun/yuxxeun/honeypod/src/pages/bookmark.astro";
const $$url$5 = "/bookmark";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Bookmark,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const html$8 = "<p>Arabella’s got some interstellar-gator skin boots</p>\n<p>And a Helter Skelter ‘round her little finger and I ride it endlessly</p>\n<p>She’s got a Barbarella silver swimsuit</p>\n<p>And when she needs to shelter from reality</p>\n<p>She takes a dip in my daydreams</p>\n<p>My days end best when this sunset gets itself</p>\n<p>Behind that little lady sitting on the passenger side</p>\n<p>It’s much less picturesque without her catching the light</p>\n<p>The horizon tries but it’s just not as kind on the eyes</p>\n<p>As Arabella</p>\n<p>Arabella</p>\n<p>Just might have tapped into your mind and soul</p>\n<p>You can’t be sure</p>\n<p>Arabella’s got a seventies head</p>\n<p>But she’s a modern lover</p>\n<p>It’s an exploration, she’s made of outer space</p>\n<p>And her lips are like the galaxy’s edge</p>\n<p>And her kiss the color of a constellation falling into place</p>\n<p>My days end best when this sunset gets itself</p>\n<p>Behind that little lady sitting on the passenger side</p>\n<p>It’s much less picturesque without her catching the light</p>\n<p>The horizon tries but it’s just not as kind on the eyes</p>\n<p>As Arabella</p>\n<p>As Arabella</p>\n<p>Just might have tapped into your mind and soul</p>\n<p>You can’t be sure</p>\n<p>That’s magic in a cheetah print coat</p>\n<p>Just a slip underneath it I hope</p>\n<p>Asking if I can have one of those</p>\n<p>Organic cigarettes that she smokes</p>\n<p>Wraps her lips round the Mexican coke</p>\n<p>Makes you wish that you were the bottle</p>\n<p>Takes a sip of your soul and it sounds like</p>\n<p>I just might have tapped into your mind and soul</p>\n<p>You can’t be sure</p>";

				const frontmatter$8 = {"pubDate":"Oct 6 2022","title":"Arabella","description":"Arabella's got some interstellar-gator skin","excerpt":"Arabella's got some interstellar-gator skin","image":"~/assets/images/arabella.jpg","tags":["music"]};
				const file$8 = "E:/yuxxeun/yuxxeun/honeypod/data/blog/arabella.md";
				const url$8 = undefined;
				function rawContent$8() {
					return "\r\nArabella's got some interstellar-gator skin boots\r\n\r\nAnd a Helter Skelter 'round her little finger and I ride it endlessly\r\n\r\nShe's got a Barbarella silver swimsuit\r\n\r\nAnd when she needs to shelter from reality\r\n\r\nShe takes a dip in my daydreams\r\n\r\nMy days end best when this sunset gets itself\r\n\r\nBehind that little lady sitting on the passenger side\r\n\r\nIt's much less picturesque without her catching the light\r\n\r\nThe horizon tries but it's just not as kind on the eyes\r\n\r\nAs Arabella\r\n\r\nArabella\r\n\r\nJust might have tapped into your mind and soul\r\n\r\nYou can't be sure\r\n\r\nArabella's got a seventies head\r\n\r\nBut she's a modern lover\r\n\r\nIt's an exploration, she's made of outer space\r\n\r\nAnd her lips are like the galaxy's edge\r\n\r\nAnd her kiss the color of a constellation falling into place\r\n\r\nMy days end best when this sunset gets itself\r\n\r\nBehind that little lady sitting on the passenger side\r\n\r\nIt's much less picturesque without her catching the light\r\n\r\nThe horizon tries but it's just not as kind on the eyes\r\n\r\nAs Arabella\r\n\r\nAs Arabella\r\n\r\nJust might have tapped into your mind and soul\r\n\r\nYou can't be sure\r\n\r\nThat's magic in a cheetah print coat\r\n\r\nJust a slip underneath it I hope\r\n\r\nAsking if I can have one of those\r\n\r\nOrganic cigarettes that she smokes\r\n\r\nWraps her lips round the Mexican coke\r\n\r\nMakes you wish that you were the bottle\r\n\r\nTakes a sip of your soul and it sounds like\r\n\r\nI just might have tapped into your mind and soul\r\n\r\nYou can't be sure";
				}
				function compiledContent$8() {
					return html$8;
				}
				function getHeadings$8() {
					return [];
				}
				function getHeaders$8() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$8();
				}				async function Content$8() {
					const { layout, ...content } = frontmatter$8;
					content.file = file$8;
					content.url = url$8;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$8 });
					return contentFragment;
				}
				Content$8[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$8,
	file: file$8,
	url: url$8,
	rawContent: rawContent$8,
	compiledContent: compiledContent$8,
	getHeadings: getHeadings$8,
	getHeaders: getHeaders$8,
	Content: Content$8,
	default: Content$8
}, Symbol.toStringTag, { value: 'Module' }));

const html$7 = "<p>Dalam mempelajari sesuatu, tidak jarang kita mempertanyakan apa yang ingin dicapai setelah mempelajari sesuatu tersebut. Entah sekadar untuk kepentingan ujian, kepentingan pribadi, ataupun bekal untuk praktik.</p>\n<p>Pengetahuan menurut definisi dari Wikipedia adalah informasi atau maklumat yang diketahui atau disadari oleh seseorang. Singkatnya, jika kamu memiliki pengetahuan tentang cara menggunakan komputer, berarti kamu memiliki informasi tentang cara menggunakan komputer tersebut.</p>\n<p>Pengetahuan pada dasarnya bersifat netral. Di sebagian kasus, justru tidak ada baik/buruk ataupun benar/salah terhadap pengetahuan itu sendiri. Seperti, apakah baik atau buruk bila mengetahui cara mencuri?</p>\n<p>Jawabannya selalu tergantung.</p>\n<h2 id=\"to-or-not-to\">To or not to</h2>\n<p>Anggap kamu memiliki pengetahuan terkait keamanan pada sebuah aplikasi. Kamu tau informasi terkait celah-celah keamanan yang terdapat pada suatu aplikasi, kamu tau aksi apa saja yang bisa dilakukan, kamu tau cara mencari pola nya, dsb.</p>\n<p>Berdasarkan informasi tersebut, setidaknya ada 2 aksi yang bisa kamu pilih: menutup celahnya atau meng-eksploitasinya.</p>\n<p>Dan pilihannya selalu tergantung.</p>\n<p>Khususnya tergantung apa yang ingin dicapai dari aksi tersebut.</p>\n<p>Berdasarkan pertimbangan tersebut, bisa dikatakan pengetahuan seperti pisau bermata dua.</p>\n<p>Seseorang yang mengetahui cara membobol suatu sistem bisa digunakan pengetahuannya untuk meng-eksploitasi ataupun untuk menutup bagian sistem yang rentan tersebut.</p>\n<p>Seseorang yang mengetahui cara melakukan korupsi bisa digunakan pengetahuannya untuk memberantas dan atau mencegah ataupun untuk melakukan korupsi.</p>\n<p>Seseorang yang mengetahui tentang riba, bisa digunakan pengetahuannya untuk menghindari riba ataupun untuk mendapatkan keuntungan dari praktik riba tersebut.</p>\n<p>Kamu tidak akan mengkhawatirkan dampak dari riba ketika kamu tidak mengetahuinya.</p>\n<p>Kamu tidak akan meninggalkan ibadah ketika kamu mengetahui apa yang terjadi bila melakukannya.</p>\n<p>Karena sekali lagi, pengetahuan seperti pisau bermata dua.</p>\n<p>Dan apa yang ingin dituju berdasarkan pengetahuan tersebut jawabannya adalah selalu tergantung.</p>\n<h2 id=\"sometimes-silence-is-gold\">Sometimes silence is gold</h2>\n<p>Selain baik/buruk dan benar/salah, salah satu sifat dari sebuah pengetahuan adalah confidentiality. Ada pengetahuan yang bersifat terbuka untuk umum dan ada yang bersifat rahasia. Dan sekali lagi, alasannya adalah selalu tergantung.</p>\n<p>Pengetahuan yang bersifat terbuka bisa didapat dari mana saja, buku pelajaran; artikel di internet, apapun.</p>\n<p>Untuk pengetahuan yang bersifat rahasia, selain sumbernya sangat terbatas juga distribusinya. Tidak sembarang orang yang boleh mengetahui dan memberitahu terkait informasi tersebut.</p>\n<p>Contoh pengetahuan yang bersifat rahasia sangat beragam. Dari “rahasia negara” sampai strategi bisnis dari sebuah perusahaan. Jika informasi tersebut sangat terbatas dalam siapa yang boleh mengetahui dan memberitahukan, besar kemungkinan informasi tersebut bersifat rahasia.</p>\n<p>Mengapa informasi tersebut ada yang bersifat terbuka/umum dan rahasia? Sekali lagi, jawabannya selalu tergantung.</p>\n<p>Namun di kebanyakan kasus, tujuannya adalah untuk menghindari penyalahgunaan dari informasi tersebut. Untuk menghindari penggunaan informasi yang bukan untuk semestinya.</p>\n<p>Berdasarkan pertimbangan tersebut, terkadang diam itu baik.</p>\n<p>Atau lebih spesifiknya, diam untuk menandakan bahwa kita seperti tidak tahu padahal tahu.</p>\n<h2 id=\"facts-in-everyday-things\">Facts in everyday things</h2>\n<p>Sampai hari ini gue pribadi tidak tahu tentang dampak dari praktik riba. Of course gue bisa mengetahuinya, apalagi di era teknologi informasi seperti sekarang. Namun gue tau sedikit tentang bahaya dari riba, dan setelah mengetahuinya, gue belum ingin menggali lebih dalam terkait informasi seputar riba tersebut.</p>\n<p>Di kasus lain yang sedang dialami oleh teman gue adalah mencari kabar tentang mantannya. Teman gue ingin mengetahui kabar tentang mantannya tersebut karena… dia ingin tahu informasi terbarunya terkait mantannya tersebut. Of course.</p>\n<p>Gue mengambil contoh menggunakan 2 kasus diatas karena 2 hal tersebut dampaknya seringkali mengarah ke hal yang kurang mengenakkan ketika sudah mengetahui informasinya.</p>\n<p>Ketika sudah mengetahui dampak dari praktik riba, besar kemungkinan kita seharusnya akan menghindari praktik riba tersebut.</p>\n<p>Ketika sudah mengetahui dampak dari stalking mantan tersebut, besar kemungkinan kita seharusnya tidak ingin melakukannya lagi.</p>\n<p>Dan penyesalan selalu di akhir.</p>\n<p>Seharusnya tidak perlu terkejut ketika sudah mengetahuinya karena yang pertama itu adalah faktanya dan kedua karena kamu sudah memilih untuk melakukannya.</p>\n<p>Jika kita mengetahui informasi kapan kita akan mati, besar kemungkinan kita akan terus melakukan kebaikan hanya karena sebentar lagi akan mati, bukan karena melakukan kebaikan adalah sebuah kewajiban.</p>\n<h2 id=\"if-you-know-you-know\">If you know, you know</h2>\n<p>Gue tidak terlalu pandai dalam menyimpan rahasia, tapi setidaknya gue sedikit tahu kapan harus berbicara atau diam. Bagaimana cara gue mengetahuinya? Di banyak kasus, berdasarkan pengalaman, baik dari diri sendiri ataupun orang lain.</p>\n<p>Menyimpan informasi untuk tetap rahasia dan mengetahui kapan dan kepada siapa harus memberitahukannya gue rasa adalah sebuah keterampilan yang harus terus diasah. Selain karena alasan untuk menjaga kepercayaan, juga untuk menyadari bahwa segala sesuatu itu ada waktunya.</p>\n<p>Ada momennya kapan kamu harus membagikan slip gajimu dan kepada siapa.</p>\n<p>Ada momennya kapan kamu harus berbicara dan kepada siapa.</p>\n<p>Dan sebagainya.</p>\n<p>Bagian menarik dari menentukan momen ini adalah dalam pemilihan waktu. Apakah harus menunggu sampai waktu yang pas? Apakah harus menunggu hal lain terlebih dahulu? Bahkan sampai Apakah memang harus diberitahukan?</p>\n<p>Gue teringat cerita SMP dulu ketika salah satu teman dekat gue diberi kabar. Awalnya teman gue disuruh untuk pulang karena suatu alasan, lalu ketika sudah sampai di rumah, barulah dia diberitahukan kabar sebenarnya bahwa  ada berita sedih di keluarganya. Alasan tidak langsung diberitahukannya menurut penjaga asrama tersebut adalah untuk tidak membuat teman gue gelisah. Dan gue rasa, kalau dipikir-pikir memang momen yang tepat untuk memberitahukannya adalah ketika sudah di rumahnya.</p>\n<p>Entah untuk menghindari kejadian yang tak terduga, ataupun untuk, membuatnya dirinya tidak gelisah.</p>\n<p>Pada suatu hari gue pernah memilih untuk diam untuk sesuatu yang sudah gue ketahui. Alasannya sederhana, gue ingin tahu sampai sejauh mana dia terus menutupi kebenaran. Dan setelah momennya tiba, baru gue mulai berbicara.</p>\n<p>Dan momen tersebut adalah ketika gue sudah siap untuk menjalani apa yang akan terjadi setelah gue berbicara tersebut.</p>\n<p>Tanpa perlu penjelasan lebih lanjut.</p>\n<h2 id=\"to-not-giving-a-fuck\">To not giving a fuck</h2>\n<p>Tidak semua yang kita ketahui harus kita terlalu perdulikan.</p>\n<p>Dalam kasus ini biasanya ketika gue berurusan dengan sesuatu yang sepertinya tidak perlu gue ketahui. Yang sering terjadi adalah ketika mempelajari hal baru, misal Kubernetes. Gue tahu sepertinya gue tidak butuh mempelajari Kubernetes, namun gue merasa sepertinya hanya mempelajarinya saja terasa sangat menarik.</p>\n<p>PR ketika akan mendapatkan informasi baru menurut gue ada 2: proses “unlearn” dan perencanaan ulang dalam mengatur prioritas.</p>\n<p>Proses unlearn ini sederhananya adalah sebuah proses dimana kita “melupakan” sebuah pengetahuan entah karena kurang tepat atau karena sudah tidak relevan lagi.</p>\n<p>Ketika 2020, gue selalu memilih Nginx dalam menentukan Reverse Proxy karena selain high performance juga gue cukup hafal dengan sintaksnya. Lalu gue mempelajari hal baru, ada reverse proxy lain seperti Caddy dan Traefik khususnya di era container seperti sekarang. Proses penerimaan teknologi baru tersebut relatif sulit bagi gue. Misal, di fitur provision TLS certs. Gue exactly bisa melakukan apa yang bisa dilakukan di Caddy namun bedanya bila gue biasanya melakukannya secara manual (via certbot) kalau pakai Nginx, di Caddy, itu dilakukan secara otomatis. Dan gue tidak keberatan dengan hal itu.</p>\n<p>Namun seiring dengan berjalannya waktu, gue tahu bahwa Caddy lebih relevan daripada Nginx (ataupun Traefik) jika melihat kebutuhan gue. Perlahan gue melupakan beberapa hal. Pertama, gue melupakan kalau provision TLS certs itu harus manual. Kedua, gue melupakan kalau membuat konfigurasi itu tidak harus sekompleks Nginx. Ketiga, gue melupakan kalau beberapa hal itu tidak harus dilakukan secara manual (seperti provide x-forwarded-host dan host explicitly).</p>\n<p>Dan PR yang lumayan berat dalam kasus gue diatas adalah menghiraukan Traefik. Sebelumnya gue selalu membandingkan perbedaan Caddy dan Traefik, Pro Cons nya, dsb. Gue selalu merasa yakin kalau yang gue butuhkan adalah Traefik bukan Caddy.</p>\n<p>Setelah banyak pertimbangan, gue stick di Caddy.</p>\n<p>Gue lebih memilih menjawab “Gak tau kalau Traefik” daripada harus menjelaskan perbedaan antara Caddy dan Traefik. Banyak tahu itu membahayakan, salah satunya adalah karena kamu akan berurusan dengan sesuatu yang seharusnya bukan urusanmu.</p>\n<h2 id=\"penutup\">Penutup</h2>\n<p>Gue kepikiran menulis ini setelah membahas tentang riba sama teman gue. Membahas tentang mengapa orang-orang korupsi. Membahas tentang kenapa kita berurusan dengan sesuatu yang seharusnya bukan urusan kita. Membahas tentang mengapa lebih menguntungkan jual data yang bocor daripada menyelanggarakan bug bounty.</p>\n<p>Mungkin gue naif karena tidak ingin menerima fakta.</p>\n<p>Tapi di beberapa hal gue lebih memilih untuk diam ataupun tidak mencari tahu daripada seperti menjadi bumerang untuk gue yang mungkin merugikan gue.</p>\n<p>Pengetahuan tidak pernah salah.</p>\n<p>Yang salah selalu subjeknya yang menyalahgunakan pengetahuan tersebut.</p>\n<p>Terkadang memilih untuk diam adalah yang terbaik.</p>\n<p>Entah agar tidak harus berurusan dengan sesuatu yang harusnya bukan urusan kita, ataupun untuk menghindari sesuatu yang menjadi bumerang untuk kita.</p>\n<p>Yang pasti, fakta adalah fakta.</p>\n<p>Dan semuanya membutuhkan momentum.</p>";

				const frontmatter$7 = {"pubDate":"Sep 25 2022","title":"Banyak tahu itu berbahaya","description":"Sometimes silence is gold, indeed.","excerpt":"Sometimes silence is gold, indeed","image":"~/assets/images/banyak-tahu.jpg","tags":["thoughts"]};
				const file$7 = "E:/yuxxeun/yuxxeun/honeypod/data/blog/banyak-tahu.md";
				const url$7 = undefined;
				function rawContent$7() {
					return "\r\nDalam mempelajari sesuatu, tidak jarang kita mempertanyakan apa yang ingin dicapai setelah mempelajari sesuatu tersebut. Entah sekadar untuk kepentingan ujian, kepentingan pribadi, ataupun bekal untuk praktik.\r\n\r\nPengetahuan menurut definisi dari Wikipedia adalah informasi atau maklumat yang diketahui atau disadari oleh seseorang. Singkatnya, jika kamu memiliki pengetahuan tentang cara menggunakan komputer, berarti kamu memiliki informasi tentang cara menggunakan komputer tersebut.\r\n\r\nPengetahuan pada dasarnya bersifat netral. Di sebagian kasus, justru tidak ada baik/buruk ataupun benar/salah terhadap pengetahuan itu sendiri. Seperti, apakah baik atau buruk bila mengetahui cara mencuri?\r\n\r\nJawabannya selalu tergantung.\r\n\r\n## To or not to\r\nAnggap kamu memiliki pengetahuan terkait keamanan pada sebuah aplikasi. Kamu tau informasi terkait celah-celah keamanan yang terdapat pada suatu aplikasi, kamu tau aksi apa saja yang bisa dilakukan, kamu tau cara mencari pola nya, dsb.\r\n\r\nBerdasarkan informasi tersebut, setidaknya ada 2 aksi yang bisa kamu pilih: menutup celahnya atau meng-eksploitasinya.\r\n\r\nDan pilihannya selalu tergantung.\r\n\r\nKhususnya tergantung apa yang ingin dicapai dari aksi tersebut.\r\n\r\nBerdasarkan pertimbangan tersebut, bisa dikatakan pengetahuan seperti pisau bermata dua.\r\n\r\nSeseorang yang mengetahui cara membobol suatu sistem bisa digunakan pengetahuannya untuk meng-eksploitasi ataupun untuk menutup bagian sistem yang rentan tersebut.\r\n\r\nSeseorang yang mengetahui cara melakukan korupsi bisa digunakan pengetahuannya untuk memberantas dan atau mencegah ataupun untuk melakukan korupsi.\r\n\r\nSeseorang yang mengetahui tentang riba, bisa digunakan pengetahuannya untuk menghindari riba ataupun untuk mendapatkan keuntungan dari praktik riba tersebut.\r\n\r\nKamu tidak akan mengkhawatirkan dampak dari riba ketika kamu tidak mengetahuinya.\r\n\r\nKamu tidak akan meninggalkan ibadah ketika kamu mengetahui apa yang terjadi bila melakukannya.\r\n\r\nKarena sekali lagi, pengetahuan seperti pisau bermata dua.\r\n\r\nDan apa yang ingin dituju berdasarkan pengetahuan tersebut jawabannya adalah selalu tergantung.\r\n\r\n## Sometimes silence is gold\r\nSelain baik/buruk dan benar/salah, salah satu sifat dari sebuah pengetahuan adalah confidentiality. Ada pengetahuan yang bersifat terbuka untuk umum dan ada yang bersifat rahasia. Dan sekali lagi, alasannya adalah selalu tergantung.\r\n\r\nPengetahuan yang bersifat terbuka bisa didapat dari mana saja, buku pelajaran; artikel di internet, apapun.\r\n\r\nUntuk pengetahuan yang bersifat rahasia, selain sumbernya sangat terbatas juga distribusinya. Tidak sembarang orang yang boleh mengetahui dan memberitahu terkait informasi tersebut.\r\n\r\nContoh pengetahuan yang bersifat rahasia sangat beragam. Dari \"rahasia negara\" sampai strategi bisnis dari sebuah perusahaan. Jika informasi tersebut sangat terbatas dalam siapa yang boleh mengetahui dan memberitahukan, besar kemungkinan informasi tersebut bersifat rahasia.\r\n\r\nMengapa informasi tersebut ada yang bersifat terbuka/umum dan rahasia? Sekali lagi, jawabannya selalu tergantung.\r\n\r\nNamun di kebanyakan kasus, tujuannya adalah untuk menghindari penyalahgunaan dari informasi tersebut. Untuk menghindari penggunaan informasi yang bukan untuk semestinya.\r\n\r\nBerdasarkan pertimbangan tersebut, terkadang diam itu baik.\r\n\r\nAtau lebih spesifiknya, diam untuk menandakan bahwa kita seperti tidak tahu padahal tahu.\r\n\r\n## Facts in everyday things\r\nSampai hari ini gue pribadi tidak tahu tentang dampak dari praktik riba. Of course gue bisa mengetahuinya, apalagi di era teknologi informasi seperti sekarang. Namun gue tau sedikit tentang bahaya dari riba, dan setelah mengetahuinya, gue belum ingin menggali lebih dalam terkait informasi seputar riba tersebut.\r\n\r\nDi kasus lain yang sedang dialami oleh teman gue adalah mencari kabar tentang mantannya. Teman gue ingin mengetahui kabar tentang mantannya tersebut karena... dia ingin tahu informasi terbarunya terkait mantannya tersebut. Of course.\r\n\r\nGue mengambil contoh menggunakan 2 kasus diatas karena 2 hal tersebut dampaknya seringkali mengarah ke hal yang kurang mengenakkan ketika sudah mengetahui informasinya.\r\n\r\nKetika sudah mengetahui dampak dari praktik riba, besar kemungkinan kita seharusnya akan menghindari praktik riba tersebut.\r\n\r\nKetika sudah mengetahui dampak dari stalking mantan tersebut, besar kemungkinan kita seharusnya tidak ingin melakukannya lagi.\r\n\r\nDan penyesalan selalu di akhir.\r\n\r\nSeharusnya tidak perlu terkejut ketika sudah mengetahuinya karena yang pertama itu adalah faktanya dan kedua karena kamu sudah memilih untuk melakukannya.\r\n\r\nJika kita mengetahui informasi kapan kita akan mati, besar kemungkinan kita akan terus melakukan kebaikan hanya karena sebentar lagi akan mati, bukan karena melakukan kebaikan adalah sebuah kewajiban.\r\n\r\n## If you know, you know\r\nGue tidak terlalu pandai dalam menyimpan rahasia, tapi setidaknya gue sedikit tahu kapan harus berbicara atau diam. Bagaimana cara gue mengetahuinya? Di banyak kasus, berdasarkan pengalaman, baik dari diri sendiri ataupun orang lain.\r\n\r\nMenyimpan informasi untuk tetap rahasia dan mengetahui kapan dan kepada siapa harus memberitahukannya gue rasa adalah sebuah keterampilan yang harus terus diasah. Selain karena alasan untuk menjaga kepercayaan, juga untuk menyadari bahwa segala sesuatu itu ada waktunya.\r\n\r\nAda momennya kapan kamu harus membagikan slip gajimu dan kepada siapa.\r\n\r\nAda momennya kapan kamu harus berbicara dan kepada siapa.\r\n\r\nDan sebagainya.\r\n\r\nBagian menarik dari menentukan momen ini adalah dalam pemilihan waktu. Apakah harus menunggu sampai waktu yang pas? Apakah harus menunggu hal lain terlebih dahulu? Bahkan sampai Apakah memang harus diberitahukan?\r\n\r\nGue teringat cerita SMP dulu ketika salah satu teman dekat gue diberi kabar. Awalnya teman gue disuruh untuk pulang karena suatu alasan, lalu ketika sudah sampai di rumah, barulah dia diberitahukan kabar sebenarnya bahwa  ada berita sedih di keluarganya. Alasan tidak langsung diberitahukannya menurut penjaga asrama tersebut adalah untuk tidak membuat teman gue gelisah. Dan gue rasa, kalau dipikir-pikir memang momen yang tepat untuk memberitahukannya adalah ketika sudah di rumahnya.\r\n\r\nEntah untuk menghindari kejadian yang tak terduga, ataupun untuk, membuatnya dirinya tidak gelisah.\r\n\r\nPada suatu hari gue pernah memilih untuk diam untuk sesuatu yang sudah gue ketahui. Alasannya sederhana, gue ingin tahu sampai sejauh mana dia terus menutupi kebenaran. Dan setelah momennya tiba, baru gue mulai berbicara.\r\n\r\nDan momen tersebut adalah ketika gue sudah siap untuk menjalani apa yang akan terjadi setelah gue berbicara tersebut.\r\n\r\nTanpa perlu penjelasan lebih lanjut.\r\n\r\n## To not giving a fuck\r\nTidak semua yang kita ketahui harus kita terlalu perdulikan.\r\n\r\nDalam kasus ini biasanya ketika gue berurusan dengan sesuatu yang sepertinya tidak perlu gue ketahui. Yang sering terjadi adalah ketika mempelajari hal baru, misal Kubernetes. Gue tahu sepertinya gue tidak butuh mempelajari Kubernetes, namun gue merasa sepertinya hanya mempelajarinya saja terasa sangat menarik.\r\n\r\nPR ketika akan mendapatkan informasi baru menurut gue ada 2: proses \"unlearn\" dan perencanaan ulang dalam mengatur prioritas.\r\n\r\nProses unlearn ini sederhananya adalah sebuah proses dimana kita \"melupakan\" sebuah pengetahuan entah karena kurang tepat atau karena sudah tidak relevan lagi.\r\n\r\nKetika 2020, gue selalu memilih Nginx dalam menentukan Reverse Proxy karena selain high performance juga gue cukup hafal dengan sintaksnya. Lalu gue mempelajari hal baru, ada reverse proxy lain seperti Caddy dan Traefik khususnya di era container seperti sekarang. Proses penerimaan teknologi baru tersebut relatif sulit bagi gue. Misal, di fitur provision TLS certs. Gue exactly bisa melakukan apa yang bisa dilakukan di Caddy namun bedanya bila gue biasanya melakukannya secara manual (via certbot) kalau pakai Nginx, di Caddy, itu dilakukan secara otomatis. Dan gue tidak keberatan dengan hal itu.\r\n\r\nNamun seiring dengan berjalannya waktu, gue tahu bahwa Caddy lebih relevan daripada Nginx (ataupun Traefik) jika melihat kebutuhan gue. Perlahan gue melupakan beberapa hal. Pertama, gue melupakan kalau provision TLS certs itu harus manual. Kedua, gue melupakan kalau membuat konfigurasi itu tidak harus sekompleks Nginx. Ketiga, gue melupakan kalau beberapa hal itu tidak harus dilakukan secara manual (seperti provide x-forwarded-host dan host explicitly).\r\n\r\nDan PR yang lumayan berat dalam kasus gue diatas adalah menghiraukan Traefik. Sebelumnya gue selalu membandingkan perbedaan Caddy dan Traefik, Pro Cons nya, dsb. Gue selalu merasa yakin kalau yang gue butuhkan adalah Traefik bukan Caddy.\r\n\r\nSetelah banyak pertimbangan, gue stick di Caddy.\r\n\r\nGue lebih memilih menjawab \"Gak tau kalau Traefik\" daripada harus menjelaskan perbedaan antara Caddy dan Traefik. Banyak tahu itu membahayakan, salah satunya adalah karena kamu akan berurusan dengan sesuatu yang seharusnya bukan urusanmu.\r\n\r\n## Penutup\r\nGue kepikiran menulis ini setelah membahas tentang riba sama teman gue. Membahas tentang mengapa orang-orang korupsi. Membahas tentang kenapa kita berurusan dengan sesuatu yang seharusnya bukan urusan kita. Membahas tentang mengapa lebih menguntungkan jual data yang bocor daripada menyelanggarakan bug bounty.\r\n\r\nMungkin gue naif karena tidak ingin menerima fakta.\r\n\r\nTapi di beberapa hal gue lebih memilih untuk diam ataupun tidak mencari tahu daripada seperti menjadi bumerang untuk gue yang mungkin merugikan gue.\r\n\r\nPengetahuan tidak pernah salah.\r\n\r\nYang salah selalu subjeknya yang menyalahgunakan pengetahuan tersebut.\r\n\r\nTerkadang memilih untuk diam adalah yang terbaik.\r\n\r\nEntah agar tidak harus berurusan dengan sesuatu yang harusnya bukan urusan kita, ataupun untuk menghindari sesuatu yang menjadi bumerang untuk kita.\r\n\r\nYang pasti, fakta adalah fakta.\r\n\r\nDan semuanya membutuhkan momentum.\r\n";
				}
				function compiledContent$7() {
					return html$7;
				}
				function getHeadings$7() {
					return [{"depth":2,"slug":"to-or-not-to","text":"To or not to"},{"depth":2,"slug":"sometimes-silence-is-gold","text":"Sometimes silence is gold"},{"depth":2,"slug":"facts-in-everyday-things","text":"Facts in everyday things"},{"depth":2,"slug":"if-you-know-you-know","text":"If you know, you know"},{"depth":2,"slug":"to-not-giving-a-fuck","text":"To not giving a fuck"},{"depth":2,"slug":"penutup","text":"Penutup"}];
				}
				function getHeaders$7() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$7();
				}				async function Content$7() {
					const { layout, ...content } = frontmatter$7;
					content.file = file$7;
					content.url = url$7;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$7 });
					return contentFragment;
				}
				Content$7[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$7,
	file: file$7,
	url: url$7,
	rawContent: rawContent$7,
	compiledContent: compiledContent$7,
	getHeadings: getHeadings$7,
	getHeaders: getHeaders$7,
	Content: Content$7,
	default: Content$7
}, Symbol.toStringTag, { value: 'Module' }));

const html$6 = "<p>Ever since you sit in your comfy room, you have a smart TV; high-end laptops &#x26; PCs, ~100MiB/s internet, comfort chair, even Nintendo Switch. You have a couple of good books to read, interesting thoughts to write, and some crazy reflection to draw.</p>\n<p>But you do nothing.</p>\n<p>You don’t know what to do.</p>\n<p>You spend time sitting in front of stupid computers for 8 hours a day, talking bullshit on the Slack channels every day and writing boring code just like everyone else does. You know who you are in your ~9to5 but the rest you are a nobody.</p>\n<p>Just a name with an empty soul.</p>\n<p>Maybe you have a dream, but you choose to keep your dream, dream.</p>\n<p>Maybe you have friends, but those are just Instagram users.</p>\n<p>Maybe you have a nice watch, but have no time.</p>\n<p>You then realize that you are not as strong as your sweet 17’s.</p>\n<p>You then realize that you don’t have as much time as before though every day is still 24 hours.</p>\n<p>Your energy is spent doing nothing but work.</p>\n<p>You have enough money in your savings, nice stocks to trade, and some cryptocurrencies to keep. You can buy anything yet happiness is always priceless.</p>\n<p>Who the hell needs happiness, anyway?</p>\n<p>Then you see how people live their lives.</p>\n<p>You sure you’re happy yet all you do is laugh.</p>\n<p>Mouth can lie but your heart can’t, as you know.</p>\n<p>There is a strange feeling in your little heart. You don’t know exactly what it is but you’re sure it feel like an emptiness as it’s not your very first time.</p>\n<p>You know what you have to do but you choose to not to.</p>\n<p>You need someone to talk and know it’s not Siri.</p>\n<p>Not even your phone.</p>\n<p>Or your refrigerator.</p>\n<p>You know the name but not the person.</p>\n<p>You have deep regrets but don’t want to change anything.</p>\n<p>You open Netflix but what you want to see is not there</p>\n<p>You open Discord, Telegram, Signal, but no one you want to contact there.</p>\n<p>Nobody knows what happened but you.</p>\n<p>Then you choose to sleep.</p>\n<p>Forget anything and forgive everything.</p>\n<p>Next morning you wake up, eat, and sit in front of stupid computer again.</p>\n<p>You say “new day, new me” yet it’s still the same just like yesterday.</p>\n<p>And then you write this shit and save it in a draft.</p>\n<p>You know it won’t change anything even if you publish it anywhere yet you know it won’t change anything if you keep it in draft anyway.</p>\n<p>You click publish.</p>\n<p>Emptiness is still there but you know it’s a different one.</p>\n<p>You know you just need to talk as your head can’t keep it any longer.</p>\n<p>Then something falls in your eyes.</p>\n<p>You know tears won’t change anything yet you know it won’t change anything if you don’t cry anyway.</p>\n<p>Then you realize that emptiness is a part of who you are.</p>\n<p>Because every time emptiness knocks on your door, you let it in.</p>\n<p>Always.</p>\n<p>Life is always about choice and that’s what you choose.</p>";

				const frontmatter$6 = {"pubDate":"May 28 2022","title":"Emptiness","description":"When you don't know what to do.","excerpt":"Ever since you sit in your comfy room, you have a smart TV; high-end laptops & PCs, ~100MiB/s internet, comfort chair, even Nintendo Switch. You have a couple of good books to read, interesting thoughts to write, and some crazy reflection to draw. But you do nothing.","image":"~/assets/images/emptyness.jpg","tags":["stories"]};
				const file$6 = "E:/yuxxeun/yuxxeun/honeypod/data/blog/emptiness.md";
				const url$6 = undefined;
				function rawContent$6() {
					return "\r\nEver since you sit in your comfy room, you have a smart TV; high-end laptops & PCs, ~100MiB/s internet, comfort chair, even Nintendo Switch. You have a couple of good books to read, interesting thoughts to write, and some crazy reflection to draw.\r\n\r\nBut you do nothing.\r\n\r\nYou don't know what to do.\r\n\r\nYou spend time sitting in front of stupid computers for 8 hours a day, talking bullshit on the Slack channels every day and writing boring code just like everyone else does. You know who you are in your ~9to5 but the rest you are a nobody.\r\n\r\nJust a name with an empty soul.\r\n\r\nMaybe you have a dream, but you choose to keep your dream, dream.\r\n\r\nMaybe you have friends, but those are just Instagram users.\r\n\r\nMaybe you have a nice watch, but have no time.\r\n\r\nYou then realize that you are not as strong as your sweet 17's.\r\n\r\nYou then realize that you don't have as much time as before though every day is still 24 hours.\r\n\r\nYour energy is spent doing nothing but work.\r\n\r\nYou have enough money in your savings, nice stocks to trade, and some cryptocurrencies to keep. You can buy anything yet happiness is always priceless.\r\n\r\nWho the hell needs happiness, anyway?\r\n\r\nThen you see how people live their lives.\r\n\r\nYou sure you're happy yet all you do is laugh.\r\n\r\nMouth can lie but your heart can't, as you know.\r\n\r\nThere is a strange feeling in your little heart. You don't know exactly what it is but you're sure it feel like an emptiness as it's not your very first time.\r\n\r\nYou know what you have to do but you choose to not to.\r\n\r\nYou need someone to talk and know it's not Siri.\r\n\r\nNot even your phone.\r\n\r\nOr your refrigerator.\r\n\r\nYou know the name but not the person.\r\n\r\nYou have deep regrets but don't want to change anything.\r\n\r\nYou open Netflix but what you want to see is not there\r\n\r\nYou open Discord, Telegram, Signal, but no one you want to contact there.\r\n\r\nNobody knows what happened but you.\r\n\r\nThen you choose to sleep.\r\n\r\nForget anything and forgive everything.\r\n\r\nNext morning you wake up, eat, and sit in front of stupid computer again.\r\n\r\nYou say \"new day, new me\" yet it's still the same just like yesterday.\r\n\r\nAnd then you write this shit and save it in a draft.\r\n\r\nYou know it won't change anything even if you publish it anywhere yet you know it won't change anything if you keep it in draft anyway.\r\n\r\nYou click publish.\r\n\r\nEmptiness is still there but you know it's a different one.\r\n\r\nYou know you just need to talk as your head can't keep it any longer.\r\n\r\nThen something falls in your eyes.\r\n\r\nYou know tears won't change anything yet you know it won't change anything if you don't cry anyway.\r\n\r\nThen you realize that emptiness is a part of who you are.\r\n\r\nBecause every time emptiness knocks on your door, you let it in.\r\n\r\nAlways.\r\n\r\nLife is always about choice and that's what you choose.\r\n";
				}
				function compiledContent$6() {
					return html$6;
				}
				function getHeadings$6() {
					return [];
				}
				function getHeaders$6() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$6();
				}				async function Content$6() {
					const { layout, ...content } = frontmatter$6;
					content.file = file$6;
					content.url = url$6;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$6 });
					return contentFragment;
				}
				Content$6[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$6,
	file: file$6,
	url: url$6,
	rawContent: rawContent$6,
	compiledContent: compiledContent$6,
	getHeadings: getHeadings$6,
	getHeaders: getHeaders$6,
	Content: Content$6,
	default: Content$6
}, Symbol.toStringTag, { value: 'Module' }));

const html$5 = "<p>Setidaknya ada 3 hal yang manusia benci baik sadar maupun tidak sadar.</p>\n<p>3 hal tersebut ialah:</p>\n<ul>\n<li>Ketakutan</li>\n<li>Ketidakpastian</li>\n<li>Keraguan</li>\n</ul>\n<p><em>Generally speaking</em>, bukan tanpa alasan mengapa terkadang kita berdoa sebelum melakukan perjalanan; menyisihkan uang gaji untuk ber-investasi, membayar lebih demi garansi, ataupun berlangganan pada salah satu produk asuransi.</p>\n<p>Semata-mata untuk melawan 3 hal diatas yang hasilnya membuahkan ketenangan, baik hanya untuk sementara ataupun selama mungkin. Gue pribadi melakukan hal serupa, beribadah sebisa mungkin; membuat anggaran dari uang gaji untuk menabung &#x26; ber-investasi (still not sure if it’s a <em>different thing</em>).</p>\n<p>Yang tujuannya untuk setidaknya mengurangi ketakutan, ketidakpastian, dan keraguan yang gue miliki dalam hidup.</p>\n<p>Dari 3 hal diatas, yang paling gue benci adalah <strong>ketidakpastian</strong>.</p>\n<p>Manusia selalu dihantui ketidakpastian dari bangun tidur sampai akan tertidur lagi nanti. Apa yang akan terjadi pada hari ini? Apa yang akan terjadi besok? Apakah besok gue masih bangun diatas ranjang atau di alam kubur? Akan ada masalah apa lagi pada hari ini?</p>\n<p>Bagaimanapun ketidakpastian adalah sesuatu yang tidak bisa dihindari, dan biasanya satu hal yang bisa gue lakukan untuk menghadapinya adalah dengan membiasakan. Karena sekali lagi, ada sesuatu yang bisa dan tidak bisa kita kontrol, maka apa lagi yang bisa kita lakukan selain pasrah setelah mempersiapkan &#x26; berusaha semaksimal mungkin?</p>\n<p>Kembali ke topik FUD, dalam dunia <em>InfoSec</em> topik ini lumayan laris khususnya ketika menanggapi orang-orang yang termakan akan hal itu khususnya oleh penyedia layanan “VPN komersil” yang selalu menyerukan bahwa jaringan internet kita tidak pribadi dan seseorang sedang menguntit kita.</p>\n<p>Meskipun di lain sisi hal diatas sedikit benar, tapi ada satu hal yang jarang sekali orang awam seperti kita perhatikan: <strong><em>Threat model</em></strong>.</p>\n<p>Misal bayangkan begini, lo naik motor malam-malam sendirian di suatu jalan random. Ada satu motor dengan dua penumpang yang mengikuti lo di belakang, lalu apa yang lo pikirkan dan yang paling penting apa yang bakal lo lakukan?</p>\n<p>Banyak kemungkinan yang bisa dipilih: Menyamakan kecepatan lalu menendangnya dari samping, berhenti dan memastikan bahwa mereka tidak mengikuti, ataupun tetap santai dan menganggap tidak ada yang salah.</p>\n<p>Apapun tindakan yang lo pilih, setidaknya lo sudah memikirkannya.</p>\n<p>Sekarang begini, bagaimana bila mereka memang mengikuti namun dengan maksud baik seperti menemani? Atau mereka pun ternyata merasakan hal yang sama dengan lo? Atau yang memang orang random aja yang lagi jalan-jalan malam?</p>\n<p>Atau bagaimana jika mereka memang gangster?</p>\n<p>Setelah memikirkannya kemungkinan-kemungkinan yang ada, baru lo memikirkan kemungkinan-kemungkinan apa yang akan terjadi bila hal diatas… terjadi.</p>\n<p>Sekarang begini, mengapa orang menabung? Misal, untuk persiapan di masa depan. Lalu bila ada pertanyaan lanjutan yang sekiranya menimbulkan keraguan terhadap kita seperti: <i>“Bagaimana bila ternyata besok kiamat? Bagaimana bila kita tidak akan pernah menikmati tabungan tersebut? Bagaimana bila hari ini adalah kesempatan terakhir kita untuk hidup?”</i>, dsb.</p>\n<p>Pada dasarnya dalam threat modeling ada 4 pertanyaan yang harus bisa dijawab:</p>\n<ol>\n<li>Apa yang kita lakukan?</li>\n<li>Apa yang sekiranya salah?</li>\n<li>Apa yang akan kita lakukan jika suatu hal terjadi?</li>\n<li>Apakah yang kita lakukan sudah baik?</li>\n</ol>\n<p>Kita ambil konteks dalam aktivitas menabung, jadi, mari kita jawab 4 pertanyaan diatas:</p>\n<ol>\n<li>Menggunakan dana dari tabungan untuk dana darurat</li>\n<li>Tidak menganggarkan uang darurat juga, mungkin?</li>\n<li>Mengambil dana yang ada di tabungan sebagai dana darurat</li>\n<li>Kurang efektif, harusnya dana darurat berada di anggaran terpisah sehingga tidak mempengaruhi tujuan dari aktivitas menabung tersebut</li>\n</ol>\n<p>Poin nomor empat diatas terasa sedikit negatif, mari kita buat <em>counterpart-nya</em> untuk yang sedikit positif: 4. Kurang efektif tapi lumayan efisien, karena masih ada kebutuhan primer lain dan sedangkan prioritas dalam tujuan dari menabung tersebut tidak sepenting apa yang harus dilakukan dengan kebutuhan dana darurat yang dibutuhkan.</p>\n<p>Idk, apakah ini relevan atau tidak dengan Threat Modeling yang ada di dunia InfoSec, sejauh yang gue pahami kira-kira seperti itu. Jawaban-jawaban yang ada bersifat relatif dan disesuaikan dengan keadaan masing-masing.</p>\n<h2 id=\"vulnerability\">Vulnerability</h2>\n<p>Dalam agama islam, beribadah—khususnya solat—adalah sebuah kewajiban selama 5 waktu dalam ~24jam. Jawaban dari pertanyaan <strong><em>“mengapa solat?”</em></strong> sangat beragam, dari yang tujuan ibadah secara harfiah seperti <em>“untuk mengingat tuhan”</em> sampai ke jawaban klasik seperti <em>“untuk mendapatkan pahala dan terhindar dari dosa”</em>.</p>\n<p>Dalam sebuah sistem, ada sebuah konsep bernama “vulnerability” yang tujuannya untuk melakukan exploit. Vulnerability (kerentanan) ini adalah sebuah celah keamanan, dan karena adanya kerentanan tersebut tujuannya dari si penyerang adalah untuk memanfaatkan agar bisa melakukan “eksploitasi” dengan “payload” yang benar.</p>\n<p>Mari kita ambil contoh dari para penyedia layanan VPN komersil yang memasarkan produk mereka. Apa yang mereka gunakan sebagai bahan utama dalam pemasaran? Ancaman. Seruan bahwa privasi di dunia digital kita sedang terancam, dan menggunakan VPN mereka adalah bentuk perlawanannya.</p>\n<p>Bagi yang masih sedikit awam khususnya dalam topik privasi; industri periklanan, data mining, dsb, besar kemungkinan iklan tersebut efektif. Siapa juga yang tidak tenang bila aktivitas ber-internet kita diawasi oleh “pihak ketiga” yang tertarik untuk mengolah data dari aktivitas kita tersebut?</p>\n<p>Siapa juga yang tidak tenang bila ada seorang “hacker” yang berada di jaringan kita dan menguntit (ataupun memodifikasi) data (alias paket internet) yang kita kirim dan terima?</p>\n<p>Dan siapa juga yang tidak risih ketika kita sedang mencari tentang “budget nikah” lalu tidak lama kemudian kita mendapatkan promosi terkait hotel murah di Jogja yang cocok untuk ber-bulan madu?</p>\n<p>Ketakutan dan ketidakpastian adalah hal yang paling laku dijual kepada manusia. Dari promo (hanya minggu ini!), cashback (kapan lagi ya ga?), jaminan (momen bagaimana jika…), dsb adalah hal yang lumrah kita lihat &#x26; rasakan pada hari ini.\r\nDan ketika sudah berada di titik keraguan, di sinilah eksploitasi bisa mulai dilakukan ketika kita sudah merasa rentan. Dengan “payload” yang pas, maka akan mendapatkan throughput yang diharapkan.</p>\n<p>Yang diuntungkan? entahlah.</p>\n<p>FUD menjadi alat menyerang yang efektif karena tidak ada satupun yang bisa melihat masa depan.</p>\n<p>Dan setidaknya, kita mendapatkan “ketenangan” karena keraguan tersebut mungkin sudah tidak dirasakan lagi kehadirannya.</p>\n<p>Yang berarti kita sebisa mungkin meyakinkan bahwa yang diuntungkan adalah kita, yang mungkin tanpa memikirkan jawaban akan 4 pertanyaan yang pernah disinggung.</p>\n<h2 id=\"penutup\">Penutup</h2>\n<p>Tentu saja maksud dan tujuan gue menulis tentang FUD disini topik utamanya bukanlah tentang membahas seputar layanan VPN komersil, InfoSec, bagaimana hacker melakukan hacking, atau apapun itu yang terlihat keren dan pintar.</p>\n<p>Somehow terkadang gue merasa lelah dengan ketidakpastian.</p>\n<p>Sampai kapan hidup gue akan terus begini?</p>\n<p>Akan menjadi apa gue pada 5 tahun kedepan nanti?</p>\n<p>Apakah gue masih akan bisa merasakan sesuatu yang bernama kebahagiaan (<i>in a literally way</i>)?</p>\n<p>Apakah suatu saat gue dapat mengerti arti dari cinta secara harfiah dan bukan sebatas kiasan semata?</p>\n<p>Apakah gue suatu saat nanti akan wisuda?</p>\n<p>Kapan nikah?</p>\n<p>Kapan punya anak?</p>\n<p>Kapan manusia dapat melihat bentuk asli bumi sehingga tidak ada lagi kubu bumi bulat dan datar?</p>\n<p>Kapan naik gaji lagi???? (ini bercanda tapi kalau mau diseriusin juga boleh. Karena hampir semua orang suka dengan uang yang banyak, benar?)</p>\n<p>Apakah surga dan neraka itu ada?</p>\n<p>Apakah ketika gue tidur sekarang gue akan terbangun lagi?</p>\n<p>Apakah kalau gue beli Mac Mini tahun ini di tahun depan nanti Apple mengeluarkan Mac Mini dengan chip M1 Pro dengan harga yang tidak beda jauh?</p>\n<p>Dan masih banyak lagi ketidakpastian lainnya.</p>\n<p>Oke oke, sekarang kita kembali ke konteks yang sebenarnya.</p>\n<p>Biasalah, kehidupan pribadi.</p>\n<p>Tidak sedikit yang menaruh kepercayaan kepada gue.</p>\n<p>Dari orang tua khususnya sebagai anak laki-laki satu-satunya, tauladan sebagai kakak, pekerjaan sebagai karyawan, hubungan sebagai pacar, pertemanan sebagai sahabat, muslim sebagai umatnya, dsb.</p>\n<p>Tentu saja gue tidak pernah meminta untuk mereka melakukan itu, terlebih karena kepercayaan itu seharusnya didapat bukan diminta.</p>\n<p>Dan apalagi yang bisa gue lakukan selain berusaha semaksimal mungkin dan meyakinkan mereka—baik langsung ataupun tidak langsung—bahwa mereka tidak menaruh kepercayaan kepada orang yang salah?</p>\n<p>Tapi sekali lagi, bagaimana bila gue ternyata mengecewakan mereka? Bagaimana bila usaha gue tidak semaksimal itu? Bagaimana bila ternyata hasil yang didapat tidak sesuai dengan harapan gue? Dan masih banyak lagi pertanyaan yang dimulai dengan <strong>“bagaimana”</strong>.</p>\n<p>Gue belum mengetahui jawabannya sampai gue mengetik ini.</p>\n<p>Jika sebelumnya gue hanya bisa pasrah terkait apa yang terjadi khususnya terhadap apa yang tidak bisa gue kontrol, setidaknya sekarang gue bisa mengetahui jawaban yang bisa membuat gue tenang: mengetahui jawaban dari 4 pertanyaan sialan dalam threat modeling, untuk setiap hal yang sedang gue hadapi.</p>\n<p>Karena setiap manusia pasti memiliki kerentanan, dan celah yang paling rentan adalah di ketakutan, ketidakpastian, dan keraguan.</p>\n<p>Dan gue sudah merasa lelah selalu dihantui 3 hal tersebut sehingga seringkali hari-hari gue selalu diselimuti dengan ketidaktenangan.</p>\n<p>Dan mengetahui jawabannya, somehow memberikan ketenangan.</p>\n<p>Tanpa perlu melakukan pelarian dengan menegak minuman ber-alkohol dengan tidak <em>responsibly</em>, tanpa perlu berpura-pura semuanya baik-baik saja dengan membohongi diri sendiri, tanpa perlu meditasi yang tidak menyelesaikan permasalahan utama.</p>\n<p>Cukup dengan mengetahui 4 jawaban terkait pertanyaan-pertanyaan yang ada.\r\nDan untuk bagian apakah jawabannya nanti sesuai dengan yang diinginkan atau tidak, itu urusan lain.</p>\n<p>Karena yang terjadi, terjadilah.</p>\n<p><strong>P.S: I’m pretty sure i’m sober as i wrote this. But if you feel otherwise, I’m sorry and take this post as just my conversation with my mind because my only enemies are my ego and myself (and javascript too maybe)</strong>.</p>";

				const frontmatter$5 = {"pubDate":"June 17 2022","title":"Fear. Uncertainty. Doubt.","description":"As title said.","excerpt":"Setidaknya ada 3 hal yang manusia benci baik sadar maupun tidak sadar.","image":"~/assets/images/fud.jpg","tags":["thoughts"]};
				const file$5 = "E:/yuxxeun/yuxxeun/honeypod/data/blog/fud.md";
				const url$5 = undefined;
				function rawContent$5() {
					return "\r\nSetidaknya ada 3 hal yang manusia benci baik sadar maupun tidak sadar.\r\n\r\n3 hal tersebut ialah:\r\n\r\n- Ketakutan\r\n- Ketidakpastian\r\n- Keraguan\r\n\r\n_Generally speaking_, bukan tanpa alasan mengapa terkadang kita berdoa sebelum melakukan perjalanan; menyisihkan uang gaji untuk ber-investasi, membayar lebih demi garansi, ataupun berlangganan pada salah satu produk asuransi.\r\n\r\nSemata-mata untuk melawan 3 hal diatas yang hasilnya membuahkan ketenangan, baik hanya untuk sementara ataupun selama mungkin. Gue pribadi melakukan hal serupa, beribadah sebisa mungkin; membuat anggaran dari uang gaji untuk menabung & ber-investasi (still not sure if it's a _different thing_).\r\n\r\nYang tujuannya untuk setidaknya mengurangi ketakutan, ketidakpastian, dan keraguan yang gue miliki dalam hidup.\r\n\r\nDari 3 hal diatas, yang paling gue benci adalah **ketidakpastian**.\r\n\r\nManusia selalu dihantui ketidakpastian dari bangun tidur sampai akan tertidur lagi nanti. Apa yang akan terjadi pada hari ini? Apa yang akan terjadi besok? Apakah besok gue masih bangun diatas ranjang atau di alam kubur? Akan ada masalah apa lagi pada hari ini?\r\n\r\nBagaimanapun ketidakpastian adalah sesuatu yang tidak bisa dihindari, dan biasanya satu hal yang bisa gue lakukan untuk menghadapinya adalah dengan membiasakan. Karena sekali lagi, ada sesuatu yang bisa dan tidak bisa kita kontrol, maka apa lagi yang bisa kita lakukan selain pasrah setelah mempersiapkan & berusaha semaksimal mungkin?\r\n\r\nKembali ke topik FUD, dalam dunia _InfoSec_ topik ini lumayan laris khususnya ketika menanggapi orang-orang yang termakan akan hal itu khususnya oleh penyedia layanan \"VPN komersil\" yang selalu menyerukan bahwa jaringan internet kita tidak pribadi dan seseorang sedang menguntit kita.\r\n\r\nMeskipun di lain sisi hal diatas sedikit benar, tapi ada satu hal yang jarang sekali orang awam seperti kita perhatikan: **_Threat model_**.\r\n\r\nMisal bayangkan begini, lo naik motor malam-malam sendirian di suatu jalan random. Ada satu motor dengan dua penumpang yang mengikuti lo di belakang, lalu apa yang lo pikirkan dan yang paling penting apa yang bakal lo lakukan?\r\n\r\nBanyak kemungkinan yang bisa dipilih: Menyamakan kecepatan lalu menendangnya dari samping, berhenti dan memastikan bahwa mereka tidak mengikuti, ataupun tetap santai dan menganggap tidak ada yang salah.\r\n\r\nApapun tindakan yang lo pilih, setidaknya lo sudah memikirkannya.\r\n\r\nSekarang begini, bagaimana bila mereka memang mengikuti namun dengan maksud baik seperti menemani? Atau mereka pun ternyata merasakan hal yang sama dengan lo? Atau yang memang orang random aja yang lagi jalan-jalan malam?\r\n\r\nAtau bagaimana jika mereka memang gangster?\r\n\r\nSetelah memikirkannya kemungkinan-kemungkinan yang ada, baru lo memikirkan kemungkinan-kemungkinan apa yang akan terjadi bila hal diatas... terjadi.\r\n\r\nSekarang begini, mengapa orang menabung? Misal, untuk persiapan di masa depan. Lalu bila ada pertanyaan lanjutan yang sekiranya menimbulkan keraguan terhadap kita seperti: <i>\"Bagaimana bila ternyata besok kiamat? Bagaimana bila kita tidak akan pernah menikmati tabungan tersebut? Bagaimana bila hari ini adalah kesempatan terakhir kita untuk hidup?\"</i>, dsb.\r\n\r\nPada dasarnya dalam threat modeling ada 4 pertanyaan yang harus bisa dijawab:\r\n\r\n1. Apa yang kita lakukan?\r\n2. Apa yang sekiranya salah?\r\n3. Apa yang akan kita lakukan jika suatu hal terjadi?\r\n4. Apakah yang kita lakukan sudah baik?\r\n\r\nKita ambil konteks dalam aktivitas menabung, jadi, mari kita jawab 4 pertanyaan diatas:\r\n\r\n1. Menggunakan dana dari tabungan untuk dana darurat\r\n2. Tidak menganggarkan uang darurat juga, mungkin?\r\n3. Mengambil dana yang ada di tabungan sebagai dana darurat\r\n4. Kurang efektif, harusnya dana darurat berada di anggaran terpisah sehingga tidak mempengaruhi tujuan dari aktivitas menabung tersebut\r\n\r\nPoin nomor empat diatas terasa sedikit negatif, mari kita buat _counterpart-nya_ untuk yang sedikit positif: 4. Kurang efektif tapi lumayan efisien, karena masih ada kebutuhan primer lain dan sedangkan prioritas dalam tujuan dari menabung tersebut tidak sepenting apa yang harus dilakukan dengan kebutuhan dana darurat yang dibutuhkan.\r\n\r\nIdk, apakah ini relevan atau tidak dengan Threat Modeling yang ada di dunia InfoSec, sejauh yang gue pahami kira-kira seperti itu. Jawaban-jawaban yang ada bersifat relatif dan disesuaikan dengan keadaan masing-masing.\r\n\r\n## Vulnerability\r\n\r\nDalam agama islam, beribadah—khususnya solat—adalah sebuah kewajiban selama 5 waktu dalam ~24jam. Jawaban dari pertanyaan **_\"mengapa solat?\"_** sangat beragam, dari yang tujuan ibadah secara harfiah seperti _\"untuk mengingat tuhan\"_ sampai ke jawaban klasik seperti _\"untuk mendapatkan pahala dan terhindar dari dosa\"_.\r\n\r\nDalam sebuah sistem, ada sebuah konsep bernama \"vulnerability\" yang tujuannya untuk melakukan exploit. Vulnerability (kerentanan) ini adalah sebuah celah keamanan, dan karena adanya kerentanan tersebut tujuannya dari si penyerang adalah untuk memanfaatkan agar bisa melakukan \"eksploitasi\" dengan \"payload\" yang benar.\r\n\r\nMari kita ambil contoh dari para penyedia layanan VPN komersil yang memasarkan produk mereka. Apa yang mereka gunakan sebagai bahan utama dalam pemasaran? Ancaman. Seruan bahwa privasi di dunia digital kita sedang terancam, dan menggunakan VPN mereka adalah bentuk perlawanannya.\r\n\r\nBagi yang masih sedikit awam khususnya dalam topik privasi; industri periklanan, data mining, dsb, besar kemungkinan iklan tersebut efektif. Siapa juga yang tidak tenang bila aktivitas ber-internet kita diawasi oleh \"pihak ketiga\" yang tertarik untuk mengolah data dari aktivitas kita tersebut?\r\n\r\nSiapa juga yang tidak tenang bila ada seorang \"hacker\" yang berada di jaringan kita dan menguntit (ataupun memodifikasi) data (alias paket internet) yang kita kirim dan terima?\r\n\r\nDan siapa juga yang tidak risih ketika kita sedang mencari tentang \"budget nikah\" lalu tidak lama kemudian kita mendapatkan promosi terkait hotel murah di Jogja yang cocok untuk ber-bulan madu?\r\n\r\nKetakutan dan ketidakpastian adalah hal yang paling laku dijual kepada manusia. Dari promo (hanya minggu ini!), cashback (kapan lagi ya ga?), jaminan (momen bagaimana jika...), dsb adalah hal yang lumrah kita lihat & rasakan pada hari ini.\r\nDan ketika sudah berada di titik keraguan, di sinilah eksploitasi bisa mulai dilakukan ketika kita sudah merasa rentan. Dengan \"payload\" yang pas, maka akan mendapatkan throughput yang diharapkan.\r\n\r\nYang diuntungkan? entahlah.\r\n\r\nFUD menjadi alat menyerang yang efektif karena tidak ada satupun yang bisa melihat masa depan.\r\n\r\nDan setidaknya, kita mendapatkan \"ketenangan\" karena keraguan tersebut mungkin sudah tidak dirasakan lagi kehadirannya.\r\n\r\nYang berarti kita sebisa mungkin meyakinkan bahwa yang diuntungkan adalah kita, yang mungkin tanpa memikirkan jawaban akan 4 pertanyaan yang pernah disinggung.\r\n\r\n## Penutup\r\n\r\nTentu saja maksud dan tujuan gue menulis tentang FUD disini topik utamanya bukanlah tentang membahas seputar layanan VPN komersil, InfoSec, bagaimana hacker melakukan hacking, atau apapun itu yang terlihat keren dan pintar.\r\n\r\nSomehow terkadang gue merasa lelah dengan ketidakpastian.\r\n\r\nSampai kapan hidup gue akan terus begini?\r\n\r\nAkan menjadi apa gue pada 5 tahun kedepan nanti?\r\n\r\nApakah gue masih akan bisa merasakan sesuatu yang bernama kebahagiaan (<i>in a literally way</i>)?\r\n\r\nApakah suatu saat gue dapat mengerti arti dari cinta secara harfiah dan bukan sebatas kiasan semata?\r\n\r\nApakah gue suatu saat nanti akan wisuda?\r\n\r\nKapan nikah?\r\n\r\nKapan punya anak?\r\n\r\nKapan manusia dapat melihat bentuk asli bumi sehingga tidak ada lagi kubu bumi bulat dan datar?\r\n\r\nKapan naik gaji lagi???? (ini bercanda tapi kalau mau diseriusin juga boleh. Karena hampir semua orang suka dengan uang yang banyak, benar?)\r\n\r\nApakah surga dan neraka itu ada?\r\n\r\nApakah ketika gue tidur sekarang gue akan terbangun lagi?\r\n\r\nApakah kalau gue beli Mac Mini tahun ini di tahun depan nanti Apple mengeluarkan Mac Mini dengan chip M1 Pro dengan harga yang tidak beda jauh?\r\n\r\nDan masih banyak lagi ketidakpastian lainnya.\r\n\r\nOke oke, sekarang kita kembali ke konteks yang sebenarnya.\r\n\r\nBiasalah, kehidupan pribadi.\r\n\r\nTidak sedikit yang menaruh kepercayaan kepada gue.\r\n\r\nDari orang tua khususnya sebagai anak laki-laki satu-satunya, tauladan sebagai kakak, pekerjaan sebagai karyawan, hubungan sebagai pacar, pertemanan sebagai sahabat, muslim sebagai umatnya, dsb.\r\n\r\nTentu saja gue tidak pernah meminta untuk mereka melakukan itu, terlebih karena kepercayaan itu seharusnya didapat bukan diminta.\r\n\r\nDan apalagi yang bisa gue lakukan selain berusaha semaksimal mungkin dan meyakinkan mereka—baik langsung ataupun tidak langsung—bahwa mereka tidak menaruh kepercayaan kepada orang yang salah?\r\n\r\nTapi sekali lagi, bagaimana bila gue ternyata mengecewakan mereka? Bagaimana bila usaha gue tidak semaksimal itu? Bagaimana bila ternyata hasil yang didapat tidak sesuai dengan harapan gue? Dan masih banyak lagi pertanyaan yang dimulai dengan **\"bagaimana\"**.\r\n\r\nGue belum mengetahui jawabannya sampai gue mengetik ini.\r\n\r\nJika sebelumnya gue hanya bisa pasrah terkait apa yang terjadi khususnya terhadap apa yang tidak bisa gue kontrol, setidaknya sekarang gue bisa mengetahui jawaban yang bisa membuat gue tenang: mengetahui jawaban dari 4 pertanyaan sialan dalam threat modeling, untuk setiap hal yang sedang gue hadapi.\r\n\r\nKarena setiap manusia pasti memiliki kerentanan, dan celah yang paling rentan adalah di ketakutan, ketidakpastian, dan keraguan.\r\n\r\nDan gue sudah merasa lelah selalu dihantui 3 hal tersebut sehingga seringkali hari-hari gue selalu diselimuti dengan ketidaktenangan.\r\n\r\nDan mengetahui jawabannya, somehow memberikan ketenangan.\r\n\r\nTanpa perlu melakukan pelarian dengan menegak minuman ber-alkohol dengan tidak _responsibly_, tanpa perlu berpura-pura semuanya baik-baik saja dengan membohongi diri sendiri, tanpa perlu meditasi yang tidak menyelesaikan permasalahan utama.\r\n\r\nCukup dengan mengetahui 4 jawaban terkait pertanyaan-pertanyaan yang ada.\r\nDan untuk bagian apakah jawabannya nanti sesuai dengan yang diinginkan atau tidak, itu urusan lain.\r\n\r\nKarena yang terjadi, terjadilah.\r\n\r\n**P.S: I'm pretty sure i'm sober as i wrote this. But if you feel otherwise, I'm sorry and take this post as just my conversation with my mind because my only enemies are my ego and myself (and javascript too maybe)**.\r\n";
				}
				function compiledContent$5() {
					return html$5;
				}
				function getHeadings$5() {
					return [{"depth":2,"slug":"vulnerability","text":"Vulnerability"},{"depth":2,"slug":"penutup","text":"Penutup"}];
				}
				function getHeaders$5() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$5();
				}				async function Content$5() {
					const { layout, ...content } = frontmatter$5;
					content.file = file$5;
					content.url = url$5;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$5 });
					return contentFragment;
				}
				Content$5[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$5,
	file: file$5,
	url: url$5,
	rawContent: rawContent$5,
	compiledContent: compiledContent$5,
	getHeadings: getHeadings$5,
	getHeaders: getHeaders$5,
	Content: Content$5,
	default: Content$5
}, Symbol.toStringTag, { value: 'Module' }));

const html$4 = "<p>Sebagai seseorang yang (kadang) suka menulis kode atau program random, gue rasa <em>text editor</em> adalah salah satu dari sekian banyak perangkat lunak yang wajib gue punya dan pasang.</p>\n<p>Belakangan ini gue sedang senang menggunakan text editor sejuta umat alias ehm <strong><em><a href=\"https://visualstudio.microsoft.com/\">Visual Studio Code</a></em></strong> (untuk mempermudah dalam penulisan alias gue males ngetik panjang x lebar, kedepannya kita singkat aja jadi <strong>VScode</strong>), sayangnya tampilan si VScode <em>by default</em> sedikit berantakan dan <em>kinda boring i guess</em>.</p>\n<p><img src=\"https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/konfigurasi-vscode/vscode-default.png?raw=true\" alt=\"VScode by default\"> </p><center><em>Visual Studio Code by default</em></center><p></p>\n<p>Maka dari itu gue mencoba untuk membuatnya sedikit bersih dan <em>aesthetic</em>.</p>\n<h2 id=\"tema\">Tema</h2>\n<p>Perubahan gue mulai dari tema, karena ini sangat mencolok perubahannya dan sangat mempengaruhi kenyamanan dalam menulis sebuah program (dibaca: kode). Saat ini gue menggunakan tema <strong><em><a href=\"https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night\">Tokyo Night</a></em></strong>.</p>\n<h2 id=\"font\">Font</h2>\n<p>Sekarang pindah ke font, gue rasa kegiatan menulis kode akan terasa membosankan apabila harus berhadapan dengan font <code>Comic Sans</code>, untuk itu gue mamakai <code>Cascadia Code</code> yang bisa lo unduh <a href=\"https://github.com/microsoft/cascadia-code/releases\">di sini</a>. Jika dirasa gue bosan dengan si Cascadia, gue memiliki alternatif lain, seperti:</p>\n<ul>\n<li><a href=\"https://www.jetbrains.com/lp/mono/\">JetBrains Mono</a></li>\n<li><a href=\"https://github.com/tonsky/FiraCode\">Fira Code</a></li>\n<li>dan <a href=\"https://fonts.google.com/specimen/Space+Mono\">Space Mono</a></li>\n</ul>\n<p>dengan <code>\"editor.fontLigatures\": true</code> yang bisa lo <em>enable</em> di file <code>settings.json</code>.</p>\n<h2 id=\"ikon\">Ikon</h2>\n<p>Ikon yang gue pakai yaitu <a href=\"https://marketplace.visualstudio.com/items?itemName=willi84.vikings-icon-theme\">Viking Icon Theme</a>, alasan gue memilih ikon ini… ga ada sih lucu aja ehe.</p>\n<h2 id=\"settingsjson\">Settings.json</h2>\n<p>Oke, sekarang masuk ke setting (MacOs: <code>cmd</code> + <code>,</code> &#x26; Windows / Linux: <code>ctrl</code> + <code>,</code>), perubahan yang gue lakukan di sini lumayan banyak dan ini juga yang membuat VScode gue terlihat lebih bersih (dan <em>aesthetic</em>) lagi.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">{</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.editor.showTabs\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"blade.format.enable\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.defaultFormatter\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"esbenp.prettier-vscode\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"[javascript]\"</span><span style=\"color: #C9D1D9\">: {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #7EE787\">\"editor.defaultFormatter\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"esbenp.prettier-vscode\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  },</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.formatOnSave\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.activityBar.visible\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.statusBar.visible\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.iconTheme\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"vikings-icon-theme\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.colorTheme\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"Tokyo Night\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"search.mode\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"reuseEditor\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.fontSize\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">15</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.fontFamily\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"Cascadia Code, JetBrains Mono, Fira Code, Space Mono\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.fontLigatures\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.renderLineHighlight\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"none\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.matchBrackets\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"never\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.occurrencesHighlight\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.renderIndentGuides\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.minimap.enabled\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"breadcrumbs.enabled\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.renderWhitespace\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"none\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.lineHeight\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">29</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"bracketPairColorizer.showVerticalScopeLine\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.tokenColorCustomizations\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">null</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"vikings-icon-theme.folders.color\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"#fff\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"window.menuBarVisibility\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"compact\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"vikings-icon-theme.opacity\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">1</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"workbench.startupEditor\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"none\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"kite.showWelcomeNotificationOnStartup\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"files.autoSave\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"onWindowChange\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"terminal.integrated.fontFamily\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"JetBrains Mono\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"javascript.updateImportsOnFileMove.enabled\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"never\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"explorer.confirmDelete\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">false</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"editor.smoothScrolling\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">true</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"svelte.enable-ts-plugin\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">true</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span></code></pre>\n<p>Sejauh ini hasil yang gue dapatkan seperti ini:</p>\n<p><img src=\"https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/konfigurasi-vscode/hasil.png?raw=true\" alt=\"Look mom, this is my Visual Studio Code with aestethic look\"> </p><center><em>Look mom, this is my Visual Studio Code with aesthetic look</em></center><p></p>\n<p>Terlihat cukup bersih lah ya daripada yang disajikan oleh VScode <em>by default</em>.</p>";

				const frontmatter$4 = {"pubDate":"July 01 2022","title":"Konfigurasi Text Editor Sejuta Umat","description":"Visual Studio by default kinda sucks.","excerpt":"Visual Studio by default kinda sucks.","image":"~/assets/images/editor.jpg","tags":["ideas"]};
				const file$4 = "E:/yuxxeun/yuxxeun/honeypod/data/blog/konfigurasi-vscode.md";
				const url$4 = undefined;
				function rawContent$4() {
					return "\r\nSebagai seseorang yang (kadang) suka menulis kode atau program random, gue rasa _text editor_ adalah salah satu dari sekian banyak perangkat lunak yang wajib gue punya dan pasang.\r\n\r\nBelakangan ini gue sedang senang menggunakan text editor sejuta umat alias ehm **_[Visual Studio Code](https://visualstudio.microsoft.com/)_** (untuk mempermudah dalam penulisan alias gue males ngetik panjang x lebar, kedepannya kita singkat aja jadi **VScode**), sayangnya tampilan si VScode _by default_ sedikit berantakan dan _kinda boring i guess_.\r\n\r\n![VScode by default](https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/konfigurasi-vscode/vscode-default.png?raw=true) <center>_Visual Studio Code by default_</center>\r\n\r\nMaka dari itu gue mencoba untuk membuatnya sedikit bersih dan _aesthetic_.\r\n\r\n## Tema\r\n\r\nPerubahan gue mulai dari tema, karena ini sangat mencolok perubahannya dan sangat mempengaruhi kenyamanan dalam menulis sebuah program (dibaca: kode). Saat ini gue menggunakan tema **_[Tokyo Night](https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night)_**.\r\n\r\n## Font\r\n\r\nSekarang pindah ke font, gue rasa kegiatan menulis kode akan terasa membosankan apabila harus berhadapan dengan font `Comic Sans`, untuk itu gue mamakai `Cascadia Code` yang bisa lo unduh [di sini](https://github.com/microsoft/cascadia-code/releases). Jika dirasa gue bosan dengan si Cascadia, gue memiliki alternatif lain, seperti:\r\n\r\n- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)\r\n- [Fira Code](https://github.com/tonsky/FiraCode)\r\n- dan [Space Mono](https://fonts.google.com/specimen/Space+Mono)\r\n\r\ndengan `\"editor.fontLigatures\": true` yang bisa lo _enable_ di file `settings.json`.\r\n\r\n## Ikon\r\n\r\nIkon yang gue pakai yaitu [Viking Icon Theme](https://marketplace.visualstudio.com/items?itemName=willi84.vikings-icon-theme), alasan gue memilih ikon ini... ga ada sih lucu aja ehe.\r\n\r\n## Settings.json\r\n\r\nOke, sekarang masuk ke setting (MacOs: `cmd` + `,` & Windows / Linux: `ctrl` + `,`), perubahan yang gue lakukan di sini lumayan banyak dan ini juga yang membuat VScode gue terlihat lebih bersih (dan _aesthetic_) lagi.\r\n\r\n```json\r\n{\r\n  \"workbench.editor.showTabs\": false,\r\n  \"blade.format.enable\": false,\r\n  \"editor.defaultFormatter\": \"esbenp.prettier-vscode\",\r\n  \"[javascript]\": {\r\n    \"editor.defaultFormatter\": \"esbenp.prettier-vscode\"\r\n  },\r\n  \"editor.formatOnSave\": true,\r\n  \"workbench.activityBar.visible\": false,\r\n  \"workbench.statusBar.visible\": false,\r\n  \"workbench.iconTheme\": \"vikings-icon-theme\",\r\n  \"workbench.colorTheme\": \"Tokyo Night\",\r\n  \"search.mode\": \"reuseEditor\",\r\n  \"editor.fontSize\": 15,\r\n  \"editor.fontFamily\": \"Cascadia Code, JetBrains Mono, Fira Code, Space Mono\",\r\n  \"editor.fontLigatures\": true,\r\n  \"editor.renderLineHighlight\": \"none\",\r\n  \"editor.matchBrackets\": \"never\",\r\n  \"editor.occurrencesHighlight\": false,\r\n  \"editor.renderIndentGuides\": false,\r\n  \"editor.minimap.enabled\": false,\r\n  \"breadcrumbs.enabled\": false,\r\n  \"editor.renderWhitespace\": \"none\",\r\n  \"editor.lineHeight\": 29,\r\n  \"bracketPairColorizer.showVerticalScopeLine\": false,\r\n  \"editor.tokenColorCustomizations\": null,\r\n  \"vikings-icon-theme.folders.color\": \"#fff\",\r\n  \"window.menuBarVisibility\": \"compact\",\r\n  \"vikings-icon-theme.opacity\": 1,\r\n  \"workbench.startupEditor\": \"none\",\r\n  \"kite.showWelcomeNotificationOnStartup\": false,\r\n  \"files.autoSave\": \"onWindowChange\",\r\n  \"terminal.integrated.fontFamily\": \"JetBrains Mono\",\r\n  \"javascript.updateImportsOnFileMove.enabled\": \"never\",\r\n  \"explorer.confirmDelete\": false,\r\n  \"editor.smoothScrolling\": true,\r\n  \"svelte.enable-ts-plugin\": true\r\n}\r\n```\r\n\r\nSejauh ini hasil yang gue dapatkan seperti ini:\r\n\r\n![Look mom, this is my Visual Studio Code with aestethic look](https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/konfigurasi-vscode/hasil.png?raw=true) <center>_Look mom, this is my Visual Studio Code with aesthetic look_</center>\r\n\r\nTerlihat cukup bersih lah ya daripada yang disajikan oleh VScode _by default_.\r\n";
				}
				function compiledContent$4() {
					return html$4;
				}
				function getHeadings$4() {
					return [{"depth":2,"slug":"tema","text":"Tema"},{"depth":2,"slug":"font","text":"Font"},{"depth":2,"slug":"ikon","text":"Ikon"},{"depth":2,"slug":"settingsjson","text":"Settings.json"}];
				}
				function getHeaders$4() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$4();
				}				async function Content$4() {
					const { layout, ...content } = frontmatter$4;
					content.file = file$4;
					content.url = url$4;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$4 });
					return contentFragment;
				}
				Content$4[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$4,
	file: file$4,
	url: url$4,
	rawContent: rawContent$4,
	compiledContent: compiledContent$4,
	getHeadings: getHeadings$4,
	getHeaders: getHeaders$4,
	Content: Content$4,
	default: Content$4
}, Symbol.toStringTag, { value: 'Module' }));

const html$3 = "<p>Gue tipe orang yang konsumtif, dan gue rasa hampir setiap orang juga konsumtif. Bedanya ada yang melakukan konsumsi karena memang benar-benar butuh atau yang engga butuh-butuh banget.</p>\n<p>Konsumtif, less produktif, at least worth.</p>\n<p>Prinsip gue dalam mengkonsumsi sesuatu adalah tentang hasil yang gue dapat dari proses\r\nkonsumsi tersebut. Singkatnya, minimal konsumtif harus berbanding lurus dengan produktif,\r\ngue ga akan ngomongin seputar kesehatan, karena gue bukan tipe orang yang sehat-sehat\r\nbanget.</p>\n<p>Oke, misal gini, apa yang gue dapet setelah membeli kopi seharga ~50ribu dan duduk\r\nberjam-jam di warkop atau kafe? 2 tulisan baru dan 5 task resolved, contohnya.</p>\n<p>Apakah pengeluaran 50ribu tersebut worth dengan apa yang sudah gue lakukan? Well,\r\nselama gue produktif gue akan memaafkan diri gue yang konsumtif ini.</p>\n<h2 id=\"cashback\">Cashback…</h2>\n<p>Gue bukan tipe orang yang gila cashback, tapi akhir-akhir ini enjoy menggunakan cashback,\r\nintinya cashback gue anggap sebagai “thank you” dari suatu layanan, karena telah\r\nmenggunakan layanan tersebut.</p>\n<p>Ambil contoh kalau gue mendapatkan cashback 20% bila menggunakan aplikasi go***pay,\r\ngopay ngasih gue ~10ribu sebagai tanda terima kasih karena telah menggunakan aplikasi\r\nmereka untuk ber-transaksi sekitar ~50ribu.</p>\n<p>Cashback bukanlah hal yang permanent, namun selagi ada program cashback… ya kenapa\r\nengga dinikmati?</p>\n<h2 id=\"health\">Health?</h2>\n<p>Oke oke, gue cuma membicarakan tentang output belum membicarakan tentang efek.\r\nDan inilah alasan gue mengapa memilih kata pintar daripada cerdas, kalau lo cerdas lo pasti mempertimbangkan beberala hal juga, sebagai contoh: faktor kesehatan, ekonomi negara dunia ketiga, dan sebagainya.</p>\n<p>Oke oke berlebihan ya.</p>\n<p>Mari kita persingkat ke kesehatan.</p>\n<p>Meskipun kopi 50ribu kita anggap worth dengan 2 tulisan baru dan 5 task resolved, namun apakah efek yang ada di dalam kopi tersebut worth terhadap diri lo? Misal, efek kafein, gula, dsb.</p>\n<p><strong>Percuma</strong> ㅡ sengaja gue tekankan.</p>\n<p>Misal apa yang kita hasilkan tersebut menyebabkan hal lain ㅡ jatuh sakit misalnya.\r\nSejujurnya gue tidak terlalu peduli dengan masalah kesehatan, ingat, tidak terlalu bukan berarti tidak ya.</p>\n<p>Setiap hari gue berurusan dengan hal tidak sehat, baik langsung seperti merokok ataupun tidak lamgsung terserah lo mau namain apa.\r\nJadi, untuk apa membicarakan buruknya neraka jika kita sedang tinggal di dalamnya?</p>\n<p>Kalau lo hidup sehat <em>by design</em>, faktor kesehatan mungkin harus dipertimbangkan untuk hari ini atau untuk hari yang akan datang.\r\nApalah aku yang tidak sehat ini ya, meskipun selalu bermimpi untuk hidup sehat.</p>\n<h2 id=\"terukur\">Terukur</h2>\n<p>Hal terakhir yang ingin gue bahas adalah terukur.\r\nKalau gue bisa mengukur apakah layak ~50ribu something + duduk berjam-jam di warkop per hari dengan apa yang gue hasilnkan, harusnya gue bisa mengukur hal lain juga; pengeluaran tiap bulan untuk itu, misalnya.</p>\n<p>Gue menggunakan metode <em>zero-budget</em> yang mana pemasukan + pengeluaran sama dengan nol.\r\nPengeluaran ini banyak macamnya; nabung dan investasi pun termasuk pengeluaran.</p>\n<p>Pemasukan juga banyak macamnya, tapi di sini gue ambil dari gaji utama gue.\r\nPengeluaran pun mostly ke perilaku konsumtif pangan, entertainment dan self improvement.\r\nGue sekarang sejujurnya belum ada rencana buat melakukan investasi, karena gue rasa dan yakin investasi yang worth untuk gue saat ini yaitu investasi ke diri sendiri (self improvement).</p>";

				const frontmatter$3 = {"pubDate":"March 25 2022","title":"Menjadi Konsumen Pintar","description":"Konsumtif, less produktif, at least worth.","excerpt":"Konsumtif, less produktif, at least worth.","image":"~/assets/images/konsumen-pintar.jpg","tags":["thoughts"]};
				const file$3 = "E:/yuxxeun/yuxxeun/honeypod/data/blog/konsumen-pintar.md";
				const url$3 = undefined;
				function rawContent$3() {
					return "\r\n\r\nGue tipe orang yang konsumtif, dan gue rasa hampir setiap orang juga konsumtif. Bedanya ada yang melakukan konsumsi karena memang benar-benar butuh atau yang engga butuh-butuh banget.\r\n\r\nKonsumtif, less produktif, at least worth.\r\n\r\nPrinsip gue dalam mengkonsumsi sesuatu adalah tentang hasil yang gue dapat dari proses\r\nkonsumsi tersebut. Singkatnya, minimal konsumtif harus berbanding lurus dengan produktif,\r\ngue ga akan ngomongin seputar kesehatan, karena gue bukan tipe orang yang sehat-sehat\r\nbanget.\r\n\r\nOke, misal gini, apa yang gue dapet setelah membeli kopi seharga ~50ribu dan duduk\r\nberjam-jam di warkop atau kafe? 2 tulisan baru dan 5 task resolved, contohnya.\r\n\r\nApakah pengeluaran 50ribu tersebut worth dengan apa yang sudah gue lakukan? Well,\r\nselama gue produktif gue akan memaafkan diri gue yang konsumtif ini.\r\n\r\n## Cashback...\r\n\r\nGue bukan tipe orang yang gila cashback, tapi akhir-akhir ini enjoy menggunakan cashback,\r\nintinya cashback gue anggap sebagai \"thank you\" dari suatu layanan, karena telah\r\nmenggunakan layanan tersebut.\r\n\r\nAmbil contoh kalau gue mendapatkan cashback 20% bila menggunakan aplikasi go\\*\\*\\*pay,\r\ngopay ngasih gue ~10ribu sebagai tanda terima kasih karena telah menggunakan aplikasi\r\nmereka untuk ber-transaksi sekitar ~50ribu.\r\n\r\nCashback bukanlah hal yang permanent, namun selagi ada program cashback... ya kenapa\r\nengga dinikmati?\r\n\r\n## Health?\r\n\r\nOke oke, gue cuma membicarakan tentang output belum membicarakan tentang efek.\r\nDan inilah alasan gue mengapa memilih kata pintar daripada cerdas, kalau lo cerdas lo pasti mempertimbangkan beberala hal juga, sebagai contoh: faktor kesehatan, ekonomi negara dunia ketiga, dan sebagainya.\r\n\r\nOke oke berlebihan ya.\r\n\r\nMari kita persingkat ke kesehatan.\r\n\r\nMeskipun kopi 50ribu kita anggap worth dengan 2 tulisan baru dan 5 task resolved, namun apakah efek yang ada di dalam kopi tersebut worth terhadap diri lo? Misal, efek kafein, gula, dsb.\r\n\r\n**Percuma** ㅡ sengaja gue tekankan.\r\n\r\nMisal apa yang kita hasilkan tersebut menyebabkan hal lain ㅡ jatuh sakit misalnya.\r\nSejujurnya gue tidak terlalu peduli dengan masalah kesehatan, ingat, tidak terlalu bukan berarti tidak ya.\r\n\r\nSetiap hari gue berurusan dengan hal tidak sehat, baik langsung seperti merokok ataupun tidak lamgsung terserah lo mau namain apa.\r\nJadi, untuk apa membicarakan buruknya neraka jika kita sedang tinggal di dalamnya?\r\n\r\nKalau lo hidup sehat _by design_, faktor kesehatan mungkin harus dipertimbangkan untuk hari ini atau untuk hari yang akan datang.\r\nApalah aku yang tidak sehat ini ya, meskipun selalu bermimpi untuk hidup sehat.\r\n\r\n## Terukur\r\n\r\nHal terakhir yang ingin gue bahas adalah terukur.\r\nKalau gue bisa mengukur apakah layak ~50ribu something + duduk berjam-jam di warkop per hari dengan apa yang gue hasilnkan, harusnya gue bisa mengukur hal lain juga; pengeluaran tiap bulan untuk itu, misalnya.\r\n\r\nGue menggunakan metode _zero-budget_ yang mana pemasukan + pengeluaran sama dengan nol.\r\nPengeluaran ini banyak macamnya; nabung dan investasi pun termasuk pengeluaran.\r\n\r\nPemasukan juga banyak macamnya, tapi di sini gue ambil dari gaji utama gue.\r\nPengeluaran pun mostly ke perilaku konsumtif pangan, entertainment dan self improvement.\r\nGue sekarang sejujurnya belum ada rencana buat melakukan investasi, karena gue rasa dan yakin investasi yang worth untuk gue saat ini yaitu investasi ke diri sendiri (self improvement).\r\n";
				}
				function compiledContent$3() {
					return html$3;
				}
				function getHeadings$3() {
					return [{"depth":2,"slug":"cashback","text":"Cashback…"},{"depth":2,"slug":"health","text":"Health?"},{"depth":2,"slug":"terukur","text":"Terukur"}];
				}
				function getHeaders$3() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$3();
				}				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$3 });
					return contentFragment;
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$3,
	file: file$3,
	url: url$3,
	rawContent: rawContent$3,
	compiledContent: compiledContent$3,
	getHeadings: getHeadings$3,
	getHeaders: getHeaders$3,
	Content: Content$3,
	default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "<p>Ditahun 2018, sesuatu yang disebut “transformasi digital” sedang naik daun, dari proses digitasi sampai digitalisasi. Masyarakat dari berbagai lapisan berlomba untuk menerapkan teknologi di berbagai aspek, berkat era informasi ini pada pertengahan abad 21 ini.</p>\n<p>Penggunaan personal komputer (PC) sudah relatif banyak namun satu hal yang membuat gelembung ini besar adalah satu: internet. Internet salah satunya dapat menghubungkan penjual emping yang misal berada di Banjarnegara dengan pembeli yang berada di Sragen.</p>\n<p>Internet memungkinan sesuatu yang sebelumnya tidak mungkin karena terdapat bingkai pemisah yang bernama geografis.</p>\n<p>Jika internet diibaratkan sebuah pulau, alamat IP berarti sebuah tanah kosong. Bangunannya adalah sesuatu yang disebut dengan situs, dan tidak jarang satu bangunan dihuni oleh banyak… penghuni.</p>\n<p>Setiap bangunan memiliki rancangan yang berbeda-beda, tergantung si <em>arsitek</em>. Pada sekitaran tahun 2018, kebanyakan bangunan tersebut memiliki rancangan yang sama: dibangun menggunakan sesuatu bernama HTML, CSS, JavaScript, PHP, dan basis data rasional yang kemungkinan besar MySQL. Dan jenis bangunan tersebut ada dua: statis dan dinamis. Perbedaan utamanya pada dasarnya hanyalah sumber data yang diambil untuk menampilkan sebuah halaman situs: apakah langsung dari kode, atau diambil dari sebuah penyimpanan data.</p>\n<p>Umumnya, jika jenis situs yang ingin dibuat berjenis aplikasi, situs tersebut kemungkinan besar bersifat dinamis karena adanya interaksi yang dilakukan oleh pengguna dan aplikasi harus bisa menangani interaksi tersebut. Misal, bila aplikasi tersebut memiliki sistem “autentikasi” untuk dapat mengenali siapa pengguna X dengan tanda pengenal Y di aplikasi tersebut, maka si aplikasi harus menyimpan data Y tersebut.</p>\n<p>Data tersebut secara teknis bisa disimpan dimana saja, namun yang paling umum adalah di penyimpanan data yang persisten sehingga aplikasi tidak kehilangan data yang sudah dimasukkan sebelumnya oleh si pengguna ketika misalnya aplikasi tersebut mati.</p>\n<p>Penyimpanan data yang persisten tersebut biasa disebut dengan basis data atau database. Tidak banyak pilihan database yang bisa digunakan pada kala itu, namun yang paling populer penggunaannya adalah basis data rasional yang salah satunya adalah <a href=\"https://mariadb.org/about\">MySQL</a>.</p>\n<p>Karena MySQL juga pada dasarnya adalah sebuah aplikasi, cara agar membuat aplikasi kita bisa berkomunikasi dengan aplikasi lain adalah melalui sesuatu yang disebut dengan <a href=\"https://en.wikipedia.org/wiki/API\"><em>Application Programming Interface</em></a> (API). <em>API</em> biasa memiliki berbagai lapisan tergantung seberapa banyak detail yang ingin disembunyikan atau yang biasa disebut dengan abstraksi.</p>\n<p>Dulu gue pernah ingin menjadi seorang “Fullstack Engineer” dan pekerjaan di Front-End kurang lebih adalah melakukan slicing yang sederhananya adalah tentang mengubah berkas PSD ke HTML, berbeda dengan sekarang yang sepertinya harus mengetahui semua lapisan yang ada di OSI model.</p>\n<p>Just kidding.</p>\n<p>Di bagian back-end, mereka besar kemungkinan bertanggung jawab akan <em>business/domain logic</em> yang sederhananya “mengkodekan” aturan bisnis dunia nyata yang menentukan bagaimana data dapat dibuat, disimpan, dan diubah.</p>\n<p>Jika ada kesalahan “logic” yang menyebabkan bisnis rugi 10 milyar karena kegagalan ataupun kesalahan dalam penyimpanan data ke basis data, tidak perlu berpikir lama siapa yang harus disalahkan.</p>\n<p>Sekarang kita fokus ke bagian teknis.</p>\n<p>Basis data disebut “rasional” salah satunya adalah karena data dipresentasikan dalam bentuk tabel yang mana terdiri dari baris dan kolom. Sistem dari basis data yang rasional ini disebut dengan <em>Relational Database Management System</em> (RDBMS) yang maksudnya, bila basis data tersebut menggunakan RDBMS, cara untuk berinteraksi dengan si database ini menggunakan sesuatu bernama <em>Structured Query Language</em> (SQL).</p>\n<p>Kala itu bahasa pemrograman yang gue gunakan adalah PHP: Hypertext Preprocessor. Alasannya? Tuntutan (educational purpose) dan Pasar. Gue kurang mengerti kenapa PHP populer kala itu, yang gue yakin karena alasan ekosistem yang menjadikan pengembang PHP sebagai warga negara kelas satu seperti munculnya Web Hosting khusus untuk Web Server yang bisa menjalankan kode PHP, Content Management System (CMS) yang dibuat menggunakan PHP, dan yang paling penting dukungan PHP terhadap driver MySQL secara native.</p>\n<h3 id=\"php--mysql-in-the-nutshell\">PHP + MySQL in the nutshell</h3>\n<p>Untuk membuat aplikasi yang dibuat menggunakan PHP dapat berkomunikasi dengan MySQL, kita perlu menghubungkannya terlebih dahulu, yakni melalui API. PHP menawarkan dua cara (jika gue tidak salah ingat) yakni melalui PDO atau langsung menggunakan <em>driver</em> resmi terkait basis data yang digunakan.</p>\n<p>Mari kita fokus ke penggunaan <em>driver</em> resmi. Dalam penggunaan driver resminya pun terdapat 2 paradigma yang ada: Prosedural dan object-oriented. Karena gue suka ribet, mari kita pilih cara prosedural.</p>\n<p>Untuk menghubungkan aplikasi PHP kita ke basis data MySQL, method dari API yang ada yang bisa kita gunakan adalah <code>mysqli_connect</code> yang umumnya membutuhkan 3 parameter: hostname, username, dan password. Jika parameter hostname ter-definisi, maka komunikasi dengan MySQL harusnya menggunakan TCP daripada via UNIX socket (IPC).</p>\n<p>Kode nya kurang lebih seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Kita akan menggunakan <em>variable</em> <code>$conn</code> tersebut untuk memanggil method lain seperti untuk melakukan <em>query</em> misalnya dengan memanggil <code>mysqli_query</code>. Let’s do it, I guess?</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$database_list </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_query</span><span style=\"color: #C9D1D9\">( $conn, </span><span style=\"color: #A5D6FF\">\"show databases\"</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( $database_list ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $database_list );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Hasilnya jika memiliki 4 database, kurang lebih seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [current_field] </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [field_count] </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [lengths] </span><span style=\"color: #FF7B72\">=></span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [num_rows] </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">4</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [type] </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span></code></pre>\n<p>That’s it.</p>\n<h3 id=\"very-select\">Very SELECT</h3>\n<p>Cara untuk menampilkan data menggunakan SQL adalah menggunakan statement <code>SELECT</code>. Argumen paling penting dari <code>SELECT</code> ini adalah nama table yang ingin diambil dan daftar kolom yang ingin ditampilkan.</p>\n<p>Umumnya kita harus mendefinisikan nama kolom yang ingin diambil karena alasan privasi daripada menggunakan <code>*</code> yang chaotic-evil sehingga menampilkan data lain yang mungkin tidak kita butuhkan dalam konteks tertentu.</p>\n<p>Menggunakan statement <code>SELECT</code> di <code>mysqli_query</code> tidak terlalu sulit, mungkin seperti ini dengan konteks kita ingin mengambil data di kolom <code>email</code> dari table <code>users</code>:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password, $dbname );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$users </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_query</span><span style=\"color: #C9D1D9\">( $conn, </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #FF7B72\">SELECT</span><span style=\"color: #A5D6FF\"> email </span><span style=\"color: #FF7B72\">FROM</span><span style=\"color: #A5D6FF\"> users\"</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #D2A8FF\">mysqli_num_rows</span><span style=\"color: #C9D1D9\">( $users ) </span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\"> ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">while</span><span style=\"color: #C9D1D9\">( $row </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_fetch_assoc</span><span style=\"color: #C9D1D9\">( $users ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $row );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Diatas kita sudah mendefinisikan <code>$dbname</code> dan juga kita memanggil <code>mysqli_num_rows</code> untuk memastikan bahwa ada data yang bisa kita proses dan juga memanggil <code>mysqli_fetch_assoc</code> untuk menyimpan hasil <em>query</em> yang kita lakukan sebagai <em>associative</em> array.</p>\n<p>Hasilnya kurang lebih seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">Array</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [email] =</span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> anggun@acme.inc</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">Array</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [email] =</span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> kiko@enak.tau</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">Array</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [email] =</span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> krido@hey.io </span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span></code></pre>\n<p>Sekarang kita ke bagian yang menarik, bagaimana kita ingin mengambil data untuk user <code>anggun@acme.inc</code> saja? Kita bisa menambahkan <code>WHERE</code> didalam sintaks SQL kita sebelumnya!</p>\n<p>Tapi sedikit lucu jika menggunakan kolom <code>email</code> sebagai kunci utama. Biasanya kolom yang digunakan sebagai kunci utama adalah <code>id</code> dengan tipe data integer agar bisa di <em>auto increment</em> sehingga data yang disimpan bisa dijamin unik.</p>\n<p>Berarti sekarang mari kita ambil data <code>email</code> berdasarkan <code>id</code> dari si <code>users</code> tersebut!</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password, $dbname );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user_id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1337</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_query</span><span style=\"color: #C9D1D9\">( $conn, </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #FF7B72\">SELECT</span><span style=\"color: #A5D6FF\"> email </span><span style=\"color: #FF7B72\">FROM</span><span style=\"color: #A5D6FF\"> users </span><span style=\"color: #FF7B72\">where</span><span style=\"color: #A5D6FF\"> id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #A5D6FF\"> </span><span style=\"color: #C9D1D9\">$user_id</span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #D2A8FF\">mysqli_num_rows</span><span style=\"color: #C9D1D9\">( $user ) </span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\"> ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">while</span><span style=\"color: #C9D1D9\">( $row </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_fetch_assoc</span><span style=\"color: #C9D1D9\">( $user ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $row );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Dan hasilnya kurang lebih seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">Array</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    [email] =</span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> anggun@acme.inc</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">)</span></span></code></pre>\n<p>Very ez. Tapi nilai <code>$user_id</code> diatas masih statis, harusnya dinamis entah diambil dari <code>$_GET</code>, <code>$_POST</code> atau bahkan <code>$_COOKIE</code>.</p>\n<p>Anggap kita ambil dari <em>cookie</em> dengan <em>key</em> bernama <code>user_id</code> karena jika menggunakan <em>query parameter</em> terlalu jelas. Kode nya seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$conn </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_connect</span><span style=\"color: #C9D1D9\">( $hostname, $username, $password, $dbname );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\">$conn ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'connection failed'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">.</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">mysqli_connect_error</span><span style=\"color: #C9D1D9\">() );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #79C0FF\">isset</span><span style=\"color: #C9D1D9\">( $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ] ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'no user_id'</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user_id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ];</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_query</span><span style=\"color: #C9D1D9\">( $conn, </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #FF7B72\">SELECT</span><span style=\"color: #A5D6FF\"> email </span><span style=\"color: #FF7B72\">FROM</span><span style=\"color: #A5D6FF\"> users </span><span style=\"color: #FF7B72\">where</span><span style=\"color: #A5D6FF\"> id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #A5D6FF\"> </span><span style=\"color: #C9D1D9\">$user_id</span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #D2A8FF\">mysqli_num_rows</span><span style=\"color: #C9D1D9\">( $user ) </span><span style=\"color: #FF7B72\">></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\"> ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">while</span><span style=\"color: #C9D1D9\">( $row </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">mysqli_fetch_assoc</span><span style=\"color: #C9D1D9\">( $user ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $row );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">mysqli_close</span><span style=\"color: #C9D1D9\">( $conn );</span></span></code></pre>\n<p>Jika nilai <code>$_COOKIE['user_id']</code> adalah <code>1337</code>, maka hasilnya kurang lebih sama seperti yang sebelumnya.</p>\n<p>Bagaimana bila nilainya adalah <code>1337 or 1 = 1</code>?</p>\n<p>You guessed it right.</p>\n<p>(and yes, $_SESSION and/or JWT exist for a reason — just in case)</p>\n<h3 id=\"abstractions\">Abstractions</h3>\n<p>Meskipun sintaks SQL bersifat deklaratif, jurangnya justru ada di API nya. Ya, PHP memiliki PDO tapi bahasa pemrograman bukan hanya PHP di dunia ini.</p>\n<p>Jika kita melihat cuplikan kode diatas, kita bisa membuat abstraksi seperti untuk:</p>\n<ul>\n<li>membuat koneksi dan menutupnya</li>\n<li>menangani data yang didapat dari input pengguna</li>\n<li>menangani ketika data yang diminta tidak ada</li>\n<li>memberikan ketika data yang diminta ada</li>\n</ul>\n<p>…terlepas bahasa pemrograman ataupun basis data yang digunakan.</p>\n<p>Pseudocode nya mungkin seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$db </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">new</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">DB</span><span style=\"color: #C9D1D9\">( $ENV[ </span><span style=\"color: #A5D6FF\">'DB'</span><span style=\"color: #C9D1D9\"> ] );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #79C0FF\">isset</span><span style=\"color: #C9D1D9\">( $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ] ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'no user_id'</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">select</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #A5D6FF\">'users'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'email'</span><span style=\"color: #C9D1D9\"> ),</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ] )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $user );</span></span></code></pre>\n<p>Yes, kita bisa buat abstraksi lagi untuk terus menutupi aib yang ada di kode kita yang mungkin menjadi seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">if</span><span style=\"color: #C9D1D9\"> ( </span><span style=\"color: #FF7B72\">!</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">isset</span><span style=\"color: #C9D1D9\">( $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ] ) ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">die</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'no user_id'</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">User</span><span style=\"color: #FF7B72\">::</span><span style=\"color: #D2A8FF\">find</span><span style=\"color: #C9D1D9\">( $_COOKIE[ </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> ], </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'email'</span><span style=\"color: #C9D1D9\"> ) );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">print_r</span><span style=\"color: #C9D1D9\">( $user );</span></span></code></pre>\n<p>Dan, ya, mungkin kamu sedikit familiar dengan sintaks diatas.</p>\n<h3 id=\"the-abstraction-dilemma\">The abstraction dilemma</h3>\n<p>Bangun tidur cek Twitter ada unpopular opinion tentang <em>ORMs are often overused</em>. Meskipun gue seringnya cuman tertarik bahas unpopular opinion tentang buna raven, but I can’t stand this one.</p>\n<p>Yes man, ORMs are often overused. We can literally put a very raw SQL queries on something like <code>/sql.php?query=select * from users --because why not</code> dan sanitization berada di level reverse proxy or something ataupun bisa pakai GraphQL biar lebih gaya.</p>\n<p>Tapi sebelum kita julidin ORM, mari kita bahas sedikit apa itu ORM.</p>\n<h3 id=\"object-relational-mapping-orm\">Object-relational Mapping (ORM)</h3>\n<p>ORM singkatnya adalah sebuah teknik untuk melakukan query dan memanipulasi data dari sebuah database menggunakan paradigma berorientasi objek.</p>\n<p>Seperti, untuk memanggil <code>SELECT email FROM users where id = 1337</code> kita bisa hanya dengan memanggil method <code>find</code> dari instance <code>User</code> misalnya seperti <code>User::find( 1337, [ 'email' ] )</code> dan hasilnya terserah ingin kita apa kan.</p>\n<p>Yang membedakan ORM dengan <em>“query builder”</em> pada dasarnya hanyalah level abstraksi alias API yang ditawarkan, seperti mungkin kita bisa menggunakan <code>$db->select( 'users', [ 'email' ], [ 'id' => 1337 ] )</code> yang misalnya karena kita tidak percaya dengan apa yang dilakukan oleh method <code>find</code>. Tapi ORM ada bukan karena tanpa alasan, fitur umum yang dijual oleh ORM salah duanya adalah “association” dan “hooks”.</p>\n<p>Dengan <em>query builder</em> tentu kita bisa melakukan ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">transaction</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\">( $db ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">insert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'addresses'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'address'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Jl. Dipayuda'</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $address_id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">id</span><span style=\"color: #C9D1D9\">();</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">insert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'shipping_address'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'address'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Jl. Mayjend Panjaitan No.69'</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $shipping_address_id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">id</span><span style=\"color: #C9D1D9\">();</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">insert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'users'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #A5D6FF\">'name'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'krido'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #A5D6FF\">'address_id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> $address_id,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">        </span><span style=\"color: #A5D6FF\">'shipping_address_id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> $shipping_address_id</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">commit</span><span style=\"color: #C9D1D9\">();</span></span></code></pre>\n<p>Dengan ORM, mungkin bisa seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #79C0FF\">DB</span><span style=\"color: #FF7B72\">::</span><span style=\"color: #D2A8FF\">transaction</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\">() {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $address </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">new</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Address</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'address'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Jl. Dipayuda'</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $shipping_address </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">new</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">ShippingAddress</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'address'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #A5D6FF\">'Jl. Mayjend Panjaitan No.69'</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $user </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">User</span><span style=\"color: #FF7B72\">::</span><span style=\"color: #D2A8FF\">find</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #79C0FF\">69</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $user</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">address</span><span style=\"color: #C9D1D9\">()</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">save</span><span style=\"color: #C9D1D9\">( $address );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $user</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">shipping_address</span><span style=\"color: #C9D1D9\">()</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">save</span><span style=\"color: #C9D1D9\">( $shipping_address );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">} );</span></span></code></pre>\n<p>Atau contoh hooks, dengan query builder mungkin kita bisa saja melakukan seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">transaction</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\">( $db ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">delete</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'users'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1337</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">delete</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #A5D6FF\">'logs'</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">      </span><span style=\"color: #79C0FF\">array</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #A5D6FF\">'user_id'</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">=></span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">1337</span><span style=\"color: #C9D1D9\"> )</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  }</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">$db</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">commit</span><span style=\"color: #C9D1D9\">();</span></span></code></pre>\n<p>Dengan ORM, mungkin bisa seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">self::</span><span style=\"color: #D2A8FF\">deleting</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\">( $user ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $user</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">logs</span><span style=\"color: #C9D1D9\">()</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">each</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> ( $log ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">    $log</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">delete</span><span style=\"color: #C9D1D9\">();</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  } );</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">} );</span></span></code></pre>\n<p>Ya mungkin tidak sesederhana diatas, tapi semoga mendapat gambarannya.</p>\n<h3 id=\"testing\">Testing</h3>\n<p>Misal ada kasus: <em>Ambil data artikel yang memiliki id 10</em>, bagaimana kita menulis test untuk skenario diatas?</p>\n<p>Kita pasti harus mengsimulasikan basis data yang ada karena tidak mungkin bila menggunakan basis data beneran. Berdasarkan contoh diatas, untuk menandakan bahwa artikel yang diambil adalah yang memiliki id 10 dan bukan 6969, misal pseudocode nya seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">function</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #D2A8FF\">get_article_by_id</span><span style=\"color: #C9D1D9\">( $article_id ) {</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #8B949E\">// ... query to db</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #FF7B72\">return</span><span style=\"color: #C9D1D9\"> $article;</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span></code></pre>\n<p>Dengan query builder, kemungkinan besar untuk mengetahui apakah yang kita query tersebut “benar” adalah dengan melakukan pencocokan dengan raw query nya, misalnya seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$query </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> $article</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #D2A8FF\">get_article_by_id</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #79C0FF\">10</span><span style=\"color: #C9D1D9\"> )</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #C9D1D9\">queryString;</span></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">assert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $query,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #A5D6FF\">\"</span><span style=\"color: #FF7B72\">SELECT</span><span style=\"color: #A5D6FF\"> id, title, content </span><span style=\"color: #FF7B72\">FROM</span><span style=\"color: #A5D6FF\"> articles </span><span style=\"color: #FF7B72\">WHERE</span><span style=\"color: #A5D6FF\"> id </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #A5D6FF\"> </span><span style=\"color: #79C0FF\">10</span><span style=\"color: #A5D6FF\">\"</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span></code></pre>\n<p>Dengan ORM, kita bisa melakukannya misal seperti ini:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">$article </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">Article</span><span style=\"color: #FF7B72\">::</span><span style=\"color: #D2A8FF\">find</span><span style=\"color: #C9D1D9\">( </span><span style=\"color: #79C0FF\">10</span><span style=\"color: #C9D1D9\"> );</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #79C0FF\">assert</span><span style=\"color: #C9D1D9\">(</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  $article</span><span style=\"color: #FF7B72\">-></span><span style=\"color: #C9D1D9\">id,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #79C0FF\">10</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">);</span></span></code></pre>\n<p>Karena dengan ORM kita bisa melakukan seeding data dengan mudah dan hal yang perlu kita gunakan untuk berinteraksi dengan basis data adalah sesuatu bernama “model”.</p>\n<h3 id=\"the-abstraction-dilemma-dilemma\">‘The abstraction dilemma’ dilemma</h3>\n<p>Sekarang begini, pada akhirnya, kita—sebagai pengembang—pun akan membuat abstraksi.</p>\n<p>Ingin support driver berbeda agar ketika menggunakan SQLite dan MySQL bisa menggunakan API yang sama di aplikasi kita? Cute, maybe let’s write our own driver compatibility layer.</p>\n<p>Ingin mengatur connection pooling terhadap database yang kita gunakan? Sweet, let’s write one too!</p>\n<p>What if we want to use MVC but still want to say fuck you to ORM? Writing models is cheap, let’s write our own FactoryModel base class!</p>\n<p>Also, input sanitization.</p>\n<p>And parameter interpolation might sound sexy too!</p>\n<p>Gue mendingan nulis library gue sendiri (dan nulis test + dokumentasi + maintain + fix bug + rilis + update deps) daripada harus menarik barang random dari internet yang berukuran 291kB hanya untuk sesuatu bernama ORM ini (plus harus mengingat API yang ada di docs yang enggak banget buat level gue).</p>\n<p>And, damn, ORM (and MVC pattern) is so over-engineering. Apa susahnya coba pas pengguna klik tombol login, kirim <code>SELECT email, password FROM users WHERE email = (email_input) and password = bcrypt(sha256(md5((password_input))), (very_salt))</code> mungkin di payload POST, proses whatever yang didapat dari response backend, and that’s that.</p>\n<p>Data pengguna yang ada di basis data kita kan milik pengguna juga, dengan bantuan “row-level security” mungkin harusnya oke oke aja klo interface yang digunakan user adalah SQL editor (atau bisa stream SQL query via netcat or something).</p>\n<p>Dan hey, sekarang 2022 dan RDBMS itu terlalu kuno. Kita punya firebase, supabase, fauna, mongodb, couchdb, anything yang mana memiliki nice API dan very serverless.</p>\n<p>Oh, kita juga ada Ethereum Blockchain sekarang.</p>\n<p>Pengetahuan tentang ORM lo akan kadaluarsa karena web3 is the future, database scaling for internet-scale is hard (good luck in using vitess &#x26; cockroachdb) and the future is now.</p>\n<h3 id=\"penutup\">Penutup</h3>\n<p>Gue mengerti maksud dan tujuan menghindari ORM adalah untuk menghindari overhead (yang mungkin tidak seberapa) dan yang paling penting agar siapapun ingin melihat ke lower-level view dengan menulis sintaks raw SQL agar siapaun tahu apa yang dia lakukan mungkin untuk mencegah “script kiddies problem”.</p>\n<p>Dan, ya, ORM is overused. Hampir setiap framework dari mirco sampai macro pasti menawarkan ORM sekalipun mungkin kita tidak membutuhkannya.</p>\n<p>Dari pengalaman gue yang pernah menulis raw SQL query, menggunakan query builder, sampai ke penggunaan ORM, yang paling cocok dengan gue adalah tidak berinteraksi dengan basis data sama sekali.</p>\n<p>That’s why I’m here, as a Frontend Engineer.</p>\n<p>Just kidding.</p>\n<p>JIKA GUE HANYA MEMENTINGKAN EGO, GUE LEBIH SUKA QUERY BUILDER. JARI GUE PEGEL HARUS NAHAN SHIFT TIAP KALI NGETIK SELECT, FROM, ORDER BY, WHERE, JOIN, BLABLABLA SEKALIPUN TIDAK WAJIB DITULIS DENGAN FORMAT UPPERCASE (SEPERTI YANG ADA DI BAGIAN LIMITATIONS DI MIT LICENSE) SEPERTI INI DAN JUGA GUE MALES BUKA DOKUMENTASI BUAT MENGINGAT API APA AJA YANG BISA DIGUNAKAN DI ORM YANG GUE GUNAKAN.</p>\n<p>TAPI MENULIS KODE (ATAU LEBIH SPESIFIKNYA MENGEMBANGKAN APLIKASI) ADALAH SEBUAH KERJA SAMA TIM. KITA TIDAK BISA MEMAKSA ORANG LAIN UNTUK MENYESUAIKAN DENGAN SELERA KITA APALAGI SAMPAI MENJADI BAGIAN DARI “ENGINEERING CULTURE” HANYA KARENA GUE LEAD DI ORGANISASI TERSEBUT, MISALNYA.</p>\n<p>GUE SEDANG TIDAK TERIAK BY THE WAY.</p>\n<p>SEBAGAI PENUTUP, UNTUK PERTANYAAN TO ORM OR NOT TO, JAWABANNYA ADALAH ✨TERGANTUNG✨.</p>\n<p>SEKIAN.</p>";

				const frontmatter$2 = {"pubDate":"November 3 2022","title":"ORM: The Abstraction Dilemma","description":"And, damn, ORM (and MVC pattern) is so over-engineering","excerpt":"And, damn, ORM (and MVC pattern) is so over-engineering","image":"~/assets/images/orm.png","tags":["software engineering"]};
				const file$2 = "E:/yuxxeun/yuxxeun/honeypod/data/blog/orm.md";
				const url$2 = undefined;
				function rawContent$2() {
					return "\r\nDitahun 2018, sesuatu yang disebut \"transformasi digital\" sedang naik daun, dari proses digitasi sampai digitalisasi. Masyarakat dari berbagai lapisan berlomba untuk menerapkan teknologi di berbagai aspek, berkat era informasi ini pada pertengahan abad 21 ini.\r\n\r\nPenggunaan personal komputer (PC) sudah relatif banyak namun satu hal yang membuat gelembung ini besar adalah satu: internet. Internet salah satunya dapat menghubungkan penjual emping yang misal berada di Banjarnegara dengan pembeli yang berada di Sragen.\r\n\r\nInternet memungkinan sesuatu yang sebelumnya tidak mungkin karena terdapat bingkai pemisah yang bernama geografis.\r\n\r\nJika internet diibaratkan sebuah pulau, alamat IP berarti sebuah tanah kosong. Bangunannya adalah sesuatu yang disebut dengan situs, dan tidak jarang satu bangunan dihuni oleh banyak... penghuni.\r\n\r\nSetiap bangunan memiliki rancangan yang berbeda-beda, tergantung si *arsitek*. Pada sekitaran tahun 2018, kebanyakan bangunan tersebut memiliki rancangan yang sama: dibangun menggunakan sesuatu bernama HTML, CSS, JavaScript, PHP, dan basis data rasional yang kemungkinan besar MySQL. Dan jenis bangunan tersebut ada dua: statis dan dinamis. Perbedaan utamanya pada dasarnya hanyalah sumber data yang diambil untuk menampilkan sebuah halaman situs: apakah langsung dari kode, atau diambil dari sebuah penyimpanan data.\r\n\r\nUmumnya, jika jenis situs yang ingin dibuat berjenis aplikasi, situs tersebut kemungkinan besar bersifat dinamis karena adanya interaksi yang dilakukan oleh pengguna dan aplikasi harus bisa menangani interaksi tersebut. Misal, bila aplikasi tersebut memiliki sistem \"autentikasi\" untuk dapat mengenali siapa pengguna X dengan tanda pengenal Y di aplikasi tersebut, maka si aplikasi harus menyimpan data Y tersebut.\r\n\r\nData tersebut secara teknis bisa disimpan dimana saja, namun yang paling umum adalah di penyimpanan data yang persisten sehingga aplikasi tidak kehilangan data yang sudah dimasukkan sebelumnya oleh si pengguna ketika misalnya aplikasi tersebut mati.\r\n\r\nPenyimpanan data yang persisten tersebut biasa disebut dengan basis data atau database. Tidak banyak pilihan database yang bisa digunakan pada kala itu, namun yang paling populer penggunaannya adalah basis data rasional yang salah satunya adalah [MySQL](https://mariadb.org/about).\r\n\r\nKarena MySQL juga pada dasarnya adalah sebuah aplikasi, cara agar membuat aplikasi kita bisa berkomunikasi dengan aplikasi lain adalah melalui sesuatu yang disebut dengan [*Application Programming Interface*](https://en.wikipedia.org/wiki/API) (API). *API* biasa memiliki berbagai lapisan tergantung seberapa banyak detail yang ingin disembunyikan atau yang biasa disebut dengan abstraksi.\r\n\r\nDulu gue pernah ingin menjadi seorang \"Fullstack Engineer\" dan pekerjaan di Front-End kurang lebih adalah melakukan slicing yang sederhananya adalah tentang mengubah berkas PSD ke HTML, berbeda dengan sekarang yang sepertinya harus mengetahui semua lapisan yang ada di OSI model.\r\n\r\nJust kidding.\r\n\r\nDi bagian back-end, mereka besar kemungkinan bertanggung jawab akan *business/domain logic* yang sederhananya \"mengkodekan\" aturan bisnis dunia nyata yang menentukan bagaimana data dapat dibuat, disimpan, dan diubah.\r\n\r\nJika ada kesalahan \"logic\" yang menyebabkan bisnis rugi 10 milyar karena kegagalan ataupun kesalahan dalam penyimpanan data ke basis data, tidak perlu berpikir lama siapa yang harus disalahkan.\r\n\r\nSekarang kita fokus ke bagian teknis.\r\n\r\nBasis data disebut \"rasional\" salah satunya adalah karena data dipresentasikan dalam bentuk tabel yang mana terdiri dari baris dan kolom. Sistem dari basis data yang rasional ini disebut dengan *Relational Database Management System* (RDBMS) yang maksudnya, bila basis data tersebut menggunakan RDBMS, cara untuk berinteraksi dengan si database ini menggunakan sesuatu bernama *Structured Query Language* (SQL).\r\n\r\n\r\nKala itu bahasa pemrograman yang gue gunakan adalah PHP: Hypertext Preprocessor. Alasannya? Tuntutan (educational purpose) dan Pasar. Gue kurang mengerti kenapa PHP populer kala itu, yang gue yakin karena alasan ekosistem yang menjadikan pengembang PHP sebagai warga negara kelas satu seperti munculnya Web Hosting khusus untuk Web Server yang bisa menjalankan kode PHP, Content Management System (CMS) yang dibuat menggunakan PHP, dan yang paling penting dukungan PHP terhadap driver MySQL secara native.\r\n\r\n### PHP + MySQL in the nutshell\r\n\r\nUntuk membuat aplikasi yang dibuat menggunakan PHP dapat berkomunikasi dengan MySQL, kita perlu menghubungkannya terlebih dahulu, yakni melalui API. PHP menawarkan dua cara (jika gue tidak salah ingat) yakni melalui PDO atau langsung menggunakan *driver* resmi terkait basis data yang digunakan.\r\n\r\nMari kita fokus ke penggunaan *driver* resmi. Dalam penggunaan driver resminya pun terdapat 2 paradigma yang ada: Prosedural dan object-oriented. Karena gue suka ribet, mari kita pilih cara prosedural.\r\n\r\nUntuk menghubungkan aplikasi PHP kita ke basis data MySQL, method dari API yang ada yang bisa kita gunakan adalah `mysqli_connect` yang umumnya membutuhkan 3 parameter: hostname, username, dan password. Jika parameter hostname ter-definisi, maka komunikasi dengan MySQL harusnya menggunakan TCP daripada via UNIX socket (IPC).\r\n\r\nKode nya kurang lebih seperti ini:\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nKita akan menggunakan *variable* `$conn` tersebut untuk memanggil method lain seperti untuk melakukan *query* misalnya dengan memanggil `mysqli_query`. Let's do it, I guess?\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\n$database_list = mysqli_query( $conn, \"show databases\" );\r\n\r\nif ( $database_list ) {\r\n  print_r( $database_list );\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nHasilnya jika memiliki 4 database, kurang lebih seperti ini:\r\n\r\n```sql\r\n(\r\n    [current_field] => 0\r\n    [field_count] => 1\r\n    [lengths] =>\r\n    [num_rows] => 4\r\n    [type] => 0\r\n)\r\n```\r\n\r\nThat's it.\r\n\r\n### Very SELECT\r\n\r\nCara untuk menampilkan data menggunakan SQL adalah menggunakan statement `SELECT`. Argumen paling penting dari `SELECT` ini adalah nama table yang ingin diambil dan daftar kolom yang ingin ditampilkan.\r\n\r\nUmumnya kita harus mendefinisikan nama kolom yang ingin diambil karena alasan privasi daripada menggunakan `*` yang chaotic-evil sehingga menampilkan data lain yang mungkin tidak kita butuhkan dalam konteks tertentu.\r\n\r\nMenggunakan statement `SELECT` di `mysqli_query` tidak terlalu sulit, mungkin seperti ini dengan konteks kita ingin mengambil data di kolom `email` dari table `users`:\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password, $dbname );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\n$users = mysqli_query( $conn, \"SELECT email FROM users\" );\r\n\r\nif ( mysqli_num_rows( $users ) > 0 ) {\r\n  while( $row = mysqli_fetch_assoc( $users ) ) {\r\n    print_r( $row );\r\n  }\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nDiatas kita sudah mendefinisikan `$dbname` dan juga kita memanggil `mysqli_num_rows` untuk memastikan bahwa ada data yang bisa kita proses dan juga memanggil `mysqli_fetch_assoc` untuk menyimpan hasil *query* yang kita lakukan sebagai *associative* array.\r\n\r\nHasilnya kurang lebih seperti ini:\r\n\r\n```shell\r\nArray\r\n(\r\n    [email] => anggun@acme.inc\r\n)\r\nArray\r\n(\r\n    [email] => kiko@enak.tau\r\n)\r\nArray\r\n(\r\n    [email] => krido@hey.io \r\n)\r\n```\r\n\r\nSekarang kita ke bagian yang menarik, bagaimana kita ingin mengambil data untuk user `anggun@acme.inc` saja? Kita bisa menambahkan `WHERE` didalam sintaks SQL kita sebelumnya!\r\n\r\nTapi sedikit lucu jika menggunakan kolom `email` sebagai kunci utama. Biasanya kolom yang digunakan sebagai kunci utama adalah `id` dengan tipe data integer agar bisa di *auto increment* sehingga data yang disimpan bisa dijamin unik.\r\n\r\nBerarti sekarang mari kita ambil data `email` berdasarkan `id` dari si `users` tersebut!\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password, $dbname );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\n$user_id = 1337;\r\n$user = mysqli_query( $conn, \"SELECT email FROM users where id = $user_id\" );\r\n\r\nif ( mysqli_num_rows( $user ) > 0 ) {\r\n  while( $row = mysqli_fetch_assoc( $user ) ) {\r\n    print_r( $row );\r\n  }\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nDan hasilnya kurang lebih seperti ini:\r\n\r\n```shell\r\nArray\r\n(\r\n    [email] => anggun@acme.inc\r\n)\r\n```\r\n\r\nVery ez. Tapi nilai `$user_id` diatas masih statis, harusnya dinamis entah diambil dari `$_GET`, `$_POST` atau bahkan `$_COOKIE`.\r\n\r\nAnggap kita ambil dari *cookie* dengan *key* bernama `user_id` karena jika menggunakan *query parameter* terlalu jelas. Kode nya seperti ini:\r\n\r\n```php\r\n$conn = mysqli_connect( $hostname, $username, $password, $dbname );\r\n\r\nif ( !$conn ) {\r\n  die( 'connection failed' . mysqli_connect_error() );\r\n}\r\n\r\nif ( !isset( $_COOKIE[ 'user_id' ] ) ) {\r\n  die( 'no user_id' );\r\n}\r\n\r\n$user_id = $_COOKIE[ 'user_id' ];\r\n$user = mysqli_query( $conn, \"SELECT email FROM users where id = $user_id\" );\r\n\r\nif ( mysqli_num_rows( $user ) > 0 ) {\r\n  while( $row = mysqli_fetch_assoc( $user ) ) {\r\n    print_r( $row );\r\n  }\r\n}\r\n\r\nmysqli_close( $conn );\r\n```\r\n\r\nJika nilai `$_COOKIE['user_id']` adalah `1337`, maka hasilnya kurang lebih sama seperti yang sebelumnya.\r\n\r\nBagaimana bila nilainya adalah `1337 or 1 = 1`?\r\n\r\nYou guessed it right.\r\n\r\n(and yes, $_SESSION and/or JWT exist for a reason — just in case)\r\n\r\n### Abstractions\r\n\r\nMeskipun sintaks SQL bersifat deklaratif, jurangnya justru ada di API nya. Ya, PHP memiliki PDO tapi bahasa pemrograman bukan hanya PHP di dunia ini.\r\n\r\nJika kita melihat cuplikan kode diatas, kita bisa membuat abstraksi seperti untuk:\r\n\r\n- membuat koneksi dan menutupnya\r\n- menangani data yang didapat dari input pengguna\r\n- menangani ketika data yang diminta tidak ada\r\n- memberikan ketika data yang diminta ada\r\n\r\n...terlepas bahasa pemrograman ataupun basis data yang digunakan.\r\n\r\nPseudocode nya mungkin seperti ini:\r\n\r\n```php\r\n$db = new DB( $ENV[ 'DB' ] );\r\n\r\nif ( !isset( $_COOKIE[ 'user_id' ] ) ) {\r\n  die( 'no user_id' );\r\n}\r\n\r\n$user = $db->select(\r\n  'users',\r\n  array( 'email' ),\r\n  array( 'id' => $_COOKIE[ 'user_id' ] )\r\n);\r\n\r\nprint_r( $user );\r\n```\r\n\r\nYes, kita bisa buat abstraksi lagi untuk terus menutupi aib yang ada di kode kita yang mungkin menjadi seperti ini:\r\n\r\n```php\r\nif ( ! isset( $_COOKIE[ 'user_id' ] ) ) {\r\n  die( 'no user_id' );\r\n}\r\n\r\n$user = User::find( $_COOKIE[ 'user_id' ], array( 'email' ) );\r\n\r\nprint_r( $user );\r\n```\r\n\r\nDan, ya, mungkin kamu sedikit familiar dengan sintaks diatas.\r\n\r\n### The abstraction dilemma\r\n\r\nBangun tidur cek Twitter ada unpopular opinion tentang *ORMs are often overused*. Meskipun gue seringnya cuman tertarik bahas unpopular opinion tentang buna raven, but I can't stand this one.\r\n\r\nYes man, ORMs are often overused. We can literally put a very raw SQL queries on something like `/sql.php?query=select * from users --because why not` dan sanitization berada di level reverse proxy or something ataupun bisa pakai GraphQL biar lebih gaya.\r\n\r\nTapi sebelum kita julidin ORM, mari kita bahas sedikit apa itu ORM.\r\n\r\n### Object-relational Mapping (ORM)\r\n\r\nORM singkatnya adalah sebuah teknik untuk melakukan query dan memanipulasi data dari sebuah database menggunakan paradigma berorientasi objek.\r\n\r\nSeperti, untuk memanggil `SELECT email FROM users where id = 1337` kita bisa hanya dengan memanggil method `find` dari instance `User` misalnya seperti `User::find( 1337, [ 'email' ] )` dan hasilnya terserah ingin kita apa kan.\r\n\r\nYang membedakan ORM dengan *\"query builder\"* pada dasarnya hanyalah level abstraksi alias API yang ditawarkan, seperti mungkin kita bisa menggunakan `$db->select( 'users', [ 'email' ], [ 'id' => 1337 ] )` yang misalnya karena kita tidak percaya dengan apa yang dilakukan oleh method `find`. Tapi ORM ada bukan karena tanpa alasan, fitur umum yang dijual oleh ORM salah duanya adalah \"association\" dan \"hooks\".\r\n\r\nDengan *query builder* tentu kita bisa melakukan ini:\r\n\r\n```php\r\n$db->transaction(\r\n  function( $db ) {\r\n    $db->insert(\r\n      'addresses',\r\n      array( 'address' => 'Jl. Dipayuda' )\r\n    );\r\n\r\n    $address_id = $db->id();\r\n\r\n    $db->insert(\r\n      'shipping_address',\r\n      array( 'address' => 'Jl. Mayjend Panjaitan No.69' )\r\n    );\r\n\r\n    $shipping_address_id = $db->id();\r\n\r\n    $db->insert(\r\n      'users',\r\n      array(\r\n        'name' => 'krido',\r\n        'address_id' => $address_id,\r\n        'shipping_address_id' => $shipping_address_id\r\n      )\r\n    );\r\n  }\r\n);\r\n\r\n$db->commit();\r\n```\r\n\r\nDengan ORM, mungkin bisa seperti ini:\r\n\r\n```php\r\nDB::transaction( function() {\r\n  $address = new Address(\r\n    array( 'address' => 'Jl. Dipayuda' )\r\n  );\r\n\r\n  $shipping_address = new ShippingAddress(\r\n    array( 'address' => 'Jl. Mayjend Panjaitan No.69' )\r\n  );\r\n\r\n  $user = User::find( 69 );\r\n\r\n  $user->address()->save( $address );\r\n  $user->shipping_address()->save( $shipping_address );\r\n} );\r\n```\r\n\r\nAtau contoh hooks, dengan query builder mungkin kita bisa saja melakukan seperti ini:\r\n\r\n```php\r\n$db->transaction(\r\n  function( $db ) {\r\n    $db->delete(\r\n      'users',\r\n      array( 'user_id' => 1337 )\r\n    );\r\n\r\n    $db->delete(\r\n      'logs',\r\n      array( 'user_id' => 1337 )\r\n    );\r\n  }\r\n);\r\n\r\n$db->commit();\r\n```\r\n\r\nDengan ORM, mungkin bisa seperti ini:\r\n\r\n```php\r\nself::deleting( function( $user ) {\r\n  $user->logs()->each( function ( $log ) {\r\n    $log->delete();\r\n  } );\r\n} );\r\n```\r\n\r\nYa mungkin tidak sesederhana diatas, tapi semoga mendapat gambarannya.\r\n\r\n### Testing\r\n\r\nMisal ada kasus: *Ambil data artikel yang memiliki id 10*, bagaimana kita menulis test untuk skenario diatas?\r\n\r\nKita pasti harus mengsimulasikan basis data yang ada karena tidak mungkin bila menggunakan basis data beneran. Berdasarkan contoh diatas, untuk menandakan bahwa artikel yang diambil adalah yang memiliki id 10 dan bukan 6969, misal pseudocode nya seperti ini:\r\n\r\n```php\r\nfunction get_article_by_id( $article_id ) {\r\n  // ... query to db\r\n  return $article;\r\n}\r\n```\r\n\r\nDengan query builder, kemungkinan besar untuk mengetahui apakah yang kita query tersebut \"benar\" adalah dengan melakukan pencocokan dengan raw query nya, misalnya seperti ini:\r\n\r\n```php\r\n$query = $article->get_article_by_id( 10 )->queryString;\r\nassert(\r\n  $query,\r\n  \"SELECT id, title, content FROM articles WHERE id = 10\"\r\n);\r\n```\r\n\r\nDengan ORM, kita bisa melakukannya misal seperti ini:\r\n\r\n```php\r\n$article = Article::find( 10 );\r\n\r\nassert(\r\n  $article->id,\r\n  10\r\n);\r\n```\r\n\r\nKarena dengan ORM kita bisa melakukan seeding data dengan mudah dan hal yang perlu kita gunakan untuk berinteraksi dengan basis data adalah sesuatu bernama \"model\".\r\n\r\n### 'The abstraction dilemma' dilemma\r\n\r\nSekarang begini, pada akhirnya, kita—sebagai pengembang—pun akan membuat abstraksi.\r\n\r\nIngin support driver berbeda agar ketika menggunakan SQLite dan MySQL bisa menggunakan API yang sama di aplikasi kita? Cute, maybe let's write our own driver compatibility layer.\r\n\r\nIngin mengatur connection pooling terhadap database yang kita gunakan? Sweet, let's write one too!\r\n\r\nWhat if we want to use MVC but still want to say fuck you to ORM? Writing models is cheap, let's write our own FactoryModel base class!\r\n\r\nAlso, input sanitization.\r\n\r\nAnd parameter interpolation might sound sexy too!\r\n\r\nGue mendingan nulis library gue sendiri (dan nulis test + dokumentasi + maintain + fix bug + rilis + update deps) daripada harus menarik barang random dari internet yang berukuran 291kB hanya untuk sesuatu bernama ORM ini (plus harus mengingat API yang ada di docs yang enggak banget buat level gue).\r\n\r\nAnd, damn, ORM (and MVC pattern) is so over-engineering. Apa susahnya coba pas pengguna klik tombol login, kirim `SELECT email, password FROM users WHERE email = (email_input) and password = bcrypt(sha256(md5((password_input))), (very_salt))` mungkin di payload POST, proses whatever yang didapat dari response backend, and that's that.\r\n\r\nData pengguna yang ada di basis data kita kan milik pengguna juga, dengan bantuan \"row-level security\" mungkin harusnya oke oke aja klo interface yang digunakan user adalah SQL editor (atau bisa stream SQL query via netcat or something).\r\n\r\nDan hey, sekarang 2022 dan RDBMS itu terlalu kuno. Kita punya firebase, supabase, fauna, mongodb, couchdb, anything yang mana memiliki nice API dan very serverless.\r\n\r\nOh, kita juga ada Ethereum Blockchain sekarang.\r\n\r\nPengetahuan tentang ORM lo akan kadaluarsa karena web3 is the future, database scaling for internet-scale is hard (good luck in using vitess & cockroachdb) and the future is now.\r\n\r\n### Penutup\r\n\r\nGue mengerti maksud dan tujuan menghindari ORM adalah untuk menghindari overhead (yang mungkin tidak seberapa) dan yang paling penting agar siapapun ingin melihat ke lower-level view dengan menulis sintaks raw SQL agar siapaun tahu apa yang dia lakukan mungkin untuk mencegah \"script kiddies problem\".\r\n\r\nDan, ya, ORM is overused. Hampir setiap framework dari mirco sampai macro pasti menawarkan ORM sekalipun mungkin kita tidak membutuhkannya.\r\n\r\nDari pengalaman gue yang pernah menulis raw SQL query, menggunakan query builder, sampai ke penggunaan ORM, yang paling cocok dengan gue adalah tidak berinteraksi dengan basis data sama sekali.\r\n\r\nThat's why I'm here, as a Frontend Engineer.\r\n\r\nJust kidding.\r\n\r\nJIKA GUE HANYA MEMENTINGKAN EGO, GUE LEBIH SUKA QUERY BUILDER. JARI GUE PEGEL HARUS NAHAN SHIFT TIAP KALI NGETIK SELECT, FROM, ORDER BY, WHERE, JOIN, BLABLABLA SEKALIPUN TIDAK WAJIB DITULIS DENGAN FORMAT UPPERCASE (SEPERTI YANG ADA DI BAGIAN LIMITATIONS DI MIT LICENSE) SEPERTI INI DAN JUGA GUE MALES BUKA DOKUMENTASI BUAT MENGINGAT API APA AJA YANG BISA DIGUNAKAN DI ORM YANG GUE GUNAKAN.\r\n\r\nTAPI MENULIS KODE (ATAU LEBIH SPESIFIKNYA MENGEMBANGKAN APLIKASI) ADALAH SEBUAH KERJA SAMA TIM. KITA TIDAK BISA MEMAKSA ORANG LAIN UNTUK MENYESUAIKAN DENGAN SELERA KITA APALAGI SAMPAI MENJADI BAGIAN DARI \"ENGINEERING CULTURE\" HANYA KARENA GUE LEAD DI ORGANISASI TERSEBUT, MISALNYA.\r\n\r\nGUE SEDANG TIDAK TERIAK BY THE WAY.\r\n\r\nSEBAGAI PENUTUP, UNTUK PERTANYAAN TO ORM OR NOT TO, JAWABANNYA ADALAH ✨TERGANTUNG✨.\r\n\r\nSEKIAN.\r\n";
				}
				function compiledContent$2() {
					return html$2;
				}
				function getHeadings$2() {
					return [{"depth":3,"slug":"php--mysql-in-the-nutshell","text":"PHP + MySQL in the nutshell"},{"depth":3,"slug":"very-select","text":"Very SELECT"},{"depth":3,"slug":"abstractions","text":"Abstractions"},{"depth":3,"slug":"the-abstraction-dilemma","text":"The abstraction dilemma"},{"depth":3,"slug":"object-relational-mapping-orm","text":"Object-relational Mapping (ORM)"},{"depth":3,"slug":"testing","text":"Testing"},{"depth":3,"slug":"the-abstraction-dilemma-dilemma","text":"‘The abstraction dilemma’ dilemma"},{"depth":3,"slug":"penutup","text":"Penutup"}];
				}
				function getHeaders$2() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$2();
				}				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return contentFragment;
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$2,
	file: file$2,
	url: url$2,
	rawContent: rawContent$2,
	compiledContent: compiledContent$2,
	getHeadings: getHeadings$2,
	getHeaders: getHeaders$2,
	Content: Content$2,
	default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<p>Sometimes all the complicated things begin from the simple one. From a simple hello turned into romantic visions. From a simple meeting turned into a wedding. From a simple swipe right turned into a blowjob or two.</p>\n<p>We may be wondering about everything: How did it all really begin?</p>\n<p>And why?</p>\n<p>We don’t understand and never will. Just that’s how the universe works.</p>\n<p>And then life goes on, for the best or the worst. Sometimes we just feel like a piece is missing in some particular time. It’s like how the brain yearns for nicotine when you used to smoke. Or the blood longs for caffeine when you used to drink coffee. Or maybe the pain in your back when you used to sit in a very comfortable fucking ergonomic chair.</p>\n<p>That’s how addiction works: You feel different when something you’re used to is not there.</p>\n<p>Then you stare at the door. Or maybe at your phone. Wondering to meet the things you used to see or find the voice you used to hear. A simple call or meeting may turn into something complicated, either for the best or the worst. That’s how it all should have started and not how it all ended.</p>\n<p>And the clock is ticking and always will be.</p>\n<p>You just lock the door or place the phone away.</p>\n<p>Then you close your eyes. You call a name quietly hoping they can hear you back or maybe wondering if they’re doing the same.</p>\n<p>“See you when I see you”, you both said.</p>\n<p>Maybe in the next life, or in the next day.</p>\n<p>No farewells or promises.</p>\n<p>Just let the universe work,</p>\n<p>and then the clock keeps ticking.</p>";

				const frontmatter$1 = {"pubDate":"Oct 13 2022","title":"See you when I see you","description":".........","excerpt":".........","image":"~/assets/images/see-you.jpg","tags":["scenario"]};
				const file$1 = "E:/yuxxeun/yuxxeun/honeypod/data/blog/see-you-when-i-see-you.md";
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
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$1();
				}				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return contentFragment;
				}
				Content$1[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$1,
	file: file$1,
	url: url$1,
	rawContent: rawContent$1,
	compiledContent: compiledContent$1,
	getHeadings: getHeadings$1,
	getHeaders: getHeaders$1,
	Content: Content$1,
	default: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<p>Bagian yang paling sulit dalam memulai adalah mengakhiri yang meskipun di beberapa kasus ataupun kondisi terlihat relatif mudah, namun gue rasa tidak untuk dibanyak kasus. Memulai sesuatu adalah seperti berhadapan dengan banyak pintu, disini lo seperti harus memilih pintu mana dulu yang ingin dimasuki dari sekian banyak pintu yang dimiliki.</p>\n<p>Pada akhirnya, hanya satu pintu yang akan dimasuki dalam satu waktu. Dan ketika masuk ke ruangan dibalik pintu tersebut, brengseknya, terdapat banyak jalan keluar yang berbeda-beda.</p>\n<p>Dan ini seperti masuk ke labirin namun memiliki jalan keluar lebih dari satu.</p>\n<p>Lebih brengseknya lagi, terkadang jalan keluar yang dipilih mengarah ke pintu masuk lainnya. Dan yang paling brengsek, tidak ada jalan untuk kembali. Dan yang paling menyebalkan adalah ketika sadar bahwa lo ternyata sudah terkurung dalam labirin tersebut dari pintu yang paling pertama yang lo masuki, yang bahkan lo tidak memiliki kontrol dalam memasuki pintu pertama tersebut.</p>\n<p>Dan tidak ada jalan untuk keluar selain dijemput oleh sesuatu yang tugasnya hanyalah untuk menjemput lo.</p>\n<h2 id=\"iterasi\">Iterasi</h2>\n<p>Yang menarik dari membuat teh adalah sekali teh terbuat, cepat atau lambat ia akan habis. Meskipun proses pembuatan teh bisa terus terulang, pada akhirnya, hasil dari proses tersebut bisa dianggap selesai yang dalam konteks ini adalah ketika teh tersebut habis diminum ataupun dibuang.</p>\n<p>Mengambil contoh lain adalah dalam membuat program, atau aplikasi bila menggunakan bahasa yang umum diketahui. Membuat aplikasi brengseknya bukanlah proses yang sekali jadi lalu selesai meskipun sama-sama untuk dikonsumsi. Google sebagai salah satu mesin pencari yang ada di internet saja berumur sekitar 26 tahun di tahun 2022. Sudah 25 tahun program tersebut ditulis dan dikembangkan sampai hari ini yang mungkin sampai akhir dari internet nanti.</p>\n<p>Tampilan dan performanya selalu berubah dari tahun ke tahun, yang pasti harapannya selalu mengarah ke perubahan yang lebih baik dari yang sebelumnya.</p>\n<p>Yang menjadi pertanyaan adalah “Kapan Google akan berhenti merilis versi baru?”</p>\n<p>Tidak ada yang tahu pastinya, namun dibanyak kasus, jawaban objektifnya adalah “ketika akan memberhentikan operasionalnya”.</p>\n<p>Yang berarti, dia akan berhenti memperbaiki “bug” yang ada ataupun yang akan ada di aplikasi tersebut dan di lain sisi, dia juga akan berhenti membuat sesuatu (yang dalam konteks ini adalah fitur) menjadi lebih baik lagi.</p>\n<h2 id=\"stabilitas\">Stabilitas</h2>\n<p>Mungkin tidak jarang kita mendengar kata “stabil”, dari kata “stabil secara finansial”, “kondisi mental sudah kembali stabil”, “menggunakan versi aplikasi yang stabil”, apapun.</p>\n<p>Jika mengambil arti dari KBBI, arti dari stabil adalah: <em><strong>1. mantap; kukuh; tidak goyah</strong></em> (tentang bangunan, pemerintah, dan sebagainya): situasi politik dalam negeri kita —; <em><strong>2. tetap jalannya; tenang; tidak goyang</strong></em> (tentang kendaraan, kapal, dan sebagainya): setelah barang-barang dibuang ke laut, kapal — kembali; <em><strong>3. tidak berubah-ubah; tetap; tidak naik turun</strong></em> (tentang harga barang, nilai uang, dan sebagainya): harga kopra sekarang mulai —;</p>\n<p>Mari kita ambil kesimpulan bahwa stabil artinya adalah sebuah kondisi yang bersifat netral dan berada di tengah. Tidak cenderung ke A ataupun ke B.</p>\n<p>Pertama, gue ingin mengambil contoh dari rilis aplikasi. Aplikasi dirilis ke versi stabil sederhananya ketika sudah memenuhi tes penerimaan pengguna. Versi tersebut tidak harus sempurna, namun setidaknya pengguna dapat menerima pembaruan dari versi tersebut.</p>\n<p>Dan gue rasa bukan berarti di versi tersebut bebas dari kesalahan, mungkin setidaknya kesalahan tersebut tidak (terlalu) mengganggu pengguna jika memang ada.</p>\n<p>Kedua, gue ingin mengambil contoh dari finansial. Seseorang dikatakan “stabil secara finansial” ketika misalnya seseorang tersebut tidak khawatir membayar tagihan karena seseorang tersebut tahu bahwa dia akan memiliki uang yang cukup.</p>\n<p>Dan gue rasa bukan berarti bila seseorang tersebut misalnya memiliki tagihan, dia dianggap tidak stabil secara finansial.</p>\n<p>Ketiga, gue ingin mengambil contoh dari kesehatan. Seseorang dikatakan “kesehatannya stabil” ketika misalnya seseorang tersebut tidak merasa sakit.</p>\n<p>Dan gue rasa bukan berarti bila seseorang tersebut misalnya tidak memiliki penyakit apapun di tubuhnya.</p>\n<p>Berdasarkan tiga contoh diatas, bisa disimpulkan bahwa kestabilan selalu memiliki tolak ukur dan juga nilainya tidak cenderung ke salah satu ukuran.</p>\n<p>Sejujurnya gue baru tahu tentang adanya konsep “healthy relationship” di dunia ini. Sebelumnya gue tidak tahu bahwa ternyata ada “healthy” dan “unhealthy” dalam sebuah relationship.</p>\n<p>Sebuah hubungan singkatnya dianggap “healthy” ketika suatu hubungan yang dijalani oleh dua pihak tersebut menjadi stabil dan yang mana adalah “kesalingan” sebagai tolak ukurnya.</p>\n<p>Sederhananya, mungkin, bila dua belah pihak tersebut saling percaya; saling berjuang, saling mendukung, saling menjaga kepercayaan, saling mengerti, dan sebagainya, hubungan tersebut mungkin bisa disebut sebagai hubungan yang sehat.</p>\n<p>Pasti ada kondisi ketika “kesalingan” tersebut cenderung ke salah satu pihak, dan PR nya kemungkinan besar adalah bagaimana membuat kondisi tersebut kembali menjadi stabil alias kondisi “kesalingan” tersebut berarti kembali lagi ke yang mungkin tanpa kecenderungan ke salah satu pihak.</p>\n<p>Tapi gue rasa PR tersulitnya bukanlah itu.</p>\n<p>Melainkan di mempertahankan “kestabilan” tersebut selama mungkin dan mengembalikannya kembali ketika sedang tidak.</p>\n<p>Karena bukankah perubahan adalah sesuatu yang tidak dapat dihindari?</p>\n<p>Yang berarti, gue rasa, peran terbesar dari kondisi diatas adalah di “bagaimana menyikapinya”.</p>\n<p>Berhubungan adalah salah satu hal yang tidak bisa dihindari.</p>\n<p>Dari hubungan dengan keluarga, teman, rekan kerja, ataupun orang lain secara umum. Atau dengan kekasih bila memiliki.</p>\n<p>Pasti ada saja hal yang membuat hubungan tersebut… berjalan tidak semestinya.</p>\n<p>Apapun alasannya, penyebab utamanya adalah selalu tentang sesuatu yang disebut dengan ‘kesalahan’.</p>\n<p>Dan pilihannya gue rasa ada dua: mengembalikan keadaan tersebut menjadi seperti semula, atau membiarkannya apa adanya sampai keadaan ‘semula’ tersebut sudah memiliki bentuk berbeda.</p>\n<p>Jika berurusan dengan lebih dari satu pihak, berarti harus ada “kesalingan” dalam sesuatu untuk mencapai sesuatu. Dalam konteks hubungan, mungkin sesuatu tersebut adalah saling maaf dan memaafkan.</p>\n<p>Namun yang paling berat justru di saling “menyetujui” untuk meminta maaf dan memaafkan.</p>\n<p>Dan bagian yang ingin gue soroti adalah: kata “menyetujui” diatas ialah bentuk dari sebuah penyikapan. Dan sayangnya tidak ada kata “keterpaksaan” dari sebuah “kesalingan”.</p>\n<p>Gue kepikiran menulis ini ketika sedang kepikiran tentang konsep “healthy relationship” and for what it’s worth I’m not good on this relationship thing but I learn over time.</p>\n<p>Satu hal yang paling penting dari “kestabilan” gue rasa adalah resilience. Like, it doesn’t really matter how stable or unstable the thing was as long as it could recover.</p>\n<p>Hubungan bukanlah seperti sesuatu yang sudah dibuat lalu selesai. Semoga masih ingat pembahasan tentang teh yang berada peragraf awal sebelumnya. Melainkan hubungan adalah sesuatu yang diharapkan berlangsung selama mungkin, jika memang kata ‘selamanya’ lebih terdengar seperti omong kosong.</p>\n<p>Dan berbicara tentang “kelangsungan” pastinya tidak lepas dengan “proses”.</p>\n<p>Dan mungkin proses tersebut sedang stabil, atau sedang di titik rendah, atau sedang berada di puncak. Terlepas sedang berada di titik mana, sikap yang harus dilakukan untuk sesuatu yang diharapkan berlangsung selama mungkin adalah mempertahankan “kestabilan” tersebut selama mungkin dan mengembalikannya kembali ketika sedang tidak.</p>\n<p>Ya, yang mana adalah PR terberat yang tadi sudah disinggung sebelumnya.</p>\n<p>Sejujurnya gue belum pernah menjalin hubungan seperti konsep healthy relationship ini jika memang tanda-tandanya adalah seperti yang dijabarkan di artikel <a href=\"https://www.idntimes.com/life/relationship/mia-rahmawati/10-tanda-kamu-sudah-berhasil-menjalankan-healthy-relationship-c1c2/\"><em>10 Tanda Kamu Sudah Berhasil Menjalankan Healthy Relationship versi IDN Times</em></a> karena beberapa poinnya pernah ada yang tidak terpenuhi.</p>\n<p>Tapi arti healthy relationship menurut gue sederhana: sebuah hubungan yang terjalin selama mungkin, karena memang dari awal tujuannya adalah untuk itu.</p>\n<p>Ada beragam cara untuk membuatnya tetap healthy, dan ada beragam cara juga untuk membuatnya kembali stabil. Cara yang gue pakai untuk membuat tetap healthy sampai hari ini adalah dengan tidak melakukan sesuatu yang membuat unhealthy, dan cara untuk membuatnya kembali stabil… I don’t know, saling maaf dan memaafkan? Mencari solusi bersama? Glad that I’m not in that state yet, but I’m always ready for anything.</p>\n<p>Anyway my relationship today is pretty stable after long fluctuations as in the cryptocurrencies market, and I’m glad we made it through.</p>\n<p>Maintaining stability is not an easy job yet nobody said it was easy at the first place.</p>\n<p>And I usually write here when I have a somewhat big problem, but apparently someone is looking for some reading so here we are as you always give me energy.</p>\n<p>Thank you for having me.</p>";

				const frontmatter = {"pubDate":"October 23 2022","title":"Stabilitas","description":"Thank you for having me.","excerpt":"Thank you for having me.","image":"~/assets/images/stabilitas.jpg","tags":["thoughts"]};
				const file = "E:/yuxxeun/yuxxeun/honeypod/data/blog/stabilitas.md";
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
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter,
	file,
	url,
	rawContent,
	compiledContent,
	getHeadings,
	getHeaders,
	Content,
	default: Content
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
	const posts = /* #__PURE__ */ Object.assign({"/data/blog/arabella.md": __vite_glob_0_0,"/data/blog/banyak-tahu.md": __vite_glob_0_1,"/data/blog/emptiness.md": __vite_glob_0_2,"/data/blog/fud.md": __vite_glob_0_3,"/data/blog/konfigurasi-vscode.md": __vite_glob_0_4,"/data/blog/konsumen-pintar.md": __vite_glob_0_5,"/data/blog/orm.md": __vite_glob_0_6,"/data/blog/see-you-when-i-see-you.md": __vite_glob_0_7,"/data/blog/stabilitas.md": __vite_glob_0_8});

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
		site: 'https://yuxxeun.now.sh/',

		items: posts.map((post) => ({
			link: getPermalink(post.slug, 'post'),
			title: post.title,
			description: post.description,
			pubDate: post.pubDate,
		})),
	})
};

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	get
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$b = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/widgets/Error404.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
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
});

const $$Astro$a = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/pages/404.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$404;
  const title = `404 \u2014 ${SITE.name}`;
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "meta": { title } }, { "default": () => renderTemplate`${renderComponent($$result, "Error404", $$Error404, {})}` })}`;
});

const $$file$4 = "E:/yuxxeun/yuxxeun/honeypod/src/pages/404.astro";
const $$url$4 = "/404";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$404,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$9 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/layouts/BlogLayout.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$BlogLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { meta } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<section class="px-6 overflow-x-auto sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-3xl">
		<header>
			<h1 class="text-center text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-8 md:mb-16 font-heading">
				${renderSlot($$result, $$slots["title"])}
			</h1>
		</header>
		${renderSlot($$result, $$slots["default"])}
	</section>` })}`;
});

const $$Astro$8 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/atoms/Tags.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$Tags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Tags;
  const { tags, class: className = "text-sm" } = Astro2.props;
  return renderTemplate`${tags && Array.isArray(tags) && renderTemplate`${maybeRenderHead($$result)}<ul${addAttribute(className, "class")}>
			${tags.map((tag) => renderTemplate`<li class="mr-2 mb-2 inline-block rounded-md bg-gray-200 py-0.5 px-2 dark:bg-slate-700">
					<a${addAttribute(getPermalink(tag, "tag"), "href")}>${tag}</a>
				</li>`)}
		</ul>`}`;
});

const load = async function () {
	let images = [];
	try {
		images = /* #__PURE__ */ Object.assign({"/src/assets/images/arabella.jpg": () => import('./chunks/arabella.c7e431f4.mjs'),"/src/assets/images/banyak-tahu.jpg": () => import('./chunks/banyak-tahu.b4bbb6dc.mjs'),"/src/assets/images/editor.jpg": () => import('./chunks/editor.ba151560.mjs'),"/src/assets/images/emptyness.jpg": () => import('./chunks/emptyness.738124db.mjs'),"/src/assets/images/fud.jpg": () => import('./chunks/fud.4f74c8a0.mjs'),"/src/assets/images/gradient.jpg": () => Promise.resolve().then(() => gradient),"/src/assets/images/konfigurasi-vscode/hasil.png": () => import('./chunks/hasil.7456a14d.mjs'),"/src/assets/images/konfigurasi-vscode/vscode-default.png": () => import('./chunks/vscode-default.939576a3.mjs'),"/src/assets/images/konsumen-pintar.jpg": () => import('./chunks/konsumen-pintar.acda41df.mjs'),"/src/assets/images/orm.png": () => import('./chunks/orm.be09bc26.mjs'),"/src/assets/images/see-you.jpg": () => import('./chunks/see-you.749a9c9d.mjs'),"/src/assets/images/stabilitas.jpg": () => import('./chunks/stabilitas.0e72080e.mjs')});
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

const $$Astro$7 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/blog/ListItem.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
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
				<span class="text-gray-500 font-space dark:text-slate-400">
					<time${addAttribute(post.pubDate, "datetime")}>${getFormattedDate(post.pubDate)}</time> &bull;
					${Math.ceil(post.readingTime)} min read
				</span>
			</div>
			<div class="mt-4 font-space">
				${renderComponent($$result, "PostTags", $$Tags, { "tags": post.tags })}
			</div>
		</footer>
	</div>
</article>`;
});

const $$Astro$6 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/blog/List.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$List = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$List;
  const { posts } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<ul>
	${posts.map((post) => renderTemplate`<li class="mb-10 md:mb-16">
				${renderComponent($$result, "Item", $$ListItem, { "post": post })}
			</li>`)}
</ul>`;
});

const $$Astro$5 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/atoms/Pagination.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
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
});

const $$Astro$4 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/pages/[...tags]/[tag]/[...page].astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
async function getStaticPaths$3({ paginate }) {
  if (BLOG?.disabled || BLOG?.tag?.disabled)
    return [];
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
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<span class="font-display lg:text-6xl text-2xl text-center uppercase tracking-tight text-oranged">${meta.ogType}: ${tag}
		</span>` })}` })}`;
});

const $$file$3 = "E:/yuxxeun/yuxxeun/honeypod/src/pages/[...tags]/[tag]/[...page].astro";
const $$url$3 = "/[...tags]/[tag]/[...page]";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getStaticPaths: getStaticPaths$3,
	default: $$$2,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/pages/[...categories]/[category]/[...page].astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
async function getStaticPaths$2({ paginate }) {
  if (BLOG?.disabled || BLOG?.category?.disabled)
    return [];
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
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`
		Category: ${category}` })}` })}`;
});

const $$file$2 = "E:/yuxxeun/yuxxeun/honeypod/src/pages/[...categories]/[category]/[...page].astro";
const $$url$2 = "/[...categories]/[category]/[...page]";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getStaticPaths: getStaticPaths$2,
	default: $$$1,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/components/blog/SinglePost.astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
const $$SinglePost = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SinglePost;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<section class="py-8 sm:py-16 lg:py-20 mx-auto">
	<article class="overflow-x-auto">
		<header>
			<p class="max-w-3xl mx-auto font-semibold font-space text-center">
				<time${addAttribute(post.pubDate, "datetime")}>${getFormattedDate(post.pubDate)}</time> &bull; ${Math.ceil(post.readingTime)} min read
			</p>
			<h1 class="px-4 uppercase text-oranged font-display text-2xl tracking-tight sm:px-6 max-w-3xl mx-auto text-center md:text-5xl font-bold leading-tighter mb-8 mt-4 font-heading">
				${post.title}
			</h1>
			${post.image && renderTemplate`${renderComponent($$result, "Picture", $$Picture, { "src": post.image, "class": "mx-auto mt-4 mb-6 max-w-full bg-gray-400  dark:bg-slate-700 sm:rounded-md lg:max-w-6xl", "widths": [400, 900], "sizes": "(max-width: 900px) 400px, 900px", "alt": post.description, "aspectRatio": "16:9" })}`}
		</header>
		<div class="overflow-x-hidden tracking-wide text-black dark:text-white container mx-auto px-6 font-delight sm:px-6 max-w-3xl prose prose-lg lg:prose-xl dark:prose-invert prose-headings:text-oranged prose-md prose-headings:font-extrabold prose-headings:font-heading prose-headings:leading-wide prose-headings:tracking-normal prose-headings:font-delight prose-a:text-oranged prose-img:rounded-md prose-img:shadow-lg mt-8">
			${renderComponent($$result, "Fragment", Fragment, { "class": "fragment" }, { "default": () => renderTemplate`${unescapeHTML(post.body)}` })}
		</div>
		<div class="container font-space mx-auto px-8 sm:px-6 max-w-3xl mt-8">
			${renderComponent($$result, "PostTags", $$Tags, { "tags": post.tags })}
		</div>
	</article>
</section>`;
});

const $$Astro$1 = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/pages/[...blog]/[slug].astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
async function getStaticPaths$1() {
  if (BLOG?.disabled || BLOG?.post?.disabled)
    return [];
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
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "SinglePost", $$SinglePost, { "post": { ...post, image: meta.image } })}` })}`;
});

const $$file$1 = "E:/yuxxeun/yuxxeun/honeypod/src/pages/[...blog]/[slug].astro";
const $$url$1 = "/[...blog]/[slug]";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getStaticPaths: getStaticPaths$1,
	default: $$slug,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("E:/yuxxeun/yuxxeun/honeypod/src/pages/[...blog]/[...page].astro", "https://yuxxeun.now.sh/", "file:///E:/yuxxeun/yuxxeun/honeypod/");
async function getStaticPaths({ paginate }) {
  if (BLOG?.disabled || BLOG?.blog?.disabled)
    return [];
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
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<span class="font-display lg:text-6xl text-2xl text-center uppercase tracking-tight text-oranged">${meta.ogType}
		</span>` })}` })}`;
});

const $$file = "E:/yuxxeun/yuxxeun/honeypod/src/pages/[...blog]/[...page].astro";
const $$url = "/[...blog]/[...page]";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getStaticPaths,
	default: $$,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/bookmark.astro', _page1],['src/pages/rss.xml.js', _page2],['src/pages/404.astro', _page3],['src/pages/[...tags]/[tag]/[...page].astro', _page4],['src/pages/[...categories]/[category]/[...page].astro', _page5],['src/pages/[...blog]/[slug].astro', _page6],['src/pages/[...blog]/[...page].astro', _page7],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/svelte","clientEntrypoint":"@astrojs/svelte/client.js","serverEntrypoint":"@astrojs/svelte/server.js"}, { ssr: _renderer1 }),];

export { BaseSSRService as B, isRemoteImage as i, pageMap, renderers };
