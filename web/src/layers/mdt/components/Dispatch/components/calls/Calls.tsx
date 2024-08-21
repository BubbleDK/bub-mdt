import React from 'react'
import CallCardTitle from './CallCardTitle'
import { Center, Loader } from '@mantine/core'
import CallsList from './CallsList'

const Calls = () => {
  return (
    <>
      <CallCardTitle />
      <React.Suspense fallback={<SuspenseLoader />}>
        <CallsList />
      </React.Suspense>
    </>
  )
}

function SuspenseLoader() {
  return (
    <Center>
      <Loader />
    </Center>
  )
}

export default Calls;