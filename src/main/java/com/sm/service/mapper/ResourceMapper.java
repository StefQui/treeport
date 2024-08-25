package com.sm.service.mapper;

import com.sm.domain.Resource;
import com.sm.domain.ResourceWithValues;
import com.sm.service.dto.ResourceDTO;
import com.sm.service.dto.ResourceWithValuesDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

/**
 * Mapper for the entity {@link Resource} and its DTO {@link ResourceDTO}.
 */
@Component
@AllArgsConstructor
public class ResourceMapper {

    private OrganisationMapper organisationMapper;
    private TagMapper tagMapper;
    private AttributeValueMapper attributeValueMapper;

    public ResourceDTO toDto(Resource a) {
        return ResourceDTO
            .builder()
            .orga(organisationMapper.toBasicDto(a.getOrgaId()))
            .id(a.getId())
            .name(a.getName())
            .content(a.getContent())
            .parent(toBasicDto(a.getParentId()))
            .childrens(toDtos(a.getChildrenIds()))
            .tags(tagMapper.toDto(a.getTags()))
            .build();
    }

    private List<ResourceDTO> toDtos(List<String> childrenIds) {
        return childrenIds.stream().map(id -> toBasicDto(id)).collect(Collectors.toList());
    }

    public ResourceDTO toBasicDto(String parentId) {
        return ResourceDTO.builder().id(parentId).build();
    }

    public Resource toEntity(ResourceDTO resourceDTO) {
        return Resource
            .builder()
            .id(resourceDTO.getId())
            .orgaId(resourceDTO.getOrga().getId())
            .name(resourceDTO.getName())
            .content(resourceDTO.getContent())
            .childrenIds(resourceDTO.getChildrens() != null ? toBasicEntitys(resourceDTO.getChildrens()) : new ArrayList<>())
            .parentId(resourceDTO.getParent() != null ? toBasicEntity(resourceDTO.getParent()) : null)
            .tags(tagMapper.toEntity(resourceDTO.getTags()))
            .build();
    }

    private String toBasicEntity(ResourceDTO a) {
        return a.getId();
    }

    public void partialUpdate(Resource existingResource, ResourceDTO resourceDTO) {
        existingResource.setName(resourceDTO.getName());
        existingResource.setContent(resourceDTO.getContent());
        existingResource.setOrgaId(resourceDTO.getOrga().getId());
        existingResource.setParentId(resourceDTO.getParent() != null ? resourceDTO.getParent().getId() : null);
        existingResource.setChildrenIds(
            CollectionUtils.isEmpty(resourceDTO.getChildrens()) ? new ArrayList<>() : toBasicEntitys(resourceDTO.getChildrens())
        );
    }

    private List<String> toBasicEntitys(List<ResourceDTO> children) {
        return children.stream().map(ResourceDTO::getId).collect(Collectors.toList());
    }

    public ResourceWithValuesDTO toDtoWithValues(ResourceWithValues resourceWithValues) {
        ResourceDTO rDTO = toDto(resourceWithValues);
        ResourceWithValuesDTO result = ResourceWithValuesDTO
            .builder()
            .id(rDTO.getId())
            .name(rDTO.getName())
            .childrenCount((long) resourceWithValues.getChildrenIds().size())
            .tags(tagMapper.toDto(resourceWithValues.getTags()))
            .attributeValues(
                resourceWithValues
                    .getAttributeValues()
                    .entrySet()
                    .stream()
                    .collect(Collectors.toMap(e -> e.getKey(), e -> attributeValueMapper.toDto(e.getValue())))
            )
            .build();
        return result;
    }
}
