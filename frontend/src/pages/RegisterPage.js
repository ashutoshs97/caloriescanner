import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerStart, registerSuccess } from '../store/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would call the backend API here
    dispatch(registerStart());
    // Simulate API delay
    setTimeout(() => {
      // Simulate successful registration
      const mockUser = { id: 1, username: formData.username, email: formData.email };
      const mockToken = 'mock-jwt-token';
      dispatch(registerSuccess({ token: mockToken, user: mockUser }));
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-light rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-neon-green rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold tracking-tight text-white mb-2">
          Create an account
        </h2>
        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-brand-light hover:text-white transition-colors duration-200">
            Sign in here
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-4 sm:px-10 rounded-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="johndoe"
                  className="input-premium"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="input-premium"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="input-premium"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-300">
                  Age
                </label>
                <div className="mt-1">
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="25"
                    className="input-premium"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-300">
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    className="input-premium py-2.5"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male" className="bg-slate-900">Male</option>
                    <option value="female" className="bg-slate-900">Female</option>
                    <option value="other" className="bg-slate-900">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-300">
                  Weight (kg)
                </label>
                <div className="mt-1">
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder="70.5"
                    className="input-premium"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-slate-300">
                  Height (cm)
                </label>
                <div className="mt-1">
                  <input
                    id="height"
                    name="height"
                    type="number"
                    min="1"
                    placeholder="175"
                    className="input-premium"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-slate-300">
                Activity Level
              </label>
              <div className="mt-1">
                <select
                  id="activityLevel"
                  name="activityLevel"
                  className="input-premium py-2.5"
                  value={formData.activityLevel}
                  onChange={handleChange}
                >
                  <option value="sedentary" className="bg-slate-900">Sedentary (little or no exercise)</option>
                  <option value="lightly active" className="bg-slate-900">Lightly active (1-3 days/week)</option>
                  <option value="moderately active" className="bg-slate-900">Moderately active (3-5 days/week)</option>
                  <option value="very active" className="bg-slate-900">Very active (6-7 days/week)</option>
                  <option value="extra active" className="bg-slate-900">Extra active (very hard exercise)</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn-premium w-full mt-2"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;