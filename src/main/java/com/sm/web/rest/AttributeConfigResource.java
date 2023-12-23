package com.sm.web.rest;

import com.sm.domain.AttributeConfig;
import com.sm.repository.AttributeConfigRepository;
import com.sm.service.AttributeConfigService;
import com.sm.service.dto.AttributeConfigDTO;
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
 * REST controller for managing {@link com.sm.domain.AttributeConfig}.
 */
@RestController
@RequestMapping("/api/attribute-configs")
public class AttributeConfigResource {

    private static final String ENTITY_NAME = "attributeConfig";
    private final Logger log = LoggerFactory.getLogger(AttributeConfigResource.class);
    private final AttributeConfigService attributeConfigService;
    private final AttributeConfigRepository attributeConfigRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public AttributeConfigResource(AttributeConfigService attributeConfigService, AttributeConfigRepository attributeConfigRepository) {
        this.attributeConfigService = attributeConfigService;
        this.attributeConfigRepository = attributeConfigRepository;
    }

    /**
     * {@code POST  /attribute-configs} : Create a new attributeConfig.
     *
     * @param attributeConfigDTO the attributeConfigDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new attributeConfigDTO, or with status {@code 400 (Bad Request)} if the attributeConfig has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AttributeConfigDTO> createAttributeConfig(@RequestBody AttributeConfigDTO attributeConfigDTO)
        throws URISyntaxException {
        log.debug("REST request to save AttributeConfig : {}", attributeConfigDTO);
        //        if (attributeConfigDTO.getId() != null) {
        //            throw new BadRequestAlertException("A new attributeConfig cannot already have an ID", ENTITY_NAME, "idexists");
        //        }
        AttributeConfigDTO result = attributeConfigService.save(attributeConfigDTO);
        return ResponseEntity
            .created(new URI("/api/attribute-configs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /attribute-configs/:id} : Updates an existing attributeConfig.
     *
     * @param id                 the id of the attributeConfigDTO to save.
     * @param attributeConfigDTO the attributeConfigDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attributeConfigDTO,
     * or with status {@code 400 (Bad Request)} if the attributeConfigDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the attributeConfigDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AttributeConfigDTO> updateAttributeConfig(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody AttributeConfigDTO attributeConfigDTO
    ) throws URISyntaxException {
        log.debug("REST request to update AttributeConfig : {}, {}", id, attributeConfigDTO);
        if (attributeConfigDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attributeConfigDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Optional<AttributeConfig> existing = attributeConfigRepository.findByAttributeConfigId(id);
        if (existing.isEmpty()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AttributeConfigDTO result = attributeConfigService.update(attributeConfigDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, attributeConfigDTO.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /attribute-configs/:id} : Partial updates given fields of an existing attributeConfig, field will ignore if it is null
     *
     * @param id                 the id of the attributeConfigDTO to save.
     * @param attributeConfigDTO the attributeConfigDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attributeConfigDTO,
     * or with status {@code 400 (Bad Request)} if the attributeConfigDTO is not valid,
     * or with status {@code 404 (Not Found)} if the attributeConfigDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the attributeConfigDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AttributeConfigDTO> partialUpdateAttributeConfig(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody AttributeConfigDTO attributeConfigDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update AttributeConfig partially : {}, {}", id, attributeConfigDTO);
        if (attributeConfigDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attributeConfigDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attributeConfigRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AttributeConfigDTO> result = attributeConfigService.partialUpdate(attributeConfigDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, attributeConfigDTO.getId())
        );
    }

    /**
     * {@code GET  /attribute-configs} : get all the attributeConfigs.
     *
     * @param pageable  the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of attributeConfigs in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AttributeConfigDTO>> getAllAttributeConfigs(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of AttributeConfigs");
        Page<AttributeConfigDTO> page;
        if (eagerload) {
            page = attributeConfigService.findAllWithEagerRelationships(pageable);
        } else {
            page = attributeConfigService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /attribute-configs/:id} : get the "id" attributeConfig.
     *
     * @param id the id of the attributeConfigDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the attributeConfigDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AttributeConfigDTO> getAttributeConfig(@PathVariable String id) {
        log.debug("REST request to get AttributeConfig : {}", id);
        Optional<AttributeConfigDTO> attributeConfigDTO = attributeConfigService.findById(id);
        return ResponseUtil.wrapOrNotFound(attributeConfigDTO);
    }

    /**
     * {@code DELETE  /attribute-configs/:id} : delete the "id" attributeConfig.
     *
     * @param id the id of the attributeConfigDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeConfig(@PathVariable String id) {
        log.debug("REST request to delete AttributeConfig : {}", id);
        attributeConfigService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
