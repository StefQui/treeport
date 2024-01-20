package com.sm.service.dto.filter;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DatabindContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.jsontype.impl.TypeIdResolverBase;
import com.fasterxml.jackson.databind.type.TypeFactory;

public class ResourceFilterIdResolver extends TypeIdResolverBase {

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
            throw new RuntimeException("pb ici 7777");
        }
        final ResourceFilterDTO base = (ResourceFilterDTO) obj;
        return base.getFilterType().toDTO();
    }

    @Override
    public JavaType typeFromId(final DatabindContext ctx, final String type) {
        final Class<?> clazz =
            switch (FilterType.fromString(type)) {
                case AND -> AndFilterDTO.class;
                case OR -> OrFilterDTO.class;
                case SEARCH_NAME -> SearchNameFilterDTO.class;
            };

        return TypeFactory.defaultInstance().constructSpecializedType(javaType, clazz);
    }
}
