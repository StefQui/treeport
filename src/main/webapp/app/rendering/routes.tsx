import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { RenderResource } from './render-resource';

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="render/:resourceId" element={<RenderResource />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};
