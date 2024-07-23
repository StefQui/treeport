package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.BOOLEAN;
import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.service.ComputeTestUtils.constant;
import static com.sm.service.InitialLoadService.COCA;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.Attribute;
import com.sm.domain.operation.*;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ComputeServiceFetchImpactersTest extends AbstractComputeServiceTest {

    @Test
    public void testFetchImpactersSum() {
        AttributeConfig c = attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to1")
                .key("to1")
                .siteIds(List.of("s1"))
                .configOrder(0)
                .operation(
                    SumOperation
                        .builder()
                        .items(
                            List.of(
                                RefOperation.builder().fixedSite("s2").useCurrentSite(false).key("other").build(),
                                RefOperation.builder().fixedSite("s3").useCurrentSite(false).key("other2").build()
                            )
                        )
                        .build()
                )
                .campaignId("2023")
                .build()
        );
        computeService.applyCampaigns(COCA, List.of("2023"));
        computeService.reCalculateSomeAttributes(Set.of("site:s1:to1:period:2023"), COCA);
        Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:to1:period:2023", COCA).get(0);
        //        computeService.fetchImpactersForConfigAndApplyToAttribute(c, att, COCA);

        assertThat(att.getImpacterIds()).containsExactlyInAnyOrder("site:s2:other:period:2023", "site:s3:other2:period:2023");
    }

    @Test
    public void testFetchImpactersChildrenSum() {
        AttributeConfig c = attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to1")
                .key("to1")
                .configOrder(0)
                .siteIds(List.of("s1"))
                .operation(ChildrenSumOperation.builder().itemsKey("toSite").build())
                .campaignId("2023")
                .build()
        );
        AttributeConfig c2 = attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("toSiteId")
                .key("toSite")
                .configOrder(0)
                .siteIds(List.of("s1-1", "s1-2"))
                .operation(constant(DOUBLE, 2.5))
                .campaignId("2023")
                .build()
        );
        computeService.applyCampaigns(COCA, List.of("2023"));
        computeService.reCalculateSomeAttributes(
            Set.of("site:s1-2:toSite:period:2023", "site:s1:to1:period:2023", "site:s1-1:toSite:period:2023"),
            COCA
        );
        Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:to1:period:2023", COCA).get(0);

        assertThat(att.getImpacterIds()).containsExactlyInAnyOrder("site:s1-2:toSite:period:2023", "site:s1-1:toSite:period:2023");
        assertThat(att.getAttributeValue().getValue()).isEqualTo(5.);
    }

    @Test
    public void testFetchImpactersChildrenComparison() {
        AttributeConfig c = attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to1")
                .key("to1")
                .configOrder(0)
                .siteIds(List.of("s1"))
                .operation(
                    ComparisonOperation
                        .builder()
                        .comparisonType(ComparisonType.GT)
                        .first(RefOperation.builder().fixedSite("s2").useCurrentSite(false).key("other2").build())
                        .second(RefOperation.builder().fixedSite("s3").useCurrentSite(false).key("other3").build())
                        .build()
                )
                .campaignId("2023")
                .build()
        );
        computeService.applyCampaigns(COCA, List.of("2023"));
        computeService.reCalculateSomeAttributes(Set.of("site:s1:to1:period:2023"), COCA);
        Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:to1:period:2023", COCA).get(0);

        assertThat(att.getImpacterIds()).containsExactlyInAnyOrder("site:s2:other2:period:2023", "site:s3:other3:period:2023");
        assertThat(att.getDirty()).isFalse();
        //        assertThat(att.getHasDynamicImpacters()).isFalse();
    }

    @Test
    public void testFetchImpactersIfThenElse() {
        AttributeConfig c = attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to1")
                .key("to1")
                .configOrder(0)
                .siteIds(List.of("s1"))
                .operation(
                    IfThenElseOperation
                        .builder()
                        .ifThens(List.of(IfThen.builder().ifOp(constant(BOOLEAN, true)).thenOp(constant(DOUBLE, 4.)).build()))
                        .elseOp(RefOperation.builder().fixedSite("s2").useCurrentSite(false).key("other2").build())
                        .build()
                )
                .campaignId("2023")
                .build()
        );
        computeService.applyCampaigns(COCA, List.of("2023"));
        computeService.reCalculateSomeAttributes(Set.of("site:s1:to1:period:2023"), COCA);
        Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:to1:period:2023", COCA).get(0);

        assertThat(att.getImpacterIds()).isEmpty();
        assertThat(att.getDirty()).isFalse();
        //        assertThat(att.getHasDynamicImpacters()).isTrue();
    }
}
