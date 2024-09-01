import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import { translate, Translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntities as getOrganisations } from 'app/entities/organisation/organisation.reducer';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { is } from 'immer/dist/internal';
import { createResource, getResource, reset, updateResource } from './resource.reducer';
import { ColumnDefinition, UpdateAttributeAction, UpdatedResourceAction, ValueInState } from '../rendering/type';
import { buildPath, useCalculatedValueState } from '../rendering/shared';
import { evaluateValueExistsShouldDisplay, hasChanged } from '../rendering/rendering';
import { setAction, setInLocalState } from '../rendering/rendering.reducer';
import axios from 'axios';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IResourceAndImpacters } from 'app/shared/model/resource-and-impacters.model';
import {
  EditResourceForAddEvent,
  EditResourceForUpdateEvent,
  publishCreatedResourceEvent,
  publishUpdatedResourceEvent,
  subscribeToEditResourceForAdd,
  subscribeToEditResourceForUpdate,
  subscribeToUpdatedResource,
} from '../rendering/action.utils';

type updateAction = 'update';
type addAction = 'add';
type ActionType = updateAction | addAction;

export const UpdateResourceDialog = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [resource, setResource] = useState(null);
  const [resourceParentId, setResourceParentId] = useState(null);
  const [route, setRoute] = useState(null);
  const [columnDefinitions, setColumnDefinitions] = useState(null);
  subscribeToEditResourceForUpdate((data: { detail: EditResourceForUpdateEvent }) => {
    setResource(data.detail.resourceToEdit);
    setColumnDefinitions(data.detail.columnDefinitions);
    setAction('update');
    setIsLoaded(true);
  });
  subscribeToEditResourceForAdd((data: { detail: EditResourceForAddEvent }) => {
    setResourceParentId(data.detail.resourceToAddParentId);
    setColumnDefinitions(data.detail.columnDefinitions);
    setRoute(data.detail.route);
    setAction('add');
    setIsLoaded(true);
  });
  return (
    isLoaded && (
      <ResourceUpdateDialog
        resourceToUpdate={resource}
        columnDefinitionsParam={columnDefinitions}
        resourceParentIdParam={resourceParentId}
        routeParam={route}
        action={action}
      ></ResourceUpdateDialog>
    )
  );
};

export const ResourceUpdateDialog = (props: {
  resourceToUpdate: IResourceWithValue | null;
  columnDefinitionsParam: ColumnDefinition[] | null;
  resourceParentIdParam: string | null;
  routeParam: string[] | null;
  action: ActionType;
}) => {
  const dispatch = useAppDispatch();

  const [columnDefinitions, setColumnDefinitions] = useState(null);

  const [isNew, setIsNew] = useState(false);

  const { orgaId } = useParams<'orgaId'>();
  const apiUrl = `api/orga/${orgaId}/resources`;
  const [showDialog, setShowDialog] = useState(true);

  const [previous, setPrevious] = useState(null);
  const [resource, setResource] = useState(null);
  const [resourceParentId, setResourceParentId] = useState(null);
  const [route, setRoute] = useState(null);
  const [action, setAction] = useState<ActionType | null>(null);
  // setResourceParentId(data.detail.resourceToAddParentId);
  // setColumnDefinitions(data.detail.columnDefinitions);
  // setRoute(data.detail.route);

  subscribeToEditResourceForUpdate((data: { detail: EditResourceForUpdateEvent }) => {
    console.log('inDialogUpdate', data.detail);
    setResource(data.detail.resourceToEdit);
    setColumnDefinitions(data.detail.columnDefinitions);
    setAction('update');
    setShowDialog(true);
  });

  subscribeToEditResourceForAdd((data: { detail: EditResourceForAddEvent }) => {
    setResourceParentId(data.detail.resourceToAddParentId);
    setColumnDefinitions(data.detail.columnDefinitions);
    setAction('add');
    setRoute(data.detail.route);
    setShowDialog(true);
  });

  useEffect(() => {
    console.log('useEffectkjh', props.resourceToUpdate, props.columnDefinitionsParam);
    setResource(props.resourceToUpdate);
    setColumnDefinitions(props.columnDefinitionsParam);
    setResourceParentId(props.resourceParentIdParam);
    setRoute(props.routeParam);
    setAction(props.action);
  }, []);

  // useEffect(() => {
  //   console.log('toUpdate...', toUpdate);
  //   if (toUpdate && toUpdate.value) {
  //     setShowModal(evaluateValueExistsShouldDisplay(toUpdate));
  //     // setPrevious(valueExists);
  //     // setShowModal(shouldDisplay);
  //     // console.log('after valueExists...', shouldDisplay, evaluateValueExistsShouldDisplay(valueExists));
  //   }
  // }, [toUpdate]);

  // useEffect(() => {
  //   console.log('updating resource', resourceId);
  //   dispatch(getEntity(resourceId));
  //   setLoadModal(true);
  // }, []);

  // useEffect(() => {
  //   if (!resourceId) {
  //     dispatch(reset());
  //   } else {
  //     dispatch(getResource({ id: resourceId, orgaId }));
  //   }
  // }, [resourceId]);

  const handleClose = () => {
    // dispatch(
    //   setInLocalState({
    //     localContextPath: props.localContextPath,
    //     parameterKey: 'sid98',
    //     value: { loading: false },
    //   }),
    // );
    setShowDialog(false);
  };

  // useEffect(() => {
  //   if (updateSuccess) {
  //     // handleClose();
  //     // setLoadModal(false);
  //     // console.log('useEffect', isNew, entityAndImpacters, resourceId);
  //     // setShowModal(false);
  //     // if (!isNew && entityAndImpacters && entityAndImpacters.resource && entityAndImpacters.resource.id === resourceId) {
  //     //   onSuccessUpdate(entityAndImpacters);
  //     // } else if (isNew && entityAndImpacters && entityAndImpacters.resource && entityAndImpacters.resource.id) {
  //     //   onSuccessAdd(entityAndImpacters);
  //     // }
  //   }
  // }, [updateSuccess]);

  const defaultValues = () =>
    action == 'add'
      ? {
          parent: { id: resourceParentId },
          orga: { orga: orgaId },
          childrens: [],
          tags: [],
          tagsAsString: '',
        }
      : {
          ...resource,
          tagsAsString: resource.tags ? resource.tags.map(t => t.id).join(',') : '',
          // orga: resourceEntity?.orga?.id,
          // parent: resourceEntity?.parent?.id,
          // childrens: resourceEntity?.childrens?.map(e => e.id.toString()),
        };

  // eslint-disable-next-line complexity
  const saveEntity = async values => {
    const entity = {
      ...resource,
      ...values,
      tags: values.tagsAsString.split(',').length > 0 ? values.tagsAsString.split(',').map(t => ({ id: t, orga: { id: orgaId } })) : [],
      tagsAsString: undefined,
      childrenCount: undefined,
    };
    if (action == 'add') {
      setIsNew(true);
      const data = await axios.post<IResourceAndImpacters>(`${apiUrl}`, {
        resourceToUpdate: cleanEntity(entity),
        columnDefinitions,
      });
      publishCreatedResourceEvent({
        source: 'noSource',
        resourceAndImpacters: data.data,
        resourceParentId,
        route,
      });
    } else {
      const data = await axios.put<IResourceAndImpacters>(`${apiUrl}/${resource.id}`, {
        resourceToUpdate: cleanEntity(entity),
        columnDefinitions,
      });
      publishUpdatedResourceEvent({
        source: 'noSource',
        actionType: 'updatedResource',
        resourceAndImpacters: data.data,
      });
      // dispatch(setAction({ ...action, timestamp: new Date() }));
      // dispatch(updateResource({ entity, orgaId, columnDefinitions }));
    }
    handleClose();
  };

  return (
    action && (
      <Modal isOpen={showDialog} toggle={handleClose}>
        <ModalHeader toggle={handleClose} data-cy="resourceDeleteDialogHeading">
          Operation {action}
        </ModalHeader>
        <ModalBody id="treeportApp.resource.delete.question">
          <div>
            <Row className="justify-content-center">
              <Col md="8">
                <h2 id="treeportApp.resource.home.createOrEditLabel" data-cy="ResourceCreateUpdateHeading">
                  <Translate contentKey="treeportApp.resource.home.createOrEditLabel">Create or edit a Resource</Translate>
                </h2>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="8">
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  <ValidatedField
                    name="id"
                    required
                    id="resource-id"
                    readOnly={action == 'update'}
                    label={translate('global.field.id')}
                    validate={{ required: true }}
                  />
                  <ValidatedField label={'Type'} id="resource-type" name="type" data-cy="type" type="text" />
                  <ValidatedField
                    label={translate('treeportApp.resource.name')}
                    id="resource-name"
                    name="name"
                    data-cy="name"
                    type="text"
                  />
                  <ValidatedField label={'Tags'} id="resource-tagsAsString" name="tagsAsString" data-cy="name" type="text" />
                  <ValidatedField
                    label={translate('treeportApp.resource.content')}
                    id="resource-content"
                    name="content"
                    data-cy="content"
                    type="textarea"
                  />
                  &nbsp;
                  <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit">
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    <Translate contentKey="entity.action.save">Save</Translate>
                  </Button>
                </ValidatedForm>
              </Col>
            </Row>
          </div>{' '}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon="ban" />
            &nbsp;
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          {/* <Button id="jhi-confirm-delete-resource" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button> */}
        </ModalFooter>
      </Modal>
    )
  );
};

export default ResourceUpdateDialog;
