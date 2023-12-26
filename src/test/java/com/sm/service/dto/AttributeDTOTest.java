package com.sm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sm.service.dto.attribute.AttributeDTO;
import com.sm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AttributeDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AttributeDTO.class);
        AttributeDTO attributeDTO1 = new AttributeDTO();
        attributeDTO1.setId("id1");
        AttributeDTO attributeDTO2 = new AttributeDTO();
        assertThat(attributeDTO1).isNotEqualTo(attributeDTO2);
        attributeDTO2.setId(attributeDTO1.getId());
        assertThat(attributeDTO1).isEqualTo(attributeDTO2);
        attributeDTO2.setId("id2");
        assertThat(attributeDTO1).isNotEqualTo(attributeDTO2);
        attributeDTO1.setId(null);
        assertThat(attributeDTO1).isNotEqualTo(attributeDTO2);
    }
}
