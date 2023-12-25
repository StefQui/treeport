import organisation from 'app/entities/organisation/organisation.reducer';
import attributeConfig from 'app/entities/attribute-config/attribute-config.reducer';
import attribute from 'app/entities/attribute/attribute.reducer';
import tag from 'app/entities/tag/tag.reducer';
import campaign from 'app/entities/campaign/campaign.reducer';
import resource from 'app/entities/resource/resource.reducer';
import site from 'app/entities/site/site.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  organisation,
  site,
  resource,
  attributeConfig,
  attribute,
  tag,
  campaign,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
