package com.sm.service.mapper;

import com.sm.domain.AttributeConfig;
import com.sm.service.dto.AttributeConfigDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link AttributeConfig} and its DTO {@link AttributeConfigDTO}.
 */
@Component
@AllArgsConstructor
public class AttributeConfigMapper {

    private TagMapper tagMapper;
    private OrganisationMapper organisationMapper;
    private SiteMapper siteMapper;

    public AttributeConfig toEntity(AttributeConfigDTO attributeConfigDTO) {
        return AttributeConfig
            .builder()
            .id(attributeConfigDTO.getId())
            .label(attributeConfigDTO.getLabel())
            .attributeType(attributeConfigDTO.getAttributeType())
            .siteId(attributeConfigDTO.getSite().getId())
            .applyOnChildren(attributeConfigDTO.getApplyOnChildren())
            .consoOperationType(attributeConfigDTO.getConsoOperationType())
            .consoParameterKey(attributeConfigDTO.getConsoParameterKey())
            .isConsolidable(attributeConfigDTO.getIsConsolidable())
            .isWritable(attributeConfigDTO.getIsWritable())
            .orgaId(attributeConfigDTO.getOrga().getId())
            .tags(tagMapper.toEntity(attributeConfigDTO.getTags()))
            .build();
    }

    public AttributeConfigDTO toDto(AttributeConfig a) {
        return AttributeConfigDTO
            .builder()
            .id(a.getId())
            .label(a.getLabel())
            .attributeType(a.getAttributeType())
            .site(siteMapper.toBasicDto(a.getSiteId()))
            .applyOnChildren(a.getApplyOnChildren())
            .consoOperationType(a.getConsoOperationType())
            .consoParameterKey(a.getConsoParameterKey())
            .isConsolidable(a.getIsConsolidable())
            .isWritable(a.getIsWritable())
            .orga(organisationMapper.toBasicDto(a.getOrgaId()))
            .tags(tagMapper.toDto(a.getTags()))
            .build();
    }

    public void partialUpdate(AttributeConfig existing, AttributeConfigDTO dto) {
        existing.setAttributeType(dto.getAttributeType());
    }

    public AttributeConfigDTO toBasicDto(String configId) {
        return AttributeConfigDTO.builder().id(configId).build();
    }
}
