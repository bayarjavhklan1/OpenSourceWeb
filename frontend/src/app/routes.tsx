import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { FeedPage } from "./pages/FeedPage";
import { ActivityDetailPage } from "./pages/ActivityDetailPage";
import { CreateActivityPage } from "./pages/CreateActivityPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatPage } from "./pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "auth", Component: AuthPage },
      { path: "feed", Component: FeedPage },
      { path: "activity/:id", Component: ActivityDetailPage },
      { path: "create", Component: CreateActivityPage },
      { path: "profile/:userId?", Component: ProfilePage },
      { path: "chat/:chatId?", Component: ChatPage },
    ],
  },
]);
