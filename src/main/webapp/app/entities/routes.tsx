import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import RenderingRoutes from 'app/entities/rendering/routes';

import Organisation from './organisation';
import AttributeConfig from './attribute-config';
import Attribute from './attribute';
import Tag from './tag';
import Campaign from './campaign';
import Site from './site';
import Resource from './resource';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="organisation/*" element={<Organisation />} />
        <Route path="site/*" element={<Site />} />
        <Route path="resource/*" element={<Resource />} />
        <Route path="attribute-config/*" element={<AttributeConfig />} />
        <Route path="attribute/*" element={<Attribute />} />
        <Route path="tag/*" element={<Tag />} />
        <Route path="campaign/*" element={<Campaign />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
        <Route path=":orgaId/*" element={<RenderingRoutes />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};
