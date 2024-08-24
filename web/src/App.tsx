import React from "react";
import MDT from "./layers/mdt/MDT";
import Dev from "./layers/dev/Dev";
import { isEnvBrowser } from "./utils/misc";
import DispatchNotifications from "./layers/notifications/DispatchNotifications";
import Dispatch from "./layers/dispatch/Disptach";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { Config } from "./typings";
import useConfigStore from "./stores/configStore";

function App() {
	const { setConfig } = useConfigStore();

	useNuiEvent("setConfig", (data: { config: Config }) => {
		setConfig(data.config);
	});

	return (
		<>
			<Dispatch />
			<MDT />
			<DispatchNotifications />
			{isEnvBrowser() && <Dev />}
		</>
	);
}

export default App;
