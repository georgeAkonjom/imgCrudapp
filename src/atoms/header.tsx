import "../styles/header.css";

function Header({ header }: any) {
	return (
		<>
			<p className="header">{header}</p>
		</>
	);
}

export default Header;
