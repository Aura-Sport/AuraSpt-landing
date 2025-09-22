import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./css/index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./LandingPage/routes/Login";
import { Register } from "./LandingPage/routes/Register";
import { RequireTrainer } from "./intranet/RequireTrainer";
import { IntranetLayout } from "./intranet/Layout";
import { StudentProfile } from "./intranet/pages/StudentProfile";
import { DashboardPage } from "./intranet/pages/Dashboard";
import { StudentsPage } from "./intranet/pages/Students";
import { RoutinesPage } from "./intranet/pages/Routines";
import { AssignRoutinePage } from "./intranet/pages/AssignRoutine";
import { UserRoutinesPage } from "./intranet/pages/UserRoutines";
import { UserHistoryPage } from "./intranet/pages/UserHistory";
import { UserSessionDetailPage } from "./intranet/pages/UserSessionDetail";
import { EditTrainerRoutinePage } from "./intranet/pages/EditTrainerRoutine";
import { ProfilePage } from "./intranet/pages/Profile";
import { LandingPage } from "./LandingPage";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/landing", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/home",
    element: (
      <RequireTrainer>
        <IntranetLayout />
      </RequireTrainer>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "students", element: <StudentsPage /> },
      { path: "students/:id", element: <StudentProfile /> },
      { path: "routines", element: <RoutinesPage /> },
      { path: "routines/assign/:id", element: <AssignRoutinePage /> },
      { path: "routines/user/:id", element: <UserRoutinesPage /> },
      { path: "routines/history/:id", element: <UserHistoryPage /> },
      { path: "routines/history/:id/session/:sessionId", element: <UserSessionDetailPage /> },
      { path: "routines/edit/:routineId", element: <EditTrainerRoutinePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <DashboardPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
