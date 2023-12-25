package com.sm.service;

import com.sm.domain.Site;
import com.sm.repository.SiteRepository;
import com.sm.service.dto.SiteDTO;
import com.sm.service.mapper.SiteMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Site}.
 */
@Service
public class SiteService {

    private final Logger log = LoggerFactory.getLogger(SiteService.class);

    private final SiteRepository siteRepository;
    private final SiteMapper siteMapper;

    public SiteService(SiteRepository siteRepository, SiteMapper siteMapper) {
        this.siteRepository = siteRepository;
        this.siteMapper = siteMapper;
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
}
