import { rem, Input, Divider, Text, ScrollArea, Button, Center, Loader } from "@mantine/core"
import { IconSearch, IconFilePlus, IconFileDescription } from "@tabler/icons-react"
import '../index.css'
import { useEffect, useState } from "react";
import { modals } from '@mantine/modals';
import { PartialReportData } from "../../../../../typings";
import CreateReportModal from "./modals/CreateReportModal";
import useReportListStore from "../../../../../stores/reports/reportsList";
import locales from "../../../../../locales";

interface ProfileListProps {
  handleReportClick: (report: PartialReportData) => void
}

const ReportList = (props: ProfileListProps) => {
  const { reports, fetchReports } = useReportListStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const DEBOUNCE_DELAY = 500;
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [timer, setTimer] = useState<number | null>(null);
  const [filteredReports, setFilteredReports] = useState(reports);

  useEffect(() => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    setIsLoading(true);

    const newTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsLoading(false);
    }, DEBOUNCE_DELAY);

    setTimer(newTimer);

    return () => {
      clearTimeout(newTimer);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setFilteredReports(reports);
    } else {
      const results = reports.filter(officer => 
        (officer.title || '').toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      );
      setFilteredReports(results);
    }
  }, [debouncedSearchQuery, reports]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      return await fetchReports();
    };

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className='content-width'>
      <div className='card-background'>
        <div className='card-title'>
          <Text style={{ fontSize: 17, color: "white" }} weight={500}>
            {locales.reports}
          </Text>

          <IconFileDescription size={rem(25)} color='white' />
        </div>

        <Input
          icon={<IconSearch />}
          variant="filled"
          placeholder={locales.search}
          mt={10}
          mb={10}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button fullWidth variant="light" color="gray" onClick={() => modals.open({ title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.create_report}</Text>, centered: true, size: 'sm', children: <CreateReportModal /> })}>
          <IconFilePlus size={rem(18)} style={{ marginRight: 5 }} /> {locales.create_report}
        </Button>

        <Divider mt={10} mb={10} />

        <div className='reports-cards-content'>
          <ScrollArea h={680}>
            <div className="profiles-card-content-flex">
              {isLoading ? (
                <Center>
                  <Loader />
                </Center>
              ) : (
                filteredReports.map((report) => (
                  <div className='report-card' onClick={() => props.handleReportClick(report)} key={report.id}>
                    <div className="incident-card-content">
                      <Text style={{ fontSize: 17, color: "white" }} weight={500}>
                        {report.title}
                      </Text>

                      <div className="incident-card-dimmed-text">
                        <Text color='dimmed' size='xs'>
                          {report.author} - {new Date(report.date).toLocaleDateString()}
                        </Text>

                        <Text color='dimmed' size='xs'>
                          #{report.id}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default ReportList;