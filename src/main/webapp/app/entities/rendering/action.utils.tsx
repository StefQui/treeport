import { useAppSelector } from 'app/config/store';
import { IResourceAndImpacters } from 'app/shared/model/resource-and-impacters.model';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ActionState,
  ColumnDefinition,
  ComponentResourceContent,
  PageResourceContent,
  RenderingSliceState,
  UpdatedResourceAction,
} from './type';

export type CreatedResourceEvent = {
  source: string;
  resourceAndImpacters: IResourceAndImpacters;
  resourceParentId: string;
  route: string[];
} | null;

export type DeletedResourceEvent = {
  source: string;
  resourceId: string;
  route: string[];
} | null;

export type EditResourceForUpdateEvent = {
  source: string;
  resourceToEdit: IResourceWithValue;
  columnDefinitions: ColumnDefinition[];
} | null;

export type EditResourceForAddEvent = {
  source: string;
  resourceToAddParentId: IResourceWithValue;
  route: string[];
  columnDefinitions: ColumnDefinition[];
} | null;

export type DeleteResourceEvent = {
  source: string;
  resourceToDeleteId: string;
  route: string[];
} | null;

export type EditUiResourceForUpdateEvent = {
  source: string;
  resourceIdToEdit?: string;
  resourceContent?: ComponentResourceContent;
} | null;

export type ShowStatevent = {
  stateId: string;
} | null;

const updatedResource = 'updatedResource';
const createdResource = 'createdResource';
const deletedResource = 'deletedResource';
const editResourceForUpdate = 'editResourceForUpdate';
const editResourceForadd = 'editResourceForadd';
const deleteResource = 'deleteResource';
const editUiResourceForUpdate = 'editUiResourceForUpdate';
const showState = 'showState';

export const subscribeToDeletedResource = (listener: (DeletedResourceAction) => void) => {
  useEffect(() => {
    document.addEventListener(deletedResource, listener as any);
    return () => {
      document.removeEventListener(deletedResource, listener as any);
    };
  }, []);
};

export const publishDeletedResourceEvent = (data: DeletedResourceEvent) => {
  const event = new CustomEvent(deletedResource, { detail: data });
  document.dispatchEvent(event);
};

export const subscribeToUpdatedResource = (listener: (UpdatedResourceAction) => void) => {
  useEffect(() => {
    document.addEventListener(updatedResource, listener as any);
    return () => {
      document.removeEventListener(updatedResource, listener as any);
    };
  }, []);
};

export const publishUpdatedResourceEvent = (data: UpdatedResourceAction) => {
  const event = new CustomEvent(updatedResource, { detail: data });
  document.dispatchEvent(event);
};

export const subscribeToCreatedResource = (listener: (CreatedResourceEvent) => void) => {
  useEffect(() => {
    document.addEventListener(createdResource, listener as any);
    return () => {
      document.removeEventListener(createdResource, listener as any);
    };
  }, []);
};

export const publishCreatedResourceEvent = (data: CreatedResourceEvent) => {
  const event = new CustomEvent(createdResource, { detail: data });
  document.dispatchEvent(event);
};

export const subscribeToEditResourceForUpdate = (listener: (EditResourceForUpdateEvent) => void) => {
  useEffect(() => {
    document.addEventListener(editResourceForUpdate, listener as any);
    return () => {
      document.removeEventListener(editResourceForUpdate, listener as any);
    };
  }, []);
};

export const publishEditResourceForUpdateEvent = (data: EditResourceForUpdateEvent) => {
  const event = new CustomEvent(editResourceForUpdate, { detail: data });
  document.dispatchEvent(event);
  toast.success(editResourceForUpdate);
};

export const subscribeToEditResourceForAdd = (listener: (EditResourceForAddEvent) => void) => {
  useEffect(() => {
    document.addEventListener(editResourceForadd, listener as any);
    return () => {
      document.removeEventListener(editResourceForadd, listener as any);
    };
  }, []);
};

export const publishEditResourceForAddEvent = (data: EditResourceForAddEvent) => {
  const event = new CustomEvent(editResourceForadd, { detail: data });
  document.dispatchEvent(event);
  toast.success(editResourceForadd);
};

export const subscribeToDeleteResource = (listener: (DeleteResourceEvent) => void) => {
  useEffect(() => {
    document.addEventListener(deleteResource, listener as any);
    return () => {
      document.removeEventListener(deleteResource, listener as any);
    };
  }, []);
};

export const publishDeleteResourceEvent = (data: DeleteResourceEvent) => {
  const event = new CustomEvent(deleteResource, { detail: data });
  document.dispatchEvent(event);
};

export const subscribeToEditUiResourceForUpdate = (listener: (EditUiResourceForUpdateEvent) => void) => {
  useEffect(() => {
    document.addEventListener(editUiResourceForUpdate, listener as any);
    return () => {
      document.removeEventListener(editUiResourceForUpdate, listener as any);
    };
  }, []);
};

export const publishEditUiResourceForUpdateEvent = (data: EditUiResourceForUpdateEvent) => {
  const event = new CustomEvent(editUiResourceForUpdate, { detail: data });
  document.dispatchEvent(event);
  toast.success(editUiResourceForUpdate);
};

export const subscribeToShowState = (listener: (ShowStatevent) => void) => {
  useEffect(() => {
    document.addEventListener(showState, listener as any);
    return () => {
      document.removeEventListener(showState, listener as any);
    };
  }, []);
};

export const publishShowStateEvent = (data: ShowStatevent) => {
  const event = new CustomEvent(showState, { detail: data });
  document.dispatchEvent(event);
  toast.success(showState);
};
