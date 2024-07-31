package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.BOOLEAN;
import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.domain.enumeration.AssetType.SITE;
import static com.sm.domain.operation.OperationType.CONSO_SUM_BY_KEY;
import static com.sm.service.InitialLoadService.CAR;
import static com.sm.service.InitialLoadService.COCA;
import static com.sm.service.InitialLoadService.HQ;
import static com.sm.service.InitialLoadService.IS_CERT;
import static com.sm.service.InitialLoadService.ROOT;
import static com.sm.service.InitialLoadService.S_1;
import static com.sm.service.InitialLoadService.S_1_1;
import static com.sm.service.InitialLoadService.S_1_2;
import static com.sm.service.InitialLoadService.S_2;
import static com.sm.service.InitialLoadService.S_2_1;
import static com.sm.service.InitialLoadService.S_2_2;
import static com.sm.service.InitialLoadService.TO_SITE;
import static com.sm.service.InitialLoadService.TRA;

import com.sm.domain.*;
import com.sm.domain.attribute.Attribute;
import com.sm.repository.*;
import com.sm.service.mapper.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;

@Import(
    {
        AttributeConfigMapper.class,
        AttributeConfigService.class,
        AttributeMapper.class,
        AttributeService.class,
        AttributeValueMapper.class,
        CalculatorService.class,
        CampaignMapper.class,
        CampaignService.class,
        ComputeService.class,
        DirtierService.class,
        OrganisationMapper.class,
        SiteMapper.class,
        SiteService.class,
        TagMapper.class,
    }
)
@DataMongoTest
class AbstractComputeServiceTest {

    @Autowired
    OrganisationRepository organisationRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    CampaignRepository campaignRepository;

    @Autowired
    AttributeConfigRepository attributeConfigRepository;

    @Autowired
    AttributeRepository attributeRepository;

    @Autowired
    ComputeService computeService;

    @Autowired
    AttributeService attributeService;

    @Autowired
    SiteService siteService;

    @Autowired
    AttributeConfigService attributeConfigService;

    // root ()
    // ---s1 (CAR)
    // ---|---s1-1 (CAR)
    // ---|---s1-2 (CAR)
    // ---s2 (CAR)
    // ---|---s2-1 (CAR)
    // ---|---s2-2 (TRA)

    @BeforeEach
    public void init() {
        organisationRepository.deleteAll();
        siteService.deleteAll();
        attributeConfigRepository.deleteAll();
        tagRepository.deleteAll();
        campaignRepository.deleteAll();
        attributeRepository.deleteAll();
        reloadOrganisations();
        reloadTags();
        reloadCampaigns();
        reloadAssets();
    }

    private Map<String, Set<String>> mapByConfigIdAndIds() {
        List<Attribute> allAtts = attributeService.findAllAttributes(COCA);
        Map<String, List<Attribute>> mapByConfigId = allAtts.stream().collect(Collectors.groupingBy(Attribute::getConfigId));
        return mapByConfigId
            .entrySet()
            .stream()
            .collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue().stream().map(Attribute::getId).collect(Collectors.toSet())));
    }

    private List<Tag> createTags(String... tagIds) {
        return Arrays.stream(tagIds).map(tagId -> Tag.builder().id(tagId).build()).collect(Collectors.toList());
    }

    public AttributeConfig.AttributeConfigBuilder notWritableAttributeConfigWithNoScope() {
        return AttributeConfig
            .builder()
            .id(TO_SITE)
            .key(TO_SITE)
            //            .campaignId("2023")
            //            .childrenTagsOneOf(List.of(Tag.builder().id(TRA).build()))
            ////                .parentSiteIds(List.of("s2"))
            //            .siteIds(List.of("s1"))

            .label("Tonnage du site")
            .isConsolidable(false)
            .isWritable(false)
            //            .tags(Set.of(Tag.builder().id(CAR).build()))
            .attributeType(DOUBLE)
            .siteId(ROOT)
            .orgaId(COCA)
            .applyOnChildren(true);
    }

    public void reloadOrganisations() {
        organisationRepository.save(Organisation.builder().id(COCA).name("Coca").build());
        organisationRepository.save(Organisation.builder().id("pepsi").name("Papsi").build());
        organisationRepository.save(Organisation.builder().id("fanta").name("Fanta1").build());
    }

    public void reloadTags() {
        tagRepository.deleteAll();
        tagRepository.save(Tag.builder().id(CAR).name("Carrière").orgaId(COCA).build());
        tagRepository.save(Tag.builder().id(TRA).name("Travaux").orgaId(COCA).build());
        tagRepository.save(Tag.builder().id(HQ).name("Siège").orgaId(COCA).build());
    }

    public void reloadCampaigns() {
        campaignRepository.deleteAll();
        campaignRepository.save(Campaign.builder().id("2022").name("Campagne 2022").orgaId(COCA).build());
        campaignRepository.save(Campaign.builder().id("2023").name("Campagne 2023").orgaId(COCA).build());
    }

    public void reloadAssets() {
        siteService.deleteAll();
        siteService.save(Site.builder().id(ROOT).name("Root site").type(SITE).orgaId(COCA).tags(Set.of()).build(), COCA);
        siteService.save(
            Site
                .builder()
                .id(S_1)
                .name("Site S1")
                .type(SITE)
                .orgaId(COCA)
                .parentId(ROOT)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .build(),
            COCA
        );
        siteService.save(
            Site
                .builder()
                .id(S_1_1)
                .name("Site S1-1")
                .type(SITE)
                .orgaId(COCA)
                .parentId(S_1)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .build(),
            COCA
        );
        siteService.save(
            Site
                .builder()
                .id(S_1_2)
                .name("Site S1-2")
                .type(SITE)
                .orgaId(COCA)
                .parentId(S_1)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .build(),
            COCA
        );
        siteService.save(
            Site
                .builder()
                .id(S_2)
                .name("Site S2")
                .type(SITE)
                .orgaId(COCA)
                .parentId(ROOT)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .build(),
            COCA
        );
        siteService.save(
            Site
                .builder()
                .id(S_2_1)
                .name("Site S2-1")
                .type(SITE)
                .orgaId(COCA)
                .parentId(S_2)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .build(),
            COCA
        );
        siteService.save(
            Site
                .builder()
                .id(S_2_2)
                .name("Site S2-2")
                .type(SITE)
                .orgaId(COCA)
                .parentId(S_2)
                .childrenIds(List.of())
                .tags(Set.of(Tag.builder().id(TRA).build()))
                .build(),
            COCA
        );
    }

    public void loadAttributeConfig_TO_SITE() {
        attributeConfigRepository.save(
            AttributeConfig
                .builder()
                .id(TO_SITE)
                .key(TO_SITE)
                .campaignId("2023")
                .childrenTagsOneOf(List.of(Tag.builder().id(TRA).build()))
                //                .parentSiteIds(List.of("s2"))
                .siteIds(List.of("s1"))
                .label("Tonnage du site")
                .isConsolidable(false)
                .isWritable(true)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .attributeType(DOUBLE)
                .siteId(ROOT)
                .orgaId(COCA)
                .applyOnChildren(true)
                .build()
        );
    }

    public void loadAttributeConfig_IS_CERT() {
        attributeConfigRepository.save(
            AttributeConfig
                .builder()
                .id(IS_CERT)
                .label("Site certifié")
                .isConsolidable(false)
                .isWritable(true)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .attributeType(BOOLEAN)
                .orgaId(COCA)
                .applyOnChildren(true)
                .siteId(ROOT)
                .build()
        );
    }

    public void loadAttributeConfig_TO_CONSO() {
        attributeConfigRepository.save(
            AttributeConfig
                .builder()
                .id("toConso")
                .label("Tonnage consolidé")
                .isConsolidable(true)
                .consoParameterKey(TO_SITE)
                .consoOperationType(CONSO_SUM_BY_KEY)
                .defaultValueForNotResolvableItem(0.)
                .isWritable(false)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .attributeType(DOUBLE)
                .orgaId(COCA)
                .applyOnChildren(true)
                .siteId(ROOT)
                .build()
        );
    }
    //
    //    public void setSomeValues() {
    //        String attId1 = "site:s1:toSite:period:2023";
    //        //        String attId2 = "site:s1:isCert:period:2023";
    //        Optional<Attribute> attOpt1 = attributeService.findByIdAndOrgaId(attId1, COCA);
    //        //        Optional<Attribute> attOpt2 = attributeService.findByIdAndOrgaId(attId2, COCA);
    //        Attribute att1 = attOpt1.get().toBuilder().attributeValue(DoubleValue.builder().value(120.).build()).build();
    //        //        Attribute att2 = attOpt2.get().toBuilder().attributeValue(BooleanValue.builder().value(true).build()).build();
    //        attributeService.save(att1);
    //        //        attributeService.save(att2);
    //        //        computeService.reCalculateSomeAttributes(Set.of(attId1, attId2), COCA);
    //        computeService.reCalculateSomeAttributes(Set.of(attId1), COCA);
    //    }
}
