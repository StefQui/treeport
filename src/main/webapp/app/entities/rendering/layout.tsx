import { useAppDispatch } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import {
  buildPath,
  LAYOUT_ELEMENTS_KEY,
  LAYOUT_ELEMENT_ID,
  LAYOUT_RESOURCE_ID_KEY,
  RESOURCE_FROM_REF_KEY,
  useRenderingState,
} from './rendering';
import { getResource } from './rendering.reducer';
import { MyRend } from './resource-content';

export const SmPage = props => {
  console.log('SmPage', props);

  const dispatch = useAppDispatch();
  const layoutId = props[LAYOUT_RESOURCE_ID_KEY];
  const builtPath = buildPath(props);
  const layout = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);
  const [layoutContent, setLayoutContent] = useState();
  const layoutElements = props[LAYOUT_ELEMENTS_KEY];

  if (!layoutId) {
    return <span>Missing {LAYOUT_RESOURCE_ID_KEY} in Page</span>;
  }
  if (!layoutElements) {
    return <span>Missing {LAYOUT_ELEMENTS_KEY} in Page</span>;
  }

  useEffect(() => {
    dispatch(
      getResource({
        resourceId: layoutId,
        path: builtPath,
      }),
    );
  }, []);

  useEffect(() => {
    if (layout) {
      setLayoutContent(layout.content);
    }
  }, [layout]);

  if (!layoutContent) {
    return <span>Cannot display layout content</span>;
  }
  return (
    <MyRend
      content={layoutContent}
      params={props.params}
      currentPath={builtPath}
      localContextPath={builtPath}
      layoutElements={props.layoutElements}
    ></MyRend>
  );
};

export const SmLayoutElement = props => {
  console.log('SmLayoutElement', props);
  const dispatch = useAppDispatch();
  const layoutElements = props[LAYOUT_ELEMENTS_KEY];
  const layoutElementId = props[LAYOUT_ELEMENT_ID];
  const builtPath = buildPath(props);
  const layoutElement = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);
  const [layoutElementContent, setLayoutElementContent] = useState();

  if (!layoutElements) {
    return <span>Missing layout elements in layout Element</span>;
  }

  if (!layoutElementId) {
    return <span>Missing layoutElementId in layout Element</span>;
  }

  useEffect(() => {
    dispatch(
      getResource({
        resourceId: layoutElements.find(le => le.layoutElementId === layoutElementId).resourceId,
        path: builtPath,
      }),
    );
  }, []);

  useEffect(() => {
    if (layoutElement) {
      setLayoutElementContent(layoutElement.content);
    }
  }, [layoutElement]);

  if (!layoutElementContent) {
    return <span>Cannot display layout element content</span>;
  }
  return (
    <MyRend
      content={layoutElementContent}
      params={props.params}
      currentPath={builtPath}
      localContextPath={builtPath}
      layoutElements={props.layoutElements}
    ></MyRend>
  );
};

export const SmMenu = props => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return <span>Menu</span>;
};
