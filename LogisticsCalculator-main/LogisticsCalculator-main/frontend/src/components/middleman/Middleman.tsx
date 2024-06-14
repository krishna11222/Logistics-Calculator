import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import calculateMiddleman from '../../services/api/MiddlemanApi';
import { MiddlemanResponse } from '../../models/middleman/MiddlemanResponse';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../styles/Middleman.css';

const Middleman: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [numSuppliers, setNumSuppliers] = useState(2);
    const [numCustomers, setNumCustomers] = useState(2);
    const [showCalculatedDetails, setShowCalculatedDetails] = useState(false);
    const [calculatedDetails, setCalculatedDetails] = useState<MiddlemanResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setShowModal(true);
    }, []);

    const handleSaveModal = () => {
        setShowModal(false);
    }

    const handleNumSuppliersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumSuppliers(Number(event.target.value));
    }

    const handleNumCustomersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumCustomers(Number(event.target.value));
    }

    const renderSupplierSupplyFields = () => {
        const supplierSupplyFields = [];
        for (let i = 0; i < numSuppliers; i++) {
            supplierSupplyFields.push(
                <input
                    key={`supplier-supply-${i}`}
                    type="text"
                    className="form-control supplier-supply-field"
                    style={{ width: '110px', marginRight: '10px' }}
                    placeholder={`Supplier ${i + 1}`}
                />
            );
        }
        return supplierSupplyFields;
    }

    const renderSupplierPurchasePriceFields = () => {
        const supplierPurchasePriceFields = [];
        for (let i = 0; i < numSuppliers; i++) {
            supplierPurchasePriceFields.push(
                <input
                    key={`supplier-purchase-price-${i}`}
                    type="text"
                    className="form-control supplier-purchase-price-field"
                    style={{ width: '110px', marginRight: '10px' }}
                    placeholder={`Supplier ${i + 1}`}
                />
            );
        }
        return supplierPurchasePriceFields;
    }

    const renderCustomerDemandFields = () => {
        const customerDemandFields = [];
        for (let i = 0; i < numCustomers; i++) {
            customerDemandFields.push(
                <input
                    key={`customer-demand-${i}`}
                    type="text"
                    className="form-control customer-demand-field"
                    style={{ width: '110px', marginRight: '10px' }}
                    placeholder={`Customer ${i + 1}`}
                />
            );
        }
        return customerDemandFields;
    }

    const renderCustomerSellingPriceFields = () => {
        const CustomerSellingPriceFields = [];
        for (let i = 0; i < numCustomers; i++) {
            CustomerSellingPriceFields.push(
                <input
                    key={`customer-selling-price-${i}`}
                    type="text"
                    className="form-control customer-selling-price-field"
                    style={{ width: '110px', marginRight: '10px' }}
                    placeholder={`Customer ${i + 1}`}
                />
            );
        }
        return CustomerSellingPriceFields;
    }

    const renderTransportationCostsMatrix = () => {
        const TransportationCostsMatrix = [];
        for (let i = 0; i < numSuppliers; i++) {
            const row = [];
            for (let j = 0; j < numCustomers; j++) {
                let index = (i * numCustomers + j) + 1;
                row.push(
                    <input
                        key={`cost-${index}`}
                        type="text"
                        className="form-control cost-field"
                        style={{ width: '110px', marginRight: '10px' }}
                        placeholder={`Cost ${index}`}
                    />
                );
            }
            TransportationCostsMatrix.push(
                <div key={`row-${i}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                    {row}
                </div>
            );
        }
        return TransportationCostsMatrix;
    }

    const validateFields = (): boolean => {
        const supplierSupplyInputs = Array.from(document.getElementsByClassName('supplier-supply-field')).map(input => (input as HTMLInputElement).value);
        const supplierPurchasePriceInputs = Array.from(document.getElementsByClassName('supplier-purchase-price-field')).map(input => (input as HTMLInputElement).value);
        const customerDemandInputs = Array.from(document.getElementsByClassName('customer-demand-field')).map(input => (input as HTMLInputElement).value);
        const customerSellingPriceInputs = Array.from(document.getElementsByClassName('customer-selling-price-field')).map(input => (input as HTMLInputElement).value);
        const transportationCostInputs = Array.from(document.getElementsByClassName('cost-field')).map(input => (input as HTMLInputElement).value);

        const allInputs = [...supplierSupplyInputs, ...supplierPurchasePriceInputs, ...customerDemandInputs, ...customerSellingPriceInputs, ...transportationCostInputs];

        for (let input of allInputs) {
            if (input.trim() === '') {
                return false;
            }
        }

        return true;
    }

    const handleCalculate = async () => {
        setError(null);

        if (!validateFields()) {
            setError('Please fill in all fields.');
            return;
        }

        const suppliersSupply = Array.from(document.getElementsByClassName('supplier-supply-field')).map(input => Number((input as HTMLInputElement).value));
        const suppliersPurchasePrice = Array.from(document.getElementsByClassName('supplier-purchase-price-field')).map(input => Number((input as HTMLInputElement).value));
        const customersDemand = Array.from(document.getElementsByClassName('customer-demand-field')).map(input => Number((input as HTMLInputElement).value));
        const customersSellingPrice = Array.from(document.getElementsByClassName('customer-selling-price-field')).map(input => Number((input as HTMLInputElement).value));
        const transportationCosts: number[][] = [];

        for (let i = 0; i < numSuppliers; i++) {
            const row: number[] = [];
            for (let j = 0; j < numCustomers; j++) {
                const index = i * numCustomers + j;
                const value = (document.getElementsByClassName('cost-field')[index] as HTMLInputElement).value;
                row.push(Number(value));
            }
            transportationCosts.push(row);
        }

        const data = {
            numSuppliers,
            numCustomers,
            suppliersSupply,
            suppliersPurchasePrice,
            customersDemand,
            customersSellingPrice,
            transportationCosts
        };

        try {
            const result = await calculateMiddleman(data);
            setCalculatedDetails(result);
            setShowCalculatedDetails(true);
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while calculating. Please try again.');
        }
    }

    return (
        <div className="Middleman">
            <div>
                <h1>Middleman issue</h1>
                <h3>Enter middleman details below</h3>
                <Modal show={showModal} onHide={handleSaveModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Number of suppliers and customers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-center"><b>Suppliers:</b> {numSuppliers}</p>
                        <input type="range" className="form-range" min="2" max="10" step="1" id="customRange3" value={numSuppliers} onChange={handleNumSuppliersChange}></input>
                        <p className="text-center"><b>Customers:</b> {numCustomers}</p>
                        <input type="range" className="form-range" min="2" max="10" step="1" id="customRange3" value={numCustomers} onChange={handleNumCustomersChange}></input>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                        <Button variant="danger" onClick={handleSaveModal}>Save</Button>
                    </Modal.Footer>
                </Modal>
                <div className="details-table">
                    <h5>Suppliers: <b>{numSuppliers}</b></h5>
                    <h5>Customers: <b>{numCustomers}</b></h5>
                    <h5 style={{ display: 'flex', alignItems: 'center' }}>Supplier's supply: {renderSupplierSupplyFields()}</h5>
                    <h5 style={{ display: 'flex', alignItems: 'center' }}>Supplier's purchase price: {renderSupplierPurchasePriceFields()}</h5>
                    <h5 style={{ display: 'flex', alignItems: 'center' }}>Customer's demand: {renderCustomerDemandFields()}</h5>
                    <h5 style={{ display: 'flex', alignItems: 'center' }}>Customer's selling price: {renderCustomerSellingPriceFields()}</h5>
                    <h5 style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>Transportation costs: {renderTransportationCostsMatrix()}</h5>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Button variant="danger" onClick={handleCalculate}>Calculate</Button>
                </div>
                {showCalculatedDetails && calculatedDetails && (
                    <div className="calculated-details">
                        <h3>Calculated details</h3>
                        <h5>Unit Profit Matrix:</h5>
                        <table className="table table-bordered table-sm">
                            <tbody>
                            {calculatedDetails.unitProfitMatrix.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <h5>Optimal Transport Matrix:</h5>
                        <table className="table table-bordered table-sm">
                            <tbody>
                            {calculatedDetails.optimalTransportMatrix.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <p><b>Transport costs:</b> {calculatedDetails.resultTransport}</p>
                        <p><b>Purchase costs:</b> {calculatedDetails.resultPurchaseCost}</p>
                        <p><b>Total costs:</b> {calculatedDetails.totalCost}</p>
                        <p><b>Income:</b> {calculatedDetails.income}</p>
                        <p><b>Profit:</b> {calculatedDetails.profit}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Middleman;