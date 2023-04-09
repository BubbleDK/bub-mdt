import React from "react";
import {
	Paper,
	createStyles,
	Badge,
	Text,
	Group,
	Title,
	Flex,
	Menu,
  ScrollArea,
  Divider,
  ActionIcon,
  rem
} from "@mantine/core";
import {
	IconMapSearch,
	IconMessage2,
	IconMan,
	IconClockFilled,
	IconGps,
	IconCar,
	IconCarOff,
	IconArrowBackUp,
	IconArrowRight,
} from "@tabler/icons-react";
import { timeAgo } from "../../../utils/convertDateToTime";
import { AlertData } from "../../../typings";
import { useDroppable } from '@dnd-kit/core';

const useStyles = createStyles((theme) => ({
	styling: {
		padding: 10,
	},
	icon: {
		color: "white",
	},
	text: {
		color: "#b7b7b7",
	},
	activeCalls: {
		width: 320,
	},
}));

type DispatchAlerts = {
  alert: AlertData,
  parentFunction: Function,
}

const ActiveCalls = (props: DispatchAlerts) => {
	const { classes } = useStyles();
  const { setNodeRef, isOver } = useDroppable({
    id: props.alert.id,
  });
  let isOverContainer = isOver ? "#2C2E33" : "#141517";

  const carButton = (
    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
      <IconCar />
    </ActionIcon>
  );

	return (
    <Menu width={150} shadow='md' withArrow>
      <Menu.Target>
        <Paper
          ref={setNodeRef}
          withBorder
          sx={(theme) => ({
            backgroundColor: isOverContainer,
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            cursor: "pointer",
            marginTop: 5,

            "&:hover": {
              backgroundColor: theme.colors.dark[5],
            },
          })}
        >
          <Flex gap={5} justify='flex-start' align='center' direction='row' wrap='wrap'>
            <Badge color='teal'>#{props.alert.id}</Badge>
            <Badge>{props.alert.displayCode}</Badge>
            <Title order={6} className={classes.text}>
              {props.alert.alertName}
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
                  {timeAgo(props.alert.time)}
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={2}>
                <IconMan
                  stroke={1.5}
                  size='1rem'
                  className={classes.icon}
                />
                <Text fz='xs' fw={500} className={classes.text}>
                  {props.alert.gender}
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={2}>
                <IconMapSearch
                  stroke={1.5}
                  size='1rem'
                  className={classes.icon}
                />
                <Text fz='xs' fw={500} className={classes.text}>
                  {props.alert.location}
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={2}>
                <IconMessage2
                  stroke={1.5}
                  size='1rem'
                  className={classes.icon}
                />
                <Text fz='xs' fw={500} className={classes.text}>
                  {"A nice comment"}
                </Text>
              </Group>
            </div>
          </Group>

          {props.alert.attachedUnits.length > 0 &&
            <Divider my="xs" label="Attached Unites" labelPosition="center" />
          }

          {props.alert.attachedUnits.length > 0 &&
            props.alert.attachedUnits.map((unit, index) => (
              <Badge key={index} radius="xs" leftSection={carButton} style={{marginRight: 5}}>{unit.unitName}</Badge>
            ))
          }
        </Paper>
      </Menu.Target>

      <Menu.Dropdown style={{ top: 175 }}>
        <Menu.Item style={{ padding: "0.425rem 0.65rem" }} icon={<IconArrowRight size={14} />} onClick={() => {props.parentFunction(props.alert.CoordsY, props.alert.CoordsX)}}>
          Go to
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item style={{ padding: "0.425rem 0.65rem" }} icon={<IconGps size={14} />}>
          Set Waypoint
        </Menu.Item>
        <Menu.Item style={{ padding: "0.425rem 0.65rem" }} icon={<IconCar size={14} />}>
          Attach Unit
        </Menu.Item>
        <Menu.Item style={{ padding: "0.425rem 0.65rem" }} icon={<IconCarOff size={14} />}>
          Detach Unit
        </Menu.Item>
        <Menu.Item style={{ padding: "0.425rem 0.65rem" }} icon={<IconArrowBackUp size={14} />}>
          Respond
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
	);
};

export default ActiveCalls;
