package com.sm.service.dto.filter;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DatabindContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.jsontype.impl.TypeIdResolverBase;
import com.fasterxml.jackson.databind.type.TypeFactory;

public class FilterRuleIdResolver extends TypeIdResolverBase {

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
            throw new RuntimeException("pb ici 8888");
        }
        final FilterRuleDTO base = (FilterRuleDTO) obj;
        return base.getFilterRuleType().toDTO();
    }

    @Override
    public JavaType typeFromId(final DatabindContext ctx, final String type) {
        final Class<?> clazz =
            switch (FilterRuleType.fromString(type)) {
                case TEXT_CONTAINS -> TextContainsFilterRuleDTO.class;
                case TEXT_EQUALS -> TextEqualsFilterRuleDTO.class;
                case NUMBER_GT -> NumberGtFilterRuleDTO.class;
                case NUMBER_GTE -> NumberGteFilterRuleDTO.class;
                case NUMBER_LT -> NumberLtFilterRuleDTO.class;
                case NUMBER_LTE -> NumberLteFilterRuleDTO.class;
            };

        return TypeFactory.defaultInstance().constructSpecializedType(javaType, clazz);
    }
}
