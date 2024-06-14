package com.LogisticsCalculator.LogisticsCalculator.Services.Middleman;

import com.LogisticsCalculator.LogisticsCalculator.Models.Middleman.MiddlemanDetails;
import com.LogisticsCalculator.LogisticsCalculator.Models.Middleman.MiddlemanResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class MiddlemanService {
    private final MiddlemanDetails middlemanDetails;

    public MiddlemanService(MiddlemanDetails middlemanDetails) {
        this.middlemanDetails = middlemanDetails;
    }

    public MiddlemanResponse solveMiddlemanIssue(MiddlemanDetails details){
        int[][] profitMatrix = calculateProfitMatrix(details);
        adjustDetailsWithSum(details);
        int[][] unitProfitMatrix = extendMatrixWithZeros(profitMatrix);
        removeLastColumn(unitProfitMatrix);
        displayMatrix(unitProfitMatrix);
        int[][] optimalTransportMatrix = calculateOptimalTransport(details.suppliersSupply, details.customersDemand, profitMatrix);
        optimalTransportMatrix = removeLastRowAndColumn(optimalTransportMatrix);
        displayMatrix(optimalTransportMatrix);

        MiddlemanResponse middlemanResponse = calculateCostsAndCreateResponse(unitProfitMatrix, details, optimalTransportMatrix);
        return middlemanResponse;
    }

    private int[][] calculateProfitMatrix(MiddlemanDetails details) {
        int[][] profitMatrix = new int[details.numSuppliers][details.numCustomers];
        for (int i = 0; i < details.numSuppliers; i++) {
            for (int j = 0; j < details.numCustomers; j++) {
                profitMatrix[i][j] = details.customersSellingPrice.get(j) - details.suppliersPurchasePrice.get(i) - details.transportationCosts[i][j];
            }
        }
        return profitMatrix;
    }

    private void adjustDetailsWithSum(MiddlemanDetails details) {
        int sum1 = details.customersDemand.stream().mapToInt(Integer::intValue).sum();
        int sum2 = details.suppliersSupply.stream().mapToInt(Integer::intValue).sum();
        details.suppliersSupply.add(sum1);
        details.customersDemand.add(sum2);
    }

    private int[][] extendMatrixWithZeros(int[][] profitMatrix) {
        int[][] unitProfitMatrix = new int[profitMatrix.length][profitMatrix[0].length + 1];
        for (int i = 0; i < profitMatrix.length; i++) {
            for (int j = 0; j < profitMatrix[i].length; j++) {
                unitProfitMatrix[i][j] = profitMatrix[i][j];
            }
        }
        return unitProfitMatrix;
    }

    private void removeLastColumn(int[][] matrix) {
        for (int i = 0; i < matrix.length; i++) {
            matrix[i] = Arrays.copyOf(matrix[i], matrix[i].length - 1);
        }
    }

    private void displayMatrix(int[][] matrix) {
        for (int[] row : matrix) {
            System.out.println(Arrays.toString(row));
        }
        System.out.println();
    }

    private int[][] calculateOptimalTransport(List<Integer> suppliersSupply, List<Integer> consumersDemand, int[][] profitMatrix) {
        int[][] transportMatrix = new int[suppliersSupply.size()][consumersDemand.size()];
        while (true) {
            int[] maxInfo = findMaxProfit(profitMatrix);
            int maxProfit = maxInfo[0];
            int[] maxIndex = {maxInfo[1], maxInfo[2]};
            if (maxProfit <= 0)
                break;
            addTransport(transportMatrix, suppliersSupply, consumersDemand, maxIndex);
            int i = maxIndex[0];
            int j = maxIndex[1];
            profitMatrix[i][j] = Integer.MIN_VALUE;
        }
        return transportMatrix;
    }

    private int[] findMaxProfit(int[][] profitMatrix) {
        int maxProfit = Integer.MIN_VALUE;
        int[] maxIndex = new int[2];
        for (int i = 0; i < profitMatrix.length; i++) {
            for (int j = 0; j < profitMatrix[0].length; j++) {
                if (profitMatrix[i][j] > maxProfit) {
                    maxProfit = profitMatrix[i][j];
                    maxIndex[0] = i;
                    maxIndex[1] = j;
                }
            }
        }
        return new int[]{maxProfit, maxIndex[0], maxIndex[1]};
    }

    private void addTransport(int[][] transportMatrix, List<Integer> suppliersSupply, List<Integer> consumersDemand, int[] index) {
        int i = index[0];
        int j = index[1];
        int transportAmount = Math.min(suppliersSupply.get(i), consumersDemand.get(j));
        transportMatrix[i][j] = transportAmount;
        suppliersSupply.set(i, suppliersSupply.get(i) - transportAmount);
        consumersDemand.set(j, consumersDemand.get(j) - transportAmount);
    }

    private MiddlemanResponse calculateCostsAndCreateResponse(int[][] unitProfitMatrix, MiddlemanDetails details, int[][] optimalTransportMatrix) {
        int[] results = calculateCostsAndIncome(details, optimalTransportMatrix);
        int totalCost = results[0] + results[1];
        int profit = results[2] - results[1] - results[0];
        System.out.println("Transportation costs: " + results[0]);
        System.out.println("Purchase cost: " + results[1]);
        System.out.println("Total cost: " + totalCost);
        System.out.println("Income: " + results[2]);
        System.out.println("Profit: " + profit);
        return new MiddlemanResponse(unitProfitMatrix, optimalTransportMatrix, results[0], results[1], totalCost, results[2], profit);
    }

    private int[] calculateCostsAndIncome(MiddlemanDetails details, int[][] optimalTransportMatrix) {
        int resultTransport = 0;
        int resultPurchaseCost = 0;
        int resultSalesIncome = 0;
        for (int i = 0; i < details.transportationCosts.length; i++) {
            for (int j = 0; j < details.transportationCosts[0].length; j++) {
                resultTransport += details.transportationCosts[i][j] * optimalTransportMatrix[i][j];
                resultPurchaseCost += optimalTransportMatrix[i][j] * details.suppliersPurchasePrice.get(i);
                resultSalesIncome += optimalTransportMatrix[i][j] * details.customersSellingPrice.get(j);
            }
        }
        return new int[]{resultTransport, resultPurchaseCost, resultSalesIncome};
    }

    private int[][] removeLastRowAndColumn(int[][] matrix) {
        if (matrix.length == 0) return new int[0][0];
        int[][] temp = new int[matrix.length - 1][matrix[0].length - 1];
        for (int i = 0; i < temp.length; i++) {
            temp[i] = Arrays.copyOf(matrix[i], matrix[i].length - 1);
        }
        return Arrays.copyOf(temp, temp.length);
    }
}