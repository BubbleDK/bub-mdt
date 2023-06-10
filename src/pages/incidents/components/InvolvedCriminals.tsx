import React, { useEffect, useState } from 'react'
import { involvedCriminalsType } from '../../../typings';
import { createStyles, Group, ActionIcon, Badge, rem, Divider, Checkbox, Select, Tooltip, Text } from '@mantine/core';
import { IconTrash, IconX, IconChevronDown, IconDeviceFloppy } from '@tabler/icons-react';
import { useStoreProfiles } from '../../../store/profilesStore';
import { ChargesData } from '../../../typings/charges';

interface Props {
  criminal: involvedCriminalsType
}

const useStyles = createStyles((theme) => ({
	action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },
  user: {
    display: 'block',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    marginBottom: 5,
  },

  item : {
    padding: 10,
    backgroundColor: '#1d1e20',
    border: `0.1px solid rgb(42, 42, 42, 1)`,
  },
}));

const InvolvedCriminals = (props: Props) => {
  const { classes, theme } = useStyles();
  const { getProfile } = useStoreProfiles();
  const [isWarrantForArrest, setIsWarrantForArrest] = useState(false);
  const [isPleadedGuilty, setIsPleadedGuilty] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [selectedReduction, setSelectedReduction] = useState<string | null>();
  const [finalText, setFinalText] = useState<string>();

  useEffect(() => {
    setIsWarrantForArrest(props.criminal.isWarrantForArrestActive)
    setIsPleadedGuilty(props.criminal.pleadedGuilty)
    setIsProcessed(props.criminal.processed)
    setSelectedReduction(props.criminal.final);
  }, [props.criminal])

  useEffect(() => {
    const str = selectedReduction;
    let arr = str?.split('/');
    arr?.shift();
    setFinalText(arr?.join('/'));
  }, [selectedReduction])

  function calculateReductions(charges: ChargesData[]): string[] {
    let totalJailtime = 0
    let totalFine = 0
    let totalPoints = 0

    for (let i = 0; i < charges.length; i++) {
      totalJailtime += charges[i].jailtime * charges[i].amountOfAddedCharges
      totalFine += charges[i].fine * charges[i].amountOfAddedCharges
      totalPoints += charges[i].points * charges[i].amountOfAddedCharges
    }

    return [`0% / ${totalJailtime} months / $${totalFine} fine / ${totalPoints} points`, `25% / ${totalJailtime * 0.75} months / $${totalFine * 0.75} fine / ${totalPoints * 0.75} points`, `50% / ${totalJailtime * 0.5} months / $${totalFine * 0.5} fine / ${totalPoints * 0.5} points`, `75% / ${totalJailtime * 0.25} months / $${totalFine * 0.25} fine / ${totalPoints * 0.25} points`, `100% / ${totalJailtime * 0} months / $${totalFine * 0} fine / ${totalPoints * 0} points`]
  }

  return (
    <div className={classes.user} key={props.criminal.citizenId}>
      <div className={classes.item}>
        <Group position="apart">
          <Text fz="sm" fw={500} c="white">
            {getProfile(props.criminal.citizenId)?.firstname} {getProfile(props.criminal.citizenId)?.lastname} (#{getProfile(props.criminal.citizenId)?.citizenid})
          </Text>

          <Group style={{gap: 5}}>
            <Tooltip label='Save Changes' withArrow color='dark'>
              <ActionIcon className={classes.action} onClick={() => { }}>
                <IconDeviceFloppy size={16} color={theme.colors.green[6]} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label='Remove criminal' withArrow color='dark'>
              <ActionIcon className={classes.action} onClick={() => { }}>
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <div style={{marginTop: 7.5}}>
          <Badge 
            radius="xs" 
            variant="filled"
            style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, cursor: 'pointer', marginRight: 5}}
            onClick={() => { console.log("Hello") }}
          >
            Edit Charges
          </Badge>

          {props.criminal.charges.map((charge) => (
            <Badge 
              radius="xs" 
              variant="filled"
              color={charge.color}
              style={{marginRight: 5, marginBottom: 5, padding: 12.5}}
              rightSection={<ActionIcon size="xs" radius="xl" variant="transparent">
                <IconX size={rem(14)} />
              </ActionIcon>}
            >
              {charge.amountOfAddedCharges}x {charge.title}
            </Badge>
          ))}
        </div>

        <Divider my={10} />

        <div>
          <Checkbox label="Warrant for arrest" radius="xs" color="rgba(51, 124, 255, 0.2)" checked={isWarrantForArrest} onChange={(event) => setIsWarrantForArrest(event.currentTarget.checked)} />
        </div>

        <Divider my={10} />

        <div>
          <Text fz={'0.855rem'} fw={500} c="white">
            Reduction
          </Text>

          <Select
            value={selectedReduction}
            onChange={setSelectedReduction}
            defaultValue={calculateReductions(props.criminal.charges)[0]} 
            data={calculateReductions(props.criminal.charges)}
            placeholder='Select a reduction'
            rightSection={<IconChevronDown size="1rem" />}
            rightSectionWidth={30}
            styles={{ rightSection: { pointerEvents: 'none' } }}
            variant='filled'
            radius='xs'
          />
          
          <Text fz={'0.855rem'} fw={500} c="white" mt={5}>
            Final
          </Text>

          <Text fz='xs' fw={500} mt={5}>
            {finalText}
          </Text>
        </div>

        <Divider my={10} />

        <div style={{display: 'flex', gap: 15}}>
          <Checkbox label="Pleaded Guilty" radius="xs" color="rgba(51, 124, 255, 0.2)" checked={isPleadedGuilty} onChange={(event) => setIsPleadedGuilty(event.currentTarget.checked)} />
          <Checkbox label="Processed" radius="xs" color="rgba(51, 124, 255, 0.2)" checked={isProcessed} onChange={(event) => setIsProcessed(event.currentTarget.checked)} />
        </div>
      </div>
    </div>
  )
}

export default InvolvedCriminals