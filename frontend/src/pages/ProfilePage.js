import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileStart, updateProfileSuccess } from '../store/userSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { loading, error: reduxError } = useSelector(state => state.user);
  const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data with current user data
  React.useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || 'male',
        weight: user.weight || '',
        height: user.height || '',
        activityLevel: user.activityLevel || 'sedentary',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.username || !formData.email || !formData.age || !formData.gender || !formData.weight || !formData.height) {
      setError('Please fill in all required fields');
      return;
    }

    dispatch(updateProfileStart());

    // In a real app, we would call the backend API here
    // For now, we'll simulate the API call
    setTimeout(() => {
      // Simulate successful update
      dispatch(updateProfileSuccess(formData));
      setShowSuccess(true);

      // Also update auth state username if changed
      // In a real app, this would come from the backend response
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-brand-light/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Profile Settings
          </h1>
          <p className="mt-2 text-slate-400">
            Update your personal information and preferences
          </p>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-neon-green/20 border border-neon-green/50 rounded-lg text-neon-green flex items-center shadow-lg shadow-neon-green/10">
             <svg className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
             </svg>
            Profile updated successfully!
          </div>
        )}

        {/* Error message */}
        {(error || reduxError) && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 flex items-center">
            <svg className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error || reduxError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-8 rounded-2xl">
          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="input-premium"
              value={formData.username || ''}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="input-premium"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Age
              </label>
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                className="input-premium"
                value={formData.age || ''}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Gender
              </label>
              <select
                name="gender"
                className="input-premium py-2.5"
                value={formData.gender || 'male'}
                onChange={handleChange}
              >
                <option value="male" className="bg-slate-900">Male</option>
                <option value="female" className="bg-slate-900">Female</option>
                <option value="other" className="bg-slate-900">Other</option>
              </select>
            </div>
          </div>

          {/* Weight and Height */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                min="1"
                step="0.1"
                className="input-premium"
                value={formData.weight || ''}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                min="1"
                className="input-premium"
                value={formData.height || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Activity Level
            </label>
            <select
              name="activityLevel"
              className="input-premium py-2.5"
              value={formData.activityLevel || 'sedentary'}
              onChange={handleChange}
            >
              <option value="sedentary" className="bg-slate-900">Sedentary (little or no exercise)</option>
              <option value="lightly active" className="bg-slate-900">Lightly active (light exercise 1-3 days/week)</option>
              <option value="moderately active" className="bg-slate-900">Moderately active (moderate exercise 3-5 days/week)</option>
              <option value="very active" className="bg-slate-900">Very active (hard exercise 6-7 days/week)</option>
              <option value="extra active" className="bg-slate-900">Extra active (very hard exercise & physical job)</option>
            </select>
          </div>

          {/* Current BMR Display */}
          {formData.age && formData.weight && formData.height && formData.gender && (
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <h2 className="text-lg font-medium text-slate-200 mb-4">
                Your Basal Metabolic Rate (BMR)
              </h2>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-inner">
                <div className="text-center">
                  {/* Calculate BMR using Mifflin-St Jeor equation */}
                  {(() => {
                    const weight = parseFloat(formData.weight) || 0;
                    const height = parseFloat(formData.height) || 0;
                    const age = parseInt(formData.age) || 0;
                    const gender = formData.gender || 'male';

                    if (weight && height && age) {
                      let bmr;
                      if (gender === 'male') {
                        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
                      } else {
                        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
                      }

                      return (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-slate-400">
                            Estimated calories burned at rest per day:
                          </p>
                          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-light to-white">
                            {bmr.toFixed(0)} <span className="text-lg font-normal text-slate-500">kcal/day</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Calculated using the Mifflin-St Jeor Equation
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button type="submit"
              className="btn-premium w-full shadow-brand/20 shadow-xl"
              disabled={loading}
            >
              {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;