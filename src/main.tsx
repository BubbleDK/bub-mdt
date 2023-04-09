import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { isEnvBrowser } from './utils/misc';
import { ModalsProvider } from '@mantine/modals';
import { HashRouter } from 'react-router-dom';
import { debugData } from './utils/debugData';

debugData([
  {
    action: 'setupMdt',
    data: {
      alerts: [
        { id: 1, CoordsY: -3058.53, CoordsX: -1960.06, displayCode: '10-71', alertName: 'Shots Fired', location: 'Mirror Park Blvd, North Vinewoord', time: new Date().valueOf(), gender: 'Male', attachedUnits: []}, 
        { id: 2, CoordsY: 164.024, CoordsX: 780.345, displayCode: '10-50', alertName: 'Vehicle Accident', location: 'Mirror Park Blvd, East Vinewoord', time: new Date().valueOf(), gender: 'Female', attachedUnits: []}, 
        { id: 3, CoordsY: -339.024, CoordsX: 183.096, displayCode: '10-60', alertName: 'Carjacking', location: 'Mirror Park Blvd, West Vinewoord', time: new Date().valueOf(), gender: 'Male', attachedUnits: []}
      ],

      officers: [
        { citizenid: 1, firstname: 'Bubble', lastname: 'Test', role: 'Cheif', callsign: 'C-01', phone: '0000000'},
        { citizenid: 2, firstname: 'John', lastname: 'Doe', role: 'Not Cheif', callsign: 'C-02', phone: '1000000'},
      ],

      units: [
        { id: 1, unitName: 'Unit-1', unitMembers: [{ citizenid: 2, firstname: 'John', lastname: 'Doe', role: 'Not Cheif', callsign: 'C-02', phone: '1000000'}], carModel: 'Dodge Charger', isOwner: 2 },
        { id: 2, unitName: 'Unit-2', unitMembers: [{ citizenid: 2, firstname: 'John', lastname: 'Doe', role: 'Not Cheif', callsign: 'C-02', phone: '1000000'}], carModel: 'Dodge Charger', isOwner: 2 },
      ],

      personalInformation: {
        citizenid: 1, 
        firstname: 'Bubble', 
        lastname: 'Test', 
        role: 'Cheif', 
        callsign: 'C-01', 
        phone: '0000000'
      }
    }
  }
])

// debugData([
//   {
//     action: 'addAlert',
//     data: { id: 1, CoordsY: -3058.53, CoordsX: -1960.06, displayCode: '10-71', alertName: 'Shots Fired', location: 'Mirror Park Blvd, North Vinewoord', time: new Date().valueOf(), gender: 'Male', attachedUnits: []}, 
//   }
// ])

if (isEnvBrowser()) {
  const root = document.getElementById('root')

  // https://i.imgur.com/iPTAdYV.png - Night time img
  root!.style.backgroundSize = 'cover'
  root!.style.backgroundRepeat = 'no-repeat'
  root!.style.backgroundPosition = 'center'
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={{colorScheme: 'dark'}}>
      <ModalsProvider>
        <HashRouter>
          <App/>
        </HashRouter>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
)
