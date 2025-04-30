"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { styleGuide } from "@/lib/directus";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectusIcon from "@/components/svgs/Directus";

const Page = ({}) => {
	const { directory, slug } = useParams();
	const [article, setArticle] = useState(null);
	const [thisDirectory, setThisDirectory] = useState(null);

	useEffect(() => {
		const fetch = async () => {
			const article = await styleGuide.getArticleBySlug(slug);
			setArticle(article);

			const thisDirectory = await styleGuide.getDirectory(directory);
			setThisDirectory(thisDirectory);
		};
		fetch();
	}, [slug]);

	return (
		<div className="flex max-w-7xl justify-between mx-auto relative">
			<div className="max-w-4xl w-full">
				{thisDirectory && (
					<a href={`/style-guide/${directory}`} className="button button--plain">
						<ArrowBackIcon />
						<span>Back to {thisDirectory.title}</span>
					</a>
				)}
				{article && (
					<>
						<h1 className="heading-1 !text-left mt-10">{article.title}</h1>
						<div
							dangerouslySetInnerHTML={{ __html: article.content }}
							className="item-content mt-8"
						/>
						<a href={article.directusLink} className="button button--cotton mt-20">
							<DirectusIcon size="24px" fill="black" />
							<span>Edit (admin)</span>
						</a>
					</>
				)}
			</div>
		</div>
	);
};

export default Page;
