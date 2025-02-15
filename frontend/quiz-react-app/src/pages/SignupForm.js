import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../redux/slices/authSlice';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

export default function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [credential, setCredential] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credential.role) {
      toast.error("Please select a role.", { position: 'top-right' });
      return;
    }

    try {
      const resultAction = await dispatch(signup(credential));

      if (signup.fulfilled.match(resultAction)) {
        toast.success("🎉 Registration successful!", {
          position: 'top-right',
          autoClose: 5000,
        });

        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + resultAction.payload.tokens.access;
        console.log(resultAction.payload)
        if (resultAction.payload.user.role === 'Teacher')
        {
          return navigate('/te/dashboard');
        }
        navigate('/');
      } else {
        const errorMessage = resultAction.payload?.detail || "Signup failed. Please try again.";
        toast.error(errorMessage, { position: 'top-right' });
      }
    } catch (err) {
      console.error('An error occurred:', err);
      toast.error('Unexpected error occurred. Please try again.', { position: 'top-right' });
    }
  };

  return (
    <Row className="w-100 my-4">
      <Col xs={12} sm={8} md={6} lg={4} className="mx-auto bg-light p-4">
        <div className="text-center mb-4">
          <img
            alt="Your Company"
            src="https://cdn-icons-png.freepik.com/512/10266/10266327.png"
            className="mb-3"
            style={{ height: '50px' }}
          />
          <h2>Create an Account</h2>
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

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={credential.email}
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
          </Form.Group>

          <div className="d-flex flex-column my-4">
            <div>
              <Form.Check.Input
                id="student-radio"
                type="radio"
                name="role"
                value="Student"
                onChange={handleChange}
              />
              <Form.Check.Label className="ms-3" htmlFor="student-radio">
                Student
              </Form.Check.Label>
            </div>
            <div className="mt-3">
              <Form.Check.Input
                id="teacher-radio"
                type="radio"
                name="role"
                value="Teacher"
                onChange={handleChange}
              />
              <Form.Check.Label className="ms-3" htmlFor="teacher-radio">
                Teacher
              </Form.Check.Label>
            </div>
          </div>

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
                Sign up
              </Button>
            )}
          </div>
        </Form>

        <p className="text-center mt-3">
          Already a member?{' '}
          <Link to="/login" className="text-primary">
            Sign in
          </Link>
        </p>
      </Col>
    </Row>
  );
}
