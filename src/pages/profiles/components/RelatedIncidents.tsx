import { ActionIcon, Group, Paper, Tooltip, Text, createStyles, Divider, ScrollArea, Menu, Stack, UnstyledButton } from '@mantine/core'
import { IconChevronRight, IconDeviceFloppy, IconLinkOff, IconListDetails } from '@tabler/icons-react'
import React from 'react'

const useStyles = createStyles((theme) => ({
	action: {
		backgroundColor: theme.colors.dark[2],
		...theme.fn.hover({
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[5]
					: theme.colors.gray[1],
		}),
	},

  user: {
    display: 'block',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },

  item : {
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingRight: '10px',
    paddingLeft: '10px',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,

    '&:hover': {
      backgroundColor: '#17181b',
    },
  }
}));

const RelatedIncidents = () => {
  const { classes, theme } = useStyles();
  return (
    <Paper p='md' withBorder style={{ width: 575, height: 431 }}>
      <Group position='apart'>
				<Text weight={500}>Related Incidents</Text>
			</Group>

      <Divider my='sm' />

      <ScrollArea h={350}>
        <Stack spacing="xs">
          <UnstyledButton className={classes.user}>
            <Menu withArrow>
              <Menu.Target>
                <Group className={classes.item}>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                      {"incident.title"}
                    </Text>

                    <Text color="dimmed" size="xs">
                      ID: {"incident.id"}
                    </Text>
                  </div>

                  {<IconChevronRight size={14} stroke={1.5} />}
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<IconListDetails size={14}/>}>View Incident</Menu.Item>

              </Menu.Dropdown>
            </Menu>
          </UnstyledButton>
        </Stack>
      </ScrollArea>

    </Paper>
  )
}

export default RelatedIncidents