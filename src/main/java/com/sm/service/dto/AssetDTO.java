package com.sm.service.dto;

import com.sm.domain.enumeration.AssetType;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link com.sm.domain.Asset} entity.
 */
@Value
@Builder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AssetDTO implements Serializable {

    private String id;

    private String name;

    private AssetType type;

    private String content;

    private OrganisationDTO orga;

    private AssetDTO parent;

    @Builder.Default
    private List<AssetDTO> childrens = new ArrayList<>();

    @Builder.Default
    private Set<TagDTO> tags = new HashSet<>();
}
