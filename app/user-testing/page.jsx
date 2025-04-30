"use client";
import { useEffect, useState } from "react";
import { userTesting, getImageSrc } from "@/lib/directus";
import Card from "@/components/Card";

const Page = ({}) => {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetch = async () => {
			const categories = await userTesting.getCategories();
			console.log(categories);
			setCategories(categories);
		};
		fetch();
	}, []);

	return (
		<div className="container">
			<h2 className="heading-1">Categories</h2>

			<ul className="flex gap-4 justify-center mt-10">
				{categories &&
					categories.map((category) => {
						const dirIcon = category.icon ? getImageSrc(category.icon) : icon.src;
						return (
							<li key={category.slug}>
								<Card
									title={category.title}
									link={`/user-testing/${category.slug}`}
									icon={dirIcon}
								/>
							</li>
						);
					})}
			</ul>
		</div>
	);
};

export default Page;
