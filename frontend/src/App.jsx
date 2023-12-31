// frontend/src/App.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import { Spots } from "./components/Spots";
import { SpotDetails } from "./components/SpotDetails";
import CreateSpot from "./components/CreateSpot/CreateSpot";
import ManageUserSpots from "./components/ManageSpots/ManageSpots";
import UpdateSpot from "./components/CreateSpot/UpdateSpot";
import { Modal, ModalProvider } from "./context/Modal";
import { Navigate } from "react-router-dom";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);



  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation isLoaded={isLoaded} />
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Spots />,
      },
      {
        path: "/spots",
        element: <Navigate to="/" replace />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetails />,
      },
      {
        path: "/spots/new",
        element: <CreateSpot />,
      },
      {
        path: "/spots/current",
        element: <ManageUserSpots />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <UpdateSpot />,
      },
      {
        path: "/*",
        element: <h1>Page not found</h1>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
