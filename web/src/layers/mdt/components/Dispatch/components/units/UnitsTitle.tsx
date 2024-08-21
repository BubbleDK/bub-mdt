import { IconCar } from '@tabler/icons-react'
import { Text } from '@mantine/core'
import React from 'react'
import locales from '../../../../../../locales'

const UnitsTitle = () => {
  return (
    <div className='card-title'>
      <Text style={{ fontSize: 17, color: "white" }} weight={500}>
        {locales.units}
      </Text>

      <IconCar color='white' />
    </div>
  )
}

export default UnitsTitle