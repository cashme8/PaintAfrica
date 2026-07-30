import { Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../auth/ProtectedRoute";

import Home from "../pages/customer/Home";
import HowItWorks from "../pages/customer/HowItWorks";
import Login from "../pages/customer/Login";
import Register from "../pages/customer/Register";
import Catalog from "../pages/customer/Catalog";
import OrderForm from "../pages/customer/OrderForm";
import MyOrders from "../pages/customer/MyOrders";
import Chat from "../pages/customer/Chat";
import BusinessDashboard from "../pages/business/Dashboard";
import DesignerPortfolio from "../pages/designer/Portfolio";
import AdminUsers from "../pages/admin/Users";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route
          path="/order/new"
          element={
            <ProtectedRoute roles={["customer"]}>
              <OrderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={["customer"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId/chat"
          element={
            <ProtectedRoute roles={["customer", "business"]}>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Business */}
        <Route
          path="/business/dashboard"
          element={
            <ProtectedRoute roles={["business"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />

        {/* Designer */}
        <Route
          path="/designer/portfolio"
          element={
            <ProtectedRoute roles={["designer"]}>
              <DesignerPortfolio />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
