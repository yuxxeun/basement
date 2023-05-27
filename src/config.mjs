export const SITE = {
	name: 'k.',
	brand: 'basement',
	origin: 'https://yuxxeun.now.sh/',
	basePathname: '/',
	title: 'yuxxeun.',
	description: 'thoughts, stories and probably random ideas.',
	image: 'https://raw.githubusercontent.com/yuxxeun/basement/main/src/assets/images/gradient.jpg',
}

export const BLOG = {
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
}
