import { Divider, Text, rem, Group, ScrollArea } from "@mantine/core";
import "./index.css";
import { IconCalendar, IconUsersGroup } from "@tabler/icons-react";
import RecentActivity from "./components/RecentActivity";
import AnnouncementsCard from "./components/AnnouncementsCard";
import { useEffect } from "react";
import WarrantsCard from "./components/WarrantsCard";
import { useOfficerStore, usePersonalDataStore } from "../../../../stores";
import DispatchesCard from "./components/DispatchesCard";
import locales from "../../../../locales";
import BolosCard from "./components/BolosCard";
import useConfigStore from "../../../../stores/configStore";

const Dashboard = () => {
	const { config } = useConfigStore();
	const { firstname, lastname } = usePersonalDataStore(
		(state) => state.personalData
	);
	const { activeOfficers, getActiveOfficers } = useOfficerStore();

	useEffect(() => {
		getActiveOfficers();
	}, []);

	return (
		<div className='dashboard'>
			<div className='left-side'>
				<div className='header'>
					<Text style={{ fontSize: 24, color: "white" }} weight={500}>
						{locales.welcome_back.format(firstname, lastname)}
					</Text>
					<Text color='dimmed' size='xs' style={{ display: "flex", gap: 10 }}>
						<IconCalendar size={rem(18)} />{" "}
						<Text color='dimmed' size={14}>
							{new Date().toLocaleDateString("en-EN", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</Text>
					</Text>
				</div>

				<Divider />

				<RecentActivity />

				<div className='content-bottom'>
					<WarrantsCard />

					<AnnouncementsCard />

					<BolosCard />
				</div>
			</div>

			<Divider orientation='vertical' />

			<div className='right-side'>
				<div className='card-background'>
					<ScrollArea h={400}>
						<div className='card-title'>
							<Text style={{ fontSize: 17, color: "white" }} weight={500}>
								{locales.active_officers}
							</Text>

							<div className='right-side-title'>
								<Text style={{ fontSize: 17, color: "white" }} weight={500}>
									{activeOfficers.length}
								</Text>
								<IconUsersGroup size={rem(20)} color='white' />
							</div>
						</div>

						<Divider mt={5} mb={5} />

						<div className='card-content'>
							{activeOfficers.length > 0 ? (
								<div className='active-officers-cards'>
									{activeOfficers.map((officer) => (
										<div className='active-officer-card'>
											<Group style={{ width: "100%" }}>
												<div style={{ flex: 1 }}>
													<Text
														style={{ fontSize: 13, color: "white" }}
														weight={500}
													>
														{officer.firstname} {officer.lastname}
													</Text>

													<Text color='dimmed' size='xs'>
														{locales.callsign}: {officer.callsign}
													</Text>
												</div>

												<Text color='dimmed' size='xs'>
													{locales.attached_unit}: {officer.unitId || "None"}
												</Text>
											</Group>
										</div>
									))}
								</div>
							) : (
								<Text color='dimmed' size='xs'>
									No active officers
								</Text>
							)}
						</div>
					</ScrollArea>
				</div>

				{config.isDispatchEnabled && <DispatchesCard />}
			</div>
		</div>
	);
};

export default Dashboard;
