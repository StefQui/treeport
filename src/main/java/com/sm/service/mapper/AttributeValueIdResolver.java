package com.sm.service.mapper;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DatabindContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.jsontype.impl.TypeIdResolverBase;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.sm.service.dto.attribute.*;

public class AttributeValueIdResolver extends TypeIdResolverBase {

    private JavaType javaType;

    @Override
    public void init(final JavaType javaType) {
        this.javaType = javaType;
    }

    @Override
    public JsonTypeInfo.Id getMechanism() {
        return JsonTypeInfo.Id.CUSTOM;
    }

    @Override
    public String idFromValue(final Object obj) {
        return idFromValueAndType(obj, obj.getClass());
    }

    @Override
    public String idFromBaseType() {
        return idFromValueAndType(null, javaType.getRawClass());
    }

    @Override
    public String idFromValueAndType(final Object obj, final Class clazz) {
        if (obj == null) {
            throw new RuntimeException("pb ici 123456");
        }
        final AttributeValueDTO base = (AttributeValueDTO) obj;
        return base.getAttributeValueType().name();
    }

    @Override
    public JavaType typeFromId(final DatabindContext ctx, final String type) {
        final Class<?> clazz =
            switch (AttributeValueType.fromString(type)) {
                case BOOLEAN_VT -> BooleanValueDTO.class;
                case DOUBLE_VT -> DoubleValueDTO.class;
                case ERROR_VT -> ErrorValueDTO.class;
            };

        return TypeFactory.defaultInstance().constructSpecializedType(javaType, clazz);
    }
}
