import { Switch } from "@mantine/core";

interface Props {
	mapLayer: string;
	setMapLayer: (mapLayer: "game" | "render" | "print") => void;
}

const MapLayerSettings = (props: Props) => {
	return (
		<div
			style={{
				position: "absolute",
				width: "auto",
				padding: 10,
				height: "auto",
				left: 10,
				top: 10,
				backgroundColor: "rgb(36, 37, 39)",
				borderRadius: 10,
				display: "flex",
				flexDirection: "row",
				gap: 10,
				zIndex: 9999,
			}}
		>
			<Switch
				label='Game'
				radius='sm'
				checked={props.mapLayer === "game"}
				onChange={() => props.setMapLayer("game")}
			/>
			<Switch
				label='Print'
				radius='sm'
				checked={props.mapLayer === "print"}
				onChange={() => props.setMapLayer("print")}
			/>
			<Switch
				label='Satellite'
				radius='sm'
				checked={props.mapLayer === "render"}
				onChange={() => props.setMapLayer("render")}
			/>
		</div>
	);
};

export default MapLayerSettings;
