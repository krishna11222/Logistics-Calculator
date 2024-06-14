package com.LogisticsCalculator.LogisticsCalculator.Controllers;

import com.LogisticsCalculator.LogisticsCalculator.Models.CPM.Activity;
import com.LogisticsCalculator.LogisticsCalculator.Models.CPM.ActivityRequest;
import com.LogisticsCalculator.LogisticsCalculator.Services.CPM.CPMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/cpm")
@CrossOrigin(origins = "http://localhost:3000")
public class CPMController {
    private final CPMService _cpmService;
    @Autowired
    public CPMController(CPMService cpmService) {
        this._cpmService = cpmService;
    }

    @PostMapping
    public List<ActivityRequest> solveCPMIssue(@RequestBody List<Activity> activities) {
        List<Activity> activitiesContainer = _cpmService.solveCPM(activities);
        return _cpmService.initializeValues(activitiesContainer);
    }

    @PostMapping("critical-path")
    public List<String> provideCriticalPath(@RequestBody List<ActivityRequest> activities) {
        return _cpmService.provideCriticalPath(activities);
    }

    @PostMapping("critical-path/duration")
    public int calculateCriticalPathDuration(@RequestBody List<ActivityRequest> activities) {
        return _cpmService.calculateCriticalPathDuration(activities);
    }
}