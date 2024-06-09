package com.sm.service;

import static com.sm.domain.attribute.Attribute.ASSET_ID_FRAGMENT_POSITION;
import static com.sm.domain.attribute.Attribute.ASSET_TYPE_FRAGMENT_POSITION;
import static com.sm.domain.attribute.Attribute.ATTRIBUTE_ID_FRAGMENT_POSITION;
import static com.sm.domain.attribute.Attribute.ATTRIBUTE_PATTERN;
import static com.sm.domain.attribute.Attribute.ATTRIBUTE_SEPARATOR;
import static com.sm.domain.attribute.Attribute.CAMPAIGN_FRAGMENT_POSITION;
import static com.sm.domain.attribute.Attribute.CAMPAIGN_TYPE_FRAGMENT_POSITION;
import static com.sm.domain.attribute.Attribute.PARTIAL_ATTRIBUTE_PATTERN;
import static com.sm.domain.attribute.Attribute.SITE_FRAG;
import static java.lang.String.format;

import com.sm.domain.operation.RefOperation;
import java.util.List;
import org.bson.Document;

public class AttributeKeyUtils {

    public static String extractAssetType(String id) {
        return extractFragment(id, ASSET_TYPE_FRAGMENT_POSITION);
    }

    public static String extractAssetId(String id) {
        return extractFragment(id, ASSET_ID_FRAGMENT_POSITION);
    }

    public static String extractAttributeId(String id) {
        return extractFragment(id, ATTRIBUTE_ID_FRAGMENT_POSITION);
    }

    public static CampaignType extractCampaignType(String id) {
        String ct = extractFragment(id, CAMPAIGN_TYPE_FRAGMENT_POSITION);
        return CampaignType.fromValue(ct);
    }

    public static String extractCampaign(String id) {
        return extractFragment(id, CAMPAIGN_FRAGMENT_POSITION);
    }

    public static String extractFragment(String id, int position) {
        return id.split(":")[position];
    }

    public static String siteKey(String asset, String attKey, String campaignType, String campaign) {
        return key(SITE_FRAG, asset, attKey, campaignType, campaign);
    }

    public static String key(String type, String asset, String attKey, String campaignType, String campaign) {
        return format(ATTRIBUTE_PATTERN, type, asset, attKey, campaignType, campaign);
    }

    public static AttributeKeyAsObj fromString(String id) {
        return AttributeKeyAsObj
            .builder()
            .assetType(extractAssetType(id))
            .assetId(extractAssetId(id))
            .attributeId(extractAttributeId(id))
            .campaignType(extractCampaignType(id))
            .campaign(extractCampaign(id))
            .build();
    }

    public static String objToString(AttributeKeyAsObj obj) {
        return format(
            ATTRIBUTE_PATTERN,
            obj.getAssetType(),
            obj.getAssetId(),
            obj.getAttributeId(),
            obj.getCampaignType(),
            obj.getCampaign()
        );
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

        return AttributeKeyAsObj
            .builder()
            .assetType(impacterAssetType)
            .assetId(impacterAssetId)
            .attributeId(op.getKey())
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
