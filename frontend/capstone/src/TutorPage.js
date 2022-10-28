import React from 'react'
import axios from 'axios'
import './TutorPage.css'
import Calendar from './Calendar';
import Schedule from './Schedule';


class TutorInfo extends React.Component {
    render() {
        return (
            <div id="NameInformation" className="container horizontal max-width item">
                <div></div>
                <div className="container vertical max-height max-width item bubble">
                    <div id="TutorName" className="max-height max-width">{this.props.Tutor.name}</div>
                    <div id="TutorEmail" className="max-height max-width">{this.props.Tutor.email}</div>
                    {/* links */}
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
class ClassSelection extends React.Component {
    render() {
        return (
            <div className="container horizontal align-start max-height">
                <div className="container vertical justify-start max-height bubble">
                    <div className="container vertical max-width">
                        <div className="item">Assigned:</div>
                        {
                            this.props.courses.map(course => {
                                if (course.id === this.props.Tutor.assignedCourse){
                                return (
                                    <div className={`item course ${course.code.slice(0,3)}`} key={course.code}>{`${course.code} - ${course.name}`}</div>
                                    )
                                }
                                else {
                                    return null;
                                }
                            })
                        }
                    </div>
                    <div className="preferredContainer container vertical justify-start max-height max-width">
                        <div className="item">Also Tutors:</div>
                        <div className="container horizontal item preferred">
                            {this.props.Tutor.preferredCourses.map(courseId => {
                                let foundCourse = {code: "TST000", name:"ERROR"};
                                this.props.courses.map(course => {
                                    if (course.id === courseId) foundCourse = course;
                                    return null;
                                }) 
                                if (foundCourse.code === "TST000") return null;
                                return (
                                    <div className={`item course ${foundCourse.code.slice(0, 3)}`} key={foundCourse.code} onClick={evt => this.props.movePreferredCourse(foundCourse.id)}>{`${foundCourse.code} - ${foundCourse.name}`}</div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                {this.props.Login.admin || this.props.Login.id === this.props.Tutor.id
                    ? <div className="preferredContainer container vertical justify-start max-height bubble">
                        <div className="item">Add to Preferred: </div>
                        <div className="container horizontal item preferred">
                            {this.props.courses.map(course => {
                                let error = (course.id === this.props.Tutor.assignedCourse);
                                this.props.Tutor.preferredCourses.map(courseId => {
                                    if (courseId === course.id) error = true;
                                    return null;
                                });
                                if (error) return null;
                                return (
                                    <div className={`item course ${course.code.slice(0, 3)}`} key={course.code} onClick={evt => this.props.movePreferredCourse(course.id)}>{`${course.code} - ${course.name}`}</div>
                                )
                            })}
                        </div>
                    </div>
                    : <></>
                }
            </div>
        )
    }
}

//const DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
class TutorFrame extends React.Component {
    constructor(props) {
        super(props);
        let now = new Date();
        let start = new Date(now.getFullYear(), 0, 0);
        let diff = now - start;
        let oneDay = 1000 * 60 * 60 * 24;
        let day = Math.floor(diff / oneDay);
        this.state = {
            year: now.getFullYear(),
            day: day,
            schedules: [],
            courses: [],
            scheduleOpen: true
        };
    }
    ChangeDay = (days) => {
        let day = this.state.day + days;
        let year = this.state.year;
        if (day < 1) {
            day += ((this.state.year % 4 === 0 && (this.state.year % 100 !== 0 || this.state.year % 400 === 0)) ? 366 : 365);
            year -= 1;
        }
        else if (day > ((this.state.year % 4 === 0 && (this.state.year % 100 !== 0 || this.state.year % 400 === 0)) ? 366 : 365)) {
            day -= ((this.state.year % 4 === 0 && (this.state.year % 100 !== 0 || this.state.year % 400 === 0)) ? 366 : 365);
            year += 1;
        }
        this.setState({ year: year, day: day }, async () => this.LoadSchedules());
    }
    LoadSchedules = async () => {
        let list = [];
        let search = {
            Year: 0,
            Day: 0,
            Coaches: [this.props.Tutor.id]
        };
        let date = new Date(this.state.year, 0, this.state.day);
        let currentDay = this.state.day - date.getDay() - 1;
        let yearModifier = 0;
        for (let i = 0; i < 7; i++) {
            if (currentDay + 1 < 1) {
                currentDay = (this.state.year % 4 === 0 && (this.state.year % 100 !== 0 || this.state.year % 400 === 0)) ? 366 : 365;
                yearModifier = -1;
            }
            else if (currentDay + 1 > ((this.state.year % 4 === 0 && (this.state.year % 100 !== 0 || this.state.year % 400 === 0)) ? 366 : 365)) {
                currentDay = 1;
                yearModifier = 1;
            }
            else {
                currentDay += 1;
                yearModifier = 0;
            }
            search.Day = currentDay;
            search.Year = this.state.year + yearModifier;
            date = new Date(this.state.year, 0, currentDay);
            await axios.post(this.props.APIS.schedule + "find", search)
            // eslint-disable-next-line
            .then(response => {
                if (response.data.statusCode !== 200) {
                    console.log(response.data.value);
                }
                else {
                    response.data.value.map(item => {
                        this.state.courses.map(course => {
                            if (course.id === item.courseId) {
                                item.course = course;
                            }
                            return null;
                        });
                        return null;
                    });
                        list.push({ coach: { name: date.toDateString()}, schedule: response.data.value });
                    }
                })
        }
        this.setState({ schedules: list });
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
                    this.setState({ courses: courseList }, async () => this.LoadSchedules())
                }
            })
    }
    ScheduleToggled = async () => {
        this.setState({ scheduleOpen: !this.state.scheduleOpen }, async () => this.LoadSchedules());
    }  
    movePreferredCourse = (id) => {
        let preferred = false;
        let clone = this.props.Tutor;
        clone.preferredCourses.map(course => {
            if (course === id) preferred = true;
            return null;
        });
        if (preferred) clone.preferredCourses.splice(clone.preferredCourses.indexOf(id), 1);
        else clone.preferredCourses.push(id);
        this.props.updateTutor(clone);
    }
    DeleteSchedule = (id) => {
        axios.delete(`${this.props.APIS.schedule}delete/${id}?auth=${this.props.Login.authorized}&userid=${this.props.Login.id}`)
            .then(response => {
                if (response.data.statusCode !== 200) {
                    console.log(response.data.value);
                }
                else this.LoadSchedules();
            })
    }
    componentDidMount = async () => {
        await this.GetAllCourses();
    }
    render() {
        return (
            <div id="Framing" className="container vertical justify-start max-width">
                <TutorInfo Tutor={this.props.Tutor} Year={this.state.year} Day={this.state.day} ChangeDay={this.ChangeDay} Login={this.props.Login} ScheduleToggled={this.ScheduleToggled} ScheduleOpen={this.state.scheduleOpen} />
                <div id="TutoringInformation" className="container horizontal max-width">
                    <ClassSelection Tutor={this.props.Tutor} courses={this.state.courses} Login={this.props.Login} movePreferredCourse={this.movePreferredCourse} />
                    {this.state.scheduleOpen
                        ? <Calendar data={this.state.schedules} getID={this.props.getID} title={"Days of the Week"} key={this.state.schedules} DeleteSchedule={this.props.Login.id === this.props.Tutor.id || this.props.Login.admin ? this.DeleteSchedule : undefined} />
                        : <Schedule APIS={this.props.APIS} getID={this.props.getID} Login={this.props.Login} Tutor={this.props.Tutor} />
                    }
                </div>
            </div>
        )
    }
}
export default TutorFrame;