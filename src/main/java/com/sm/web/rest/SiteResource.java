package com.sm.web.rest;

import com.sm.domain.Site;
import com.sm.repository.SiteRepository;
import com.sm.service.ComputeService;
import com.sm.service.SiteService;
import com.sm.service.dto.SiteDTO;
import com.sm.service.dto.SiteUpdateRequestDTO;
import com.sm.service.dto.SiteWithValuesAndImpactersDTO;
import com.sm.service.dto.SiteWithValuesDTO;
import com.sm.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link Site}.
 */
@RestController
@RequestMapping("/api/orga/{orgaId}/sites")
public class SiteResource {

    private static final String ENTITY_NAME = "site";
    private final Logger log = LoggerFactory.getLogger(SiteResource.class);
    private final SiteService siteService;
    private final SiteRepository siteRepository;
    private final ComputeService computeService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public SiteResource(SiteService siteService, SiteRepository siteRepository, ComputeService computeService) {
        this.siteService = siteService;
        this.siteRepository = siteRepository;
        this.computeService = computeService;
    }

    /**
     * {@code POST  /sites} : Create a new site.
     *
     * @param siteDTO the siteDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new siteDTO, or with status {@code 400 (Bad Request)} if the site has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SiteWithValuesAndImpactersDTO> createSite(
        @RequestBody SiteUpdateRequestDTO siteUpdateDTO,
        @PathVariable String orgaId
    ) throws URISyntaxException {
        log.debug("REST request to save Site : {}", siteUpdateDTO.getSiteToUpdate());
        /*
        if (siteDTO.getId() != null) {
            throw new BadRequestAlertException("A new site cannot already have an ID", ENTITY_NAME, "idexists");
        }
*/
        Site site = siteService.saveWithAttributes(siteUpdateDTO.getSiteToUpdate(), orgaId);
        computeService.applyCampaigns(orgaId, List.of("2023"));
        Set<String> impacteds = computeService.reCalculateAllAttributes(orgaId);

        SiteWithValuesDTO siteWithAttributes = siteService.getSiteWithAttributes(
            site.getId(),
            orgaId,
            siteUpdateDTO.getColumnDefinitions()
        );
        SiteWithValuesAndImpactersDTO result = SiteWithValuesAndImpactersDTO
            .builder()
            .impactedIds(impacteds)
            .site(siteWithAttributes)
            .build();

        return ResponseEntity
            .created(new URI("/api/sites/" + result.getSite().getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getSite().getId()))
            .body(result);
    }

    /**
     * {@code PUT  /sites/:id} : Updates an existing site.
     *
     * @param id      the id of the siteDTO to save.
     * @param siteDTO the siteDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated siteDTO,
     * or with status {@code 400 (Bad Request)} if the siteDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the siteDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SiteWithValuesAndImpactersDTO> updateSite(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SiteUpdateRequestDTO siteUpdateDTO,
        @PathVariable String orgaId
    ) throws URISyntaxException {
        log.debug("REST request to update Site : {}, {}", id, siteUpdateDTO);
        if (siteUpdateDTO.getSiteToUpdate().getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, siteUpdateDTO.getSiteToUpdate().getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Optional<Site> existing = siteRepository.findBySiteId(id);
        if (existing.isEmpty()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Site site = siteService.update(siteUpdateDTO.getSiteToUpdate(), orgaId);

        computeService.applyCampaigns(orgaId, List.of("2023"));
        Set<String> impacteds = computeService.reCalculateAllAttributes(orgaId);

        SiteWithValuesDTO siteWithAttributes = siteService.getSiteWithAttributes(
            site.getId(),
            orgaId,
            siteUpdateDTO.getColumnDefinitions()
        );
        SiteWithValuesAndImpactersDTO result = SiteWithValuesAndImpactersDTO
            .builder()
            .impactedIds(impacteds)
            .site(siteWithAttributes)
            .build();

        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, siteUpdateDTO.getSiteToUpdate().getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /sites/:id} : Partial updates given fields of an existing site, field will ignore if it is null
     *
     * @param id      the id of the siteDTO to save.
     * @param siteDTO the siteDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated siteDTO,
     * or with status {@code 400 (Bad Request)} if the siteDTO is not valid,
     * or with status {@code 404 (Not Found)} if the siteDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the siteDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SiteDTO> partialUpdateSite(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SiteDTO siteDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Site partially : {}, {}", id, siteDTO);
        if (siteDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, siteDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Optional<Site> existing = siteRepository.findBySiteId(id);
        if (existing.isEmpty()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SiteDTO> result = siteService.partialUpdate(siteDTO);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, siteDTO.getId()));
    }

    /**
     * {@code GET  /sites} : get all the sites.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sites in body.
     */
    @GetMapping("")
    public ResponseEntity<List<SiteDTO>> getAllSites(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String path,
        @RequestParam(required = false) String type
    ) {
        log.debug("REST request to get a page of Sites");
        Page<SiteDTO> page;
        if (type != null) {
            page = siteService.findAllByType(type, pageable);
        } else {
            page = siteService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        headers.set("path", path);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /sites/:id} : get the "id" site.
     *
     * @param id the id of the siteDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the siteDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SiteDTO> getSite(@PathVariable String id) {
        log.debug("REST request to get Site : {}", id);
        Optional<SiteDTO> siteDTO = siteService.findById(id);
        return ResponseUtil.wrapOrNotFound(siteDTO);
    }

    /**
     * {@code DELETE  /sites/:id} : delete the "id" site.
     *
     * @param id the id of the siteDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable String id, @PathVariable String orgaId) {
        log.debug("REST request to delete Site : {}", id);
        siteService.delete(id, orgaId);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
