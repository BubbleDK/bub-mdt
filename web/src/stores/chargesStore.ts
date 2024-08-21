import { create } from 'zustand';
import { isEnvBrowser } from '../utils/misc';
import { Charge } from '../typings';

const DEBUG_CHARGES: { [category: string]: Charge[] } = {
  'OFFENSES AGAINST PERSONS': [
    {
      label: 'Speeding',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, doloribus eveniet facere ipsam, ipsum minus modi molestiae nesciunt odio saepe sapiente sed sint voluptatibus voluptatum!',
      type: 'infraction',
      time: 0,
      fine: 2500,
      points: 4,
    },
    {
      label: 'Loitering',
      description: 'Standing go brrr',
      type: 'misdemeanor',
      time: 90,
      fine: 25000,
      points: 0,
    },
    {
      label: 'Something else 1',
      description: 'Standing go brrr',
      type: 'misdemeanor',
      time: 90,
      fine: 25000,
      points: 0,
    },
    {
      label: 'Something else 2',
      description: 'Standing go brrr',
      type: 'misdemeanor',
      time: 90,
      fine: 25000,
      points: 0,
    },
    {
      label: 'Something else 3',
      description: 'Standing go brrr',
      type: 'misdemeanor',
      time: 90,
      fine: 25000,
      points: 0,
    },
  ],

  'OFFENSES AGAINST PROPERTY': [
    {
      label: 'Robbery of a financial institution',
      description: 'Bank robbery go brrr',
      type: 'felony',
      time: 30,
      fine: 3000,
      points: 0,
    },
    {
      label: 'Something else 2 in OFFENSES AGAINST',
      description: 'Standing go brrr',
      type: 'felony',
      time: 90,
      fine: 25000,
      points: 0,
    },
    {
      label: 'Something else 3 in OFFENSES AGAINST',
      description: 'Standing go brrr',
      type: 'felony',
      time: 90,
      fine: 25000,
      points: 0,
    },
    {
      label: 'Something else 4 in OFFENSES AGAINST',
      description: 'Standing go brrr',
      type: 'felony',
      time: 90,
      fine: 25000,
      points: 0,
    },
  ],
};

export type ChargesObject = { [category: string]: Charge[] };

type ChargeStore = {
  charges: ChargesObject;
  setCharges: (newCharges: ChargesObject | ((prevState: ChargesObject) => ChargesObject)) => void; 
};

export const useChargeStore = create<ChargeStore>((set) => ({
  charges: isEnvBrowser() ? DEBUG_CHARGES : {},

  setCharges: (newCharges) => {
    set((prevState) => ({
      charges: typeof newCharges === 'function' ? newCharges(prevState.charges) : newCharges
    }));
  }
}));

export default useChargeStore;