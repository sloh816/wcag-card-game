import { createDirectus, rest, readItems } from "@directus/sdk";

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
if (!directusUrl) {
	throw new Error("❌ DIRECTUS_URL is not defined");
}

const directus = createDirectus(directusUrl).with(rest());

const styleGuide = {
	getArticleBySlug: async (slug) => {
		const articles = await directus.request(
			readItems("er_style_guide_articles", {
				filter: {
					slug: {
						_eq: slug
					}
				}
			})
		);

		return {
			...articles[0],
			directusLink: directusUrl + "/admin/content/er_style_guide_articles/" + articles[0].id
		};
	},

	getArticlesByDirectory: async (directory) => {
		const articles = await directus.request(
			readItems("er_style_guide_articles", {
				filter: {
					directory: {
						slug: {
							_eq: directory
						}
					}
				}
			})
		);

		if (directory === "useful-information") {
			return articles;
		}

		return articles
			.filter((article) => article.title) // Remove articles without a title
			.sort((a, b) => a.title.localeCompare(b.title));
	},

	getDirectories: async () => {
		const directories = await directus.request(readItems("er_style_guide_directories"));
		return directories;
	},

	getDirectory: async (directory) => {
		const dir = await directus.request(
			readItems("er_style_guide_directories", {
				filter: {
					slug: {
						_eq: directory
					}
				}
			})
		);

		return dir[0] ? dir[0] : null;
	}
};

const userTesting = {
	getArticleBySlug: async (slug) => {
		const articles = await directus.request(
			readItems("user_testing_articles", {
				filter: {
					slug: {
						_eq: slug
					}
				}
			})
		);

		return {
			...articles[0],
			directusLink: directusUrl + "/admin/content/user_testing_articles/" + articles[0].id
		};
	},

	getArticlesByDirectory: async (directory) => {
		const articles = await directus.request(
			readItems("user_testing_articles", {
				filter: {
					directory: {
						slug: {
							_eq: directory
						}
					}
				}
			})
		);

		return articles
			.filter((article) => article.title) // Remove articles without a title
			.sort((a, b) => a.title.localeCompare(b.title));
	},

	getDirectories: async () => {
		const directories = await directus.request(readItems("user_testing_directories"));
		return directories;
	},

	getDirectory: async (directory) => {
		const dir = await directus.request(
			readItems("user_testing_directories", {
				filter: {
					slug: {
						_eq: directory
					}
				}
			})
		);

		return dir[0] ? dir[0] : null;
	}
};

const getImageSrc = (imageId) => {
	return `${directusUrl}/assets/${imageId}`;
};

const getDirectusLink = (collection = null, id = null) => {
	if (!collection) {
		return `${directusUrl}/admin`;
	}
	const link = id ? `${collection}/${id}` : `${collection}`;
	return `${directusUrl}/admin/content/${link}`;
};

const getFonts = () => {
	const response = directus.request(readItems("fonts"));
	return response;
};

export { styleGuide, userTesting, getImageSrc, getDirectusLink, getFonts };
