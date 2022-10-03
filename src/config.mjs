export const SITE = {
	name: 'yuxxeun®',
	origin: 'https://yuxxeun.now.sh',
	basePathname: '/',
	title: 'yuxxeun®',
	description: 'thoughts, stories and ideas',
	image: 'https://github.com/yuxxeun/honeypod/blob/main/src/assets/images/gradient.jpg?raw=true',

	googleAnalyticsId: false, // or "G-XXXXXXXXXX",
	googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',
};

export const BLOG = {
	disabled: false,
	postsPerPage: 5,

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
		pathname: '', // set empty to change from /category/some-category to /some-category
	},

	tag: {
		disabled: false,
		pathname: '', // set empty to change from /tag/some-tag to /some-tag
	},
};
