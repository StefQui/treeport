import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MyRend, PATH_SEPARATOR, ROOT_PATH_SEPARATOR } from './rendering';

export const RenderResource = props => {
  const dispatch = useAppDispatch();

  const { orgaId } = useParams<'orgaId'>();
  const { resourceId } = useParams<'resourceId'>();

  useEffect(() => {
    dispatch(getEntity(resourceId));
  }, [resourceId]);

  const resource = useAppSelector(state => state.resource.entity);

  if (!resourceId) {
    return <span>Missing resourceId in RenderResource</span>;
  }
  return (
    <div>
      <h1>Orga: {orgaId}</h1>
      <h1>Resource: {resourceId}</h1>
      <h1>Resource name: {resource.name}</h1>
      <MyRend content={resource.content} currentPath={''}></MyRend>
      <pre>{resource.content}</pre>
    </div>
  );
};
