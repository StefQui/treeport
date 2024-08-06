package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.BOOLEAN;
import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.domain.enumeration.AssetType.RESOURCE;
import static com.sm.domain.enumeration.AssetType.SITE;
import static com.sm.domain.operation.OperationType.CONSO_SUM_BY_KEY;

import com.sm.domain.*;
import com.sm.domain.attribute.Attribute;
import com.sm.domain.attribute.BooleanValue;
import com.sm.domain.attribute.DoubleValue;
import com.sm.repository.*;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Tag}.
 */
@Service
public class InitialLoadService {

    public static final String COCA = "coca";
    public static final String ROOT = "root";
    public static final String S_1 = "s1";
    public static final String S_1_1 = "s1-1";
    public static final String S_1_2 = "s1-2";
    public static final String S_2 = "s2";
    public static final String S_2_1 = "s2-1";
    public static final String S_2_2 = "s2-2";
    public static final String R_1 = "r1";
    public static final String R_2 = "r2";
    public static final String R_3 = "r3";
    public static final String R_4 = "r4";
    public static final String R_5 = "r5";
    public static final String R_SITE_DETAIL = "siteDetail";
    public static final String R_DS = "rds";
    public static final String R_DS_WITH_FORM = "rDsWithForm";
    public static final String R_DS_LIST = "rDsList";
    public static final String R_DT_TREE = "rDtTree";
    public static final String R_PAGEDS = "rpageDs";
    public static final String R_PAGEDS_WITH_FORM = "rpageDsWithForm";
    public static final String R_PAGEDS_LIST = "rpageDsList";
    public static final String R_PAGEDT_TREE = "rpageDtTree";
    public static final String R_FORM = "rform";
    public static final String R_LAYOUT = "rlayout";
    public static final String R_PAGE1 = "rpage1";
    public static final String R_PAGE2 = "rpage2";
    public static final String R_MENU_TOP = "rmenuTop";

    public static final String CAR = "CAR";
    public static final String TRA = "TRA";
    public static final String HQ = "HQ";
    public static final String TO_SITE = "toSite";
    public static final String IS_CERT = "isCert";
    private final Logger log = LoggerFactory.getLogger(InitialLoadService.class);
    private final OrganisationRepository organisationRepository;
    private final TagRepository tagRepository;
    private final CampaignRepository campaignRepository;
    private final SiteService siteService;
    private final ResourceRepository resourceRepository;
    private final AttributeConfigRepository attributeConfigRepository;
    private final AttributeRepository attributeRepository;
    private final ComputeService computeService;
    private final AttributeService attributeService;

    @Value("classpath:json/r1.json")
    org.springframework.core.io.Resource r1SourceFile;

    @Value("classpath:json/r2.json")
    org.springframework.core.io.Resource r2SourceFile;

    @Value("classpath:json/r3.json")
    org.springframework.core.io.Resource r3SourceFile;

    @Value("classpath:json/r4.json")
    org.springframework.core.io.Resource r4SourceFile;

    @Value("classpath:json/r5.json")
    org.springframework.core.io.Resource r5SourceFile;

    @Value("classpath:json/siteDetail.json")
    org.springframework.core.io.Resource siteDetailSourceFile;

    @Value("classpath:json/rds.json")
    org.springframework.core.io.Resource rdsSourceFile;

    @Value("classpath:json/rDsWithForm.json")
    org.springframework.core.io.Resource rDsWithFormSourceFile;

    @Value("classpath:json/rDsList.json")
    org.springframework.core.io.Resource rDsListSourceFile;

    @Value("classpath:json/rDtTree.json")
    org.springframework.core.io.Resource rDtTreeSourceFile;

    @Value("classpath:json/rpageDs.json")
    org.springframework.core.io.Resource rpageDsSourceFile;

    @Value("classpath:json/rpageDsWithForm.json")
    org.springframework.core.io.Resource rpageDsWithFormSourceFile;

    @Value("classpath:json/rpageDsList.json")
    org.springframework.core.io.Resource rpageDsListSourceFile;

    @Value("classpath:json/rpageDtTree.json")
    org.springframework.core.io.Resource rpageDtTreeSourceFile;

    @Value("classpath:json/rform.json")
    org.springframework.core.io.Resource rFormSourceFile;

    @Value("classpath:json/rlayout.json")
    org.springframework.core.io.Resource rlayoutSourceFile;

    @Value("classpath:json/rpage1.json")
    org.springframework.core.io.Resource rpage1SourceFile;

    @Value("classpath:json/rpage2.json")
    org.springframework.core.io.Resource rpage2SourceFile;

    @Value("classpath:json/rmenutop.json")
    org.springframework.core.io.Resource rmenutopSourceFile;

    public InitialLoadService(
        OrganisationRepository organisationRepository,
        TagRepository tagRepository,
        CampaignRepository campaignRepository,
        SiteService siteService,
        ResourceRepository resourceRepository,
        AttributeConfigRepository attributeConfigRepository,
        AttributeRepository attributeRepository,
        AttributeService attributeService,
        ComputeService computeService
    ) {
        this.organisationRepository = organisationRepository;
        this.tagRepository = tagRepository;
        this.campaignRepository = campaignRepository;
        this.siteService = siteService;
        this.resourceRepository = resourceRepository;
        this.attributeConfigRepository = attributeConfigRepository;
        this.attributeRepository = attributeRepository;
        this.computeService = computeService;
        this.attributeService = attributeService;
    }

    public void reloadOrganisations() {
        organisationRepository.deleteAll();
        organisationRepository.save(Organisation.builder().id(COCA).name("Coca").build());
        organisationRepository.save(Organisation.builder().id("pepsi").name("Papsi").build());
        organisationRepository.save(Organisation.builder().id("fanta").name("Fanta").build());
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
        siteService.save(
            Site.builder().id(ROOT).name("Root site").type(SITE).orgaId(COCA).childrenIds(List.of(S_1, S_2)).tags(Set.of()).build(),
            COCA
        );
        siteService.save(
            Site
                .builder()
                .id(S_1)
                .name("Site S1")
                .type(SITE)
                .orgaId(COCA)
                .parentId(ROOT)
                .childrenIds(List.of(S_1_1, S_1_2))
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
                .childrenIds(List.of())
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
                .childrenIds(List.of())
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
                .childrenIds(List.of(S_2_1, S_2_2))
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
                .childrenIds(List.of())
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
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .build(),
            COCA
        );

        resourceRepository.deleteAll();
        resourceRepository.save(
            Resource
                .builder()
                .id(R_1)
                .name("Resource r1")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(r1SourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_2)
                .name("Resource r2")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(r2SourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_3)
                .name("Resource r3")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(r3SourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_4)
                .name("Resource r4")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(r4SourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_5)
                .name("Resource r5")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(r5SourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_SITE_DETAIL)
                .name("Resource siteDetail")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(siteDetailSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_DS)
                .name("Resource rds")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rdsSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_DS_WITH_FORM)
                .name("Resource rds with form")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rDsWithFormSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_DS_LIST)
                .name("Resource rds with list")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rDsListSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_DT_TREE)
                .name("Resource rdt with tree")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rDtTreeSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_PAGEDS)
                .name("Resource rpageDs")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rpageDsSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_PAGEDS_WITH_FORM)
                .name("Resource rpageDsWithForm")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rpageDsWithFormSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_PAGEDS_LIST)
                .name("Resource rpageDsList")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rpageDsListSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_PAGEDT_TREE)
                .name("Resource rpageDtTree")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rpageDtTreeSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_FORM)
                .name("Resource form")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rFormSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_LAYOUT)
                .name("Resource layout")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rlayoutSourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_PAGE1)
                .name("Resource page 1")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rpage1SourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_PAGE2)
                .name("Resource page 2")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rpage2SourceFile))
                .childrenIds(List.of())
                .build()
        );
        resourceRepository.save(
            Resource
                .builder()
                .id(R_MENU_TOP)
                .name("Resource menutop")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rmenutopSourceFile))
                .childrenIds(List.of())
                .build()
        );
    }

    public void reloadAttributeConfigs() {
        attributeConfigRepository.deleteAll();
        attributeConfigRepository.save(
            AttributeConfig
                .builder()
                .id(TO_SITE)
                .key(TO_SITE)
                .label("Tonnage du site")
                .campaignId("2023")
                .configOrder(0)
                .isConsolidable(false)
                .isWritable(true)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .attributeType(DOUBLE)
                .orgaId(COCA)
                .applyOnChildren(true)
                .siteId(ROOT)
                .build()
        );
        attributeConfigRepository.save(
            AttributeConfig
                .builder()
                .id(IS_CERT)
                .key(IS_CERT)
                .label("Site certifié")
                .campaignId("2023")
                .configOrder(0)
                .isConsolidable(false)
                .isWritable(true)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .attributeType(BOOLEAN)
                .orgaId(COCA)
                .applyOnChildren(true)
                .siteId(ROOT)
                .build()
        );
        attributeConfigRepository.save(
            AttributeConfig
                .builder()
                .id("toConso")
                .key("toConso")
                .label("Tonnage consolidé")
                .campaignId("2023")
                .configOrder(0)
                .isConsolidable(true)
                .consoParameterKey(TO_SITE)
                .consoOperationType(CONSO_SUM_BY_KEY)
                .consoDefaultValueForNotResolvableItem(0.)
                .isWritable(false)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .attributeType(DOUBLE)
                .orgaId(COCA)
                .applyOnChildren(true)
                .siteId(ROOT)
                .build()
        );
    }

    public void setSomeValues() {
        String attId1 = "site:s1:toSite:period:2023";
        String attId2 = "site:s1:isCert:period:2023";
        Optional<Attribute> attOpt1 = attributeService.findByIdAndOrgaId(attId1, COCA);
        Optional<Attribute> attOpt2 = attributeService.findByIdAndOrgaId(attId2, COCA);
        Attribute att1 = attOpt1.get().toBuilder().attributeValue(DoubleValue.builder().value(120.).build()).build();
        Attribute att2 = attOpt2.get().toBuilder().attributeValue(BooleanValue.builder().value(true).build()).build();
        attributeService.save(att1);
        attributeService.save(att2);
        computeService.reCalculateSomeAttributes(Set.of(attId1, attId2), COCA);
    }
}
