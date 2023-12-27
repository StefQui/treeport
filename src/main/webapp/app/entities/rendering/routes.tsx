import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { RenderResourcePage } from './render-resource-page';

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="render/:resourceId" element={<RenderResourcePage />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};
