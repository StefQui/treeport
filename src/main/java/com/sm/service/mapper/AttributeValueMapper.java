package com.sm.service.mapper;

import com.sm.domain.attribute.*;
import com.sm.service.dto.attribute.*;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link Attribute} and its DTO {@link AttributeDTO}.
 */
@Component
@AllArgsConstructor
public class AttributeValueMapper {

    private static final Map<String, TypedAttributeValueMapper> mapper = Map.of(
        BooleanValue.class.getName(),
        new BooleanAttributeValueMapper(),
        DoubleValue.class.getName(),
        new DoubleAttributeValueMapper()
    );

    public AttributeValue toEntity(AttributeValueDTO aDTO) {
        if (aDTO == null) {
            return null;
        }
        if (aDTO instanceof BooleanValueDTO) {
            return booleanValueToEntity((BooleanValueDTO) aDTO);
        } else if (aDTO instanceof DoubleValueDTO) {
            return doubleValueToEntity((DoubleValueDTO) aDTO);
        } else if (aDTO instanceof NotResolvableValueDTO) {
            return notResolvaleValueToEntity((NotResolvableValueDTO) aDTO);
        }
        throw new RuntimeException("cannot Map2 " + aDTO);
    }

    private BooleanValue booleanValueToEntity(BooleanValueDTO aDTO) {
        return BooleanValue.builder().value(aDTO.getValue()).build();
    }

    private DoubleValue doubleValueToEntity(DoubleValueDTO aDTO) {
        return DoubleValue.builder().value(aDTO.getValue()).build();
    }

    private NotResolvableValue notResolvaleValueToEntity(NotResolvableValueDTO aDTO) {
        return NotResolvableValue.builder().value(aDTO.getValue()).build();
    }

    public AttributeValueDTO toDto(AttributeValue entity) {
        if (null == entity) {
            return null;
        }
        if (entity instanceof BooleanValue) {
            return booleanValueToDto((BooleanValue) entity);
        } else if (entity instanceof DoubleValue) {
            return doubleValueToDto((DoubleValue) entity);
        } else if (entity instanceof NotResolvableValue) {
            return noResolvableValueToDto((NotResolvableValue) entity);
        }
        throw new RuntimeException("cannot Map " + entity);
    }

    private BooleanValueDTO booleanValueToDto(BooleanValue entity) {
        return BooleanValueDTO.builder().value(entity.getValue()).build();
    }

    private DoubleValueDTO doubleValueToDto(DoubleValue entity) {
        return DoubleValueDTO.builder().value(entity.getValue()).build();
    }

    private NotResolvableValueDTO noResolvableValueToDto(NotResolvableValue entity) {
        return NotResolvableValueDTO.builder().value(entity.getValue()).build();
    }
}
