package com.sm.web.rest;

import com.sm.domain.Resource;
import com.sm.repository.ResourceRepository;
import com.sm.service.ResourceService;
import com.sm.service.SiteService;
import com.sm.service.dto.ResourceDTO;
import com.sm.service.dto.filter.ResourceSearchDTO;
import com.sm.service.dto.filter.ResourceType;
import com.sm.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
 * REST controller for managing {@link Resource}.
 */
@RestController
@RequestMapping("/api/resources")
public class ResourceResource {

    private static final String ENTITY_NAME = "resource";
    private final Logger log = LoggerFactory.getLogger(ResourceResource.class);
    private final ResourceService resourceService;
    private final SiteService siteService;
    private final ResourceRepository resourceRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ResourceResource(ResourceService resourceService, SiteService siteService, ResourceRepository resourceRepository) {
        this.resourceService = resourceService;
        this.resourceRepository = resourceRepository;
        this.siteService = siteService;
    }

    /**
     * {@code POST  /resources} : Create a new resource.
     *
     * @param resourceDTO the resourceDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resourceDTO, or with status {@code 400 (Bad Request)} if the resource has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ResourceDTO> createResource(@RequestBody ResourceDTO resourceDTO) throws URISyntaxException {
        log.debug("REST request to save Resource : {}", resourceDTO);
        /*
        if (resourceDTO.getId() != null) {
            throw new BadRequestAlertException("A new resource cannot already have an ID", ENTITY_NAME, "idexists");
        }
*/
        ResourceDTO result = resourceService.save(resourceDTO);
        return ResponseEntity
            .created(new URI("/api/resources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /resources/:id} : Updates an existing resource.
     *
     * @param id          the id of the resourceDTO to save.
     * @param resourceDTO the resourceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourceDTO,
     * or with status {@code 400 (Bad Request)} if the resourceDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resourceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourceDTO> updateResource(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ResourceDTO resourceDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Resource : {}, {}", id, resourceDTO);
        if (resourceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Optional<Resource> existing = resourceRepository.findByResourceId(id);
        if (existing.isEmpty()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ResourceDTO result = resourceService.update(resourceDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourceDTO.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /resources/:id} : Partial updates given fields of an existing resource, field will ignore if it is null
     *
     * @param id          the id of the resourceDTO to save.
     * @param resourceDTO the resourceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourceDTO,
     * or with status {@code 400 (Bad Request)} if the resourceDTO is not valid,
     * or with status {@code 404 (Not Found)} if the resourceDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the resourceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ResourceDTO> partialUpdateResource(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ResourceDTO resourceDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Resource partially : {}, {}", id, resourceDTO);
        if (resourceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Optional<Resource> existing = resourceRepository.findByResourceId(id);
        if (existing.isEmpty()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ResourceDTO> result = resourceService.partialUpdate(resourceDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourceDTO.getId())
        );
    }

    /**
     * {@code GET  /resources} : get all the resources.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resources in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ResourceDTO>> getAllResources(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String path,
        @RequestParam(required = false) String type
    ) {
        log.debug("REST request to get a page of Sites");
        Page<ResourceDTO> page;
        if (type != null) {
            page = resourceService.findAllByType(type, pageable);
        } else {
            page = resourceService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        headers.set("path", path);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /resources/:id} : get the "id" resource.
     *
     * @param id the id of the resourceDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resourceDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceDTO> getResource(@PathVariable String id) {
        log.debug("REST request to get Resource : {}", id);
        Optional<ResourceDTO> resourceDTO = resourceService.findById(id);
        return ResponseUtil.wrapOrNotFound(resourceDTO);
    }

    /**
     * {@code DELETE  /resources/:id} : delete the "id" resource.
     *
     * @param id the id of the resourceDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        log.debug("REST request to delete Resource : {}", id);
        resourceService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }

    @PostMapping("/{orgaId}/search")
    public ResponseEntity<List> search(@PathVariable(value = "orgaId") final String orgaId, @RequestBody ResourceSearchDTO resourceSearch)
        throws URISyntaxException {
        log.debug("REST search resource : {}", resourceSearch.toString());

        /*
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.readValue(resourceSearch.toString(), ResourceSearchDTO.class);
        } catch (Exception e) {
            log.error("Error...", e);

        }
*/
        //        Optional<List<String>> map = computeService.saveAttributes(orgaId, attributesToSave);
        ResourceType type = resourceSearch.getResourceType();
        Page page;
        if (ResourceType.SITE.equals(type)) {
            page = siteService.search(resourceSearch, orgaId);
        } else {
            throw new RuntimeException("to implement...");
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
