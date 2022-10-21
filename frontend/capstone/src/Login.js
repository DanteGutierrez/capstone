import React from 'react';

class Login extends React.Component {
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
                <div className="item button" onClick={evt => this.props.Login()}>Login</div>
                <div className="item error">{this.props.Error}</div>
            </div>
        )
    }
}
export default Login;