'use client';

import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Container, Row, Col } from 'react-bootstrap';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { api } from '@/lib/api';

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [touched, setTouched] = useState({
    email: false,
    token: false,
    newPassword: false,
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
    // You can upgrade this later:
    // return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid =
    stage === 1
      ? validateEmail(email)
      : validateEmail(email) &&
        token.trim() !== '' &&
        validatePassword(newPassword);

  // ================= COUNTDOWN =================
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      email: true,
      token: true,
      newPassword: true,
    });

    if (!isFormValid) return;

    setLoading(true);

    try {
      if (stage === 1) {
        await api.forgotPassword(email);

        toast.success('OTP sent to your email');
        setStage(2);
        setResendCooldown(60);
      } else {
        await api.resetPassword(email, token, newPassword);

        toast.success('Password changed successfully');
        router.push('/login');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Something went wrong';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-login padding-tb-50">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="bb-login-contact">
              <h2 className="mb-3">
                {stage === 1 ? 'Forgot Password' : 'Reset Password'}
              </h2>

              <Form onSubmit={handleSubmit}>
                {/* EMAIL */}
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#f8f8f8' }}>
                    Email Address
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur('email')}
                      isInvalid={touched.email && !validateEmail(email)}
                      disabled={stage === 2}
                      placeholder="Enter your email"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* STAGE 2 */}
                {stage === 2 && (
                  <>
                    {/* TOKEN */}
                    <Form.Group className="bb-login-wrap">
                      <Form.Label style={{ color: '#f8f8f8' }}>
                        Token
                      </Form.Label>
                      <Form.Control
                        style={{ backgroundColor: '#f8f8f8' }}
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        onBlur={() => handleBlur('token')}
                        isInvalid={touched.token && !token.trim()}
                        placeholder="Enter token from email"
                      />
                      <Form.Control.Feedback type="invalid">
                        Token is required
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* PASSWORD */}
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#f8f8f8' }}>
                        New Password
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          onBlur={() => handleBlur('newPassword')}
                          isInvalid={
                            touched.newPassword &&
                            !validatePassword(newPassword)
                          }
                          placeholder="Enter new password"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeSlashIcon size={18} />
                          ) : (
                            <EyeIcon size={18} />
                          )}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          Password must be at least 6 characters
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* RESEND */}
                    <div className="mb-3">
                      <small>Didn’t receive token?</small>
                      <br />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-1"
                        onClick={async () => {
                          try {
                            await api.forgotPassword(email);

                            toast.success('Token resent');
                            setResendCooldown(60);
                          } catch (err: any) {
                            toast.error(
                              err?.response?.data?.message ||
                                'Failed to resend token'
                            );
                          }
                        }}
                        disabled={resendCooldown > 0}
                      >
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : 'Resend Token'}
                      </Button>
                    </div>
                  </>
                )}

                {/* SUBMIT */}
                <Button
                  type="submit"
                  className="bb-btn-2 w-100"
                  disabled={!isFormValid || loading}
                >
                  {loading
                    ? 'Processing...'
                    : stage === 1
                      ? 'Send Reset Link'
                      : 'Change Password'}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ForgotPasswordPage;
