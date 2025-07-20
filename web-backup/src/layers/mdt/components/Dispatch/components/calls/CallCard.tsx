import React from "react";
import {
	Badge,
	Divider,
	Group,
	Menu,
	Stack,
	Text,
	createStyles,
} from "@mantine/core";
import {
	IconArrowBackUp,
	IconCar,
	IconClock,
	IconHelicopter,
	IconMap2,
	IconMapPin,
	IconMotorbike,
	IconSpeedboat,
	IconUnlink,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { Call } from "../../../../../../typings";
import { useDispatchMap } from "../../../../../../stores/dispatch/map";
import { usePersonalDataStore } from "../../../../../../stores";
import { fetchNui } from "../../../../../../utils/fetchNui";
import locales from "../../../../../../locales";
import { gameToMap } from "../../../../../../utils/gameToMap";

interface Props {
	call: Call;
}

const useStyles = createStyles((theme) => ({
	callContainer: {
		background: "#2C2E33",
		boxShadow: theme.shadows.sm,
		padding: theme.spacing.sm,
		borderRadius: theme.radius.sm,
		gap: theme.spacing.xs,
		"&:hover": {
			border: "0.0625rem solid #4D4F54",
			cursor: "pointer",
		},
	},
}));

export const GUNSVG = () => {
	return (
		<svg
			width='18px'
			viewBox='-51.2 -51.2 614.40 614.40'
			xmlns='http://www.w3.org/2000/svg'
			fill='#000000'
			stroke='#000000'
			strokeWidth='0.00512'
			transform='rotate(0)'
		>
			<g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
			<g
				id='SVGRepo_tracerCarrier'
				strokeLinecap='round'
				strokeLinejoin='round'
				stroke='#CCCCCC'
				strokeWidth='1.024'
			></g>
			<g id='SVGRepo_iconCarrier'>
				<path
					fill='#d1d1d1'
					d='M79.238 115.768l-28.51 67.863h406.15l-.273-67.862h-263.83v55.605h-15v-55.605h-16.68v55.605H146.1v-55.605h-17.434v55.605h-15v-55.605H79.238zm387.834 15.96v40.66h18.688v-40.66h-18.688zM56.768 198.63l20.566 32.015L28.894 406.5l101.68 7.174 21.54-97.996h115.74l14.664-80.252 174.55-3.873-.13-32.922H56.767zM263.44 235.85l-11.17 61.142h-96.05l12.98-59.05 12.53-.278-2.224 35.5 14.262 13.576 1.003-33.65 24.69-16.264 43.98-.976z'
				></path>
			</g>
		</svg>
	);
};

const CallCard = ({ call }: Props) => {
	const { classes } = useStyles();
	const map = useDispatchMap();
	const { unit } = usePersonalDataStore((state) => state.personalData);

	const attached = React.useMemo(
		() => call.units.some((u) => u.id === unit),
		[call, unit]
	);

	return (
		<Menu width={150} shadow='md' withArrow>
			<Menu.Target>
				<Stack className={classes.callContainer}>
					<Stack spacing={1}>
						<Group spacing='xs' position='apart' noWrap>
							<Text lineClamp={1} color='white'>
								{call.offense}
							</Text>
						</Group>
						<Badge
							variant='light'
							color={call.isEmergency ? "red" : "blue"}
							sx={{ alignSelf: "flex-start" }}
							radius='sm'
						>
							{call.code}
						</Badge>
					</Stack>
					<Stack spacing={2} c='dark.2'>
						<Group spacing='xs'>
							<IconClock size={16} color='#C1C2C5' />
							<Text size='sm' c={"#C1C2C5"}>
								{dayjs(call.time).fromNow() === "a few seconds ago"
									? "Just now"
									: dayjs(call.time).fromNow()}
							</Text>
						</Group>
						<Group spacing='xs'>
							<IconMap2 size={16} color='#C1C2C5' />
							<Text size='sm' c={"#C1C2C5"}>
								{call.location}
							</Text>
						</Group>
						{call.info &&
							call.info.length > 0 &&
							call.info.map((info) => (
								<Group spacing='xs' key={info.label}>
									{info.icon === "gun" ? (
										<GUNSVG />
									) : (
										<i
											className={`ti ti-${info.icon}`}
											style={{ fontSize: 16, color: "#C1C2C5" }}
										/>
									)}
									<Text size='sm' c={"#C1C2C5"}>
										{info.label}
									</Text>
								</Group>
							))}
					</Stack>
					{call.units.length > 0 && (
						<>
							<Divider
								c={"white"}
								label={locales.respond_units_amount.format(call.units.length)}
								labelPosition='center'
							/>
							<Group spacing='xs'>
								{call.units.map((unit) => (
									<Badge
										color='gray'
										variant='filled'
										key={unit.id}
										leftSection={
											<Stack>
												{unit.type === "car" ? (
													<IconCar size={18} />
												) : unit.type === "motor" ? (
													<IconMotorbike size={18} />
												) : unit.type === "boat" ? (
													<IconSpeedboat size={18} />
												) : (
													<IconHelicopter size={18} />
												)}
											</Stack>
										}
									>
										{unit.name}
									</Badge>
								))}
							</Group>
						</>
					)}
				</Stack>
			</Menu.Target>
			<Menu.Dropdown style={{ top: 175 }}>
				<Menu.Item
					icon={<IconMap2 size={16} />}
					onClick={() => {
						if (map) map.flyTo(gameToMap(call.coords[1], call.coords[0]), 7);
					}}
				>
					{locales.find_on_map}
				</Menu.Item>

				<Menu.Divider />

				<Menu.Item
					icon={<IconMapPin size={16} />}
					onClick={() => {
						fetchNui("setWaypoint", call.coords).then();
					}}
				>
					{locales.set_waypoint}
				</Menu.Item>
				<Menu.Item
					icon={
						attached ? <IconUnlink size={20} /> : <IconArrowBackUp size={20} />
					}
					disabled={unit === undefined}
					onClick={async () => {
						await fetchNui(
							attached ? "detachFromCall" : "respondToCall",
							call.id
						);
					}}
				>
					{attached ? locales.detach_from_call : locales.respond}
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export default CallCard;
