package com.sm.service;

import static java.util.Optional.empty;
import static java.util.Optional.of;

import com.sm.domain.attribute.Attribute;
import com.sm.repository.AttributeRepository;
import com.sm.service.dto.attribute.AttributeDTO;
import com.sm.service.mapper.AttributeMapper;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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

    private final AttributeMapper attributeMapper;

    public AttributeService(AttributeRepository attributeRepository, AttributeMapper attributeMapper) {
        this.attributeRepository = attributeRepository;
        this.attributeMapper = attributeMapper;
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

    public List<Attribute> findBySite(String siteId, String orgaId) {
        List<Attribute> atts = findAllAttributes(orgaId);
        return atts.stream().filter(a -> a.getSiteFragment().equals(siteId)).collect(Collectors.toList());
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

    public Set<Attribute> findImpacted(String attKey, @NonNull String orgaId) {
        List<Attribute> atts = findAllAttributes(orgaId);
        return atts.stream().filter(a -> a.getImpacterIds().contains(attKey)).collect(Collectors.toSet());
    }
}
