package com.sm.service;

import static com.sm.service.AttributeKeyUtils.generatePartial;
import static com.sm.service.dto.filter.ColumnType.ATTRIBUTE;

import com.sm.domain.Resource;
import com.sm.domain.ResourceWithValues;
import com.sm.domain.Tag;
import com.sm.domain.enumeration.AssetType;
import com.sm.repository.ResourceRepository;
import com.sm.service.dto.ResourceDTO;
import com.sm.service.dto.ResourceWithValuesDTO;
import com.sm.service.dto.filter.*;
import com.sm.service.mapper.ResourceMapper;
import java.util.*;
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
 * Service Implementation for managing {@link Resource}.
 */
@Service
public class ResourceService {

    private final Logger log = LoggerFactory.getLogger(ResourceService.class);

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;
    private final MongoTemplate mongoTemplate;

    public ResourceService(ResourceRepository resourceRepository, ResourceMapper resourceMapper, MongoTemplate mongoTemplate) {
        this.resourceRepository = resourceRepository;
        this.resourceMapper = resourceMapper;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Save a resource.
     *
     * @param resourceDTO the entity to save.
     * @return the persisted entity.
     */

    public Resource saveWithAttributes(ResourceDTO rDTO, String orgaId) {
        log.debug("Request to save Resource : {}", rDTO);
        Resource r = resourceMapper.toEntity(rDTO);
        r = r.toBuilder().orgaId(orgaId).build();
        if (r.getParentId() != null) {
            r = resourceRepository.save(r);
            List<Resource> parents = resourceRepository.findByIdAndOrgaId(r.getParentId(), orgaId);
            if (!parents.get(0).getChildrenIds().contains(r.getId())) {
                parents.get(0).getChildrenIds().add(r.getId());
                resourceRepository.save(parents.get(0));
            }
        } else {
            r = resourceRepository.save(r);
        }
        return r;
    }

    public ResourceDTO save(ResourceDTO resourceDTO) {
        log.debug("Request to save Resource : {}", resourceDTO);
        Resource resource = resourceMapper.toEntity(resourceDTO);
        resource = resourceRepository.save(resource);
        return resourceMapper.toDto(resource);
    }

    public Resource save(Resource resource, String orgaId) {
        if (resource.getObjectId() == null) {
            resource.setChildrenTags(resource.getTags());
        } else {
            List<Resource> allChildren = new ArrayList<>();
            getAllChildren(resource, orgaId, allChildren);
            resource.setChildrenTags(allChildren.stream().flatMap(s -> s.getChildrenTags().stream()).collect(Collectors.toSet()));
        }
        Resource saved = resourceRepository.save(resource);
        saved.setAncestorIds(calculateAncestors(orgaId, saved, new ArrayList<>()));
        saved = resourceRepository.save(saved);
        handleParent(saved, orgaId);
        return saved;
    }

    private void handleParent(Resource saved, String orgaId) {
        if (saved.getParentId() != null) {
            Resource parent = resourceRepository.findByIdAndOrgaId(saved.getParentId(), orgaId).get(0);
            Set<Tag> tags = new HashSet<>(saved.getChildrenTags());
            tags.addAll(parent.getTags());
            parent.setChildrenTags(tags);
            List<String> newChildren = parent.getChildrenIds();
            if (!newChildren.contains(saved.getId())) {
                newChildren.add(saved.getId());
                parent.setChildrenIds(newChildren);
            }
            parent = resourceRepository.save(parent);
            handleParent(parent, orgaId);
        }
    }

    private void getAllChildren(Resource resource, String orgaId, List<Resource> children) {
        children.add(resource);
        resourceRepository.findByOrgaIdAndParentId(orgaId, resource.getId()).forEach(child -> getAllChildren(child, orgaId, children));
    }

    private List<String> calculateAncestors(String orgaId, Resource resource, ArrayList<String> ancestorIds) {
        ancestorIds.add(resource.getId());
        if (resource.getParentId() == null) {
            return ancestorIds;
        }
        Resource parent = resourceRepository.findByIdAndOrgaId(resource.getParentId(), orgaId).get(0);
        return calculateAncestors(orgaId, parent, ancestorIds);
    }

    /**
     * Update a resource.
     *
     * @param resourceDTO the entity to save.
     * @return the persisted entity.
     */
    public Resource update(ResourceDTO resourceDTO, String orgaId) {
        log.debug("Request to update Resource : {}", resourceDTO);
        Resource resource = resourceMapper.toEntity(resourceDTO);
        Optional<Resource> existing = resourceRepository.findByResourceId(resourceDTO.getId());
        resource.setObjectId(existing.get().getObjectId());
        return resourceRepository.save(resource);
    }

    public ResourceWithValuesDTO getResourceWithAttributes(String id, String orgaId, List<ColumnDefinitionDTO> columnDefinitions) {
        Page<ResourceWithValuesDTO> page = search(
            ResourceSearchDTO
                .builder()
                .page(0l)
                .size(1l)
                .columnDefinitions(columnDefinitions)
                .filter(
                    PropertyFilterDTO
                        .builder()
                        .filterRule(TextEqualsFilterRuleDTO.builder().filterRuleType(FilterRuleType.TEXT_EQUALS).terms(id).build())
                        .property(ResourcePropertyFilterTargetDTO.builder().property("id").build())
                        .build()
                )
                .build(),
            orgaId
        );
        return page.getContent().get(0);
    }

    public Page<ResourceWithValuesDTO> search(ResourceSearchDTO search, String orgaId) {
        AggregationOperation lookupAgg = generateLookup(search, orgaId);
        AggregationOperation addFieldsAgg = generateAddFields(search, orgaId);
        AggregationOperation searchAgg = generateSearchMatch(search, orgaId);
        AggregationOperation skipAgg = Aggregation.stage(new Document("$skip", search.getPage() * search.getSize()).toJson());
        AggregationOperation limitAgg = Aggregation.stage(new Document("$limit", search.getSize()).toJson());

        AggregationOperation countSkipAgg = Aggregation.stage(new Document("$skip", 0).toJson());
        AggregationOperation countLimitAgg = Aggregation.stage(new Document("$limit", 1).toJson());
        AggregationOperation countAgg = Aggregation.stage(new Document("$count", "count").toJson());

        Aggregation agg1 = null;
        Aggregation agg2 = null;
        if (searchAgg != null) {
            agg1 = Aggregation.newAggregation(lookupAgg, addFieldsAgg, searchAgg, countAgg);
            agg2 = Aggregation.newAggregation(lookupAgg, addFieldsAgg, searchAgg, skipAgg, limitAgg);
        } else {
            agg1 = Aggregation.newAggregation(lookupAgg, addFieldsAgg, countAgg);
            agg2 = Aggregation.newAggregation(lookupAgg, addFieldsAgg, skipAgg, limitAgg);
        }
        AggregationResults<Document> countOutput = mongoTemplate.aggregate(agg1, "resource", Document.class);

        Integer count = countOutput.getMappedResults().size() > 0 ? countOutput.getMappedResults().get(0).getInteger("count") : 0;
        AggregationResults<ResourceWithValues> output = mongoTemplate.aggregate(agg2, "resource", ResourceWithValues.class);

        /*
        Bson doc = null;
        List<Document> result = mongoTemplate.getConverter().getConversionService().convert(output.getMappedResults(), List.class);
*/

        //        List<SiteWithValues> result = output.getMappedResults();

        //        return new PageImpl(output.getMappedResults().stream().collect(Collectors.toList()));
        return new PageImpl(
            output.getMappedResults().stream().map(resourceMapper::toDtoWithValues).collect(Collectors.toList()),
            Pageable.unpaged(),
            count
        );
    }

    private AggregationOperation generateSearchMatch(ResourceSearchDTO search, String orgaId) {
        final Document matchCrit = generateSearch(search.getFilter());
        if (matchCrit != null) {
            Document match = new Document("$match", matchCrit);
            return Aggregation.stage(match.toJson());
        }
        return null;
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
                .append("let", new Document("theResourceId", "$id"))
                .append("pipeline", Arrays.asList(new Document("$match", new Document("$expr", new Document("$or", lookupCrits)))))
                .append("as", "attributeValues")
        );

        return Aggregation.stage(lookup.toJson());
    }

    private Document generateSearch(ResourceFilterDTO filter) {
        if (filter instanceof AndFilterDTO) {
            List<Document> children = new ArrayList<>();
            if (((AndFilterDTO) filter).getItems() == null || ((AndFilterDTO) filter).getItems().size() == 0) {
                return null;
            }
            ((AndFilterDTO) filter).getItems().stream().forEach(item -> children.add(generateSearch(item)));
            return new Document("$and", children);
        } else if (filter instanceof OrFilterDTO) {
            List<Document> children = new ArrayList<>();
            if (((OrFilterDTO) filter).getItems() == null || ((OrFilterDTO) filter).getItems().size() == 0) {
                return null;
            }
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
                new Document("$eq", List.of("$resourceId", "$$theResourceId")),
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

    /**
     * Partially update a resource.
     *
     * @param resourceDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ResourceDTO> partialUpdate(ResourceDTO resourceDTO) {
        log.debug("Request to partially update Resource : {}", resourceDTO);

        return resourceRepository
            .findByResourceId(resourceDTO.getId())
            .map(existingResource -> {
                resourceMapper.partialUpdate(existingResource, resourceDTO);

                return existingResource;
            })
            .map(resourceRepository::save)
            .map(resourceMapper::toDto);
    }

    /**
     * Get all the resources.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<ResourceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Resources");
        return resourceRepository.findAll(pageable).map(resourceMapper::toDto);
    }

    public Page<ResourceDTO> findAllByType(String type, Pageable pageable) {
        log.debug("Request to get all Resources by type");
        return resourceRepository.findResourcesByType(type, pageable).map(resourceMapper::toDto);
    }

    public Optional<ResourceDTO> findById(String id) {
        log.debug("Request to get Resource : {}", id);
        return resourceRepository.findByResourceId(id).map(resourceMapper::toDto);
    }

    /**
     * Delete the resource by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Resource : {}", id);
        Optional<Resource> existing = resourceRepository.findByResourceId(id);
        resourceRepository.deleteByResourceId(existing.get().getId());
    }

    public List<Resource> findAllRootResources(String orgaId) {
        return resourceRepository.findByOrgaIdAndParentId(orgaId, null);
    }

    public List<Resource> getChildren(Resource resource, String orgaId) {
        return resource
            .getChildrenIds()
            .stream()
            .map(id -> this.getResourceById(id, orgaId).orElseThrow(() -> new RuntimeException("Children resource not found!")))
            .collect(Collectors.toList());
    }

    private Optional<Resource> getResourceById(String id, String orgaId) {
        List<Resource> r = resourceRepository.findByIdAndOrgaId(id, orgaId);
        if (r.size() > 1) {
            throw new RuntimeException("pb 12345");
        }
        if (r.size() == 0) {
            return null;
        }
        return Optional.of(r.get(0));
    }

    public void deleteAll(AssetType assetType) {}

    public void deleteAllByType(String type) {
        resourceRepository.deleteByType(type);
    }

    public List<Resource> findAllRoots(String orgaId) {
        return resourceRepository.findByOrgaIdAndParentId(orgaId, null);
    }
}
