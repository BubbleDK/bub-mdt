import React, { useEffect, useRef, useState } from 'react'
import { involvedCriminalsType } from '../../../typings';
import { createStyles, Group, ActionIcon, Badge, rem, Divider, Checkbox, Select, Tooltip, Text, Modal, TextInput, ScrollArea, NumberInputHandlers, NumberInput } from '@mantine/core';
import { IconTrash, IconX, IconChevronDown, IconDeviceFloppy, IconInfoCircle, IconPlus, IconMinus } from '@tabler/icons-react';
import { useStoreProfiles } from '../../../store/profilesStore';
import { ChargesData } from '../../../typings/charges';
import { useDisclosure } from '@mantine/hooks';
import { useStoreIncidents } from '../../../store/incidentsStore';

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
  wrapper: {
    width: 105,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${rem(0.5)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]
    }`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,

    '&:focus-within': {
      borderColor: theme.colors[theme.primaryColor][6],
    },
  },
  control: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]
    }`,

    '&:disabled': {
      borderColor: theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3],
      opacity: 0.8,
      backgroundColor: 'transparent',
    },
  },
  input: {
    textAlign: 'center',
    paddingRight: `${theme.spacing.md} !important`,
    paddingLeft: `${theme.spacing.sm} !important`,
    height: rem(18),
    flex: 1,

    '&:disabled': {
      backgroundColor: '#2C2E33',
      cursor: 'auto',
      color: '#C1C2C5',
    },
  },
  charge: {
    display: 'block',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },
  chargeItem: {
    padding: 10,
    backgroundColor: '#1d1e20',
    border: `0.1px solid rgb(42, 42, 42, 1)`,
    height: 150,
    width: 305,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  addedCharge: {
    display: 'block',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    marginBottom: 5,
  },
  addedChargeItem: {
    padding: 10,
    backgroundColor: '#1d1e20',
    border: `0.1px solid rgb(42, 42, 42, 1)`,
    height: 150,
    width: 325,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
}));

const charges: ChargesData[]  = [
  {
    id: 1,
    title: 'First Degree Speeding',
    details: 'Drives in excess of the speed limit by more than 55 miles per hour. Adds 3 points.',
    jailtime: 0,
    fine: 1125,
    points: 3,
    category: 'Traffic Violations',
    color: 'green',
    amountOfAddedCharges: 0
  },
  {
    id: 2,
    title: 'Assault & Battery',
    details: 'Openly threatens violoence or injury upon an individual either orally or through their actions and acts upon that threat',
    jailtime: 11,
    fine: 1050,
    points: 0,
    category: 'Against Citizens',
    color: 'green',
    amountOfAddedCharges: 0
  },
  {
    id: 3,
    title: 'Criminal Threats',
    details: 'A criminal threat is when you threaten to kill or physicall harm someone. That person is thereby placed in a state of reasonably sustained fear for his/her safety or for the safety of his/her immediate family, the threat is specific and unequivocal andyou communicate the threat verbally, in writing, or via an electronically transmitted device.',
    jailtime: 14,
    fine: 1325,
    points: 0,
    category: 'Against Citizens',
    color: 'green',
    amountOfAddedCharges: 0
  },
  {
    id: 4,
    title: 'Brandishing of a Firearm',
    details: 'Displaying a firearm in public without a legal reason. "Open Carry" is not a legal reason to have a weapon in your hand. To open carry, the weapon must be holstered or attached to a sling.',
    jailtime: 7,
    fine: 625,
    points: 0,
    category: 'Against Citizens',
    color: 'green',
    amountOfAddedCharges: 0
  },
  {
    id: 5,
    title: 'Unlawful Imprisonment',
    details: 'Restricts a persons movement within any area without legal authority, justification, or the persons consent.',
    jailtime: 11,
    fine: 1125,
    points: 0,
    category: 'Against Citizens',
    color: 'yellow',
    amountOfAddedCharges: 0
  },
  {
    id: 6,
    title: 'Murder Of A Government Employee',
    details: 'The intentional act that leads to the death of a Government Employee. The following titles qualify an individual as a government employee: Law Enforcement Officer, Emergency Medical Services Personnel, Doctor, Judge, Mayor, Deputy Mayor, and County Clerk.',
    jailtime: 60,
    fine: 10000,
    points: 0,
    category: 'Against Citizens',
    color: 'red',
    amountOfAddedCharges: 0
  },
]

const InvolvedCriminal = (props: Props) => {
  const { classes, theme } = useStyles();
  const { getProfile } = useStoreProfiles();
  const { removeCriminal, addChargeToCriminal } = useStoreIncidents();
  const [isWarrantForArrest, setIsWarrantForArrest] = useState(false);
  const [isPleadedGuilty, setIsPleadedGuilty] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [selectedReduction, setSelectedReduction] = useState<string | null>();
  const [selectedReductionIndex, setSelectedReductionIndex] = useState(0);
  const [finalText, setFinalText] = useState<string>();
  const [openedChargesModal, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<number | ''>(1);
  const handlers = useRef<NumberInputHandlers>(null);

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
    setSelectedReductionIndex(calculateReductions(props.criminal.charges).findIndex(item => item === selectedReduction))
  }, [selectedReduction])

  useEffect(() => {
    calculateReductions(props.criminal.charges)
    setSelectedReduction(calculateReductions(props.criminal.charges)[selectedReductionIndex])
  }, [props.criminal.charges])

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
    <>
      <Modal 
        opened={openedChargesModal} 
        onClose={close} 
        title={
          <Group style={{gap: 10}}>
            <TextInput radius='xs' variant="filled" placeholder="Search charges..." />

            <Select
              data={[]}
              placeholder='Select a category'
              rightSection={<IconChevronDown size="1rem" />}
              rightSectionWidth={30}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              variant='filled'
              radius='xs'
            />
          </Group>
        } 
        size={1750}
        radius={5}
        xOffset={6.5}
        centered
      >
        <Divider mb={10} />

        <div style={{display: 'flex', gap: 20, width: '100%'}}>
          <ScrollArea h={700} scrollbarSize={4} offsetScrollbars scrollHideDelay={300}>
            <div style={{width: 348}}>
              <Text fz="sm" fw={500} c="white" mb={5}>
                Current Charges
              </Text>

              {props.criminal.charges.map((charge) => (
                <div className={classes.addedCharge} key={charge.id}>
                  <div className={classes.addedChargeItem}>
                    <Text fz="sm" fw={500} c="white" style={{textAlign: 'center'}}>
                      {charge.title}
                    </Text>

                    <div style={{display: 'flex', gap: 5, justifyContent: 'center'}}>
                      <Badge 
                        radius="xs" 
                        variant="filled"
                        style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, margin: 5, fontWeight: 500}}
                      >
                        ${charge.fine} fine
                      </Badge>

                      <Badge 
                        radius="xs" 
                        variant="filled"
                        style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, margin: 5, fontWeight: 500}}
                      >
                        {charge.jailtime} month(s)
                      </Badge>

                      <Badge 
                        radius="xs" 
                        variant="filled"
                        style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, margin: 5, fontWeight: 500}}
                      >
                        {charge.points} point(s)
                      </Badge>
                    </div>

                    <Tooltip label={charge.details} multiline withArrow color='dark'>
                      <Text fz='xs' fw={500} mt={5} style={{textAlign: 'center'}} lineClamp={2}>
                        {charge.details}
                      </Text>
                    </Tooltip>

                    <Group position="apart" style={{gap: 5}}>
                      <Badge 
                        radius="xs" 
                        variant="filled"
                        style={{fontSize: 10, padding: 12.5, fontWeight: 500}}
                        color={charge.color}
                      >
                        {charge.category}
                      </Badge>

                      <Group style={{gap: 5}}>
                        <Tooltip label='Remove Charge' withArrow color='dark'>
                          <ActionIcon className={classes.action} onClick={() => { }} h={31}>
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Tooltip>

                        <div className={classes.wrapper}>
                          <ActionIcon<'button'>
                            size={18}
                            variant="transparent"
                            onClick={() => handlers.current?.decrement()}
                            disabled={value === 1}
                            className={classes.control}
                            onMouseDown={(event) => event.preventDefault()}
                          >
                            <IconMinus size="1rem" stroke={1.5} />
                          </ActionIcon>

                          <NumberInput
                            variant="unstyled"
                            min={1}
                            max={99}
                            handlersRef={handlers}
                            value={charge.amountOfAddedCharges}
                            onChange={setValue}
                            classNames={{ input: classes.input }}
                            disabled
                          />

                          <ActionIcon<'button'>
                            size={18}
                            variant="transparent"
                            onClick={() => handlers.current?.increment()}
                            className={classes.control}
                            onMouseDown={(event) => event.preventDefault()}
                          >
                            <IconPlus size="1rem" stroke={1.5} />
                          </ActionIcon>
                        </div>
                      </Group>
                    </Group>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Divider orientation="vertical" />

          <div style={{flex: 1}}>
            <Text fz="sm" fw={500} c="white" mb={5}>
              All Charges
            </Text>

            <ScrollArea h={700} scrollbarSize={4} offsetScrollbars scrollHideDelay={300}>
              <div style={{display: 'flex', gap: 5, flexWrap: 'wrap'}}>
                {charges.map((charge) => (
                  <div className={classes.charge} key={charge.id}>
                    <div className={classes.chargeItem}>
                      <Text fz="sm" fw={500} c="white" style={{textAlign: 'center'}}>
                        {charge.title}
                      </Text>

                      <div style={{display: 'flex', gap: 5, justifyContent: 'center'}}>
                        <Badge 
                          radius="xs" 
                          variant="filled"
                          style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, margin: 5, fontWeight: 500}}
                        >
                          ${charge.fine} fine
                        </Badge>

                        <Badge 
                          radius="xs" 
                          variant="filled"
                          style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, margin: 5, fontWeight: 500}}
                        >
                          {charge.jailtime} month(s)
                        </Badge>

                        <Badge 
                          radius="xs" 
                          variant="filled"
                          style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, margin: 5, fontWeight: 500}}
                        >
                          {charge.points} point(s)
                        </Badge>
                      </div>

                      <Tooltip label={charge.details} multiline withArrow color='dark'>
                        <Text fz='xs' fw={500} mt={5} style={{textAlign: 'center'}} lineClamp={2}>
                          {charge.details}
                        </Text>
                      </Tooltip>

                      <Group position="apart" style={{gap: 5}}>
                        <Badge 
                          radius="xs" 
                          variant="filled"
                          style={{fontSize: 10, padding: 12.5, fontWeight: 500}}
                          color={charge.color}
                        >
                          {charge.category}
                        </Badge>

                        <Tooltip label='Add Charge' withArrow color='dark'>
                          <ActionIcon className={classes.action} onClick={() => { addChargeToCriminal(props.criminal.citizenId, {...charge, amountOfAddedCharges: 1}) }} h={31}>
                            <IconPlus size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </Modal>
      
      <div className={classes.user}>
        <div className={classes.item}>
          <Group position="apart">
            <Text fz="sm" fw={500} c="white">
              {getProfile(props.criminal.citizenId)?.firstname} {getProfile(props.criminal.citizenId)?.lastname} (#{getProfile(props.criminal.citizenId)?.citizenid})
            </Text>

            <Tooltip label='Remove criminal' withArrow color='dark'>
              <ActionIcon className={classes.action} onClick={() => { removeCriminal(props.criminal.citizenId) }}>
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <div style={{marginTop: 7.5}}>
            <Badge 
              radius="xs" 
              variant="filled"
              style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, cursor: 'pointer', marginRight: 5}}
              onClick={open}
            >
              Edit Charges
            </Badge>

            {props.criminal.charges.map((charge) => (
              <Badge 
                key={charge.id}
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
    </>
  )
}

export default InvolvedCriminal