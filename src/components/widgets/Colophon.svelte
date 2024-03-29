<script>
    import { SITE } from '~/config.mjs'
    const meta = {
		title: `Colophon`,
		description: SITE.description,
		ogType: 'Colophon',
	}
</script>

<section class="mx-auto max-w-3xl lg:space-y-20 space-y-14 font-delight tracking-wide my-10">
    <!-- Title section and tagline -->
    <div class="text-center lg:mt-20 lg:w-3/4 mx-auto items-center lg:space-y-1 space-y-1">
        <span class="font-display lg:text-6xl mx-auto text-center text-3xl text-center uppercase tracking-tight text-oranged">
            {meta.title}
        </span>
        <p class="lg:text-2xl leading-5 text-lg">
            A designer-y word for “how it’s made”.
        </p>
    </div>

    <!-- About section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-black dark:text-white">
            About
        </span>
        <p class="text-lg">
            I designed and built this site myself. 
            <br>
            This is a home or digital graden (read: <a href="https://maggieappleton.com/garden-history" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:-mt-1 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                A Brief History & Ethos of the Digital Garden</a>) to share the things I explore in both my on-screen and off-screen worlds.
            All code is open source and available on <a href="https://github.com/yuxxeun/basement/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:-mt-1 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Github
            </a>. 
            <br><br>
            The first commit was September 17, 2022. Damn, I’ve grown a lot since then—and the technology around me has grown, too. 
        </p>
    </div>

    <!-- Technology section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-black dark:text-white">
            Technology
        </span>
        <p class="text-lg">
            This site is built using <a href="https://astro.build/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Astro
            </a>. 
            <br>
            Astro handles the content-heavy views (written in MD format), but for more interactive components I use 
            <a href="https://docs.astro.build/en/guides/integrations-guide/svelte/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Svelte framework integration
            </a> sweetness. Code is edited using VS Code on a MacBook Pro. 
            <br><br>
            My terminal of choice is <a href="https://warp.dev/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Warp
            </a>. 
            <br>
            My go-to coding font is <a href="https://github.com/tonsky/FiraCode" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Fira Code
            </a> and <a href="https://vercel.com/font" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Geist
            </a> from Vercel.
            E2E testing are written in... wait, i dont run any test for it, and I use <a href="https://polyplane.app/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Polyplane
            </a> to preview devices, test accessibility, and toggle user preferences like (prefers-color-scheme).
            Domain registration via 
            <a href="https://domainesia.com" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Domainesia
            </a>, hosting, and deployment are via <a href="https://vercel.com" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Vercel
            </a>. Email forwarding is through <a href="https://improvmx.com/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                ImprovMX
            </a>.
            To handle data interaction such as on dynamic page i.e: bookmark, secreto and etc, I use <a href="https://supabase.com/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Supabase
            </a> with PostgresSQL dna.
        </p>
    </div>

    <!-- Typography section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-black dark:text-white">
            Typography
        </span>
        <p class="text-lg">
            Headings and components are set in Basement Display Variable. As the name suggests, it’s a variable font, meaning I can stretch character widths and fine-tune weights for different uses. Body text is set in Neue Montreal Regular.
            <br><br>
            Typography is scaled using a lot of math and a fluid type scale by Utopia, meaning that font sizes will interpolate between mobile and desktop to optimize for the current browser width.
            <br> <br>
            Type inspiration can be found anywhere, from comic art and video games to bodega window displays, but I often return to a handful of resources:
            <br><br>    
            &bull; <a href="https://bookshop.org/a/97627/9780881792126" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                The Elements of Typographic Style
            </a> by Robert Bringhurst
            <br>   
            &bull; <a href="https://practicaltypography.com/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100 items-center">
                Butterick’s Practical Typography
            </a>
            <br>   
            &bull; Bethany Heck's <a href="https://fontreviewjournal.com/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100 items-center">
                 Font Review Journal
            </a>
            <br>   
            &bull; <a href="https://fontsinuse.com/" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100">
                Fonts In Use
            </a> 
        </p>
    </div>

    <!-- Styling section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-black dark:text-white">
            Styling
        </span>
        <p class="text-lg">
            I use Radix Colors to apply palettes consistently, ensure accessibility, and seamlessly switch between light and dark mode, but unfortunately, currently the toggle theme has been disabled. Icons are from Astro Icon. 
            Also, I don’t use a grid.
        </p>
    </div>

    <!-- Issue section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-black dark:text-white">
            Notice an issue?
        </span>
        <p class="text-lg">
            If you spot a typo, encounter a broken feature, or have a recommendation for an improvement, file an issue on this
            <a href="https://github.com/yuxxeun/basement/issues" class="text-oranged inline-block after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:-mt-1 after:scale-x-0 after:bg-oranged after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"> 
                repository 
            </a> issue section.
        </p>
    </div>
</section>