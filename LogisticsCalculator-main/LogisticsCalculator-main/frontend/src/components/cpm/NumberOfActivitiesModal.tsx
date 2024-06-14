import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface Props {
    showModal: boolean;
    handleSaveModal: () => void;
    handleNumberOfActivitiesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    numberOfActivities: number;
}

const NumberOfActivitiesModal: React.FC<Props> = ({ showModal, handleSaveModal, handleNumberOfActivitiesChange, numberOfActivities }) => {
    return (
        <Modal show={showModal} onHide={handleSaveModal}>
            <Modal.Header closeButton>
                <Modal.Title>Number of Activities</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-center">Please enter the number of activities:</p>
                <input className="form-control text-center" type="number" value={numberOfActivities} onChange={handleNumberOfActivitiesChange} />
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="danger" onClick={handleSaveModal}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NumberOfActivitiesModal;