import { IAttributeIdExploded } from 'app/shared/model/attribute-id-exploded';

export function generateKey(exploded: IAttributeIdExploded) {
  return `resource:${exploded.resourceId}:${exploded.key}:period:${exploded.campaignId}`;
}
