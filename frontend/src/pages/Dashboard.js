import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodayStart, fetchTodaySuccess, fetchHistoryStart, fetchHistorySuccess } from '../store/logsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { todayLog, history, loading } = useSelector(state => state.logs);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // Fetch today's log and history
    dispatch(fetchTodayStart());
    dispatch(fetchHistoryStart());

    // In a real app, we would make API calls here
    // For now, we'll simulate with mock data
    setTimeout(() => {
      // Mock today's log
      const mockTodayLog = {
        _id: '1',
        date: new Date().toISOString(),
        meal: {
          foodType: 'Grilled chicken salad',
          portionSize: '2 cups',
          calories: 450,
          protein: 35,
          carbs: 20,
          fats: 25
        },
        exerciseBurned: 300,
        totalConsumed: 450,
        totalBurned: 1863 + 300, // BMR + exercise
        netCalories: 450 - (1863 + 300)
      };

      // Mock history
      const mockHistory = [
        {
          _id: '2',
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          meal: {
            foodType: 'Pizza',
            portionSize: '2 slices',
            calories: 600,
            protein: 25,
            carbs: 60,
            fats: 25
          },
          exerciseBurned: 0,
          totalConsumed: 600,
          totalBurned: 1863,
          netCalories: 600 - 1863
        }
      ];

      dispatch(fetchTodaySuccess(mockTodayLog));
      dispatch(fetchHistorySuccess(mockHistory));
    }, 1000);
  }, [dispatch]);

  if (loading && !todayLog && history.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const totalBurned = todayLog ? todayLog.totalBurned : 0;
  const netCalories = todayLog ? todayLog.netCalories : 0;
  const calorieBank = user ? user.calorieBank || 0 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-brand-dark/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[0%] w-[400px] h-[400px] bg-neon-green/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-2 text-slate-400">
            Here's your nutrition overview for today
          </p>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Calories Burned */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-brand/20 rounded-xl">
                <svg className="h-6 w-6 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0a2 2 0 100-4 2 2 0 000 4zm-6 0a2 2 0 100-4 2 2 0 000 4zm10 0v3a2 2 0 01-2 2H5a2 2 0 01-2-2V9m8 3l3-3 3 3M5 7.618A11.956 11.956 0 0112 2c1.07 0 2.104.26 3.08.718m-9 6.382a11.956 11.956 0 003.08.718M12 2v7.382c-.462.09-.895.256-1.25.474M12 18c-2.209 0-4.22-.68-5.927-1.858M16 11.364a3.987 3.987 0 00-.546 1.315M12 7v5"></path>
                </svg>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-slate-400">Calories Burned</dt>
                <dd className="mt-1 text-2xl font-bold text-white">
                  {totalBurned.toFixed(0)} <span className="text-sm font-normal text-slate-500">kcal</span>
                </dd>
              </div>
            </div>
          </div>

          {/* Calories Consumed */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-neon-green/20 rounded-xl">
                <svg className="h-6 w-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-slate-400">Calories Consumed</dt>
                <dd className="mt-1 text-2xl font-bold text-white">
                  {todayLog ? todayLog.totalConsumed.toFixed(0) : 0} <span className="text-sm font-normal text-slate-500">kcal</span>
                </dd>
              </div>
            </div>
          </div>

          {/* Net Calories */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group col-span-1 sm:col-span-2 lg:col-span-1">
             <div className="absolute top-0 right-0 w-24 h-24 bg-slate-700/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
             <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-slate-800 rounded-xl border border-slate-700">
                <svg className="h-6 w-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 00-1.065-.202 3.23 3.23 0 00-4.47 0A3.42 3.42 0 000 4.697v.305a3.42 3.42 0 00.268.706A3.23 3.23 0 002.305 8a3.23 3.23 0 002.237.58l.366.185A3.42 3.42 0 005 9.305V12a3.42 3.42 0 00.358.84.996.996 0 00.698 0 3.42 3.42 0 00.358-.84V9.305a3.42 3.42 0 00.218-.492 3.23 3.23 0 00.56-.22l.366-.184a3.23 3.23 0 002.237-.58A3.42 3.42 0 006.97 5.403v-.305a3.42 3.42 0 00-1.065-.202z"/>
                </svg>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-slate-400">Net Calories</dt>
                <dd className={`mt-1 text-2xl font-bold ${netCalories >= 0 ? 'text-red-400' : 'text-neon-green'}`}>
                  {netCalories.toFixed(0)} <span className="text-sm font-normal text-slate-500 opacity-70">kcal</span>
                </dd>
              </div>
            </div>
          </div>

          {/* Calorie Bank */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-yellow-500/20 rounded-xl">
                <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-slate-400">Calorie Bank</dt>
                <dd className="mt-1 text-2xl font-bold text-yellow-500">
                  {calorieBank.toFixed(0)} <span className="text-sm font-normal text-slate-500 opacity-70">kcal</span>
                </dd>
                {calorieBank > 0 && (
                  <dd className="text-xs text-slate-500 mt-1">
                    Surplus to burn
                  </dd>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Meal */}
        {todayLog && (
          <div className="glass-panel rounded-2xl mb-8 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-800/30">
              <h2 className="text-lg font-semibold text-white">
                Today's Meal
              </h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-slate-400">Food Type & Portion</dt>
                  <dd className="mt-1 text-lg font-semibold text-white">
                    {todayLog.meal.foodType}
                  </dd>
                  <dd className="text-sm text-slate-400">
                    {todayLog.meal.portionSize}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-400">Calories</dt>
                  <dd className="mt-1 text-xl font-bold text-brand-light">
                    {todayLog.meal.calories}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-400">Protein</dt>
                  <dd className="mt-1 text-xl font-bold text-white">
                    {todayLog.meal.protein}g
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-400">Carbs</dt>
                  <dd className="mt-1 text-xl font-bold text-white">
                    {todayLog.meal.carbs}g
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-400">Fats</dt>
                  <dd className="mt-1 text-xl font-bold text-white">
                    {todayLog.meal.fats}g
                  </dd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent History */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-800/30">
            <h2 className="text-lg font-semibold text-white">
              Recent Activity
            </h2>
          </div>
          {history.length > 0 ? (
            <div className="px-6 py-4">
              <div className="space-y-4">
                {history.map((log, idx) => (
                  <div key={log._id} className={`pt-4 ${idx !== 0 ? 'border-t border-slate-700/50' : ''}`}>
                    <div className="flex justify-between items-center group">
                      <div>
                        <p className="text-base font-medium text-white group-hover:text-brand-light transition-colors">
                          {log.meal.foodType}
                        </p>
                        <p className="text-sm text-slate-400">
                          {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${log.netCalories >= 0 ? 'text-red-400' : 'text-neon-green'}`}>
                          {log.netCalories >= 0 ? '+' : ''}{log.netCalories.toFixed(0)} <span className="text-sm font-normal opacity-70">kcal</span>
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          {log.netCalories >= 0 ? 'Surplus' : 'Deficit'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-400 text-lg">No recent activity found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;