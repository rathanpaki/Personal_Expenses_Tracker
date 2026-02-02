# 🚀 Quick Start Guide - Expense Tracker Pro

## Step 1: Database Setup

Make sure MySQL is installed and running. Create the database:

```bash
mysql -u root -p
```

Enter your password, then run:

```sql
CREATE DATABASE expense_tracker;
EXIT;
```

## Step 2: Start the Backend

1. Open a terminal and navigate to the `expense-tracker` folder
2. Run the application:

```bash
# For Windows
mvnw spring-boot:run

# For Mac/Linux
./mvnw spring-boot:run
```

Wait until you see: `Started ExpenseTrackerApplication`

The backend will be running at: **http://localhost:8080**

## Step 3: Start the Frontend

1. Open a new terminal and navigate to the `pe` folder
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be running at: **http://localhost:5173**

## Step 4: Use the Application

1. Open **http://localhost:5173** in your browser
2. Create a new account by clicking "Sign Up"
3. Fill in your details and submit
4. Start adding expenses!

## 🎯 First Steps After Login

1. **Add an Expense**: Use the "Add Expense" form on the left
   - Enter a description (e.g., "Coffee")
   - Enter the amount
   - Select a category
   - Choose the date
   - Click "Add Expense"

2. **Set a Budget**: Click "Set Budget" button
   - Choose a category
   - Enter your monthly budget amount
   - Click "Set Budget"

3. **View Reports**: Check the "Expense Reports" section
   - Switch between Weekly and Monthly views
   - See spending trends and category distribution

4. **Export Data**: Click "Export CSV" to download your expenses

## ⚙️ Configuration

### Backend Configuration (`application.properties`)

Located at: `expense-tracker/src/main/resources/application.properties`

```properties
server.port=8080  # Backend port
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker  # Database URL
spring.datasource.username=root  # Database username
spring.datasource.password=Paki@0104  # Database password
```

### Frontend Configuration (`api.js`)

Located at: `pe/src/api.js`

```javascript
const API_BASE_URL = "http://localhost:8080/api"; // Backend API URL
```

## 🔧 Troubleshooting

### Backend won't start

- Check if MySQL is running
- Verify the database exists: `CREATE DATABASE expense_tracker;`
- Check if port 8080 is available

### Frontend can't connect to backend

- Verify backend is running on http://localhost:8080
- Check browser console for errors (F12)
- Verify CORS is enabled in SecurityConfig

### Port already in use

**Backend**: Edit `application.properties` and change `server.port`
**Frontend**: Edit `vite.config.js` and change the port

## 📚 Key Features to Try

### 1. Dark Mode

Click the moon/sun icon in the top-right to toggle dark mode

### 2. Budget Alerts

When you exceed or approach a budget, you'll see notifications

### 3. Smart Insights

The app shows spending insights below the quick actions

### 4. Category Filtering

Use the filter dropdown in "Recent Expenses" to view specific categories

### 5. Chart Views

Switch between Weekly and Monthly views in the reports section

## 🎨 UI Highlights

- **Smooth Animations**: All elements have subtle animations
- **Gradient Backgrounds**: Modern gradient design
- **Responsive Layout**: Works on any screen size
- **Color-coded Categories**: Each category has a unique color
- **Real-time Updates**: Changes appear instantly

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6+ support

## 🆘 Need Help?

1. Check the README.md for detailed documentation
2. Review the API endpoints in the README
3. Check browser console for error messages (F12 > Console)
4. Verify backend logs in the terminal

## 🎉 You're All Set!

Enjoy tracking your expenses! 💰📊

---

**Happy Tracking! 🚀**
