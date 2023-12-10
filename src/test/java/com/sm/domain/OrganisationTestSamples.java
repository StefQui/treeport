package com.sm.domain;

import java.util.UUID;

public class OrganisationTestSamples {

    public static Organisation getOrganisationSample1() {
        return Organisation.builder().id("id1").name("name1").build();
    }

    public static Organisation getOrganisationSample2() {
        return Organisation.builder().id("id2").name("name2").build();
    }

    public static Organisation getOrganisationRandomSampleGenerator() {
        return Organisation.builder().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString()).build();
    }
}
