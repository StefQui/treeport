package com.sm.service.mapper;

import com.sm.domain.Site;
import com.sm.service.dto.SiteDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

/**
 * Mapper for the entity {@link Site} and its DTO {@link SiteDTO}.
 */
@Component
@AllArgsConstructor
public class SiteMapper {

    private OrganisationMapper organisationMapper;
    private TagMapper tagMapper;

    public SiteDTO toDto(Site a) {
        return SiteDTO
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

    private List<SiteDTO> toDtos(List<String> childrenIds) {
        return childrenIds.stream().map(id -> toBasicDto(id)).collect(Collectors.toList());
    }

    public SiteDTO toBasicDto(String parentId) {
        return SiteDTO.builder().id(parentId).build();
    }

    public Site toEntity(SiteDTO siteDTO) {
        return Site
            .builder()
            .id(siteDTO.getId())
            .orgaId(siteDTO.getOrga().getId())
            .name(siteDTO.getName())
            .content(siteDTO.getContent())
            .childrenIds(siteDTO.getChildrens() != null ? toBasicEntitys(siteDTO.getChildrens()) : new ArrayList<>())
            .parentId(siteDTO.getParent() != null ? toBasicEntity(siteDTO.getParent()) : null)
            .tags(tagMapper.toEntity(siteDTO.getTags()))
            .build();
    }

    private String toBasicEntity(SiteDTO a) {
        return a.getId();
    }

    public void partialUpdate(Site existingSite, SiteDTO siteDTO) {
        existingSite.setName(siteDTO.getName());
        existingSite.setContent(siteDTO.getContent());
        existingSite.setOrgaId(siteDTO.getOrga().getId());
        existingSite.setParentId(siteDTO.getParent() != null ? siteDTO.getParent().getId() : null);
        existingSite.setChildrenIds(
            CollectionUtils.isEmpty(siteDTO.getChildrens()) ? new ArrayList<>() : toBasicEntitys(siteDTO.getChildrens())
        );
    }

    private List<String> toBasicEntitys(List<SiteDTO> children) {
        return children.stream().map(SiteDTO::getId).collect(Collectors.toList());
    }
}
