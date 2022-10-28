import React from 'react';
import './Calendar.css';

const Times = ["12 am", "1 am", "2 am", "3 am", "4 am", "5 am", "6 am", "7 am", "8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm", "11 pm"]
const StartingPoint = 7;
const EndingPoint = 21;
const width = 120;
const TimeConvert = (start) => {
    let value = "";
    let minutes = start % 60;
    let time = (start-minutes) / 60;
    value += `${time % 12 === 0 ? 12 : time % 12}:${minutes < 10 ? "0" + minutes : minutes} ${time > 11 ? "pm" : "am"}`;
    return value;
}
class Delete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }
    Toggle = () => {
        this.setState({ open: !this.state.open });
    }
    render() {
        return (
            <div className="container vertical max-height justify-start">
                {this.state.open 
                    ?
                    <>
                        <div className="item">Are you sure?</div>
                        <div className="item button" onClick={evt => this.props.DeleteSchedule(this.props.id)}>Delete</div>
                        <div className="item button" onClick={evt => this.Toggle()}>Cancel</div>
                    </>
                    : < div className="item button" onClick={evt => this.Toggle()}>Delete</div>
                }
            </div>
        )
    }
}
class Row extends React.Component {
    render() {
        return (
            <div className="container horizontal max-width time-row row">
                {this.props.data.schedule.map(entry => {
                    let fullCourseCode = entry.course !== undefined ? entry.course.code : "";
                    let fullCourseName = entry.course !== undefined ? entry.course.name : "";
                    let courseCode = entry.course !== undefined ? entry.course.code.slice(0, 3) : "";
                    let entryWidth = (entry.duration / 60) * width;
                    let entryLeft = ((entry.startTime - (StartingPoint * 60)) / 60) * width;
                    if (entry.startTime < (StartingPoint * 60)) {
                        entryWidth = (((entry.startTime + entry.duration) - (StartingPoint * 60)) / 60) * width;
                        entryLeft = 0;
                    }
                    else if (entry.startTime + entry.duration > (EndingPoint * 60)) {
                        entryWidth = ((EndingPoint - entry.startTime) / 60) * width;
                    }
                    if (entryWidth > 0) {
                        return (
                            <div key={entry.year + '' + entry.day + '' + entry.startTime} className={`row other ${courseCode}`} style={{ width: entryWidth + 'px', left: entryLeft + 'px' }}>
                                <div className={`info container horizontal max-height max-width ${courseCode}`} style={entryLeft > (EndingPoint - StartingPoint) * (width / 2) ? { right: '0px' } : { left: '0px' }}>
                                    <div className="container vertical max-width align-start">
                                        <div className="item">{this.props.data.coach.name}</div>
                                        <div className="item">{TimeConvert(entry.startTime) + " - " + TimeConvert(entry.startTime + entry.duration)}</div>
                                        <div className="item">Room: {entry.room === null ? 'Unspecified' : entry.room}</div>
                                        <div className="item">{fullCourseCode} - {fullCourseName}</div>
                                    </div>
                                    {this.props.DeleteSchedule !== undefined
                                        ? < Delete DeleteSchedule={this.props.DeleteSchedule} id={this.props.getID(entry._id)} />
                                        : <></>
                                    }
                                </div>
                            </div>
                        )
                    }
                    return null;
                })}
            </div>
        )
    }
}
class CalendarFrame extends React.Component {
    render() {
        return (
            <div id="Frame" className="max-height max-width">
                <div className="container horizontal">
                    <div id="Names" className="container vertical">
                        <div id="Title"className="column title">{this.props.title}</div>
                        {this.props.data.map(data => {
                            return (
                                <div className="column row name" key={data.coach.name}>
                                    {data.coach.id !== undefined
                                        ? <div className="button" title={`Go to ${data.coach.name}'s tutor page`} onClick={evt => this.props.TutorNavigation(data.coach.id)}>{data.coach.name}</div>
                                        : <>{data.coach.name}</>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div className='container vertical justify-start align-start box-bind'>
                        <div className="container horizontal justify-start align-start box max-height">
                                {Times.slice(StartingPoint,EndingPoint).map((value, i) => {
                                return (
                                    <React.Fragment key = {i}>
                                        <div className="spacer"></div>
                                        <div className="lines max-height"></div>
                                    </React.Fragment>
                                )
                            })}
                        </div>
                        <div className="container horizontal justify-start align-start title">
                            {Times.slice(StartingPoint, EndingPoint).map(value => {
                                return (
                                    <div className="column times" key={value}>{value}</div>
                                )
                            })}
                        </div>
                        {this.props.data.map(data => {
                            return (<Row data={data} key={data.coach.name} DeleteSchedule={this.props.DeleteSchedule} getID={this.props.getID} />)
                            })}
                    </div>
                </div>
            </div>
        )
    }
}
export default CalendarFrame;