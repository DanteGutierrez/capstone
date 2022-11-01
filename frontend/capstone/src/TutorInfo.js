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
            linkAdderOpen: false
        }
    }
    onOpen = () => {
        this.setState({ linkAdderOpen: !this.state.linkAdderOpen, link: { ImageURL: "", URL: "", Title: ""} });
    }
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
            default:
                break;
        }
        this.setState({ link: link });
    }
    checkLink = () => {
        if (this.state.link.ImageURL === "" || this.state.link.URL === "") return null;
        this.props.CreateLink(this.state.link);
    }
    render() {
        return (
            <div id="NameInformation" className="container horizontal max-width item">
                <img id="ProfilePicture" className="max-height item bubble" src={"no-profile.png"} alt="Profile" />
                <div className="container vertical max-height max-width item bubble align-start">
                    {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                        ? <div id="TutorName" className="container horizontal max-height">
                            <input id="PreferredName" type="text" name="PreferredName" value={this.state.preferredName} onChange={this.onChange} />
                            <div id="SaveWriting" title="Save preferred name" onClick={evt => this.props.SavePreferredName(this.state.preferredName)}><img src={"save-writing.png"} alt="Save"></img></div>
                            <div>{this.props.Tutor.name.split(' ').pop()}</div>
                        </div>
                        : <div id="TutorName" className="max-height">{this.props.Tutor.name}</div>
                    }
                    <div id="TutorEmail" className="max-height">{this.props.Tutor.email}</div>
                    <div id="Links" className="container horizontal max-width justify-start">
                        {this.props.Tutor.links.map(link => {
                            return (
                                <div className="container horizontal item" key={link.title}>
                                    <a className="item" href={link.url} target="_blank" rel="noreferrer"><img className="linkImage" src={link.imageURL} alt={link.title} /></a>
                                    <a className="item" href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
                                </div>
                            )
                        })}
                        {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                            ? <>
                                {this.state.linkAdderOpen
                                    ? <div id="LinkAdding" className="container horizontal max-height max-width">
                                        <label htmlFor='ImageURL'>Link Image: </label>
                                        <select className={`item${this.state.link.ImageURL === "" ? " badInput" : ""}`} Name="ImageURL" onChange={this.onChange}>
                                            <option value="">Choose</option>
                                            <option value="teams-logo.jfif">Teams</option>
                                            <option value="twitter-logo.jpg">Twitter</option>
                                            <option value="discord-logo.jfif">Discord</option>
                                            <option value="linkedin-logo.jfif">LinkedIn</option>
                                            <option value="link-default.png">Other</option>
                                        </select>
                                        <label htmlFor='URL'>URL: </label>
                                        <input className={`item${this.state.link.URL === "" ? " badInput" : ""}`} type="text" Name="URL" placeholder="ex: https://google.com" onChange={this.onChange}/>
                                        <label htmlFor='Title'>Name: </label>
                                        <input className="item" type="text" Name="Title" placeholder="Title" onChange={this.onChange} />
                                        <div className="button item" title="Create Link" onClick={evt => this.checkLink()}>Save</div>
                                        <div className="button item" title="Close Menu" onClick={evt => this.onOpen()}>X</div>
                                    </div>
                                    : <img className="linkImage" src={"add-link.png"} alt="Add new link" title="Add new link" onClick={evt => this.onOpen()}/>
                                }
                            </>
                            : <></>
                        }
                    </div>
                </div>
                <div className="container vertical max-height item bubble">
                    <div className="item">Year</div>
                    <div className="item">{this.props.Year}</div>
                    <div className="container horizontal max-width item">
                        <div className="item button" onClick={evt => this.props.ChangeDay(-7)}>ᐊ</div>
                        <div className="item">Week {Math.ceil(((6 - new Date(this.props.Year, 0, this.props.Day).getDay()) + this.props.Day) / 7)}</div>
                        <div className="item button" onClick={evt => this.props.ChangeDay(7)}>ᐅ</div>
                    </div>
                    {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                        ? <div className="item button" onClick={evt => this.props.ScheduleToggled()}>{this.props.ScheduleOpen ? 'Change Schedule' : 'Open Schedule'}</div>
                        : <></>
                    }
                </div>
                <div className="container vertical max-height max-width bubble">
                    {/* Text */}
                </div>
            </div>
        )
    }
}
export default TutorInfoFrame;