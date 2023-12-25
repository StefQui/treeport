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
import lombok.Setter;
import lombok.experimental.NonFinal;
import lombok.experimental.SuperBuilder;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Asset.
 */
@Data
@SuperBuilder(toBuilder = true)
public abstract class Asset implements Serializable {

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
    private AssetType type;

    @Field("orgaId")
    private String orgaId;

    @Field("content")
    private String content;

    @Field("parentId")
    private String parentId;

    @Builder.Default
    @Field("childrenIds")
    private List<String> childrenIds = new ArrayList<>();

    @Field("tags")
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    public Asset(AssetType type) {
        this.type = type;
    }

    public Boolean isRoot() {
        return parentId == null;
    }
}
