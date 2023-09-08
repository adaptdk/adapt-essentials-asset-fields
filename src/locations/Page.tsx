import { lazy, Suspense } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Heading, Box, Flex } from '@contentful/f36-components';
import { Workbench } from '@contentful/f36-workbench';

import { PageLayout } from '../components/PageLayout';
import { Provider } from '../components/context/createFastContext';
import useUsers from '../components/hooks/useUsers';


const Dashboard = lazy(() => import('../components/Dashboard'));

function NotFound() {
  return <Heading>404</Heading>;
}

const Page = () => {
  useUsers();

  return (
    <Workbench>
      <Workbench.Header
        title={'Asset fields'}
        actions={
          <Flex gap="2rem" alignItems="center">
          </Flex>
        }
      />
      <Workbench.Content>
        <Box marginTop="spacingXl" className="page">
          <Routes>
            <Route path="/" element={<PageLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={null}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense fallback={null}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </Box>
      </Workbench.Content>
    </Workbench>
  );
};

const PageRouter = () => {
  return (
    <Provider>
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    </Provider>
  );
};

export default PageRouter;
