import React, { useState } from 'react'
import './index.css'
import { ScrollArea, Table, Text, createStyles, rem } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: -1,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const codesElements = [
  { code: '10-0', description: 'Mistet mistænkte af syne' },
  { code: '10-3', description: 'Stop radio transmission' },
  { code: '10-4', description: 'Modtaget' },
  { code: '10-6', description: 'Ikke tilgængelig' },
  { code: '10-7', description: 'Off-Duty' },
  { code: '10-8', description: 'On-duty' },
  { code: '10-9', description: 'Gentag' },
  { code: '10-10', description: 'Skift radio frekvens' },
  { code: '10-13', description: 'Skud affyret' },
  { code: '10-14', description: 'Stolen numberplate' },
  { code: '10-15', description: 'Igangværende biltyveri' },
  { code: '10-16', description: 'Brug for persontransport' },
  { code: '10-19', description: 'Kører tilbage til stationen' },
  { code: '10-20', description: 'Position' },
  { code: '10-22', description: 'Ignorer sidste signal' },
  { code: '10-23', description: 'Ankommet til _____' },
  { code: '10-25', description: 'Mangler køremakker' },
  { code: '10-26', description: 'Person i varetægt' },
  { code: '10-28', description: 'Tjek MDT for oplysninger' },
  { code: '10-37', description: 'Afvent' },
  { code: '10-38', description: 'Trafikstop' },
  { code: '10-39', description: 'Mistænkelig adfærd' },
  { code: '10-43', description: 'Kald en læge' },
  { code: '10-50', description: 'Færdselsuheld' },
  { code: '10-51', description: 'Totalskadet køretøj' },
  { code: '10-56', description: 'Butiks-/juvelrøveri' },
  { code: '10-66', description: 'Husrøveri' },
  { code: '10-76', description: 'På vej til' },
  { code: '10-77', description: 'Ankomsttid / ETA' },
  { code: '10-78', description: 'Brug for assistance' },
  { code: '10-80', description: 'Biljagt' },
  { code: '10-81', description: 'Jagt til fods' },
  { code: '10-85', description: 'Helikopter enhed' },
  { code: '10-89', description: 'Betjent nede' },
  { code: '10-90', description: 'Bankrøveri' },
  { code: '10-92', description: 'Oil Rig Angreb' },
  { code: '10-98', description: 'Fængselsudbrud' },
  { code: '10-99', description: 'Efterlyst person' },
  { code: '10-101', description: 'Status' },
];

const codesMeaningElements = [
  { code: 'Code 1', description: 'Almindelig kørsel' },
  { code: 'Code 2', description: 'Kørsel med lys' },
  { code: 'Code 3', description: 'Kørsel med lys & sirene' },
  { code: 'Code 4', description: 'Alt under kontrol' },
  { code: 'Code 5', description: 'Felony stop' },
];

const codesColorMeaningElements = [
  { code: 'Kode rød', description: 'Stop med nødvendig force' },
  { code: 'Kode orange', description: 'Pit tilladt hvis muligt' },
  { code: 'Kode grøn', description: 'Følg efter personen' },
  { code: 'Ocean king', description: 'Besvarer 10-101' },
  { code: 'Signal 100', description: 'Alt radio kommunikation stoppes' },
]

const CodesAndCommands = () => {
  const { classes, cx } = useStyles();
  const [scrolledCodes, setScrolledCodes] = useState(false);

  const codesRows = codesElements.map((element) => (
    <tr key={element.code}>
      <td>{element.code}</td>
      <td>{element.description}</td>
    </tr>
  ));

  const codesMeaningRows = codesMeaningElements.map((element) => (
    <tr key={element.code}>
      <td>{element.code}</td>
      <td>{element.description}</td>
    </tr>
  ));

  const codesColorMeaningRows = codesColorMeaningElements.map((element) => (
    <tr key={element.code}>
      <td>{element.code}</td>
      <td>{element.description}</td>
    </tr>
  ));

  return (
    <div className='codes-and-command'>
      <div className='codes-and-command-background'>
        <Text color='white' size='md' weight={600}>
          10 Codes
        </Text>
        <ScrollArea h={800} onScrollPositionChange={({ y }) => setScrolledCodes(y !== 0)}>
          <Table striped withBorder>
            <thead className={cx(classes.header, { [classes.scrolled]: scrolledCodes })}>
              <tr>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{codesRows}</tbody>
          </Table>
        </ScrollArea>
      </div>

      <div className='codes-and-command-extra'>
        <div className='command-background'>
          <Text color='white' size='md' weight={600}>
            Codes Meaning
          </Text>
          <ScrollArea h={300}>
            <Table striped withBorder>
              <thead className={cx(classes.header)}>
                <tr>
                  <th>Codes</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>{codesMeaningRows}</tbody>
            </Table>
          </ScrollArea>
        </div>

        <div className='command-background'>
          <Text color='white' size='md' weight={600}>
            Codes Color Meaning
          </Text>
          <ScrollArea h={300}>
            <Table striped withBorder>
              <thead className={cx(classes.header)}>
                <tr>
                  <th>Color Codes</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>{codesColorMeaningRows}</tbody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default CodesAndCommands;