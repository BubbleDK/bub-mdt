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
import { Flex, Badge, Title, Button, Group, Text } from "@mantine/core";
import { IconClockFilled, IconCar } from "@tabler/icons-react";
import { timeAgo } from "../../../utils/convertDateToTime";

const DispatchMarker = (props: DispatchAlerts) => {
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
                <Group noWrap spacing={7} ml={5} mt={10}>
                  <IconClockFilled
                    stroke={1.5}
                    size='1rem'
                    style={{color: "white"}}
                  />
                  <Text fz='xs' fw={500} style={{color: "#b7b7b7"}}>
                    {timeAgo(alert.time)}
                  </Text>
                </Group>
                <Group noWrap spacing={7} ml={5} mt={5}>
                  <IconCar
                    stroke={1.5}
                    size='1rem'
                    style={{color: "white"}}
                  />
                  <Text fz='xs' fw={500} style={{color: "#b7b7b7"}}>
                    {"Adder"}
                  </Text>
                </Group>
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