import React from 'react';
import { Container, Navbar, Nav, FormGroup, FormControl, Button} from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './css/Navigation.css';
import SiteLogo from '../logo.svg';

function Navigation(){
    return (
        <Container>
            <Navbar bg="dark" expand="lg">
                <Navbar.Brand href="/">
                    <img
                        src= "https://cdn-icons-png.flaticon.com/512/3579/3579136.png"
                        width="auto"
                        height="70"
                        className="d-inline-block align-top"
                        alt="Village"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link className='navlink' href="/">Home</Nav.Link>
                    <Nav.Link className='navLink' href="/Contact">Contact</Nav.Link>
                    <Nav.Link className='navLink' href="/Cart">Cart</Nav.Link>
                    {/* <Button className="log__out" onClick={logout}>
                      Login out
                    </Button> */}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );

}

export default Navigation;