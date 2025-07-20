import React from "react";
import { Popup } from "react-leaflet";
import { createStyles } from "@mantine/core";

interface Props {
	children?: React.ReactNode;
}

const useStyles = createStyles((theme) => ({
	popup: {
		"> .leaflet-popup-content-wrapper": {
			backgroundColor: "#2C2E33",
			color: theme.colors.dark[0],
			"> .leaflet-popup-content": {
				margin: 0,
				width: "fit-content",
				padding: 8,
			},
		},
		".leaflet-popup-tip": {
			backgroundColor: "#2C2E33",
		},
	},
}));

const MarkerPopup = (props: Props) => {
	const { classes } = useStyles();

	return (
		<Popup closeButton={false} className={classes.popup}>
			{props.children}
		</Popup>
	);
};

export default MarkerPopup;
