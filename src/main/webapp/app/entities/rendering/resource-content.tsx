import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MyRend } from './rendering';
import { getResource } from './rendering.reducer';

export const ResourceContent = props => {
  const dispatch = useAppDispatch();
  const siteEntity = useAppSelector(state => state.site.entity);
  // const rendering = useAppSelector(state => state.rendering);
  const [value] = useState('mmmmmm');
  const initialState = {
    resource: null,
  };
  const [resourceContent, setResourceContent] = useState();

  const resource = useAppSelector(state => {
    const aaa = state.rendering.renderingState[props.path];
    return aaa ? (aaa.resource ? aaa.resource : null) : null;
  });

  useEffect(() => {
    if (props.refTo) {
      dispatch(
        getResource({
          resourceId: props.refTo,
          path: props.path,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (resource) {
      setResourceContent(resource.content);
    } else {
      setResourceContent(null);
    }
  }, [resource]);

  if (resourceContent) {
    return <MyRend content={resourceContent} params={props.params}></MyRend>;
  }
  return (
    <div>
      <span>no val</span>
    </div>
  );
};
