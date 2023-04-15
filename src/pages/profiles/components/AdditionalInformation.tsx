import { Paper, Group, ActionIcon, Divider, Text, Tooltip, createStyles } from '@mantine/core'
import { IconDeviceFloppy, IconLinkOff } from '@tabler/icons-react'
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
}));

const AdditionalInformation = () => {
  const { classes, theme } = useStyles();

  return (
    <Paper p='md' withBorder style={{ width: 520, height: 431 }}>
      <Group position='apart'>
				<Text weight={500}>Additional Information</Text>
			</Group>

      <Divider my='sm' />

    </Paper>
  )
}

export default AdditionalInformation