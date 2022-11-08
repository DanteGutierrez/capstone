import React from 'react';
import axios from 'axios';

class TutorCreationFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Account: {
                Admin: false,
                Email: "",
                Password: "",
                FirstName: "",
                LastName: "",
                AssignedCourse: "",
                PreferredCourses: []
            },
            courses: [],
            error: "",
            success: ""
        }
    }
    GetAllCourses = async () => {
        await axios.get(this.props.APIS.course + "view")
            .then(response => {
                if (response.data.statusCode !== 200) {
                    console.log(response.data.statusCode);
                }
                else {
                    let courseList = [];
                    response.data.value.map(course => {
                        let clone = {
                            id: "",
                            code: course.code,
                            name: course.name
                        };
                        clone.id = this.props.getID(course._id);
                        courseList.push(clone);
                        return null;
                    })
                    this.setState({ courses: courseList });
                }
            })
    }
    UpdateCredentials = (event) => {
        let account = this.state.Account;
        switch (event.target.name) {
            case "Admin":
                account.Admin = event.target.checked;
                break;
            case "Email":
                account.Email = event.target.value;
                break;
            case "Password":
                account.Password = event.target.value;
                break;
            case "FirstName":
                account.FirstName = event.target.value;
                break;
            case "LastName":
                account.LastName = event.target.value;
                break;
            case "AssignedCourse":
                account.AssignedCourse = event.target.value;
                break;
            default:
                break;
        }
        this.setState({ Account: account });
    }
    CreateAccount = () => {
        axios.post(this.props.APIS.account + `create?auth=${this.props.Login.authorized}&admin=${this.props.Login.id}`, this.state.Account)
            .then(response => {
                if (response.data.statusCode !== 200) {
                    this.setState({ error: response.data.value, success: "" });
                }
                else {
                    this.setState({ error: "", success: "Succesfully created an account" });
                }
            });
        this.setState({
            Account: {
                Admin: false,
                Email: "",
                Password: "",
                FirstName: "",
                LastName: "",
                AssignedCourse: "",
                PreferredCourses: []
            }});
    }
    CheckAccount = () => {
        let error = "";
        if (this.state.Account.AssignedCourse === "") error = "Please select an assigned course";
        else if (this.state.Account.Email === "") error = "Please provide an email";
        else if (this.state.Account.FirstName === "") error = "Please provide a first name";
        else if (this.state.Account.LastName === "") error = "Please provide a last name";
        else if (this.state.Account.Password === "") error = "Please provide a password";
        else this.CreateAccount();
        this.setState({ error: error });
    }
    componentDidMount = async() => {
        await this.GetAllCourses();
    }
    render() {
        return (
            <div className="container vertical align-start max-height">
                <div className="container horizontal item">
                    <label className="item" htmlFor='Admin'>Admin:</label>
                    <input className="item" type="checkbox" name="Admin" onChange={this.UpdateCredentials}/>
                </div>
                <div className="container horizontal item">
                    <label className="item" htmlFor='Email'>Email:</label>
                    <input className="item" type="text" name="Email" onChange={this.UpdateCredentials} placeholder="Email"/>
                </div>
                <div className="container horizontal item">
                    <label className="item" htmlFor='Password'>Password:</label>
                    <input className="item" type="password" name="Password" onChange={this.UpdateCredentials} placeholder="Password" />
                </div>
                <div className="container horizontal item">
                    <label className="item" htmlFor='FirstName'>First Name:</label>
                    <input className="item" type="text" name="FirstName" onChange={this.UpdateCredentials} placeholder="First Name" />
                </div>
                <div className="container horizontal item">
                    <label className="item" htmlFor='LastName'>Last Name:</label>
                    <input className="item" type="text" name="LastName" onChange={this.UpdateCredentials} placeholder="Last Name" />
                </div>
                <div className="container horizontal item" key={this.state.courses}>
                    <label className="item" htmlFor='AssignedCourse'>Assigned Course:</label>
                    <select className="item" name="AssignedCourse" onChange={this.UpdateCredentials}>
                        <option value="">Select A Course</option>
                        {this.state.courses.map(course => {
                            return (
                                <option value={course.id} key={course.id}>{course.code} - {course.name}</option>
                            )
                        })}
                    </select>
                </div>
                <input className="item" type="button" name="Submit" value="Create Account" onClick={evt => this.CheckAccount()} />
                <div className="item error">{this.state.error}</div> 
                <div className="item success">{this.state.success}</div> 
            </div>
        )
    }
}
export default TutorCreationFrame;