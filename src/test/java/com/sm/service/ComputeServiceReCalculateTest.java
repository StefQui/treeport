package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.COST_TYPE;
import static com.sm.domain.attribute.Unit.kgNox;
import static com.sm.domain.attribute.Unit.tCo2;
import static com.sm.service.CalculatorService.CANNOT_RESOLVE_IF_STATEMENT_AS_A_BOOLEAN;
import static com.sm.service.CalculatorService.CANNOT_RESOLVE_THEN_STATEMENT;
import static com.sm.service.CalculatorService.REFERENCED_ATTRIBUTE_HAS_NO_VALUE;
import static com.sm.service.CalculatorService.wrapMessage;
import static com.sm.service.ComputeTestUtils.refOp;
import static com.sm.service.InitialLoadService.COCA;
import static com.sm.service.InitialLoadService.ROOT;
import static com.sm.service.UtilsValue.CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.*;
import com.sm.domain.operation.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;

class ComputeServiceReCalculateTest extends AbstractComputeServiceTest {

    @Test
    public void testRecalculateWithSum() {
        writableOnS1("w3");
        writableOnS1("w7");
        writableOnS1("w8");
        writableOnS1("w11");

        notWritableOnS1("a6", refSum("w7"));
        notWritableOnS1("a4", refSum("a6", "w8"));
        notWritableOnS1("a2", refSum("w3", "a4"));
        notWritableOnS1("a10", refSum("w11"));
        notWritableOnS1("a9", refSum("a10", "a6"));
        notWritableOnS1("a12", refSum("a6", "a4"));
        notWritableOnS1("a1", refSum("a9", "a2"));

        computeService.applyCampaigns(COCA, List.of("2023"));
        computeService.reCalculateSomeAttributes(
            Set.of("site:s1:a2:period:2023", "site:s1:a9:period:2023", "site:s1:a1:period:2023", "site:s1:a12:period:2023"),
            COCA
        );

        assertNotResolvables(CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE, "a1", "a9", "a10", "a12", "a2", "a4", "a6");

        setDoubleValueAndRecalculate("w7", 2.);
        assertNotResolvables(CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE, "a1", "a9", "a10", "a12", "a2", "a4");
        assertIsDouble("a6", 2.);

        setDoubleValueAndRecalculate("w11", 3.);
        assertNotResolvables(CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE, "a1", "a12", "a2", "a4");
        assertIsDouble("a6", 2.);
        assertIsDouble("a10", 3.);
        assertIsDouble("a9", 5.);

        setDoubleValueAndRecalculate("w8", 7.);
        assertNotResolvables(CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE, "a1", "a2");
        assertIsDouble("a6", 2.);
        assertIsDouble("a10", 3.);
        assertIsDouble("a9", 5.);
        assertIsDouble("a4", 9.);
        assertIsDouble("a12", 11.);

        setDoubleValueAndRecalculate("w3", 11.5);
        assertIsDouble("a6", 2.);
        assertIsDouble("a10", 3.);
        assertIsDouble("a9", 5.);
        assertIsDouble("a4", 9.);
        assertIsDouble("a12", 11.);
        assertIsDouble("a2", 20.5);
        assertIsDouble("a1", 25.5);

        setDoubleValueAndRecalculate("w7", 100);
        assertIsDouble("a6", 100.);
        assertIsDouble("a10", 3.);
        assertIsDouble("a9", 103.);
        assertIsDouble("a4", 107.);
        assertIsDouble("a12", 207.);
        assertIsDouble("a2", 118.5);
        assertIsDouble("a1", 221.5);
    }

    @Test
    public void testRecalculateWithIfThenElse() {
        writableOnS1("wif1");
        writableOnS1("wthen1");
        writableOnS1("wif2");
        writableOnS1("wthen2");
        writableOnS1("welse");

        notWritableOnS1(
            "a1",
            IfThenElseOperation
                .builder()
                .ifThens(
                    List.of(
                        IfThen.builder().ifOp(refOp("wif1")).thenOp(refOp("wthen1")).build(),
                        IfThen.builder().ifOp(refOp("wif2")).thenOp(refOp("wthen2")).build()
                    )
                )
                .elseOp(refOp("welse"))
                .build()
        );

        computeService.applyCampaigns(COCA, List.of("2023"));
        computeService.reCalculateSomeAttributes(Set.of("site:s1:a1:period:2023"), COCA);

        assertNotResolvables(CANNOT_RESOLVE_IF_STATEMENT_AS_A_BOOLEAN, "a1");

        setBooleanValueAndRecalculate("wif2", true);
        setDoubleValueAndRecalculate("wthen2", 10);
        assertNotResolvables(CANNOT_RESOLVE_IF_STATEMENT_AS_A_BOOLEAN, "a1");

        setBooleanValueAndRecalculate("wif1", false);
        assertIsDouble("a1", 10.);

        setBooleanValueAndRecalculate("wif1", true);
        assertNotResolvables(wrapMessage(CANNOT_RESOLVE_THEN_STATEMENT, REFERENCED_ATTRIBUTE_HAS_NO_VALUE), "a1");

        setDoubleValueAndRecalculate("wthen1", 5.);
        assertIsDouble("a1", 5.);

        setDoubleValueAndRecalculate("welse", 7.);
        assertIsDouble("a1", 5.);

        setBooleanValueAndRecalculate("wif1", false);
        setBooleanValueAndRecalculate("wif2", false);
        assertIsDouble("a1", 7.);
    }

    @Test
    public void testRecalculateWithInfiniteLoop() {
        writableOnS1("w1");
        writableOnS1("w2");
        writableOnS1("w3");

        notWritableOnS1("a1", refSum("a2", "a6"));
        notWritableOnS1("a2", refSum("a3", "a4"));
        notWritableOnS1("a3", refSum("w1"));
        notWritableOnS1("a4", refSum("w2"));
        notWritableOnS1("a6", refSum("a5"));
        notWritableOnS1("a5", refSum("w3", "a1"));

        computeService.applyCampaigns(COCA, List.of("2023"));
        computeService.reCalculateSomeAttributes(Set.of("site:s1:a1:period:2023"), COCA);

        assertNotResolvables(CANNOT_RESOLVE_IF_STATEMENT_AS_A_BOOLEAN, "a1");
    }

    @Test
    public void testRecalculateWithConsoCost() {
        writable("wCost");

        attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("consoCost")
                .key("consoCost")
                .isWritable(false)
                .attributeType(COST_TYPE)
                .siteId(ROOT)
                .orgaId(COCA)
                .applyOnChildren(true)
                .isConsolidable(true)
                .configOrder(0)
                .consoOperationType(OperationType.CONSO_COST_SUM)
                .defaultValue(
                    Map.of(
                        "co2",
                        CostLine.builder().quantity(0.).unit(tCo2).build(),
                        "nox",
                        CostLine.builder().quantity(0.).unit(kgNox).build(),
                        "ene",
                        CostLine.builder().quantity(0.).unit(Unit.j).build()
                    )
                )
                .defaultValueForNotResolvableItem(
                    Map.of(
                        "co2",
                        CostLine.builder().quantity(0.).unit(tCo2).build(),
                        "nox",
                        CostLine.builder().quantity(0.).unit(kgNox).build(),
                        "ene",
                        CostLine.builder().quantity(0.).unit(Unit.j).build()
                    )
                )
                .consoPreferredUnits(Map.of("nox", kgNox, "co2", tCo2, "ene", Unit.j))
                .consoOperation(
                    CostOperation
                        .builder()
                        .costKey("wCost")
                        .preferredUnits(Map.of("nox", kgNox, "co2", tCo2, "ene", Unit.j))
                        .operation(refOp("wCost"))
                        .build()
                )
                .campaignId("2023")
                .build()
        );

        computeService.applyCampaigns(COCA, List.of("2023"));
        computeService.reCalculateAllAttributes(COCA);

        setCostValueOnSiteAndRecalculate(
            "wCost",
            "s1-1",
            Map.of(
                "co2",
                CostLine.builder().quantity(2.).unit(tCo2).build(),
                "nox",
                CostLine.builder().quantity(3.).unit(kgNox).build(),
                "ene",
                CostLine.builder().quantity(4.).unit(Unit.j).build()
            )
        );
        setCostValueOnSiteAndRecalculate(
            "wCost",
            "s1-2",
            Map.of(
                "co2",
                CostLine.builder().quantity(10.).unit(tCo2).build(),
                "nox",
                CostLine.builder().quantity(20.).unit(kgNox).build(),
                "ene",
                CostLine.builder().quantity(30.).unit(Unit.j).build()
            )
        );

        assertNotResolvables(CANNOT_RESOLVE_IF_STATEMENT_AS_A_BOOLEAN, "a1");
    }

    private void assertNotResolvables(String message, String... atts) {
        Arrays
            .stream(atts)
            .forEach(attId -> {
                Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:" + attId + ":period:2023", COCA).get(0);
                assertThat(att.getAttributeValue()).isInstanceOf(NotResolvableValue.class);
                assertThat(att.getAttributeValue().getValue()).isEqualTo(message);
            });
    }

    private void assertIsDouble(String a, Double d) {
        Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:" + a + ":period:2023", COCA).get(0);
        assertThat(att.getAttributeValue()).isInstanceOf(DoubleValue.class);
        assertThat(att.getAttributeValue().getValue()).isEqualTo(d);
    }

    private void setDoubleValueAndRecalculate(String w, double v) {
        Attribute attw = attributeService.findByIdAndOrgaId("site:s1:" + w + ":period:2023", COCA).get();
        attw.setAttributeValue(DoubleValue.builder().value(v).build());
        attributeService.save(attw);
        computeService.reCalculateSomeAttributes(Set.of("site:s1:" + w + ":period:2023"), COCA);
    }

    private void setBooleanValueAndRecalculate(String w, boolean b) {
        Attribute attw = attributeService.findByIdAndOrgaId("site:s1:" + w + ":period:2023", COCA).get();
        attw.setAttributeValue(BooleanValue.builder().value(b).build());
        attributeService.save(attw);
        computeService.reCalculateSomeAttributes(Set.of("site:s1:" + w + ":period:2023"), COCA);
    }

    private void setCostValueOnSiteAndRecalculate(String w, String siteId, Map<String, CostLine> v) {
        Attribute attw = attributeService.findByIdAndOrgaId("site:" + siteId + ":" + w + ":period:2023", COCA).get();
        attw.setAttributeValue(CostValue.builder().value(v).build());
        attributeService.save(attw);
        computeService.reCalculateSomeAttributes(Set.of("site:" + siteId + ":" + w + ":period:2023"), COCA);
    }

    private List<Operation> refSum(String... ids) {
        return Arrays.stream(ids).map(id -> RefOperation.builder().useCurrentSite(true).key(id).build()).collect(Collectors.toList());
    }

    private AttributeConfig writableOnS1(String w) {
        return attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id(w)
                .key(w)
                .siteIds(List.of("s1"))
                .configOrder(0)
                .isWritable(true)
                .campaignId("2023")
                .build()
        );
    }

    private AttributeConfig writable(String w) {
        return attributeConfigService.save(
            notWritableAttributeConfigWithNoScope().id(w).key(w).configOrder(0).isWritable(true).campaignId("2023").build()
        );
    }

    private AttributeConfig notWritableOnS1(String a, List<Operation> refs) {
        return attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id(a)
                .key(a)
                .siteIds(List.of("s1"))
                .configOrder(0)
                .operation(SumOperation.builder().items(refs).build())
                .campaignId("2023")
                .build()
        );
    }

    private AttributeConfig notWritableOnS1(String a, Operation op) {
        return attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id(a)
                .key(a)
                .siteIds(List.of("s1"))
                .configOrder(0)
                .operation(op)
                .campaignId("2023")
                .build()
        );
    }
}
