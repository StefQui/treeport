package com.sm.service.mapper;

import com.sm.domain.Organisation;
import com.sm.service.dto.OrganisationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Organisation} and its DTO {@link OrganisationDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrganisationMapper extends EntityMapper<OrganisationDTO, Organisation> {}
