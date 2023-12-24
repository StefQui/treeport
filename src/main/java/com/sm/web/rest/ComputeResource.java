package com.sm.web.rest;

import com.sm.domain.AttributeConfig;
import com.sm.service.ComputeService;
import java.net.URISyntaxException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link AttributeConfig}.
 */
@RestController
@RequestMapping("/api/compute")
public class ComputeResource {

    private final ComputeService computeService;

    private final Logger log = LoggerFactory.getLogger(ComputeResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ComputeResource(ComputeService computeService) {
        this.computeService = computeService;
    }

    @PostMapping("/doCompute")
    public ResponseEntity<List<String>> doCompute() throws URISyntaxException {
        log.debug("REST request to compute");
        //        AttributeConfigDTO result = attributeConfigService.save(attributeConfigDTO);
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/reloadOrganisations")
    public ResponseEntity reloadOrganisations() throws URISyntaxException {
        log.debug("REST request to reloadOrganisations");
        computeService.reloadOrganisations();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reloadTags")
    public ResponseEntity reloadTags() throws URISyntaxException {
        log.debug("REST request to reloadTags");
        computeService.reloadTags();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reloadCampaigns")
    public ResponseEntity reloadCampaigns() throws URISyntaxException {
        log.debug("REST request to reloadCampaigns");
        computeService.reloadCampaigns();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reloadAssets")
    public ResponseEntity reloadAssets() throws URISyntaxException {
        log.debug("REST request to reloadAssets");
        computeService.reloadAssets();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reloadAttributeConfigs")
    public ResponseEntity reloadAttributeConfigs() throws URISyntaxException {
        log.debug("REST request to reloadAttributeConfigs");
        computeService.reloadAttributeConfigs();
        return ResponseEntity.ok().build();
    }
}
