import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAttribute } from './rendering.reducer';
import { AttValue } from '../attribute-value/attribute-value';
import { buildAttributeIdFormExploded } from './sm-form';
import { buildPath, useCalculatedValueState } from './shared';
import { AttRefProps, ActionState, RenderingSliceState, ValueInState } from './type';

const useExplodedAttVal = (resourceIdVal, campaignIdVal, attConfigVal): string | null => {
  const [useExploded, setUseExploded] = useState(null);
  useEffect(() => {
    if (resourceIdVal && campaignIdVal && attConfigVal && resourceIdVal.value && campaignIdVal.value && attConfigVal.value) {
      const attId = buildAttributeIdFormExploded(resourceIdVal.value, attConfigVal.value, campaignIdVal.value);
      console.log('useExplodedAttVal...', attId);
      setUseExploded(attId);
    }
  }, [resourceIdVal, campaignIdVal, attConfigVal]);
  return useExploded;
};

const loadAttribute = (props, resourceIdVal, attConfigVal, campaignIdVal) =>
  getAttribute({
    exploded: {
      siteId: resourceIdVal,
      campaignId: campaignIdVal,
      key: attConfigVal,
    },
    path: buildPath(props),
  });

export const SmAttRef = (props: AttRefProps) => {
  const dispatch = useAppDispatch();
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);

  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmAttRef</i>
      </span>
    );
  }

  const { resourceId, campaignId, attConfig } = props.params;

  if (!resourceId || !campaignId || !attConfig) {
    return displayWarning(resourceId, campaignId, attConfig);
  }

  const builtPath = buildPath(props);
  const attribute = useAppSelector((state: RenderingSliceState) => {
    const aaa = state.rendering.componentsState[builtPath];
    return aaa ? (aaa.attribute ? aaa.attribute : null) : null;
  });

  const resourceIdVal: ValueInState = useCalculatedValueState(props, resourceId);
  const campaignIdVal: ValueInState = useCalculatedValueState(props, campaignId);
  const attConfigVal: ValueInState = useCalculatedValueState(props, attConfig);

  const explodedAttVal: string | null = useExplodedAttVal(resourceIdVal, attConfigVal, campaignIdVal);

  const [previousExploded, setPreviousExploded] = useState(null);

  const [attValue, setAttValue] = useState(null);

  useEffect(() => {
    if (action && action.actionType === 'updateAttribute') {
      // if (!hasChanged()) {
      //   // IMPLEMENT HERE COMPARAISON WITH PREVIOUS EXPLODED VALUE   ??????????
      //   return;
      // }

      if (resourceIdVal && campaignIdVal && attConfigVal && resourceIdVal.value && campaignIdVal.value && attConfigVal.value) {
        const attId = buildAttributeIdFormExploded(resourceIdVal.value, attConfigVal.value, campaignIdVal.value);
        console.log('action...', action, attId);
        if (action.entity.entityIds.indexOf(attId) !== -1) {
          dispatch(loadAttribute(props, resourceIdVal.value, attConfigVal.value, campaignIdVal.value));
        }
      }
    }
  }, [action]);

  useEffect(() => {
    console.log('useEffect111', resourceIdVal, campaignIdVal, attConfigVal);
    if (explodedAttVal && explodedAttVal !== previousExploded) {
      setPreviousExploded(explodedAttVal);
      dispatch(loadAttribute(props, resourceIdVal.value, attConfigVal.value, campaignIdVal.value));
    }
  }, [explodedAttVal]);

  useEffect(() => {
    // console.log('useEffect222', resourceIdVal, campaignIdVal, attConfigVal);
    if (attribute) {
      setAttValue(attribute);
    } else {
      setAttValue(null);
    }
  }, [attribute]);

  return <AttValue attValue={attValue}></AttValue>;
};

export const displayWarning = (resourceId, campaignId, attConfig) => {
  if (!resourceId) {
    return (
      <span>
        <i>{'resourceId'} is mandatory in SmAttRef</i>
      </span>
    );
  } else if (!campaignId) {
    return (
      <span>
        <i>{'campaignId'} is mandatory in SmAttRef</i>
      </span>
    );
  } else if (!attConfig) {
    return (
      <span>
        <i>{'attConfig'} is mandatory in SmAttRef</i>
      </span>
    );
  }
};
