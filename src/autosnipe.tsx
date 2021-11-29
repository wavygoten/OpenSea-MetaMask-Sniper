import * as React from "react";
import * as ReactDOM from "react-dom";
import "./autosnipe.css";

const Autosnipe = () => {
	const channel = new BroadcastChannel("Funimation");
	const [collectionSlug, setCollectionSlug] = React.useState<string>("");
	const [price, setPrice] = React.useState<number>();
	const [disable, setDisable] = React.useState<boolean>(false);
	const startMonitor = (e: any) => {
		e.preventDefault();
		// setDisable(true);
		// do monitoring here... working rn :p
		console.log(collectionSlug, price);
	};

	const handleChange = (e: any) => {
		switch (e?.target?.name) {
			case "collection":
				setCollectionSlug(e?.target?.value);
				break;

			default:
				setPrice(e?.target?.value);
				break;
		}
	};

	return (
		<div className="container">
			<div className="sniper-title">Sniper Tool</div>
			<div className="inputone">
				<span>Collection Slug</span>
				<input
					name="collection"
					type="text"
					placeholder="collection-slug"
					onChange={handleChange}
				/>
			</div>
			<div className="inputtwo">
				<span>Snipe below</span>
				<input
					name="price"
					type="text"
					placeholder="0.42 Ξ"
					onChange={handleChange}
				/>
			</div>
			<div className="button-container">
				<button disabled={disable} onClick={startMonitor}>
					{disable ? "Monitoring..." : "Start Monitor"}
				</button>
			</div>
		</div>
	);
};

var mountNode = document.getElementById("autosnipe");
ReactDOM.render(<Autosnipe />, mountNode);
