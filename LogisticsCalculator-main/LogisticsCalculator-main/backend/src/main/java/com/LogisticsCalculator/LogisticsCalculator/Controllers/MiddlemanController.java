package com.LogisticsCalculator.LogisticsCalculator.Controllers;

import com.LogisticsCalculator.LogisticsCalculator.Models.CPM.Activity;
import com.LogisticsCalculator.LogisticsCalculator.Models.CPM.ActivityRequest;
import com.LogisticsCalculator.LogisticsCalculator.Models.Middleman.MiddlemanDetails;
import com.LogisticsCalculator.LogisticsCalculator.Models.Middleman.MiddlemanResponse;
import com.LogisticsCalculator.LogisticsCalculator.Services.CPM.CPMService;
import com.LogisticsCalculator.LogisticsCalculator.Services.Middleman.MiddlemanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/middleman")
@CrossOrigin(origins = "http://localhost:3000")
public class MiddlemanController {
    private final MiddlemanService _middlemanService;
    @Autowired
    public MiddlemanController(MiddlemanService middlemanService) {
        this._middlemanService = middlemanService;
    }

    @PostMapping
    public MiddlemanResponse solveMiddlemanIssue(@RequestBody MiddlemanDetails details) {
        return _middlemanService.solveMiddlemanIssue(details);
    }
}