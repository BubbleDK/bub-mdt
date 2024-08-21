import { ActionIcon, Divider, rem, ScrollArea, Text, Tooltip } from '@mantine/core';
import { IconFileOff, IconLinkOff } from '@tabler/icons-react';
import '../index.css';
import TextEditor from '../../TextEditor';
import { fetchNui } from '../../../../../utils/fetchNui';
import useReportStore from '../../../../../stores/reports/report';
import locales from '../../../../../locales';

const ReportMiddle = () => {
  const { report, isReportActive, setReportActive, setDescription } = useReportStore();

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
      <div className='incident-content-width'>
        <div className='incident-middle-content'>
          <div className='profile-card-header'>
            <Text style={{ fontSize: 15, color: 'white' }}>
              {report.title}
            </Text>

            <div className='profile-card-header-buttons'>
              <Tooltip label={locales.unlink} withArrow color='gray' position='bottom'>
                <ActionIcon variant="filled" color="gray" onClick={() => { setReportActive(false); }}>
                  <IconLinkOff size={16} color={'white'} />
                </ActionIcon>
              </Tooltip>
            </div>
          </div>

          <Divider style={{ width: '100%' }} />

          <div className='incident-middle-card'>
            <TextEditor 
              content={report.description}
              onSave={(value) => {
                fetchNui('saveReportContents', { reportId: report.id, contents: value });
                setDescription(value);
              }}
              styles={{ content: { backgroundColor: '#242527' }, toolbar: { backgroundColor: '#2C2E33' }, controlsGroup: { pointerEvents: 'auto', backgroundColor: '#282828' }}}
              contentAreaStyle={{ height: 680, width: 413, padding: 0 }}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default ReportMiddle;