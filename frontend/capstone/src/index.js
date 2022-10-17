import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import HomePage from './HomePage';
import Navigation from './Navigation';

const root = ReactDOM.createRoot(document.getElementById('root'));

const URL = 'http://localhost:8888/';
const schedule = URL + 'schedule/';
const course = URL + 'course/';
const account = URL + 'account/';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: {
        authorized: false,
        admin: false,
        id: "",
        name: "",
        email: "",
        password: ""
      },
      page: "",
      error: "",
    };
  };
  onNavButtonClicked = (page) => {
    switch (page) {
      case "home":
        this.setState({ page: <HomePage /> });
        break;
      case "login":
        break;
      case "tutors":
        break;
      case "logout":
        this.setState({
          login: {
            authorized: false,
            admin: false,
            email: "",
            id: "",
            username: "",
            password: ""
          }
        });
        this.setState({ page: <HomePage /> });
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
      <div className="container vertical max-width max-height">
        <Navigation Auth={this.state.login.authorized} Admin={this.state.login.admin} NavClick={this.onNavButtonClicked} />
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
