import React from 'react'
import * as ReactDOMServer from 'react-dom/server';
import { GiPistolGun } from "react-icons/gi";
import { MdCarRental } from 'react-icons/md';
import { ImLocation } from 'react-icons/im';
import { FaCarCrash } from 'react-icons/fa';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "./DispatchMarkerStyle.css";
import { AlertTypes, DispatchAlerts } from '../../../typings';
import { Flex, Badge, Title, Button, Group, Text, createStyles } from "@mantine/core";
import { IconClockFilled, IconCar, IconMan, IconBadgeSd } from "@tabler/icons-react";
import { timeAgo } from "../../../utils/convertDateToTime";

const useStyles = createStyles((theme) => ({
	icon: {
		color: "white",
	},
	text: {
		color: "#b7b7b7",
	},
}));

const DispatchMarker = (props: DispatchAlerts) => {
  const { classes } = useStyles();
  const variantMapping: AlertTypes = {
    default: <ImLocation color='black' size={25} />,
    '10-71': <GiPistolGun color='black' size={25} />,
    '10-60': <MdCarRental color='black' size={25} />,
    '10-50': <FaCarCrash color='black' size={25} />
  }

  return (
		<>
			{props.alerts.map((alert) => (
				<Marker
					key={alert.id}
					position={[alert.CoordsY, alert.CoordsX]}
					icon={L.divIcon({
						className: "custom-icon",
						iconSize: [25, 25],
						html: ReactDOMServer.renderToString(
							variantMapping[alert.displayCode || "default"]
						),
					})}
				>
					<Popup>
						<Flex
							gap={5}
							justify='flex-start'
							align='center'
							direction='row'
							wrap='wrap'
						>
							<Badge>#{alert.id} | {alert.displayCode}</Badge>
							<Title order={6} style={{ color: "#b7b7b7" }}>
								{alert.alertName}
							</Title>
						</Flex>

            <Group noWrap>
              <div>
                <Group noWrap spacing={10} mt={10}>
                  <IconClockFilled
                    stroke={1.5}
                    size='1rem'
                    className={classes.icon}
                  />
                  <Text fz='xs' fw={500} className={classes.text}>
                    {timeAgo(alert.time)}
                  </Text>
                </Group>

                <Group noWrap spacing={10} mt={2}>
                  <IconMan
                    stroke={1.5}
                    size='1rem'
                    className={classes.icon}
                  />
                  <Text fz='xs' fw={500} className={classes.text}>
                    {alert.gender}
                  </Text>
                </Group>

                {alert.displayCode === '10-71' && (
                  <Group noWrap spacing={10} mt={2}>
                    <GiPistolGun className={classes.icon} size={17} />
                    <Text fz='xs' fw={500} className={classes.text}>
                      {alert.weapon}
                    </Text>
                  </Group>
                )}

                {alert.displayCode === '10-60' && (
                  <Group noWrap spacing={10} mt={2}>
                    <IconCar className={classes.icon} size='1rem' />
                    <Text fz='xs' fw={500} className={classes.text}>
                      {alert.vehicleModel}
                    </Text>
                    <IconBadgeSd className={classes.icon} size='1rem' />
                    <Text fz='xs' fw={500} className={classes.text}>
                      {alert.vehiclePlate}
                    </Text>
                  </Group>
                )}
              </div>
            </Group>

            <Group position="center" grow style={{ paddingTop: 15, paddingLeft: 4 }}>
              <Button variant='outline' compact size='xs'>
                Set Waypoint
              </Button>
              <Button variant='outline' compact size='xs'>
                Respond
              </Button>
            </Group>
					</Popup>
				</Marker>
			))}
		</>
	);
}

export default DispatchMarker