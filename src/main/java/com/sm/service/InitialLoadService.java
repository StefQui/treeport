package com.sm.service;

import static com.sm.domain.enumeration.AssetType.RESOURCE;
import static com.sm.domain.enumeration.AssetType.SITE;
import static com.sm.domain.enumeration.AttributeType.DOUBLE;
import static com.sm.domain.enumeration.OperationType.SUM;

import com.sm.domain.*;
import com.sm.repository.*;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    public static final String R1_CONTENT =
        """
        {
           "type":"verticalPanel",
           "path":"vp",
           "items":
                [
                    {
                       "type":"textRef",
                       "refTo":"vp.vp2.inp2",
                       "col": 4
                   },
                   {
                      "type":"siteRef",
                      "refTo":"vp.thelist2",
                      "col": 4
                   },
                   {
                       "type":"input",
                       "path":"inp1",
                       "value":"tata"
                   },
                   {
                        "type":"siteList",
                        "path":"thelist2"
                   },
                   {
                       "path":"vp2",
                       "type":"verticalPanel",
                       "items":
                            [
                               {
                                   "type":"input",
                                   "path":"inp2",
                                   "value":"arg"
                               },
                               {
                                   "type":"textBasic",
                                   "text":"tutu",
                                   "col": 4
                               },
                               {
                                    "type":"textBasic",
                                    "text":"tutu2",
                                    "col": 4
                                },
                                {
                                     "type":"textRef",
                                     "refTo":"vp.inp1"
                                 },
                                 {
                                      "type": "siteList",
                                      "path": "thelist"
                                 }
                             ]
                        }
                ]
        }
        """;
    public static final String CAR = "CAR";
    public static final String TRA = "TRA";
    public static final String HQ = "HQ";
    public static final String TO_SITE = "toSite";
    private final Logger log = LoggerFactory.getLogger(InitialLoadService.class);
    private final OrganisationRepository organisationRepository;
    private final TagRepository tagRepository;
    private final CampaignRepository campaignRepository;
    private final AssetRepository assetRepository;
    private final AttributeConfigRepository attributeConfigRepository;

    public InitialLoadService(
        OrganisationRepository organisationRepository,
        TagRepository tagRepository,
        CampaignRepository campaignRepository,
        AssetRepository assetRepository,
        AttributeConfigRepository attributeConfigRepository
    ) {
        this.organisationRepository = organisationRepository;
        this.tagRepository = tagRepository;
        this.campaignRepository = campaignRepository;
        this.assetRepository = assetRepository;
        this.attributeConfigRepository = attributeConfigRepository;
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
        assetRepository.deleteAll();
        assetRepository.save(Site.builder().id(ROOT).name("Root site").type(SITE).orgaId(COCA).childrenIds(List.of(S_1, S_2)).build());
        assetRepository.save(Site.builder().id(S_1).name("Site S1").type(SITE).orgaId(COCA).parentId(ROOT).childrenIds(List.of()).build());
        assetRepository.save(Site.builder().id(S_2).name("Site S2").type(SITE).orgaId(COCA).parentId(ROOT).childrenIds(List.of()).build());
        assetRepository.save(
            Resource.builder().id(R_1).name("Resource r1").type(RESOURCE).orgaId(COCA).content(R1_CONTENT).childrenIds(List.of()).build()
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
                .applyOnChildren(false)
                .siteId(ROOT)
                .build()
        );
        attributeConfigRepository.save(
            AttributeConfig
                .builder()
                .id("toConso")
                .isConsolidable(true)
                .consoParameterKey(TO_SITE)
                .consoOperationType(SUM)
                .isWritable(false)
                .tags(Set.of(Tag.builder().id(CAR).build()))
                .attributeType(DOUBLE)
                .orgaId(COCA)
                .applyOnChildren(true)
                .siteId(ROOT)
                .build()
        );
    }
}
