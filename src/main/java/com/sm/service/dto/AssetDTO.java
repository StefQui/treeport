package com.sm.service.dto;

import com.sm.domain.enumeration.AssetType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.sm.domain.Asset} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AssetDTO implements Serializable {

    private String id;

    private String name;

    private AssetType type;

    private OrganisationDTO orga;

    private AssetDTO parent;

    private Set<AssetDTO> childrens = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AssetType getType() {
        return type;
    }

    public void setType(AssetType type) {
        this.type = type;
    }

    public OrganisationDTO getOrga() {
        return orga;
    }

    public void setOrga(OrganisationDTO orga) {
        this.orga = orga;
    }

    public AssetDTO getParent() {
        return parent;
    }

    public void setParent(AssetDTO parent) {
        this.parent = parent;
    }

    public Set<AssetDTO> getChildrens() {
        return childrens;
    }

    public void setChildrens(Set<AssetDTO> childrens) {
        this.childrens = childrens;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AssetDTO)) {
            return false;
        }

        AssetDTO assetDTO = (AssetDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, assetDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AssetDTO{" +
            "id='" + getId() + "'" +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", orga=" + getOrga() +
            ", parent=" + getParent() +
            ", childrens=" + getChildrens() +
            "}";
    }
}
