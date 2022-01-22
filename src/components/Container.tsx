import styled from "styled-components";

export const Container = styled.div`
	padding: 0.5rem;
	border-bottom: 1px solid rgb(72, 75, 83);
	span {
		font-size: 12px;
		margin: 2px 0;
	}

	.connected {
		color: green;
	}

	.disconnected {
		color: red;
	}
`;
