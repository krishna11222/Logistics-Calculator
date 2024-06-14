package com.LogisticsCalculator.LogisticsCalculator.Services.CPM;

import com.LogisticsCalculator.LogisticsCalculator.Models.CPM.Activity;
import com.LogisticsCalculator.LogisticsCalculator.Models.CPM.ActivityRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CPMService {
    private final List<Activity> activitiesContainer;

    public CPMService(List<Activity> activitiesContainer) {
        this.activitiesContainer = activitiesContainer;
    }

    public List<Activity> solveCPM(List<Activity> activities){
        GraphDesigner graphDesigner = new GraphDesigner(activities);
        graphDesigner.designGraph();
        graphDesigner.moveForward();
        graphDesigner.moveBack();
        Activity.identifyCriticalActivities(activities);

        return activities;
    }

    public List<ActivityRequest> initializeValues(List<Activity> activities){
        List<ActivityRequest> activityRequest = new ArrayList<ActivityRequest>();

        for (Activity activity : activities) {
            ActivityRequest request = new ActivityRequest(
                    activity.id,
                    activity.name,
                    activity.duration,
                    activity.earlyStart,
                    activity.earlyFinish,
                    activity.lateStart,
                    activity.lateFinish,
                    activity.slackTime,
                    activity.isCriticalActivity,
                    activity.dependencyNames
            );
            activityRequest.add(request);
        }

        return activityRequest;
    }

    public List<String> provideCriticalPath(List<ActivityRequest> activities){
        List<String> activityNames = new ArrayList<String>();

        for(ActivityRequest activity : activities)
        {
            if (activity.isCriticalActivity.equals("Yes"))
                activityNames.add(activity.name);
        }

        return activityNames;
    }

    public int calculateCriticalPathDuration(List<ActivityRequest> activities){
        int duration = 0;

        for(ActivityRequest activity : activities)
        {
            if (activity.isCriticalActivity.equals("Yes"))
                duration += activity.duration;
        }

        return duration;
    }
}