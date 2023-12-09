package com.sm.service.mapper;

import com.sm.domain.Asset;
import com.sm.domain.Organisation;
import com.sm.service.dto.AssetDTO;
import com.sm.service.dto.OrganisationDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Asset} and its DTO {@link AssetDTO}.
 */
@Mapper(componentModel = "spring")
public interface AssetMapper extends EntityMapper<AssetDTO, Asset> {
    @Mapping(target = "orga", source = "orga", qualifiedByName = "organisationId")
    @Mapping(target = "parent", source = "parent", qualifiedByName = "assetId")
    @Mapping(target = "childrens", source = "childrens", qualifiedByName = "assetIdSet")
    AssetDTO toDto(Asset s);

    @Mapping(target = "removeChildrens", ignore = true)
    Asset toEntity(AssetDTO assetDTO);

    @Named("organisationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OrganisationDTO toDtoOrganisationId(Organisation organisation);

    @Named("assetId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AssetDTO toDtoAssetId(Asset asset);

    @Named("assetIdSet")
    default Set<AssetDTO> toDtoAssetIdSet(Set<Asset> asset) {
        return asset.stream().map(this::toDtoAssetId).collect(Collectors.toSet());
    }
}
