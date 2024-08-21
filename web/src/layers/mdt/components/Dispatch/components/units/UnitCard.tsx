import React from "react";
import {
	ActionIcon,
	Badge,
	createStyles,
	Group,
	Menu,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import {
	IconCar,
	IconDots,
	IconEdit,
	IconHelicopter,
	IconLogout,
	IconMotorbike,
	IconSpeedboat,
	IconUsers,
} from "@tabler/icons-react";
import { Unit } from "../../../../../../typings";
import { fetchNui } from "../../../../../../utils/fetchNui";
import { useDispatchMap } from "../../../../../../stores/dispatch/map";
import { usePersonalDataStore } from "../../../../../../stores";
import { modals } from "@mantine/modals";
import ManageOfficersModal from "../modals/ManageOfficersModal";
import locales from "../../../../../../locales";
import { gameToMap } from "../../../../../../utils/gameToMap";

const useStyles = createStyles((theme) => ({
	unitContainer: {
		background: "#2C2E33",
		boxShadow: theme.shadows.md,
		padding: theme.spacing.md,
		borderRadius: theme.radius.sm,
		lineHeight: "normal",
		color: "white",
	},
	memberBadge: {
		color: "white",
		backgroundColor: "#343a40",
		"&:hover": {
			backgroundColor: "#4e5861",
			cursor: "pointer",
		},
	},
}));

const UnitCard: React.FC<{ unit: Unit; isInThisUnit: boolean }> = ({
	unit,
	isInThisUnit,
}) => {
	const { classes } = useStyles();
	const { setPersonalData } = usePersonalDataStore();
	const map = useDispatchMap();

	return (
		<Stack className={classes.unitContainer}>
			<Group position='apart'>
				<Group spacing='xs'>
					{unit.type === "car" ? (
						<IconCar color='white' />
					) : unit.type === "motor" ? (
						<IconMotorbike color='white' />
					) : unit.type === "boat" ? (
						<IconSpeedboat color='white' />
					) : (
						<IconHelicopter color='white' />
					)}
					·<Text color='white'>{unit.name}</Text>
				</Group>
				<Group spacing={8}>
					<Menu
						withArrow
						width={150}
						position='bottom'
						transitionProps={{ transition: "pop" }}
						withinPortal
					>
						<Menu.Target>
							<ActionIcon disabled={!isInThisUnit}>
								<IconDots size='1rem' stroke={1.5} />
							</ActionIcon>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Item
								icon={<IconEdit size='0.9rem' stroke={1.5} />}
								disabled={!isInThisUnit}
								onClick={() => {
									modals.open({
										centered: true,
										title: (
											<Text
												style={{ fontSize: 17, color: "white" }}
												weight={500}
											>
												{locales.manage_members}
											</Text>
										),
										children: (
											<ManageOfficersModal
												id={unit.id}
												members={unit.members}
											/>
										),
									});
								}}
							>
								{locales.manage_members}
							</Menu.Item>
							<Menu.Item
								icon={<IconLogout size='0.9rem' stroke={1.5} />}
								onClick={async () => {
									await fetchNui("leaveUnit", { data: 1 });
									setPersonalData((prev) => ({ ...prev, unit: undefined }));

									return;
								}}
							>
								{locales.leave_unit}
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Group>
			</Group>
			<div className='unit-members'>
				<Tooltip
					label={locales.members_capitalized}
					color='gray'
					withArrow
					position='bottom'
				>
					<IconUsers stroke={1.5} size='1rem' color='white' />
				</Tooltip>
				{unit.members.length > 0 && (
					<Group spacing='xs'>
						{unit.members.map((member) => (
							<Badge
								radius='sm'
								key={member.citizenid}
								onClick={() =>
									map &&
									map.flyTo(
										gameToMap(member.position[0], member.position[1]),
										7
									)
								}
								className={classes.memberBadge}
							>
								{member.callsign ? `(${member.callsign})` : ""}{" "}
								{member.firstname} {member.lastname}
							</Badge>
						))}
					</Group>
				)}
			</div>
		</Stack>
	);
};

export default React.memo(UnitCard);
