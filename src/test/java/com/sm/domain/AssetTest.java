package com.sm.domain;

import static com.sm.domain.AssetTestSamples.getAssetSample1;
import static com.sm.domain.AssetTestSamples.getAssetSample2;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AssetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Asset.class);
        Asset asset1 = getAssetSample1();
        Asset asset2 = new Asset();
        assertThat(asset1).isNotEqualTo(asset2);

        asset2.setId(asset1.getId());
        assertThat(asset1).isEqualTo(asset2);

        asset2 = getAssetSample2();
        assertThat(asset1).isNotEqualTo(asset2);
    }
    //    @Test
    //    void orgaTest() throws Exception {
    //        Asset asset = getAssetRandomSampleGenerator();
    //        Organisation organisationBack = getOrganisationRandomSampleGenerator();
    //
    //        asset.setOrgaId(organisationBack.getId());
    //        assertThat(asset.getOrgaId()).isEqualTo(organisationBack);
    //
    //        asset.setOrgaId(null);
    //        assertThat(asset.getOrgaId()).isNull();
    //    }
    //
    //    @Test
    //    void parentTest() throws Exception {
    //        Asset asset = getAssetRandomSampleGenerator();
    //        Asset assetBack = getAssetRandomSampleGenerator();
    //
    //        asset.setParentId(assetBack.getId());
    //        assertThat(asset.getParentId()).isEqualTo(assetBack);
    //
    //        asset.parent(null);
    //        assertThat(asset.getParent()).isNull();
    //    }
    //
    //    @Test
    //    void childrensTest() throws Exception {
    //        Asset asset = getAssetRandomSampleGenerator();
    //        Asset assetBack = getAssetRandomSampleGenerator();
    //
    //        asset.addChildrens(assetBack);
    //        assertThat(asset.getChildrens()).containsOnly(assetBack);
    //
    //        asset.removeChildrens(assetBack);
    //        assertThat(asset.getChildrens()).doesNotContain(assetBack);
    //
    //        asset.childrens(new HashSet<>(Set.of(assetBack)));
    //        assertThat(asset.getChildrens()).containsOnly(assetBack);
    //
    //        asset.setChildrens(new HashSet<>());
    //        assertThat(asset.getChildrens()).doesNotContain(assetBack);
    //    }
    //
    //    @Test
    //    void assetTest() throws Exception {
    //        Asset asset = getAssetRandomSampleGenerator();
    //        Asset assetBack = getAssetRandomSampleGenerator();
    //
    //        asset.addAsset(assetBack);
    //        assertThat(asset.getAssets()).containsOnly(assetBack);
    //        assertThat(assetBack.getChildrens()).containsOnly(asset);
    //
    //        asset.removeAsset(assetBack);
    //        assertThat(asset.getAssets()).doesNotContain(assetBack);
    //        assertThat(assetBack.getChildrens()).doesNotContain(asset);
    //
    //        asset.assets(new HashSet<>(Set.of(assetBack)));
    //        assertThat(asset.getAssets()).containsOnly(assetBack);
    //        assertThat(assetBack.getChildrens()).containsOnly(asset);
    //
    //        asset.setAssets(new HashSet<>());
    //        assertThat(asset.getAssets()).doesNotContain(assetBack);
    //        assertThat(assetBack.getChildrens()).doesNotContain(asset);
    //    }
}
