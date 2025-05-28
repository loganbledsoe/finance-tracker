import { Routes, Route, Link, Outlet } from "react-router-dom";
import TransactionsPage from "./pages/TransactionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import FinancialSummary from "./components/FinancialSummary";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Layout() {
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            FinanceTracker
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/transactions">
                  Transactions
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/categories">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet /> {/* Child routes will render here */}
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <div className="welcome-banner">
        <div className="container-fluid py-3">
          <h1 className="display-5 fw-bold">Welcome to Finance Tracker!</h1>
          <p className="col-md-8 fs-4">
            Hello User, here's your financial summary for the last month:
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h3>Last Month Summary</h3>
        <FinancialSummary />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/transactions" className="btn btn-primary">
                  Manage Transactions
                </Link>
                <Link to="/categories" className="btn btn-outline-secondary">
                  Manage Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Tips</h5>
              <p className="card-text">
                Track your expenses regularly for better financial habits. Set
                up budgets for each category to control your spending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route
          path="*"
          element={
            <div>
              <h2>Page Not Found</h2>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
