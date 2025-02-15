import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, verifyOtp } from '../../helpers/apiCommunicators';
import { useAuth } from '../context/AuthProvider';
import Navbar from './Navbar';

export default function Signup() {
  const { setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const res = await signupUser(name, email, password);
    if (res.error) {
      setError(res.error);
      return;
    }

    setIsOtpSent(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    const res = await verifyOtp(formData.email, otp);
    if (res.error) {
      setError(res.error);
      return;
    }

    setAuthUser({ name: res.name, email: res.email, _id: res._id });
    navigate("/my-events", { replace: true });
  };

  return (
    <>
      <Navbar />
      <div className="my-20 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {isOtpSent ? "Enter OTP" : "Create your account"}
            </h2>
          </div>

          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {!isOtpSent ? (
            <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
              <div className="rounded-md shadow-sm space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-2 border rounded"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="w-full p-2 bg-red-700 text-white rounded">
                Send OTP
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-2 border rounded"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="w-full p-2 bg-green-600 text-white rounded">
                Verify OTP & Sign Up
              </button>
            </form>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-red-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
