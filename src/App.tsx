import { useMemo } from 'react';
import { locations } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

import PageRouter from './locations/Page';
import ConfigScreen from './locations/ConfigScreen';
import Field from './locations/Field';
import EntryEditor from './locations/EntryEditor';
import Sidebar from './locations/Sidebar';
import Dialog from './locations/Dialog';
import Home from './locations/Home';

const ComponentLocationSettings = {
  [locations.LOCATION_APP_CONFIG]: ConfigScreen,
  [locations.LOCATION_DIALOG]: Dialog,
  [locations.LOCATION_ENTRY_EDITOR]: EntryEditor,
  [locations.LOCATION_ENTRY_FIELD]: Field,
  [locations.LOCATION_HOME]: Home,
  [locations.LOCATION_PAGE]: PageRouter,
  [locations.LOCATION_ENTRY_SIDEBAR]: Sidebar,
};

const App = () => {
  const sdk = useSDK();
  const Component = useMemo(() => {
    for (const [location, component] of Object.entries(
      ComponentLocationSettings
    )) {
      if (sdk.location.is(location)) {
        return component;
      }
    }
  }, [sdk.location]);

  return Component ? <Component /> : null;
};

export default App;
