package com.sm.domain.attribute;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompoValue extends AttributeValue<List<CompoLine>> {

    private List<CompoLine> value;
}
