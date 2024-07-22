package com.sm.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.sm.domain.attribute.Attribute;
import com.sm.repository.AttributeRepository;
import com.sm.service.mapper.*;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;

@DataMongoTest
@Import(
    {
        DirtierService.class,
        AttributeService.class,
        AttributeMapper.class,
        TagMapper.class,
        OrganisationMapper.class,
        SiteMapper.class,
        AttributeValueMapper.class,
        AttributeConfigMapper.class,
    }
)
class DirtierServiceTest {

    @Autowired
    DirtierService dirtierService;

    @Autowired
    AttributeService attributeService;

    @Autowired
    AttributeRepository attributeRepository;

    @BeforeEach
    public void init() {
        attributeRepository.deleteAll();
    }

    @Test
    public void test1() {
        attributeService.saveAll(
            List.of(
                Attribute.builder().id("att1").orgaId("coca").impacterIds(Set.of("att1-1", "att1-2")).build(),
                Attribute.builder().id("att1-1").orgaId("coca").build(),
                Attribute.builder().id("att1-2").orgaId("coca").impacterIds(Set.of("att1-2-1", "att1-2-2")).build(),
                Attribute.builder().id("att1-2-1").orgaId("coca").build(),
                Attribute.builder().id("att1-2-2").orgaId("coca").build(),
                Attribute.builder().id("att1-3").orgaId("coca").build()
            )
        );

        assertThat(attributeService.findByIdAndOrgaId("att1", "coca").get().getDirty()).isEqualTo(false);
        assertThat(attributeService.findByIdAndOrgaId("att1-1", "coca").get().getDirty()).isEqualTo(false);
        assertThat(attributeService.findByIdAndOrgaId("att1-2", "coca").get().getDirty()).isEqualTo(false);
        assertThat(attributeService.findByIdAndOrgaId("att1-2-1", "coca").get().getDirty()).isEqualTo(false);
        assertThat(attributeService.findByIdAndOrgaId("att1-2-2", "coca").get().getDirty()).isEqualTo(false);
        assertThat(attributeService.findByIdAndOrgaId("att1-3", "coca").get().getDirty()).isEqualTo(false);

        dirtierService.dirtyTrees(Set.of(attributeService.findByIdAndOrgaId("att1-2-1", "coca").get()), "coca");

        assertThat(attributeService.findByIdAndOrgaId("att1", "coca").get().getDirty()).isEqualTo(true);
        assertThat(attributeService.findByIdAndOrgaId("att1-1", "coca").get().getDirty()).isEqualTo(false);
        assertThat(attributeService.findByIdAndOrgaId("att1-2", "coca").get().getDirty()).isEqualTo(true);
        assertThat(attributeService.findByIdAndOrgaId("att1-2-1", "coca").get().getDirty()).isEqualTo(true);
        assertThat(attributeService.findByIdAndOrgaId("att1-2-2", "coca").get().getDirty()).isEqualTo(false);
        assertThat(attributeService.findByIdAndOrgaId("att1-3", "coca").get().getDirty()).isEqualTo(false);
    }
}
