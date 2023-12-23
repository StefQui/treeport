package com.sm.domain;

import static com.sm.domain.AssetTestSamples.*;
import static com.sm.domain.AttributeConfigTestSamples.*;
import static com.sm.domain.OrganisationTestSamples.*;
import static com.sm.domain.TagTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AttributeConfigTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttributeConfig.class);
        AttributeConfig attributeConfig1 = getAttributeConfigSample1();
        AttributeConfig attributeConfig2 = new AttributeConfig();
        assertThat(attributeConfig1).isNotEqualTo(attributeConfig2);

        attributeConfig2.setId(attributeConfig1.getId());
        assertThat(attributeConfig1).isEqualTo(attributeConfig2);

        attributeConfig2 = getAttributeConfigSample2();
        assertThat(attributeConfig1).isNotEqualTo(attributeConfig2);
    }

    @Test
    void orgaTest() throws Exception {
        AttributeConfig attributeConfig = getAttributeConfigRandomSampleGenerator();
        Organisation organisationBack = getOrganisationRandomSampleGenerator();

        attributeConfig.setOrga(organisationBack);
        assertThat(attributeConfig.getOrga()).isEqualTo(organisationBack);

        attributeConfig.orga(null);
        assertThat(attributeConfig.getOrga()).isNull();
    }

    @Test
    void siteTest() throws Exception {
        AttributeConfig attributeConfig = getAttributeConfigRandomSampleGenerator();
        Asset assetBack = getAssetRandomSampleGenerator();

        attributeConfig.setSite(assetBack);
        assertThat(attributeConfig.getSite()).isEqualTo(assetBack);

        attributeConfig.site(null);
        assertThat(attributeConfig.getSite()).isNull();
    }

    @Test
    void tagsTest() throws Exception {
        AttributeConfig attributeConfig = getAttributeConfigRandomSampleGenerator();
        Tag tagBack = getTagRandomSampleGenerator();

        attributeConfig.addTags(tagBack);
        assertThat(attributeConfig.getTags()).containsOnly(tagBack);

        attributeConfig.removeTags(tagBack);
        assertThat(attributeConfig.getTags()).doesNotContain(tagBack);

        attributeConfig.tags(new HashSet<>(Set.of(tagBack)));
        assertThat(attributeConfig.getTags()).containsOnly(tagBack);

        attributeConfig.setTags(new HashSet<>());
        assertThat(attributeConfig.getTags()).doesNotContain(tagBack);
    }
}
