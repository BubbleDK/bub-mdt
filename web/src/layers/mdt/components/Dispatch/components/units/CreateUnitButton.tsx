import { Button, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconPlus } from '@tabler/icons-react'
import React from 'react'
import CreateUnitModal from '../modals/CreateUnitModal'
import { usePersonalDataStore } from '../../../../../../stores'
import locales from '../../../../../../locales'

const CreateUnitButton = () => {
  const { personalData } = usePersonalDataStore();

  return (
    <Button
      variant="light"
      color="gray"
      leftIcon={<IconPlus />}
      disabled={personalData.unit !== undefined}
      onClick={() => {
        modals.open({
          title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.create_unit}</Text>,
          children: <CreateUnitModal />,
          centered: true, 
          size: 'sm', 
        })
      }}
    >
      {locales.create_unit}
    </Button>
  )
}

export default CreateUnitButton;