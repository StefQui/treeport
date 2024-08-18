package com.sm.service;

import static com.sm.domain.attribute.Attribute.PERIOD_FRAG;
import static com.sm.domain.operation.OperationType.AVG;
import static com.sm.domain.operation.OperationType.CHILDREN_AVG_BY_KEY;
import static com.sm.domain.operation.OperationType.CHILDREN_COUNT_BY_COUNT;
import static com.sm.domain.operation.OperationType.CHILDREN_PRODUCT_BY_KEY;
import static com.sm.domain.operation.OperationType.CHILDREN_SUM_BY_KEY;
import static com.sm.domain.operation.OperationType.COMPARISON;
import static com.sm.domain.operation.OperationType.CONSTANT;
import static com.sm.domain.operation.OperationType.DIVIDE;
import static com.sm.domain.operation.OperationType.IF_THEN_ELSE;
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
import com.sm.domain.attribute.*;
import com.sm.domain.operation.*;
import com.sm.service.dto.attribute.AttributeDTO;
import com.sm.service.mapper.AttributeValueMapper;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
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

    @Autowired
    DirtierService dirtierService;

    ConsoCalculator<Double> doubleCalculator = new ConsoCalculator();
    ConsoCalculator<Long> longCalculator = new ConsoCalculator();

    public void applyCampaigns(@NonNull String orgaId, List<String> ids) {
        campaignService.findAllByIdsAndOrgaId(ids, orgaId).stream().forEach(c -> this.applyCampaign(c, orgaId));
        //        campaignService.findAllCampaigns().stream().forEach(c -> this.applyCampaign(c, orgaId));
    }

    private void applyCampaign(Campaign campaign, @NonNull String orgaId) {
        Map<String, List<AttributeConfig>> keyOrderedConfigsMaps = attributeConfigService
            .findAllConfigs(orgaId)
            .stream()
            .filter(config -> config.getCampaignId().equals(campaign.getId()))
            .collect(Collectors.groupingBy(AttributeConfig::getKey));
        keyOrderedConfigsMaps.forEach((key, configs) -> configs.stream().sorted(Comparator.comparingInt(AttributeConfig::getConfigOrder)));
        siteService
            .findAllRootSites(orgaId)
            .stream()
            .forEach(root -> {
                this.applyCampaignForSiteAndKeyConfigsMap(campaign, root, keyOrderedConfigsMaps, orgaId);
                this.validateForCampaignAndSite(campaign, root, orgaId);
            });

        treeShake(keyOrderedConfigsMaps, campaign, orgaId);
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
            if (att.getImpacterIds() == null) {
                return;
            }
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
        Site site,
        Map<String, List<AttributeConfig>> keyOrderedConfigsMaps,
        @NonNull String orgaId
    ) {
        keyOrderedConfigsMaps.forEach((configKey, configs) ->
            this.applyCampaignForSiteAndKeyConfigs(campaign, site, configKey, configs, orgaId)
        );
    }

    private void applyCampaignForSiteAndKeyConfigs(
        Campaign campaign,
        Site site,
        String configKey,
        List<AttributeConfig> orderedConfigs,
        @NonNull String orgaId
    ) {
        boolean found = false;
        int i = 0;
        while (!found && i < orderedConfigs.size()) {
            AttributeConfig config = orderedConfigs.get(i);
            if (isEligible(site, config, campaign)) {
                this.createOrUpdateAttribute(AssetKey.site, site, null, null, configKey, campaign, config, orgaId);
                found = true;
            }
            i++;
        }
        //        AttributeConfig configForSite = configs
        //            .stream()
        //            .filter(c -> c.getId().equals(configKey) && site.getId().equals(c.getSiteId()))
        //            .findAny()
        //            .orElse(null);
        //        if (configForSite == null) {
        //            if (applyableConfig != null) {
        //                this.createOrUpdateAttribute(site, configKey, campaign, applyableConfig, orgaId);
        //            }
        //        } else {
        //            this.createOrUpdateAttribute(site, configKey, campaign, configForSite, orgaId);
        //        }
        //        AttributeConfig nextApplyableConfig = fetchNextApplyableConfig(configForSite, applyableConfig);

        List<Site> children = siteService.getChildren(site, orgaId);
        children.stream().forEach(s -> applyCampaignForSiteAndKeyConfigs(campaign, s, configKey, orderedConfigs, orgaId));
    }

    private boolean isEligible(Site site, AttributeConfig config, Campaign campaign) {
        if (config.getConfigOrder() == null) {
            throw new RuntimeException("config order can't be null");
        }

        // sitesCheck
        boolean sitesCheck = false;
        if (CollectionUtils.isEmpty(config.getSiteIds())) {
            sitesCheck = true;
        } else {
            if (config.getSiteIds().contains(site.getId())) {
                sitesCheck = true;
            }
        }

        // parentsCheck
        boolean parentsCheck;
        if (CollectionUtils.isEmpty(config.getParentSiteIds())) {
            parentsCheck = true;
        } else {
            Set<String> intersection = config
                .getParentSiteIds()
                .stream()
                .distinct()
                .filter(psId -> site.getAncestorIds().contains(psId))
                .collect(Collectors.toSet());
            parentsCheck = !CollectionUtils.isEmpty(intersection);
        }

        // childrenTagsOneOfCheck
        boolean childrenTagsOneOfCheck;
        if (CollectionUtils.isEmpty(config.getChildrenTagsOneOf())) {
            childrenTagsOneOfCheck = true;
        } else {
            Set<Tag> intersection = config
                .getChildrenTagsOneOf()
                .stream()
                .distinct()
                .filter(site.getChildrenTags()::contains)
                .collect(Collectors.toSet());
            childrenTagsOneOfCheck = !CollectionUtils.isEmpty(intersection);
        }

        // tags
        boolean tagsCheck = CollectionUtils.isEmpty(config.getTags()) || this.matchAtLeastOneTag(site.getTags(), config.getTags());

        // campaignCheck
        boolean campaignCheck = campaign.getId().equals(config.getCampaignId());

        return (sitesCheck && parentsCheck && campaignCheck && tagsCheck && childrenTagsOneOfCheck);
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

    private void createOrUpdateAttribute(
        AssetKey assetKey,
        Site site,
        Resource resource,
        Resource resource2,
        String configKey,
        Campaign campaign,
        AttributeConfig config,
        @NonNull String orgaId
    ) {
        String attKey = AttributeKeyUtils.buildKey(assetKey, site, resource, resource2, configKey, PERIOD_FRAG, campaign.getId());
        Attribute attribute = attributeService.findByIdAndOrgaId(attKey, orgaId).orElse(null);
        if (attribute == null) {
            attribute =
                Attribute
                    .builder()
                    .orgaId(orgaId)
                    .assetKey(assetKey)
                    .siteId(AssetKeyUtils.getSite(assetKey, site))
                    .resourceId(AssetKeyUtils.getResource(assetKey, resource))
                    .resourceId2(AssetKeyUtils.getResource2(assetKey, resource2))
                    .id(attKey)
                    .impacterIds(config.getIsWritable() ? null : new HashSet<>())
                    .build();
        } else {
            attribute.setHasConfigError(false);
            attribute.setConfigError(null);
        }
        //        fetchImpactersForConfigAndApplyToAttribute(config, attribute, orgaId);
        //        addImpacters(attribute, config, site, campaign, orgaId);
        attribute.setDirty(!config.getIsWritable());
        attribute.setConfigId(config.getId());
        attribute.setCampaignId(campaign.getId());
        if (config.getIsConsolidable()) {
            attribute.setIsAgg(true);
            attribute.setAggInfo(attribute.getAggInfo() != null ? attribute.getAggInfo() : AggInfo.builder().build());
        }
        attribute.setTags(site.getTags());
        attributeService.save(attribute);
    }

    private void addImpacters(Attribute attribute, AttributeConfig config, Site site, Campaign campaign, @NonNull String orgaId) {
        //        Set<String> impacters = new HashSet<>();
        //        if (config.getIsConsolidable()) {
        //            impacters.addAll(
        //                site
        //                    .getChildrenIds()
        //                    .stream()
        //                    .map(childId -> AttributeKeyUtils.siteKey(childId, config.getId(), PERIOD_FRAG, campaign.getId()))
        //                    .collect(Collectors.toSet())
        //            );
        //            impacters.add(generateConsolidatedAttKey(site, config.getConsoParameterKey(), PERIOD_FRAG, campaign));
        //        } else {
        //            impacters.addAll(fetchImpactersForConfig(config, attribute.getId(), orgaId));
        //        }
        //        attribute.setImpacterIds(impacters);
        //        fetchImpactersForConfigAndApplyToAttribute(config, attribute, orgaId);
    }

    private String generateConsolidatedAttKey(Site site, String consoParameterKey, String period, Campaign campaign) {
        return AttributeKeyUtils.siteKey(site.getId(), consoParameterKey, period, campaign.getId());
    }

    private boolean matchAtLeastOneTag(Set<Tag> tags1, Set<Tag> tags2) {
        Set<String> tags2String = tags2.stream().map(Tag::getId).collect(Collectors.toSet());
        return tags1 != null && tags2 != null && tags1.stream().anyMatch(t -> tags2String.contains(t.getId()));
    }

    public Set<String> reCalculateAllAttributes(String orgaId) {
        Set<String> all = new HashSet<>();
        attributeService
            .findAllAttributes(orgaId)
            .stream()
            .forEach(att -> {
                all.add(att.getId());
                //                all.addAll(att.getImpacterIds());
            });
        return this.reCalculateSomeAttributes(all, orgaId);
    }

    public Set<String> reCalculateSomeAttributes(Set<String> attributeIds, String orgaId) {
        log.info("-------------------------------------");
        log.info("ReCalculating for : " + attributeIds);
        log.info("-------------------------------------");

        //        Set<Attribute> attributes = attributeIds
        //            .stream()
        //            .map(attId -> attributeService.findByIdAndOrgaId(attId, orgaId).orElse(null))
        //            .collect(Collectors.toSet());

        //        dirtierService.dirtyTrees(attributes, orgaId);

        Set<String> impacteds = new HashSet();
        calculateImpactsFor(attributeIds, orgaId, impacteds);

        return impacteds;
    }

    private void calculateImpactsFor(Set<String> attributeIds, String orgaId, Set<String> impacteds) {
        if (attributeIds.isEmpty()) {
            return;
        }
        AtomicBoolean shouldBeProcessed = new AtomicBoolean(true);
        //        while (shouldBeProcessed.get()) {
        shouldBeProcessed.set(false);
        attributeService
            .getAttributesFromKeys(attributeIds, orgaId)
            .stream()
            .forEach(attribute -> {
                log.info("---start Processing for : " + attribute.getId());
                process(attribute, orgaId, shouldBeProcessed, false, new ArrayList<>(), impacteds);
            });
        //        }
    }

    private void process(
        Attribute attribute,
        String orgaId,
        AtomicBoolean shouldBeProcessed,
        boolean forced,
        List<String> currentPath,
        Set<String> impactedIds
    ) {
        log.info("Processing for : " + attribute.getId() + " dirty=" + attribute.getDirty() + " forced=" + forced + " " + currentPath);
        //        if (currentPath.contains(attribute.getId())) {
        //            handleInfiniteLoop(currentPath, orgaId, shouldBeProcessed);
        //            return;
        //        }
        currentPath.add(attribute.getId());
        if (!attribute.getDirty() && !forced) {
            handleImpacteds(attribute.getId(), orgaId, shouldBeProcessed, impactedIds);
            return;
        }
        AttributeConfig config = attributeConfigService.findByOrgaIdAndId(attribute.getConfigId(), orgaId).orElse(null);
        if (!config.getIsWritable()) {
            boolean isStartOrInError = true;
            while (isStartOrInError) {
                try {
                    AttributeValue existingValue = attribute.getAttributeValue();
                    AggInfo existingAggInfo = attribute.getAggInfo();
                    CalculationResult v = calculatorService.calculateAttribute(orgaId, attribute, attribute.getImpacterIds(), config);
                    if (hasChanged(existingValue, v.getResultValue(), existingAggInfo, v.getAggInfo())) {
                        impactedIds.add(attribute.getId());
                    }
                    attribute.setAttributeValue(v.getResultValue());
                    attribute.setAggInfo(v.getAggInfo());
                    attribute.setDirty(false);
                    attribute.setImpacterIds(v.getImpacterIds());
                    attributeService.save(attribute);
                    log.info("Good processing of notWritable " + attribute.getId());
                    isStartOrInError = false;
                    currentPath.remove(currentPath.size() - 1);
                } catch (IsDirtyValueException e) {
                    Attribute att = e.getDirtyAttribute();
                    isStartOrInError = true;
                    log.info("IsDirtyValueException : " + att.getId());
                    //                    currentPath.remove(currentPath.size() - 1);
                    if (currentPath.contains(att.getId())) {
                        handleInfiniteLoop(currentPath, orgaId, shouldBeProcessed, impactedIds);
                        return;
                    }

                    process(att, orgaId, shouldBeProcessed, true, currentPath, impactedIds);
                    shouldBeProcessed.set(true);
                }
                handleImpacteds(attribute.getId(), orgaId, shouldBeProcessed, impactedIds);
            }
        } else {
            log.info("Cleaning writable " + attribute.getId());
            attribute.setDirty(false);
            attributeService.save(attribute);
            currentPath.remove(currentPath.size() - 1);
            handleImpacteds(attribute.getId(), orgaId, shouldBeProcessed, impactedIds);
        }
    }

    private boolean hasChanged(AttributeValue existingValue, AttributeValue newValue, AggInfo existingAggInfo, AggInfo newAggInfo) {
        return hasValueChanged(existingValue, newValue) || hasAggInfoChanged(existingAggInfo, newAggInfo);
    }

    private boolean hasAggInfoChanged(AggInfo existingAggInfo, AggInfo newAggInfo) {
        if (existingAggInfo == null) {
            return newAggInfo != null;
        }
        if (newAggInfo == null) {
            return true;
        }
        return !existingAggInfo.equals(newAggInfo);
    }

    private boolean hasValueChanged(AttributeValue existingValue, AttributeValue newValue) {
        if (existingValue == null) {
            return newValue != null;
        }
        if (newValue == null) {
            return true;
        }
        return !existingValue.equals(newValue);
    }

    private void handleInfiniteLoop(
        List<String> infiniteLoopPath,
        String orgaId,
        AtomicBoolean shouldBeProcessed,
        Set<String> impactedIds
    ) {
        attributeService
            .getAttributesFromKeys(infiniteLoopPath.stream().collect(Collectors.toSet()), orgaId)
            .stream()
            .forEach(attribute -> {
                log.info("handleInfiniteLoop for : " + attribute.getId());
                attribute.setAttributeValue(ErrorValue.builder().value("Infinite loop " + infiniteLoopPath).build());
                attribute.setDirty(false);
                attributeService.save(attribute);
                handleImpacteds(attribute.getId(), orgaId, shouldBeProcessed, impactedIds);
            });
    }

    private void handleImpacteds(String attId, String orgaId, AtomicBoolean shouldBeProcessed, Set<String> impactedIds) {
        Set<Attribute> impacteds = attributeService.findImpacted(attId, orgaId);

        impacteds.forEach(impacted -> process(impacted, orgaId, shouldBeProcessed, true, new ArrayList<>(), impactedIds));
    }

    //    private void calculateImpacts(List<Attribute> attributes, String orgaId) {
    //        attributes
    //            .stream()
    //            .forEach(attribute -> {
    //                if (attribute.getHasConfigError()) {
    //                    attribute.setAttributeValue(ErrorValue.builder().value(attribute.getConfigError()).build());
    //                    return;
    //                }
    //                AttributeConfig config = attributeConfigService.findByOrgaIdAndId(attribute.getConfigId(), orgaId).orElse(null);
    //                if (config == null) {
    //                    attribute.setAttributeValue(
    //                        ErrorValue
    //                            .builder()
    //                            .value("Attribute is referencing a config that can't be found : " + attribute.getConfigId())
    //                            .build()
    //                    );
    //                    return;
    //                }
    //                if (config.getIsWritable()) {
    //                    return;
    //                }
    //                if (config.getOperation() == null) {
    //                    log.info("jhh");
    //                }
    //                Pair<AttributeValue, AggInfo> v = calculatorService.calculateAttribute(
    //                    orgaId,
    //                    attribute.getId(),
    //                    attribute.getTags(),
    //                    attribute.getImpacterIds(),
    //                    config
    //                );
    //                attribute.setAttributeValue(v.getLeft());
    //                attribute.setAggInfo(v.getRight());
    //                attributeService.save(attribute);
    //            });
    //    }

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
        if (config.getOperationType().equals(CHILDREN_SUM_BY_KEY)) {
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

    //    public void fetchImpactersForConfigAndApplyToAttribute(AttributeConfig config, Attribute attribute, String orgaId) {
    //        FetchImpactResult result = fetchImpactersForConfig(config, attribute, orgaId);
    //        attribute.setDirty(result.getIsDirty());
    //        attribute.setHasDynamicImpacters(result.getHasDynamicImpacters());
    //        attribute.setImpacterIds(result.getImpacters());
    //    }

    public FetchImpactResult fetchImpactersForConfig(AttributeConfig config, Attribute attribute, String orgaId) {
        if (config.getOperation() instanceof WithDynamicImpactors) {
            attribute.setImpacterIds(new HashSet<>());
            //            attribute.setHasDynamicImpacters(true);
            return FetchImpactResult.builder().isDirty(true).hasDynamicImpacters(true).impacters(new HashSet<>()).build();
        }

        return FetchImpactResult
            .builder()
            .isDirty(true)
            .hasDynamicImpacters(false)
            .impacters(fetchImpactersForConfig(config, attribute.getId(), orgaId))
            .build();
    }

    public Set<String> fetchImpactersForConfig(AttributeConfig config, String impacted, @NonNull String orgaId) {
        Set<String> impacters = new HashSet<>();
        if (config.getOperation() != null) {
            fetchImpactersForOperation(config.getOperation(), impacted, impacters, orgaId);
        }
        return impacters;
    }

    private void fetchImpactersForOperation(Operation operation, String impacted, Set<String> impacters, @NonNull String orgaId) {
        AttributeKeyAsObj attributeKeyAsObj = fromString(impacted);

        if (
            CHILDREN_SUM_BY_KEY.equals(operation.getOperationType()) ||
            CHILDREN_PRODUCT_BY_KEY.equals(operation.getOperationType()) ||
            CHILDREN_AVG_BY_KEY.equals(operation.getOperationType()) ||
            CHILDREN_COUNT_BY_COUNT.equals(operation.getOperationType())
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
            IF_THEN_ELSE.equals(operation.getOperationType())
        ) {
            // Dynamic impacters, will be computed at calculation
        } else if (REF.equals(operation.getOperationType())) {
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
        return of(reCalculateSomeAttributes(attIds, orgaId).stream().collect(Collectors.toList()));
    }
}
