package com.LogisticsCalculator.LogisticsCalculator.Models.Middleman;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MiddlemanDetails {
    public int numSuppliers;
    public int numCustomers;
    public List<Integer> suppliersSupply;
    public List<Integer> suppliersPurchasePrice;
    public List<Integer> customersDemand;
    public List<Integer> customersSellingPrice;
    public int[][] transportationCosts;

    public MiddlemanDetails() {
    }
    public MiddlemanDetails(int numSuppliers, int numCustomers, List<Integer> suppliersSupply, List<Integer> suppliersPurchasePrice, List<Integer> customersDemand, List<Integer> customersSellingPrice) {
        this.numSuppliers = numSuppliers;
        this.numCustomers = numCustomers;
        this.suppliersSupply = suppliersSupply;
        this.suppliersPurchasePrice = suppliersPurchasePrice;
        this.customersDemand = customersDemand;
        this.customersSellingPrice = customersSellingPrice;
    }

    public void setNumSuppliers(int numSuppliers) {
        this.numSuppliers = numSuppliers;
    }

    public void setNumCustomers(int numCustomers) {
        this.numCustomers = numCustomers;
    }

    public void setTransportationCosts(int[][] transportationCosts) {
        this.transportationCosts = transportationCosts;
    }
}