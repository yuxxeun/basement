export const SITE = {
	name: 'yuxxeun®',
	brand: 'XVII x MMII',
	origin: 'https://yuxxeun.now.sh',
	basePathname: '/',
	title: 'yuxxeun®',
	description: 'THE LIGHT THAT COMES FROM DOWNSTAIRS',
	image: 'https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/gradient.jpg?raw=true',
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
