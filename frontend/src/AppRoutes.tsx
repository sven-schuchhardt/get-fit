import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ExercisePage } from "./pages/ExercisePage/ExercisePage";
import { ExerciseInfoPage } from "./pages/ExerciseInfoPage/ExerciseInfoPage";
import { ExerciseEditPage } from "./pages/ExerciseEditPage/ExerciseEditPage";
import { StrengthTrainingPage } from "./pages/StrengthTrainingPage/StrengthTrainingPage";
import { DiaryPage } from "./pages/DiaryPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ExerciseAddPage } from "./pages/ExerciseAddPage/ExerciseAddPage";
import { AddWeightExercisePlan } from "./pages/WeightExercisePlanAddPage/AddWeightExercisePlanPage";
import { getAuth } from "firebase/auth";
import { app } from "./FirebaseAuthentication";
import { AddExerciseSection } from "./pages/WeightExercisePlanAddPage/AddExercisesSection";

export type RouteConfig = RouteProps & { path: string; isPrivate?: boolean };

export const routes: RouteConfig[] = [
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    isPrivate: true,
  },
  {
    path: "/",
    element: <Navigate to={"/home"} replace />,
    index: true,
  },
  {
    path: "/exercisepage",
    element: <ExercisePage />,
  },
  {
    path: "/exercisepage/info",
    element: <ExerciseInfoPage />,
  },
  {
    path: "/exercise/edit",
    element: <ExerciseEditPage />,
    index: true,
    isPrivate: true,
  },
  {
    path: "/exercise/add",
    element: <ExerciseAddPage />,
    index: true,
    isPrivate: true,
  },
  {
    path: "/diary",
    element: <DiaryPage />,
    // isPrivate: true,
  },
  {
    path: "/strengthtraining",
    element: <StrengthTrainingPage />,
    index: true,
  },
  {
    path: "/strengthtraining/add",
    element: <AddWeightExercisePlan />,
    index: true,
    isPrivate: true,
  },
  {
    path: "/strengthtraining/edit/:id",
    element: <AddExerciseSection />,
    index: true,
  },
];

export interface AuthRequiredProps {
  to?: string;
  children?: React.ReactNode;
}

const AuthRequired = ({ to = "/login", children }: AuthRequiredProps) => {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    return <Navigate to={to} replace />;
  }
  return <>{children}</>;
};

const renderRouteMap = ({ isPrivate, element, ...restRoute }: RouteConfig) => {
  const authRequiredElement = isPrivate ? (
    <AuthRequired>{element}</AuthRequired>
  ) : (
    element
  );

  return (
    <Route key={restRoute.path} element={authRequiredElement} {...restRoute} />
  );
};

export const AppRoutes = () => {
  return <Routes>{routes.map(renderRouteMap)}</Routes>;
};
