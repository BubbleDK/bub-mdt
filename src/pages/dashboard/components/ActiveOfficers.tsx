import React from 'react'
import { Box, Divider, Paper, Title } from '@mantine/core';

const ActiveOfficers = () => {
  return (
    <>
      <Paper p='md' withBorder style={{width: '27%'}}>
        <Divider my='xs' labelPosition='center' label={
          <Title order={5} weight={500}>
            Active Officers
          </Title>}
        />
        <Box>
          
        </Box>
      </Paper>
    </>
  )
}

export default ActiveOfficers