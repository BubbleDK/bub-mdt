import { rem, Input, Divider, Text, ScrollArea, Button, Center, Loader } from "@mantine/core"
import { IconSearch, IconFilePlus, IconScript } from "@tabler/icons-react"
import '../index.css'
import { useEffect, useState } from "react";
import { modals } from '@mantine/modals';
import CreateIncidentModal from "./modals/CreateIncidentModal";
import useIncidentsStore from "../../../../../stores/incidents/incidentsList";
import { PartialIncidentData } from "../../../../../typings";
import locales from "../../../../../locales";

interface ProfileListProps {
  handleIncidentClick: (incident: PartialIncidentData) => void
}

const IncidentList = (props: ProfileListProps) => {
  const { incidents, fetchIncidents } = useIncidentsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const DEBOUNCE_DELAY = 500;
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [timer, setTimer] = useState<number | null>(null);
  const [filteredIncidents, setFilteredIncidents] = useState(incidents);

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
      setFilteredIncidents(incidents);
    } else {
      const results = incidents.filter(incident => 
        (incident.title || '').toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
        (incident.author || '').toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      );
      setFilteredIncidents(results);
    }
  }, [debouncedSearchQuery, incidents]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      return await fetchIncidents();
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
            {locales.incidents}
          </Text>

          <IconScript size={rem(25)} color='white' />
        </div>

        <Input
          icon={<IconSearch />}
          variant="filled"
          placeholder={locales.search}
          mt={10}
          mb={10}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button fullWidth variant="light" color="gray" onClick={() => modals.open({ title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.create_incident}</Text>, centered: true, size: 'sm', children: <CreateIncidentModal /> })}>
          <IconFilePlus size={rem(18)} style={{ marginRight: 5 }} /> {locales.create_incident}
        </Button>

        <Divider mt={10} mb={10} />

        <div className='incidents-cards-content'>
          <ScrollArea h={680}>
            <div className="profiles-card-content-flex">
              {isLoading ? (
                <Center>
                  <Loader />
                </Center>
              ) : (
                filteredIncidents.map((incident) => (
                  <div className='incident-card' onClick={() => props.handleIncidentClick(incident)} key={incident.id}>
                    <div className="incident-card-content">
                      <Text style={{ fontSize: 17, color: "white" }} weight={500}>
                        {incident.title}
                      </Text>

                      <div className="incident-card-dimmed-text">
                        <Text color='dimmed' size='xs'>
                          {incident.author} - {new Date(incident.date).toLocaleDateString()}
                        </Text>

                        <Text color='dimmed' size='xs'>
                          #{incident.id}
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

export default IncidentList;