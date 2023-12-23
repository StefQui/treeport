package com.sm.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sm.domain.enumeration.AttributeType;
import com.sm.domain.enumeration.OperationType;
import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import lombok.*;
import lombok.experimental.NonFinal;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A AttributeConfig.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Document(collection = "attribute_config")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AttributeConfig implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NonFinal
    @Setter
    @JsonIgnore
    ObjectId objectId;

    @NotBlank
    @Field("id")
    String id;

    @Field("apply_on_children")
    private Boolean applyOnChildren;

    @Field("is_consolidable")
    private Boolean isConsolidable;

    @Field("related_config_id")
    private String relatedConfigId;

    @Field("attribute_type")
    private AttributeType attributeType;

    @Field("is_writable")
    private Boolean isWritable;

    @Field("conso_parameter_key")
    private String consoParameterKey;

    @Field("conso_operation_type")
    private OperationType consoOperationType;

    @Field("orgaId")
    private String orgaId;

    @Field("siteId")
    private String siteId;

    @Field("tags")
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
}
