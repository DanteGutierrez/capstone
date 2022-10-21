import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import HomePage from './HomePage';
import Navigation from './Navigation';
import Login from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));

const URL = 'http://localhost:8888/';

const APIS = {
  schedule: URL + 'schedule/',
  course: URL + 'course/',
  account: URL + 'account/'
};

const getID = (id) => {
  let PID = id.pid;
  if (PID < 0) PID += 65536;
  return id.timestamp.toString(16) + id.machine.toString(16) + PID.toString(16) + id.increment.toString(16);
};

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: {
        authorized: "",
        admin: false,
        id: "",
        email: "",
        password: "",
        course: "",
        preferredCourses: [],
        preferredName: ""
      },
      page: "",
      error: "",
    };
  };
  updateCredentials  = (event) => {
    let target = event.target;
    let loginInfo = this.state.login;
    switch (target.name) {
      case "Email":
        loginInfo.email = target.value;
        break;
      case "Password":
        loginInfo.password = target.value;
        break;
      case "Name":
        loginInfo.name = target.value;
        break;
      case "Admin":
        loginInfo.admin = target.value;
        break;
      default:
        break;
    }
    this.setState({ login: loginInfo });
  }
  Login = () => {
    if (this.state.login.email == "" || this.state.login.password == "") {
      this.setState({ error: "testing" });
    }
    else {
      axios.post(APIS.account + "login", { Email: this.state.login.email, Password: this.state.login.password })
        .then(response => {
          if (response.data.statusCode !== 200) {
            console.log(response.data.value);
            this.setState({ error: response.data.value });
          }
          else {
            let loginInfo = this.state.login;
            loginInfo.email = "";
            loginInfo.password = "";
            loginInfo.admin = response.data.value.admin;
            loginInfo.id = response.data.value.id;
            loginInfo.authorized = response.data.value.auth;
            this.setState({ login: loginInfo }, this.onNavButtonClicked('home'));
          }
        });
    }
  }
  onNavButtonClicked = (page) => {
    switch (page) {
      case "home":
        this.setState({ page: <HomePage APIS={APIS} getID={getID} /> });
        break;
      case "login":
        this.setState({ page: <Login UpdateCredentials={this.updateCredentials} Login={this.Login} Error={this.state.error} /> });
        break;
      case "tutors":
        break;
      case "logout":
        this.setState({
          login: {
            authorized: "",
            admin: false,
            id: "",
            email: "",
            password: "",
            course: "",
            preferredCourses: [],
            preferredName: ""
          }
        });
        this.setState({ page: <HomePage APIS={APIS} getID={getID} /> });
        axios.get(APIS.account + `logout/${this.state.login.id}`);
        break;
      default:
        break;
    }
  };
  componentDidMount() {
    this.onNavButtonClicked("home");
  };
  render() {
    return (
      <div id="Main" className="container vertical justify-start max-width max-height">
        <Navigation Auth={this.state.login.authorized} Admin={this.state.login.admin} NavClick={this.onNavButtonClicked}/>
        {this.state.page}
      </div>
    );
  };
};

root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
