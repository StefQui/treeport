package com.sm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.sm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AssetDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AssetDTO.class);
        AssetDTO assetDTO1 = AssetDTO.builder().id("id1").build();
        AssetDTO assetDTO2 = AssetDTO.builder().build();
        assertThat(assetDTO1).isNotEqualTo(assetDTO2);
        assetDTO2 = assetDTO2.toBuilder().id(assetDTO1.getId()).build();
        assertThat(assetDTO1).isEqualTo(assetDTO2);
        assetDTO2 = assetDTO2.toBuilder().id("id2").build();
        assertThat(assetDTO1).isNotEqualTo(assetDTO2);
        assetDTO1 = assetDTO1.toBuilder().id(null).build();
        assertThat(assetDTO1).isNotEqualTo(assetDTO2);
    }
}
