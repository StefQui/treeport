import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import {
  buildPath,
  increment,
  LAYOUT_ELEMENTS_KEY,
  LAYOUT_ELEMENT_ID,
  LAYOUT_ELEMENT_RESOURCE_ID,
  LAYOUT_RESOURCE_ID_KEY,
  MyElem,
  PATH_SEPARATOR,
  Rendering,
  RESOURCE_CONTENT_KEY,
  RESOURCE_FROM_REF_KEY,
  RESOURCE_PARAMETERS_KEY,
  STATE_CURRENT_PAGE_ID_KEY,
  STATE_PAGE_CONTEXT_KEY,
  STATE_PAGE_RESOURCES_KEY,
  STATE_PAGE_RESOURCE_KEY,
  // useRenderingState,
} from './rendering';
import { calculateLocalContextPath, enrichLocalContext, MyRend } from './resource-content';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'reactstrap';
import { BrowserRouter, Link, NavLink, Router } from 'react-router-dom';
import { fillPageContext, usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
// import { setRenderingLayoutElements } from './rendering.reducer';

export const SmPage = props => {
  // console.log('SmPage', props);
  const dispatch = useAppDispatch();

  const layoutId = props[LAYOUT_RESOURCE_ID_KEY];
  const builtPath = buildPath(props);
  const currentPageId = useAppSelector((state: Rendering) => state.rendering[STATE_CURRENT_PAGE_ID_KEY]);

  if (!layoutId) {
    return <span>Missing {LAYOUT_RESOURCE_ID_KEY} in Page</span>;
  }

  const layout = usePageResourceContentFromResourceId(layoutId);
  const currentPage = usePageResourceContentFromResourceId(currentPageId);
  const currentPageParameters = useResourceWithKey(currentPage, RESOURCE_PARAMETERS_KEY);

  // const layoutElements = useAppSelector(state => state.rendering[STATE_LAYOUT_ELEMENTS_KEY]);
  // console.log('props.depth', props.depth);
  if (props.depth === '1') {
    // console.log('fillPageContext', currentPageParameters);
    fillPageContext(currentPageParameters);
  }

  // console.log('layout', layout);

  if (!layout) {
    return <span>Cannot fing layout for {layoutId} in Page</span>;
  }

  const layoutContent = useResourceWithKey(layout, RESOURCE_CONTENT_KEY);

  // console.log('layoutContent', layoutContent);

  // useEffect(() => {
  //   console.log('layoutElements', layoutElements, currentPageId);
  //   if (currentPage && currentPage[RESOURCE_CONTENT_KEY]) {
  //     dispatch(setRenderingLayoutElements(currentPage[RESOURCE_CONTENT_KEY][LAYOUT_ELEMENTS_KEY]));
  //   }
  // }, [currentPage]);

  // useEffect(() => {
  //   if (layout) {
  //     const content = JSON.parse(layout.content);
  //     console.log('SmPage layoutElements2', content);
  //     dispatch(setRenderingLayout(layoutElements));
  //     setLayoutContent(content);
  //   }
  // }, [layout]);

  if (!layoutContent) {
    return <span>Cannot display layout content in Page</span>;
  }

  return (
    <MyElem
      input={layoutContent}
      depth={increment(props.depth)}
      params={props.params ? props.params.params : null}
      currentPath={builtPath}
      localContextPath={props.localContextPath}
    ></MyElem>
  );

  // return <MyRend content={layoutContent} params={props.params} currentPath={builtPath} localContextPath={builtPath}></MyRend>;
};

// const useLayoutElements = () => {
//   return useAppSelector(state => state.rendering[STATE_LAYOUT_ELEMENTS_KEY]);
// };

export const usePageResource = () => {
  return useAppSelector((state: Rendering) => state.rendering[STATE_PAGE_RESOURCE_KEY][RESOURCE_FROM_REF_KEY]);
};

export const useResourceStateFromPageResources = resourceId => {
  return useAppSelector((state: Rendering) => state.rendering[STATE_PAGE_RESOURCES_KEY][resourceId]);
};

export const usePageContext = () => {
  return useAppSelector((state: Rendering) => state.rendering[STATE_PAGE_CONTEXT_KEY]);
};

export const useLocalContext = builtPath => {
  return useAppSelector((state: Rendering) => state.rendering[STATE_PAGE_CONTEXT_KEY]);
};

// const useLayoutElementId = layoutElementId => {
//   const layoutElements = useLayoutElements();
//   const [elementId, setElementId] = useState();

//   useEffect(() => {
//     if (layoutElements && layoutElementId) {
//       console.log('useLayoutElementId', layoutElements, layoutElementId);
//       setElementId(layoutElements.find(le => le[LAYOUT_ELEMENT_ID] === layoutElementId)[LAYOUT_ELEMENT_RESOURCE_ID]);
//     }
//   }, [layoutElements, layoutElementId]);

//   return elementId;
// };

// const useLayoutElement = (layoutElementId, props) => {
//   const elementId = useLayoutElementId(layoutElementId);

//   return usePageResourceContentFromResourceId(elementId);
// };

// const useCurrentPage = (currentPageId, props) => {
//   const elementId = useLayoutElementId(layoutElementId);

//   return usePageResourceContentFromResourceId(currentPageId);
// };

const useLayoutElementResourceId = (layoutElements, layoutElementId) => {
  // const [layoutElementContent, setLayoutElementContent] = useState();
  // const layoutElement = useLayoutElement(layoutElementId, props);
  const [layoutElementResourceId, setLayoutElementResourceId] = useState();

  useEffect(() => {
    if (layoutElements) {
      // console.log('layoutElement222', layoutElement, layoutElementId);
      setLayoutElementResourceId(layoutElements.find(le => le[LAYOUT_ELEMENT_ID] === layoutElementId)[LAYOUT_ELEMENT_RESOURCE_ID]);

      // setLayoutElementContent(layoutElement[RESOURCE_CONTENT_KEY]);
    }
  }, [layoutElements]);

  return layoutElementResourceId;
};

const useLayoutElementResource = (currentPageId, layoutElementId) => {
  const layoutElements = useLayoutElements(currentPageId);
  const layoutElementResourceId = useLayoutElementResourceId(layoutElements, layoutElementId);
  return usePageResourceContentFromResourceId(layoutElementResourceId);
  // const [layoutElementResource, setLayoutElementResource] = useState();

  // useEffect(() => {
  //   if (layoutElementResourceId) {

  //     console.log('layoutElement222', layoutElement, layoutElementId);
  //     setLayoutElementResource(layoutElements.find(le => le[LAYOUT_ELEMENT_ID] === layoutElementId)[LAYOUT_ELEMENT_RESOURCE_ID]);

  //     // setLayoutElementContent(layoutElement[RESOURCE_CONTENT_KEY]);
  //   }
  // }, [layoutElementResourceId]);

  // return layoutElementResourceId;
};

const useLayoutElementResourceContent = (layoutElements, layoutElementId) => {
  const layoutElementResource = useLayoutElementResource(layoutElements, layoutElementId);
  // return usePageResourceContentFromResourceId(layoutElementResourceId);
  const [layoutElementResourceContent, setLayoutElementResourceContent] = useState();

  useEffect(() => {
    if (layoutElementResource) {
      // console.log('layoutElement222', layoutElementId);
      setLayoutElementResourceContent(layoutElementResource[RESOURCE_CONTENT_KEY]);

      // setLayoutElementContent(layoutElement[RESOURCE_CONTENT_KEY]);
    }
  }, [layoutElementResource]);

  return layoutElementResourceContent;
};

export const useLayoutElementId2 = currentPage => {
  const [layoutElementId, setLayoutElementId] = useState();
  useEffect(() => {
    if (currentPage && currentPage[RESOURCE_CONTENT_KEY]) {
      // console.log('layoutElement333', currentPage);
      setLayoutElementId(currentPage[RESOURCE_CONTENT_KEY][LAYOUT_RESOURCE_ID_KEY]);
    }
  }, [currentPage]);

  return layoutElementId;
};

export const useLayoutId = currentPage => {
  const [layoutId, setLayoutId] = useState();
  useEffect(() => {
    if (currentPage && currentPage[RESOURCE_CONTENT_KEY]) {
      // console.log('layoutElement333', currentPage);
      setLayoutId(currentPage[RESOURCE_CONTENT_KEY][LAYOUT_RESOURCE_ID_KEY]);
    }
  }, [currentPage]);

  return layoutId;
};

const useLayoutElements = currentPageId => {
  const [layoutElements, setLayoutElements] = useState();
  const currentPage = usePageResourceContentFromResourceId(currentPageId);
  useEffect(() => {
    if (currentPage && currentPage[RESOURCE_CONTENT_KEY]) {
      setLayoutElements(currentPage[RESOURCE_CONTENT_KEY][LAYOUT_ELEMENTS_KEY]);
    }
  }, [currentPage]);
  return layoutElements;
};

export const SmLayoutElement = props => {
  // console.log('SmLayoutElement', props);
  const dispatch = useAppDispatch();
  const layoutElementId = props[LAYOUT_ELEMENT_ID];
  const builtPath = buildPath(props);
  // const currentPffffageId = useAppSelector(state => state.rendering[STATE_CURRENT_PAGE_ID_KEY]);
  // const layoutElement = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);
  // const [layoutElementContent, setLayoutElementContent] = useState();
  // const currentPage = usePageResourceContentFromResourceId(currentPageId);
  // const layoutId = useLayoutId(currentPage);
  // const layout = usePageResourceContentFromResourceId(layoutId);
  // const layoutElementId = useLayoutElementId2(currentPage);
  // const layoutElementResourceId = useLayoutResource(currentPage, layoutElementId);
  const currentPageId = useAppSelector((state: Rendering) => state.rendering[STATE_CURRENT_PAGE_ID_KEY]);

  const layoutElementResource = useLayoutElementResource(currentPageId, layoutElementId);
  const layoutElementResourceContent = useResourceWithKey(layoutElementResource, RESOURCE_CONTENT_KEY);
  const layoutElementResourceParameters = useResourceWithKey(layoutElementResource, RESOURCE_PARAMETERS_KEY);
  // console.log('SmLayoutElement', layoutElementResourceParameters);

  enrichLocalContext(builtPath);

  // const pageContext = usePageContext();
  // useEffect(() => {
  // }, [pageContext]);
  // const pageContext = usePageContext();
  // const localContext = useResourceParametersFromState(builtPath);

  // const layoutElementResourceContent = useLayoutElementResourceContent(layoutElements, layoutElementId);

  // const resource = usePageResourceContentFromResourceId(resourceId);
  // const resourceContent = useResourceWithKey(resource, RESOURCE_CONTENT_KEY);
  // const resourceParameters = useResourceWithKey(resource, RESOURCE_PARAMETERS_KEY);
  // const pageContext = usePageContext();
  // const localContext = useResourceParametersFromState(builtPath);

  // if (!layoutElements) {
  //   return <span>Missing layout elements in layout Element</span>;
  // }

  if (!layoutElementId) {
    return <span>Missing layoutElementId in layout Element</span>;
  }

  // useEffect(() => {
  //   console.log('SmLayoutElement layoutElement1', layoutElements);
  //   if (!layoutElements || layoutElements.length === 0) {
  //     return;
  //   }
  //   console.log('layoutelem...............', layoutElements.find(le => le.layoutElementId === layoutElementId).resourceId);
  //   dispatch(
  //     getResource({
  //       resourceId: layoutElements.find(le => le.layoutElementId === layoutElementId).resourceId,
  //       path: builtPath,
  //     }),
  //   );
  // }, [layoutElements]);

  // useEffect(() => {
  //   console.log('SmLayoutElement layoutElement2', layoutElement);
  //   if (layoutElement) {
  //     setLayoutElementContent(layoutElement.content);
  //   }
  // }, [layoutElement]);

  console.log('layoutElementResourceContent', layoutElementResourceContent, props.path, props.currentPath);

  if (!layoutElementResourceContent) {
    return <span>Cannot display layout element content</span>;
  }
  return (
    <MyElem
      input={layoutElementResourceContent}
      depth={props.depth}
      params={props.params ? props.params.params : null}
      currentPath={props.currentPath + PATH_SEPARATOR + props.path}
      localContextPath={calculateLocalContextPath(props)}
    ></MyElem>
  );
  // return <MyRend content={layoutElementContent} params={props.params} currentPath={builtPath} localContextPath={builtPath}></MyRend>;
};

export const SmMenu = props => {
  // console.log('SmMenu', props);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          YourBrand
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/coca/render/rpage1">
              Page 1
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpage2">
              Page 2
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpage2?sid=s1">
              Page 2-1
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpage2?sid=s2">
              Page 2-2
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpage1?sid=s2">
              Page 1-2
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
function useResourceParametersFromState(builtPath: any) {
  throw new Error('Function not implemented.');
}
