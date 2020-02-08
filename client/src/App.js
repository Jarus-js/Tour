import React,{Suspense} from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
//Components
import User from "./user/pages/User";
//import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
//import UserPlace from "./places/pages/UserPlace";
//import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import Signup from "./user/pages/Signup";
import { AuthContext } from "./shared/components/context/auth-Context";
import { useAuth } from "./shared/components/hooks/auth-hook";

const NewPlace = React.lazy(()=> import('./places/pages/NewPlace'));
const UserPlace = React.lazy(()=> import('./places/pages/UserPlace'));
const UpdatePlace = React.lazy(()=> import('./places/pages/UpdatePlace'));

const App = () => {
  const { token, userId, login, logout } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/places/new" component={NewPlace} />
        <Route path="/places/:placeId" component={UpdatePlace} />
        <Route exact path="/" component={User} />
        <Route path="/:userId/places" component={UserPlace} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={User} />
        <Route path="/login" component={Auth} />
        <Route path="/signup" component={Signup} />
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userId: userId
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Suspense fallback={<p>Loading...</p>}>
          {routes}
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
