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
            Colophon is a designer-y word for “how it’s made”.
        </p>
    </div>

    <!-- About section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-white">
            About
        </span>
        <p class="text-lg">
            I designed and built this site myself. It’s a home to share things I’m exploring and things I’ve built. It’s a place for me to learn in public.

            All code is open source and available on <a href="https://github.com/yuxxeun/basement/" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                Github
            </a>. 
            <br>
            The first commit was September 17, 2022. I’ve grown a lot since then—and the technology around me has grown, too. 
        </p>
    </div>

    <!-- Technology section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-white">
            Technology
        </span>
        <p class="text-lg">
            This site is built using <a href="https://astro.build/" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                Astro
            </a>. 
            <br>
            Astro handles the content-heavy views (written in MD format), but for more interactive components I use <a href="https://docs.astro.build/en/guides/integrations-guide/svelte//" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                Svelte framework integration
            </a>.
            Code is edited using VS Code on a MacBook Pro. 
            <br><br>
            My terminal of choice is <a href="https://warp.dev/" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                Warp
            </a>. My go-to coding font is  <a href="https://github.com/tonsky/FiraCode" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                Fira Code
            </a>.
            End-to-end tests are written in... wait, i dont run any code-test for it, and I use <a href="https://polyplane.app/" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                Polyplane
            </a> to preview devices, test accessibility, and toggle user preferences like (prefers-color-scheme).
            Domain registration via 
            <a href="https://domainesia.com" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                Domainesia
            </a>, hosting, and deployment are via <a href="https://vercel.com" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                Vercel
            </a>. Email forwarding is through <a href="https://improvmx.com/" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white">
                ImprovMX
            </a>.
        </p>
    </div>

    <!-- Typography section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-white">
            Typography
        </span>
        <p class="text-lg">
            Headings and components are set in Basement Display Variable. As the name suggests, it’s a variable font, meaning I can stretch character widths and fine-tune weights for different uses. Body text is set in Neue Montreal Regular.
            <br><br>
            Typography is scaled using a lot of math and a fluid type scale by Utopia, meaning that font sizes will interpolate between mobile and desktop to optimize for the current browser width.
            <br> <br>
            Type inspiration can be found anywhere, from comic art and video games to bodega window displays, but I often return to a handful of resources:
            <br><br>    
            &bull; The Elements of Typographic Style by Robert Bringhurst
            <br>   
            &bull; Butterick’s Practical Typography
                <br>   
            &bull;  Bethany Heck’s Font Review Journal
                <br>   
            &bull; Fonts In Use
        </p>
    </div>

    <!-- Styling section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-white">
            Styling
        </span>
        <p class="text-lg">
            I use Radix Colors to apply palettes consistently, ensure accessibility, and seamlessly switch between light and dark mode. Icons are from Astro Icon. I don’t use a grid.
        </p>
    </div>

    <!-- Issue section -->
    <div class="text-left space-y-3">
        <span class="font-display lg:text-3xl px-auto text-2xl text-center uppercase text-white">
            Notice an issue?
        </span>
        <p class="text-lg">
            If you spot a typo, encounter a broken feature, or have a recommendation for an improvement, file an issue on my 
            <a href="https://github.com/yuxxeun/basement/issues" class="border-b dark:border-oranged text-oranged dark:hover:text-white dark:hover:border-b-white"> 
                GitHub
            </a>.
        </p>
    </div>
</section>