import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IResource } from 'app/shared/model/resource.model';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { usePageContext, useResourceStateFromPageResources } from './sm-layout';
import { getValueForPathInObject, getRootPath } from './shared';
import { getResourceForPageResources, setInLocalState, setRenderingCurrentPageId, setRenderingPageContext } from './rendering.reducer';
import { SmRefToResource } from './sm-resource-content';
import { ValueInState, ComponentResource, ComponentResourceProperties, RENDERING_CONTEXT, RenderingSliceState } from './type';
import { UpdateResourceDialog } from '../resource/resource-update-dialog';
import { DeleteResourceDialog } from '../resource/resource-delete-dialog';
import UiResourceUpdateDialog from '../resource/ui-resource-update-dialog';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { updateShowUiOpener } from 'app/shared/reducers/application-profile';
import { publishShowStateEvent } from './action.utils';
import UiShowStateDialog from '../resource/show-state-dialog';

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
    // console.log('useResourceFromPageResources 1', resourceId, fetchedResourceState);
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

  return (
    <div>
      <h1>OrgaId: {orgaId}</h1>
      <h1>ResourceId: {resourceId}</h1>
      <Form>
        <FormGroup switch>
          <Input
            type="switch"
            checked={showUiOpener}
            onClick={() => {
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
      <UiShowStateDialog></UiShowStateDialog>
      <UiResourceUpdateDialog></UiResourceUpdateDialog>
      <UpdateResourceDialog></UpdateResourceDialog>
      <DeleteResourceDialog></DeleteResourceDialog>
      <SmRefToResource currentPath="" path="" params={{ resourceId }} localContextPath="" depth="0"></SmRefToResource>
    </div>
  );
};
