import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingDown, TrendingUp, Calendar, DollarSign, Trash2, Filter, Bell, Download, AlertCircle, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [budgets, setBudgets] = useState({});
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState('food');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [reportView, setReportView] = useState('weekly');

  const categories = [
    { id: 'food', label: 'Food & Dining', color: '#FF6B6B', icon: '🍽️' },
    { id: 'transport', label: 'Transport', color: '#4ECDC4', icon: '🚗' },
    { id: 'entertainment', label: 'Entertainment', color: '#95E1D3', icon: '🎬' },
    { id: 'shopping', label: 'Shopping', color: '#F38181', icon: '🛍️' },
    { id: 'bills', label: 'Bills & Utilities', color: '#AA96DA', icon: '💡' },
    { id: 'health', label: 'Health', color: '#FCBAD3', icon: '⚕️' },
    { id: 'other', label: 'Other', color: '#A8D8EA', icon: '📦' }
  ];

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('expenses');
    const storedBudgets = localStorage.getItem('budgets');
    if (stored) setExpenses(JSON.parse(stored));
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

    const newExpense = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date,
      timestamp: new Date().toISOString()
    };

    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);

    // Check budget alert
    checkBudgetAlert(category, parseFloat(amount));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const setBudget = (e) => {
    e.preventDefault();
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) return;
    
    setBudgets({
      ...budgets,
      [budgetCategory]: parseFloat(budgetAmount)
    });
    
    setBudgetAmount('');
    setShowBudgetModal(false);
  };

  const checkBudgetAlert = (cat, newAmount) => {
    if (!budgets[cat]) return;
    
    const currentSpending = expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0) + newAmount;
    
    const budget = budgets[cat];
    const percentage = (currentSpending / budget) * 100;
    
    if (percentage >= 90 && percentage < 100) {
      alert(`⚠️ Warning: You've spent ${percentage.toFixed(1)}% of your ${categories.find(c => c.id === cat).label} budget!`);
    } else if (percentage >= 100) {
      alert(`🚨 Alert: You've exceeded your ${categories.find(c => c.id === cat).label} budget by $${(currentSpending - budget).toFixed(2)}!`);
    }
  };

  // Filter and calculate totals
  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(exp => exp.category === filterCategory);

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate category spending with budget comparison
  const categoryData = categories.map(cat => {
    const spent = expenses.filter(exp => exp.category === cat.id).reduce((sum, exp) => sum + exp.amount, 0);
    const budget = budgets[cat.id] || 0;
    return {
      ...cat,
      spent,
      budget,
      percentage: budget > 0 ? (spent / budget) * 100 : 0,
      remaining: budget > 0 ? budget - spent : 0
    };
  }).filter(cat => cat.spent > 0 || cat.budget > 0);

  // Get date ranges
  const getDateRange = (type) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return type === 'weekly' ? startOfWeek : startOfMonth;
  };

  // Generate report data
  const generateReportData = () => {
    const startDate = getDateRange(reportView);
    const reportExpenses = expenses.filter(exp => new Date(exp.date) >= startDate);
    
    if (reportView === 'weekly') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dailyData = Array(7).fill(0).map((_, i) => {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        const dayExpenses = reportExpenses.filter(exp => 
          new Date(exp.date).toDateString() === day.toDateString()
        );
        return {
          day: dayNames[day.getDay()],
          amount: dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)
        };
      });
      return dailyData;
    } else {
      const weeks = Math.ceil(new Date().getDate() / 7);
      const weeklyData = Array(weeks).fill(0).map((_, i) => {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekExpenses = reportExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= weekStart && expDate <= weekEnd;
        });
        
        return {
          week: `Week ${i + 1}`,
          amount: weekExpenses.reduce((sum, exp) => sum + exp.amount, 0)
        };
      });
      return weeklyData;
    }
  };

  const reportData = generateReportData();
  const pieData = categoryData.filter(cat => cat.spent > 0).map(cat => ({
    name: cat.label,
    value: cat.spent,
    color: cat.color
  }));

  // Export functionality
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = expenses.map(exp => [
      exp.date,
      exp.description,
      categories.find(c => c.id === exp.category).label,
      exp.amount.toFixed(2)
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="expense-tracker-container">
      <div className="expense-tracker-content">
        {/* Header */}
        <div className="expense-tracker-header">
          <h1 className="expense-tracker-title">
            Expense Tracker Pro
          </h1>
          <p className="expense-tracker-subtitle">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-container">
          <button
            onClick={() => setShowBudgetModal(true)}
            className="action-button"
          >
            <Target size={18} />
            Set Budget
          </button>
          <button
            onClick={exportToCSV}
            disabled={expenses.length === 0}
            className="action-button export-button"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card animation-delay-1">
            <div className="stat-card-header">
              <DollarSign size={20} color="#667eea" />
              <span className="stat-card-label">
                Total Spent
              </span>
            </div>
            <div className="stat-card-value">
              ${totalExpenses.toFixed(2)}
            </div>
          </div>

          <div className="stat-card animation-delay-2">
            <div className="stat-card-header">
              <TrendingDown size={20} color="#f43f5e" />
              <span className="stat-card-label">
                Transactions
              </span>
            </div>
            <div className="stat-card-value">
              {filteredExpenses.length}
            </div>
          </div>

          <div className="stat-card animation-delay-3">
            <div className="stat-card-header">
              <Calendar size={20} color="#10b981" />
              <span className="stat-card-label">
                Average
              </span>
            </div>
            <div className="stat-card-value">
              ${filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        {categoryData.some(cat => cat.budget > 0 && cat.percentage >= 80) && (
          <div className="budget-alert">
            <div className="budget-alert-header">
              <Bell size={20} color="#f59e0b" />
              <h3 className="budget-alert-title">
                Budget Alerts
              </h3>
            </div>
            {categoryData
              .filter(cat => cat.budget > 0 && cat.percentage >= 80)
              .map(cat => (
                <div key={cat.id} className={`alert-item ${cat.percentage >= 100 ? 'alert-danger' : 'alert-warning'}`}>
                  <strong>{cat.icon} {cat.label}:</strong> {cat.percentage.toFixed(1)}% of budget used
                  {cat.percentage >= 100 && ` (Over by $${Math.abs(cat.remaining).toFixed(2)})`}
                </div>
              ))}
          </div>
        )}

        <div className="form-budget-grid">
          {/* Add Expense Form */}
          <div className="card animation-delay-1">
            <h2 className="card-title">
              Add Expense
            </h2>
            <form onSubmit={addExpense}>
              <div className="form-group">
                <label className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Coffee at Starbucks"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input select-input"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-button"
              >
                <PlusCircle size={20} />
                Add Expense
              </button>
            </form>
          </div>

          {/* Budget Overview */}
          {categoryData.length > 0 && (
            <div className="card animation-delay-2">
              <h2 className="card-title">
                Budget vs Spending
              </h2>
              {categoryData.map((cat, index) => (
                <div key={cat.id} className="budget-item">
                  <div className="budget-header">
                    <span className="budget-name">
                      {cat.icon} {cat.label}
                    </span>
                    <span className="budget-amount">
                      ${cat.spent.toFixed(2)} {cat.budget > 0 && `/ $${cat.budget.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{
                        width: cat.budget > 0 ? `${Math.min(cat.percentage, 100)}%` : '100%',
                        background: cat.percentage >= 100 ? '#ef4444' : cat.percentage >= 80 ? '#f59e0b' : cat.color,
                        transitionDelay: `${index * 0.1}s`
                      }}
                    />
                  </div>
                  {cat.budget > 0 && (
                    <div className="budget-remaining">
                      {cat.remaining >= 0 ? `$${cat.remaining.toFixed(2)} remaining` : `Over by $${Math.abs(cat.remaining).toFixed(2)}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div className="card animation-delay-3">
          <div className="reports-header">
            <h2 className="card-title">
              Expense Reports
            </h2>
            <div className="view-toggle">
              <button
                onClick={() => setReportView('weekly')}
                className={`view-button ${reportView === 'weekly' ? 'active' : 'inactive'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setReportView('monthly')}
                className={`view-button ${reportView === 'monthly' ? 'active' : 'inactive'}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="reports-grid">
            {/* Line/Bar Chart */}
            <div>
              <h3 className="chart-title">
                Spending Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey={reportView === 'weekly' ? 'day' : 'week'} 
                    stroke="#64748b"
                    style={{ fontSize: '0.75rem', fontFamily: '"Work Sans", sans-serif' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: '0.75rem', fontFamily: '"Work Sans", sans-serif' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontFamily: '"Work Sans", sans-serif'
                    }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            {pieData.length > 0 && (
              <div>
                <h3 className="chart-title">
                  Category Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontFamily: '"Work Sans", sans-serif'
                      }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Expense List */}
        <div className="card animation-delay-4">
          <div className="expense-list-header">
            <h2 className="card-title">
              Recent Expenses
            </h2>
            <div className="filter-container">
              <Filter size={18} color="#64748b" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <TrendingUp size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p className="empty-state-text">
                {filterCategory === 'all' 
                  ? 'No expenses yet. Start tracking your spending!'
                  : 'No expenses in this category.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredExpenses.map((expense, index) => {
                const cat = categories.find(c => c.id === expense.category);
                return (
                  <div
                    key={expense.id}
                    className="expense-card"
                    style={{
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    <div className="expense-card-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                        <div 
                          className="expense-icon"
                          style={{
                            background: `${cat.color}20`
                          }}
                        >
                          {cat.icon}
                        </div>
                        <div className="expense-details">
                          <div className="expense-description">
                            {expense.description}
                          </div>
                          <div className="expense-meta">
                            <span>{cat.label}</span>
                            <span>•</span>
                            <span>{new Date(expense.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="expense-actions">
                        <div className="expense-amount">
                          ${expense.amount.toFixed(2)}
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => deleteExpense(expense.id)}
                          aria-label="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div 
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBudgetModal(false);
          }}
        >
          <div className="modal-content">
            <h2 className="card-title">
              Set Category Budget
            </h2>
            <form onSubmit={setBudget}>
              <div className="form-group">
                <label className="form-label">
                  Category
                </label>
                <select
                  value={budgetCategory}
                  onChange={(e) => setBudgetCategory(e.target.value)}
                  className="form-input select-input"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Budget Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: 'white',
                    color: '#64748b',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    fontFamily: '"Work Sans", sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    fontFamily: '"Work Sans", sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  Set Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;