import React from 'react'
import axios from 'axios'
import './TutorPage.css'
import Calendar from './Calendar';


class TutorInfo extends React.Component {
    render() {
        return (
            <div id="NameInformation" className="container horizontal max-width item wireframe">
                <div></div>
                <div className="container vertical max-height max-width item wireframe">
                    <div id="TutorName" className="max-height max-width">{this.props.Tutor.name}</div>
                    <div id="TutorEmail" className="max-height max-width">{this.props.Tutor.email}</div>
                    {/* links */}
                </div>
            </div>
        )
    }
}
class ClassSelection extends React.Component {
    render() {
        return (
            <div className="container horizontal max-height wireframe">
                <div className="container vertical justify-start max-height max-width wireframe">
                    <div className="container vertical max-width wireframe">
                        <div className="item">Assigned:</div>
                        {
                            this.props.courses.map(course => {
                                if (course.id == this.props.Tutor.assignedCourse){
                                return (
                                    <div className={`item ${course.code.slice(0,3)}`} key={course.code}>{`${course.code} - ${course.name}`}</div>
                                )}
                            })
                        }
                    </div>
                    <div className="container vertical jusitfy-start max-height max-width wireframe">
                        <div className="item">Also Tutors:</div>
                        <div className="item preferred">
                            {this.props.Tutor.preferredCourses.map(courseId => {
                                let foundCourse = {code: "000", name:"ERROR"};
                                this.props.Courses.map(course => {
                                    if (course.id == courseId) foundCourse = course;
                                }) 
                                console.log(foundCourse);
                                return (
                                    <div className="item course" key={foundCourse.code}>{`${foundCourse.code} - ${foundCourse.name}`}</div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        )
    }
}

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
            courses: []
        };
    }
    CalculateDayOfWeek = (year, day) => {
        const monthBounds = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30];
        const DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let cMonth = 0;
        let cDay = day;
        for (let i = 0; i < monthBounds.length; i++) {
            if (cDay - monthBounds[i] < 0) {
                cDay -= monthBounds[i];
                cMonth = i;
            }
        }
        let time = new Date(year, cMonth, cDay);
        return DayOfWeek[time.getDay()];
    }
    LoadSchedules = async () => {
        let list = [];
        let search = {
            Year: 0,
            Day: 0,
            Coaches: [this.props.Tutor.id]
        };
        let currentYear = this.state.year;
        let currentDay = this.state.day;
        for (let i = 0; i < 7; i++) {
            search.Year = currentYear;
            search.Day = currentDay + i;
            await axios.post(this.props.APIS.schedule + "find", search)
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
                            });
                        });
                        list.push({ coach: { name: this.CalculateDayOfWeek(currentYear, currentDay + i) }, schedule: response.data.value });
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
                    })
                    this.setState({ courses: courseList }, async () => this.LoadSchedules())
                }
            })
    }
    componentDidMount = async () => {
        await this.GetAllCourses();
    }
    render() {
        return (
            <div id="Framing" className="container vertical justify-start max-width wireframe">
                <TutorInfo Tutor={this.props.Tutor} />
                <div id="TutoringInformation" className="container horizontal max-width wireframe">
                    <ClassSelection Tutor={this.props.Tutor} courses={this.state.courses} />
                    <Calendar data={this.state.schedules} key={this.state.schedules} />
                </div>
            </div>
        )
    }
}
export default TutorFrame;