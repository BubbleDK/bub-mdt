import { ActionIcon, Badge, Divider, Group, Loader, ScrollArea, Text, TextInput, Tooltip } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import SelectedChargeCard from '../SelectedChargeCard';
import ConfirmSelectedCharges from '../ConfirmSelectedCharges';
import { Criminal } from '../../../../../../typings';
import useSelectedChargesStore from '../../../../../../stores/incidents/editCharges';
import { useChargeStore } from '../../../../../../stores';
import { ChargesObject } from '../../../../../../stores/chargesStore';
import locales from '../../../../../../locales';

interface Props {
  criminal: Criminal;
}

const EditChargesModal = ({ criminal }: Props) => {
  const { selectedCharges, setSelectedCharges } = useSelectedChargesStore();
  const { charges } = useChargeStore();
  const [filteredCategories, setFilteredCategories] = useState<ChargesObject>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number | null>(null);
  const DEBOUNCE_DELAY = 500;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

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
      setFilteredCategories(charges);
    } else {
      const categories: ChargesObject = Object.entries(charges).reduce((acc, [category, chargesArray]) => {
        const filteredCharges = debouncedSearchQuery.trim() ? chargesArray.filter(charge => charge.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) : chargesArray;
        if (filteredCharges.length > 0) {
          acc[category] = filteredCharges;
        }
        return acc;
      }, {} as ChargesObject);
      setFilteredCategories(categories);
    }
  }, [debouncedSearchQuery, charges]);

  return (
    <div className='edit-charges-modal'>
      <Divider />

      <div className='edit-charges-modal-content'>
        <div className='edit-charges-modal-current-charges'>
          <Text fz="md" fw={500} c="white" mb={5}>
            {locales.current_charges}
          </Text>

          <ScrollArea h={620}>
            <div className='edit-charges-modal-added-charges'>
              {selectedCharges.map((charge, index) => (
                <SelectedChargeCard key={index} charge={charge} index={index} />
              ))}
            </div>
          </ScrollArea>

          <ConfirmSelectedCharges criminal={criminal} />
        </div>

        <Divider orientation="vertical" />

        <div className='edit-charges-modal-all-charges'>
          <div className='edit-charges-modal-all-charges-header'>
            <Text fz="md" fw={500} c="white" mb={5}>
              {locales.all_charges}
            </Text>

            <TextInput radius='xs' variant="filled" placeholder={locales.search} w={300} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <ScrollArea h={635}>
            <div className='edit-charges-modal-all-charges-list'>
              {isLoading ? (
                <div style={{ display: 'flex', width: '100%', marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <Loader />
                </div>
              ) : (
                <>
                  {Object.entries(filteredCategories).map(([category, chargesArray]) => (
                    <div key={category}>
                      <Text style={{ fontSize: 17, color: "white" }} weight={500}>
                        {category}
                      </Text>
                      <div className='edit-charges-modal-charges-content'>
                        {chargesArray.map((charge, index) => (
                          <div className="edit-charges-modal-charge-card" key={index}>
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
                                {charge.time} {locales.months}
                              </Badge>
            
                              <Badge 
                                radius="xs" 
                                variant="filled"
                                style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, margin: 5, fontWeight: 500}}
                              >
                                {charge.points} {locales.points}
                              </Badge>
                            </div>
            
                            <Tooltip label={charge.description} multiline withArrow color='gray'>
                              <Text fz='xs' fw={500} mt={5} style={{textAlign: 'center'}} lineClamp={2}>
                                {charge.description}
                              </Text>
                            </Tooltip>
            
                            <Group position="apart">
                              <Badge 
                                radius="xs" 
                                variant="filled"
                                style={{fontSize: 10, padding: 12.5, fontWeight: 500}}
                                color={charge.type.toLocaleLowerCase() === 'felony' ? 'red' : (charge.type.toLocaleLowerCase() === 'infraction' ? 'green' : 'yellow')}
                              >
                                {charge.type}
                              </Badge>
            
                              <Tooltip label={locales.add_charge} withArrow color='gray'>
                                <ActionIcon 
                                  onClick={() =>
                                    setSelectedCharges((prev) => {
                                      const prevChargeIndex = prev.findIndex((el) => el.label === charge.label);

                                      if (prevChargeIndex === -1) {
                                        return [...prev, {
                                          ...charge,
                                          count: 1
                                        }];
                                      }

                                      return prev.map((el, index) => {
                                        if (index === prevChargeIndex) {
                                          return { ...el, count: ++el.count };
                                        }

                                        return el;
                                      });
                                    })
                                  } 
                                  h={31} 
                                  className='action-icon'
                                >
                                  <IconPlus size={18} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default EditChargesModal