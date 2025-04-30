"use client";
import { useEffect, useState } from "react";
import { styleGuide, getImageSrc } from "@/lib/directus";

import Card from "@/components/Card";
import icon from "@/assets/iag-icon.png";
import Dropdown from "@/components/Dropdown";

const Page = ({}) => {
	const [accordions, setAccordions] = useState([]);
	const [directories, setDirectories] = useState(null);

	useEffect(() => {
		const fetch = async () => {
			const accordions = await styleGuide.getAccordions();
			setAccordions(accordions);

			const directories = await styleGuide.getDirectories();
			setDirectories(directories);
		};
		fetch();
	}, []);

	return (
		<div className="container">
			<h2 className="heading-2 text-center">Directories</h2>
			<ul className="flex gap-4 justify-center mt-10">
				{directories &&
					directories.map((directory) => {
						const dirIcon = directory.icon ? getImageSrc(directory.icon) : icon.src;
						return (
							<li key={directory.slug}>
								<Card
									title={directory.title}
									link={`/style-guide/${directory.slug}`}
									icon={dirIcon}
								/>
							</li>
						);
					})}
			</ul>

			<h2 className="heading-2 text-center mt-20">Useful information</h2>
			{accordions && (
				<div className="flex flex-col gap-4 mt-10">
					<div className="flex justify-end">
						<a
							className="text-sm mt-8 inline-block no-underline underline-offset-4 hover:underline text-charcoal-100 "
							href="http://192.168.2.228:8055/admin/content/er_style_guide_pages/391df468-dec6-44d1-a644-44d770c874f5"
							target="_blank"
						>
							Edit this section (admin)
						</a>
					</div>

					{accordions.map((accordion) => {
						return (
							<Dropdown key={accordion.Heading} title={accordion.Heading}>
								<div dangerouslySetInnerHTML={{ __html: accordion.Content }}></div>
							</Dropdown>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Page;
