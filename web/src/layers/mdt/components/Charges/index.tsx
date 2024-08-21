import React, { useState } from 'react'
import './index.css';
import { Button, NumberInput, ScrollArea, Select, Text, TextInput } from '@mantine/core';
import ChargeCard from './components/ChargeCard';
import { useChargeStore, usePersonalDataStore } from '../../../../stores';
import { Charge } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { ChargesObject } from '../../../../stores/chargesStore';
import { isEnvBrowser } from '../../../../utils/misc';
import locales from '../../../../locales';

const Charges = () => {
  const { charges, setCharges } = useChargeStore();
  const personalRole = usePersonalDataStore(state => state.personalData.role);
  const [chargeLabel, setChargeLabel] = useState('');
  const [chargeDescription, setChargeDescription] = useState('');
  const [chargeCategory, setChargeCategory] = useState<string>('');
  const [chargeFine, setChargeFine] = useState<number | ''>(0);
  const [chargeTime, setChargeTime] = useState<number | ''>(0);
  const [chargePoints, setChargePoints] = useState<number | ''>(0);
  const [chargeType, setChargeType] = useState<'misdemeanor' | 'felony' | 'infraction'>('infraction');

  function checkPermissionForRole(personalRole: string): boolean {
    if (personalRole === 'Chief' || personalRole === 'Assistant Chief' || personalRole === 'Captain' || personalRole === 'Lieutenant' || personalRole === 'Sergeant') {
      return false;
    } else {
      return true;
    }
  }

  const sortCharges = (charges: Charge[]): Charge[] => {
    return charges.sort((a, b) => {
      const typeOrder: { [type: string]: number } = {
        'infraction': 1,
        'misdemeanor': 2,
        'felony': 3
      };

      return typeOrder[a.type] - typeOrder[b.type];
    });
  }

  const handleCreateCharge = async () => {
    if (chargeLabel.length < 3) return;
    if (chargeDescription.length < 3) return;
    if (chargeCategory.length < 2) return;
    if (chargeFine === '' || chargeFine <= 0) return;
    if (chargeType.length < 3) return;

    if (isEnvBrowser()) {
      setCharges((prevCharges) => {
        const updatedCharges : ChargesObject = {...prevCharges};
        updatedCharges[chargeCategory].push({ 
          label: chargeLabel, 
          description: chargeDescription, 
          fine: chargeFine,
          time: Number(chargeTime),
          points: Number(chargePoints),
          type: chargeType,
        });
        return updatedCharges;
      });

    } else {
      await fetchNui(
        'createCharge',
        { 
          label: chargeLabel, 
          description: chargeDescription, 
          category: chargeCategory,
          fine: chargeFine,
          time: chargeTime,
          points: chargePoints,
          type: chargeType,
        },
        { data: 1 }
      );
      setCharges((prevCharges) => {
        const updatedCharges : ChargesObject = {...prevCharges};
        updatedCharges[chargeCategory].push({ 
          label: chargeLabel, 
          description: chargeDescription, 
          fine: chargeFine,
          time: Number(chargeTime),
          points: Number(chargePoints),
          type: chargeType,
        });
        return updatedCharges;
      });
    }

    setChargeLabel('');
    setChargeDescription('');
    setChargeCategory('');
    setChargeFine(0);
    setChargeTime(0);
    setChargePoints(0);
    setChargeType('infraction');
  }

  return (
    <div className='charges'>
      <div className='top-side-create-charges'>
        <div className='charges-create'>
          <Text style={{ fontSize: 17, color: "white" }} weight={500}>
            {locales.create_charge}
          </Text>

          <div className='charges-create-content'>
            <TextInput
              withAsterisk
              label={locales.charge_label}
              variant="filled"
              placeholder={locales.charge_label}
              value={chargeLabel}
              onChange={e => setChargeLabel(e.target.value)}
              w={200}
              disabled={checkPermissionForRole(personalRole)}
            />

            <TextInput
              withAsterisk
              label={locales.charge_description}
              variant="filled"
              placeholder={locales.charge_description}
              value={chargeDescription}
              onChange={e => setChargeDescription(e.target.value)}
              w={250}
              disabled={checkPermissionForRole(personalRole)}
            />

            <Select
              withAsterisk
              label={locales.charge_category}
              placeholder={locales.charge_category}
              variant='filled'
              data={[
                { value: 'OFFENSES AGAINST PERSONS', label: 'OFFENSES AGAINST PERSONS' },
                { value: 'OFFENSES INVOLVING THEFT', label: 'OFFENSES INVOLVING THEFT' },
                { value: 'OFFENSES INVOLVING FRAUD', label: 'OFFENSES INVOLVING FRAUD' },
                { value: 'OFFENSES INVOLVING DAMAGE TO PROPERTY', label: 'OFFENSES INVOLVING DAMAGE TO PROPERTY' },
                { value: 'OFFENSES AGAINST PUBLIC ADMINISTRATION', label: 'OFFENSES AGAINST PUBLIC ADMINISTRATION' },
                { value: 'OFFENSES AGAINST PUBLIC ORDER', label: 'OFFENSES AGAINST PUBLIC ORDER' },
                { value: 'OFFENSES AGAINST HEALTH AND MORALS', label: 'OFFENSES AGAINST HEALTH AND MORALS' },
                { value: 'OFFENSES AGAINST PUBLIC SAFETY', label: 'OFFENSES AGAINST PUBLIC SAFETY' },
                { value: 'OFFENSES INVOLVING THE OPERATION OF A VEHICLE', label: 'OFFENSES INVOLVING THE OPERATION OF A VEHICLE' },
                { value: 'OFFENSES INVOLVING THE WELL-BEING OF WILDLIFE', label: 'OFFENSES INVOLVING THE WELL-BEING OF WILDLIFE' },
              ]}
              value={chargeCategory}
              onChange={(val: string) => setChargeCategory(val)}
              w={275}
              disabled={checkPermissionForRole(personalRole)}
            />

            <NumberInput
              withAsterisk
              label={locales.charge_fine}
              value={chargeFine}
              onChange={setChargeFine}
              min={0}
              variant="filled"
              placeholder={locales.charge_fine}
              w={140}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                  : '$ '
              }
              disabled={checkPermissionForRole(personalRole)}
            />

            <NumberInput
              label={locales.charge_jailtime}
              value={chargeTime}
              onChange={setChargeTime}
              min={0}
              placeholder={locales.charge_jailtime}
              variant='filled'
              w={115}
              disabled={checkPermissionForRole(personalRole)}
            />

            <NumberInput
              label={locales.charge_points}
              value={chargePoints}
              onChange={setChargePoints}
              min={0}
              placeholder={locales.charge_points}
              variant='filled'
              w={125}
              disabled={checkPermissionForRole(personalRole)}
            />

            <Select
              withAsterisk
              label={locales.charge_type}
              placeholder={locales.charge_type}
              variant='filled'
              data={[
                { value: 'infraction', label: 'Infraction' },
                { value: 'misdemeanor', label: 'Misdemeanor' },
                { value: 'felony', label: 'Felony' },
              ]}
              w={156}
              disabled={checkPermissionForRole(personalRole)}
              value={chargeType}
              onChange={(val: 'misdemeanor' | 'felony' | 'infraction') => setChargeType(val)}
            />
          </div>

          <div className='charges-create-buttons'>
            <Button color="green" disabled={checkPermissionForRole(personalRole)} onClick={handleCreateCharge}>
              {locales.create}
            </Button>
          </div>
        </div>
      </div>
      
      <ScrollArea h={700} scrollbarSize={4}>
        <div className='charges-all-charges'>
          <div className='charges-category'>
            {Object.entries(charges).map(([category, charges]) => (
              <div key={category}>
                <Text style={{ fontSize: 17, color: "white" }} weight={500}>
                  {category}
                </Text>

                <div className='charges-cards-row'>
                  {sortCharges(charges).map(charge => (
                    <ChargeCard charge={charge} key={charge.label} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Charges