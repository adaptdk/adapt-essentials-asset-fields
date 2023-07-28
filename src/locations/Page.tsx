import { useEffect, useState, lazy, Suspense } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import { Heading, Box, Checkbox } from '@contentful/f36-components';
import { Workbench } from '@contentful/f36-workbench';
import { useCMA } from '@contentful/react-apps-toolkit';
import { ContentTypeProps } from 'contentful-management';

import { PageLayout } from '../components/PageLayout';

const IncompleteEntries = lazy(() => import('../components/IncompleteEntries'));
const Dashboard = lazy(() => import('../components/Dashboard'));

function NotFound() {
  return <Heading>404</Heading>;
}

const Page = () => {
  const cma = useCMA();
  const [contentTypes, setContentTypes] = useState<ContentTypeProps[]>([]);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);

  useEffect(() => {
    cma.contentType
      .getMany({})
      .then((result) => result?.items && setContentTypes(result.items));
  }, []);

  return (
    <Workbench>
      <Workbench.Header title={'Asset fields'} actions={<div>
        <Checkbox
      name="newsletter-subscribe-controlled"
      id="newsletter-subscribe-controlled"
      isChecked={autoUpdate}
      onChange={() => setAutoUpdate((prev) => !prev)}
    >Autoupdate
    </Checkbox>
      </div>} />
      <Workbench.Content>
        <Box marginTop="spacingXl" className="page">
          <Routes>
            <Route path="/" element={<PageLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={null}>
                    <Dashboard contentTypes={contentTypes} settings={{autoUpdate}} />
                  </Suspense>
                }
              />
              <Route
                path="incomplete"
                element={
                  <Suspense fallback={null}>
                    <IncompleteEntries contentTypes={contentTypes} />
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
      {/* <Workbench.Sidebar>
        <div>Hello</div>
      </Workbench.Sidebar> */}
    </Workbench>
  );
};

const PageRouter = () => {
  return (
    <BrowserRouter>
      <Page />
    </BrowserRouter>
  );
};

export default PageRouter;
