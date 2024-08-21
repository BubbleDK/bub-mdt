import { ActionIcon, Badge, Button, Divider, rem, ScrollArea, Text, Tooltip } from '@mantine/core';
import { IconFileOff, IconLinkOff, IconPaperBag, IconPlus, IconTrash, IconUsersGroup, IconX } from '@tabler/icons-react';
import '../index.css';
import TextEditor from '../../TextEditor';
import { modals } from '@mantine/modals';
import AddOfficerModal from './modals/AddOfficerModal';
import AddEvidenceModal from './modals/AddEvidenceModal';
import EvidenceImage from './EvidenceImage';
import useIncidentStore from '../../../../../stores/incidents/incident';
import { fetchNui } from '../../../../../utils/fetchNui';
import locales from '../../../../../locales';
import useIncidentsStore from '../../../../../stores/incidents/incidentsList';

const IncidentMiddle = () => {
  const { incident, isIncidentActive, setIncidentActive, setOfficersInvolved, setDescription } = useIncidentStore();
  const { setIncidents } = useIncidentsStore();

  if (!isIncidentActive) return (
    <div className='content-width'>
      <div className='card-background'>
        <div className="profile-no-selected">
          <IconFileOff size={rem(50)} color='white' />
          <Text style={{ fontSize: 15, color: 'white' }} weight={600}>
            {locales.no_incident_selected}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <ScrollArea h={860}>
      <div className='incident-content-width'>
        <div className='incident-middle-content'>
          <div className='profile-card-header'>
            <Text style={{ fontSize: 15, color: 'white' }}>
              {incident.title}
            </Text>

            <div className='profile-card-header-buttons'>
              <Tooltip label={locales.delete_incident} withArrow color='gray' position='bottom'>
                <ActionIcon variant="filled" color="red" onClick={() => { 
                  modals.openConfirmModal({
                    title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.delete_incident}</Text>,
                    size: 'sm',
                    centered: true,
                    labels: { confirm: locales.confirm, cancel: locales.cancel },
                    groupProps: {
                      spacing: 6,
                    },
                    confirmProps: { color: 'red' },
                    onConfirm: async () => {
                      const success = await fetchNui('deleteIncident', { id: incident.id }, { data: 1 })

                      if (success) setIncidents((prev) => prev.filter((record) => record.id !== incident.id));
                      setIncidentActive(false);
                      // const success = await fetchNui(
                      //   'removeCriminal',
                      //   { id: incident.id, criminalId: criminal.citizenid },
                      //   { data: 1 }
                      // );

                      // if (success) setCriminals((prev) => prev.filter((crim) => crim.citizenid !== criminal.citizenid));
                    },
                    children: (
                      <Text size="sm" c="dark.2">
                        {locales.delete_incident_confirm.format(incident.title)}
                      </Text>
                    ),
                  })
                }}>
                  <IconTrash size={16} color={'white'} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={locales.unlink} withArrow color='gray' position='bottom'>
                <ActionIcon variant="filled" color="gray" onClick={() => { setIncidentActive(false); }}>
                  <IconLinkOff size={16} color={'white'} />
                </ActionIcon>
              </Tooltip>
            </div>
          </div>

          <Divider style={{ width: '100%' }} />

          <div className='incident-middle-card'>
            <TextEditor 
              content={incident.description}
              onSave={(value) => {
                fetchNui('saveIncidentContents', { incidentId: incident.id, contents: value });
                setDescription(value);
              }}
              styles={{ content: { backgroundColor: '#242527' }, toolbar: { backgroundColor: '#2C2E33' }, controlsGroup: { pointerEvents: 'auto', backgroundColor: '#282828' }}}
              contentAreaStyle={{ height: 270, width: 413, padding: 0 }}
            />
          </div>
        </div>

        <div className='card-background profile-card-info'>
          <div className='card-title'>
            <Text style={{ fontSize: 17, color: "white" }} weight={500}>
              {locales.officers_involved}
            </Text>

            <IconUsersGroup size={rem(25)} color='white' />
          </div>

          <Divider style={{ width: '100%' }} />

          <div className='profile-card-info-badges'>
            <Badge 
              color="gray" 
              variant="filled" 
              className='incident-info-badge-main' 
              radius="md" 
              onClick={() => modals.open({ title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.add_officer}</Text>, centered: true, size: 'sm', children: <AddOfficerModal /> })}
            >
              {locales.add_officer}
            </Badge>

            {incident.officersInvolved.map((officer) => (
              <Badge
                color="gray" 
                variant="filled" 
                className='incident-info-badge' 
                key={officer.citizenid}
                rightSection={
                  <ActionIcon
                    size="xs"
                    radius="xl"
                    variant="transparent"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>{locales.remove_officer}</Text>,
                        centered: true,
                        children: (
                          <Text size="sm" c="dark.2">
                            {locales.remove_officer_confirm.format(officer.firstname, officer.lastname, officer.callsign)}
                          </Text>
                        ),
                        confirmProps: { color: 'red' },
                        groupProps: {
                          spacing: 6,
                        },
                        labels: { confirm: locales.confirm, cancel: locales.cancel },
                        onConfirm: async () => {
                          await fetchNui('removeOfficer', { id: incident.id, citizenid: officer.citizenid }, { data: 1 });
                          setOfficersInvolved((prev) =>
                            prev.filter((prevOfficer) => prevOfficer.citizenid !== officer.citizenid)
                          );
                        },
                      });
                    }}
                  >
                    <IconX size={rem(10)} />
                  </ActionIcon>
                }
              >
                {officer.firstname} {officer.lastname} {officer.callsign ? `(${officer.callsign})` : ''}
              </Badge>
            ))}
          </div>
        </div>

        <div className='card-background profile-card-info'>
          <div className='card-title'>
            <Text style={{ fontSize: 17, color: "white" }} weight={500}>
              {locales.evidence}
            </Text>

            <IconPaperBag size={rem(25)} color='white' />
          </div>

          <Divider style={{ width: '100%' }} />

          <div className='profile-card-info-badges'>
            <Button
              onClick={() => modals.open({ centered: true, title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>{locales.add_evidence}</Text>, children: <AddEvidenceModal />, size: 'sm' })}
              variant="filled"
              color="gray"
              w={105}
              h={105}
            >
              <IconPlus size={36} />
            </Button>

            {incident.evidence.map((evidence) => (
              <EvidenceImage evidence={evidence} key={`${evidence.image}-${evidence.label}`} />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default IncidentMiddle;