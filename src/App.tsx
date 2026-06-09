import { Route, Routes } from "react-router-dom";
import SplashPage from "@/pages/SplashPage";
import ModelHubPage from "@/pages/ModelHubPage";
import ChatPage from "@/pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/models" element={<ModelHubPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
