import React from "react";
import MapWrapper from "./components/MapWrapper";
import "./index.css";
import Calls from "./components/calls/Calls";
import Units from "./components/units/Units";

// Huge credits to ox_mdt (https://github.com/overextended/ox_mdt) for the dispatch

const Dispatch = () => {
	return (
		<div className='dispatch'>
			<div className='map-wrapper'>
				<MapWrapper />
			</div>

			<div className='active-calls'>
				<Calls />
			</div>

			<div className='active-units'>
				<Units />
			</div>
		</div>
	);
};

export default Dispatch;
