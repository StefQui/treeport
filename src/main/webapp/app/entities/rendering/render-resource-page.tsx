import getStore, { useAppDispatch, useAppSelector } from 'app/config/store';
import { IResource } from 'app/shared/model/resource.model';
import React, { StrictMode, useEffect, useState } from 'react';
import { BrowserRouter, Link, useLocation, useParams } from 'react-router-dom';
import { usePageContext, useResourceStateFromPageResources } from './sm-layout-old';
import { getValueForPathInObject, getRootPath } from './shared';
import {
  getResourceForPageResources,
  setInLocalState,
  setRenderingCurrentOrgaId,
  setRenderingCurrentPageId,
  setRenderingPageContext,
} from './rendering.reducer';
import { SmRefToResource } from './sm-resource-content';
import {
  ValueInState,
  ComponentResource,
  ComponentResourceProperties,
  RENDERING_CONTEXT,
  RenderingSliceState,
  SmLayoutResourceContent,
  SmMarkupResourceContent,
  ComponentResourceContent,
} from './type';
import { UpdateResourceDialog } from '../resource/resource-update-dialog';
import { DeleteResourceDialog } from '../resource/resource-delete-dialog';
import UiResourceUpdateDialog from '../resource/ui-resource-update-dialog';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { updateShowUiOpener } from 'app/shared/reducers/application-profile';
import { publishShowStateEvent } from './action.utils';
import UiShowStateDialog, { NavigateToHandler } from '../resource/show-state-dialog';
import { createRoot } from 'react-dom/client';
import parse from 'html-react-parser';
import { navTo } from './sm-markup';
import { MyElem } from './rendering';
import { Obj } from 'reselect/es/types';
import { replace } from 'lodash';
import { Provider } from 'react-redux';

export const existsAndHasAValue = (resourceState: ValueInState) => {
  return !!(resourceState && resourceState.value);
};

export const doesntExist = (resourceState: ValueInState) => {
  return !resourceState || (!resourceState.loading && !resourceState.value);
};

export const isLoading = (resourceState: ValueInState) => {
  return resourceState && resourceState.loading;
};

export const isError = (resourceState: ValueInState) => {
  return resourceState && resourceState.error;
};

const orgaId = 'coca';

export const useResourceFromPageResources = (resourceId: string, fetchedResourceState: ValueInState): IResource | null => {
  const [resource, setResource] = useState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('useResourceFromPageResources 1', resourceId);
    if (existsAndHasAValue(fetchedResourceState) || isLoading(fetchedResourceState) || isError(fetchedResourceState)) {
      return;
    }
    if (resourceId) {
      dispatch(
        getResourceForPageResources({
          resourceId,
          orgaId,
        }),
      );
    }
  }, [resourceId]);

  useEffect(() => {
    // console.log('useResourceFromPageResources 2', fetchedResourceState);
    if (fetchedResourceState) {
      setResource(fetchedResourceState.value);
    }
  }, [fetchedResourceState]);

  return resource;
};

export const useResourceFromPageResourcesState = (resourceId: string): IResource | null => {
  const fetchedResourceState: ValueInState = useResourceStateFromPageResources(resourceId);

  return useResourceFromPageResources(resourceId, fetchedResourceState);
};

export const useResourceContentFromResource = (resource: IResource): ComponentResource | null => {
  const [resourceContentAsJson, setResourceContentAsJson] = useState(null);

  useEffect(() => {
    if (resource) {
      try {
        // console.log('resource', resource);
        const contentAsJson = JSON.parse(resource.content);
        // console.log('resourceAfter', contentAsJson);
        setResourceContentAsJson(contentAsJson);
      } catch (ex) {
        setResourceContentAsJson({
          content: {
            componentType: 'ERROR:Cannot parse json',
          },
        });
      }
    }
  }, [resource]);

  return resourceContentAsJson;
};

export const usePageResourceContentFromResourceId = (resourceId): ComponentResource | null => {
  console.log('usePageResourceContentFromResourceId', resourceId);
  const resource: IResource | null = useResourceFromPageResourcesState(resourceId);
  return useResourceContentFromResource(resource);
};

export const useResourceWithKey = (resource: ComponentResource, resourceKey: ComponentResourceProperties) => {
  const [resourceValueForKey, setResourceValueForKey] = useState(null);
  useEffect(() => {
    if (resource) {
      setResourceValueForKey(getValueForPathInObject(resource, resourceKey));
    }
  }, [resource]);

  return resourceValueForKey;
};

export const useLocationPathName = () => {
  const location = useLocation();
  const [locationPathName, setLocationPathName] = useState('');

  useEffect(() => {
    if (location) {
      setLocationPathName(location.pathname);
    }
  }, [location]);
  return locationPathName;
};

export const useLocationSearch = () => {
  const location = useLocation();
  const [locationSearch, setLocationSearch] = useState('');

  useEffect(() => {
    if (location) {
      setLocationSearch(location.search);
    }
  }, [location]);
  return locationSearch;
};

export const useOrgaId = () => useAppSelector((state: RenderingSliceState) => state.rendering.orgaId);

export const fillPageContext = pageParameters => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const locationSearch = useLocationSearch();
  const pageContext: RENDERING_CONTEXT = usePageContext();

  useEffect(() => {
    if (location && pageParameters) {
      console.log('change loc', location, pageParameters);
      const queryParams = new URLSearchParams(location.search);
      const c: RENDERING_CONTEXT = {};
      pageParameters.forEach(param => {
        c[param.parameterKey] = {
          value: queryParams.get(param.parameterKey),
          loading: false,
        };
        dispatch(
          setInLocalState({
            localContextPath: getRootPath(),
            parameterKey: param.parameterKey,
            value: c[param.parameterKey],
          }),
        );
        // s;
      });

      dispatch(setRenderingPageContext(c));
    }
  }, [locationSearch, pageParameters]);
};

const Markup = () => {
  // const root = createRoot(document.getElementById('muRoot'));

  // console.log('root=====', root);
  // root.render(<StrictMode>{parse('<h1>parse</h1>')}</StrictMode>);

  return <h1>Markup</h1>;
};

const useLayoutIdFromResource = (resource: ComponentResource): string | null => {
  // useResourceFromPageResources
  // setAaa(usePageResourceContentFromResourceId((resource.content as SmLayoutResourceContent).params.layoutId));
  const [aaa, setAaa] = useState(null);
  useEffect(() => {
    if (resource && resource.content.componentType === 'SmLayout') {
      setAaa((resource.content as SmLayoutResourceContent).params.layoutId);
    }
  }, [resource]);
  return aaa;
};

// export const useMarkup = (resourceId: string): SmMarkupResourceContent => {
//   const [res, setRes] = useState<SmMarkupResourceContent>(null);
//   const resource: ComponentResource = usePageResourceContentFromResourceId(resourceId);
//   useEffect(() => {
//     if (!resource) {
//       return;
//     }
//     if (resource.content.componentType === 'SmMarkup') {
//       const markupContent = resource.content as SmMarkupResourceContent;
//       const itemMap = markupContent.params.itemMap;
//       const keys = Object.keys(itemMap);
//       keys.forEach(key => {
//         const compRes = itemMap[key];
//         if (resource.content.componentType !== 'SmMarkup') {
//           return;
//         }
//         const mu = resource.content as SmMarkupResourceContent;
//       });

//       setRes(markupContent);
//     }
//   }, [resource]);
//   return res;
// };

export const RenderResourcePage = () => {
  const dispatch = useAppDispatch();
  const locationPathName = useLocationPathName();
  const locationSearch = useLocationSearch();

  const { orgaId } = useParams<'orgaId'>();
  const { resourceId } = useParams<'resourceId'>();

  useEffect(() => {
    // console.log('RenderResourcePage-useEffect', resourceId);
    dispatch(setRenderingCurrentPageId(resourceId));
  }, [resourceId]);

  useEffect(() => {
    // console.log('RenderResourcePage-useEffect', resourceId);
    dispatch(setRenderingCurrentOrgaId(orgaId));
  }, [orgaId]);

  const [initialized, setInitialized] = useState(false);
  const [root, setRoot] = useState(null);

  const resource = usePageResourceContentFromResourceId(resourceId);

  useEffect(() => {
    // let r = root;
    // if (!initialized) {
    //   r = createRoot(document.getElementById('muRoot'));
    //   setRoot(r);
    //   console.log('root=====creating', r);
    //   setInitialized(true);
    // }
    console.log('rootaaaa=====', resource);
    // if (!resource) {
    //   return;
    // }
    // if (resource.content.componentType === 'SmLayout') {
    //   const layout: SmLayoutResourceContent = resource.content as SmLayoutResourceContent;
    //   r.render(
    //     <StrictMode>
    //       {parse(`<div><h1>parser${(layout.params.itemMap.content as SmMarkupResourceContent).params.markup}</h1></div>`)}
    //     </StrictMode>,
    //   );
    // }
  }, [resource]);

  const startProcessMarkup = (resource: ComponentResourceContent): { html: string; options: any } => {
    return processMarkup(resource, null, {}, null, '');
  };

  const store = getStore();
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

  const processMarkup = (
    content: ComponentResourceContent,
    html: string,
    options: any,
    key: string,
    path: string,
  ): { html: string; options: any } => {
    console.log(' upSTART000=====', content, key, html);
    if (content.componentType === 'SmMarkup') {
      const markup: SmMarkupResourceContent = content as SmMarkupResourceContent;

      let newHtml: string;
      if (!html) {
        newHtml = markup.params.markup;
        // console.log('rootprocessMarkupSTART2=====', newHtml);
      } else {
        newHtml = html.replace(`<div id="${key}"></div>`, markup.params.markup);
      }
      // console.log('rootprocessMarkup=====', newHtml);
      const keys: string[] = Object.keys(markup.params.itemMap);
      keys.forEach(key => {
        const child = markup.params.itemMap[key];
        console.log('rootprocessMarkup=====', key, child, content.inputParameters);
        if (child.componentType === 'SmMarkup') {
          const childMarkup: SmMarkupResourceContent = child as SmMarkupResourceContent;
          // console.log('rootprocessMarkupchild=====', childMarkup);
          const { html: html1, options: options1 } = processMarkup(childMarkup, newHtml, options, key, path + '/' + key);
          newHtml = html1;
        } else {
          // console.log('renderleaf', child.componentType, key, html);
          options[key] = (
            <BrowserRouter basename={baseHref}>
              <Provider store={store}>
                <MyElem
                  input={child}
                  key={new Date().getTime()}
                  depth={0}
                  inputParameters={content.inputParameters}
                  // params={props.params ? params : null}
                  // itemParam={props.itemParam}
                  // form={props.form}
                  // currentPath={props.currentPath}
                  localContextPath={path + '/' + key}
                ></MyElem>
              </Provider>
            </BrowserRouter>
          );
        }
      });
      return { html: newHtml, options };
    }
  };

  const buildOptions = (options: Object) => ({
    replace(domNode) {
      const keys: string[] = Object.keys(options);
      keys.forEach(key => {
        if (domNode.attribs && domNode.attribs.id === key) {
          console.log('root=====buildOptions', key, options[key]);
          // return options[key];
          return <h2>dddd</h2>;
        }
      });
    },
  });

  useEffect(() => {
    let r = root;
    if (!initialized) {
      r = createRoot(document.getElementById('muRoot'));
      setRoot(r);
      console.log('root=====creating', r);
      setInitialized(true);
    }
    // console.log('root=====', resource);
    if (!resource) {
      return;
    }
    // if (resource.content.componentType === 'SmMarkup') {
    //   const markup: SmMarkupResourceContent = resource.content as SmMarkupResourceContent;
    console.log('root=====1', resource);
    const { html, options: options1 } = startProcessMarkup(resource.content);
    console.log('root html=====', html, options1);
    const options = buildOptions(options1);

    r.render(
      <StrictMode>
        {parse(`<div><h1>parser</h1>${html}</div>`, {
          replace(domNode) {
            const keys: string[] = Object.keys(options1);
            console.log('root=====key', keys);
            let i = 0;
            while (i < keys.length) {
              if ((domNode as any).attribs && (domNode as any).attribs.id === keys[i]) {
                console.log('root=====i', keys[i]);
                // console.log('root=====buildOptions', key, options1[key]);
                return options1[keys[i]];
                // return <h2>dddd</h2>;
              }
              i++;
            }
          },
        })}
      </StrictMode>,
    );
    // }
  }, [resource]);

  // fillPageContext(pageParameters);

  // console.log('RenderResourcePage', pageResourceContent, pageContent, resourceId);

  if (!resourceId) {
    return <span>Missing resourceId in RenderResourcePage</span>;
  }
  const pageContext: RENDERING_CONTEXT = usePageContext();
  // const [showUiOpener, setShowUiOpener] = useState(true);
  // const showUiOpener = useAppSelector((state: RenderingSliceState) => state.rendering.showUiOpener);
  const showUiOpener = useAppSelector(state => state.applicationProfile.showUiOpener);
  const setShowUiOpener = showUiOpener => {
    dispatch(updateShowUiOpener(showUiOpener));
  };

  const showState = stateId => () => {
    publishShowStateEvent({
      stateId,
    });
  };
  // const nav = e => {
  //   e.preventDefault();
  //   navTo(url);
  // };

  return (
    <div>
      <h1>OrgaId: {orgaId}</h1>
      <h1>ResourceId: {resourceId}</h1>
      <Form>
        <FormGroup switch>
          <Input
            type="switch"
            checked={showUiOpener}
            onChange={() => {
              setShowUiOpener(!showUiOpener);
            }}
            role="switch"
          />
          <Label check>Show UI opener</Label>
        </FormGroup>
      </Form>
      <a onClick={showState('localContextsState')}>
        <u>localContextsState</u>
      </a>
      &nbsp; &nbsp;
      <a onClick={showState('pageContext')}>
        <u>pageContext</u>
      </a>
      {/* <pre>{JSON.stringify(pageContext ? pageContext : {}, null, 2)}</pre> */}
      <NavigateToHandler></NavigateToHandler>
      <UiShowStateDialog></UiShowStateDialog>
      <UiResourceUpdateDialog></UiResourceUpdateDialog>
      <UpdateResourceDialog></UpdateResourceDialog>
      <DeleteResourceDialog></DeleteResourceDialog>
      <h1>ResourcePage</h1>
      <Link
        onClick={e => {
          e.preventDefault();
          navTo('/coca/render/page6');
        }}
        to={''}
      >
        page6
      </Link>{' '}
      <Link
        onClick={e => {
          e.preventDefault();
          navTo('/coca/render/page7');
        }}
        to={''}
      >
        page7
      </Link>{' '}
      <div id="muRoot"></div>
      {/* <Markup></Markup> */}
      {/* <SmRefToResource currentPath="" path="" params={{ resourceId }} localContextPath="" depth="0"></SmRefToResource> */}
    </div>
  );
};
