'use client';
import { RootState } from '@/store';
import { login } from '@/store/reducer/loginSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorToast, showSuccessToast } from '../toast-popup/Toastify';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import Link from 'next/link';
import api from '@/lib/api';

interface FormValues {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const schema = yup.object().shape({
    username: yup
      .string()
      .required('Username is required')
      .min(3, 'Username should be at least 3 characters long'),
    email: yup.string().email('Invalid email').required('Email is required'),

    phoneNumber: yup
      .string()
      .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });
  const initialValues: FormValues = {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };

  const handleRegisterBtn = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    try {
      const res = await api.post('/users/register', {
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      const userData = {
        id: res.data.id,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
        username: res.data.username,
      };

      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      dispatch(login(userData));
      router.push('/');
      showSuccessToast('User registered successfull!');
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || 'Something went wrong');
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <section className="section-login padding-tb-50">
      <div className="container">
        <Row>
          <Col sm={12}>
            <Fade
              triggerOnce
              direction="up"
              duration={1000}
              delay={200}
              className="section-title bb-center"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <div className="section-detail">
                <h2 className="bb-title">Register</h2>
                <p>Best place to buy delicious cake bread</p>
              </div>
            </Fade>
          </Col>
          <Col sm={12}>
            <Fade
              triggerOnce
              direction="up"
              duration={1000}
              delay={200}
              className="bb-login-contact"
            >
              <Formik
                validationSchema={schema}
                onSubmit={handleRegisterBtn}
                initialValues={initialValues}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  isSubmitting,
                }: FormikProps<FormValues>) => {
                  return (
                    <Form noValidate onSubmit={handleSubmit}>
                      <div className="bb-login-wrap">
                        <label htmlFor="username">Username*</label>
                        <Form.Group>
                          <InputGroup>
                            <Form.Control
                              className="custom-input"
                              onChange={handleChange}
                              value={values.username}
                              type="username"
                              id="username"
                              name="username"
                              autoComplete="off"
                              placeholder="Enter Your Username"
                              required
                              isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors?.username}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div className="bb-login-wrap">
                        <label htmlFor="email">Email*</label>
                        <Form.Group>
                          <InputGroup>
                            <Form.Control
                              onChange={handleChange}
                              value={values.email}
                              type="email"
                              id="email"
                              name="email"
                              autoComplete="off"
                              placeholder="Enter Your Email"
                              required
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div className="bb-login-wrap">
                        <label htmlFor="username">Phone Number*</label>
                        <Form.Group>
                          <InputGroup>
                            <Form.Control
                              className="custom-input"
                              onChange={handleChange}
                              value={values.phoneNumber}
                              type="string"
                              id="phone-number"
                              name="phoneNumber"
                              autoComplete="off"
                              placeholder="Enter a Valid Phone Number"
                              isInvalid={!!errors.phoneNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors?.phoneNumber}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div className="bb-login-wrap">
                        <label htmlFor="password">Password*</label>
                        <Form.Group>
                          <InputGroup>
                            <Form.Control
                              onChange={handleChange}
                              value={values.password}
                              type="password"
                              id="password"
                              name="password"
                              placeholder="Enter Your Password"
                              isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.password}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div className="bb-login-wrap">
                        <label htmlFor="email">Confirm Password*</label>
                        <Form.Group>
                          <InputGroup>
                            <Form.Control
                              value={values.confirmPassword}
                              onChange={handleChange}
                              isInvalid={!!errors.confirmPassword}
                              type="password"
                              name="confirmPassword"
                              placeholder="Confirm your password"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.confirmPassword}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div className="bb-login-wrap">
                        <a onClick={(e) => e.preventDefault()} href="#">
                          Already have an Account?
                        </a>
                      </div>
                      <div className="bb-login-button">
                        <button
                          className="bb-btn-2"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                        <Link href="/login">Login</Link>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </Fade>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Register;
