"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { styleGuide, getDirectusLink } from "@/lib/directus";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DirectusIcon from "@/components/svgs/Directus";

const Page = ({}) => {
	const [directories, setDirectories] = useState(null);
	const [selectedDirectory, setSelectedDirectory] = useState(null);
	const [articles, setArticles] = useState(null);
	const [filteredArticles, setFilteredArticles] = useState(null);
	const [selectedArticle, setSelectedArticle] = useState(null);
	const [filterLetter, setFilterLetter] = useState(null);
	const router = useRouter();

	const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

	const fetchDirectories = async () => {
		const directories = await styleGuide.getDirectories();
		setDirectories(directories);
	};

	const fetchArticles = async (directory) => {
		const articles = await styleGuide.getArticlesByDirectory(directory);
		setArticles(articles);
		setFilteredArticles(articles);
	};

	const updateQuery = async (newQueryValue, key) => {
		if (key === "directory") {
			router.push(`/style-guide?directory=${newQueryValue}`, undefined, { shallow: true });
			setSelectedDirectory(newQueryValue);
			await fetchArticles(newQueryValue);
		} else if (key === "article") {
			// get current directory query
			const query = new URLSearchParams(window.location.search);
			const directory = query.get("directory");
			router.push(`/style-guide?directory=${directory}&article=${newQueryValue}`, undefined, {
				shallow: true
			});
			const article = await styleGuide.getArticleBySlug(newQueryValue);
			setSelectedArticle(article);
		}
	};

	const filterArticlesBySearch = (event) => {
		const search = event.target.value;

		if (search) {
			const filteredArticles = articles.filter((article) => {
				return article.title.toLowerCase().includes(search.toLowerCase());
			});
			setFilteredArticles(filteredArticles);
		} else {
			setFilteredArticles(articles);
		}
	};

	const filterArticlesByLetter = (letter) => {
		setFilterLetter(letter);

		if (letter && articles) {
			const filteredArticles = articles.filter((article) => {
				return article.title.toLowerCase().startsWith(letter.toLowerCase());
			});
			setFilteredArticles(filteredArticles);
		} else {
			setFilteredArticles(articles);
		}
	};

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const directory = query.get("directory");
		if (directory) {
			setSelectedDirectory(directory);
			fetchArticles(directory);
		}

		const article = query.get("article");
		if (article) {
			styleGuide.getArticleBySlug(article).then((article) => {
				setSelectedArticle(article);
			});
		}

		fetchDirectories();
	}, []);

	// components
	const LetterButton = ({ letter, onclick, children, selected = false }) => {
		if (selected) {
			return (
				<span className="bg-navy-100 text-white font-bold rounded-lg grid place-items-center text-sm w-8 h-8">
					{children}
				</span>
			);
		} else {
			return (
				<button
					onClick={() => onclick(letter)}
					className="rounded-lg hover:bg-grapefruit-40 text-sm w-8 h-8"
				>
					{children}
				</button>
			);
		}
	};

	const LetterFilter = () => {
		return (
			<ul className="flex flex-wrap items-center p-2">
				{alphabet.map((letter) => {
					return (
						<li key={letter}>
							<LetterButton
								letter={letter}
								onclick={filterArticlesByLetter}
								selected={filterLetter === letter}
							>
								{letter}
							</LetterButton>
						</li>
					);
				})}
				<li>
					<LetterButton letter={null} onclick={filterArticlesByLetter}>
						<ClearIcon />
					</LetterButton>
				</li>
			</ul>
		);
	};

	return (
		<div className="flex flex-row items-start overflow-hidden">
			<div className="directories shrink-0 border-r border-charcoal shadow-lg w-60 pt-20 h-screen">
				<div className="px-4 py-6">
					<h2 className="font-bold text-lg mb-4">Directories</h2>
					<ul className="flex flex-col gap-2">
						{directories &&
							directories.map((directory) => {
								return (
									<li key={directory.id}>
										<button
											className="px-4 py-2 rounded-lg block w-full text-left"
											onClick={() => updateQuery(directory.slug, "directory")}
											aria-selected={selectedDirectory === directory.slug}
										>
											{directory.title}
										</button>
									</li>
								);
							})}
					</ul>
					<a href={getDirectusLink()} className="button button--cotton absolute bottom-8">
						<DirectusIcon size={24} />
						<span>Directus Admin</span>
					</a>
				</div>
			</div>

			{filteredArticles && (
				<div className="articles shrink-0 border-r border-charcoal shadow-lg w-80 pt-20 h-screen relative">
					<div className="search-and-filter bg-white w-full h-44 shadow-md">
						<div className="search-bar border-charcoal border-b flex items-center px-2 pt-2">
							<div className="text-navy-100">
								<SearchIcon />
							</div>
							<input
								type="text"
								placeholder="Search for a word..."
								className="w-full p-2 focus:outline-none bg-transparent"
								onChange={filterArticlesBySearch}
							/>
						</div>

						<LetterFilter />
					</div>
					<div
						className="px-4 py-6 overflow-y-auto"
						style={{ height: "calc(100vh - 16rem)" }}
					>
						<ul className="flex flex-col gap-2">
							{filteredArticles.map((article) => {
								return (
									<li key={article.id}>
										<button
											className="rounded-lg block w-full text-left px-4 py-1"
											aria-selected={
												selectedArticle &&
												selectedArticle.slug === article.slug
											}
											onClick={() => updateQuery(article.slug, "article")}
										>
											{article.title}
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			)}

			{selectedArticle && (
				<div className="article pt-20 h-screen overflow-auto w-full grow-1 relative">
					<div className="p-8 max-w-4xl">
						<h2 className="font-bold text-4xl text-navy-100">
							{selectedArticle.title}
						</h2>
						<div
							dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
							className="item-content my-8"
						/>
					</div>
					<a
						href={selectedArticle.directusLink}
						className="button button--small absolute top-24 right-4"
					>
						Edit this article (Admin)
					</a>
				</div>
			)}
		</div>
	);
};

export default Page;
