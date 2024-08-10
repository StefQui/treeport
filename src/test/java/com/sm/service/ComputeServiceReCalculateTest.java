package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.COST_TYPE;
import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.domain.attribute.Unit.kgNox;
import static com.sm.domain.attribute.Unit.tCo2;
import static com.sm.service.ComputeTestUtils.refOp;
import static com.sm.service.InitialLoadService.COCA;
import static com.sm.service.InitialLoadService.ROOT;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.*;
import com.sm.domain.operation.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Nested;
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

        //        assertNotResolvables(CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE, "a1", "a9", "a10", "a12", "a2", "a4", "a6");
        assertErrors("a1", "a9", "a10", "a12", "a2", "a4", "a6");

        setDoubleValueAndRecalculate("s1", "w7", 2.);
        assertErrors("a1", "a9", "a10", "a12", "a2", "a4");
        assertIsDouble("a6", 2.);

        setDoubleValueAndRecalculate("s1", "w11", 3.);
        assertErrors("a1", "a12", "a2", "a4");
        assertIsDouble("a6", 2.);
        assertIsDouble("a10", 3.);
        assertIsDouble("a9", 5.);

        setDoubleValueAndRecalculate("s1", "w8", 7.);
        assertErrors("a1", "a2");
        assertIsDouble("a6", 2.);
        assertIsDouble("a10", 3.);
        assertIsDouble("a9", 5.);
        assertIsDouble("a4", 9.);
        assertIsDouble("a12", 11.);

        setDoubleValueAndRecalculate("s1", "w3", 11.5);
        assertIsDouble("a6", 2.);
        assertIsDouble("a10", 3.);
        assertIsDouble("a9", 5.);
        assertIsDouble("a4", 9.);
        assertIsDouble("a12", 11.);
        assertIsDouble("a2", 20.5);
        assertIsDouble("a1", 25.5);

        setDoubleValueAndRecalculate("s1", "w7", 100.);
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

        assertErrors("a1");

        setBooleanValueAndRecalculate("wif2", true);
        setDoubleValueAndRecalculate("s1", "wthen2", 10.);
        assertErrors("a1");

        setBooleanValueAndRecalculate("wif1", false);
        assertIsDouble("a1", 10.);

        setBooleanValueAndRecalculate("wif1", true);
        assertErrors("a1");

        setDoubleValueAndRecalculate("s1", "wthen1", 5.);
        assertIsDouble("a1", 5.);

        setDoubleValueAndRecalculate("s1", "welse", 7.);
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

        assertErrors("a1");
    }

    @Nested
    class ConsoCost {

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

            assertIsCost(
                "s1",
                "consoCost",
                Map.of(
                    "co2",
                    CostLine.builder().quantity(12.).unit(tCo2).build(),
                    "nox",
                    CostLine.builder().quantity(23.).unit(kgNox).build(),
                    "ene",
                    CostLine.builder().quantity(34.).unit(Unit.j).build()
                )
            );
        }
    }

    @Nested
    class ConsoDouble {

        @Test
        public void testRecalculateWithConsoDouble() {
            writable("wDouble");

            attributeConfigService.save(
                notWritableAttributeConfigWithNoScope()
                    .id("consoDouble")
                    .key("consoDouble")
                    .isWritable(false)
                    .attributeType(DOUBLE)
                    .siteId(ROOT)
                    .orgaId(COCA)
                    .applyOnChildren(true)
                    .isConsolidable(true)
                    .configOrder(0)
                    .consoOperationType(OperationType.CONSO_SUM)
                    .defaultValue(0.)
                    .consoOperation(RefOperation.builder().useCurrentSite(true).key("wDouble").build())
                    .campaignId("2023")
                    .build()
            );

            computeService.applyCampaigns(COCA, List.of("2023"));
            computeService.reCalculateAllAttributes(COCA);

            assertIsDouble("consoDouble", 0.);

            setDoubleValueAndRecalculate("s1-1", "wDouble", 2.);
            setDoubleValueAndRecalculate("s1-2", "wDouble", 3.);

            assertIsDouble("consoDouble", 5.);
        }

        @Test
        public void testRecalculateWithConsoDoubleAndNoDefault() {
            writable("wDouble");

            attributeConfigService.save(
                notWritableAttributeConfigWithNoScope()
                    .id("consoDouble")
                    .key("consoDouble")
                    .isWritable(false)
                    .attributeType(DOUBLE)
                    .siteId(ROOT)
                    .orgaId(COCA)
                    .applyOnChildren(true)
                    .isConsolidable(true)
                    .configOrder(0)
                    .consoOperationType(OperationType.CONSO_SUM)
                    .consoOperation(RefOperation.builder().useCurrentSite(true).key("wDouble").build())
                    .campaignId("2023")
                    .build()
            );

            computeService.applyCampaigns(COCA, List.of("2023"));
            computeService.reCalculateAllAttributes(COCA);

            Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:consoDouble:period:2023", COCA).get(0);
            assertThat(att.getAttributeValue()).isInstanceOf(ErrorValue.class);
            ErrorValue valToConsolidateError = (ErrorValue) UtilsValue.buildValueToConsolidateIsNullOrInError(null, null).getResultValue();
            String errorMessage = (String) UtilsValue
                .buildValueToConsolidateIsNotResolvableResult(
                    null,
                    null,
                    UtilsValue.generateErrorValues(List.of(valToConsolidateError, valToConsolidateError))
                )
                .getResultValue()
                .getValue();
            assertThat(att.getAttributeValue().getValue()).isEqualTo(errorMessage);

            setDoubleValueAndRecalculate("s1-1", "wDouble", 2.);
            setDoubleValueAndRecalculate("s1-2", "wDouble", 3.);

            att = attributeRepository.findByIdAndOrgaId("site:s1:consoDouble:period:2023", COCA).get(0);
            assertThat(att.getAttributeValue()).isInstanceOf(ErrorValue.class);
            assertThat(att.getAttributeValue().getValue())
                .isEqualTo(UtilsValue.buildValueToConsolidateIsNullOrInError(null, null).getResultValue().getValue());

            setDoubleValueAndRecalculate("s1", "wDouble", 7.);

            assertIsDouble("consoDouble", 12.);

            setDoubleValueAndRecalculate("s1-1", "wDouble", null);
            setDoubleValueAndRecalculate("s1-2", "wDouble", null);

            att = attributeRepository.findByIdAndOrgaId("site:s1:consoDouble:period:2023", COCA).get(0);
            assertThat(att.getAttributeValue()).isInstanceOf(ErrorValue.class);
            assertThat(att.getAttributeValue().getValue()).isEqualTo(errorMessage);
        }
    }

    //    private void assertNotResolvables(String message, String... atts) {
    //        Arrays
    //            .stream(atts)
    //            .forEach(attId -> {
    //                Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:" + attId + ":period:2023", COCA).get(0);
    //                assertThat(att.getAttributeValue()).isInstanceOf(NotResolvableValue.class);
    //                assertThat(att.getAttributeValue().getValue()).isEqualTo(message);
    //            });
    //    }

    private void assertErrors(String... atts) {
        Arrays
            .stream(atts)
            .forEach(attId -> {
                Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:" + attId + ":period:2023", COCA).get(0);
                assertThat(att.getAttributeValue()).isInstanceOf(ErrorValue.class);
            });
    }

    private void assertNullValues(String... atts) {
        Arrays
            .stream(atts)
            .forEach(attId -> {
                Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:" + attId + ":period:2023", COCA).get(0);
                assertThat(att.isNull()).isTrue();
            });
    }

    private void assertIsDouble(String a, Double d) {
        Attribute att = attributeRepository.findByIdAndOrgaId("site:s1:" + a + ":period:2023", COCA).get(0);
        assertThat(att.getAttributeValue()).isInstanceOf(DoubleValue.class);
        assertThat(att.getAttributeValue().getValue()).isEqualTo(d);
    }

    private void assertIsCost(String s, String configId, Map<String, CostLine> cv) {
        Attribute att = attributeRepository.findByIdAndOrgaId("site:" + s + ":" + configId + ":period:2023", COCA).get(0);
        assertThat(att.getAttributeValue()).isInstanceOf(CostValue.class);
        assertThat(att.getAttributeValue().getValue()).isEqualTo(cv);
    }

    private void setDoubleValueAndRecalculate(String s, String w, Double v) {
        Attribute attw = attributeService.findByIdAndOrgaId("site:" + s + ":" + w + ":period:2023", COCA).get();
        attw.setAttributeValue(DoubleValue.builder().value(v).build());
        attributeService.save(attw);
        computeService.reCalculateSomeAttributes(Set.of("site:" + s + ":" + w + ":period:2023"), COCA);
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
