import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import AttributeConfig from './attribute-config';
import AttributeConfigDetail from './attribute-config-detail';
import AttributeConfigUpdate from './attribute-config-update';
import AttributeConfigDeleteDialog from './attribute-config-delete-dialog';

const AttributeConfigRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<AttributeConfig />} />
    <Route path="new" element={<AttributeConfigUpdate />} />
    <Route path=":id">
      <Route index element={<AttributeConfigDetail />} />
      <Route path="edit" element={<AttributeConfigUpdate />} />
      <Route path="delete" element={<AttributeConfigDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AttributeConfigRoutes;
