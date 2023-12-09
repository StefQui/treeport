package com.sm.domain;

import java.util.UUID;

public class AssetTestSamples {

    public static Asset getAssetSample1() {
        return new Asset().id("id1").name("name1");
    }

    public static Asset getAssetSample2() {
        return new Asset().id("id2").name("name2");
    }

    public static Asset getAssetRandomSampleGenerator() {
        return new Asset().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
