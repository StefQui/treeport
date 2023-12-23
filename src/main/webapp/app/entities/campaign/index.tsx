import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Campaign from './campaign';
import CampaignDetail from './campaign-detail';
import CampaignUpdate from './campaign-update';
import CampaignDeleteDialog from './campaign-delete-dialog';

const CampaignRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Campaign />} />
    <Route path="new" element={<CampaignUpdate />} />
    <Route path=":id">
      <Route index element={<CampaignDetail />} />
      <Route path="edit" element={<CampaignUpdate />} />
      <Route path="delete" element={<CampaignDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default CampaignRoutes;
