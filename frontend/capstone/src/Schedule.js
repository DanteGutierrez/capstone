import React from 'react'
import axios from 'axios'

class ScheduleMakingFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Form: {
                StartDay: '',
                StartTime: 0,
                EndDay: '',
                EndTime: 0,
                Course: "",
                Room: "",
                RepeatDay: [false, false, false, false, false, false, false],
                Repeat: false,
            },
            courses: [],
            error: "",
            success: ""
        };
    }
    ConvertTime = (time) => {
        let brokenTime = time.split(":");
        return (Number(brokenTime[0]) * 60) + Number(brokenTime[1]);
    }
    GetYear = (date) => {
        let brokenDate = date.split("-");
        return Number(brokenDate[0]);
    }
    GetDay = (date) => {
        const MonthToDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let brokenDate = date.split("-");
        let year = Number(brokenDate[0]);
        let days = MonthToDays[Number(brokenDate[1]) - 1] + Number(brokenDate[2]);
        if (days > 59 && (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))) days += 1;
        return days;
    }
    UpdateCredentials = (event) => {
        let form = this.state.Form;
        switch (event.target.name) {
            case "StartTime":
                form.StartTime = event.target.value;
                break;
            case "EndTime":
                form.EndTime = event.target.value;
                break;
            case "Day":
                form.StartDay = event.target.value;
                break;
            case "Course":
                form.Course = event.target.value;
                break;
            case "Room":
                form.Room = event.target.value;
                break;
            case "Repeats":
                form.Repeat = event.target.checked;
                break;
            case "Sunday":
                form.RepeatDay[0] = event.target.checked;
                break;
            case "Monday":
                form.RepeatDay[1] = event.target.checked;
                break;
            case "Tuesday":
                form.RepeatDay[2] = event.target.checked;
                break;
            case "Wednesday":
                form.RepeatDay[3] = event.target.checked;
                break;
            case "Thursday":
                form.RepeatDay[4] = event.target.checked;
                break;
            case "Friday":
                form.RepeatDay[5] = event.target.checked;
                break;
            case "Saturday":
                form.RepeatDay[6] = event.target.checked;
                break;
            case "Start":
                form.StartDay = event.target.value;
                break;
            case "End":
                form.EndDay = event.target.value;
                break;
        }
        this.setState({ Form: form });
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
                    })
                    this.setState({ courses: courseList });
                }
            })
    }
    CreateSchedule = async (schedule) => {
        return await axios.post(this.props.APIS.schedule + `create?auth=${this.props.Login.authorized}`, schedule)
            .then(response => {
                if (response.data.statusCode != 200) {
                    this.setState({ error: console.log(response.data.value) });
                    return false;
                }
                else {
                    return true;
                }
            });
    }
    ProcessSchedules = async () => {
        if (this.state.Form.StartTime == "") { this.setState({ error: "Set a time for the tutoring to start" }); return; }
        if (this.state.Form.EndTime == "") { this.setState({ error: "Set a time for the tutoring to end" }); return; }
        if (this.ConvertTime(this.state.Form.EndTime) < this.ConvertTime(this.state.Form.StartTime)) { this.setState({ error: "Ending Time cannot be before Starting Time" }); return; }
        if (this.ConvertTime(this.state.Form.EndTime) > (21 * 60)) { this.setState({ error: "You must end your tutoring at or before 9 pm" }); return; }
        if (this.ConvertTime(this.state.Form.StartTime) < (7 * 60)) { this.setState({ error: "You must start your tutoring at or after 7 am" }); return; }
        if (this.state.Form.StartDay == "") { this.setState({ error: "Set a date for your tutoring" }); return; }
        if (this.state.Form.Room == "") { this.setState({ error: "Set a room to tutor in" }); return; }
        if (this.state.Form.Repeat) {
            if (this.state.Form.EndDay == "") { this.setState({ error: "Set an ending date for your tutoring" }); return; }
            let year = this.GetYear(this.state.Form.StartDay);
            let loops = this.GetDay(this.state.Form.EndDay) - this.GetDay(this.state.Form.StartDay) + (year != this.GetYear(this.state.Form.EndDay) ? (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) ? 366 : 365) : 0);
            if (loops < 0 || loops > 100) this.setState({ error: "You cannot set more than 100 schedules at once." });
            else {
                let successes = 0;
                let attempts = 0;
                for (let i = 0; i <= loops; i++) {
                    let currentDay = new Date(year, 0, this.GetDay(this.state.Form.StartDay) + i);
                    if (this.state.Form.RepeatDay[currentDay.getDay()]) {
                        let schedule = {
                            CourseId: this.state.Form.Course,
                            AccountId: this.props.Login.id,
                            Year: currentDay.getFullYear(),
                            Day: this.GetDay(currentDay.toISOString().slice(1, 10)),
                            StartTime: this.ConvertTime(this.state.Form.StartTime),
                            Duration: this.ConvertTime(this.state.Form.EndTime) - this.ConvertTime(this.state.Form.StartTime),
                            Room: this.state.Form.Room
                        }
                        attempts++;
                        successes += await this.CreateSchedule(schedule) ? 1 : 0;
                    }
                }
                this.setState({ success: `Successfully created ${successes} meeting(s)`, error: `Failed creating ${attempts - successes} meeting(s)` });
            }
        }
        else {
            let schedule = {
                CourseId: this.state.Form.Course,
                AccountId: this.props.Login.id,
                Year: this.GetYear(this.state.Form.StartDay),
                Day: this.GetDay(this.state.Form.StartDay),
                StartTime: this.ConvertTime(this.state.Form.StartTime),
                Duration: this.ConvertTime(this.state.Form.EndTime) - this.ConvertTime(this.state.Form.StartTime),
                Room: this.state.Form.Room
            }
            if (await this.CreateSchedule(schedule)) this.setState({ success: 'Successfully created meeting', error: '' });
            else this.setState({ success: '', error: 'Failed creating meeting' });
        }
    }
    componentDidMount = async () => {
        await this.GetAllCourses();
    }
    render() {
        return (
            <div className="container vertical justify-start align-start max-width max-height wireframe">
                <div className="container horizontal item wireframe">
                    <label className="item" htmlFor='StartTime'>Start Time:</label>
                    <input className="item" type="time" name="StartTime" onChange={this.UpdateCredentials}/>
                    <label className="item" htmlFor='EndTime'>End Time:</label>
                    <input className="item" type="time" name="EndTime" onChange={this.UpdateCredentials}/>
                </div>
                {!this.state.Form.Repeat
                    ?
                    <div className="container horizontal item wireframe">
                        <label className="item" htmlFor='Day'>Day:</label>
                        <input className="item" type="date" name="Day" onChange={this.UpdateCredentials} value={this.state.Form.StartDay} />
                    </div>
                    :
                    <div className="container horizontal item wireframe">
                        <label className="item" htmlFor='Start'>Start Day:</label>
                        <input className="item" type="date" name="Start" onChange={this.UpdateCredentials} max={this.state.Form.EndDay} value={this.state.Form.StartDay} />
                        <label className="item" htmlFor='End'>End Day:</label>
                        <input className="item" type="date" name="End" onChange={this.UpdateCredentials} min={this.state.Form.StartDay} value={this.state.Form.EndDay} />
                    </div>
                }              
                <div className="container horizontal item wireframe">
                    <label className="item" htmlFor='Room'>Room:</label>
                    <input className="item" type="text" name="Room" onChange={this.UpdateCredentials} placeholder="Room: #" />
                </div>
                <div className="container horizontal item wireframe" key={this.state.courses}>
                    <label className="item" htmlFor='Course'>Course:</label>
                    <select className="item" name="Course" onChange={this.UpdateCredentials}>
                        {this.state.courses.map(course => {
                            return (
                                <option value={course.id} key={course.id}>{course.code} - {course.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="container horizontal item wireframe">
                    <label className="item" htmlFor='Repeats'>Repeats?:</label>
                    <input className="item" type="checkbox" name="Repeats" onChange={this.UpdateCredentials} checked={this.state.Form.Repeat} />
                </div>
                {this.state.Form.Repeat
                    ?
                    <>
                        <div className="container horizontal item wireframe">
                            <label className="item" htmlFor='Sunday'>Sunday:</label>
                            <input className="item" type="checkbox" name="Sunday" onChange={this.UpdateCredentials} checked={this.state.Form.RepeatDay[0]} />
                            <label className="item" htmlFor='Monday'>Monday:</label>
                            <input className="item" type="checkbox" name="Monday" onChange={this.UpdateCredentials} checked={this.state.Form.RepeatDay[1]} />
                            <label className="item" htmlFor='Tuesday'>Tuesday:</label>
                            <input className="item" type="checkbox" name="Tuesday" onChange={this.UpdateCredentials} checked={this.state.Form.RepeatDay[2]} />
                            <label className="item" htmlFor='Wednesday'>Wednesday:</label>
                            <input className="item" type="checkbox" name="Wednesday" onChange={this.UpdateCredentials} checked={this.state.Form.RepeatDay[3]} />
                            <label className="item" htmlFor='Thursday'>Thursday:</label>
                            <input className="item" type="checkbox" name="Thursday" onChange={this.UpdateCredentials} checked={this.state.Form.RepeatDay[4]} />
                            <label className="item" htmlFor='Friday'>Friday:</label>
                            <input className="item" type="checkbox" name="Friday" onChange={this.UpdateCredentials} checked={this.state.Form.RepeatDay[5]} />
                            <label className="item" htmlFor='Saturday'>Saturday:</label>
                            <input className="item" type="checkbox" name="Saturday" onChange={this.UpdateCredentials} checked={this.state.Form.RepeatDay[6]} />
                        </div>
                        
                    </>
                    : <></>
                }
                <input className="item" type="button" value="Create Schedules" onClick={evt => this.ProcessSchedules()} />
                <div className="success">{this.state.success}</div>
                <div className="error">{this.state.error}</div>
            </div>
        )
    }
}
export default ScheduleMakingFrame;