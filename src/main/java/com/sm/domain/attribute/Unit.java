package com.sm.domain.attribute;

import static com.sm.domain.attribute.UnitFamily.co2;
import static com.sm.domain.attribute.UnitFamily.duration;
import static com.sm.domain.attribute.UnitFamily.energy;
import static com.sm.domain.attribute.UnitFamily.nox;

public enum Unit {
    day(duration, 24.),
    to(UnitFamily.weight, 1.),
    kg(UnitFamily.weight, 1000.),
    j(energy, 1000000.),
    kj(energy, 1000.),
    mj(energy, 1.),
    tNox(nox, 1.),
    kgNox(nox, 1000.),
    tCo2(co2, 1.),
    kgCo2(co2, 1000.);

    private final UnitFamily unitFamily;
    private final double weight;

    Unit(UnitFamily unitFamily, double i) {
        this.unitFamily = unitFamily;
        this.weight = i;
    }

    public UnitFamily getUnitFamily() {
        return unitFamily;
    }

    public double getWeight() {
        return weight;
    }
}
