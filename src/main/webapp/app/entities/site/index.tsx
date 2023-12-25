import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Site from './site';
import SiteDetail from './site-detail';
import SiteUpdate from './site-update';
import SiteDeleteDialog from './site-delete-dialog';

const SiteRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Site />} />
    <Route path="new" element={<SiteUpdate />} />
    <Route path=":id">
      <Route index element={<SiteDetail />} />
      <Route path="edit" element={<SiteUpdate />} />
      <Route path="delete" element={<SiteDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SiteRoutes;
