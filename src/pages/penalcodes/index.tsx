import React from 'react'
import { Title, Container, createStyles, Paper, Group, Button } from '@mantine/core';
import { IconSlash } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl})`,
    paddingBottom: `calc(${theme.spacing.xl})`,
    marginRight: `calc(${theme.spacing.xl})`,
    marginLeft: `calc(${theme.spacing.xl})`,
    width: '100%', 
    maxWidth: 1500,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    color: '#c1c2c5',
    fontSize: 22,
  },
}));


const PenalCodes = () => {
  const { classes } = useStyles();
  return (
    <Container className={classes.wrapper}>
      <Paper p='xl' withBorder style={{ height: 80 }}>
        <Group position='apart'>
          <Title className={classes.title}>Penal Codes</Title>
          <Group position="center" spacing={0.5}>
          <Button variant="default" color="gray" style={{marginRight: 10}}>
              Create A New Penal Code
            </Button>
          </Group>
        </Group>
      </Paper>
    </Container>
  )
}

export default PenalCodes