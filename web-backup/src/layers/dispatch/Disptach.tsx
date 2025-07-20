import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import "./dispatch.css";
import { Badge, Divider, Text, ThemeIcon, Title } from "@mantine/core";
import {
	IconArrowLeft,
	IconArrowRight,
	IconCar,
	IconInfoCircle,
	IconMap2,
} from "@tabler/icons-react";
import { Call } from "../../typings";
import dayjs from "dayjs";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { fetchNui } from "../../utils/fetchNui";
import { useCallsStore } from "../../stores/dispatch/calls";
import { convertUnitsToArray } from "../../helpers";
import { EditCallResponseData } from "../notifications/DispatchNotifications";
import useConfigStore from "../../stores/configStore";

const Dispatch: React.FC = () => {
	const { config } = useConfigStore();
	const { calls, setCalls } = useCallsStore();
	const [showMiniDispatch, setShowMiniDispatch] = useState(false);
	const [currentCall, setCurrentCall] = useState<Call | undefined>();
	const [respondKey, setRespondKey] = useState("G");

	useNuiEvent("handleLeftArrowPress", () => {
		if (currentCall === undefined) return;
		if (!showMiniDispatch) return;

		const currentIndex = calls.findIndex((call) => call.id === currentCall.id);
		if (currentIndex === -1 || currentIndex - 1 < 0) return;

		const previousCall = calls[currentIndex - 1];
		setCurrentCall(previousCall);
	});

	useNuiEvent("handleRightArrowPress", () => {
		if (currentCall === undefined) return;
		if (!showMiniDispatch) return;

		const currentIndex = calls.findIndex((call) => call.id === currentCall.id);
		if (currentIndex === -1 || currentIndex + 1 >= calls.length) return;

		const nextCall = calls[currentIndex + 1];
		setCurrentCall(nextCall);
	});

	useEffect(() => {
		const keyDownHandler = async (event: KeyboardEvent) => {
			if (event.key === "i") {
				await fetchNui("hideMiniDisptach");
			}
		};
		window.addEventListener("keydown", keyDownHandler);

		return () => {
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, []);

	useNuiEvent("updateCalls", (data: { calls: Call[] }) => {
		setCalls(data.calls);

		setCurrentCall(data.calls.length > 0 ? data.calls[0] : undefined);
	});

	useNuiEvent("addCall", (data: Call) => {
		setCurrentCall(data);
	});

	useNuiEvent("showMiniDispatch", (data: { currentRespondKey: string }) => {
		setRespondKey(data.currentRespondKey);
		setShowMiniDispatch(true);
	});

	useNuiEvent("hideMiniDispatch", () => {
		setShowMiniDispatch(false);
	});

	useNuiEvent("respondToCall", async (data: { currentRespondKey: string }) => {
		setRespondKey(data.currentRespondKey);
		if (currentCall === undefined) return;

		fetchNui("setWaypoint", currentCall.coords);
		await fetchNui("respondToCall", currentCall.id);
	});

	useNuiEvent("editCallUnits", async (data: EditCallResponseData) => {
		if (!currentCall) return;

		const units = convertUnitsToArray(data.units);
		setCurrentCall({ ...currentCall, units });
	});

	if (!showMiniDispatch) return;
	if (!config.isDispatchEnabled) return;

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "none",
				position: "absolute",
			}}
		>
			<Draggable bounds='parent'>
				<div className='box'>
					<div className='top-bar'>
						<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
							<IconInfoCircle size={20} />
							<Text fz='xs'>
								{currentCall
									? `${calls.indexOf(currentCall) + 1} / ${calls.length}`
									: `0 / ${calls.length}`}
							</Text>
						</div>

						<div>
							<Text fz='sm'>
								{currentCall &&
									(dayjs(currentCall.time).fromNow() === "a few seconds ago"
										? "Just now"
										: dayjs(currentCall.time).fromNow())}
							</Text>
						</div>

						{currentCall && (
							<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
								<IconCar size={20} />
								<Text fz='xs'>{currentCall.units.length}</Text>
							</div>
						)}
					</div>

					<Divider />

					<div
						className='middle'
						style={{ justifyContent: currentCall ? "flex-start" : "center" }}
					>
						{currentCall ? (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 5,
									width: "100%",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Title fz={16} weight={100}>
										{currentCall.offense}
									</Title>

									<Badge
										variant='light'
										color={currentCall.isEmergency ? "red" : "blue"}
										radius='xs'
									>
										{currentCall.code}
									</Badge>
								</div>

								<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
									<IconMap2 size={16} color='gray' />

									<Text fz='xs'>{currentCall.location}</Text>
								</div>
							</div>
						) : (
							<div>
								<Text fz={18}>No active calls</Text>
							</div>
						)}
					</div>

					<Divider />

					<div className='bottom-bar'>
						<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
							<ThemeIcon variant='default' size='sm'>
								<IconArrowLeft />
							</ThemeIcon>

							<Text fz='xs'>Previous</Text>
						</div>

						<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
							<div
								style={{
									border: "0.0625rem solid #373A40",
									borderRadius: "0.25rem",
									padding: "0 5px",
									height: 20,
								}}
							>
								<Text fz='xs'>{respondKey}</Text>
							</div>

							<Text fz='xs'>Respond</Text>
						</div>

						<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
							<ThemeIcon variant='default' size='sm'>
								<IconArrowRight />
							</ThemeIcon>

							<Text fz='xs'>Next</Text>
						</div>
					</div>
				</div>
			</Draggable>
		</div>
	);
};

export default Dispatch;
