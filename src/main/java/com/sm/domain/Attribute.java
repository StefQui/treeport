package com.sm.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
 * A Attribute.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Document(collection = "attribute")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Attribute implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NonFinal
    @Setter
    @JsonIgnore
    ObjectId objectId;

    @NotBlank
    @Field("id")
    String id;

    @Field("is_agg")
    private Boolean isAgg;

    @Field("has_config_error")
    private Boolean hasConfigError;

    @Field("config_error")
    private String configError;

    @Field("orgaId")
    private String orgaId;

    @Field("siteId")
    private String siteId;

    @Field("configId")
    private String configId;

    @Field("tags")
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
}
