import { createHashRouter, RouterProvider } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { MedicalMonitoring } from "./components/MedicalMonitoring";
import { EcoNutrition } from "./components/EcoNutrition";
import { SystemControl } from "./components/SystemControl";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "medical", Component: MedicalMonitoring },
      { path: "eco-nutrition", Component: EcoNutrition },
      { path: "system-control", Component: SystemControl },
    ],
  },
]);