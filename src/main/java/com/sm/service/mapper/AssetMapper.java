package com.sm.service.mapper;

import com.sm.domain.Asset;
import com.sm.service.dto.AssetDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

/**
 * Mapper for the entity {@link Asset} and its DTO {@link AssetDTO}.
 */
@Component
@AllArgsConstructor
public class AssetMapper {

    private OrganisationMapper organisationMapper;

    public AssetDTO toDto(Asset a) {
        return AssetDTO
            .builder()
            .orga(organisationMapper.toBasicDto(a.getOrgaId()))
            .id(a.getId())
            .name(a.getName())
            .parent(toBasicDto(a.getParentId()))
            .type(a.getType())
            .childrens(toDtos(a.getChildrenIds()))
            .build();
    }

    private List<AssetDTO> toDtos(List<String> childrenIds) {
        return childrenIds.stream().map(id -> toBasicDto(id)).collect(Collectors.toList());
    }

    private AssetDTO toBasicDto(String parentId) {
        return AssetDTO.builder().id(parentId).build();
    }

    public Asset toEntity(AssetDTO assetDTO) {
        return Asset
            .builder()
            .id(assetDTO.getId())
            .orgaId(assetDTO.getOrga().getId())
            .name(assetDTO.getName())
            .type(assetDTO.getType())
            .childrenIds(assetDTO.getChildrens() != null ? toBasicEntitys(assetDTO.getChildrens()) : new ArrayList<>())
            .parentId(assetDTO.getParent() != null ? toBasicEntity(assetDTO.getParent()) : null)
            .build();
    }

    private String toBasicEntity(AssetDTO a) {
        return a.getId();
    }

    public void partialUpdate(Asset existingAsset, AssetDTO assetDTO) {
        existingAsset.setName(assetDTO.getName());
        existingAsset.setOrgaId(assetDTO.getOrga().getId());
        existingAsset.setType(assetDTO.getType());
        existingAsset.setParentId(assetDTO.getParent() != null ? assetDTO.getParent().getId() : null);
        existingAsset.setChildrenIds(
            CollectionUtils.isEmpty(assetDTO.getChildrens()) ? new ArrayList<>() : toBasicEntitys(assetDTO.getChildrens())
        );
    }

    private List<String> toBasicEntitys(List<AssetDTO> children) {
        return children.stream().map(AssetDTO::getId).collect(Collectors.toList());
    }
}
