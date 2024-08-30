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
public class ResourceDTO implements Serializable {

    private String id;

    private String name;

    private String content;
    private String type;

    private OrganisationDTO orga;

    private ResourceDTO parent;

    private Long childrenCount;

    @Builder.Default
    private List<ResourceDTO> childrens = new ArrayList<>();

    @Builder.Default
    private Set<TagDTO> tags = new HashSet<>();
}
