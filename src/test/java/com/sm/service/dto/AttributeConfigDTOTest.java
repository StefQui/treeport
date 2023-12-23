package com.sm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AttributeConfigDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttributeConfigDTO.class);
        AttributeConfigDTO attributeConfigDTO1 = new AttributeConfigDTO();
        attributeConfigDTO1.setId("id1");
        AttributeConfigDTO attributeConfigDTO2 = new AttributeConfigDTO();
        assertThat(attributeConfigDTO1).isNotEqualTo(attributeConfigDTO2);
        attributeConfigDTO2.setId(attributeConfigDTO1.getId());
        assertThat(attributeConfigDTO1).isEqualTo(attributeConfigDTO2);
        attributeConfigDTO2.setId("id2");
        assertThat(attributeConfigDTO1).isNotEqualTo(attributeConfigDTO2);
        attributeConfigDTO1.setId(null);
        assertThat(attributeConfigDTO1).isNotEqualTo(attributeConfigDTO2);
    }
}
