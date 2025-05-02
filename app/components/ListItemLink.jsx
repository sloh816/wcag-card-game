const ListItemLink = ({ href, onClick, children, listStyle = "cozy" }) => {
	return href ? (
		<a href={href} className={`list-item list-item--${listStyle}`}>
			{children}
		</a>
	) : (
		<button onClick={onClick} className={`list-item list-item--${listStyle}`}>
			{children}
		</button>
	);
};

export default ListItemLink;