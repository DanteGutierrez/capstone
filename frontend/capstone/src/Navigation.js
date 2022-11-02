import React from 'react';
import './Navigation.css';

class NavButton extends React.Component {
    render() {
        return (
            <div className="button item" onClick={this.props.Click}>
                {this.props.Name}
            </div>
        );
    };
};

class NavigationFrame extends React.Component {
    render() {
        return (
            <nav className="container horizontal max-width">
                <NavButton Name="Home" nav="/" Click={evt => this.props.NavClick("home")} />
                {this.props.Login.admin
                    ? <NavButton Name="Tutors" nav="/tutors" Click={evt => this.props.NavClick("tutors")} />
                    : <></>
                }
                {this.props.Login.authorized !== ""
                    ? <>
                        <NavButton Name="My Page" nav="/tutor" Click={evt => this.props.TutorNavigation(this.props.Login.id)}/>
                        <NavButton Name="Logout" nav="/logout" Click={evt => this.props.NavClick("logout")} />
                      </>
                    : <NavButton Name="Login" nav="/login" Click={evt => this.props.NavClick("login")} />
                }
            </nav>
        )
    }
}

export default NavigationFrame;