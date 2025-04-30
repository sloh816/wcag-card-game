"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { userTesting, getDirectusLink } from "@/lib/directus";
import Dropdown from "@/components/Dropdown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectusIcon from "@/components/svgs/Directus";

const Page = ({}) => {
	const { category } = useParams();
	const [topics, setTopics] = useState([]);
	const [thisCategory, setThisCategory] = useState(null);

	useEffect(() => {
		const fetch = async () => {
			const topics = await userTesting.getTopics(category);
			setTopics(topics);

			const thisCategory = await userTesting.getCategory(category);
			setThisCategory(thisCategory);
		};
		fetch();
	}, []);

	return (
		<div className="container">
			{thisCategory && <h2 className="heading-1">{thisCategory.title}</h2>}
			<div className="flex justify-between items-center mt-16">
				<a href="/user-testing" className="button button--plain ">
					<ArrowBackIcon />
					<span>Back to home</span>
				</a>
				<a href={getDirectusLink("user_testing_topics")} className="button button--cotton">
					<DirectusIcon size="24px" fill="black" />
					<span>Add a topic (Admin)</span>
				</a>
			</div>
			{topics && (
				<ul className="flex flex-col gap-2 mt-4">
					{topics.map((topic) => {
						return (
							<li key={topic.id}>
								<Dropdown title={topic.title}>
									<div dangerouslySetInnerHTML={{ __html: topic.content }} />
									<a
										href={getDirectusLink("user_testing_topics", topic.id)}
										className="button button--small !font-normal mt-8 w-full justify-end"
									>
										Edit (Admin)
									</a>
								</Dropdown>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default Page;
