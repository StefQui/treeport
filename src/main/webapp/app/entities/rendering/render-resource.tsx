import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MyRend } from './rendering';

export const RenderResource = () => {
  const dispatch = useAppDispatch();

  const { orgaId } = useParams<'orgaId'>();
  const { resourceId } = useParams<'resourceId'>();

  useEffect(() => {
    dispatch(getEntity(resourceId));
  }, [resourceId]);

  const resource = useAppSelector(state => state.resource.entity);

  return (
    <div>
      <h1>Orga: {orgaId}</h1>
      <h1>Resource: {resourceId}</h1>
      <h1>Resource name: {resource.name}</h1>
      <MyRend content={resource.content}></MyRend>
      <pre>{resource.content}</pre>
    </div>
  );
};
