'use client';
import { RootState } from '@/store';
import { login } from '@/store/reducer/loginSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorToast, showSuccessToast } from '../toast-popup/Toastify';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import Link from 'next/link';
import { api, LoginResponse } from '@/lib/api';

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const user = useSelector((state: RootState) => state.login?.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  const handleLoginBtn = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    try {
      const res = await api.login({
        email: values.email,
        password: values.password,
      });

      const userData: LoginResponse = {
        id: res.id,
        email: res.email,
        username: res.username,
        role: res.role,
        accessToken: res.accessToken,
      };

      localStorage.setItem('accessToken', res.accessToken || '');
      localStorage.setItem('user', JSON.stringify(userData));

      dispatch(login(userData));
      router.push('/');
      showSuccessToast('User login successfull!');
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
                <h2 className="bb-title">
                  Log <span>In</span>
                </h2>
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
                onSubmit={handleLoginBtn}
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
                        <label htmlFor="email">Password*</label>
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
                        <Link href="/forgot-password">Forgot password</Link>
                      </div>
                      <div className="bb-login-button">
                        <button
                          className="bb-btn-2"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                        <Link href="/register">Register</Link>
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

export default Login;
