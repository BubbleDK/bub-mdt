import {
	rem,
	Input,
	Divider,
	Text,
	ScrollArea,
	Center,
	Loader,
} from "@mantine/core";
import { IconSearch, IconCar } from "@tabler/icons-react";
import "../index.css";
import { useState, useEffect } from "react";
import { PartialVehicleData } from "../../../../../typings";
import locales from "../../../../../locales";
import useVehiclesStore from "../../../../../stores/vehicles/vehicles";
import { capitalizeFirstLetter } from "../../../../../helpers";

interface VehicleListProps {
	handleVehicleClick: (vehicle: PartialVehicleData) => void;
}

const VehicleList = (props: VehicleListProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const { getVehicles } = useVehiclesStore();
	const [vehicles, setVehicles] = useState<PartialVehicleData[]>([]);
	const [filteredVehicles, setFilteredVehicles] =
		useState<PartialVehicleData[]>(vehicles);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			return await getVehicles();
		};

		fetchData().then((data) => {
			setVehicles(data);
			setFilteredVehicles(data);
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredVehicles(vehicles);
		} else {
			const results = vehicles.filter(
				(vehicle) =>
					(vehicle.plate || "")
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					(vehicle.model || "")
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
			);
			setFilteredVehicles(results);
		}
	}, [searchQuery, filteredVehicles]);

	return (
		<div className='vehicle-content-list-width'>
			<div className='card-background'>
				<div className='card-title'>
					<Text style={{ fontSize: 17, color: "white" }} weight={500}>
						{locales.vehicles}
					</Text>

					<IconCar size={rem(25)} color='white' />
				</div>

				<Input
					icon={<IconSearch />}
					variant='filled'
					placeholder={locales.search}
					mt={10}
					mb={10}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				<Divider mt={5} mb={5} />

				<div className='Vehicles-card-content'>
					<ScrollArea h={860}>
						<div className='Vehicles-card-content-flex'>
							{isLoading ? (
								<Center h={"100%"}>
									<Loader />
								</Center>
							) : (
								filteredVehicles.length > 0 &&
								filteredVehicles.map((vehicle) => (
									<div
										className='vehicles-card'
										onClick={() => props.handleVehicleClick(vehicle)}
										key={vehicle.plate}
									>
										<Text weight={600} style={{ fontSize: 14, color: "white" }}>
											{capitalizeFirstLetter(vehicle.model)}
										</Text>

										<Text weight={500} style={{ fontSize: 10, color: "white" }}>
											{vehicle.plate}
										</Text>
									</div>
								))
							)}
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
};

export default VehicleList;
