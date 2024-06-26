package com.sm.service;

import static com.sm.domain.attribute.Attribute.PERIOD_FRAG;
import static com.sm.domain.attribute.Attribute.SITE_FRAG;
import static com.sm.domain.operation.OperationType.AVG;
import static com.sm.domain.operation.OperationType.CHILDREN_AVG;
import static com.sm.domain.operation.OperationType.CHILDREN_COUNT;
import static com.sm.domain.operation.OperationType.CHILDREN_PRODUCT;
import static com.sm.domain.operation.OperationType.CHILDREN_SUM;
import static com.sm.domain.operation.OperationType.COMPARISON;
import static com.sm.domain.operation.OperationType.CONSTANT;
import static com.sm.domain.operation.OperationType.DIVIDE;
import static com.sm.domain.operation.OperationType.PRODUCT;
import static com.sm.domain.operation.OperationType.REF;
import static com.sm.domain.operation.OperationType.SUM;
import static com.sm.domain.operation.OperationType.TAG;
import static com.sm.service.AttributeKeyUtils.createReferenced;
import static com.sm.service.AttributeKeyUtils.fromString;
import static com.sm.service.AttributeKeyUtils.objToString;
import static com.sm.service.AttributeKeyUtils.unApplyOffSet;
import static java.util.Optional.of;

import com.sm.domain.*;
import com.sm.domain.attribute.AggInfo;
import com.sm.domain.attribute.Attribute;
import com.sm.domain.attribute.AttributeValue;
import com.sm.domain.attribute.ErrorValue;
import com.sm.domain.operation.*;
import com.sm.service.dto.attribute.AttributeDTO;
import com.sm.service.mapper.AttributeValueMapper;
import java.util.*;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
@Slf4j
public class ComputeService {

    @Autowired
    SiteService siteService;

    @Autowired
    CampaignService campaignService;

    @Autowired
    CalculatorService calculatorService;

    @Autowired
    AttributeConfigService attributeConfigService;

    @Autowired
    AttributeValueMapper attributeValueMapper;

    @Autowired
    AttributeService attributeService;

    ConsoCalculator<Double> doubleCalculator = new ConsoCalculator();
    ConsoCalculator<Long> longCalculator = new ConsoCalculator();

    public void applyCampaigns(@NonNull String orgaId) {
        campaignService.findAllCampaigns().stream().forEach(c -> this.applyCampaign(c, orgaId));
    }

    private void applyCampaign(Campaign campaign, @NonNull String orgaId) {
        Map<String, List<AttributeConfig>> keyConfigsMaps = attributeConfigService
            .findAllConfigs(orgaId)
            .stream()
            .collect(Collectors.groupingBy(AttributeConfig::getId));
        siteService
            .findAllRootSites(orgaId)
            .stream()
            .forEach(root -> {
                this.applyCampaignForSiteAndKeyConfigsMap(campaign, root, keyConfigsMaps, orgaId);
                this.validateForCampaignAndSite(campaign, root, orgaId);
            });

        treeShake(keyConfigsMaps, campaign, orgaId);
    }

    private void validateForCampaignAndSite(Campaign campaign, Site site, @NonNull String orgaId) {
        List<Attribute> attributes = attributeService.findBySite(site.getId(), orgaId);
        attributes.forEach(attribute -> validate(site, attribute, campaign, orgaId));

        List<Site> children = siteService.getChildren(site, orgaId);
        children.stream().forEach(s -> validateForCampaignAndSite(campaign, s, orgaId));
    }

    private void validate(Site site, Attribute attribute, Campaign campaign, @NonNull String orgaId) {
        if (!attribute.getIsAgg()) {
            return;
        }
        AttributeConfig config = attributeConfigService.findByOrgaIdAndId(attribute.getConfigId(), orgaId).get();
        String consoAttKey = generateConsolidatedAttKey(site, config.getConsoParameterKey(), PERIOD_FRAG, campaign);
        Optional<Attribute> consoatt = attributeService.findByIdAndOrgaId(consoAttKey, orgaId);
        if (consoatt.isPresent() && consoatt.get().getIsAgg()) {
            attribute.setHasConfigError(true);
            attribute.setConfigError("Consolidated attribute should not be a consolidable one");
            attributeService.save(attribute);
        }
    }

    private void treeShake(Map<String, List<AttributeConfig>> keyConfigsMaps, Campaign campaign, @NonNull String orgaId) {
        siteService.findAllRootSites(orgaId).stream().forEach(root -> this.treeShakeForSite(campaign, root, orgaId));
    }

    private void treeShakeForSite(Campaign campaign, Site site, @NonNull String orgaId) {
        List<Attribute> attributes = attributeService.findBySite(site.getId(), orgaId);
        attributes.forEach(att -> {
            List<String> impacters = att.getImpacterIds().stream().collect(Collectors.toList());
            int i = impacters.size();
            while (i > 0) {
                if (attributeService.findByIdAndOrgaId(impacters.get(i - 1), orgaId).isEmpty()) {
                    impacters.remove(i - 1);
                }
                i--;
            }
            att.setImpacterIds(impacters.stream().collect(Collectors.toSet()));
            attributeService.save(att);
        });
        List<Site> children = siteService.getChildren(site, orgaId);
        children.stream().forEach(s -> treeShakeForSite(campaign, s, orgaId));
    }

    private void applyCampaignForSiteAndKeyConfigsMap(
        Campaign campaign,
        Site root,
        Map<String, List<AttributeConfig>> keyConfigsMap,
        @NonNull String orgaId
    ) {
        keyConfigsMap.forEach((configKey, configs) ->
            this.applyCampaignForSiteAndKeyConfigs(campaign, root, configKey, configs, null, orgaId)
        );
    }

    private void applyCampaignForSiteAndKeyConfigs(
        Campaign campaign,
        Site site,
        String configKey,
        List<AttributeConfig> configs,
        AttributeConfig applyableConfig,
        @NonNull String orgaId
    ) {
        AttributeConfig configForSite = configs
            .stream()
            .filter(c -> c.getId().equals(configKey) && site.getId().equals(c.getSiteId()))
            .findAny()
            .orElse(null);
        if (configForSite == null) {
            if (applyableConfig != null) {
                this.createOrUpdateAttribute(site, configKey, campaign, applyableConfig, orgaId);
            }
        } else {
            this.createOrUpdateAttribute(site, configKey, campaign, configForSite, orgaId);
        }
        AttributeConfig nextApplyableConfig = fetchNextApplyableConfig(configForSite, applyableConfig);

        List<Site> children = siteService.getChildren(site, orgaId);
        children.stream().forEach(s -> applyCampaignForSiteAndKeyConfigs(campaign, s, configKey, configs, nextApplyableConfig, orgaId));
    }

    private AttributeConfig fetchNextApplyableConfig(AttributeConfig configForSite, AttributeConfig applyableConfig) {
        if (configForSite == null) {
            if (applyableConfig != null) {
                return applyableConfig.getApplyOnChildren() ? applyableConfig : null;
            }
        } else {
            return configForSite.getApplyOnChildren() ? configForSite : applyableConfig;
        }
        return null;
    }

    private void createOrUpdateAttribute(Site site, String configKey, Campaign campaign, AttributeConfig config, @NonNull String orgaId) {
        if (CollectionUtils.isEmpty(config.getTags()) || this.matchAtLeastOneTag(site.getTags(), config.getTags())) {
            String attKey = AttributeKeyUtils.key(SITE_FRAG, site.getId(), configKey, PERIOD_FRAG, campaign.getId());
            Attribute attribute = attributeService.findByIdAndOrgaId(attKey, orgaId).orElse(null);
            if (attribute == null) {
                attribute = Attribute.builder().orgaId(orgaId).siteId(site.getId()).id(attKey).build();
            } else {
                attribute.setHasConfigError(false);
                attribute.setConfigError(null);
            }
            addImpacters(attribute, config, site, campaign, orgaId);
            attribute.setConfigId(config.getId());
            attribute.setCampaignId(campaign.getId());
            if (config.getIsConsolidable()) {
                attribute.setIsAgg(true);
                attribute.setAggInfo(AggInfo.builder().build());
            }
            attribute.setTags(site.getTags());
            attributeService.save(attribute);
        }
    }

    private void addImpacters(Attribute attribute, AttributeConfig config, Site site, Campaign campaign, @NonNull String orgaId) {
        Set<String> impacters = new HashSet<>();
        if (config.getIsConsolidable()) {
            impacters.addAll(
                site
                    .getChildrenIds()
                    .stream()
                    .map(childId -> AttributeKeyUtils.siteKey(childId, config.getId(), PERIOD_FRAG, campaign.getId()))
                    .collect(Collectors.toSet())
            );
            impacters.add(generateConsolidatedAttKey(site, config.getConsoParameterKey(), PERIOD_FRAG, campaign));
        } else {
            impacters.addAll(fetchImpactersForConfig(config, attribute.getId(), orgaId));
        }
        attribute.setImpacterIds(impacters);
    }

    private String generateConsolidatedAttKey(Site site, String consoParameterKey, String period, Campaign campaign) {
        return AttributeKeyUtils.siteKey(site.getId(), consoParameterKey, period, campaign.getId());
    }

    private boolean matchAtLeastOneTag(Set<Tag> tags1, Set<Tag> tags2) {
        Set<String> tags2String = tags2.stream().map(Tag::getId).collect(Collectors.toSet());
        return tags1 != null && tags2 != null && tags1.stream().anyMatch(t -> tags2String.contains(t.getId()));
    }

    public void reCalculateAllAttributes(String orgaId) {
        Set<String> all = new HashSet<>();
        attributeService
            .findAllAttributes(orgaId)
            .stream()
            .forEach(att -> {
                all.add(att.getId());
                all.addAll(att.getImpacterIds());
            });
        this.reCalculateSomeAttributes(all, orgaId);
    }

    public List<Attribute> reCalculateSomeAttributes(Set<String> attributeIds, String orgaId) {
        log.info("-------------------------------------");
        log.info("ReCalculating for : " + attributeIds);
        log.info("-------------------------------------");

        Set<Attribute> impactedAttributes = new HashSet<>();
        attributeIds.stream().forEach(attKey -> fetchImpactedAttributes(attKey, impactedAttributes, orgaId));

        List<Attribute> orderedImpactedAttributes = ComputeSortingService.sortImpacteds(impactedAttributes);

        if (!CollectionUtils.isEmpty(impactedAttributes)) {
            calculateImpacts(orderedImpactedAttributes, orgaId);
            return orderedImpactedAttributes;
        }

        return new ArrayList<>();
    }

    private void fetchImpactedAttributes(String attKey, Set<Attribute> impactedAttributes, @NonNull String orgaId) {
        Attribute att = attributeService.findByIdAndOrgaId(attKey, orgaId).orElse(null);
        if (att != null) {
            impactedAttributes.add(att);
        }

        //        impactedAttributes.add(attributeService.findByIdAndOrgaId(attKey, orgaId).get());
        Set<Attribute> impacteds = attributeService.findImpacted(attKey, orgaId);
        //        impactedAttributes.addAll(impacteds);
        //        impacteds.forEach(att1 -> fetchImpactedAttributes(att1.getId(), impactedAttributes));
        impacteds.forEach(att1 -> {
            if (!impactedAttributes.contains(att1)) {
                impactedAttributes.add(att1);
                fetchImpactedAttributes(att1.getId(), impactedAttributes, orgaId);
            }
        });
    }

    private void calculateImpacts(List<Attribute> attributes, String orgaId) {
        attributes
            .stream()
            .forEach(attribute -> {
                if (attribute.getHasConfigError()) {
                    attribute.setAttributeValue(ErrorValue.builder().value(attribute.getConfigError()).build());
                    return;
                }
                AttributeConfig config = attributeConfigService.findByOrgaIdAndId(attribute.getConfigId(), orgaId).orElse(null);
                if (config == null) {
                    attribute.setAttributeValue(
                        ErrorValue
                            .builder()
                            .value("Attribute is referencing a config that can't be found : " + attribute.getConfigId())
                            .build()
                    );
                    return;
                }
                if (config.getIsWritable()) {
                    return;
                }
                if (config.getOperation() == null) {
                    log.info("jhh");
                }
                Pair<AttributeValue, AggInfo> v = calculatorService.calculateAttribute(
                    orgaId,
                    attribute.getId(),
                    attribute.getTags(),
                    attribute.getImpacterIds(),
                    config
                );
                attribute.setAttributeValue(v.getLeft());
                attribute.setAggInfo(v.getRight());
                attributeService.save(attribute);
            });
    }

    private void fetchImpactsForConfigs(String id, List<AttributeConfig> configs, List<Impact> impacts, @NonNull String orgaId) {
        configs.stream().forEach(config -> this.fetchImpactsForConfig(id, config, impacts, configs, orgaId));
    }

    private void fetchImpactsForConfig(
        String id,
        AttributeConfig config,
        List<Impact> impacts,
        List<AttributeConfig> configs,
        @NonNull String orgaId
    ) {
        List<Impact> impactsForConfig = evaluateImpacts(id, config, orgaId);
        if (CollectionUtils.isEmpty(impactsForConfig)) {
            return;
        }
        List<Impact> impactsToadd = impactsForConfig
            .stream()
            .filter(impact -> !impacts.stream().map(Impact::getImpactedId).collect(Collectors.toList()).contains(impact.getImpactedId()))
            .collect(Collectors.toList());
        impacts.addAll(impactsToadd);
        impactsToadd.stream().forEach(impact -> fetchImpactsForConfigs(impact.getImpactedId(), configs, impacts, orgaId));
    }

    public List<Impact> evaluateImpacts(String id, AttributeConfig config, @NonNull String orgaId) {
        AttributeKeyAsObj attObj = fromString(id);

        if (config.getIsConsolidable()) {
            if (config.getConsoParameterKey() == null) {
                throw new RuntimeException("not noraml here 3");
            }
            if (config.getConsoParameterKey().equals(attObj.getAttributeId())) {
                AttributeKeyAsObj impacted = attObj.toBuilder().attributeId(config.getId()).build();
                Optional<Site> current = siteService.getSiteById(impacted.getAssetId(), orgaId);
                Set<String> impacters = current
                    .get()
                    .getChildrenIds()
                    .stream()
                    .map(child -> objToString(impacted.toBuilder().assetId(child).build()))
                    .collect(Collectors.toSet());
                impacters.add(id);
                return List.of(Impact.builder().impactedId(objToString(impacted)).impacterIds(impacters).build());
            }
            if (config.getId().equals(attObj.getAttributeId())) {
                Optional<Site> current = siteService.getSiteById(attObj.getAssetId(), orgaId);
                if (current.isEmpty()) {
                    return null;
                }
                Optional<Site> parent = siteService.getSiteById(current.get().getParentId(), orgaId);
                if (parent.isEmpty() || parent.get().getChildrenIds() == null) {
                    return null;
                }
                Set<String> impacters = parent
                    .get()
                    .getChildrenIds()
                    .stream()
                    .map(childId -> objToString(attObj.toBuilder().assetId(childId).build()))
                    .collect(Collectors.toSet());
                impacters.add(
                    objToString(attObj.toBuilder().assetId(parent.get().getId()).attributeId(config.getConsoParameterKey()).build())
                );
                return List.of(
                    Impact
                        .builder()
                        .impactedId(objToString(attObj.toBuilder().assetId(parent.get().getId()).build()))
                        .impacterIds(impacters)
                        .build()
                );
            }
        } else if (config.getIsWritable()) {
            return null;
        } else if (config.getOperation() != null) {
            List<Impact> impacts = new ArrayList<>();
            config
                .getOperation()
                .extractAllRefs()
                .stream()
                .forEach(refOp -> {
                    if (attObj.getAttributeId().equals(refOp.getKey())) {
                        List<String> impacteds = fetchImpacteds(attObj, config, refOp, orgaId);
                        if (!CollectionUtils.isEmpty(impacteds)) {
                            impacteds
                                .stream()
                                .forEach(impacted -> {
                                    impacts.add(
                                        Impact
                                            .builder()
                                            .impactedId(impacted)
                                            .impacterIds(fetchImpactersForConfig(config, impacted, orgaId))
                                            .build()
                                    );
                                });
                        }
                    }
                });
            return impacts;
        }
        return null;
    }

    private List<String> fetchImpacteds(
        AttributeKeyAsObj attObj,
        AttributeConfig config,
        RefOperation refOperation,
        @NonNull String orgaId
    ) {
        AttributeKeyAsObj.AttributeKeyAsObjBuilder impacted = attObj.toBuilder();
        if (config.getOperationType().equals(CHILDREN_SUM)) {
            Site site = siteService
                .getSiteById(attObj.getAssetId(), orgaId)
                .orElseThrow(() -> new RuntimeException("Should have a site here"));
            if (site.getParentId() == null) {
                return null;
            }
            return List.of(objToString(impacted.attributeId(config.getId()).assetId(site.getParentId()).build()));
        }
        if (refOperation.getUseCurrentSite()) {} else {
            return siteService
                .findAllSites(orgaId)
                .stream()
                .map(site -> attObj.toBuilder().attributeId(config.getId()).assetId(site.getId()).build())
                .map(obj -> objToString(obj))
                .collect(Collectors.toList());
        }
        if (refOperation.getDateOffset() != null && refOperation.getDateOffset() != 0) {
            if (!attObj.getCampaignType().equals(PERIOD_FRAG)) {
                return null;
            }
            impacted.campaign(unApplyOffSet(attObj.getCampaign(), refOperation.getDateOffset()));
        }

        impacted.attributeId(config.getId());
        return List.of(objToString(impacted.build()));
    }

    private Set<String> fetchImpactersForConfig(AttributeConfig config, String impacted, @NonNull String orgaId) {
        Set<String> impacters = new HashSet<>();
        if (config.getOperation() != null) {
            fetchImpactersForOperation(config.getOperation(), impacted, impacters, orgaId);
        }
        return impacters;
    }

    private void fetchImpactersForOperation(Operation operation, String impacted, Set<String> impacters, @NonNull String orgaId) {
        AttributeKeyAsObj attributeKeyAsObj = fromString(impacted);

        if (
            CHILDREN_SUM.equals(operation.getOperationType()) ||
            CHILDREN_PRODUCT.equals(operation.getOperationType()) ||
            CHILDREN_AVG.equals(operation.getOperationType()) ||
            CHILDREN_COUNT.equals(operation.getOperationType())
        ) {
            HasItemsKey op = (HasItemsKey) operation;
            Site site = siteService
                .getSiteById(attributeKeyAsObj.getAssetId(), orgaId)
                .orElseThrow(() -> new RuntimeException("Should have a site here 2"));
            impacters.addAll(
                site
                    .getChildrenIds()
                    .stream()
                    .map(childId -> objToString(attributeKeyAsObj.toBuilder().attributeId(op.getItemsKey()).assetId(childId).build()))
                    .collect(Collectors.toSet())
            );
        } else if (
            SUM.equals(operation.getOperationType()) ||
            PRODUCT.equals(operation.getOperationType()) ||
            AVG.equals(operation.getOperationType())
        ) {
            HasItems op = (HasItems) operation;
            op.getItems().forEach(item -> fetchImpactersForOperation(item, impacted, impacters, orgaId));
        } else if (COMPARISON.equals(operation.getOperationType()) || DIVIDE.equals(operation.getOperationType())) {
            Has2Operands op = (Has2Operands) operation;
            fetchImpactersForOperation(op.getFirst(), impacted, impacters, orgaId);
            fetchImpactersForOperation(op.getSecond(), impacted, impacters, orgaId);
        } else if (CONSTANT.equals(operation.getOperationType())) {} else if (TAG.equals(operation.getOperationType())) {} else if (
            REF.equals(operation.getOperationType())
        ) {
            RefOperation op = (RefOperation) operation;
            impacters.add(objToString(createReferenced(attributeKeyAsObj, op)));
        } else {
            throw new RuntimeException("to be implemented here : " + operation.getOperationType());
        }
    }

    public Optional<List<String>> saveAttributes(String orgaId, List<AttributeDTO> attributesToSave) {
        Set<String> attIds = attributesToSave.stream().map(AttributeDTO::getId).collect(Collectors.toSet());

        attributesToSave
            .stream()
            .forEach(attDto -> {
                Attribute att = attributeService.findByIdAndOrgaId(attDto.getId(), orgaId).get();
                att.setAttributeValue(attributeValueMapper.toEntity(attDto.getAttributeValue()));
                attributeService.save(att);
            });
        return of(reCalculateSomeAttributes(attIds, orgaId).stream().map(Attribute::getId).collect(Collectors.toList()));
    }
}
