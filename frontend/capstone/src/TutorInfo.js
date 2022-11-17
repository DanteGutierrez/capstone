import React from 'react'
import './TutorInfo.css'

class TutorInfoFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preferredName: this.props.Tutor.name.split(' ').slice(0, -1).join(" "),
            link: {
                ImageURL: "",
                URL: "",
                Title: ""
            },
            password: "",
            status: this.props.Tutor.status,
            linkAdderOpen: false,
            passwordChangerOpen: false,
        }
    }

    // Opening or closing the link creation box
    onOpen = () => {
        this.setState({ linkAdderOpen: !this.state.linkAdderOpen, link: { ImageURL: "", URL: "", Title: ""} });
    }

    // Opening or closing the password changing box
    onPasswordOpen = () => {
        this.setState({ passwordChangerOpen: !this.state.passwordChangerOpen });
    }

    // Updating credentials of anything about the tutor
    onChange = (event) => {
        let item = event.target;
        let link = this.state.link;
        switch (item.name) {
            case "PreferredName":
                this.setState({ preferredName: item.value });
                break;
            case "ImageURL":
                link.ImageURL = item.value;
                break;
            case "URL":
                link.URL = item.value;
                break;
            case "Title":
                link.Title = item.value;
                break;
            case "ChangeStatus":
                this.setState({ status: item.value });
                break;
            case "Password":
                this.setState({password: item.value})
                break;
            default:
                break;
        }
        this.setState({ link: link });
    }

    // Validating password
    checkPassword = () => {
        if (this.state.password === "") return null;
        this.props.ChangePassword(this.state.password);
    }

    // Validating link
    checkLink = () => {
        if (this.state.link.ImageURL === "" || this.state.link.URL === "") return null;
        this.props.CreateLink(this.state.link);
    }
    
    render() {
        return (
            <div id="NameInformation" className="container horizontal max-width justify-space">
                <div id="NameSection" className="container horizontal">
                    <img id="ProfilePicture" className="max-height bubble" src={"no-profile.png"} alt="Profile" />
                    <div id="TutorInformation"className="container vertical max-height max-width bubble align-start">
                        {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                            ? <div id="TutorName" className="container horizontal justify-start max-height">
                                <input title="Change the name you want to go by" id="PreferredName" type="text" name="PreferredName" value={this.state.preferredName} onChange={this.onChange} />
                                <div id="SaveWriting" title="Save preferred name" onClick={evt => this.props.SavePreferredName(this.state.preferredName)}><img src={"save-writing.png"} alt="Save"></img></div>
                                <div>{this.props.Tutor.name.split(' ').pop()}</div>
                            </div>
                            : <div id="TutorName" className="max-height max-width">{this.props.Tutor.name}</div>
                        }
                        <div id="EmailContainer" className="container horizontal justify-start justify-space max-width item">
                            <a id="TutorEmail" className="max-height" href={`mailto:${this.props.Tutor.email}?subject=Tutoring`}>{this.props.Tutor.email}</a>
                            {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                                ? <>
                                    {this.state.passwordChangerOpen
                                        ? <div id="PasswordChange" className="container horizontal justify-start max-height">
                                            <input id="Password" name="Password" type="password" title="Change current password" onChange={this.onChange} />
                                            <div id="SavePassword" title="Save password" onClick={evt => this.checkPassword()}><img src={"save-writing.png"} alt="Save"></img></div>
                                        </div>
                                        : <></>
                                    }
                                    <div id="PasswordChangerShowHide" title="View / Hide password changer" onClick={evt => this.onPasswordOpen()}><img src={"password-change.png"} alt="View/Hide"/></div>
                                </>
                                : <></>
                            }
                        </div>
                        <div id="Links" className="container horizontal max-width justify-start">
                            {this.props.Tutor.links.map(link => {
                                return (
                                    <div className="container horizontal item" key={link.title}>
                                        <a className="item" href={link.url} target="_blank" rel="noreferrer"><img className="linkImage" src={link.imageURL} alt={link.title} /></a>
                                        <a className="item" href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
                                        {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                                            ? <div className="X item" title={`Remove '${link.title}' link`} onClick={evt => this.props.DeleteLink(link)}>✖</div>
                                            : <></>
                                        }
                                    </div>
                                )
                            })}
                            {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                                ? <>
                                    {this.state.linkAdderOpen
                                        ? <div id="LinkAdding" className="container horizontal max-height">
                                            <label htmlFor='ImageURL'>Link Image: </label>
                                            <select className={`item${this.state.link.ImageURL === "" ? " badInput" : ""}`} name="ImageURL" onChange={this.onChange}>
                                                <option value="">Choose</option>
                                                <option value="teams-logo.jfif">Teams</option>
                                                <option value="twitter-logo.jpg">Twitter</option>
                                                <option value="discord-logo.jfif">Discord</option>
                                                <option value="linkedin-logo.jfif">LinkedIn</option>
                                                <option value="link-default.png">Other</option>
                                            </select>
                                            <label htmlFor='URL'>URL: </label>
                                            <input className={`item${this.state.link.URL === "" ? " badInput" : ""}`} type="text" name="URL" placeholder="ex: https://google.com" onChange={this.onChange}/>
                                            <label htmlFor='Title'>Name: </label>
                                            <input id="LinkTitle" className="item" type="text" name="Title" placeholder="Title" onChange={this.onChange} />
                                            <div className="button item" title="Create Link" onClick={evt => this.checkLink()}>Save</div>
                                            <div className="X item" title="Close Menu" onClick={evt => this.onOpen()}>✖</div>
                                        </div>
                                        : <img className="linkImage" src={"add-link.png"} alt="Add new link" title="Add new link" onClick={evt => this.onOpen()}/>
                                    }
                                </>
                                : <></>
                            }
                        </div>
                    </div>
                </div>
                <div id="DateSelectionTutor" className="container vertical bubble">
                    <div className="item">Year</div>
                    <div className="item">{this.props.Year}</div>
                    <div className="container horizontal item">
                        <div className="item button" onClick={evt => this.props.ChangeDay(-7)}>◄</div>
                        <div className="item">Week {Math.ceil(((6 - new Date(this.props.Year, 0, this.props.Day).getDay()) + this.props.Day) / 7)}</div>
                        <div className="item button" onClick={evt => this.props.ChangeDay(7)}>►</div>
                    </div>
                    {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                        ? <div className="item button" onClick={evt => this.props.ScheduleToggled()}>{this.props.ScheduleOpen ? 'Change Schedule' : 'Open Schedule'}</div>
                        : <></>
                    }
                </div>
                <div id="Status" className="container vertical align-start bubble">
                    <div className="item max-height">Status:</div>
                    {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                        ? <div className="container horizontal justify-start max-width max-height item">
                            <div id="SaveStatus" title="Save current status" onClick={evt => this.props.ChangeStatus(this.state.status)}><img src={"save-writing.png"} alt="Save"></img></div>
                            <input id="ChangeStatus" title="Change your current status" type="text" name="ChangeStatus" value={this.state.status} onChange={this.onChange} />
                        </div>
                        : <div className="item">{this.props.Tutor.status === "" ? <div className="none">None</div> : this.props.Tutor.status}</div>
                    }
                </div>
            </div>
        )
    }
}
export default TutorInfoFrame;