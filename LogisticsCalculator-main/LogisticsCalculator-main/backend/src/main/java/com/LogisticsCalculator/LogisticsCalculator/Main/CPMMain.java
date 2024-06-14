package com.LogisticsCalculator.LogisticsCalculator.Main;
import com.LogisticsCalculator.LogisticsCalculator.Models.CPM.Activity;
import com.LogisticsCalculator.LogisticsCalculator.Services.CPM.GraphDesigner;
import com.LogisticsCalculator.LogisticsCalculator.Services.CPM.InputHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class CPMMain
{
    public static void main(String[] args)
    {
        List<Activity> activitiesContainer = new ArrayList<>();

        System.out.println("Enter the number of activities:");
        Scanner scanner = new Scanner(System.in);
        InputHandler inputHandler = new InputHandler(scanner.nextInt(), activitiesContainer);
        inputHandler.enterNodeDetails();

        GraphDesigner graphDesigner = new GraphDesigner(activitiesContainer);
        graphDesigner.designGraph();
        graphDesigner.moveForward();
        graphDesigner.moveBack();

        Activity.identifyCriticalActivities(activitiesContainer);
        Activity.printTable(activitiesContainer);
        graphDesigner.createCritialPath();
    }
}