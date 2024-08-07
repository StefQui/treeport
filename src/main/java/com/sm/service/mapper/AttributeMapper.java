package com.sm.service.mapper;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.Attribute;
import com.sm.service.AssetKeyUtils;
import com.sm.service.dto.attribute.AttributeDTO;
import java.util.List;
import java.util.stream.Collectors;
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
    private SiteMapper siteMapper;
    private ResourceMapper resourceMapper;
    private AttributeValueMapper attributeValueMapper;
    private AttributeConfigMapper attributeConfigMapper;

    public Attribute toEntity(AttributeDTO aDTO) {
        return Attribute
            .builder()
            .id(aDTO.getId())
            .tags(tagMapper.toEntity(aDTO.getTags()))
            .orgaId(aDTO.getOrga().getId())
            .assetKey(aDTO.getAssetKey())
            .siteId(AssetKeyUtils.extractSiteFromDTO(aDTO))
            .resourceId(AssetKeyUtils.extractResourceFromDTO(aDTO))
            .resourceId2(AssetKeyUtils.extractResource2FromDTO(aDTO))
            .configError(aDTO.getConfigError())
            .configId(aDTO.getConfig().getId())
            .campaignId(aDTO.getCampaignId())
            .hasConfigError(aDTO.getHasConfigError())
            .attributeValue(attributeValueMapper.toEntity(aDTO.getAttributeValue()))
            .aggInfo(aDTO.getAggInfo())
            .isAgg(aDTO.getIsAgg())
            .build();
    }

    public AttributeDTO toDto(Attribute a) {
        return AttributeDTO
            .builder()
            .id(a.getId())
            .config(attributeConfigMapper.toBasicDto(a.getConfigId()))
            .campaignId(a.getCampaignId())
            .configError(a.getConfigError())
            .hasConfigError(a.getHasConfigError())
            .orga(organisationMapper.toBasicDto(a.getOrgaId()))
            .site(siteMapper.toBasicDto(AssetKeyUtils.extractSite(a)))
            .resource(resourceMapper.toBasicDto(AssetKeyUtils.extractResource(a)))
            .attributeValue(attributeValueMapper.toDto(a.getAttributeValue()))
            .isAgg(a.getIsAgg())
            .aggInfo(a.getAggInfo())
            .build();
    }

    public AttributeDTO toDtoWithConfig(Attribute attribute, AttributeConfig attributeConfig) {
        AttributeDTO attDto = toDto(attribute);
        return attDto.toBuilder().config(attributeConfigMapper.toDto(attributeConfig)).build();
    }

    public void partialUpdate(Attribute existing, AttributeDTO attributeDTO) {
        existing.setConfigError(attributeDTO.getConfigError());
    }

    public List<AttributeDTO> toDtos(List<Attribute> attributes) {
        return attributes.stream().map(attribute -> toDto(attribute)).collect(Collectors.toList());
    }
}
