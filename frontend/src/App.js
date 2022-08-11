import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux'
import Home from "./pages/home/Home";
import Navigation from "./components/shared/navigation/Navigation";
import Authenticate from "./pages/authenticate/Authenticate";
import Activate from "./pages/activate/Activate";
import Rooms from './pages/rooms/Rooms'
import useLoadingWithRefresh from "./hooks/useLoadingWithRefresh";
import Loader from './components/shared/loader/Loader'
import Room from "./pages/room/Room";


function App() {
  const { loading } = useLoadingWithRefresh();
  return loading ? (
    <Loader message='Loading, please wait..'/>
  ) : (
    <BrowserRouter>
      <Navigation />
      <Switch>
        <GuestRoute path="/" exact>
          <Home />
        </GuestRoute>
        <GuestRoute path="/authenticate">
          <Authenticate />
        </GuestRoute>
        <SemiProtectedRoute path="/active">
          <Activate />
        </SemiProtectedRoute>
        <ProtectedRoute path='/rooms'>
          <Rooms/>
        </ProtectedRoute>
        <ProtectedRoute path='/room/:id'>
          <Room/>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

const GuestRoute = ({ children, ...rest }) => {
  const {isAuth} = useSelector(state => state.auth);
  return (
    <Route
      {...rest}

      

      render={({ location }) => {
        return isAuth ? (
          <Redirect
            to={{
              pathname: "/rooms",
              state: { form: location },
            }}
          />
        ) : (
          children
        );
      }}
    />
  );
};

const SemiProtectedRoute = ({ children, ...rest }) => {
  const { isAuth, user } = useSelector((state) => state.auth);

  
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return !isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : isAuth && !user?.activated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/rooms",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

const ProtectedRoute = ({children, ...rest})=>{
  const { isAuth, user } = useSelector((state) => state.auth);

  return(
    <Route {...rest}
      render={({ location }) => {
        return !isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : isAuth && !user?.activated ? (
          <Redirect to={{
            pathname: 'active',
            state: {from: location }
          }} />
        ) : (
          children
        );
    } }/>
  )
}

export default App;
