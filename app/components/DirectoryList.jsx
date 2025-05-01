import ListItemLink from "./ListItemLink";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const DirectoryList = ({ directory, sidebar = false, directorySlug }) => {
	return (
		<ul className="flex flex-col gap-3" data-sidebar={sidebar}>
			{directory.map((item) => {
				return (
					<ListItemLink
						key={item.id}
						href={`/style-guide/${directorySlug}/${item.slug}`}
						listStyle="compact"
					>
						<div className="flex justify-between">
							<strong>{item.title}</strong>
							{!sidebar && <KeyboardArrowRightIcon />}
						</div>
					</ListItemLink>
				);
			})}
		</ul>
	);
};

export default DirectoryList;
