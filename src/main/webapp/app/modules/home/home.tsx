import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Row, Col, Alert, Button } from 'reactstrap';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  compute,
  reloadOrganisations,
  reloadTags,
  reloadCampaigns,
  reloadAssets,
  reloadAttributeConfigs,
  setSomeValues,
} from 'app/entities/compute/compute.reducer';

export const Home = () => {
  const dispatch = useAppDispatch();

  const account = useAppSelector(state => state.authentication.account);
  const isComputing = useAppSelector(state => (state.compute ? state.compute.isComputing : false));
  const loadingOrganisations = useAppSelector(state => (state.compute ? state.compute.loadingOrganisations : false));
  const loadingTags = useAppSelector(state => (state.compute ? state.compute.loadingTags : false));
  const loadingCampaigns = useAppSelector(state => (state.compute ? state.compute.loadingCampaigns : false));
  const loadingAssets = useAppSelector(state => (state.compute ? state.compute.loadingAssets : false));
  const loadingAttributeConfigs = useAppSelector(state => (state.compute ? state.compute.loadingAttributeConfigs : false));
  const loadingSetSomeValues = useAppSelector(state => (state.compute ? state.compute.loadingSetSomeValues : false));

  const handleCompute = () => {
    dispatch(compute());
  };

  const handleReloadOrganisations = () => {
    dispatch(reloadOrganisations());
  };

  const handleReloadTags = () => {
    dispatch(reloadTags());
  };

  const handleReloadCampaigns = () => {
    dispatch(reloadCampaigns());
  };

  const handleReloadAssets = () => {
    dispatch(reloadAssets());
  };

  const handleReloadAttributeConfigs = () => {
    dispatch(reloadAttributeConfigs());
  };

  const handleSetSomeValues = () => {
    dispatch(setSomeValues());
  };

  return (
    <Row>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
      <Col md="9">
        <h1 className="display-4">
          <Translate contentKey="home.title">Welcome, Java Hipster!</Translate>
        </h1>
        <p className="lead">
          <Translate contentKey="home.subtitle">This is your homepage</Translate>
        </p>
        <p className="lead">
          <Button className="me-2" color="info" onClick={handleCompute}>
            <FontAwesomeIcon icon="sync" spin={isComputing} /> <span>Compute</span>
          </Button>
        </p>
        <p className="lead">
          <Button className="me-2" color="info" onClick={handleReloadOrganisations}>
            <FontAwesomeIcon icon="sync" spin={loadingOrganisations} /> <span>Reload organisations</span>
          </Button>
        </p>
        <p className="lead">
          <Button className="me-2" color="info" onClick={handleReloadTags}>
            <FontAwesomeIcon icon="sync" spin={loadingTags} /> <span>Reload tags</span>
          </Button>
        </p>
        <p className="lead">
          <Button className="me-2" color="info" onClick={handleReloadCampaigns}>
            <FontAwesomeIcon icon="sync" spin={loadingCampaigns} /> <span>Reload campaigns</span>
          </Button>
        </p>
        <p className="lead">
          <Button className="me-2" color="info" onClick={handleReloadAssets}>
            <FontAwesomeIcon icon="sync" spin={loadingAssets} /> <span>Reload assets</span>
          </Button>
        </p>
        <p className="lead">
          <Button className="me-2" color="info" onClick={handleReloadAttributeConfigs}>
            <FontAwesomeIcon icon="sync" spin={loadingAttributeConfigs} /> <span>Reload attributeConfigs</span>
          </Button>
        </p>
        <p className="lead">
          <Button className="me-2" color="info" onClick={handleSetSomeValues}>
            <FontAwesomeIcon icon="sync" spin={loadingSetSomeValues} /> <span>Set some values</span>
          </Button>
        </p>
        <p>
          <Button tag={Link} to={`/coca/render/r1`} color="link" size="sm">
            /coca/render/r1
          </Button>
        </p>

        {account?.login ? (
          <div>
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
          </div>
        ) : (
          <div>
            <Alert color="warning">
              <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>

              <Link to="/login" className="alert-link">
                <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
              </Link>
              <Translate contentKey="global.messages.info.authenticated.suffix">
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Translate>
            </Alert>

            <Alert color="warning">
              <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp;
              <Link to="/account/register" className="alert-link">
                <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
              </Link>
            </Alert>
          </div>
        )}
        <p>
          <Translate contentKey="home.question">If you have any question on JHipster:</Translate>
        </p>

        <ul>
          <li>
            <a href="https://www.jhipster.tech/" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.homepage">JHipster homepage</Translate>
            </a>
          </li>
          <li>
            <a href="https://stackoverflow.com/tags/jhipster/info" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.stackoverflow">JHipster on Stack Overflow</Translate>
            </a>
          </li>
          <li>
            <a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.bugtracker">JHipster bug tracker</Translate>
            </a>
          </li>
          <li>
            <a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.chat">JHipster public chat room</Translate>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/jhipster" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.follow">follow @jhipster on Twitter</Translate>
            </a>
          </li>
        </ul>

        <p>
          <Translate contentKey="home.like">If you like JHipster, do not forget to give us a star on</Translate>{' '}
          <a href="https://github.com/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          !
        </p>
      </Col>
    </Row>
  );
};

export default Home;
