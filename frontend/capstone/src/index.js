import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

//Custom Pages
import HomePage from './HomePage';
import Navigation from './Navigation';
import Login from './Login';
import TutorPage from './TutorPage';
import Tutors from './Tutors';

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
      courses: [],
    };
  };

  // Takes in input changes for Tutor Creation

  TutorCreationUpdateCredentials  = (event) => {
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

  Login = async () => {
    if (this.state.login.email === "" || this.state.login.password === "") {
      return "Make sure both and email and password are entered";
    }
    else {
      return await axios.post(APIS.account + "login", { Email: this.state.login.email, Password: this.state.login.password })
        .then(response => {
          if (response.data.statusCode !== 200) {
            return response.data.value;
          }
          else {
            let loginInfo = this.state.login;
            loginInfo.email = "";
            loginInfo.password = "";
            loginInfo.admin = response.data.value.admin;
            loginInfo.id = response.data.value.id;
            loginInfo.authorized = response.data.value.auth;
            this.setState({ login: loginInfo }, this.CreatePage('home'));
            return "";
          }
        });
    }
  }

  UpdateTutorInformation = (tutor) => {
    // Since a tutor's preferred name can be blank,
    // This prevents the name from showing up as blank space
    if (tutor.PreferredName === undefined) {
      tutor.PreferredName = tutor.name.split(' ').slice(0, -1).join(' ');
    }
    axios.put(APIS.account + `update/${tutor.id}?auth=${this.state.login.authorized}&admin=${this.state.login.id}`, tutor)
      .then(response => {
        if (response.data.statusCode !== 200) {
          console.log(response.data.value);
        }
        else {
          this.CreateTutorInfoPage(tutor.id);
        }
    })
  }

  CreateTutorInfoPage = (id) => {
    axios.get(APIS.account + "view/" + id)
      .then(response => {
        if (response.data.statusCode !== 200) {
          console.log(response.data.value);
        }
        else {
          this.setState({ page: <TutorPage APIS={APIS} getID={getID} Login={this.state.login} Tutor={response.data.value} updateTutor={this.UpdateTutorInformation} key={response.data.value.id} onNavButtonClicked={this.CreatePage} /> });
        }
      })
  };

  CreatePage = (page) => {
    // Generates a page to display based on the string passed through
    switch (page) {
      case "home":
        this.setState({ page: <HomePage APIS={APIS} getID={getID} TutorNavigation={this.CreateTutorInfoPage} /> });
        break;
      case "login":
        this.setState({ page: <Login UpdateCredentials={this.TutorCreationUpdateCredentials} Login={this.Login} /> });
        break;
      case "tutors":
        this.setState({ page: <Tutors APIS={APIS} getID={getID} Login={this.state.login}/> });
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
        this.setState({ page: <HomePage APIS={APIS} getID={getID} TutorNavigation={this.CreateTutorInfoPage} /> });
        axios.get(APIS.account + `logout/${this.state.login.id}`);
        break;
      default:
        break;
    }
  };

  // Starts off at the home page after the frame is loaded
  componentDidMount = async () => {
    this.CreatePage("home");
  };

  // Rendering pages come from the state 'page' instead of
  // using url routing, this allows for the utilization of
  // react's state based loading of pages.
  render() {
    return (
      <div id="Main" className="container vertical justify-start max-width max-height">
        <Navigation Login={this.state.login} NavClick={this.CreatePage} TutorNavigation={this.CreateTutorInfoPage} />
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
