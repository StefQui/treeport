package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.domain.enumeration.AssetType.RESOURCE;
import static com.sm.domain.enumeration.AssetType.SITE;
import static com.sm.domain.operation.OperationType.CONSO_SUM;

import com.sm.domain.*;
import com.sm.domain.attribute.Attribute;
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
    public static final String S_2 = "s2";
    public static final String R_1 = "r1";
    public static final String R_2 = "r2";
    public static final String R_3 = "r3";
    public static final String R_4 = "r4";
    public static final String R_5 = "r5";
    public static final String R_FORM = "rform";

    public static final String CAR = "CAR";
    public static final String TRA = "TRA";
    public static final String HQ = "HQ";
    public static final String TO_SITE = "toSite";
    private final Logger log = LoggerFactory.getLogger(InitialLoadService.class);
    private final OrganisationRepository organisationRepository;
    private final TagRepository tagRepository;
    private final CampaignRepository campaignRepository;
    private final SiteRepository siteRepository;
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

    @Value("classpath:json/rform.json")
    org.springframework.core.io.Resource rFormSourceFile;

    public InitialLoadService(
        OrganisationRepository organisationRepository,
        TagRepository tagRepository,
        CampaignRepository campaignRepository,
        SiteRepository siteRepository,
        ResourceRepository resourceRepository,
        AttributeConfigRepository attributeConfigRepository,
        AttributeRepository attributeRepository,
        AttributeService attributeService,
        ComputeService computeService
    ) {
        this.organisationRepository = organisationRepository;
        this.tagRepository = tagRepository;
        this.campaignRepository = campaignRepository;
        this.siteRepository = siteRepository;
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
        siteRepository.deleteAll();
        siteRepository.save(
            Site.builder().id(ROOT).name("Root site").type(SITE).orgaId(COCA).childrenIds(List.of(S_1, S_2)).tags(Set.of()).build()
        );
        siteRepository.save(
            Site
                .builder()
                .id(S_1)
                .name("Site S1")
                .type(SITE)
                .orgaId(COCA)
                .parentId(ROOT)
                .childrenIds(List.of())
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .build()
        );
        siteRepository.save(
            Site
                .builder()
                .id(S_2)
                .name("Site S2")
                .type(SITE)
                .orgaId(COCA)
                .parentId(ROOT)
                .childrenIds(List.of())
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .build()
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
                .id(R_FORM)
                .name("Resource form")
                .type(RESOURCE)
                .orgaId(COCA)
                .content(UtilsResourceFile.asString(rFormSourceFile))
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
                .id("toConso")
                .isConsolidable(true)
                .consoParameterKey(TO_SITE)
                .consoOperationType(CONSO_SUM)
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

    public void setSomeValues() {
        String attId = "site:s1:toSite:period:2023";
        Optional<Attribute> att = attributeService.findByIdAndOrgaId(attId, COCA);
        Attribute att1 = att.get().toBuilder().attributeValue(DoubleValue.builder().value(120.).build()).build();
        attributeService.save(att1);
        computeService.reCalculateSomeAttributes(Set.of(attId), COCA);
    }
}
