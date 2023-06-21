import { Paragraph } from '@contentful/f36-components';
import { HomeAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { PageRouter } from './Page';

const Home = () => {
  const sdk = useSDK<HomeAppSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  // return <Paragraph>Hello Home Component (AppId: {sdk.ids.app})</Paragraph>;

  // To use Home location go to Settings -> Home and set this ap as Home app in
  // the Appearance section.
  return <PageRouter />;
};

export default Home;
