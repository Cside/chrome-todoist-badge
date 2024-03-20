import reactLogo from "@/assets/react.svg";
import { useEffect, useState } from "react";
import wxtLogo from "/wxt.svg";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);
	useEffect(() => {
		(async () => {
			const BASE_URL = "https://todoist.com";
			const CLIENT_ID = "61038a2457974384bf5d1014a03d3685";

			try {
				const ret = await chrome.identity.launchWebAuthFlow(
					{
						url: `${BASE_URL}/oauth/authorize?client_id=${CLIENT_ID}&scope=data:read_write&state=FIXME`,
						interactive: true,
					},
					// (responseUrl) => {
					// 	console.log(responseUrl);
					// },
				);
				console.log(ret);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	return (
		<>
			<div>
				<a href="https://wxt.dev" target="_blank" rel="noreferrer">
					<img src={wxtLogo} className="logo" alt="WXT logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>WXT + React</h1>
			<div className="card">
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the WXT and React logos to learn more
			</p>
		</>
	);
}

export default App;
