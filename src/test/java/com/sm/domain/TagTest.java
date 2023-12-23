package com.sm.domain;

import static com.sm.domain.AttributeConfigTestSamples.*;
import static com.sm.domain.AttributeTestSamples.*;
import static com.sm.domain.TagTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TagTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tag.class);
        Tag tag1 = getTagSample1();
        Tag tag2 = new Tag();
        assertThat(tag1).isNotEqualTo(tag2);

        tag2.setId(tag1.getId());
        assertThat(tag1).isEqualTo(tag2);

        tag2 = getTagSample2();
        assertThat(tag1).isNotEqualTo(tag2);
    }

    @Test
    void attributeConfigTest() throws Exception {
        Tag tag = getTagRandomSampleGenerator();
        AttributeConfig attributeConfigBack = getAttributeConfigRandomSampleGenerator();

        tag.addAttributeConfig(attributeConfigBack);
        assertThat(tag.getAttributeConfigs()).containsOnly(attributeConfigBack);
        assertThat(attributeConfigBack.getTags()).containsOnly(tag);

        tag.removeAttributeConfig(attributeConfigBack);
        assertThat(tag.getAttributeConfigs()).doesNotContain(attributeConfigBack);
        assertThat(attributeConfigBack.getTags()).doesNotContain(tag);

        tag.attributeConfigs(new HashSet<>(Set.of(attributeConfigBack)));
        assertThat(tag.getAttributeConfigs()).containsOnly(attributeConfigBack);
        assertThat(attributeConfigBack.getTags()).containsOnly(tag);

        tag.setAttributeConfigs(new HashSet<>());
        assertThat(tag.getAttributeConfigs()).doesNotContain(attributeConfigBack);
        assertThat(attributeConfigBack.getTags()).doesNotContain(tag);
    }

    @Test
    void attributeTest() throws Exception {
        Tag tag = getTagRandomSampleGenerator();
        Attribute attributeBack = getAttributeRandomSampleGenerator();

        tag.addAttribute(attributeBack);
        assertThat(tag.getAttributes()).containsOnly(attributeBack);
        assertThat(attributeBack.getTags()).containsOnly(tag);

        tag.removeAttribute(attributeBack);
        assertThat(tag.getAttributes()).doesNotContain(attributeBack);
        assertThat(attributeBack.getTags()).doesNotContain(tag);

        tag.attributes(new HashSet<>(Set.of(attributeBack)));
        assertThat(tag.getAttributes()).containsOnly(attributeBack);
        assertThat(attributeBack.getTags()).containsOnly(tag);

        tag.setAttributes(new HashSet<>());
        assertThat(tag.getAttributes()).doesNotContain(attributeBack);
        assertThat(attributeBack.getTags()).doesNotContain(tag);
    }
}
