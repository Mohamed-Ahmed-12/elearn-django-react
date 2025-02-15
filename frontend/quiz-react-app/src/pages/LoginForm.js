import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, user, error } = useSelector((state) => state.auth);
  const [credential, setCredential] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(login(credential));
      if (login.fulfilled.match(resultAction)) {
        toast.success('👋 Welcome back ' + resultAction.payload.user.username, {
          position: 'top-right',
          autoClose: 5000,
        });

        localStorage.setItem('user', JSON.stringify(resultAction.payload.user));
        localStorage.setItem('access_token', resultAction.payload.access);
        localStorage.setItem('refresh_token', resultAction.payload.refresh);
        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + resultAction.payload.access;
        if(resultAction.payload.user.role ==='Teacher'){
          return navigate('/te/dashboard');
        }
        return navigate('/');
      } else {
        toast.error(resultAction.payload.detail, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (

      <Row className="w-100 min-h-100 my-4">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto bg-light p-4">
          <div className="text-center mb-4">
            <img
              alt="Your Company"
              src="https://cdn-icons-png.freepik.com/512/10266/10266327.png"
              className="mb-3"
              style={{ height: '50px' }}
            />
            <h2>Sign in to your account</h2>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter your username"
                required
                value={credential.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                value={credential.password}
                onChange={handleChange}
              />
              <div className="text-end mt-2">
                <a href="#" className="text-primary">
                  Forgot password?
                </a>
              </div>
            </Form.Group>

            <div className="d-grid">
              {isLoading ? (
                <Button variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Loading...</span>
                </Button>
              ) : (
                <Button type="submit" variant="primary">
                  Sign in
                </Button>
              )}
            </div>
          </Form>

          <p className="text-center mt-3">
            Not a member?{' '}
            <Link to="/signup" className="text-primary">
              Create an account free
            </Link>
          </p>
        </Col>
      </Row>

  );
}
