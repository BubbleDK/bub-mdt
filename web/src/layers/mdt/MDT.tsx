import { Transition } from "@mantine/core";
import {
	Sidebar,
	Dashboard,
	Profiles,
	Roster,
	Charges,
	CodesAndCommands,
} from "./components";
import { Route, Routes } from "react-router-dom";
import "./MDT.css";
import { useEffect, useState } from "react";
import Incidents from "./components/Incidents";
import { ModalsProvider } from "@mantine/modals";
import Dispatch from "./components/Dispatch";
import {
	useAppVisibilityStore,
	useChargeStore,
	usePersonalDataStore,
	useProfilesStore,
} from "../../stores";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { Character, Charge, CustomProfileData } from "../../typings";
import Reports from "./components/Reports";
import useReportStore from "../../stores/reports/report";
import useIncidentStore from "../../stores/incidents/incident";
import { default as locales, setLocale } from "../../locales";
import dayjs from "dayjs";
import { fetchNui } from "../../utils/fetchNui";
import Vehicles from "./components/Vehicles";
import { isEnvBrowser } from "../../utils/misc";

const MDT: React.FC = () => {
	const [isMouseOutsideMdt, setIsMouseOutsideMdt] = useState(false);
	const { showApp, setVisibility } = useAppVisibilityStore();
	const { setEvidence } = useReportStore();
	const setPersonalData = usePersonalDataStore(
		(state) => state.setPersonalData
	);
	const setIncidentEvidence = useIncidentStore((state) => state.setEvidence);
	const setProfileCards = useProfilesStore((state) => state.setProfileCards);
	const { setCharges } = useChargeStore();

	useNuiEvent(
		"setInitData",
		async (data: {
			locale: string;
			locales: typeof locales;
			profileCards: CustomProfileData[];
			charges: { [category: string]: Charge[] };
		}) => {
			setLocale(data.locales);
			setCharges(data.charges);
			setProfileCards(data.profileCards);

			dayjs.locale(data.locale);
		}
	);

	useNuiEvent<{ personalData: Character }>("openMDT", (data) => {
		setPersonalData(data.personalData);
		setVisibility(true);
	});

	useNuiEvent("setVisible", (data: { visible: boolean }) => {
		setVisibility(data.visible);
	});

	useNuiEvent(
		"updateReportEvidence",
		async (data: { imageLabel: string; imageURL: string }) => {
			setEvidence((prev) => [
				...prev,
				{
					label: data.imageLabel,
					image: data.imageURL,
				},
			]);
		}
	);

	useNuiEvent(
		"updateIncidentEvidence",
		async (data: { imageLabel: string; imageURL: string }) => {
			setIncidentEvidence((prev) => [
				...prev,
				{
					label: data.imageLabel,
					image: data.imageURL,
				},
			]);
		}
	);

	useEffect(() => {
		const keyDownHandler = async (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				fetchNui("exit");
			}
		};

		// Add event listener
		window.addEventListener("keydown", keyDownHandler);

		// Cleanup function to remove the event listener
		return () => {
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, []);

	return (
		<div className={`app-container ${isMouseOutsideMdt && "opacity"}`}>
			<Transition transition='slide-up' mounted={showApp}>
				{(style) => (
					<div
						className='mdt'
						style={{ ...style }}
						onMouseEnter={() => {
							setIsMouseOutsideMdt(false);
						}}
						onMouseLeave={() => {
							setIsMouseOutsideMdt(isEnvBrowser() ? false : true);
						}}
					>
						<Sidebar />
						<ModalsProvider>
							<Routes>
								<Route path='/' element={<Dashboard />} />
								<Route path='/profiles' element={<Profiles />} />
								<Route path='/incidents' element={<Incidents />} />
								<Route path='reports' element={<Reports />} />
								<Route path='vehicles' element={<Vehicles />} />
								<Route path='/dispatch' element={<Dispatch />} />
								<Route path='/roster' element={<Roster />} />
								<Route path='/charges' element={<Charges />} />
								<Route
									path='/codesAndCommands'
									element={<CodesAndCommands />}
								/>
							</Routes>
						</ModalsProvider>
					</div>
				)}
			</Transition>
		</div>
	);
};

export default MDT;
