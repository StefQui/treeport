package com.sm.service;

import static com.sm.service.AttributeKeyUtils.createReferenced;
import static com.sm.service.AttributeKeyUtils.fromString;
import static com.sm.service.AttributeKeyUtils.objToString;
import static java.lang.String.format;
import static java.util.Optional.empty;
import static java.util.Optional.of;

import com.sm.domain.Site;
import com.sm.domain.attribute.AggInfo;
import com.sm.domain.attribute.Attribute;
import com.sm.domain.operation.RefOperation;
import com.sm.repository.AttributeConfigRepository;
import com.sm.repository.AttributeRepository;
import com.sm.repository.SiteRepository;
import com.sm.service.dto.attribute.AttributeDTO;
import com.sm.service.mapper.AttributeMapper;
import com.sm.service.mapper.AttributeValueMapper;
import java.util.*;
import java.util.stream.Collectors;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Attribute}.
 */
@Service
public class AttributeService {

    private final Logger log = LoggerFactory.getLogger(AttributeService.class);

    private final AttributeRepository attributeRepository;
    private final AttributeConfigRepository attributeConfigRepository;

    private final AttributeMapper attributeMapper;
    private final AttributeValueMapper attributeValueMapper;
    private final SiteRepository siteRepository;

    public AttributeService(
        AttributeRepository attributeRepository,
        AttributeConfigRepository attributeConfigRepository,
        SiteRepository siteRepository,
        AttributeMapper attributeMapper,
        AttributeValueMapper attributeValueMapper
    ) {
        this.attributeRepository = attributeRepository;
        this.attributeConfigRepository = attributeConfigRepository;
        this.siteRepository = siteRepository;
        this.attributeMapper = attributeMapper;
        this.attributeValueMapper = attributeValueMapper;
    }

    /**
     * Save a attribute.
     *
     * @param attributeDTO the entity to save.
     * @return the persisted entity.
     */
    public AttributeDTO saveDto(AttributeDTO attributeDTO) {
        log.debug("Request to save Attribute : {}", attributeDTO);
        Attribute attribute = attributeMapper.toEntity(attributeDTO);
        attribute = attributeRepository.save(attribute);
        return attributeMapper.toDto(attribute);
    }

    /**
     * Update a attribute.
     *
     * @param attributeDTO the entity to save.
     * @return the persisted entity.
     */
    public AttributeDTO update(AttributeDTO attributeDTO) {
        log.debug("Request to update Attribute : {}", attributeDTO);
        Attribute attribute = attributeMapper.toEntity(attributeDTO);
        Optional<Attribute> existing = attributeRepository.findByAttributeId(attributeDTO.getId());
        attribute.setObjectId(existing.get().getObjectId());
        attribute = attributeRepository.save(attribute);
        return attributeMapper.toDto(attribute);
    }

    /**
     * Partially update a attribute.
     *
     * @param attributeDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<AttributeDTO> partialUpdate(AttributeDTO attributeDTO) {
        log.debug("Request to partially update Attribute : {}", attributeDTO);

        return attributeRepository
            .findById(attributeDTO.getId())
            .map(existingAttribute -> {
                attributeMapper.partialUpdate(existingAttribute, attributeDTO);

                return existingAttribute;
            })
            .map(attributeRepository::save)
            .map(attributeMapper::toDto);
    }

    /**
     * Get all the attributes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<AttributeDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Attributes");
        return attributeRepository.findAll(pageable).map(attributeMapper::toDto);
    }

    /**
     * Get all the attributes with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<AttributeDTO> findAllWithEagerRelationships(Pageable pageable) {
        return attributeRepository.findAllWithEagerRelationships(pageable).map(attributeMapper::toDto);
    }

    /**
     * Get one attribute by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<AttributeDTO> findById(String id) {
        log.debug("Request to get Attribute : {}", id);
        return attributeRepository.findByAttributeId(id).map(attributeMapper::toDto);
    }

    /**
     * Delete the attribute by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Attribute : {}", id);
        Optional<Attribute> existing = attributeRepository.findByAttributeId(id);
        attributeRepository.deleteByAttributeId(existing.get().getId());
    }

    public void deleteAttributesForSite(String siteId, String orgaId) {
        log.debug("Request to deleteAttributesForSite : {}", siteId);
        List<Attribute> atts = attributeRepository.findBySiteIdAndOrgaId(siteId, orgaId);
        atts.forEach(att -> attributeRepository.deleteByAttributeId(att.getId()));
    }

    public void deleteAttributesForSiteAndConfigKey(String siteId, String configKey, String orgaId) {
        log.debug("Request to deleteAttributesForSiteAndConfigKey : {}", siteId);
        List<Attribute> atts = attributeRepository.findBySiteIdAndConfigIdAndOrgaId(siteId, configKey, orgaId);
        atts.forEach(att -> attributeRepository.deleteByAttributeId(att.getId()));
    }

    public void deleteAttributesForResourceAndConfigKey(String resourceId, String configKey, String orgaId) {
        log.debug("Request to deleteAttributesForResourceAndConfigKey : {}", resourceId);
        List<Attribute> atts = attributeRepository.findByResourceIdAndConfigIdAndOrgaId(resourceId, configKey, orgaId);
        atts.forEach(att -> attributeRepository.deleteByAttributeId(att.getId()));
    }

    public List<Attribute> findBySite(String siteId, String orgaId) {
        List<Attribute> atts = findAllAttributes(orgaId);
        return atts.stream().filter(a -> a.getAssetFragment().equals(siteId)).collect(Collectors.toList());
    }

    public List<Attribute> findByResource(String resourceId, String orgaId) {
        List<Attribute> atts = findAllAttributes(orgaId);
        return atts.stream().filter(a -> a.getAssetFragment().equals(resourceId)).collect(Collectors.toList());
    }

    public List<Attribute> findAllAttributes(String orgaId) {
        return attributeRepository.findByOrgaId(orgaId);
    }

    public Optional<Attribute> findByIdAndOrgaId(String id, @NonNull String orgaId) {
        List<Attribute> r = attributeRepository.findByIdAndOrgaId(id, orgaId);
        if (r.size() > 1) {
            throw new RuntimeException("pb 12345");
        }
        if (r.size() == 0) {
            return empty();
        }
        return of(r.get(0));
    }

    public void save(Attribute attribute) {
        attributeRepository.save(attribute);
    }

    public void saveAll(List<Attribute> attributes) {
        attributeRepository.saveAll(attributes);
    }

    public Set<Attribute> findImpacted(String attKey, @NonNull String orgaId) {
        List<Attribute> atts = findAllAttributes(orgaId);
        return atts.stream().filter(a -> a.getImpacterIds() != null && a.getImpacterIds().contains(attKey)).collect(Collectors.toSet());
    }

    public List<Attribute> getAttributesFromKeys(Set<String> keys, @NonNull String orgaId) {
        return keys
            .stream()
            .map(impacterId -> findByIdAndOrgaId(impacterId, orgaId))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
    }

    public Optional<Map<String, AttributeDTO>> fetchFieldAttributes(String orgaId, Map<String, String> fieldsAttributeIdsMap) {
        Map<String, AttributeDTO> result = new HashMap<>();
        fieldsAttributeIdsMap
            .keySet()
            .stream()
            .forEach(fieldId -> {
                Optional<Attribute> att = findByIdAndOrgaId(fieldsAttributeIdsMap.get(fieldId), orgaId);

                if (att.isEmpty()) {
                    result.put(fieldId, null);
                } else {
                    result.put(
                        fieldId,
                        attributeMapper.toDtoWithConfig(
                            att.get(),
                            attributeConfigRepository.findAllByOrgaIdAndId(orgaId, att.get().getConfigId()).get()
                        )
                    );
                }
            });
        return of(result);
    }

    public List<Attribute> findDirties(Boolean dirty, String orgaId) {
        return attributeRepository.findByDirtyAndOrgaId(dirty, orgaId);
    }

    public List<Attribute> getAttributesForSiteChildrenAndConfig(String attId, String configKey, String orgaId) {
        AttributeKeyAsObj attIdAsObj = fromString(attId);
        List<Site> sites = siteRepository.findByIdAndOrgaId(attIdAsObj.getAssetId(), orgaId);
        if (sites.isEmpty()) {
            throw new RuntimeException(format("cannot find site %s %s %s", attId, configKey, orgaId));
        }
        Site site = sites.get(0);
        List<String> keys = site
            .getChildrenIds()
            .stream()
            .map(childrenId ->
                objToString(
                    createReferenced(attIdAsObj, RefOperation.builder().useCurrentSite(false).fixedSite(childrenId).key(configKey).build())
                )
            )
            .collect(Collectors.toList());

        return keys
            .stream()
            .map(key ->
                findByIdAndOrgaId(key, orgaId)
                    .orElse(
                        Attribute
                            .builder()
                            .attributeValue(UtilsValue.generateErrorValue("No attribute found for " + key))
                            .aggInfo(AggInfo.builder().build())
                            .id(key)
                            .build()
                    )
            )
            .collect(Collectors.toList());
    }
}
