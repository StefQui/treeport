import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ISite, defaultValue } from 'app/shared/model/site.model';
import { useParams } from 'react-router';
import { ColumnDefinition } from '../rendering/type';
import { ISiteAndImpacters } from 'app/shared/model/site-and-impacters.model';

const initialState: EntityState<ISite> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  entityAndImpacters: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

// Actions

export const getEntities = createAsyncThunk('site/fetch_entity_list', async ({ page, size, sort, orgaId }: IQueryParams) => {
  const requestUrl = `api/orga/${orgaId}/sites?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<ISite[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'site/fetch_entity',
  async ({ id, orgaId }: { id: string | number; orgaId: string }) => {
    const requestUrl = `api/orga/${orgaId}/sites/${id}`;
    return axios.get<ISite>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'site/create_entity',
  async ({ entity, orgaId, columnDefinitions }: { entity: ISite; orgaId: string; columnDefinitions: ColumnDefinition[] }, thunkAPI) => {
    const result = await axios.post<ISiteAndImpacters>(`api/orga/${orgaId}/sites`, {
      siteToUpdate: cleanEntity(entity),
      columnDefinitions,
    });
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'site/update_entity',
  async ({ entity, orgaId, columnDefinitions }: { entity: ISite; orgaId: string; columnDefinitions: ColumnDefinition[] }, thunkAPI) => {
    const result = await axios.put<ISiteAndImpacters>(`api/orga/${orgaId}/sites/${entity.id}`, {
      siteToUpdate: cleanEntity(entity),
      columnDefinitions,
    });
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'site/partial_update_entity',
  async ({ entity, orgaId }: { entity: ISite; orgaId: string }, thunkAPI) => {
    const result = await axios.patch<ISite>(`api/orga/${orgaId}/sites${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'site/delete_entity',
  async ({ id, orgaId }: { id: string | number; orgaId: string }, thunkAPI) => {
    const requestUrl = `api/orga/${orgaId}/sites/${id}`;
    const result = await axios.delete<ISite>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const SiteSlice = createEntitySlice({
  name: 'site',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entityAndImpacters = action.payload.data;
      })
      .addMatcher(isFulfilled(partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = SiteSlice.actions;

// Reducer
export default SiteSlice.reducer;
