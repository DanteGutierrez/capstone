import React from 'react';

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
    constructor(props) {
        super(props);
        this.state = {
            Auth: props.Auth,
            Admin: props.Admin
        };
    };
    render() {
        return (
            <nav className="container horizontal max-width item top-stick">
                <NavButton name="Home" nav="/" Click={evt => this.props.NavClick("home")} />
                {this.state.Admin
                    ? <NavButton name="Tutors" nav="/tutors" Click={evt => this.props.NavClick("tutors")} />
                    : <></>
                }
                {this.state.Auth
                    ? <NavButton name="Logout" nav="/logout" Click={evt => this.props.NavClick("logout")} />
                    : <NavButton name="Login" nav="/login" Click={evt => this.props.NavClick("login")} />
                }
            </nav>
        )
    }
}

export default Frame;