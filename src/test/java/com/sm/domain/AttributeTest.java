package com.sm.domain;

import static com.sm.domain.AssetTestSamples.getAssetRandomSampleGenerator;
import static com.sm.domain.AttributeConfigTestSamples.getAttributeConfigRandomSampleGenerator;
import static com.sm.domain.AttributeTestSamples.*;
import static com.sm.domain.OrganisationTestSamples.getOrganisationRandomSampleGenerator;
import static com.sm.domain.TagTestSamples.getTagRandomSampleGenerator;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.domain.attribute.Attribute;
import com.sm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AttributeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Attribute.class);
        Attribute attribute1 = getAttributeSample1();
        Attribute attribute2 = new Attribute();
        assertThat(attribute1).isNotEqualTo(attribute2);

        attribute2.setId(attribute1.getId());
        assertThat(attribute1).isEqualTo(attribute2);

        attribute2 = getAttributeSample2();
        assertThat(attribute1).isNotEqualTo(attribute2);
    }

    @Test
    void orgaTest() throws Exception {
        Attribute attribute = getAttributeRandomSampleGenerator();
        Organisation organisationBack = getOrganisationRandomSampleGenerator();

        attribute.setOrga(organisationBack);
        assertThat(attribute.getOrga()).isEqualTo(organisationBack);

        attribute.orga(null);
        assertThat(attribute.getOrga()).isNull();
    }

    @Test
    void siteTest() throws Exception {
        Attribute attribute = getAttributeRandomSampleGenerator();
        Asset assetBack = getAssetRandomSampleGenerator();

        attribute.setSite(assetBack);
        assertThat(attribute.getSite()).isEqualTo(assetBack);

        attribute.site(null);
        assertThat(attribute.getSite()).isNull();
    }

    @Test
    void configTest() throws Exception {
        Attribute attribute = getAttributeRandomSampleGenerator();
        AttributeConfig attributeConfigBack = getAttributeConfigRandomSampleGenerator();

        attribute.setConfig(attributeConfigBack);
        assertThat(attribute.getConfig()).isEqualTo(attributeConfigBack);

        attribute.config(null);
        assertThat(attribute.getConfig()).isNull();
    }

    @Test
    void tagsTest() throws Exception {
        Attribute attribute = getAttributeRandomSampleGenerator();
        Tag tagBack = getTagRandomSampleGenerator();

        attribute.addTags(tagBack);
        assertThat(attribute.getTags()).containsOnly(tagBack);

        attribute.removeTags(tagBack);
        assertThat(attribute.getTags()).doesNotContain(tagBack);

        attribute.tags(new HashSet<>(Set.of(tagBack)));
        assertThat(attribute.getTags()).containsOnly(tagBack);

        attribute.setTags(new HashSet<>());
        assertThat(attribute.getTags()).doesNotContain(tagBack);
    }
}
