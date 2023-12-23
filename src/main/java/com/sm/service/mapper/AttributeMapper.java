package com.sm.service.mapper;

import com.sm.domain.Attribute;
import com.sm.service.dto.AttributeDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link Attribute} and its DTO {@link AttributeDTO}.
 */
@Component
@AllArgsConstructor
public class AttributeMapper {

    private TagMapper tagMapper;
    private OrganisationMapper organisationMapper;
    private AssetMapper assetMapper;
    private AttributeConfigMapper attributeConfigMapper;

    public Attribute toEntity(AttributeDTO aDTO) {
        return Attribute
            .builder()
            .id(aDTO.getId())
            .tags(tagMapper.toEntity(aDTO.getTags()))
            .orgaId(aDTO.getOrga().getId())
            .siteId(aDTO.getSite().getId())
            .configError(aDTO.getConfigError())
            .configId(aDTO.getConfig().getId())
            .hasConfigError(aDTO.getHasConfigError())
            .isAgg(aDTO.getIsAgg())
            .build();
    }

    public AttributeDTO toDto(Attribute a) {
        return AttributeDTO
            .builder()
            .id(a.getId())
            .config(attributeConfigMapper.toBasicDto(a.getConfigId()))
            .configError(a.getConfigError())
            .hasConfigError(a.getHasConfigError())
            .orga(organisationMapper.toBasicDto(a.getOrgaId()))
            .site(assetMapper.toBasicDto(a.getSiteId()))
            .isAgg(a.getIsAgg())
            .build();
    }

    public void partialUpdate(Attribute existing, AttributeDTO attributeDTO) {
        existing.setConfigError(attributeDTO.getConfigError());
    }
}
