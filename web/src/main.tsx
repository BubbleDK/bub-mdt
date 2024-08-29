import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { isEnvBrowser } from "./utils/misc";
import { HashRouter } from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

if (isEnvBrowser()) {
	const root = document.getElementById("root");

	// https://i.imgur.com/iPTAdYV.png - Night time img
	root!.style.backgroundSize = "cover";
	root!.style.backgroundRepeat = "no-repeat";
	root!.style.backgroundPosition = "center";
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			refetchOnMount: false,
		},
	},
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<MantineProvider
			theme={{ colorScheme: "dark", fontFamily: "Nunito, sans-serif" }}
		>
			<HashRouter>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</HashRouter>
		</MantineProvider>
	</React.StrictMode>
);
