import { ScrollArea, rem, Divider, Badge, Text } from '@mantine/core'
import { IconFileDescription, IconScript, IconUserOff } from '@tabler/icons-react'
import '../index.css';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { useProfilesStore } from '../../../../../stores';
import useIncidentStore from '../../../../../stores/incidents/incident';
import { isEnvBrowser } from '../../../../../utils/misc';
import { fetchNui } from '../../../../../utils/fetchNui';
import { Incident, Report } from '../../../../../typings';
import useReportStore from '../../../../../stores/reports/report';
import locales from '../../../../../locales';

const ProfileExtraInformation = () => {
  const { setActiveReport, setReportActive } = useReportStore();
  const useSelectedProfile = useProfilesStore(state => state.selectedProfile);
  const profileCards = useProfilesStore(state => state.profileCards);
  const { setActiveIncident, setIncidentActive } = useIncidentStore();
  const navigate = useNavigate();

  if (!useSelectedProfile) return (
    <div className='content-width'>
      <div className='card-background'>
        <div className="profile-no-selected">
          <IconUserOff size={rem(50)} color='white' />
          <Text style={{ fontSize: 15, color: 'white' }} weight={600}>
            {locales.no_profile_selected}
          </Text>
        </div>
      </div>
    </div>
  );

  async function selectRelatedReport(id: number) {
    if (isEnvBrowser()) return navigate('/reports');
    const resp = await fetchNui<Report>('getReport', id);
    setActiveReport(resp);
    setReportActive(true);
    navigate('/reports');
  }

  async function selectRelatedIncident(id: number) {
    if (isEnvBrowser()) return navigate('/incidents');
    const resp = await fetchNui<Incident>('getIncident', id);
    setActiveIncident(resp);
    setIncidentActive(true);
    navigate('/incidents');
  }

  return (
    <div className='content-width'>
      <ScrollArea h={860}>
        <div className='additional-profile-info'>
          {profileCards.map((card) => (
            <ProfileCard title={card.title} icon={card.icon}>
              <div className='profile-card-info-badges'>
                {useSelectedProfile[card.id] ? (
                  useSelectedProfile[card.id].map((label: string) => (
                    <Badge color="gray" variant="filled" className='profile-info-badge' radius="md" key={label}>{label}</Badge>
                  ))
                ) :
                  <Text color='dimmed' size='xs'>
                    {locales.no_cardid_registered.format(card.id)}
                  </Text>
                }
              </div>
            </ProfileCard>
          ))}

          <div className='card-background profile-card-info'>
            <div className='card-title'>
              <Text style={{ fontSize: 17, color: "white" }} weight={500}>
                {locales.related_reports}
              </Text>

              <IconFileDescription size={rem(25)} color='white' />
            </div>

            <Divider style={{ width: '100%' }} />

            {useSelectedProfile.relatedReports && (
              useSelectedProfile.relatedReports.length > 0 ? (
                useSelectedProfile.relatedReports.map(report => (
                  <div className='related-reports-card' key={report.id} onClick={() => {selectRelatedReport(report.id)}}>
                    <Text style={{ fontSize: 15, color: "white" }} weight={500}>
                      {report.title}
                    </Text>

                    <div className='related-reports-extra-info'>
                      <Text style={{ fontSize: 12, }} weight={500} color="dimmed">
                        {report.author} - Date: {report.date}
                      </Text>

                      <Text style={{ fontSize: 12 }} weight={500} color="dimmed">
                        #{report.id}
                      </Text>
                    </div>
                  </div>
                ))
              ) : (
                <Text color='dimmed' size='xs'>
                  {locales.no_related_reports}
                </Text>
              )
            )}
          </div>

          <div className='card-background profile-card-info'>
            <div className='card-title'>
              <Text style={{ fontSize: 17, color: "white" }} weight={500}>
                {locales.related_incidents}
              </Text>

              <IconScript size={rem(25)} color='white' />
            </div>

            <Divider style={{ width: '100%' }} />

            {useSelectedProfile.relatedIncidents && (
              useSelectedProfile.relatedIncidents.length > 0 ? (
                useSelectedProfile.relatedIncidents.map(incident => (
                  <div className='related-reports-card' key={incident.id} onClick={() => {selectRelatedIncident(incident.id)}}>
                    <Text style={{ fontSize: 15, color: "white" }} weight={500}>
                      {incident.title}
                    </Text>

                    <div className='related-reports-extra-info'>
                      <Text style={{ fontSize: 12, }} weight={500} color="dimmed">
                        {incident.author} - Date: {incident.date}
                      </Text>

                      <Text style={{ fontSize: 12 }} weight={500} color="dimmed">
                        #{incident.id}
                      </Text>
                    </div>
                  </div>
                ))
              ) : (
                <Text color='dimmed' size='xs'>
                  {locales.no_related_incidents}
                </Text>
              )
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ProfileExtraInformation