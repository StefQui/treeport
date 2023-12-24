import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { RenderResource } from 'app/rendering/render-resource';

const RenderingRoutes = () => (
  <ErrorBoundaryRoutes>
    {/* <Route index element={<Home />} /> */}
    <Route path="sssrender/:resourceId" element={<RenderResource />} />
  </ErrorBoundaryRoutes>
);

export default RenderingRoutes;
