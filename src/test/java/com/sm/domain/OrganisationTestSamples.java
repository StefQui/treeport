package com.sm.domain;

import java.util.UUID;

public class OrganisationTestSamples {

    public static Organisation getOrganisationSample1() {
        return new Organisation().id("id1").name("name1");
    }

    public static Organisation getOrganisationSample2() {
        return new Organisation().id("id2").name("name2");
    }

    public static Organisation getOrganisationRandomSampleGenerator() {
        return new Organisation().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
