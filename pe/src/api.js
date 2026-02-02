import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// User API
export const userAPI = {
  register: (name, email, password) =>
    api.post("/users/register", { name, email, password }),

  login: (email, password) => api.post("/users/login", { email, password }),

  getUser: (userId) => api.get(`/users/${userId}`),

  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),

  deleteUser: (userId) => api.delete(`/users/${userId}`),
};

// Expense API
export const expenseAPI = {
  addExpense: (userId, expenseData) =>
    api.post(`/expenses/${userId}`, expenseData),

  getExpenses: (userId) => api.get(`/expenses/${userId}`),

  getAllExpenses: (userId) => api.get(`/expenses/${userId}/all`),

  getExpensesByCategory: (userId, category) =>
    api.get(`/expenses/${userId}/by-category/${category}`),

  getExpensesByDateRange: (userId, startDate, endDate) =>
    api.get(`/expenses/${userId}/date-range`, {
      params: { startDate, endDate },
    }),

  getTotalSpending: (userId) => api.get(`/expenses/${userId}/total`),

  getCategoryStats: (userId) => api.get(`/expenses/${userId}/category-stats`),

  updateExpense: (userId, expenseId, expenseData) =>
    api.put(`/expenses/${userId}/${expenseId}`, expenseData),

  deleteExpense: (userId, expenseId) =>
    api.delete(`/expenses/${userId}/${expenseId}`),

  deleteAllExpenses: (userId) => api.delete(`/expenses/${userId}`),
};

// Budget API
export const budgetAPI = {
  setBudget: (userId, budgetData) => api.post(`/budgets/${userId}`, budgetData),

  getBudgets: (userId) => api.get(`/budgets/${userId}`),

  getBudgetsWithSpending: (userId) =>
    api.get(`/budgets/${userId}/with-spending`),

  updateBudget: (userId, budgetId, budgetData) =>
    api.put(`/budgets/${userId}/${budgetId}`, budgetData),

  deleteBudget: (userId, budgetId) =>
    api.delete(`/budgets/${userId}/${budgetId}`),
};

export default api;
