package com.sm.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sm.domain.enumeration.AssetType;
import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.NonFinal;
import lombok.experimental.SuperBuilder;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@SuperBuilder(toBuilder = true)
@Document("site")
@NoArgsConstructor
public class Site implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NonFinal
    @Setter
    @JsonIgnore
    ObjectId objectId;

    @NotBlank
    @Field("id")
    String id;

    @Field("name")
    private String name;

    @Field("theType")
    @Builder.Default
    private AssetType type = AssetType.SITE;

    @Field("orgaId")
    private String orgaId;

    @Field("content")
    private String content;

    @Field("parentId")
    private String parentId;

    @Builder.Default
    @Field("childrenIds")
    private List<String> childrenIds = new ArrayList<>();

    @Builder.Default
    @Field("ancestorIds")
    private List<String> ancestorIds = new ArrayList<>();

    @Field("tags")
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    @Field("childrenTags")
    @Builder.Default
    private Set<Tag> childrenTags = new HashSet<>();

    public Boolean isRoot() {
        return parentId == null;
    }
}
