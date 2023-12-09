package com.sm.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.sm.domain.Organisation} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrganisationDTO implements Serializable {

    private String id;

    private String name;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrganisationDTO)) {
            return false;
        }

        OrganisationDTO organisationDTO = (OrganisationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, organisationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrganisationDTO{" +
            "id='" + getId() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
