import organisation from 'app/entities/organisation/organisation.reducer';
import asset from 'app/entities/asset/asset.reducer';
import attributeConfig from 'app/entities/attribute-config/attribute-config.reducer';
import attribute from 'app/entities/attribute/attribute.reducer';
import tag from 'app/entities/tag/tag.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  organisation,
  asset,
  attributeConfig,
  attribute,
  tag,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
