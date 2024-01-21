package com.sm.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link com.sm.domain.Asset} entity.
 */
@Data
@SuperBuilder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SiteDTO implements Serializable {

    private String id;

    private String name;

    private String content;

    private OrganisationDTO orga;

    private SiteDTO parent;

    @Builder.Default
    private List<SiteDTO> childrens = new ArrayList<>();

    @Builder.Default
    private Set<TagDTO> tags = new HashSet<>();
}
