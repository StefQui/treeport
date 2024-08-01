package com.sm.service;

import static com.sm.domain.attribute.AssetKey.resourceResource;
import static com.sm.domain.attribute.AssetKey.site;
import static com.sm.domain.attribute.AssetKey.siteResource;
import static com.sm.domain.attribute.Attribute.ASSET_ID2_FRAGMENT_POSITION_FROM_WITH_TWO;
import static com.sm.domain.attribute.Attribute.ASSET_ID_FRAGMENT_POSITION_FROM_WITH_ONE;
import static com.sm.domain.attribute.Attribute.ASSET_ID_FRAGMENT_POSITION_FROM_WITH_TWO;
import static com.sm.domain.attribute.Attribute.ASSET_TYPE_FRAGMENT_POSITION_FROM_WITH_ONE;
import static com.sm.domain.attribute.Attribute.ASSET_TYPE_FRAGMENT_POSITION_FROM_WITH_TWO;
import static com.sm.domain.attribute.Attribute.ATTRIBUTE_ID_FRAGMENT_POSITION_FROM_WITH_ONE;
import static com.sm.domain.attribute.Attribute.ATTRIBUTE_ID_FRAGMENT_POSITION_FROM_WITH_TWO;
import static com.sm.domain.attribute.Attribute.ATTRIBUTE_PATTERN;
import static com.sm.domain.attribute.Attribute.ATTRIBUTE_PATTERN_WITH_2_RESOURCES;
import static com.sm.domain.attribute.Attribute.ATTRIBUTE_SEPARATOR;
import static com.sm.domain.attribute.Attribute.CAMPAIGN_FRAGMENT_POSITION_FROM_WITH_ONE;
import static com.sm.domain.attribute.Attribute.CAMPAIGN_FRAGMENT_POSITION_FROM_WITH_TWO;
import static com.sm.domain.attribute.Attribute.CAMPAIGN_TYPE_FRAGMENT_POSITION_FROM_WITH_ONE;
import static com.sm.domain.attribute.Attribute.CAMPAIGN_TYPE_FRAGMENT_POSITION_FROM_WITH_TWO;
import static com.sm.domain.attribute.Attribute.PARTIAL_ATTRIBUTE_PATTERN;
import static java.lang.String.format;

import com.sm.domain.Resource;
import com.sm.domain.Site;
import com.sm.domain.attribute.AssetKey;
import com.sm.domain.operation.RefOperation;
import java.util.List;
import org.bson.Document;

public class AttributeKeyUtils {

    public static String extractAssetTypeFromWithOne(String id) {
        return extractFragment(id, ASSET_TYPE_FRAGMENT_POSITION_FROM_WITH_ONE);
    }

    public static String extractAssetIdFromWithOne(String id) {
        return extractFragment(id, ASSET_ID_FRAGMENT_POSITION_FROM_WITH_ONE);
    }

    public static String extractAttributeIdFromWithOne(String id) {
        return extractFragment(id, ATTRIBUTE_ID_FRAGMENT_POSITION_FROM_WITH_ONE);
    }

    public static CampaignType extractCampaignTypeFromWithOne(String id) {
        String ct = extractFragment(id, CAMPAIGN_TYPE_FRAGMENT_POSITION_FROM_WITH_ONE);
        return CampaignType.fromValue(ct);
    }

    public static String extractCampaignFromWithOne(String id) {
        return extractFragment(id, CAMPAIGN_FRAGMENT_POSITION_FROM_WITH_ONE);
    }

    public static String extractAssetTypeFromWithTwo(String id) {
        return extractFragment(id, ASSET_TYPE_FRAGMENT_POSITION_FROM_WITH_TWO);
    }

    public static String extractAssetIdFromWithTwo(String id) {
        return extractFragment(id, ASSET_ID_FRAGMENT_POSITION_FROM_WITH_TWO);
    }

    public static String extractAssetId2FromWithTwo(String id) {
        return extractFragment(id, ASSET_ID2_FRAGMENT_POSITION_FROM_WITH_TWO);
    }

    public static String extractAttributeIdFromWithTwo(String id) {
        return extractFragment(id, ATTRIBUTE_ID_FRAGMENT_POSITION_FROM_WITH_TWO);
    }

    public static CampaignType extractCampaignTypeFromWithTwo(String id) {
        String ct = extractFragment(id, CAMPAIGN_TYPE_FRAGMENT_POSITION_FROM_WITH_TWO);
        return CampaignType.fromValue(ct);
    }

    public static String extractCampaignFromWithTwo(String id) {
        return extractFragment(id, CAMPAIGN_FRAGMENT_POSITION_FROM_WITH_TWO);
    }

    public static String extractFragment(String id, int position) {
        return id.split(":")[position];
    }

    public static String buildKey(
        AssetKey assetKey,
        Site s,
        Resource resource,
        Resource resource2,
        String attKey,
        String campaignType,
        String campaign
    ) {
        if (site.equals(assetKey)) {
            return siteKey(s.getId(), attKey, campaignType, campaign);
        } else if (siteResource.equals(assetKey)) {
            return siteResourceKey(s.getId(), resource2.getId(), attKey, campaignType, campaign);
        } else if (resourceResource.equals(assetKey)) {
            return resourceResourceKey(resource.getId(), resource2.getId(), attKey, campaignType, campaign);
        }
        throw new RuntimeException("to implement buildKeu with " + assetKey);
    }

    public static String siteKey(String s, String attKey, String campaignType, String campaign) {
        return keyWithOneResource(site, s, attKey, campaignType, campaign);
    }

    public static String siteResourceKey(String s, String r2, String attKey, String campaignType, String campaign) {
        return keyWithTwoResource(siteResource, s, r2, attKey, campaignType, campaign);
    }

    public static String resourceResourceKey(String r1, String r2, String attKey, String campaignType, String campaign) {
        return keyWithTwoResource(resourceResource, r1, r2, attKey, campaignType, campaign);
    }

    public static String keyWithOneResource(AssetKey type, String r1, String attKey, String campaignType, String campaign) {
        return format(ATTRIBUTE_PATTERN, type.name(), r1, attKey, campaignType, campaign);
    }

    public static String keyWithTwoResource(AssetKey type, String r1, String r2, String attKey, String campaignType, String campaign) {
        return format(ATTRIBUTE_PATTERN, type.name(), r1, r2, attKey, campaignType, campaign);
    }

    public static AttributeKeyAsObj fromString(String id) {
        boolean withOne = checkPatternIsWithOneResource(id);
        if (withOne) {
            return AttributeKeyAsObj
                .builder()
                .assetType(extractAssetTypeFromWithOne(id))
                .assetId(extractAssetIdFromWithOne(id))
                .attributeId(extractAttributeIdFromWithOne(id))
                .campaignType(extractCampaignTypeFromWithOne(id))
                .campaign(extractCampaignFromWithOne(id))
                .build();
        } else {
            return AttributeKeyAsObj
                .builder()
                .assetType(extractAssetTypeFromWithTwo(id))
                .assetId(extractAssetIdFromWithTwo(id))
                .assetId2(extractAssetId2FromWithTwo(id))
                .attributeId(extractAttributeIdFromWithTwo(id))
                .campaignType(extractCampaignTypeFromWithTwo(id))
                .campaign(extractCampaignFromWithTwo(id))
                .build();
        }
    }

    public static String objToString(AttributeKeyAsObj obj) {
        if (site.name().equals(obj.getAssetType())) {
            return format(
                ATTRIBUTE_PATTERN,
                obj.getAssetType(),
                obj.getAssetId(),
                obj.getAttributeId(),
                obj.getCampaignType(),
                obj.getCampaign()
            );
        } else if (siteResource.name().equals(obj.getAssetType()) || resourceResource.name().equals(obj.getAssetType())) {
            return format(
                ATTRIBUTE_PATTERN_WITH_2_RESOURCES,
                obj.getAssetType(),
                obj.getAssetId(),
                obj.getAssetId2(),
                obj.getAttributeId(),
                obj.getCampaignType(),
                obj.getCampaign()
            );
        }
        throw new RuntimeException("To implement here " + obj.getAssetType());
    }

    public static Document generatePartialId() {
        return new Document(
            "$concat",
            List.of(
                "$$item.configId",
                new Document("$literal", ATTRIBUTE_SEPARATOR),
                CampaignType.period.toString(),
                new Document("$literal", ATTRIBUTE_SEPARATOR),
                "$$item.campaignId"
            )
        );
    }

    public static String generatePartial(String attributeConfigId, String campaignId) {
        return format(PARTIAL_ATTRIBUTE_PATTERN, attributeConfigId, CampaignType.period, campaignId);
    }

    public static boolean checkPatternIsWithOneResource(String id) {
        return id.split(ATTRIBUTE_SEPARATOR).length == ATTRIBUTE_PATTERN.split(ATTRIBUTE_SEPARATOR).length;
    }

    public static AttributeKeyAsObj createReferenced(AttributeKeyAsObj attributeKeyAsObj, RefOperation op) {
        String impacterAssetType = attributeKeyAsObj.getAssetType();
        String impacterAssetId = null;
        if (op.getUseCurrentSite()) {
            impacterAssetId = attributeKeyAsObj.getAssetId();
        } else {
            impacterAssetId = op.getFixedSite();
        }

        CampaignType impacterCampaignType = attributeKeyAsObj.getCampaignType();
        String impacterCampaign = null;
        if (op.getDateOffset() != null) {
            impacterCampaign = applyOffSet(attributeKeyAsObj.getCampaign(), op.getDateOffset());
        } else {
            impacterCampaign = attributeKeyAsObj.getCampaign();
        }

        String key = op.getKey() != null ? op.getKey() : attributeKeyAsObj.getAttributeId();

        return AttributeKeyAsObj
            .builder()
            .assetType(impacterAssetType)
            .assetId(impacterAssetId)
            .attributeId(key)
            .campaignType(impacterCampaignType)
            .campaign(impacterCampaign)
            .build();
    }

    public static String applyOffSet(String campaign, Integer dateOffset) {
        if (dateOffset == 0) {
            return campaign;
        }
        return String.valueOf(Integer.valueOf(campaign) + dateOffset);
    }

    public static String unApplyOffSet(String campaign, Integer dateOffset) {
        if (dateOffset == 0) {
            return campaign;
        }
        return String.valueOf(Integer.valueOf(campaign) - dateOffset);
    }
}
