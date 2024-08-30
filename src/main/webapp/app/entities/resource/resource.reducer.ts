import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IResource, defaultValue } from 'app/shared/model/resource.model';
import { ColumnDefinition } from '../rendering/type';
import { IResourceAndImpacters } from 'app/shared/model/resource-and-impacters.model';

const initialState: EntityState<IResource> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  entityAndImpacters: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/resources';

// Actions
export const getResources = createAsyncThunk('resources/fetch_entity_list', async ({ page, size, sort, orgaId }: IQueryParams) => {
  const requestUrl = `api/orga/${orgaId}/resources?${
    sort ? `page=${page}&size=${size}&sort=${sort}&` : ''
  }cacheBuster=${new Date().getTime()}`;
  return axios.get<IResource[]>(requestUrl);
});

export const getResource = createAsyncThunk(
  'resources/fetch_entity',
  async ({ id, orgaId }: { id: string | number; orgaId: string }) => {
    const requestUrl = `api/orga/${orgaId}/resources/${id}`;
    return axios.get<IResource>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createResource = createAsyncThunk(
  'resources/create_entity',
  async ({ entity, orgaId, columnDefinitions }: { entity: IResource; orgaId: string; columnDefinitions: ColumnDefinition[] }, thunkAPI) => {
    const result = await axios.post<IResourceAndImpacters>(`api/orga/${orgaId}/resources`, {
      resourceToUpdate: cleanEntity(entity),
      columnDefinitions,
    });
    thunkAPI.dispatch(getResources({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateResource = createAsyncThunk(
  'resources/update_entity',
  async ({ entity, orgaId, columnDefinitions }: { entity: IResource; orgaId: string; columnDefinitions: ColumnDefinition[] }, thunkAPI) => {
    const result = await axios.put<IResourceAndImpacters>(`api/orga/${orgaId}/resources/${entity.id}`, {
      resourceToUpdate: cleanEntity(entity),
      columnDefinitions,
    });
    thunkAPI.dispatch(getResources({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteResource = createAsyncThunk(
  'resources/delete_entity',
  async ({ id, orgaId }: { id: string | number; orgaId: string }, thunkAPI) => {
    const requestUrl = `api/orga/${orgaId}/resources/${id}`;
    const result = await axios.delete<IResource>(requestUrl);
    thunkAPI.dispatch(getResources({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'resource/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IResource>(requestUrl);
    thunkAPI.dispatch(getResources({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const ResourceSlice = createEntitySlice({
  name: 'resource',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getResource.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getResources), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createResource, updateResource), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entityAndImpacters = action.payload.data;
      })
      .addMatcher(isPending(getResources, getResource), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createResource, updateResource, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = ResourceSlice.actions;

// Reducer
export default ResourceSlice.reducer;
