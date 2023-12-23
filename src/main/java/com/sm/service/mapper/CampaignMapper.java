package com.sm.service.mapper;

import com.sm.domain.Campaign;
import com.sm.service.dto.CampaignDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link Campaign} and its DTO {@link CampaignDTO}.
 */
@Component
@AllArgsConstructor
public class CampaignMapper {

    private OrganisationMapper organisationMapper;

    public CampaignDTO toDto(Campaign a) {
        return CampaignDTO
            .builder()
            .orga(organisationMapper.toBasicDto(a.getOrgaId()))
            .id(a.getId())
            .name(a.getName())
            .description(a.getDescription())
            .build();
    }

    public CampaignDTO toBasicDto(String parentId) {
        return CampaignDTO.builder().id(parentId).build();
    }

    public Campaign toEntity(CampaignDTO dto) {
        return Campaign.builder().id(dto.getId()).orgaId(dto.getOrga().getId()).name(dto.getName()).name(dto.getDescription()).build();
    }

    private String toBasicEntity(CampaignDTO a) {
        return a.getId();
    }

    public void partialUpdate(Campaign existing, CampaignDTO dto) {
        existing.setName(dto.getName());
        existing.setDescription(existing.getDescription());
        existing.setOrgaId(dto.getOrga().getId());
    }
}
