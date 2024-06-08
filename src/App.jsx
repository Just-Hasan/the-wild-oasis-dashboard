import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import Booking from "./pages/Booking";
import Checkin from "./pages/Checkin";
import ProtectedLayout from "./ui/ProtectedLayout";
import { DarkModeProvider } from "./context/DarkModeContext";

export default function App() {
  return (
    <>
      <DarkModeProvider>
        <GlobalStyles />
        <Routes>
          <Route
            element={
              <ProtectedLayout>
                <AppLayout />
              </ProtectedLayout>
            }
          >
            <Route index element={<Navigate to="/login" replace={true} />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="checkin">
              <Route path=":bookingId" index element={<Checkin />}></Route>
            </Route>
            <Route path="bookings">
              <Route index element={<Bookings />} />
              <Route path=":bookingId" element={<Booking />} />
            </Route>
            <Route path="cabins" element={<Cabins />} />
            <Route path="users" element={<Users></Users>}></Route>
            <Route path="settings" element={<Settings></Settings>}></Route>
            <Route path="account" element={<Account></Account>}></Route>
          </Route>
          <Route path="login" element={<Login></Login>}></Route>
          <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
        </Routes>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 5000 },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </DarkModeProvider>
    </>
  );
}
