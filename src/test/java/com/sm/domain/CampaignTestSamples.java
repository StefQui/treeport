package com.sm.domain;

import java.util.UUID;

public class CampaignTestSamples {

    public static Campaign getCampaignSample1() {
        return new Campaign().id("id1").name("name1").description("description1");
    }

    public static Campaign getCampaignSample2() {
        return new Campaign().id("id2").name("name2").description("description2");
    }

    public static Campaign getCampaignRandomSampleGenerator() {
        return new Campaign().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
