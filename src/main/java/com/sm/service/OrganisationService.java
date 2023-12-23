package com.sm.service;

import com.sm.domain.Organisation;
import com.sm.repository.OrganisationRepository;
import com.sm.service.dto.OrganisationDTO;
import com.sm.service.mapper.OrganisationMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link com.sm.domain.Organisation}.
 */
@Service
public class OrganisationService {

    private final Logger log = LoggerFactory.getLogger(OrganisationService.class);

    private final OrganisationRepository organisationRepository;

    private final OrganisationMapper organisationMapper;

    public OrganisationService(OrganisationRepository organisationRepository, OrganisationMapper organisationMapper) {
        this.organisationRepository = organisationRepository;
        this.organisationMapper = organisationMapper;
    }

    /**
     * Save a organisation.
     *
     * @param organisationDTO the entity to save.
     * @return the persisted entity.
     */
    public OrganisationDTO save(OrganisationDTO organisationDTO) {
        log.debug("Request to save Organisation : {}", organisationDTO);
        Organisation organisation = organisationMapper.toEntity(organisationDTO);
        organisation = organisationRepository.save(organisation);
        return organisationMapper.toDto(organisation);
    }

    /**
     * Update a organisation.
     *
     * @param organisationDTO the entity to save.
     * @return the persisted entity.
     */
    public OrganisationDTO update(OrganisationDTO organisationDTO) {
        log.debug("Request to update Organisation : {}", organisationDTO);
        Organisation organisation = organisationMapper.toEntity(organisationDTO);
        Optional<Organisation> existing = organisationRepository.findByOrganisationId(organisationDTO.getId());
        organisation.setObjectId(existing.get().getObjectId());
        organisation = organisationRepository.save(organisation);
        return organisationMapper.toDto(organisation);
    }

    /**
     * Partially update a organisation.
     *
     * @param organisationDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<OrganisationDTO> partialUpdate(OrganisationDTO organisationDTO) {
        log.debug("Request to partially update Organisation : {}", organisationDTO);

        return organisationRepository
            .findByOrganisationId(organisationDTO.getId())
            .map(existingOrganisation -> {
                organisationMapper.partialUpdate(existingOrganisation, organisationDTO);

                return existingOrganisation;
            })
            .map(organisationRepository::save)
            .map(organisationMapper::toDto);
    }

    /**
     * Get all the organisations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<OrganisationDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Organisations");
        return organisationRepository.findAll(pageable).map(organisationMapper::toDto);
    }

    /**
     * Get one organisation by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<OrganisationDTO> findById(String id) {
        log.debug("Request to get Organisation : {}", id);
        return organisationRepository.findByOrganisationId(id).map(organisationMapper::toDto);
    }

    /**
     * Delete the organisation by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Organisation : {}", id);
        Optional<Organisation> existing = organisationRepository.findByOrganisationId(id);
        organisationRepository.deleteByOrganisationId(existing.get().getId());
    }
}
