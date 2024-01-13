import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePageContext, usePageResource, useResourceStateFromPageResources } from './layout';
import {
  buildPath,
  COMPONENT_TYPE,
  getRootPath,
  getValueForPathInObject,
  MyElem,
  PARAMETER_DEFINITIONS,
  PARAMS_KEY,
  PARAMS_RESOURCE_ID_KEY,
  PATH_KEY,
  PATH_SEPARATOR,
  RENDERING_CONTEXT,
  RESOURCE_CONTENT_KEY,
  RESOURCE_CONTENT_PROPERTY,
  RESOURCE_FROM_REF_KEY,
  RESOURCE_PARAMETERS_KEY,
  RESOURCE_PARAMETER_KEY,
  RESOURCE_STATE,
  ROOT_PATH_SEPARATOR,
  STATE_PAGE_RESOURCES_KEY,
  STATE_PAGE_RESOURCE_KEY,
  STATE_RS_OUTPUTS_KEY,
  // useRenderingState,
} from './rendering';
import {
  getResourceForPageResources,
  setInRenderingStateParameters,
  // setRenderingContext,
  setRenderingCurrentPageId,
  setRenderingPageContext,
} from './rendering.reducer';
import { SmRefToResource } from './resource-content';

export const existsAndHasAValue = (resourceState: RESOURCE_STATE) => {
  return !!(resourceState && resourceState.value);
};

export const doesntExist = (resourceState: RESOURCE_STATE) => {
  return !resourceState || (!resourceState.loading && !resourceState.value);
};

export const isLoading = (resourceState: RESOURCE_STATE) => {
  return resourceState && resourceState.loading;
};

export const isError = (resourceState: RESOURCE_STATE) => {
  return resourceState && resourceState.error;
};

export const useResourceFromPageResources = (resourceId, fetchedResourceState: RESOURCE_STATE) => {
  const [resource, setResource] = useState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // console.log('useResourceFromPageResources 1', resourceId, fetchedResourceState);
    if (existsAndHasAValue(fetchedResourceState) || isLoading(fetchedResourceState) || isError(fetchedResourceState)) {
      return;
    }
    if (resourceId) {
      dispatch(
        getResourceForPageResources({
          resourceId,
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

// export const useResourceFromRenderingState = (resourceId, builtPath) => {
//   const fetchedResource = useRenderingState(builtPath, `${STATE_RS_OUTPUTS_KEY}.${resourceId}`);
//   return useResource(resourceId, fetchedResource, { path: builtPath });
// };

export const useResourceFromPageResourcesState = resourceId => {
  const fetchedResourceState = useResourceStateFromPageResources(resourceId);

  return useResourceFromPageResources(resourceId, fetchedResourceState);
};

export const useResourceContentFromResource = resource => {
  const [resourceContentAsJson, setResourceContentAsJson] = useState({});

  useEffect(() => {
    if (resource) {
      try {
        // console.log('resource', resource);
        const contentAsJson = JSON.parse(resource[RESOURCE_CONTENT_PROPERTY]);
        // console.log('resourceAfter', contentAsJson);
        setResourceContentAsJson(contentAsJson);
      } catch (ex) {
        setResourceContentAsJson({
          [RESOURCE_CONTENT_KEY]: {
            [COMPONENT_TYPE]: 'ERROR:Cannot parse json',
          },
        });
      }
    }
  }, [resource]);

  return resourceContentAsJson;
};

export const usePageResourceContentFromResourceId = resourceId => {
  const resource = useResourceFromPageResourcesState(resourceId);
  return useResourceContentFromResource(resource);
};

// export const useRenderingResourceContentFromResourceId = (resourceId, builtPath) => {
//   const resource = useResourceFromRenderingState(resourceId, builtPath);
//   return useResourceContentFromResource(resource);
// };

export const useResourceWithKey = (resource, resourceKey) => {
  const [resourceValueForKey, setResourceValueForKey] = useState();
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
        c[param[RESOURCE_PARAMETER_KEY]] = {
          value: queryParams.get(param[RESOURCE_PARAMETER_KEY]),
          loading: false,
        };
        // s;
      });
      // if (pageContext) {
      //   if (JSON.stringify(pageContext) === JSON.stringify(c)) {
      //     console.log('ABORT ABORT ABORT ABORT ABORT ABORT ABORT ABORT ABORT  ');
      //     return;
      //   }
      // }
      dispatch(setRenderingPageContext(c));
      dispatch(
        setInRenderingStateParameters({
          path: getRootPath(),
          value: c,
        }),
      );
    }
  }, [locationSearch, pageParameters]);
};

export const RenderResourcePage = () => {
  const dispatch = useAppDispatch();
  const locationPathName = useLocationPathName();
  const locationSearch = useLocationSearch();

  const { orgaId } = useParams<'orgaId'>();
  const { resourceId } = useParams<'resourceId'>();

  // const pageResourceContent = usePageResourceContentFromResourceId(resourceId);
  // const pageContent = useResourceWithKey(pageResourceContent, RESOURCE_CONTENT_KEY);
  // const pageParameters = useResourceWithKey(pageResourceContent, RESOURCE_PARAMETERS_KEY);

  useEffect(() => {
    // console.log('RenderResourcePage-useEffect', resourceId);
    dispatch(setRenderingCurrentPageId(resourceId));
  }, [resourceId]);

  // fillPageContext(pageParameters);

  // console.log('RenderResourcePage', pageResourceContent, pageContent, resourceId);

  if (!resourceId) {
    return <span>Missing resourceId in RenderResourcePage</span>;
  }
  const pageContext: RENDERING_CONTEXT = usePageContext();

  // if (!pageContent) {
  //   return <span>Missing pageContent in RenderResourcePage</span>;
  // }

  // console.log('pageResource', pageResourceContent);
  // console.log('pageParameters', pageParameters);
  // console.log('pageContent', pageContent);

  const toRender = {
    [COMPONENT_TYPE]: 'SmRefToResource',
    [PARAMS_KEY]: {
      [PARAMS_RESOURCE_ID_KEY]: resourceId,
    },
  };

  console.log('toRender', toRender);

  return (
    <div>
      <h1>OrgaId: {orgaId}</h1>
      <h1>ResourceId: {resourceId}</h1>
      <pre>{JSON.stringify(pageContext ? pageContext : {}, null, 2)}</pre>
      {/* <MyElem input={toRender} params={{}} currentPath={getRootPath()} localContextPath={''} depth="0"></MyElem> */}

      <SmRefToResource
        currentPath=""
        path=""
        params={{ resourceId, [PARAMETER_DEFINITIONS]: [] }}
        localContextPath=""
        depth="0"
      ></SmRefToResource>
    </div>
  );
};
