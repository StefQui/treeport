package com.sm.domain;

import java.util.UUID;

public class AttributeConfigTestSamples {

    public static AttributeConfig getAttributeConfigSample1() {
        return new AttributeConfig().id("id1").relatedConfigId("relatedConfigId1").consoParameterKey("consoParameterKey1");
    }

    public static AttributeConfig getAttributeConfigSample2() {
        return new AttributeConfig().id("id2").relatedConfigId("relatedConfigId2").consoParameterKey("consoParameterKey2");
    }

    public static AttributeConfig getAttributeConfigRandomSampleGenerator() {
        return new AttributeConfig()
            .id(UUID.randomUUID().toString())
            .relatedConfigId(UUID.randomUUID().toString())
            .consoParameterKey(UUID.randomUUID().toString());
    }
}
