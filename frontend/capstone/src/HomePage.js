import React from 'react';
import './HomePage.css';
import Menu from './Menu';
import Calendar from './Calendar';
import axios from 'axios';

class SearchOptions extends React.Component {
    render() {
        return (
            <div className="container horizontal max-height max-width justify-around item wireframe">
                <Menu label="Class: " options={this.props.Courses} update={this.props.UpdateCourses} />
                {/* <Menu label="Time: " options={} /> */}
                <Menu label="Tutor: " options={this.props.Coaches} update={this.props.UpdateCoaches} />
            </div>
        )
    }
}

class DateSelection extends React.Component {
    render() {
        return (
            <div className="container horizontal max-height max-width item wireframe">
                <div className="container vertical max-height item wireframe">
                    <div className="item">Year</div>
                    <div className="item">Week</div>
                    <div className="container horizontal max-width item wireframe">
                        <div className="item">d</div>
                        <div className="item">Day</div>
                        <div className="item">b</div>
                    </div>
                </div>
                <div className="container horizontal max-height align-end item wireframe">
                    <div className="item">Sun</div>
                    <div className="item">Mon</div>
                    <div className="item">Tue</div>
                    <div className="item">Wed</div>
                    <div className="item">Thu</div>
                    <div className="item">Fri</div>
                    <div className="item">Sat</div>
                </div>
            </div>
        )
    }
}
class HomeFrame extends React.Component {
    constructor(props) {
        super(props);
        let now = new Date();
        let start = new Date(now.getFullYear(), 0, 0);
        let diff = now - start;
        let oneDay = 1000 * 60 * 60 * 24;
        let day = Math.floor(diff / oneDay);
        this.state = {
            search: {
                Year: now.getFullYear(),
                Day: day
            },
            schedules: [],
            coaches: [],
            courses: [],
            calendarData: [ ]
        };
    }
    UpdateTime = (start, end) => {

    }
    // UpdateCourses = (courses) => {
    //     let list = [];
    //     courses.map(course => {
    //         let id;
    //         this.state.courses.map(c => {
    //             if (c.code === course) id = c.id;
    //         })
    //         list.push(id);
    //     });

    //     let search = this.state.search;
    //     search.Courses = list;

    //     this.setState({ search: search }, async () => this.LoadSchedules());
    // }
    UpdateCoaches = (coaches) => {
        let list = [];
        coaches.map(coach => {
            let id;
            this.state.coaches.map(c => {
                if (c.PreferredName === coach) id = c.id;
            })
            list.push(id);
        });
        
        let search = this.state.search;
        search.Coaches = list;

        this.setState({ search: search }, async () => this.LoadSchedules());
    }
    // LoadCourses = async () => {
    //     await axios.get(this.props.APIS.course + "view")
    //         .then(response => {
    //             if (response.data.statusCode !== 200) {
    //                 console.log(response.data.value);
    //             }
    //             else {
    //                 this.setState({ courses: response.data.value });
    //             }
    //         });
    // }
    CalendarData = async () => {
        let list = [];
        this.state.coaches.map(coach => {
            let datum = {
                coach: coach
            };
            let schedule = [];
            this.state.schedules.map(entry => {
                if (entry.accountId === coach.id) {
                    this.state.courses.map(course => {
                        if (course.id === entry.courseId) {
                            entry.course = course;
                        }
                    })
                    schedule.push(entry);
                }
            });
            datum.schedule = schedule;
            list.push(datum);
        });
        this.setState({ calendarData: list });
    }
    LoadCoaches = async () => {
        let coachIds = {
            accounts: []
        };
        this.state.schedules.map(schedule => {
            if (coachIds.accounts.indexOf(schedule.accountId) == -1) {
                coachIds.accounts.push(schedule.accountId);
            }
        });
        axios.post(this.props.APIS.account + 'batch', coachIds)
            .then(response => {
                if (response.data.statusCode !== 200) {
                    console.log(response.data.value);
                }
                else {
                    this.setState({ coaches: response.data.value }, async () => this.CalendarData());
                }
            });
    }
    LoadSchedules = async () => {
        axios.post(this.props.APIS.schedule + 'find', this.state.search,)
            .then(response => {
                if (response.data.statusCode !== 200) {
                    console.log(response.data.value);
                }
                else {
                    this.setState({ schedules: response.data.value }, async () => this.LoadCoaches());
                }
            });
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
        // let courses = [];
        // let coaches = [];
        // this.state.courses.map(course => {
        //     courses.push(course.code);
        // });
        // this.state.coaches.map(coach => {
        //     coaches.push(coach.preferredname);
        // });
        return (
            <div id="Framing" className="container vertical justify-start max-width wireframe">
                <div className="container horizontal max-width wireframe">
                    <DateSelection key={"1"} />
                    {/* <SearchOptions Courses={courses} Coaches={coaches} UpdateCoaches={this.UpdateCoaches} UpdateCourses={this.UpdateCourses} key={this.state.courses + this.state.coaches} /> */}
                </div>
                <Calendar data={this.state.calendarData} key={this.state.calendarData}/>
            </div>
        )
    }
}

export default HomeFrame;