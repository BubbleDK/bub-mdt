import React, { useEffect } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { Badge, Group, Stack, Text } from "@mantine/core";
import MarkerPopup from "./MarkerPopup";
import { useCalls, useFetchCalls } from "../../../../../stores/dispatch/calls";
import { GUNSVG } from "./calls/CallCard";
import { IconClock, IconMap2 } from "@tabler/icons-react";
import dayjs from "dayjs";
import { gameToMap } from "../../../../../utils/gameToMap";

const CallMarkers = () => {
	const calls = useCalls();
	const fetchCalls = useFetchCalls();

	useEffect(() => {
		fetchCalls();
	}, [fetchCalls]);

	return (
		<>
			{calls.length > 0 &&
				calls.map((call) => (
					<Marker
						key={call.id}
						position={gameToMap(call.coords[1], call.coords[0])}
						icon={L.icon({
							iconSize: [26, 26],
							iconUrl: `./blips/${call.blip}.png`,
						})}
					>
						<MarkerPopup>
							<div
								style={{
									minWidth: 150,
									display: "flex",
									flexDirection: "column",
									gap: 7,
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										gap: 5,
										alignItems: "center",
									}}
								>
									<Badge
										variant='light'
										color={call.isEmergency ? "red" : "blue"}
										sx={{ alignSelf: "flex-start" }}
										radius='sm'
									>
										{call.code}
									</Badge>
									<Text fz={14} c={"white"}>
										{call.offense}
									</Text>
								</div>

								<Stack spacing={2} c='dark.2'>
									<Group spacing='xs'>
										<IconClock size={16} color='#C1C2C5' />
										<Text size='sm' c={"#C1C2C5"}>
											{dayjs(call.time).fromNow() === "a few seconds ago"
												? "Just now"
												: dayjs(call.time).fromNow()}
										</Text>
									</Group>
									<Group spacing='xs'>
										<IconMap2 size={16} color='#C1C2C5' />
										<Text size='sm' c={"#C1C2C5"}>
											{call.location}
										</Text>
									</Group>
									{call.info &&
										call.info.length > 0 &&
										call.info.map((info) => (
											<Group spacing='xs' key={info.label}>
												{info.icon === "gun" ? (
													<GUNSVG />
												) : (
													<i
														className={`ti ti-${info.icon}`}
														style={{ fontSize: 16, color: "#C1C2C5" }}
													/>
												)}
												<Text size='sm' c={"#C1C2C5"}>
													{info.label}
												</Text>
											</Group>
										))}
								</Stack>
							</div>
						</MarkerPopup>
					</Marker>
				))}
		</>
	);
};

export default CallMarkers;
