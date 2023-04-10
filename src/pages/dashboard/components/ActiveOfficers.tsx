import React from 'react'
import { Box, Divider, Paper, Title, Table, ScrollArea } from '@mantine/core'; 
import { useStoreOfficers } from '../../../store/officersStore';
import { useStoreUnit } from '../../../store/unitStore';

const ActiveOfficers = () => {
  const { officers } = useStoreOfficers()
  const { getUnitByOfficer } = useStoreUnit()
  const rows = officers.map((officer) => (
    <tr key={officer.citizenid}>
      <td>{officer.firstname} {officer.lastname}</td>
      <td>{officer.role}</td>
      <td>{officer.callsign}</td>
      <td>{getUnitByOfficer(officer.citizenid) ? getUnitByOfficer(officer.citizenid)?.unitName : 'None'}</td>
    </tr>
  ));

  return (
    <>
      <Paper p='md' withBorder style={{width: '27%'}}>
        <Divider my='xs' labelPosition='center' label={
          <Title order={5} weight={500}>
            Active Officers
          </Title>}
        />
        <Box>
          <ScrollArea h={530}>
            <Table striped withBorder>
              <thead>
                <tr>
                  <th>Officer</th>
                  <th>Role</th>
                  <th>Callsign</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Paper>
    </>
  )
}

export default ActiveOfficers