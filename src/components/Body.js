import Login from "./Login";
import Browse from "./Browse";
import MovieDetails from "./MovieDetails";
import WelcomePage from "./WelcomePage";
import UserProfile from "./UserProfile";
import WatchLater from "./WatchLater";
import MovieRecommendations from "./MovieRecommendations";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";

const Body = () => {
  const appRoute = createBrowserRouter([
    {
      path: "/",
      element: <WelcomePage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path: "/movie/:movieId",
      element: <MovieDetails />,
    },
    {
      path: "/profile",
      element: <UserProfile />,
    },
    {
      path: "/watchlater",
      element: <WatchLater />,
    },
    {
      path: "/recommendations",
      element: <MovieRecommendations />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRoute} />
    </div>
  );
};

export default Body;