package com.sm.service;

import com.sm.domain.AttributeConfig;
import com.sm.repository.AttributeConfigRepository;
import com.sm.service.dto.AttributeConfigDTO;
import com.sm.service.mapper.AttributeConfigMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link com.sm.domain.AttributeConfig}.
 */
@Service
public class AttributeConfigService {

    private final Logger log = LoggerFactory.getLogger(AttributeConfigService.class);

    private final AttributeConfigRepository attributeConfigRepository;

    private final AttributeConfigMapper attributeConfigMapper;

    public AttributeConfigService(AttributeConfigRepository attributeConfigRepository, AttributeConfigMapper attributeConfigMapper) {
        this.attributeConfigRepository = attributeConfigRepository;
        this.attributeConfigMapper = attributeConfigMapper;
    }

    /**
     * Save a attributeConfig.
     *
     * @param attributeConfigDTO the entity to save.
     * @return the persisted entity.
     */
    public AttributeConfigDTO save(AttributeConfigDTO attributeConfigDTO) {
        log.debug("Request to save AttributeConfig : {}", attributeConfigDTO);
        AttributeConfig attributeConfig = attributeConfigMapper.toEntity(attributeConfigDTO);
        attributeConfig = attributeConfigRepository.save(attributeConfig);
        return attributeConfigMapper.toDto(attributeConfig);
    }

    /**
     * Update a attributeConfig.
     *
     * @param attributeConfigDTO the entity to save.
     * @return the persisted entity.
     */
    public AttributeConfigDTO update(AttributeConfigDTO attributeConfigDTO) {
        log.debug("Request to update AttributeConfig : {}", attributeConfigDTO);
        AttributeConfig attributeConfig = attributeConfigMapper.toEntity(attributeConfigDTO);
        Optional<AttributeConfig> existing = attributeConfigRepository.findByAttributeConfigId(attributeConfigDTO.getId());
        attributeConfig.setObjectId(existing.get().getObjectId());
        attributeConfig = attributeConfigRepository.save(attributeConfig);
        return attributeConfigMapper.toDto(attributeConfig);
    }

    /**
     * Partially update a attributeConfig.
     *
     * @param attributeConfigDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<AttributeConfigDTO> partialUpdate(AttributeConfigDTO attributeConfigDTO) {
        log.debug("Request to partially update AttributeConfig : {}", attributeConfigDTO);

        return attributeConfigRepository
            .findById(attributeConfigDTO.getId())
            .map(existingAttributeConfig -> {
                attributeConfigMapper.partialUpdate(existingAttributeConfig, attributeConfigDTO);

                return existingAttributeConfig;
            })
            .map(attributeConfigRepository::save)
            .map(attributeConfigMapper::toDto);
    }

    /**
     * Get all the attributeConfigs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<AttributeConfigDTO> findAll(Pageable pageable) {
        log.debug("Request to get all AttributeConfigs");
        return attributeConfigRepository.findAll(pageable).map(attributeConfigMapper::toDto);
    }

    /**
     * Get all the attributeConfigs with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<AttributeConfigDTO> findAllWithEagerRelationships(Pageable pageable) {
        return attributeConfigRepository.findAllWithEagerRelationships(pageable).map(attributeConfigMapper::toDto);
    }

    /**
     * Get one attributeConfig by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<AttributeConfigDTO> findById(String id) {
        log.debug("Request to get AttributeConfig : {}", id);
        return attributeConfigRepository.findByAttributeConfigId(id).map(attributeConfigMapper::toDto);
    }

    /**
     * Delete the attributeConfig by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete AttributeConfig : {}", id);
        Optional<AttributeConfig> existing = attributeConfigRepository.findByAttributeConfigId(id);
        attributeConfigRepository.deleteByAttributeConfigId(existing.get().getId());
    }
}
