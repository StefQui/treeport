import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { calculateTargetLocalContextPath } from './sm-resource-content';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { fillPageContext, usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import {
  SmPageProps,
  RenderingSliceState,
  ValueInState,
  PageLayoutElement,
  LayoutElementComponentResource,
  PageComponentResource,
  SmLayoutElementProps,
} from './type';
import { increment, MyElem } from './rendering';
import { buildPath, PATH_SEPARATOR } from './shared';
// import { setRenderingLayoutElements } from './rendering.reducer';

export const SmPage = (props: SmPageProps) => {
  // console.log('SmPage', props);
  const dispatch = useAppDispatch();

  const layoutId = props.params.layoutResourceId;
  const builtPath = buildPath(props);
  const currentPageId = useAppSelector((state: RenderingSliceState) => state.rendering.currentPageId);

  if (!layoutId) {
    return <span>Missing layoutResourceId in Page</span>;
  }

  const layout = usePageResourceContentFromResourceId(layoutId);
  const currentPage = usePageResourceContentFromResourceId(currentPageId);
  const currentPageParameters = useResourceWithKey(currentPage, 'parameters');

  // const layoutElements = useAppSelector(state => state.rendering[STATE_LAYOUT_ELEMENTS_KEY]);
  // console.log('props.depth', props.depth);
  if (props.depth === '1') {
    // console.log('fillPageContext', currentPageParameters);
    fillPageContext(currentPageParameters);
  }

  // console.log('layout', layout);
  const layoutContent = useResourceWithKey(layout, 'content');

  if (!layout) {
    return <span>Cannot fing layout for {layoutId} in Page</span>;
  }

  if (!layoutContent) {
    return <span>Cannot display layout content in Page</span>;
  }

  return (
    <MyElem
      input={layoutContent}
      depth={increment(props.depth)}
      // params={props.params ? props.params.params : null}
      currentPath={builtPath}
      localContextPath={props.localContextPath}
    ></MyElem>
  );
};

export const useResourceStateFromPageResources = (resourceId): ValueInState => {
  return useAppSelector((state: RenderingSliceState) => state.rendering.pageResources[resourceId]);
};

export const usePageContext = () => {
  return useAppSelector((state: RenderingSliceState) => state.rendering.pageContext);
};

// export const useLocalContext = builtPath => {
//   return useAppSelector((state: RenderingSliceState) => state.rendering[STATE_PAGE_CONTEXT_KEY]);
// };

const useLayoutElementResourceId = (layoutElements: PageLayoutElement[], layoutElementId: string) => {
  const [layoutElementResourceId, setLayoutElementResourceId] = useState(null);

  useEffect(() => {
    if (layoutElements) {
      // console.log('layoutElement222', layoutElement, layoutElementId);
      const layoutElement = layoutElements.find(le => le.layoutElementId === layoutElementId);
      if (layoutElement) {
        setLayoutElementResourceId(layoutElement.resourceId);
      }
    }
  }, [layoutElements]);

  return layoutElementResourceId;
};

const useLayoutElementResource = (currentPageId, layoutElementId): LayoutElementComponentResource => {
  const layoutElements: PageLayoutElement[] = useLayoutElements(currentPageId);
  const layoutElementResourceId: string = useLayoutElementResourceId(layoutElements, layoutElementId);
  return usePageResourceContentFromResourceId(layoutElementResourceId) as LayoutElementComponentResource;
};

// const useLayoutElementResourceContent = (layoutElements, layoutElementId) => {
//   const layoutElementResource = useLayoutElementResource(layoutElements, layoutElementId);
//   // return usePageResourceContentFromResourceId(layoutElementResourceId);
//   const [layoutElementResourceContent, setLayoutElementResourceContent] = useState();

//   useEffect(() => {
//     if (layoutElementResource) {
//       // console.log('layoutElement222', layoutElementId);
//       setLayoutElementResourceContent(layoutElementResource[RESOURCE_CONTENT_KEY]);

//       // setLayoutElementContent(layoutElement[RESOURCE_CONTENT_KEY]);
//     }
//   }, [layoutElementResource]);

//   return layoutElementResourceContent;
// };

// export const useLayoutElementId2 = currentPage => {
//   const [layoutElementId, setLayoutElementId] = useState();
//   useEffect(() => {
//     if (currentPage && currentPage[RESOURCE_CONTENT_KEY]) {
//       // console.log('layoutElement333', currentPage);
//       setLayoutElementId(currentPage[RESOURCE_CONTENT_KEY][LAYOUT_RESOURCE_ID_KEY]);
//     }
//   }, [currentPage]);

//   return layoutElementId;
// };

// export const useLayoutId = currentPage => {
//   const [layoutId, setLayoutId] = useState();
//   useEffect(() => {
//     if (currentPage && currentPage[RESOURCE_CONTENT_KEY]) {
//       // console.log('layoutElement333', currentPage);
//       setLayoutId(currentPage[RESOURCE_CONTENT_KEY][LAYOUT_RESOURCE_ID_KEY]);
//     }
//   }, [currentPage]);

//   return layoutId;
// };

const useLayoutElements = (currentPageId): PageLayoutElement[] => {
  const [layoutElements, setLayoutElements] = useState([]);
  const currentPage: PageComponentResource = usePageResourceContentFromResourceId(currentPageId) as PageComponentResource;
  useEffect(() => {
    if (currentPage && currentPage.content && currentPage.content.params) {
      setLayoutElements(currentPage.content.params.layoutElements);
    }
  }, [currentPage]);
  return layoutElements;
};

export const SmLayoutElement = (props: SmLayoutElementProps) => {
  // console.log('SmLayoutElement', props);
  const dispatch = useAppDispatch();
  const layoutElementId = props.params.layoutElementId;
  const builtPath = buildPath(props);
  const currentPageId: string = useAppSelector((state: RenderingSliceState) => state.rendering.currentPageId);

  const params = props.params;

  const layoutElementResource: LayoutElementComponentResource = useLayoutElementResource(currentPageId, layoutElementId);
  const layoutElementResourceContent = useResourceWithKey(layoutElementResource, 'content');
  const layoutElementResourceParameters = useResourceWithKey(layoutElementResource, 'parameters');

  if (!layoutElementId) {
    return <span>Missing layoutElementId in layout Element</span>;
  }

  // console.log('layoutElementResourceContent', layoutElementResourceContent, props.path, props.currentPath);

  if (!layoutElementResourceContent) {
    return <span>Cannot display layout element content</span>;
  }
  return (
    <MyElem
      input={layoutElementResourceContent}
      depth={props.depth}
      // params={props.params ? props.params.params : null}
      currentPath={props.currentPath + PATH_SEPARATOR + props.path}
      localContextPath={calculateTargetLocalContextPath(true, props)}
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
            <Nav.Link as={NavLink} to="/coca/render/rpageDs">
              Dataset
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpageDsWithForm">
              DatasetWithForm
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpageDsList">
              DataList
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpageDtTree">
              DataTree
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpageAgGrid">
              Aggrid
            </Nav.Link>
            <Nav.Link as={NavLink} to="/coca/render/rpageAgGridServer">
              AggSeerver
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
