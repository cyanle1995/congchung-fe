import React, { Component } from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from './component/Login';
import SelectDepartment from './component/SelectDepartment';
import UserList from './component/UserList';
import ChangePassword from './component/ChangePassword';
import ForgetPassword from './component/ForgetPass';
import Main from './component/Main';
import SoChungThuc from './component/SoChungThuc';
import SoSaoY from './component/SoSaoY';
import { setConfigAxios } from './api/httpClient';
class App extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount(){
    // await setConfigAxios()
  }
  render() {
    return (
        <BrowserRouter>
          <Switch>
          <Route path="/" exact={true} render={(props) => <Login {...props}/>} />
          <Route path="/login" exact={true} render={(props) => <Login {...props}/>} />
          <Route path="/department" exact={true} render={(props) => <SelectDepartment {...props}/>} />
          <Route path="/user-list" exact={true} render={(props) => <UserList {...props}/>} />
          <Route path="/change-password" exact={true} render={(props) => <ChangePassword {...props}/>} />
          <Route path="/forget-password" exact={true} render={(props) => <ForgetPassword {...props}/>} />
          <Route path="/congchung" exact={true} render={(props) => <Main {...props}/>} />
          <Route path="/chungthuc" exact={true} render={(props) => <SoChungThuc {...props}/>} />
          <Route path="/saoybanchinh" exact={true} render={(props) => <SoSaoY {...props}/>} />
          </Switch>
        </BrowserRouter>
    );
  }
}
export default App;
