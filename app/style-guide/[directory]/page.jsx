"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { styleGuide } from "@/lib/directus";

import DirectoryList from "@/components/DirectoryList";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import DirectusIcon from "@/components/svgs/Directus";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Page = ({}) => {
	const { directory } = useParams();
	const [articles, setArticles] = useState(null);
	const [filteredArticles, setFilteredArticles] = useState(null);
	const [filterLetter, setFilterLetter] = useState(null);
	const [thisCategory, setThisCategory] = useState(null);

	const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

	useEffect(() => {
		const fetch = async () => {
			const directories = await styleGuide.getDirectories();
			const thisCategory = directories.find((cat) => cat.slug === directory);
			setThisCategory(thisCategory);

			const articles = await styleGuide.getArticlesByDirectory(directory);
			setArticles(articles);
			setFilteredArticles(articles);
		};
		fetch();
	}, [directory]);

	// functions
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

	const addNewArticle = async () => {
		const newArticle = await styleGuide.addArticle(directory);

		if (newArticle) {
			const editPage = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/admin/content/er_style_guide_articles/${newArticle.id}`;
			window.open(editPage, "_blank");
		}
	};

	// local components
	const LetterButton = ({ letter, onclick, children, selected = false }) => {
		if (selected) {
			return (
				<span className="bg-grapefruit-100 text-white font-bold w-8 h-8 rounded-lg grid place-items-center">
					{children}
				</span>
			);
		} else {
			return (
				<button
					onClick={() => onclick(letter)}
					className="w-8 h-8 rounded-lg hover:bg-honey-100 hover:font-bold"
				>
					{children}
				</button>
			);
		}
	};

	const LetterFilter = () => {
		return (
			<ul className="flex flex-wrap gap-2 items-center">
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
		<div className="max-w-7xl mx-auto">
			{thisCategory && (
				<h1 className="heading-1 text-center w-full mb-12">{thisCategory.title}</h1>
			)}
			<div className="flex gap-12 mt-24">
				<div className="w-80 flex flex-col gap-8 items-start fixed">
					<a href="/style-guide" className="button button--plain">
						<ArrowBackIcon />
						<span>Back to home</span>
					</a>

					<label className="flex gap-4 items-center w-full rounded-full border border-navy-100 bg-white pl-4 focus-within:border-navy-100 focus-within:border-2">
						<div className="text-navy-100">
							<SearchIcon />
						</div>
						<span className="sr-only">Search for a word</span>
						<input
							type="text"
							placeholder="Search for a word..."
							className="w-full p-2 focus:outline-none bg-transparent"
							onChange={filterArticlesBySearch}
						/>
					</label>

					<LetterFilter />

					{thisCategory && (
						<button className="button button--cotton" onClick={addNewArticle}>
							<DirectusIcon size="24px" fill="white" />
							<span>Add New {thisCategory.single} (Admin)</span>
						</button>
					)}
				</div>
				<div className="flex-grow ml-96">
					{articles && (
						<DirectoryList directory={filteredArticles} directorySlug={directory} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Page;
