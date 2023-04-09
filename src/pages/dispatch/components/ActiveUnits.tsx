import React from "react";
import {
	Paper,
	createStyles,
	Badge,
	Text,
	Group,
	ActionIcon,
  Menu
} from "@mantine/core";
import {
	IconCar,
	IconDots,
	IconUsers,
  IconEdit,
  IconLogout
} from "@tabler/icons-react";
import { UnitData } from "../../../typings";
import { useDraggable } from '@dnd-kit/core';
import { useStorePersonal } from "../../../store/personalInfoStore";

const useStyles = createStyles((theme) => ({
	styling: {
		paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 0,
	},
	icon: {
		color: "white",
	},
	text: {
		color: "#b7b7b7",
	},
}));

const ActiveUnits = (props: UnitData) => {
	const { classes } = useStyles();
  const { citizenid } = useStorePersonal();
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: props.id,
  });

	return (
		<div className={classes.styling} ref={setNodeRef} {...listeners} {...attributes}>
			<Paper withBorder sx={(theme) => ({ backgroundColor: theme.colors.dark[8], padding: theme.spacing.xs, borderRadius: theme.radius.sm })}>
        <Group position="apart">
          <Badge color='orange'>{props.unitName}</Badge>
          <Menu
            withArrow
            width={150}
            position="bottom"
            transitionProps={{ transition: 'pop' }}
            withinPortal
          >
            <Menu.Target>
              <ActionIcon>
                <IconDots size="1rem" stroke={1.5} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<IconEdit size="0.9rem" stroke={1.5} />} disabled={props.isOwner !== citizenid}>Edit unit</Menu.Item>
              <Menu.Item icon={<IconLogout size="0.9rem" stroke={1.5} />}>Leave Unit</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
				<Group noWrap>
					<div>
						<Group noWrap spacing={10} mt={10}>
              <IconUsers stroke={1.5} size='1rem' className={classes.icon} />
              <Text fz='xs' fw={500} className={classes.text}>
                {props.unitMembers.map((member, index) => (
                  <span key={index}>{ (index ? ', ' : '') + '(' +  member.callsign + ') | ' + member.firstname + ' ' + member.lastname }</span>
                ))}
              </Text>
						</Group>

						<Group noWrap spacing={10} mt={2}>
							<IconCar stroke={1.5} size='1rem' className={classes.icon} />
							<Text fz='xs' fw={500} className={classes.text}>
								{props.carModel}
							</Text>
						</Group>
					</div>
				</Group>
			</Paper>
		</div>
	);
};

export default ActiveUnits;
