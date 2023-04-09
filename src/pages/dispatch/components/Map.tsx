import React, { useEffect, forwardRef, useImperativeHandle, Ref, PropsWithChildren } from "react";
import { ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';

type RefType = {
  flyToPos: (coordsY: number, coordsX: number) => void;
}

const Map = (props: PropsWithChildren<{}>, ref: Ref<RefType>) => {
  const customImageUrl = "https://i1.lensdump.com/i/gj7atT.png";
	const map = useMap();

  const flyToPos = (coordsY: number, coordsX: number) => {
    map.flyTo([coordsY, coordsX], 6);
  }

  useImperativeHandle(ref, () => ({ flyToPos }));
  
	const mapbounds = new L.LatLngBounds(
		map.unproject([0, 1024], 3 - 1),
		map.unproject([1024, 0], 3 - 1)
	);

	map.attributionControl.setPrefix(false);
	map.setMaxBounds(mapbounds);
	map.setView([0, 0], 2);
    
	return <ImageOverlay url={customImageUrl} bounds={mapbounds} />;
};

export default forwardRef(Map);
