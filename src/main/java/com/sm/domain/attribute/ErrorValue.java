package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorValue extends AttributeValue {

    private String value;

    @Builder.Default
    private boolean isRefToNull = false;

    @Override
    public void setValue(Object o) {
        throw new RuntimeException("pas nomal ici");
    }
}
