package com.sm.service;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class AttributeKeyAsObj {

    private String assetType;
    private String assetId;
    private String attributeId;
    private CampaignType campaignType;
    private String campaign;
}
