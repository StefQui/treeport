package com.sm.service.mapper;

import com.sm.domain.Organisation;
import com.sm.service.dto.OrganisationDTO;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link Organisation} and its DTO {@link OrganisationDTO}.
 */
@Component
public class OrganisationMapper {

    public Organisation toEntity(OrganisationDTO organisationDTO) {
        return Organisation.builder().id(organisationDTO.getId()).name(organisationDTO.getName()).build();
    }

    public OrganisationDTO toDto(Organisation organisation) {
        return OrganisationDTO.builder().id(organisation.getId()).name(organisation.getName()).build();
    }

    public void partialUpdate(Organisation existingOrganisation, OrganisationDTO organisationDTO) {
        existingOrganisation.setName(organisationDTO.getName());
    }

    public OrganisationDTO toBasicDto(String orgaId) {
        return OrganisationDTO.builder().id(orgaId).build();
    }
}
