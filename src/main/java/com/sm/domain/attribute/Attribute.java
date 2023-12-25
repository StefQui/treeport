package com.sm.domain.attribute;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sm.domain.Tag;
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

    public static final String SITE_FRAG = "site";
    public static final String PERIOD_FRAG = "period";
    public static final String ATTRIBUTE_PATTERN = "%s:%s:%s:%s:%s";
    public static final int ASSET_TYPE_FRAGMENT_POSITION = 0;
    public static final int ASSET_ID_FRAGMENT_POSITION = 1;
    public static final int ATTRIBUTE_ID_FRAGMENT_POSITION = 2;
    public static final int CAMPAIGN_TYPE_FRAGMENT_POSITION = 3;
    public static final int CAMPAIGN_FRAGMENT_POSITION = 4;

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
    @Builder.Default
    private Boolean isAgg = false;

    @Field("has_config_error")
    @Builder.Default
    private Boolean hasConfigError = false;

    @Field("config_error")
    private String configError;

    @Field("orgaId")
    private String orgaId;

    @Field("siteId")
    private String siteId;

    @Field("configId")
    private String configId;

    @Field("impacterIds")
    private Set<String> impacterIds;

    @Field("aggInfo")
    private AggInfo aggInfo;

    @Field("attributeValue")
    private AttributeValue attributeValue;

    @Field("tags")
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    public String getSiteFragment() {
        if (id == null) {
            return "-";
        }
        return id.split(":")[ASSET_ID_FRAGMENT_POSITION];
    }
}
