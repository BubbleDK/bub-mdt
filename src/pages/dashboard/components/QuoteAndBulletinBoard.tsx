import React from 'react'
import { Box, Divider, Paper, Title } from '@mantine/core';

const QuoteAndBulletinBoard = () => {
  return (
    <>
      <Paper p='md' withBorder style={{width: '25%'}}>
        <Divider my='xs' labelPosition='center' label={
          <Title order={5} weight={500}>
            Bulletin Board
          </Title>}
        />
        <Box>
          
        </Box>
      </Paper>
    </>
  )
}

export default QuoteAndBulletinBoard