import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            error: ""
        }
    }
    render() {
        return (
            <div className="container vertical max-width max-height wireframe">
                <div className="container horizontal wireframe">
                    <label className="item" htmlFor='Email'>Email: </label>
                    <input className="item" name="Email" type="text" placeholder="Email" onChange={this.props.UpdateCredentials}/>
                </div>
                <div className="container horizontal wireframe">
                    <label className="item" htmlFor='Password'>Password: </label>
                    <input className="item" name="Password" type="password" placeholder="Password" onChange={this.props.UpdateCredentials} />
                </div>
                <div className="item button" onClick={async (evt) => this.setState({ error: await this.props.Login() })}>Login</div>
                <div className="item error">{this.state.error}</div>
            </div>
        )
    }
}
export default Login;