import { useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet";
import Map from "./Map";
import OfficerMarkers from "./OfficerMarkers";
import CallMarkers from "./CallMarkers";
import { useSetDispatchMap } from "../../../../../stores/dispatch/map";
import MapLayerSettings from "./MapLayerSettings";

const chosenLayer = JSON.parse(localStorage.getItem("mapLayer") || '"game"');

const MapWrapper = () => {
	const theme = useMantineTheme();
	const setMap = useSetDispatchMap();
	const [mapLayer, setMapLayer] = useState<"game" | "render" | "print">(
		chosenLayer
	);
	const [mapBackgroundColor, setMapBackgroundColor] = useState(
		mapLayer === "game"
			? "#384950"
			: mapLayer === "render"
			? "rgb(13 43 79)"
			: "rgb(78 177 208)"
	);

	const CRS = L.CRS.Simple;

	useEffect(() => {
		localStorage.setItem("mapLayer", JSON.stringify(mapLayer));
	}, [mapLayer]);

	return (
		<MapContainer
			key={mapLayer}
			center={[-119.43, 58.84]}
			maxBoundsViscosity={1.0}
			preferCanvas
			ref={setMap}
			zoom={2}
			zoomControl={false}
			crs={CRS}
			style={{
				width: "100%",
				height: "100%",
				borderRadius: theme.radius.md,
				zIndex: 1,
				backgroundColor: mapBackgroundColor,
			}}
		>
			<Map mapLayer={mapLayer} />
			<MapLayerSettings
				mapLayer={mapLayer}
				setMapLayer={(chosenLayer) => {
					setMapBackgroundColor(
						chosenLayer === "game"
							? "#384950"
							: chosenLayer === "render"
							? "rgb(13 43 79)"
							: "rgb(78 177 208)"
					);
					setMapLayer(chosenLayer);
				}}
			/>
			<OfficerMarkers />
			<React.Suspense>
				<CallMarkers />
			</React.Suspense>
		</MapContainer>
	);
};

export default MapWrapper;
