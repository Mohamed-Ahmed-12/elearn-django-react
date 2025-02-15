import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  const userState = useSelector((state)=> state.auth.user);

  return (
    <Container className="text-center py-5">
      <Row>
        <Col>
          <p className="text-base fw-semibold text-primary">404</p>
          <h1 className="mt-4 text-5xl fw-bold text-dark">
            Page not found
          </h1>
          <p className="mt-4 text-lg text-muted">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-4">
            <Button
              as={Link}
              to={userState?.role==='Teacher' ?'/te/dashboard' : '/'}
              variant="primary"
              className="px-4 py-2 fw-semibold shadow-sm"
            >
              Go back
            </Button>

          </div>
        </Col>
      </Row>
    </Container>
  );
}
