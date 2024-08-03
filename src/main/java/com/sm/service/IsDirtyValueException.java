package com.sm.service;

import com.sm.domain.attribute.Attribute;
import lombok.Data;

@Data
public class IsDirtyValueException extends Exception {

    Attribute dirtyAttribute;

    public IsDirtyValueException(Attribute dirtyAttribute) {
        this.dirtyAttribute = dirtyAttribute;
    }
}
