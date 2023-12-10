package com.sm.domain;

import java.util.UUID;

public class AssetTestSamples {

    public static Asset getAssetSample1() {
        return Asset.builder().id("id1").name("name1").build();
    }

    public static Asset getAssetSample2() {
        return Asset.builder().id("id2").name("name2").build();
    }

    public static Asset getAssetRandomSampleGenerator() {
        return Asset.builder().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString()).build();
    }
}
