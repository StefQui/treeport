import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Organisation from './organisation';
import Asset from './asset';
import AttributeConfig from './attribute-config';
import Attribute from './attribute';
import Tag from './tag';
import Campaign from './campaign';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="organisation/*" element={<Organisation />} />
        <Route path="asset/*" element={<Asset />} />
        <Route path="attribute-config/*" element={<AttributeConfig />} />
        <Route path="attribute/*" element={<Attribute />} />
        <Route path="tag/*" element={<Tag />} />
        <Route path="campaign/*" element={<Campaign />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
