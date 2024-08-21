import './index.css'
import { LoadingOverlay } from '@mantine/core';
import CustomLoader from '../CustomLoader';
import { useState } from 'react';
import { PartialVehicleData, Vehicle } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import useVehiclesStore, { DEBUG_VEHICLE1, DEBUG_VEHICLE2 } from '../../../../stores/vehicles/vehicles';
import VehicleList from './components/VehicleList';
import VehicleInformation from './components/VehicleInformation';

const Vehicles = () => {
  const [loading, setLoading] = useState(false);
  const { setSelectedVehicle, setIsVehicleBOLO, setBOLOExpirationDate } = useVehiclesStore();
  const DEBUG_VEH = (Math.random() * 10) > 5 ? DEBUG_VEHICLE1 : DEBUG_VEHICLE2

  const handleVehicleClick = async (vehicle: PartialVehicleData) => {
    setLoading(true);
    setSelectedVehicle(null);
    const resp = await fetchNui<Vehicle>('getVehicle', { plate: vehicle.plate }, {
      data: {
        ...DEBUG_VEH,
      },
    });

    const isVehicleBolo = await fetchNui<boolean>('isVehicleBOLO', { plate: vehicle.plate }, {
      data: false,
    });

    if (isVehicleBolo) {
      const BOLODate = await fetchNui<string>('getBOLOExpirationDate', { plate: vehicle.plate }, {
        data: '12/12/2024',
      });

      setBOLOExpirationDate(BOLODate);
    }

    setLoading(false);
    setSelectedVehicle(resp);
    setIsVehicleBOLO(isVehicleBolo);
  }

  return (
		<div className='vehicles'>
      <VehicleList handleVehicleClick={handleVehicleClick} />

      <LoadingOverlay visible={loading} overlayOpacity={0.97} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={CustomLoader} style={{ left: 1029, width: 700, height: '95.75%', top: 19, borderRadius: '0.25rem'}} />
      <VehicleInformation />
		</div>
	);
}

export default Vehicles;