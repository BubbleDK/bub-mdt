import React from "react";
import { createStyles, rem, Text, Group, SimpleGrid, Paper } from "@mantine/core";
import { IconUserCircle, IconScript, IconFileDescription } from "@tabler/icons-react";
import { useStoreOfficers } from "../../../store/officersStore";

const useStyles = createStyles((theme) => ({
	container: {
		height: 160,
    marginBottom: 15
	},

	value: {
		fontSize: rem(24),
		fontWeight: 700,
		lineHeight: 1,
	},

	diff: {
		lineHeight: 1,
		display: "flex",
		alignItems: "center",
	},

	icon: {
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[3]
				: theme.colors.gray[4],
	},

	title: {
		fontWeight: 700,
		textTransform: "uppercase",
	},
}));

const DashboardStats = () => {
	const { classes } = useStyles();
  const { officers } = useStoreOfficers();
	return (
    <SimpleGrid cols={3} className={classes.container}>
      <Paper withBorder p='md' radius='md'>
        <Group position='apart'>
          <Text size='xs' color='dimmed' className={classes.title}>
            Officers
          </Text>
          <IconUserCircle className={classes.icon} size='1.4rem' stroke={1.5} />
        </Group>

        <Group align='flex-end' spacing='xs' mt={25}>
          <Text className={classes.value}>{officers.length}</Text>
        </Group>

        <Text fz='xs' c='dimmed' mt={7}>
          Total amount of employed officers
        </Text>
      </Paper>
      <Paper withBorder p='md' radius='md'>
        <Group position='apart'>
          <Text size='xs' color='dimmed' className={classes.title}>
            Incidents
          </Text>
          <IconScript className={classes.icon} size='1.4rem' stroke={1.5} />
        </Group>

        <Group align='flex-end' spacing='xs' mt={25}>
          <Text className={classes.value}>396</Text>
        </Group>

        <Text fz='xs' c='dimmed' mt={7}>
          Total amount of incidents created
        </Text>
      </Paper>
      <Paper withBorder p='md' radius='md'>
        <Group position='apart'>
          <Text size='xs' color='dimmed' className={classes.title}>
            Reports
          </Text>
          <IconFileDescription
            className={classes.icon}
            size='1.4rem'
            stroke={1.5}
          />
        </Group>

        <Group align='flex-end' spacing='xs' mt={25}>
          <Text className={classes.value}>546</Text>
        </Group>

        <Text fz='xs' c='dimmed' mt={7}>
          Total amount of reports created
        </Text>
      </Paper>
    </SimpleGrid>
	);
};

export default DashboardStats;
