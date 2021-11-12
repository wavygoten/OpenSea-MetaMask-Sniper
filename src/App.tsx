import * as React from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
	const channel = new BroadcastChannel("Funimation");
	const [mmid, setMmid] = React.useState<string>("");
	const handleChange = async (e: any) => {
		e.preventDefault();
		setMmid(e?.target?.value);
	};

	const click = async (e: any) => {
		e.preventDefault();
		channel.postMessage(mmid);
	};
	return (
		<div className="App">
			<header className="App-header">
				<h2 id="title">Sniper Tool</h2>
				<input
					type="text"
					name="metamaskId"
					id="metamaskinput"
					placeholder="MetaMask Extension ID"
					onChange={handleChange}
				/>

				<button onClick={click}>Save</button>
			</header>
		</div>
	);
};

export default App;
