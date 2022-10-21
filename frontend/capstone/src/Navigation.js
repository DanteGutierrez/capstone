import React from 'react';
import './Navigation.css';

class NavButton extends React.Component {
    render() {
        return (
            <div className="button item wireframe" onClick={this.props.Click}>
                {this.props.name}
            </div>
        );
    };
};

class Frame extends React.Component {
    render() {
        return (
            <nav className="container horizontal max-width">
                <NavButton name="Home" nav="/" Click={evt => this.props.NavClick("home")} />
                {this.props.Admin
                    ? <NavButton name="Tutors" nav="/tutors" Click={evt => this.props.NavClick("tutors")} />
                    : <></>
                }
                {this.props.Auth != ""
                    ? <NavButton name="Logout" nav="/logout" Click={evt => this.props.NavClick("logout")} />
                    : <NavButton name="Login" nav="/login" Click={evt => this.props.NavClick("login")} />
                }
            </nav>
        )
    }
}

export default Frame;