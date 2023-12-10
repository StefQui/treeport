package com.sm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrganisationDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrganisationDTO.class);
        OrganisationDTO organisationDTO1 = OrganisationDTO.builder().id("id1").build();
        OrganisationDTO organisationDTO2 = OrganisationDTO.builder().build();
        assertThat(organisationDTO1).isNotEqualTo(organisationDTO2);
        organisationDTO2 = organisationDTO2.toBuilder().id(organisationDTO1.getId()).build();
        assertThat(organisationDTO1).isEqualTo(organisationDTO2);
        organisationDTO2 = organisationDTO2.toBuilder().id("id2").build();
        assertThat(organisationDTO1).isNotEqualTo(organisationDTO2);
        organisationDTO1 = organisationDTO1.toBuilder().id(null).build();
        assertThat(organisationDTO1).isNotEqualTo(organisationDTO2);
    }
}
