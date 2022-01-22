import * as React from "react";
import "./App.css";
import {
	Input,
	Button,
	Wrapper,
	Row,
	Col,
	Title,
	Container,
	Header,
	Image,
} from "./components";
import axios from "axios";
const App = () => {
	const channel = new BroadcastChannel("Funimation");
	const [webhook, setWebhook] = React.useState<string>("");
	const [bool, setBool] = React.useState<boolean>();
	const [mmid, setMmid] = React.useState<string>("");
	const [address, setAddress] = React.useState<string>("");
	const [image, setImage] = React.useState<string>("");
	const handleChange = async (e: any) => {
		e.preventDefault();
		switch (e?.target?.name) {
			case "discordId":
				setWebhook(e?.target?.value);
				break;
			default:
				setMmid(e?.target?.value);
				break;
		}
	};

	const click = async (e: any) => {
		e.preventDefault();
		switch (e?.target?.name) {
			case "mmSave":
				channel.postMessage({ mmid: mmid });
				break;
			default:
				channel.postMessage({ webhook: webhook });
				chrome.storage.local.set({ webhook: webhook });
				break;
		}
	};

	const autoSnipe = async (e: any) => {
		e.preventDefault();
		chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
	};

	React.useEffect(() => {
		chrome.storage.local.get(["mmid"], (res: any) => {
			if (res?.mmid) {
				setMmid(res.mmid);
				setBool(true);
			}
		});
		chrome.storage.local.get(["address"], (res: any) => {
			if (res?.address) {
				setAddress(res.address);
			}
		});
		chrome.storage.local.get(["image"], (res: any) => {
			if (res?.image) {
				setImage(res.image);
			}
		});
	}, []);

	return (
		<Wrapper>
			<Title>
				<div>Trait Surfer</div>
			</Title>
			{!bool ? (
				<Col>
					<Input
						type="text"
						name="metamaskId"
						id="metamaskinput"
						placeholder="MetaMask Extension ID"
						onChange={handleChange}
					/>

					<Button name="mmSave" onClick={click}>
						Save
					</Button>
				</Col>
			) : (
				<>
					<Container>
						<Col style={{ padding: "0" }}>
							<span className="address">
								{address
									? `${address.slice(0, 6)}...${address.slice(-4)}`
									: "0x"}
							</span>
							<span className={address ? "connected" : "disconnected"}>
								{address ? "Connected" : "Disconnected"}
							</span>
						</Col>
					</Container>
					<Col>
						<Header>Settings</Header>
						<Row>
							<Input
								type="text"
								name="discordId"
								id="metamaskinput"
								placeholder="Discord Webhook"
								onChange={handleChange}
							/>
							<Button name="discordSave" onClick={click}>
								Save
							</Button>
						</Row>
						<Row>
							<Input
								type="text"
								name="metamaskId"
								id="metamaskinput"
								placeholder="MetaMask Extension ID"
								defaultValue={mmid}
								key={mmid}
								onChange={handleChange}
							/>

							<Button name="mmSave" onClick={click}>
								Save
							</Button>
						</Row>
						<Row>
							<Button onClick={autoSnipe}>Open AutoSnipe</Button>
						</Row>
					</Col>
				</>
			)}
		</Wrapper>
	);
};

export default App;
