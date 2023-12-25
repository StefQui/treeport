package com.sm.service;

import com.sm.domain.Resource;
import com.sm.repository.ResourceRepository;
import com.sm.service.dto.ResourceDTO;
import com.sm.service.mapper.ResourceMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Resource}.
 */
@Service
public class ResourceService {

    private final Logger log = LoggerFactory.getLogger(ResourceService.class);

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;

    public ResourceService(ResourceRepository resourceRepository, ResourceMapper resourceMapper) {
        this.resourceRepository = resourceRepository;
        this.resourceMapper = resourceMapper;
    }

    /**
     * Save a resource.
     *
     * @param resourceDTO the entity to save.
     * @return the persisted entity.
     */
    public ResourceDTO save(ResourceDTO resourceDTO) {
        log.debug("Request to save Resource : {}", resourceDTO);
        Resource resource = resourceMapper.toEntity(resourceDTO);
        resource = resourceRepository.save(resource);
        return resourceMapper.toDto(resource);
    }

    /**
     * Update a resource.
     *
     * @param resourceDTO the entity to save.
     * @return the persisted entity.
     */
    public ResourceDTO update(ResourceDTO resourceDTO) {
        log.debug("Request to update Resource : {}", resourceDTO);
        Resource resource = resourceMapper.toEntity(resourceDTO);
        Optional<Resource> existing = resourceRepository.findByResourceId(resourceDTO.getId());
        resource.setObjectId(existing.get().getObjectId());
        resource = resourceRepository.save(resource);
        return resourceMapper.toDto(resource);
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
}
