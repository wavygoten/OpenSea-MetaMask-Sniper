import styled from "styled-components";

export const Input = styled.input`
	background-color: var(--secondary-dark);
	color: var(--secondary-light);
	font-size: 12px;
	padding: 5px;
	border-radius: 6px;
	border: transparent solid 2px;
	outline: 0 none;
	&::placeholder {
		color: #979797;
	}
	&:active {
		border: var(--main-theme) 2px solid;
	}
	&:focus {
		border: var(--main-theme) 2px solid;
	}
`;
