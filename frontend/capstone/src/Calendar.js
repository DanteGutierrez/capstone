import React from 'react';
import './Calendar.css';

const Times = ["12 am", "1 am", "2 am", "3 am", "4 am", "5 am", "6 am", "7 am", "8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm", "11 pm"]

// Sarah wants tutors to only work between 7 am and 9 pm
const StartingPoint = 7; const EndingPoint = 21; // 9 + 12

// The width of each hour on the calendar
// let width = 120;
// if (window.innerWidth < 993) width = 90;
// if (window.innerWidth < 525) width = 60;

// Converts seconds since midnight to am / pm time
const TimeConvert = (start) => {
    let value = "";
    let minutes = start % 60;
    let time = (start-minutes) / 60;
    value += `${time % 12 === 0 ? 12 : time % 12}:${minutes < 10 ? "0" + minutes : minutes} ${time > 11 ? "pm" : "am"}`;
    return value;
}

// Converts seconds since midnight to input time
const TimeConvertInput = (start) => {
    let value = "";
    let minutes = start % 60;
    let hour = (start - minutes) / 60;
    value += (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes);
    return value;
}

// Converts input time to seconds since midnight
const ConvertTime = (time) => {
    let brokenTime = time.split(":");
    return (Number(brokenTime[0]) * 60) + Number(brokenTime[1]);
}

class DeleteButton extends React.Component {
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
            <div className="deleteButton container vertical max-height justify-start">
                {this.state.open 
                    ?
                    <>
                        <div className="item">Are you sure?</div>
                        <div className="item button" title="Delete Schedule" onClick={evt => this.props.DeleteSchedule(this.props.id)}>Delete</div>
                        <div className="item button" title="Cancel Delete" onClick={evt => this.Toggle()}>Cancel</div>
                    </>
                    : < div className="item button" title="Delete Schedule" onClick={evt => this.Toggle()}>Delete</div>
                }
            </div>
        )
    }
}

class ScheduleUpdateDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            StartTime: TimeConvertInput(this.props.Schedule.startTime),
            EndTime: TimeConvertInput(this.props.Schedule.startTime + this.props.Schedule.duration),
            TimeIssue: false,
            Room: this.props.Schedule.room,
            CourseId: this.props.Schedule.courseId
        }
    }

    UpdateInput = (event) => {
        let item = event.target;
        switch (item.name) {
            case "StartTime":
                if (ConvertTime(item.value) < ConvertTime(this.state.EndTime)) {
                    this.setState({ TimeIssue: false });
                }
                this.setState({ StartTime: item.value });
                break;
            case "EndTime":
                if (ConvertTime(item.value) > ConvertTime(this.state.StartTime)) {
                    this.setState({TimeIssue: false});
                }
                this.setState({ EndTime: item.value });
                break;
            case "Room":
                this.setState({ Room: item.value });
                break;
            case "Course":
                this.setState({ CourseId: item.value });
                break;
            default:
                break;
        }
    }

    // Verifies all information in the schedule is valid before updating
    CheckSchedule = () => {
        if (ConvertTime(this.state.StartTime) > ConvertTime(this.state.EndTime)) {
            this.setState({ TimeIssue: true });
            return;
        }
        let schedule = this.props.Schedule;
        schedule.startTime = ConvertTime(this.state.StartTime);
        schedule.duration = ConvertTime(this.state.EndTime) - ConvertTime(this.state.StartTime);
        schedule.room = this.state.Room;
        schedule.courseId = this.state.CourseId;
        this.props.UpdateSchedule(schedule);
    }

    render() {
        return (
            <>
                <div className="item text-left">{this.props.CoachName}</div>
                <div className="container horizontal max-width justify-start" title="Adjust time">
                    <input className={"item mini-input" + (this.state.TimeIssue ? " issue": "")} name="StartTime" type="time" value={this.state.StartTime} onChange={this.UpdateInput} />
                    <div className="item"> - </div>
                    <input className={"item mini-input" + (this.state.TimeIssue ? " issue" : "")} name="EndTime" type="time" value={this.state.EndTime} onChange={this.UpdateInput} />
                    <img className="item mini-save" src={"save-writing.png"} alt="Save Time" title="Save Time" onClick={evt => this.CheckSchedule()} />
                </div>
                <div className="container horizontal max-width justify-start" title="Adjust room">
                    <div className="item">Room: </div>
                    <input className="item mini-input" name="Room" type="text" value={this.state.Room} onChange={this.UpdateInput} />
                    <img className="item mini-save" src={"save-writing.png"} alt="Save Room" title="Save Room" onClick={evt => this.CheckSchedule()} />
                </div>
                <div className="container horizontal max-width justify-start" title="Adjust course">
                    <select className="item mini-select" name="Course" onChange={this.UpdateInput} defaultValue={this.state.CourseId}>
                        {this.props.Courses.map(course => {
                            return (
                                <option value={course.id} key={course.id}>{course.code} - {course.name}</option>
                            )
                        })}
                    </select>
                    <img className="item mini-save" src={"save-writing.png"} alt="Save Course" title="Save Course" onClick={evt => this.CheckSchedule()} />
                </div>
            </>
        )
    }
}

class Row extends React.Component {
    render() {
        return (
            <div className="container horizontal max-width time-row row">
                {this.props.data.schedule.map(entry => {

                    // Ensures a bad input does not break the calendar
                    let fullCourseCode = entry.course !== undefined ? entry.course.code : "";
                    let fullCourseName = entry.course !== undefined ? entry.course.name : "";
                    let courseCode = entry.course !== undefined ? entry.course.code.slice(0, 3) : "TST";
                    
                    // Calculating the size and positioning of the schedule object on the calendar
                    let entryWidth = (entry.duration / 60) * this.props.Width;
                    let entryLeft = ((entry.startTime - (StartingPoint * 60)) / 60) * this.props.Width;
                    if (entry.startTime < (StartingPoint * 60)) {
                        entryWidth = (((entry.startTime + entry.duration) - (StartingPoint * 60)) / 60) * this.props.Width;
                        entryLeft = 0;
                    }
                    else if (entry.startTime + entry.duration > (EndingPoint * 60)) {
                        entryWidth = ((EndingPoint - entry.startTime) / 60) * this.props.Width;
                    }
                    let style = { width: entryWidth + "px" };

                    // Switches a schedule between opening left or right depending on it's distance to an edge
                    if (entryLeft > (((EndingPoint - StartingPoint) * this.props.Width) / 2)) {
                        style.right = ((((EndingPoint - StartingPoint) * this.props.Width) - entryLeft) - entryWidth) + "px";
                    }
                    else style.left = entryLeft + "px";

                    // Checking to see if the schedule that was generated is older than the current day (to disable editing of that schedule)
                    let NotOld = new Date(entry.year, 0, entry.day).getTime() >= new Date(new Date(Date.now()).toLocaleDateString()).getTime();

                    // Only renders a schedule if it appears on the calendar at all
                    if (entryWidth > 0) {
                        return (
                            <div key={entry.year + '' + entry.day + '' + entry.startTime} className={`time-block ${courseCode} ${this.props.UpdateSchedule === undefined ? "hover" : ""}`} style={style} title={this.props.UpdateSchedule === undefined ? "Click to view tutor's page" : "Scheduled time"} onClick={this.props.UpdateSchedule === undefined ? evt => this.props.TutorNavigation(this.props.data.coach.id) : null}>
                                <div className={`interactive-time-block container horizontal max-height max-width`}>
                                    <div className={`${entryWidth < (this.props.Width * 1.5) ? "time-block-text" : ""} container vertical max-width align-start`}>
                                        {this.props.UpdateSchedule !== undefined && (this.props.Admin || NotOld)
                                            ? <ScheduleUpdateDisplay Schedule={entry} CoachName={this.props.data.coach.name} Courses={this.props.Courses} UpdateSchedule={this.props.UpdateSchedule} />
                                            : <>
                                                <div className="item text-left">{this.props.data.coach.name}</div>
                                                <div className="item text-left">{TimeConvert(entry.startTime) + " - " + TimeConvert(entry.startTime + entry.duration)}</div>
                                                <div className="item text-left">Room: {entry.room === null || entry.room === "" ? 'Unspecified' : entry.room}</div>
                                                <div className="item text-left">{fullCourseCode} - {fullCourseName}</div>
                                            </>
                                        }
                                    </div>
                                    {this.props.DeleteSchedule !== undefined && (this.props.Admin || NotOld)
                                        ? < DeleteButton DeleteSchedule={this.props.DeleteSchedule} id={this.props.getID(entry._id)} />
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
    constructor(props) {
        super(props);
        this.state = {
            width: 120
        }
    }
    handleResize = (evt) => {
        let width = 120;
        if (window.innerWidth < 993) width = 90;
        if (window.innerWidth < 525) width = 60;
        this.setState({ width: width });
    }
    componentDidMount = () => {
        window.addEventListener('resize', this.handleResize);
        this.handleResize(null);
    }
    render() {
        return (
            <div id="Frame" className="max-height max-width">
                {this.props.data.length > 0
                    ?
                    <div id="InnerFrame" className="container horizontal">
                        <div id="Names" className="container vertical">
                            <div id="Title"className="column title">{this.props.title}</div>
                            {this.props.data.map(data => {
                                return (
                                    <div className="container vertical justify-start align-start column row name" key={data.coach.name}>
                                        {data.coach.id !== undefined
                                            ? <div className="nameButton max-height max-width" title={`Go to ${data.coach.name}'s tutor page`} onClick={evt => this.props.TutorNavigation(data.coach.id)}>{data.coach.name}</div>
                                            : <>{data.coach.name}</>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        <div className='container vertical justify-start align-start box-bind'>
                            <div className="container horizontal justify-start align-start box max-height">
                                {/* Generates bars that visually represent a time filter's effect */}
                                {this.props.Auxilary !== undefined && this.props.Auxilary.StartTime !== undefined
                                    ? <div className="auxilaryWings max-height" style={{ width: Math.max((((this.props.Auxilary.StartTime - (StartingPoint * 60)) / 60) * this.state.width), 0) + "px", left: "0px" }}></div>
                                    : <></>
                                }
                                {/* Generates the vertical bars that represent each hour */}
                                {Times.slice(StartingPoint,EndingPoint).map((value, i) => {
                                    return (
                                        <React.Fragment key = {i}>
                                            <div className="spacer column max-height"></div>
                                        </React.Fragment>
                                    )
                                })}
                                {/* Generates bars that visually represent a time filter's effect */}
                                {this.props.Auxilary !== undefined && this.props.Auxilary.EndTime !== undefined
                                    ? <div className="auxilaryWings max-height" style={{ width: Math.max(((((EndingPoint * 60) - this.props.Auxilary.EndTime) / 60) * this.state.width), 0) + "px", right: "0px" }}></div>
                                    : <></>
                                }
                            </div>
                            <div className="container horizontal justify-start align-start title">
                                {/* Labels the hours that are being displayed on the calendar */}
                                {Times.slice(StartingPoint, EndingPoint).map(value => {
                                    return (
                                        <div className="column times" key={value}>{value}</div>
                                    )
                                })}
                            </div>
                            {this.props.data.map(data => {
                                return (<Row data={data} Width={this.state.width} TutorNavigation={this.props.TutorNavigation} Admin={this.props.Admin} key={data.coach.name} DeleteSchedule={this.props.DeleteSchedule} UpdateSchedule={this.props.UpdateSchedule} getID={this.props.getID} Courses={this.props.Courses} />)
                            })}
                        </div>
                    </div>
                    : <div id="BlankFrame" className="container vertical max-height max-width" >It seems like there are no schedules to display...</div>
                }
            </div>
        )
    }
}
export default CalendarFrame;