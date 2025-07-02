import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import { toast } from 'react-hot-toast';

const SignUpPage = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ User details saved, continue to next step");
        if (onRegister) onRegister(data.user);
        navigate("/"); // navigate to login page after successful registration
      } else {
        toast.error(data.message || "❌ Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-transparent flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-transparent border border-green-600 p-6 rounded-lg max-w-md w-full shadow-xl text-center">
        <h2 className="text-xl font-semibold mb-4 text-green-600">
          Sign Up
        </h2>
        {error && (
          <div className="text-red-600 mb-2 text-sm font-medium">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded"
          >
            Register
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-600">
          {/* Removed login link, only registration remains */}
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;