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
            <div className="container horizontal max-height max-width justify-start item wireframe">
                <div className="container vertical max-height item wireframe">
                    <div className="item">Year</div>
                    <div className="item">{this.props.Year}</div>
                    <div className="container horizontal max-width item wireframe">
                        <div className="item button" onClick={evt => this.props.ChangeDay(-7)}>ᐊ</div>
                        <div className="item">Week {Math.ceil(((6 - new Date(this.props.Year, 0, this.props.Day).getDay()) + this.props.Day) / 7)}</div>
                        <div className="item button" onClick={evt => this.props.ChangeDay(7)}>ᐅ</div>
                    </div>
                </div>
                <div className="container horizontal max-height align-end item wireframe">
                    {this.props.Tabs.map(tab => {
                        return (
                            <div className={`tab${tab.selected ? " selectedTab" : ""} wireframe`} onClick={evt => this.props.ChangeDay(tab.value)} key={tab.name}>{tab.name}</div>
                        )
                    })}
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
            calendarData: [],
            selections: {
                coaches: [],
                courses: []
            }
        };
    }
    ChangeDay = (days) => {
        let day = this.state.search.Day + days;
        let year = this.state.search.Year;
        if (day < 1) {
            day += ((this.state.year % 4 == 0 && (this.state.year % 100 != 0 || this.state.year % 400 == 0)) ? 366 : 365);
            year -= 1;
        }
        else if (day > ((this.state.year % 4 == 0 && (this.state.year % 100 != 0 || this.state.year % 400 == 0)) ? 366 : 365)) {
            day -= ((this.state.year % 4 == 0 && (this.state.year % 100 != 0 || this.state.year % 400 == 0)) ? 366 : 365);
            year += 1;
        }
        let search = this.state.search;
        search.Day = day;
        search.Year = year;
        this.setState({ search: search }, async () => this.LoadSchedules());
    }
    UpdateTime = (start, end) => {

    }
    UpdateCourses = (courses) => {
        let selection = this.state.selections;
        selection.courses = courses;
        this.setState({ selections: selection });
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
        let selection = this.state.selections;
        selection.coaches = coaches;
        this.setState({ selections: selection });
        let list = [];
        coaches.map(coach => {
            let id;
            this.state.coaches.map(c => {
                if (c.name === coach) id = c.id;
            })
            list.push(id);
        });
        
        let search = this.state.search;
        search.Coaches = list;

        this.setState({ search: search }, async () => this.LoadSchedules());
    }
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
        let date = new Date(this.state.search.Year, 0, this.state.search.Day).getDay();
        let tabs = [
            { name: "Sun", selected: date == 0, value: 0 - date},
            { name: "Mon", selected: date == 1, value: 1 - date },
            { name: "Tue", selected: date == 2, value: 2 - date },
            { name: "Wed", selected: date == 3, value: 3 - date },
            { name: "Thu", selected: date == 4, value: 4 - date },
            { name: "Fri", selected: date == 5, value: 5 - date },
            { name: "Sat", selected: date == 6, value: 6 - date }
        ];
        let courses = {
            selected: this.state.selections.courses,
            unselected: []
        };
        let coaches = {
            selected: this.state.selections.coaches,
            unselected: []
        };
        this.state.courses.map(course => {
            if (courses.selected.indexOf(course.code) == -1) {
                courses.unselected.push(course.code);
            }
        });
        this.state.coaches.map(coach => {
            if (coaches.selected.indexOf(coach.name) == -1) {
                coaches.unselected.push(coach.name);
            }
        });
        return (
            <div id="Framing" className="container vertical justify-start max-width wireframe">
                <div className="container horizontal max-width wireframe">
                    <DateSelection ChangeDay={this.ChangeDay} Year={this.state.search.Year} Day={this.state.search.Day} Tabs={tabs} />
                    <SearchOptions Courses={courses} Coaches={coaches} UpdateCoaches={this.UpdateCoaches} UpdateCourses={this.UpdateCourses} key={this.state.courses + this.state.coaches} />
                </div>
                <Calendar data={this.state.calendarData} title={"Coaches"} key={this.state.calendarData}/>
            </div>
        )
    }
}

export default HomeFrame;