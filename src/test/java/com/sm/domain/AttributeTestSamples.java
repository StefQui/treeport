package com.sm.domain;

import com.sm.domain.attribute.Attribute;
import java.util.UUID;

public class AttributeTestSamples {

    public static Attribute getAttributeSample1() {
        return new Attribute().id("id1").configError("configError1");
    }

    public static Attribute getAttributeSample2() {
        return new Attribute().id("id2").configError("configError2");
    }

    public static Attribute getAttributeRandomSampleGenerator() {
        return new Attribute().id(UUID.randomUUID().toString()).configError(UUID.randomUUID().toString());
    }
}
