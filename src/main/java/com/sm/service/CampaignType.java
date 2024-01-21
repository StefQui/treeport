package com.sm.service;

public enum CampaignType {
    period,
    other;

    public static CampaignType fromValue(String ct) {
        if (ct == null) {
            return null;
        } else if ("period".equals(ct)) {
            return period;
        } else if ("other".equals(ct)) {
            return other;
        }
        throw new RuntimeException("to be implemented here....." + ct);
    }
}
