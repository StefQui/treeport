import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import {
  buildPath,
  LAYOUT_ELEMENTS_KEY,
  LAYOUT_ELEMENT_ID,
  LAYOUT_RESOURCE_ID_KEY,
  MyElem,
  RESOURCE_FROM_REF_KEY,
  useRenderingState,
} from './rendering';
import { getResource, setRenderingLayout } from './rendering.reducer';
import { MyRend } from './resource-content';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'reactstrap';
import { BrowserRouter, Link, NavLink, Router } from 'react-router-dom';

export const SmPage = props => {
  console.log('SmPage', props);

  const dispatch = useAppDispatch();
  const layoutId = props[LAYOUT_RESOURCE_ID_KEY];
  const builtPath = buildPath(props);
  const layout = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);
  const [layoutContent, setLayoutContent] = useState();
  const layoutElements = props[LAYOUT_ELEMENTS_KEY];
  const currentPageId = useAppSelector(state => state.rendering.currentPageId);

  if (!layoutId) {
    return <span>Missing {LAYOUT_RESOURCE_ID_KEY} in Page</span>;
  }

  useEffect(() => {
    console.log('SmPage layoutElements', layoutElements);
    // if (layoutElements && layoutElements.length !== 0) {
    //   dispatch(setRenderingLayout(layoutElements));
    // }

    dispatch(
      getResource({
        resourceId: layoutId,
        path: builtPath,
      }),
    );
  }, [currentPageId]);

  useEffect(() => {
    if (layout) {
      const content = JSON.parse(layout.content);
      console.log('SmPage layoutElements2', content);
      dispatch(setRenderingLayout(layoutElements));
      setLayoutContent(content);
    }
  }, [layout]);

  if (!layoutContent) {
    return <span>Cannot display layout content</span>;
  }
  return (
    <MyElem
      input={layoutContent}
      params={props.params ? props.params.params : null}
      currentPath={builtPath}
      localContextPath={props.localContextPath}
    ></MyElem>
  );

  // return <MyRend content={layoutContent} params={props.params} currentPath={builtPath} localContextPath={builtPath}></MyRend>;
};

export const SmLayoutElement = props => {
  console.log('SmLayoutElement', props);
  const dispatch = useAppDispatch();
  // const layoutElements = props[LAYOUT_ELEMENTS_KEY];
  const layoutElementId = props[LAYOUT_ELEMENT_ID];
  const builtPath = buildPath(props);
  const layoutElement = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);
  const layoutElements = useAppSelector(state => state.rendering.layoutElements);
  const [layoutElementContent, setLayoutElementContent] = useState();

  // if (!layoutElements) {
  //   return <span>Missing layout elements in layout Element</span>;
  // }

  if (!layoutElementId) {
    return <span>Missing layoutElementId in layout Element</span>;
  }

  useEffect(() => {
    console.log('SmLayoutElement layoutElement1', layoutElements);
    if (!layoutElements || layoutElements.length === 0) {
      return;
    }
    console.log('layoutelem...............', layoutElements.find(le => le.layoutElementId === layoutElementId).resourceId);
    dispatch(
      getResource({
        resourceId: layoutElements.find(le => le.layoutElementId === layoutElementId).resourceId,
        path: builtPath,
      }),
    );
  }, [layoutElements]);

  useEffect(() => {
    console.log('SmLayoutElement layoutElement2', layoutElement);
    if (layoutElement) {
      setLayoutElementContent(layoutElement.content);
    }
  }, [layoutElement]);

  if (!layoutElementContent) {
    return <span>Cannot display layout element content</span>;
  }
  return (
    <MyElem
      input={JSON.parse(layoutElementContent)}
      params={props.params ? props.params.params : null}
      currentPath={props.currentPath}
      localContextPath={props.localContextPath}
    ></MyElem>
  );
  // return <MyRend content={layoutElementContent} params={props.params} currentPath={builtPath} localContextPath={builtPath}></MyRend>;
};

export const SmMenu = props => {
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
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
