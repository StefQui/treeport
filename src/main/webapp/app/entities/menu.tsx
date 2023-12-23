import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/organisation">
        <Translate contentKey="global.menu.entities.organisation" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/asset">
        <Translate contentKey="global.menu.entities.asset" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/attribute-config">
        <Translate contentKey="global.menu.entities.attributeConfig" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/attribute">
        <Translate contentKey="global.menu.entities.attribute" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/tag">
        <Translate contentKey="global.menu.entities.tag" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/campaign">
        <Translate contentKey="global.menu.entities.campaign" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
