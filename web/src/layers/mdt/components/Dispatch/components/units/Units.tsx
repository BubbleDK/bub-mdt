import React from 'react'
import UnitsTitle from './UnitsTitle'
import CreateUnitButton from './CreateUnitButton'
import { Center, Loader } from '@mantine/core'
import UnitsList from './UnitsList'

const Units = () => {
  return (
    <>
      <UnitsTitle />
      <CreateUnitButton />
      <React.Suspense fallback={<SuspenseLoader />}>
        <UnitsList />
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

export default Units