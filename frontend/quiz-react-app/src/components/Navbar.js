import React, { useEffect } from 'react';
import { Container, Navbar, NavDropdown, Nav, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import studentIcon from '../student.png';
import { logout } from '../redux/slices/authSlice';


function NavbarComponent() {
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.auth.user);
    const userRole = userState?.role ;
    if (userRole === 'Teacher') return
    // Check if userState is a valid JSON string or already parsed object
    let user = null;
    try {
        user = userState && typeof userState === "string" ? JSON.parse(userState) : userState;
    } catch (error) {
        console.error("Error parsing user data:", error);
    }

    const handleLogout = () => {
        dispatch(logout());
        return <Navigate to='/login' />
    };

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-indigo-0">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        alt="Logo"
                        src="https://cdn-icons-png.freepik.com/512/10266/10266327.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top text-indigo-100"
                    />{' '}
                    Quizzat
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {user ? (
                        <>
                            <Image
                                src={studentIcon}
                                roundedCircle
                                style={{ width: '40px' }}
                                className="ms-auto"
                            />
                            <NavDropdown title={user.username} id="collapsible-nav-dropdown">
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </>
                    ) : (
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/login">
                                Login
                            </Nav.Link>
                            <Nav.Link as={Link} to="/signup">
                                Signup
                            </Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
