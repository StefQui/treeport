package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotResolvableValue extends AttributeValue {

    private String value;

    @Override
    public void setValue(Object o) {
        throw new RuntimeException("pas nomal ici");
    }
}
