import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useLocation } from 'react-router-dom';
import '../../App.css';

const AppNavbar = () => {
    const location = useLocation();

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={NavLink} to="/">LogisticsCalculator</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto red-links">
                        <Nav.Link as={NavLink} to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/cpm" className={location.pathname === '/cpm' ? 'active' : ''}>CPM</Nav.Link>
                        <Nav.Link as={NavLink} to="/middleman" className={location.pathname === '/middleman' ? 'active' : ''}>Middleman issue</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;