package com.LogisticsCalculator.LogisticsCalculator.Models.CPM;

import java.util.List;

public class ActivityRequest {
    public int id;
    public String name;
    public int duration;
    public int earlyStart;
    public int earlyFinish;
    public int lateStart;
    public int lateFinish;
    public int slackTime;
    public String isCriticalActivity;
    public List<String> dependencyNames;
    public ActivityRequest(int id, String name, int duration, int earlyStart, int earlyFinish,
                           int lateStart, int lateFinish, int slackTime, String isCriticalActivity, List<String> dependencyNames) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.earlyStart = earlyStart;
        this.earlyFinish = earlyFinish;
        this.lateStart = lateStart;
        this.lateFinish = lateFinish;
        this.slackTime = slackTime;
        this.isCriticalActivity = isCriticalActivity;
        this.dependencyNames = dependencyNames;
    }
}