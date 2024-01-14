import { useAppDispatch } from 'app/config/store';
import { IResource } from 'app/shared/model/resource.model';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { usePageContext, useResourceStateFromPageResources } from './layout';
import {
  ComponentResource,
  ComponentResourceProperties,
  COMPONENT_TYPE,
  getRootPath,
  getValueForPathInObject,
  PageResourceContent,
  PARAMETER_DEFINITIONS,
  RENDERING_CONTEXT,
  RESOURCE_CONTENT_KEY,
  RESOURCE_CONTENT_PROPERTY,
  RESOURCE_PARAMETER_KEY,
  ValueInState,
} from './rendering';
import { getResourceForPageResources, setInLocalState, setRenderingCurrentPageId, setRenderingPageContext } from './rendering.reducer';
import { SmRefToResource } from './resource-content';

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

export const useResourceFromPageResources = (resourceId: string, fetchedResourceState: ValueInState): IResource | null => {
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
        dispatch(
          setInLocalState({
            localContextPath: getRootPath(),
            parameterKey: param[RESOURCE_PARAMETER_KEY],
            value: c[param[RESOURCE_PARAMETER_KEY]],
          }),
        );
        // s;
      });

      dispatch(setRenderingPageContext(c));
    }
  }, [locationSearch, pageParameters]);
};

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

  // fillPageContext(pageParameters);

  // console.log('RenderResourcePage', pageResourceContent, pageContent, resourceId);

  if (!resourceId) {
    return <span>Missing resourceId in RenderResourcePage</span>;
  }
  const pageContext: RENDERING_CONTEXT = usePageContext();

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
