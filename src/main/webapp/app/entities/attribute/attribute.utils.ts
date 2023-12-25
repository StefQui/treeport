import { IAttributeIdExploded } from 'app/shared/model/attribute-id-exploded';

export function generateKey(exploded: IAttributeIdExploded) {
  return `site:${exploded.siteId}:${exploded.key}:period:${exploded.campaignId}`;
}
