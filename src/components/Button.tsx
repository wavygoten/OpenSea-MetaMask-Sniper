import styled from "styled-components";

export const Button = styled.button`
	background-color: var(--main-theme);
	color: var(--secondary-light);
	font-size: 12px;
	outline: none;
	border: none;
	border-radius: 3px;
	padding: 5px 10px;
	&:hover {
		background-color: var(--hover-theme);
		transition: 100ms ease;
		cursor: pointer;
	}
`;
