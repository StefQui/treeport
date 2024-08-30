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

// export const partialUpdateEntity = createAsyncThunk(
//   'site/partial_update_entity',
//   async ({ entity, orgaId }: { entity: ISite; orgaId: string }, thunkAPI) => {
//     const result = await axios.patch<ISite>(`api/orga/${orgaId}/sites${entity.id}`, cleanEntity(entity));
//     // thunkAPI.dispatch(getEntities({}));
//     return result;
//   },
//   { serializeError: serializeAxiosError },
// );

// slice

// export const SiteSlice = createEntitySlice({
//   name: 'site',
//   initialState,
// });

// export const {} = SiteSlice.actions;

// // Reducer
// export default SiteSlice.reducer;
