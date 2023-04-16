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
        { id: 1, CoordsY: -3058.53, CoordsX: -1960.06, displayCode: '10-71', alertName: 'Shots Fired', location: 'Mirror Park Blvd, North Vinewoord', time: new Date().valueOf(), gender: 'Male', attachedUnits: [], weapon: "CLASS 1: Pistol"}, 
        { id: 2, CoordsY: 164.024, CoordsX: 780.345, displayCode: '10-50', alertName: 'Vehicle Accident', location: 'Mirror Park Blvd, East Vinewoord', time: new Date().valueOf(), gender: 'Female', attachedUnits: [], message: 'We have a situation here'}, 
        { id: 3, CoordsY: -339.024, CoordsX: 183.096, displayCode: '10-60', alertName: 'Carjacking', location: 'Mirror Park Blvd, West Vinewoord', time: new Date().valueOf(), gender: 'Male', attachedUnits: [], vehicleModel: 'Vapid Peyote', vehiclePlate: '44KJ468'}
      ],

      officers: [
        { citizenid: 1, firstname: 'Bubble', lastname: 'Test', role: 'Cheif', callsign: 'C-01', phone: '0000000'},
        { citizenid: 2, firstname: 'John', lastname: 'Doe', role: 'Captain', callsign: 'C-02', phone: '1000000'},
      ],

      profiles: [
        {
          citizenid: "CITI12345", 
          firstname: 'Bubble', 
          lastname: 'Test', 
          birthdate: '1990-11-13', 
          gender: 'Male', 
          nationality: 'Denmark', 
          phone: '1778528281', 
          job: 'Police', 
          tags: [], 
          relatedIncidents: [1, 2], 
          image: 'https://www.gamersheroes.com/wp-content/uploads/2021/12/How-To-Fix-Invisibility-Bug-In-Agencies-In-GTA-Online.jpg', 
          notes: 'Place user information here...'
        }, 
        {
          citizenid: "CITI54321", 
          firstname: 'John',
          lastname: 'Doe', 
          birthdate: '1990-11-13', 
          gender: 'Male', 
          nationality: 'Denmark', 
          phone: '1778528281', 
          job: 'Police', 
          tags: [{ value: "dangerous", label: "Dangerous", backgroundcolor: "#C92A2A" }], 
          relatedIncidents: [1, 2], 
          image: 'https://img.gta5-mods.com/q75/images/pepe-jean-s-for-male-mp-fivem/8ac75d-13825a080b7c4e241e3628811c3fd470.png', 
          notes: 'A very dangerous criminal'
        }
      ],

      units: [],

      announcements: [{id: 1, title: 'A nice title', time: new Date().valueOf(), content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex dolor in esse numquam? Ratione ut impedit officia nemo, pariatur voluptatem quas culpa distinctio excepturi? Dolorum minima blanditiis neque natus dolor?', postedBy: {citizenid: 1, firstname: 'Bubble', lastname: 'Test', role: 'Cheif', callsign: 'C-01', phone: '0000000'}}],

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
