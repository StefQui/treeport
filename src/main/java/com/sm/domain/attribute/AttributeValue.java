package com.sm.domain.attribute;

public abstract class AttributeValue<T> {

    public abstract T getValue();

    public abstract void setValue(T t);

    public boolean isError() {
        return this instanceof ErrorValue;
    }
}
