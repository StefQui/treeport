package com.sm.domain;

import com.sm.domain.enumeration.AssetType;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Asset.
 */
@Document(collection = "asset")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Asset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("type")
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
}
