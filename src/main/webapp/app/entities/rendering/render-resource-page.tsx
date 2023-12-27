import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PATH_SEPARATOR, ROOT_PATH_SEPARATOR } from './rendering';
import { setRenderingContext } from './rendering.reducer';
import { SmRefToResource } from './resource-content';

export const RenderResourcePage = props => {
  const dispatch = useAppDispatch();
  const renderingParams = useSearchParams();
  const location = useLocation();

  const { orgaId } = useParams<'orgaId'>();
  const { resourceId } = useParams<'resourceId'>();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log('queryParams', queryParams);

    console.log('renderingLocation', renderingParams, Object.keys(renderingParams));

    renderingParams.forEach(item => console.log(item));
    // for (const entry of renderingParams.entries()) {
    //   console.log(entry);
    // }
    if (queryParams.get('context')) {
      const context = JSON.parse(queryParams.get('context'));
      dispatch(setRenderingContext(context));
    }
  }, [renderingParams]);

  // const resource = useAppSelector(state => state.resource.entity);

  if (!resourceId) {
    return <span>Missing resourceId in RenderResourcePage</span>;
  }

  return (
    <div>
      <h1>Orga: {orgaId}</h1>
      <h1>ResourceId: {resourceId}</h1>
      <SmRefToResource currentPath="" path="" params={{ resourceId }}></SmRefToResource>
    </div>
  );
};
