import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Unauth() {
    const userState = useSelector((state)=> state.auth.user);
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="text-center">
                <Col>
                    <h1 className="display-4 text-danger">403 - Unauthorized</h1>
                    <p className="lead">
                        Sorry, you do not have permission to view this page.
                    </p>
                    <p>
                        Please contact the administrator if you believe this is an error, or go back to the home page.
                    </p>
                    <Button
                        as={Link}
                        to={userState?.role === 'Teacher' ? '/te/dashboard' : '/'}
                        variant="primary"
                        className="px-4 py-2 fw-semibold shadow-sm"
                    >
                        Go back
                    </Button>
                </Col>
            </Row>

        </Container>
    )
}
