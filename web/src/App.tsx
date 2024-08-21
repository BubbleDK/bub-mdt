import React from 'react';
import MDT from './layers/mdt/MDT';
import Dev from './layers/dev/Dev';
import { isEnvBrowser } from './utils/misc';
import DispatchNotifications from './layers/notifications/DispatchNotifications';
import Dispatch from './layers/dispatch/Disptach';

function App() {
  return (
    <>
      <Dispatch />
      <MDT />
      <DispatchNotifications />
      {isEnvBrowser() && <Dev />}
    </>
  );
}

export default App;