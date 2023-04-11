import React from 'react'
import {Container, Flex, Stack } from "@mantine/core";
import SearchTable from './components/SearchTable';

const Profiles = () => {
  return (
    <Container w={'100%'} p={15} style={{maxWidth: '100%'}}>
      <Flex
        gap="md"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <SearchTable />
        <Stack h={300} sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] })}>
          <div>Hello there</div>
          <div>Hello number two</div>
        </Stack>
      </Flex>
    </Container>
  )
}

export default Profiles;