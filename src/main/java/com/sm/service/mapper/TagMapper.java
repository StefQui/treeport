package com.sm.service.mapper;

import com.sm.domain.Tag;
import com.sm.service.dto.TagDTO;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link Tag} and its DTO {@link TagDTO}.
 */
@Component
@AllArgsConstructor
public class TagMapper {

    private OrganisationMapper organisationMapper;

    public Tag toEntity(TagDTO t) {
        return Tag.builder().id(t.getId()).name(t.getName()).orgaId(t.getOrga().getId()).build();
    }

    public TagDTO toDto(Tag t) {
        return TagDTO.builder().id(t.getId()).name(t.getName()).orga(organisationMapper.toBasicDto(t.getOrgaId())).build();
    }

    public void partialUpdate(Tag existing, TagDTO dto) {
        existing.setName(dto.getName());
    }

    public Set<Tag> toEntity(Set<TagDTO> tags) {
        return tags.stream().map(tagDTO -> toEntity(tagDTO)).collect(Collectors.toSet());
    }

    public Set<TagDTO> toDto(Set<Tag> tags) {
        return tags.stream().map(tag -> toDto(tag)).collect(Collectors.toSet());
    }
}
