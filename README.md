# 💰 Expense Tracker Pro - Full Stack Application

A modern, feature-rich expense tracking application with a Spring Boot backend and React frontend. Manage your finances with ease, set budgets, and gain insights into your spending patterns.

## 🌟 Features

### Backend (Spring Boot)

- **User Authentication**: Register and login with email/password
- **Expense Management**: Add, view, update, and delete expenses
- **Budget Management**: Set category-based budgets and track spending
- **Analytics**: Get detailed spending insights by category and time period
- **CORS Enabled**: Seamless frontend-backend communication
- **RESTful API**: Well-structured endpoints for all operations

### Frontend (React + Vite)

- **User Authentication UI**: Beautiful sign-in and sign-up pages
- **Dashboard**: Real-time expense tracking and statistics
- **Budget Tracking**: Visual progress bars and alerts when budgets are exceeded
- **Charts & Graphs**:
  - Area chart for spending trends (weekly/monthly)
  - Pie chart for category distribution
  - Real-time category statistics
- **Smart Notifications**: Toast notifications for actions and alerts
- **Dark Mode**: Toggle between light and dark themes
- **Spending Insights**: AI-like suggestions based on spending patterns
- **Data Export**: Export expenses to CSV format
- **Responsive Design**: Works perfectly on desktop and mobile

## 📋 Prerequisites

### Backend

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Frontend

- Node.js 18+
- npm or yarn

## 🚀 Getting Started

### 1. Database Setup

Create a MySQL database and user:

```sql
CREATE DATABASE expense_tracker;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'Paki@0104';
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

#### Navigate to backend directory

```bash
cd expense-tracker
```

#### Build the project

```bash
mvn clean install
```

#### Run the application

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

#### Navigate to frontend directory

```bash
cd pe
```

#### Install dependencies

```bash
npm install
```

#### Run the development server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

### Backend

```
expense-tracker/
├── src/main/java/com/paki/expense_tracker/
│   ├── config/
│   │   └── SecurityConfig.java          # CORS & Security Configuration
│   ├── controller/
│   │   ├── UserController.java          # User Authentication & Management
│   │   ├── ExpenseController.java       # Expense Management
│   │   └── BudgetController.java        # Budget Management
│   ├── entity/
│   │   ├── User.java                    # User Entity
│   │   ├── Expense.java                 # Expense Entity
│   │   └── Budget.java                  # Budget Entity
│   ├── repository/
│   │   ├── UserRepository.java          # User Database Access
│   │   ├── ExpenseRepository.java       # Expense Database Access
│   │   └── BudgetRepository.java        # Budget Database Access
│   └── ExpenseTrackerApplication.java   # Main Application Class
└── pom.xml
```

### Frontend

```
pe/
├── src/
│   ├── api.js                           # API Service Layer
│   ├── App.jsx                          # Main Application Component
│   ├── App.css                          # Application Styles
│   ├── main.jsx                         # React Entry Point
│   └── index.css                        # Global Styles
├── package.json
└── vite.config.js
```

## 🔌 API Endpoints

### User Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/{userId}` - Get user profile
- `PUT /api/users/{userId}` - Update user profile
- `DELETE /api/users/{userId}` - Delete user account

### Expense Endpoints

- `POST /api/expenses/{userId}` - Add expense
- `GET /api/expenses/{userId}` - Get all expenses
- `GET /api/expenses/{userId}/by-category/{category}` - Get expenses by category
- `GET /api/expenses/{userId}/date-range` - Get expenses by date range
- `GET /api/expenses/{userId}/total` - Get total spending stats
- `GET /api/expenses/{userId}/category-stats` - Get category-wise statistics
- `PUT /api/expenses/{userId}/{expenseId}` - Update expense
- `DELETE /api/expenses/{userId}/{expenseId}` - Delete expense

### Budget Endpoints

- `POST /api/budgets/{userId}` - Set budget for category
- `GET /api/budgets/{userId}` - Get all budgets
- `GET /api/budgets/{userId}/with-spending` - Get budgets with current spending
- `PUT /api/budgets/{userId}/{budgetId}` - Update budget
- `DELETE /api/budgets/{userId}/{budgetId}` - Delete budget

## 🎨 Tech Stack

### Backend

- **Spring Boot 4.0.2** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database Access
- **MySQL** - Database
- **Lombok** - Boilerplate Reduction
- **Maven** - Build Tool

### Frontend

- **React 19** - UI Library
- **Vite** - Build Tool
- **Axios** - HTTP Client
- **Recharts** - Charts & Graphs
- **Lucide React** - Icons
- **CSS3** - Styling (with animations & gradients)

## 🔐 Security Features

- CORS configuration for safe cross-origin requests
- Password-protected user accounts
- User-specific data isolation
- Secure API endpoints with user validation
- Input validation on both frontend and backend

## 💡 Creative Enhancements

1. **Smart Spending Insights**: AI-like suggestions based on your spending patterns
2. **Dark Mode**: Toggle for comfortable viewing in any light condition
3. **Real-time Notifications**: Toast notifications for all user actions
4. **Beautiful Animations**: Smooth transitions and micro-interactions
5. **Responsive Charts**: Interactive charts for better visualization
6. **Budget Alerts**: Get warned when approaching or exceeding budgets
7. **Category-based Organization**: Organize expenses by meaningful categories
8. **CSV Export**: Export all expenses for record-keeping
9. **Progressive Design**: Modern, clean, and intuitive UI

## 📊 Example Usage

1. **Sign Up**: Create an account with your email and password
2. **Add Expenses**: Track your spending by adding expenses with category and date
3. **Set Budgets**: Define spending limits for each category
4. **Monitor Progress**: View real-time budget utilization and spending trends
5. **Get Insights**: Receive suggestions based on your spending patterns
6. **Export Data**: Download expenses as CSV for external analysis

## 🐛 Troubleshooting

### Backend Issues

- **Port already in use**: Change `server.port` in `application.properties`
- **Database connection error**: Verify MySQL is running and credentials are correct
- **CORS errors**: Check `SecurityConfig.java` for allowed origins

### Frontend Issues

- **API not connecting**: Verify backend is running on `http://localhost:8080`
- **Build errors**: Run `npm install` again to ensure all dependencies are installed
- **Port conflict**: Change port in `vite.config.js` if needed

## 📝 Future Enhancements

- [ ] Email notifications for budget alerts
- [ ] Recurring expenses
- [ ] Multiple wallets/accounts
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Advanced filtering and search
- [ ] Mobile app version
- [ ] Cloud sync across devices
- [ ] Two-factor authentication

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ by Paki

## 📞 Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Happy Expense Tracking! 💰📊**
