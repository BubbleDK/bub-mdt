import { IconPhoneCall } from '@tabler/icons-react'
import { Text } from '@mantine/core'
import React from 'react'
import locales from '../../../../../../locales'

const CallCardTitle = () => {
  return (
    <div className='card-title'>
      <Text style={{ fontSize: 17, color: "white" }} weight={500}>
        {locales.active_calls}
      </Text>

      <IconPhoneCall color='white' />
    </div>
  )
}

export default CallCardTitle