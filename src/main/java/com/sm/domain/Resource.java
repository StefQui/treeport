package com.sm.domain;

import com.sm.domain.enumeration.AssetType;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true)
@Document("resource")
public class Resource extends Asset {

    @Builder.Default
    private AssetType type = AssetType.RESOURCE;

    public Resource() {
        super(AssetType.RESOURCE);
    }
}
