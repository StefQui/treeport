package com.sm.web.rest;

import static com.sm.service.InitialLoadService.COCA;

import com.sm.domain.AttributeConfig;
import com.sm.service.ComputeService;
import com.sm.service.InitialLoadService;
import com.sm.service.dto.attribute.AttributeDTO;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link AttributeConfig}.
 */
@RestController
@RequestMapping("/api/compute")
public class ComputeResource {

    private final InitialLoadService initialLoadService;
    private final ComputeService computeService;

    private final Logger log = LoggerFactory.getLogger(ComputeResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ComputeResource(InitialLoadService initialLoadService, ComputeService computeService) {
        this.initialLoadService = initialLoadService;
        this.computeService = computeService;
    }

    @PostMapping("/doCompute")
    public ResponseEntity<List<String>> doCompute() throws URISyntaxException {
        log.debug("REST request to compute");
        //        AttributeConfigDTO result = attributeConfigService.save(attributeConfigDTO);
        computeService.applyCampaigns(COCA);
        computeService.reCalculateAllAttributes(COCA);

        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/reloadOrganisations")
    public ResponseEntity reloadOrganisations() throws URISyntaxException {
        log.debug("REST request to reloadOrganisations");
        initialLoadService.reloadOrganisations();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reloadTags")
    public ResponseEntity reloadTags() throws URISyntaxException {
        log.debug("REST request to reloadTags");
        initialLoadService.reloadTags();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reloadCampaigns")
    public ResponseEntity reloadCampaigns() throws URISyntaxException {
        log.debug("REST request to reloadCampaigns");
        initialLoadService.reloadCampaigns();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reloadAssets")
    public ResponseEntity reloadAssets() throws URISyntaxException {
        log.debug("REST request to reloadAssets");
        initialLoadService.reloadAssets();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reloadAttributeConfigs")
    public ResponseEntity reloadAttributeConfigs() throws URISyntaxException {
        log.debug("REST request to reloadAttributeConfigs");
        initialLoadService.reloadAttributeConfigs();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/setSomeValues")
    public ResponseEntity setSomeValues() throws URISyntaxException {
        log.debug("REST request to setSomeValues");
        initialLoadService.setSomeValues();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{orgaId}/saveAttributes")
    public ResponseEntity<List<String>> saveAttributes(
        @PathVariable(value = "orgaId") final String orgaId,
        @RequestBody List<AttributeDTO> attributesToSave
    ) throws URISyntaxException {
        log.debug("REST request to saveAttributes : {}", attributesToSave);

        Optional<List<String>> map = computeService.saveAttributes(orgaId, attributesToSave);
        return ResponseUtil.wrapOrNotFound(map);
    }
}
