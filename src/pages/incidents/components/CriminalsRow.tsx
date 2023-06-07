import React from 'react'
import { ActionIcon, Group, Paper, Tooltip, Text, createStyles, Divider } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
	action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },
}));

const CriminalsRow = () => {
  const { classes, theme } = useStyles();
  return (
    <Paper p='md' withBorder style={{width: 450, backgroundColor: 'rgb(34, 35, 37)'}}>
      <Group position='apart'>
        <Text weight={500} c={'white'}>Involved Criminals</Text>
        <Tooltip label='Add criminal' withArrow color='dark' position='bottom'>
          <ActionIcon className={classes.action} onClick={() => { }}>
            <IconPlus size={16} />
          </ActionIcon>
        </Tooltip>
			</Group>

      <Divider my='sm' />
    </Paper>
  )
}

export default CriminalsRow