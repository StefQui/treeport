import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Organisation from './organisation';
import OrganisationDetail from './organisation-detail';
import OrganisationUpdate from './organisation-update';
import OrganisationDeleteDialog from './organisation-delete-dialog';

const OrganisationRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Organisation />} />
    <Route path="new" element={<OrganisationUpdate />} />
    <Route path=":id">
      <Route index element={<OrganisationDetail />} />
      <Route path="edit" element={<OrganisationUpdate />} />
      <Route path="delete" element={<OrganisationDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default OrganisationRoutes;
