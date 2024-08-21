import React from 'react'
import { ActionIcon, Badge, Group, NumberInput, Text, Tooltip, createStyles, rem } from '@mantine/core';
import { IconTrash, IconMinus, IconPlus } from '@tabler/icons-react';
import { SelectedCharge } from '../../../../../typings';
import useSelectedChargesStore from '../../../../../stores/incidents/editCharges';
import locales from '../../../../../locales';

interface Props {
  charge: SelectedCharge;
  index: number;
}

const useStyles = createStyles((theme) => ({
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
}));

const SelectedChargeCard = ({ charge, index }: Props) => {
  const { classes } = useStyles();
  const { setSelectedCharge, setSelectedCharges } = useSelectedChargesStore();

  return (
    <div className="edit-charges-modal-charge-card">
      <Text fz="sm" fw={500} c="white" style={{textAlign: 'center'}}>
        {charge.label}
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
          {charge.time} month(s)
        </Badge>

        <Badge 
          radius="xs" 
          variant="filled"
          style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, margin: 5, fontWeight: 500}}
        >
          {charge.points} point(s)
        </Badge>
      </div>

      <Tooltip label={charge.description} multiline withArrow color='gray'>
        <Text fz='xs' fw={500} mt={5} style={{textAlign: 'center'}} lineClamp={2}>
          {charge.description}
        </Text>
      </Tooltip>

      <Group position="apart" style={{gap: 5}}>
        <Badge 
          radius="xs" 
          variant="filled"
          style={{fontSize: 10, padding: 12.5, fontWeight: 500}}
          color={charge.type.toLocaleLowerCase() === 'felony' ? 'red' : (charge.type.toLocaleLowerCase() === 'infraction' ? 'green' : 'yellow')}
        >
          {charge.type}
        </Badge>

        <Group style={{gap: 5}}>
          <Tooltip label={locales.remove_charge} withArrow color='gray'>
            <ActionIcon onClick={() => { setSelectedCharges((prev) => prev.filter((_, indx) => indx !== index)); }} h={31} className='action-icon'>
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>

          <div className={classes.wrapper}>
            <ActionIcon<'button'>
              size={18}
              variant="transparent"
              onClick={() => setSelectedCharge(charge.label, (prev) => ({ ...prev, count: --prev.count }))}
              disabled={charge.count === 1}
              className={classes.control}
              onMouseDown={(event) => event.preventDefault()}
            >
              <IconMinus size="1rem" stroke={1.5} />
            </ActionIcon>

            <NumberInput
              variant="unstyled"
              min={1}
              max={99}
              value={charge.count}
              classNames={{ input: classes.input }}
              disabled
            />

            <ActionIcon<'button'>
              size={18}
              variant="transparent"
              onClick={() => setSelectedCharge(charge.label, (prev) => ({ ...prev, count: ++prev.count }))}
              className={classes.control}
              onMouseDown={(event) => event.preventDefault()}
            >
              <IconPlus size="1rem" stroke={1.5} />
            </ActionIcon>
          </div>
        </Group>
      </Group>
    </div>
  )
}

export default SelectedChargeCard