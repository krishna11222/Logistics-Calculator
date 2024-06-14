package com.LogisticsCalculator.LogisticsCalculator.Services.CPM;
import com.LogisticsCalculator.LogisticsCalculator.Models.CPM.Activity;

import java.util.ArrayList;
import java.util.*;

public class GraphDesigner {
    private List<Activity> root;
    private List<Activity> endRoot;
    private List<Activity> activitiesContainer;

    public GraphDesigner(List<Activity> activitiesContainer) {
        root = new ArrayList<>();
        endRoot = new ArrayList<>();
        this.activitiesContainer = activitiesContainer;
    }

    public void designGraph() {
        int size = activitiesContainer.size();
        for (int i = 0; i < size; i++) {
            Activity one = activitiesContainer.get(i);
            if (one.dependencyNames.size() == 0) {
                this.root.add(one);
            }

            for (int j = 0; j < one.dependencyNames.size(); j++) {
                Activity activity = getActivityByName(activitiesContainer, one.dependencyNames.get(j));

                one.parentList.add(activity);
                activity.childList.add(one);
            }
        }

        for (int i = 0; i < size; i++) {
            if (activitiesContainer.get(i).childList.size() == 0)
                this.endRoot.add(activitiesContainer.get(i));
        }
    }

    public void moveForward() {
        Queue<Activity> queue = new LinkedList<>();

        for (Activity activity : root) {
            queue.add(activity);
        }

        try {
            if (root.size() == 0)
                throw new RuntimeException("This system has no independent nodes.");
        } catch (RuntimeException exp) {
            System.exit(1);
        }

        int counter = 0;
        while (queue.size() != 0) {
            boolean isVerified = false;

            Activity activity = queue.remove();
            calculateEarlyTimes(activity);

            counter++;
            for (Activity child : activity.childList) {
                for (Activity parent : child.parentList) {
                    if (!parent.isChecked) {
                        isVerified = false;
                        break;
                    }
                    isVerified = true;
                }
                if (isVerified)
                    queue.add(child);
            }
        }
        try {
            if (counter < activitiesContainer.size()) {
                throw new RuntimeException("There is a circular dependency in the system.");
            }
        } catch (RuntimeException exp) {
            System.exit(1);
        }
    }

    public void moveBack() {
        Queue<Activity> queue = new LinkedList<>();
        int globalFinish = 0;

        for (Activity activity : endRoot) {
            queue.add(activity);
            if (activity.earlyFinish > globalFinish)
                globalFinish = activity.earlyFinish;
        }
        while (queue.size() != 0) {
            boolean isVerified = false;
            Activity activity = queue.remove();
            calculateLateTimes(activity, globalFinish);

            for (Activity parent : activity.parentList) {
                for (Activity child : parent.childList) {
                    if (child.isChecked) {
                        isVerified = false;
                        break;
                    }
                    isVerified = true;
                }
                if (isVerified)
                    queue.add(parent);
            }
        }
    }

    private void calculateEarlyTimes(Activity activity) {
        int size = activity.parentList.size();
        int temp = 0;
        for (Activity parent : activity.parentList) {
            int earlyFinish = parent.earlyFinish;
            if (temp < earlyFinish)
                temp = earlyFinish;

        }
        activity.earlyStart = temp;
        activity.earlyFinish = temp + activity.duration;
        activity.isChecked = true;
    }

    private void calculateLateTimes(Activity activity, int projectDeadLine) {
        if (activity.childList.size() == 0) {
            activity.lateFinish = projectDeadLine;
            activity.lateStart = projectDeadLine - activity.duration;
            activity.slackTime = activity.lateStart - activity.earlyStart;
        } else {
            int size = activity.childList.size();
            int temp = projectDeadLine + 1;
            for (Activity child : activity.childList) {
                int lateStart = child.lateStart;
                if (temp > lateStart)
                    temp = lateStart;
            }
            activity.lateFinish = temp;
            activity.lateStart = temp - activity.duration;
            activity.slackTime = activity.lateStart - activity.earlyStart;
        }
        activity.isChecked = false;
    }

    private Activity getActivityByName(List<Activity> activitiesContainer, String activityName) {
        Activity activity = null;
        for (Activity activityFromContainer : activitiesContainer) {
            if (activityFromContainer.name.equals(activityName)) {
                activity = activityFromContainer;
                break;
            }
        }
        return activity;
    }

    public void createCritialPath() {
        for (Activity activity : root) {
            Activity.printCriticalPath(activity, "");
        }
    }
}