package com.sm.service;

import static com.sm.service.AttributeKeyUtils.generatePartial;
import static com.sm.service.dto.filter.ColumnType.ATTRIBUTE;

import com.sm.domain.Site;
import com.sm.domain.SiteWithValues;
import com.sm.repository.SiteRepository;
import com.sm.service.dto.SiteDTO;
import com.sm.service.dto.SiteWithValuesDTO;
import com.sm.service.dto.filter.*;
import com.sm.service.mapper.SiteMapper;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Site}.
 */
@Service
public class SiteService {

    private final Logger log = LoggerFactory.getLogger(SiteService.class);

    private final MongoTemplate mongoTemplate;
    private final SiteRepository siteRepository;
    private final SiteMapper siteMapper;

    public SiteService(MongoTemplate mongoTemplate, SiteRepository siteRepository, SiteMapper siteMapper) {
        this.siteRepository = siteRepository;
        this.siteMapper = siteMapper;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Save a site.
     *
     * @param siteDTO the entity to save.
     * @return the persisted entity.
     */
    public SiteDTO save(SiteDTO siteDTO) {
        log.debug("Request to save Site : {}", siteDTO);
        Site site = siteMapper.toEntity(siteDTO);
        site = siteRepository.save(site);
        return siteMapper.toDto(site);
    }

    /**
     * Update a site.
     *
     * @param siteDTO the entity to save.
     * @return the persisted entity.
     */
    public SiteDTO update(SiteDTO siteDTO) {
        log.debug("Request to update Site : {}", siteDTO);
        Site site = siteMapper.toEntity(siteDTO);
        Optional<Site> existing = siteRepository.findBySiteId(siteDTO.getId());
        site.setObjectId(existing.get().getObjectId());
        site = siteRepository.save(site);
        return siteMapper.toDto(site);
    }

    /**
     * Partially update a site.
     *
     * @param siteDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SiteDTO> partialUpdate(SiteDTO siteDTO) {
        log.debug("Request to partially update Site : {}", siteDTO);

        return siteRepository
            .findBySiteId(siteDTO.getId())
            .map(existingSite -> {
                siteMapper.partialUpdate(existingSite, siteDTO);

                return existingSite;
            })
            .map(siteRepository::save)
            .map(siteMapper::toDto);
    }

    /**
     * Get all the sites.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<SiteDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Sites");
        return siteRepository.findAll(pageable).map(siteMapper::toDto);
    }

    public Page<SiteDTO> findAllByType(String type, Pageable pageable) {
        log.debug("Request to get all Sites by type");
        return siteRepository.findSitesByType(type, pageable).map(siteMapper::toDto);
    }

    public Optional<SiteDTO> findById(String id) {
        log.debug("Request to get Site : {}", id);
        return siteRepository.findBySiteId(id).map(siteMapper::toDto);
    }

    /**
     * Delete the site by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Site : {}", id);
        Optional<Site> existing = siteRepository.findBySiteId(id);
        siteRepository.deleteBySiteId(existing.get().getId());
    }

    public List<Site> findAllRootSites(String orgaId) {
        return siteRepository.findByOrgaIdAndParentId(orgaId, null);
    }

    public List<Site> getChildren(Site site, String orgaId) {
        return site
            .getChildrenIds()
            .stream()
            .map(id -> this.getSiteById(id, orgaId).orElseThrow(() -> new RuntimeException("Children site not found!")))
            .collect(Collectors.toList());
    }

    public Optional<Site> getSiteById(String id, String orgaId) {
        List<Site> r = siteRepository.findByIdAndOrgaId(id, orgaId);
        if (r.size() > 1) {
            throw new RuntimeException("pb 12345");
        }
        if (r.size() == 0) {
            return null;
        }
        return Optional.of(r.get(0));
    }

    public List<Site> findAllSites(String orgaId) {
        return siteRepository.findAll();
    }

    public Page<SiteWithValuesDTO> search(ResourceSearchDTO search, String orgaId) {
        AggregationOperation lookupAgg = generateLookup(search, orgaId);
        AggregationOperation addFieldsAgg = generateAddFields(search, orgaId);
        AggregationOperation searchAgg = generateSearchMatch(search, orgaId);
        AggregationOperation skipAgg = Aggregation.stage(new Document("$skip", search.getPage() * search.getSize()).toJson());
        AggregationOperation limitAgg = Aggregation.stage(new Document("$limit", search.getSize()).toJson());

        AggregationOperation countSkipAgg = Aggregation.stage(new Document("$skip", 0).toJson());
        AggregationOperation countLimitAgg = Aggregation.stage(new Document("$limit", 1).toJson());
        AggregationOperation countAgg = Aggregation.stage(new Document("$count", "count").toJson());

        AggregationResults<Document> countOutput = mongoTemplate.aggregate(
            Aggregation.newAggregation(lookupAgg, addFieldsAgg, searchAgg, countAgg),
            "site",
            Document.class
        );

        Integer count = countOutput.getMappedResults().get(0).getInteger("count");
        AggregationResults<SiteWithValues> output = mongoTemplate.aggregate(
            Aggregation.newAggregation(lookupAgg, addFieldsAgg, searchAgg, skipAgg, limitAgg),
            "site",
            SiteWithValues.class
        );

        /*
        Bson doc = null;
        List<Document> result = mongoTemplate.getConverter().getConversionService().convert(output.getMappedResults(), List.class);
*/

        //        List<SiteWithValues> result = output.getMappedResults();

        //        return new PageImpl(output.getMappedResults().stream().collect(Collectors.toList()));
        return new PageImpl(
            output.getMappedResults().stream().map(siteMapper::toDtoWithValues).collect(Collectors.toList()),
            Pageable.unpaged(),
            count
        );
    }

    private AggregationOperation generateSearchMatch(ResourceSearchDTO search, String orgaId) {
        Document match = new Document("$match", generateSearch(search.getFilter()));
        return Aggregation.stage(match.toJson());
    }

    private AggregationOperation generateAddFields(ResourceSearchDTO search, String orgaId) {
        Document addFields = new Document(
            "$addFields",
            new Document(
                "attributeValues",
                new Document(
                    "$arrayToObject",
                    new Document(
                        "$map",
                        new Document("input", "$attributeValues")
                            .append("as", "item")
                            .append("in", new Document("k", AttributeKeyUtils.generatePartialId()).append("v", "$$item.attributeValue"))
                    )
                )
            )
        );
        return Aggregation.stage(addFields.toJson());
    }

    private AggregationOperation generateLookup(ResourceSearchDTO search, String orgaId) {
        List<ColumnDefinitionDTO> cols = search.getColumnDefinitions();
        ResourceFilterDTO filter = search.getFilter();

        List<AttributePropertyFilterTargetDTO> targets = new ArrayList<>();

        extractAttributeIds(filter, targets);

        List<Document> lookupCrits = cols
            .stream()
            .filter(col -> ATTRIBUTE.equals(col.getColumnType()))
            .map(col -> ((AttributeColumnDTO) col))
            .map(attCol -> generateDocument(attCol.getAttributeConfigId(), attCol.getCampaignId(), orgaId))
            .collect(Collectors.toList());

        lookupCrits.addAll(
            targets
                .stream()
                .map(target -> generateDocument(target.getAttributeConfigId(), target.getCampaignId(), orgaId))
                .collect(Collectors.toList())
        );

        Document lookup = new Document(
            "$lookup",
            new Document("from", "attribute")
                .append("let", new Document("theSiteId", "$id"))
                .append("pipeline", Arrays.asList(new Document("$match", new Document("$expr", new Document("$or", lookupCrits)))))
                .append("as", "attributeValues")
        );

        return Aggregation.stage(lookup.toJson());
    }

    private Aggregation getPipelinesssssss(ResourceSearchDTO search, String orgaId) {
        List<ColumnDefinitionDTO> cols = search.getColumnDefinitions();
        ResourceFilterDTO filter = search.getFilter();

        List<AttributePropertyFilterTargetDTO> targets = new ArrayList<>();

        extractAttributeIds(filter, targets);

        List<Document> lookupCrits = cols
            .stream()
            .filter(col -> ATTRIBUTE.equals(col.getColumnType()))
            .map(col -> ((AttributeColumnDTO) col))
            .map(attCol -> generateDocument(attCol.getAttributeConfigId(), attCol.getCampaignId(), orgaId))
            .collect(Collectors.toList());

        lookupCrits.addAll(
            targets
                .stream()
                .map(target -> generateDocument(target.getAttributeConfigId(), target.getCampaignId(), orgaId))
                .collect(Collectors.toList())
        );

        Document lookup = new Document(
            "$lookup",
            new Document("from", "attribute")
                .append("let", new Document("theSiteId", "$id"))
                .append("pipeline", Arrays.asList(new Document("$match", new Document("$expr", new Document("$or", lookupCrits)))))
                .append("as", "attributeValues")
        );

        Document addFields = new Document(
            "$addFields",
            new Document(
                "attributeValues",
                new Document(
                    "$arrayToObject",
                    new Document(
                        "$map",
                        new Document("input", "$attributeValues")
                            .append("as", "item")
                            .append("in", new Document("k", AttributeKeyUtils.generatePartialId()).append("v", "$$item.attributeValue"))
                    )
                )
            )
        );

        Document searchMatchCrit = new Document("$match", generateSearch(filter));

        Document skip = new Document("$skip", search.getPage() * search.getSize());

        Document limit = new Document("$limit", search.getSize());

        AggregationOperation lookupAgg = Aggregation.stage(lookup.toJson());
        AggregationOperation addFieldsAgg = Aggregation.stage(addFields.toJson());
        AggregationOperation searchAgg = Aggregation.stage(searchMatchCrit.toJson());
        AggregationOperation skipAgg = Aggregation.stage(skip.toJson());
        AggregationOperation limitAgg = Aggregation.stage(limit.toJson());
        //        MatchOperation matchStage = Aggregation.match(new Criteria("name").is("Site S1"));
        return Aggregation.newAggregation(lookupAgg, addFieldsAgg, searchAgg, skipAgg, limitAgg);
    }

    private Document generateSearch(ResourceFilterDTO filter) {
        if (filter instanceof AndFilterDTO) {
            List<Document> children = new ArrayList<>();
            ((AndFilterDTO) filter).getItems().stream().forEach(item -> children.add(generateSearch(item)));
            return new Document("$and", children);
        } else if (filter instanceof OrFilterDTO) {
            List<Document> children = new ArrayList<>();
            ((OrFilterDTO) filter).getItems().stream().forEach(item -> children.add(generateSearch(item)));
            return new Document("$or", children);
        } else if (filter instanceof PropertyFilterDTO) {
            PropertyFilterDTO pf = ((PropertyFilterDTO) filter);
            if (pf.getProperty() instanceof AttributePropertyFilterTargetDTO) {
                AttributePropertyFilterTargetDTO attPropTarget = (AttributePropertyFilterTargetDTO) pf.getProperty();
                return generateCriteria(
                    "attributeValues." + generatePartial(attPropTarget.getAttributeConfigId(), attPropTarget.getCampaignId()) + ".value",
                    pf.getFilterRule()
                );
            } else if (pf.getProperty() instanceof ResourcePropertyFilterTargetDTO) {
                ResourcePropertyFilterTargetDTO rf = ((ResourcePropertyFilterTargetDTO) pf.getProperty());
                return generateCriteria(rf.getProperty(), pf.getFilterRule());
            }
        }
        throw new RuntimeException("to be implemented...filter..." + filter);
    }

    private Document generateCriteria(String property, FilterRuleDTO filterRule) {
        if (filterRule instanceof TextContainsFilterRuleDTO) {
            TextContainsFilterRuleDTO textContains = (TextContainsFilterRuleDTO) filterRule;
            return new Document(property, new Document("$regex", textContains.getTerms()));
        } else if (filterRule instanceof TextEqualsFilterRuleDTO) {
            TextEqualsFilterRuleDTO textEquals = (TextEqualsFilterRuleDTO) filterRule;
            return new Document(property, new Document("$eq", textEquals.getTerms()));
        } else if (filterRule instanceof NumberGtFilterRuleDTO) {
            NumberGtFilterRuleDTO rule = (NumberGtFilterRuleDTO) filterRule;
            return generateComparatorCriteria("$gt", property, rule.getCompareValue());
        } else if (filterRule instanceof NumberGteFilterRuleDTO) {
            NumberGteFilterRuleDTO rule = (NumberGteFilterRuleDTO) filterRule;
            return generateComparatorCriteria("$gte", property, rule.getCompareValue());
        } else if (filterRule instanceof NumberLtFilterRuleDTO) {
            NumberLtFilterRuleDTO rule = (NumberLtFilterRuleDTO) filterRule;
            return generateComparatorCriteria("$lt", property, rule.getCompareValue());
        } else if (filterRule instanceof NumberLteFilterRuleDTO) {
            NumberLteFilterRuleDTO rule = (NumberLteFilterRuleDTO) filterRule;
            return generateComparatorCriteria("$lte", property, rule.getCompareValue());
        }
        throw new RuntimeException("To be implemented generateCriteria " + filterRule);
    }

    private Document generateComparatorCriteria(String op, String property, Double compareValue) {
        return new Document(property, new Document(op, compareValue));
    }

    private Document generateDocument(String attributeConfigId, String campaignId, String orgaId) {
        return new Document(
            "$and",
            Arrays.asList(
                new Document("$eq", List.of("$orgaId", orgaId)),
                new Document("$eq", List.of("$configId", attributeConfigId)),
                new Document("$eq", List.of("$campaignId", campaignId)),
                new Document("$eq", List.of("$siteId", "$$theSiteId")),
                new Document("$ne", List.of(new Document("$type", "$attributeValue"), "missing"))
            )
        );
    }

    private void extractAttributeIds(ResourceFilterDTO filter, List<AttributePropertyFilterTargetDTO> targets) {
        if (filter instanceof AndFilterDTO) {
            ((AndFilterDTO) filter).getItems().stream().forEach(item -> extractAttributeIds(item, targets));
        } else if (filter instanceof OrFilterDTO) {
            ((OrFilterDTO) filter).getItems().stream().forEach(item -> extractAttributeIds(item, targets));
        } else if (filter instanceof PropertyFilterDTO) {
            PropertyFilterDTO pf = ((PropertyFilterDTO) filter);
            if (pf.getProperty() instanceof AttributePropertyFilterTargetDTO) {
                targets.add((AttributePropertyFilterTargetDTO) pf.getProperty());
            }
        }
    }
}
