import React, { useState } from "react";
import { createStyles, Stack } from "@mantine/core";
import { Call, Unit } from "../../typings";
import DispatchNotification from "./components/DispatchNotification";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { convertUnitsToArray } from "../../helpers";
import { useCallsStore } from "../../stores/dispatch/calls";
import useConfigStore from "../../stores/configStore";

const useStyles = createStyles((theme) => ({
	notificationsContainer: {
		right: 0,
		top: 0,
		justifyContent: "right",
		alignItems: "center",
		position: "absolute",
		width: 475,
		height: "100%",
		padding: theme.spacing.sm,
		zIndex: 0,
	},
}));

export type EditCallResponseData = {
	units: { [key: string]: Omit<Unit, "id"> };
	id: number;
};

const DispatchNotifications: React.FC = () => {
	const { config } = useConfigStore();
	const { classes } = useStyles();
	const [queue, setQueue] = useState<Call[]>([]);
	const { addCall, updateCallUnits } = useCallsStore();

	useNuiEvent("addCall", async (data: Call) => {
		setQueue((prev) => [data, ...prev]);
		addCall(data);
	});

	useNuiEvent("editCallUnits", async (data: EditCallResponseData) => {
		const units = convertUnitsToArray(data.units);
		setQueue((prev) =>
			prev.map((prevCall) =>
				prevCall.id === data.id ? { ...prevCall, units } : prevCall
			)
		);
		updateCallUnits(data.id, units);
	});

	if (!config.isDispatchEnabled) return;

	return (
		<Stack className={classes.notificationsContainer} spacing={6}>
			{queue.map((call) => (
				<DispatchNotification call={call} key={call.id} setQueue={setQueue} />
			))}
		</Stack>
	);
};

export default DispatchNotifications;
