package com.sm.service.dto.filter;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DatabindContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.jsontype.impl.TypeIdResolverBase;
import com.fasterxml.jackson.databind.type.TypeFactory;

public class ColumnDefinitionIdResolver extends TypeIdResolverBase {

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
            throw new RuntimeException("pb ici 8678");
        }
        final ColumnDefinitionDTO base = (ColumnDefinitionDTO) obj;
        return base.getColumnType().name().toLowerCase();
    }

    @Override
    public JavaType typeFromId(final DatabindContext ctx, final String type) {
        final Class<?> clazz =
            switch (ColumnType.fromString(type)) {
                case ID -> IdColumnDTO.class;
                case NAME -> NameColumnDTO.class;
                case TAGS -> TagsColumnDTO.class;
                case ATTRIBUTE -> AttributeColumnDTO.class;
                case BUTTON -> ButtonColumnDTO.class;
            };

        return TypeFactory.defaultInstance().constructSpecializedType(javaType, clazz);
    }
}
