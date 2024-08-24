import { useEffect, useState } from "react";
import {
	Box,
	createStyles,
	Navbar,
	Group,
	getStylesRef,
	rem,
	Image,
	Text,
	ScrollArea,
	Divider,
} from "@mantine/core";
import { NavLink, useLocation } from "react-router-dom";
import {
	IconLayoutDashboard,
	IconGavel,
	IconUserShield,
	IconScript,
	IconFileDescription,
	IconMap2,
	IconUsers,
	IconCar,
	IconProps,
	Icon,
} from "@tabler/icons-react";
import LSPDLogo from "../assets/police-logo.png";
import { usePersonalDataStore } from "../../../stores";
import useConfigStore from "../../../stores/configStore";

const useStyles = createStyles((theme) => ({
	link: {
		...theme.fn.focusStyles(),
		display: "flex",
		alignItems: "center",
		textDecoration: "none",
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[2],
		padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
		fontWeight: 500,

		"&:hover": {
			borderRadius: theme.radius.sm,
			background:
				"linear-gradient(90deg, rgba(51,124,255,0.5) 0%, rgba(187,187,187,0) 100%)", // rgba(49, 212, 169, 0.1) GREEN
			color: theme.colorScheme === "dark" ? theme.white : theme.black,

			[`& .${getStylesRef("icon")}`]: {
				color: theme.colorScheme === "dark" ? theme.white : theme.black,
			},
		},
	},

	linkIcon: {
		ref: getStylesRef("icon"),
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[2]
				: theme.colors.gray[6],
		marginRight: theme.spacing.sm,
	},

	linkActive: {
		"&, &:hover": {
			borderRadius: theme.radius.sm,
			background:
				"linear-gradient(90deg, rgba(51,124,255,0.5) 0%, rgba(187,187,187,0) 100%)",
			[`& .${getStylesRef("icon")}`]: {
				color: "white",
			},
		},
	},

	chevron: {
		transition: "transform 200ms ease",
	},
}));

const homeData = [{ link: "", label: "Dashboard", icon: IconLayoutDashboard }];

const pagesData = [
	{ link: "profiles", label: "Profiles", icon: IconUsers },
	{ link: "incidents", label: "Incidents", icon: IconScript },
	{ link: "reports", label: "Reports", icon: IconFileDescription },
	{ link: "vehicles", label: "Vehicles", icon: IconCar },
	{ link: "dispatch", label: "Dispatch", icon: IconMap2 },
	// {link: 'boloWarrants', label: 'Bolos & Warrants', icon: IconZoomExclamation},
];

const staffData = [
	{ label: "Roster", link: "roster", icon: IconUserShield },
	{ label: "Charges", link: "charges", icon: IconGavel },
	// { label: '10 Codes & Commands', link: 'codesAndCommands', icon: IconListCheck }
];

const Sidebar = () => {
	const { config } = useConfigStore();
	const { classes, cx, theme } = useStyles();
	const [activeLink, setActiveLink] = useState("");
	const { firstname, lastname, callSign, role } = usePersonalDataStore(
		(state) => state.personalData
	);
	const location = useLocation();

	const renderLinks = (
		data: {
			label: string;
			link: string;
			icon: React.ForwardRefExoticComponent<
				IconProps & React.RefAttributes<Icon>
			>;
		}[]
	) => {
		return data.map((item) => {
			if (item.link === "dispatch" && !config.isDispatchEnabled) {
				return null;
			}

			return (
				<NavLink
					key={item.link}
					to={`/${item.link}`}
					onClick={() => setActiveLink(item.link)}
					className={cx(classes.link, {
						[classes.linkActive]: activeLink === item.link,
					})}
				>
					<item.icon className={classes.linkIcon} stroke={1.5} />
					<span>{item.label}</span>
				</NavLink>
			);
		});
	};

	useEffect(() => {
		setActiveLink(location.pathname.split("/")[1]);
	}, [location]);

	return (
		<Navbar
			p='xs'
			style={{
				backgroundColor: "#242527",
				borderTopLeftRadius: 5,
				borderBottomLeftRadius: 5,
				maxWidth: 300,
				height: "100%",
			}}
		>
			<Navbar.Section>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Image
						radius={"md"}
						width={150}
						height={150}
						fit='contain'
						src={LSPDLogo}
						alt='LSPD Logo'
					/>
				</div>
				<Divider my='sm' />
				<ScrollArea h={632} scrollbarSize={2}>
					<Text size='xs' weight={500} color='dimmed' style={{ margin: 8 }}>
						Home
					</Text>
					{renderLinks(homeData)}
					<Text size='xs' weight={500} color='dimmed' style={{ margin: 8 }}>
						Pages
					</Text>
					{renderLinks(pagesData)}
					<Text size='xs' weight={500} color='dimmed' style={{ margin: 8 }}>
						Staff
					</Text>
					{renderLinks(staffData)}
				</ScrollArea>
			</Navbar.Section>
			<Box
				sx={{
					paddingTop: 5,
					borderTop: `${rem(1)} solid ${
						theme.colorScheme === "dark"
							? theme.colors.dark[4]
							: theme.colors.gray[2]
					}`,
				}}
			>
				<div
					style={{
						display: "block",
						width: "100%",
						color: "#e9ecef",
						padding: "0.625rem",
					}}
				>
					<Group>
						<Box sx={{ flex: 1 }}>
							<Text size='sm' weight={500}>
								{firstname} {lastname}
							</Text>
							<Text color='dimmed' size='xs'>
								{role} | {callSign}
							</Text>
						</Box>
					</Group>
				</div>
			</Box>
		</Navbar>
	);
};

export default Sidebar;
