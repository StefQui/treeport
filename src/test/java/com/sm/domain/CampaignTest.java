package com.sm.domain;

import static com.sm.domain.CampaignTestSamples.*;
import static com.sm.domain.OrganisationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CampaignTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Campaign.class);
        Campaign campaign1 = getCampaignSample1();
        Campaign campaign2 = new Campaign();
        assertThat(campaign1).isNotEqualTo(campaign2);

        campaign2.setId(campaign1.getId());
        assertThat(campaign1).isEqualTo(campaign2);

        campaign2 = getCampaignSample2();
        assertThat(campaign1).isNotEqualTo(campaign2);
    }

    @Test
    void orgaTest() throws Exception {
        Campaign campaign = getCampaignRandomSampleGenerator();
        Organisation organisationBack = getOrganisationRandomSampleGenerator();

        campaign.setOrga(organisationBack);
        assertThat(campaign.getOrga()).isEqualTo(organisationBack);

        campaign.orga(null);
        assertThat(campaign.getOrga()).isNull();
    }
}
