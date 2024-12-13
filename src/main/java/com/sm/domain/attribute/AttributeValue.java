package com.sm.domain.attribute;

public abstract class AttributeValue<T> {

    public abstract T getValue();

    public abstract void setValue(T t);

    public boolean isError() {
        return this instanceof ErrorValue;
    }

    public boolean isNull() {
        return getValue() == null;
    }

    public boolean isErrorRefToNull() {
        return this instanceof ErrorValue && ((ErrorValue) this).isRefToNull();
    }
}
