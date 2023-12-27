import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MyRend, PATH_SEPARATOR, ROOT_PATH_SEPARATOR } from './rendering';
import { SmRefToResource } from './resource-content';

export const RenderResourcePage = props => {
  const dispatch = useAppDispatch();

  const { orgaId } = useParams<'orgaId'>();
  const { resourceId } = useParams<'resourceId'>();

  // useEffect(() => {
  //   dispatch(getEntity(resourceId));
  // }, [resourceId]);

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
