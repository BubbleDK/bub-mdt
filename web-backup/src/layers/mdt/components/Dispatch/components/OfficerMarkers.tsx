import React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Text } from "@mantine/core";
import { Marker } from "react-leaflet";
import L from "leaflet";
import MarkerPopup from "./MarkerPopup";
import { Officer } from "../../../../../typings";
import { debugData } from "../../../../../utils/debugData";
import { useNuiEvent } from "../../../../../hooks/useNuiEvent";
import { IconBadgesFilled, IconUsersGroup } from "@tabler/icons-react";
import { gameToMap } from "../../../../../utils/gameToMap";

const PoliceManIcon = () => {
	return (
		<svg
			viewBox='0 0 48 48'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={{ fill: "rgb(19 90 155)" }}
		>
			<path d='M16.8786 29.0308C17.3814 28.9073 18.1254 29.6279 18.1254 29.6279C18.1254 29.6279 23.5329 32.9996 23.5474 32.9996C24.2271 32.9997 29.8746 29.6279 29.8746 29.6279C29.8746 29.6279 30.6186 28.9073 31.1214 29.0308C36.5255 30.3589 42 33.0668 42 37.1404V43.9997H6V37.1404C6 33.0668 11.4745 30.3589 16.8786 29.0308ZM12 38C12 37.4477 12.4477 37 13 37H18C18.5523 37 19 37.4477 19 38C19 38.5523 18.5523 39 18 39H13C12.4477 39 12 38.5523 12 38ZM33.1975 34.1503C33.1353 33.9499 32.8647 33.9499 32.8026 34.1503L32.2367 35.9749C32.2089 36.0645 32.1291 36.1252 32.0392 36.1252H30.208C30.0069 36.1252 29.9232 36.3949 30.086 36.5187L31.5675 37.6464C31.6403 37.7019 31.6707 37.8 31.6429 37.8896L31.077 39.7143C31.0148 39.9146 31.2338 40.0813 31.3965 39.9575L32.878 38.8297C32.9508 38.7744 33.0493 38.7744 33.1221 38.8297L34.6035 39.9575C34.7662 40.0813 34.9852 39.9146 34.923 39.7143L34.3571 37.8896C34.3293 37.8 34.3598 37.7019 34.4326 37.6464L35.914 36.5187C36.0768 36.3949 35.9931 36.1252 35.792 36.1252H33.9608C33.8709 36.1252 33.7911 36.0645 33.7633 35.9749L33.1975 34.1503Z' />
			<path d='M15 18V15H17V18C17 21.866 20.134 25 24 25C27.866 25 31 21.866 31 18V15H33V18C33 22.9706 28.9706 27 24 27C19.0294 27 15 22.9706 15 18Z' />
			<path d='M14.0214 14.4106C14.0668 14.1728 14.2845 14 14.5386 14H33.4614C33.7155 14 33.9332 14.1728 33.9786 14.4106L33.9788 14.4118L33.9791 14.413L33.9796 14.4159L33.9808 14.4227L33.9837 14.4409C33.9858 14.455 33.9882 14.4731 33.9905 14.4948C33.9951 14.5383 33.9993 14.5967 33.9999 14.6678C34.0011 14.8101 33.988 15.0048 33.9341 15.2341C33.8251 15.6976 33.5533 16.2868 32.9308 16.8594C31.6967 17.9946 29.1612 19 24 19C18.8388 19 16.3033 17.9946 15.0692 16.8594C14.4467 16.2868 14.1749 15.6976 14.0659 15.2341C14.012 15.0048 13.9989 14.8101 14.0001 14.6678C14.0007 14.5967 14.0049 14.5383 14.0095 14.4948C14.0118 14.4731 14.0142 14.455 14.0163 14.4409L14.0192 14.4227L14.0204 14.4159L14.0209 14.413L14.0212 14.4118L14.0214 14.4106Z' />
			<path d='M13.6884 12C13.6124 11.8803 13.5349 11.76 13.457 11.6388L13.4569 11.6388C12.7488 10.5389 12 9.37587 12 8.09677C12 7.29597 12.5203 6.62166 13.209 6.08848C15.769 4.10661 24 3 24 3C24 3 32.231 4.10662 34.791 6.08848C35.4797 6.62166 36 7.29597 36 8.09677C36 9.55508 35.1742 10.8143 34.3907 12H13.6884ZM26.5 7.33333C26.5 7.33333 24.6667 6.66667 24 6C23.3333 6.66667 21.5 7.33333 21.5 7.33333C21.5 7.33333 22 11 24 11C26 11 26.5 7.33333 26.5 7.33333Z' />
		</svg>
	);
};

const OfficerMarkers = () => {
	const [officers, setOfficers] = React.useState<Officer[]>([]);

	debugData<Officer[]>([
		{
			data: [
				{
					firstname: "John",
					lastname: "Snow",
					position: [0, 0, 0],
					citizenid: "391231",
					playerId: 1,
					callsign: 102,
				},
				{
					firstname: "Billy",
					lastname: "Bob",
					position: [250, 250, 250],
					callsign: 564,
					citizenid: "312351",
					playerId: 2,
				},
				{
					firstname: "Merry",
					lastname: "Jane",
					position: [300, 1000, 0],
					callsign: 751,
					citizenid: "103214",
					playerId: 3,
					unitId: 2,
				},
			],
			action: "updateOfficerPositions",
		},
	]);

	useNuiEvent<Officer[]>("updateOfficerPositions", (data) => {
		setOfficers(data);
	});

	return (
		<>
			{officers.length > 0 &&
				officers.map((officer) => (
					<Marker
						key={officer.citizenid}
						position={gameToMap(officer.position[1], officer.position[0])}
						icon={L.divIcon({
							className: "custom-icon",
							iconSize: [24, 24],
							html: ReactDOMServer.renderToString(<PoliceManIcon />),
						})}
					>
						<MarkerPopup>
							<div
								style={{
									minWidth: 130,
									display: "flex",
									flexDirection: "column",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										gap: 10,
									}}
								>
									<Text c={"white"} fz={14}>
										{officer.firstname} {officer.lastname}
									</Text>

									<div
										style={{ display: "flex", gap: 0, alignItems: "center" }}
									>
										<IconBadgesFilled size={18} />

										<Text c={"white"} fz={14}>
											{officer.callsign}
										</Text>
									</div>
								</div>

								{officer.unitId && (
									<div
										style={{ display: "flex", gap: 5, alignItems: "center" }}
									>
										<IconUsersGroup size={18} />

										<Text size='sm' c={"#C1C2C5"}>
											Unit {officer.unitId}
										</Text>
									</div>
								)}
							</div>
						</MarkerPopup>
					</Marker>
				))}
		</>
	);
};

export default OfficerMarkers;
