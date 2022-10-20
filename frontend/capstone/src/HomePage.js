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
class Frame extends React.Component {
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
            calendarData: [
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, {starttime:725, duration: 10}] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
                { coach: { preferredname: "Dante Gutierrez" }, schedule: [{ starttime: 540, duration: 120 }, { starttime: 725, duration: 10 }] },
                { coach: { preferredname: "Chris Stanley" }, schedule: [{ starttime: 627, duration: 19 }, { starttime: 902, duration: 178 }] },
            ]
        };
    }
    UpdateTime = (start, end) => {

    }
    UpdateCourses = (courses) => {
        let list = [];
        courses.map(course => {
            let id;
            this.state.courses.map(c => {
                if (c.code === course) id = c.id;
            })
            list.push(id);
        });

        let search = this.state.search;
        search.Courses = list;

        this.setState({ search: search }, async () => this.LoadSchedules());
    }
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
    LoadCourses = async () => {
        axios.get(this.props.APIS.course + "view")
            .then(response => {
                if (response.data.statusCode !== 200) {
                    console.log(response.data.value);
                }
                else {
                    this.setState({ courses: response.data.value });
                }
            });
    }
    CalendarData = async () => {
        let list = [];
        this.state.coaches.map(coach => {
            let datum = {
                coach: coach
            };
            let schedule = [];
            this.state.schedules.map(entry => {
                if (entry.accountid === coach.id) schedule.push(entry);
            });
            datum.schedule = schedule;
            list.push(datum);
        });
        this.setState({ calendarData: list });
    }
    LoadCoaches = async () => {
        // let coaches = [];
        // this.state.schedules.map(async (schedule) => {
        //     if (coaches.indexOf(schedule.AccountId) !== -1) {
        //         await axios.get(this.props.APIS.schedule + 'search/' + schedule.AccountId)
        //             .then(response => {
        //                 if (response.data.statusCode !== 200) {
        //                     console.log(response.data.value)
        //                 }
        //                 else {
        //                     let coach = response.data.value;

        //                     coach.id = schedule.AccountId;

        //                     coaches.push(coach);
        //                 }
        //             });
        //     }
        // });
        // this.setState({ coaches: coaches });
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
    componentDidMount = async () => {
        await this.LoadSchedules();
        await this.LoadCourses();
    }
    render() {
        let courses = [];
        let coaches = [];
        this.state.courses.map(course => {
            courses.push(course.code);
        });
        this.state.coaches.map(coach => {
            coaches.push(coach.preferredname);
        });
        //console.log(this.state.calendarData)
        return (
            <div className="container vertical max-height max-width wireframe">
                <div className="container horizontal max-width wireframe">
                    <DateSelection />
                    <SearchOptions Courses={courses} Coaches={coaches} UpdateCoaches={this.UpdateCoaches} UpdateCourses={this.UpdateCourses} key={this.state.courses + this.state.coaches} />
                </div>
                <Calendar data={this.state.calendarData} key={this.state.calendarData} />
            </div>
        )
    }
}

export default Frame;