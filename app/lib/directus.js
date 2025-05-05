import { createDirectus, rest, readItems, createItem } from "@directus/sdk";

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
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

	getCategories: async () => {
		const articles = await directus.request(readItems("er_style_guide_articles"));
		const categories = articles.reduce((acc, article) => {
			if (!acc.includes(article.category)) {
				acc.push(article.category);
			}
			return acc;
		}, []);

		console.log(categories);
		return categories;
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
	},

	addArticle: async (category) => {
		const response = await directus.request(
			createItem("er_style_guide_articles", {
				category
			})
		);
		return response;
	},

	getAccordions: async () => {
		const accordions = await directus.request(
			readItems("er_style_guide_pages", {
				filter: {
					title: {
						_eq: "Front page"
					}
				}
			})
		);

		return accordions[0].accordions;
	}
};

const userTesting = {
	getCategories: async () => {
		const categories = await directus.request(readItems("user_testing_categories"));
		return categories;
	},

	getCategory: async (category) => {
		const categories = await directus.request(
			readItems("user_testing_categories", {
				filter: {
					slug: {
						_eq: category
					}
				}
			})
		);

		return categories[0] ? categories[0] : null;
	},

	getTopics: async (category) => {
		const topics = await directus.request(
			readItems("user_testing_topics", {
				filter: {
					category: {
						slug: {
							_eq: category
						}
					}
				}
			})
		);

		return topics;
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

export { styleGuide, userTesting, getImageSrc, getDirectusLink };
