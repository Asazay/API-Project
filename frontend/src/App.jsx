import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import HomePage from './components/HomePage/HomePage';
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';
import ManageSpotsPage from './components/ManageSpotsPage/ManageSpotsPage';
import UpdateSpotForm from './components/UpdateSpotForm/UpdateSpotForm';

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
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails/>
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm/>
      },
      {
        path: '/spots/current',
        element: <ManageSpotsPage/>
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotForm />
      },
      {
        path: '*',
        element: <h1>404: Not Found</h1>
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
