import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PATH_SEPARATOR, ROOT_PATH_SEPARATOR } from './rendering';
import { setRenderingContext, setRenderingCurrentPageId } from './rendering.reducer';
import { SmRefToResource } from './resource-content';

export const RenderResourcePage = props => {
  const dispatch = useAppDispatch();
  const renderingParams = useSearchParams();
  const location = useLocation();

  const { orgaId } = useParams<'orgaId'>();
  const { resourceId } = useParams<'resourceId'>();

  const [localContext, setLocalContext] = useState({});
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log('queryParams', queryParams);

    console.log('renderingLocation', renderingParams, Object.keys(renderingParams));

    renderingParams.forEach(item => console.log('renderingParamsItem', item));
    // for (const entry of renderingParams.entries()) {
    //   console.log(entry);
    // }
    if (queryParams.get('context')) {
      const context = JSON.parse(queryParams.get('context'));
      setLocalContext(context);
      dispatch(setRenderingContext(context));
    }
  }, [location]);

  useEffect(() => {
    // setLocalContext(localContext);
    dispatch(setRenderingCurrentPageId(resourceId));
  }, [resourceId]);
  // const resource = useAppSelector(state => state.resource.entity);

  if (!resourceId) {
    return <span>Missing resourceId in RenderResourcePage</span>;
  }

  return (
    <div>
      <h1>
        ResourceId:
        {orgaId}
      </h1>
      <h1>ResourceId: {resourceId}</h1>
      <SmRefToResource currentPath="" path="" params={{ resourceId }} localContextPath=""></SmRefToResource>
    </div>
  );
};
