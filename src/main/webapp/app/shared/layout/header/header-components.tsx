import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';

import { NavItem, NavLink, NavbarBrand, Navbar } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stubbedResources } from 'app/entities/rendering/fake-resource';
import { ComponentResource } from 'app/entities/rendering/type';
import { createResource, getResources, updateResource } from 'app/entities/resource/resource.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/logo-jhipster.png" alt="Logo" />
  </div>
);

export const Brand = () => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
    <span className="brand-title">
      <Translate contentKey="global.title">Treeport</Translate>
    </span>
    <span className="navbar-version">{VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`}</span>
  </NavbarBrand>
);

export const Home = () => (
  <NavItem>
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      <FontAwesomeIcon icon="home" />
      <span>
        <Translate contentKey="global.menu.home">Home</Translate>
      </span>
    </NavLink>
  </NavItem>
);

export const SaveResources = () => {
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const resourceList = useAppSelector(state => state.resource.entities);

  const getAllEntities = () => {
    dispatch(
      getResources({
        page: 0,
        size: 100,
        sort: 'id',
        orgaId: 'coca',
      }),
    );
  };

  useEffect(() => {
    if (isSaving) {
      setIsSaving(false);
      saveAllGoOn();
    }
  }, [resourceList]);

  const save = (key: string) => {
    const ressource: ComponentResource = stubbedResources[key];
    if (resourceList.find(r => r.id == key)) {
      dispatch(
        updateResource({
          entity: {
            id: key,
            content: JSON.stringify(ressource.content),
            orga: { id: 'coca' },
          },
          orgaId: 'coca',
          columnDefinitions: [],
        }),
      );
    } else {
      dispatch(
        createResource({
          entity: {
            id: key,
            content: JSON.stringify(ressource.content),
            orga: { id: 'coca' },
          },
          orgaId: 'coca',
          columnDefinitions: [],
        }),
      );
    }
  };

  const saveAllGoOn = () => {
    const keys = Object.keys(stubbedResources);
    keys.forEach(key => save(key));
  };

  const saveAll = () => {
    setIsSaving(true);
    getAllEntities();
  };

  return (
    <NavItem>
      <NavLink onClick={() => saveAll()} className="d-flex align-items-center">
        <FontAwesomeIcon icon="save" />
        <span>Save resources</span>
      </NavLink>
    </NavItem>
  );
};
