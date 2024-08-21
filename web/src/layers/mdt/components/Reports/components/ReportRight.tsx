import { ActionIcon, Badge, Button, Divider, rem, ScrollArea, Text } from '@mantine/core';
import { IconBadges, IconFileOff, IconPaperBag, IconPlus, IconUsersGroup, IconX } from '@tabler/icons-react';
import useReportStore from '../../../../../stores/reports/report';
import { modals } from '@mantine/modals';
import { fetchNui } from '../../../../../utils/fetchNui';
import AddOfficerModal from './modals/AddOfficerModal';
import AddCitizenModal from './modals/AddCitizenModal';
import AddEvidenceModal from './modals/AddEvidenceModal';
import EvidenceImage from './EvidenceImage';
import locales from '../../../../../locales';

const ReportRight = () => {
  const { report, isReportActive, setOfficersInvolved, setCitizensInvolved } = useReportStore();

  if (!isReportActive) return (
    <div className='content-width'>
      <div className='card-background'>
        <div className="profile-no-selected">
          <IconFileOff size={rem(50)} color='white' />
          <Text style={{ fontSize: 15, color: 'white' }} weight={600}>
            {locales.no_report_selected}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <ScrollArea h={860}>
      <div className='incident-criminals-content-width'>
        <div className='card-background profile-card-info'>
          <div className='card-title'>
            <Text style={{ fontSize: 17, color: "white" }} weight={500}>
              {locales.officers_involved}
            </Text>

            <IconBadges size={rem(25)} color='white' />
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

            {report.officersInvolved.map((officer) => (
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
                        title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>Remove officer</Text>,
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
                          await fetchNui('removeReportOfficer', { id: report.id, citizenid: officer.citizenid }, { data: 1 });
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
              {locales.citizens_involved}
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
              onClick={() => modals.open({ title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.add_citizen}</Text>, centered: true, size: 'sm', children: <AddCitizenModal /> })}
            >
              {locales.add_citizen}
            </Badge>

            {report.citizensInvolved.map((citizen) => (
              <Badge
                color="gray" 
                variant="filled" 
                className='incident-info-badge' 
                key={citizen.citizenid}
                rightSection={
                  <ActionIcon
                    size="xs"
                    radius="xl"
                    variant="transparent"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>Remove officer</Text>,
                        centered: true,
                        children: (
                          <Text size="sm" c="dark.2">
                            {locales.remove_citizen_confirm.format(citizen.firstname, citizen.lastname)}
                          </Text>
                        ),
                        confirmProps: { color: 'red' },
                        groupProps: {
                          spacing: 6,
                        },
                        labels: { confirm: locales.confirm, cancel: locales.cancel },
                        onConfirm: async () => {
                          await fetchNui('removeReportCitizen', { id: report.id, citizenid: citizen.citizenid }, { data: 1 });
                          setCitizensInvolved((prev) =>
                            prev.filter((prevCitizen) => prevCitizen.citizenid !== citizen.citizenid)
                          );
                        },
                      });
                    }}
                  >
                    <IconX size={rem(10)} />
                  </ActionIcon>
                }
              >
                {citizen.firstname} {citizen.lastname} {`(${citizen.citizenid})`}
              </Badge>
            ))}
          </div>
        </div>

        <div className='card-background profile-card-info'>
          <div className='card-title'>
            <Text style={{ fontSize: 17, color: "white" }} weight={500}>
              {locales.images}
            </Text>

            <IconPaperBag size={rem(25)} color='white' />
          </div>

          <Divider style={{ width: '100%' }} />

          <div className='profile-card-info-badges'>
            <Button
              onClick={() => modals.open({ centered: true, title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>{locales.add_image}</Text>, children: <AddEvidenceModal />, size: 'sm' })}
              variant="filled"
              color="gray"
              w={105}
              h={105}
            >
              <IconPlus size={36} />
            </Button>

            {report.evidence.map((evidence) => (
              <EvidenceImage evidence={evidence} key={`${evidence.image}-${evidence.label}`} />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default ReportRight;