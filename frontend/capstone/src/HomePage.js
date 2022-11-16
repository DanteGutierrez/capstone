import React from 'react';
import axios from 'axios';
import './HomePage.css';

import Menu from './Menu';
import Calendar from './Calendar';

// The area for the filters of the calendar
class SearchOptions extends React.Component {
    render() {
        return (
            <div id="Filter" title="Filters for the daily schedule"className="container vertical max-height max-width">
                <div className="max-width filter-title">Filters:</div>
                <div className="container horizontal max-height max-width justify-around item">
                    <Menu label="Courses: " options={this.props.Courses} update={this.props.UpdateCourses} />
                    <div className="container vertical max-width max-height">
                        <div className="container horizontal item max-width" title="Change the earliest hour to view">
                            <label className="item bolded" htmlFor='StartTime'>Start Time: </label>
                            <input className={`item timeInput ${this.props.Time.StartTimeError !== "" ? "timeInputIssue" : ""}`} name="StartTime" type="time" onChange={event => this.props.UpdateTime(event)} value={this.props.Time.StartTime} />
                        </div>
                        <div className="container horizontal item max-width" title="Change the latest hour to view">
                            <label className="item bolded" htmlFor='EndTime'>End Time: </label>
                            <input className={`item timeInput ${this.props.Time.EndTimeError !== "" ? "timeInputIssue" : ""}`} name="EndTime" type="time" onChange={evt => this.props.UpdateTime(evt)} value={this.props.Time.EndTime} />
                        </div>
                    </div>
                    <Menu label="Coaches: " options={this.props.Coaches} update={this.props.UpdateCoaches} />
                </div>
            </div>
        )
    }
}

class DateSelection extends React.Component {
    render() {
        return (
            <div className="container horizontal max-height max-width justify-start">
                <div id="WeekChanger" className="container vertical max-height">
                    <div className="item">Year</div>
                    <div className="item">{this.props.Year}</div>
                    <div className="container horizontal max-width item">
                        <div className="item button" title="Look at last week's shedules" onClick={evt => this.props.ChangeDay(-7)}>◄</div>
                        <div className="item">Week {Math.ceil(((6 - new Date(this.props.Year, 0, this.props.Day).getDay()) + this.props.Day) / 7)}</div>
                        <div className="item button" title="Look at next week's schedules" onClick={evt => this.props.ChangeDay(7)}>►</div>
                    </div>
                </div>
                <div className="container horizontal max-height align-end item">
                    {this.props.Tabs.map(tab => {
                        let date = new Date(this.props.Year, 0, this.props.Day + tab.value).toLocaleDateString().split('/');
                        let stringDate = date[0] + "/" + date[1];
                        return (
                            <div className={`container vertical tab${tab.selected ? " selectedTab" : ""}`} title={`Look at ${stringDate}'s schedules`} onClick={evt => this.props.ChangeDay(tab.value)} key={tab.name}>
                                <div>{tab.name}</div>
                                {tab.selected ? <div>{stringDate}</div> : <></>}
                            </div>
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

        // Loading current day's information
        let now = new Date();
        let start = new Date(now.getFullYear(), 0, 0);
        let diff = now - start;
        let oneDay = 1000 * 60 * 60 * 24;
        let day = Math.floor(diff / oneDay);
        this.state = {
            search: {
                Year: now.getFullYear(),
                Day: day,
                StartTime: (7 * 60),
                EndTime: (21 * 60)
            },
            schedules: [],
            coaches: [],
            courses: [],
            calendarData: [],
            selections: {
                coaches: [],
                courses: [],
                time: {
                    StartTime: "07:00",
                    EndTime: "21:00",
                    StartTimeError: "",
                    EndTimeError: ""
                }
            }
        };
    }

    // Changes the current viewed day
    ChangeDay = (days) => {
        let day = this.state.search.Day + days;
        let year = this.state.search.Year;

        // Rolls the year forward or backwards after adjusting days to request amount
        if (day < 1) {
            day += ((this.state.year % 4 === 0 && (this.state.year % 100 !== 0 || this.state.year % 400 === 0)) ? 366 : 365);
            year -= 1;
        }
        else if (day > ((this.state.year % 4 === 0 && (this.state.year % 100 !== 0 || this.state.year % 400 === 0)) ? 366 : 365)) {
            day -= ((this.state.year % 4 === 0 && (this.state.year % 100 !== 0 || this.state.year % 400 === 0)) ? 366 : 365);
            year += 1;
        }
        let search = this.state.search;
        search.Day = day;
        search.Year = year;
        this.setState({ search: search }, async () => this.LoadSchedules());
    }

    // Changes the time filter
    UpdateTime = (start, end) => {
        let search = this.state.search;
        if (!isNaN(start)) search.StartTime = start;
        if (!isNaN(end)) search.EndTime = end;
        this.setState({ search: search }, async () => this.LoadSchedules());
    }

    // Changes the course filter
    UpdateCourses = (courses) => {
        let selection = this.state.selections;
        selection.courses = courses;
        this.setState({ selections: selection });
        let list = [];
        courses.map(course => {
            let id;
            this.state.courses.map(c => {
                if (c.code === course) id = c.id;
                return null;
            })
            list.push(id);
            return null;
        });

        let search = this.state.search;
        search.Courses = list;

        this.setState({ search: search }, async () => this.LoadSchedules());
    }

    // Changes the coach filter
    UpdateCoaches = (coaches) => {
        let selection = this.state.selections;
        selection.coaches = coaches;
        this.setState({ selections: selection });
        let list = [];
        coaches.map(coach => {
            let id;
            this.state.coaches.map(c => {
                if (c.name === coach) id = c.id;
                return null;
            })
            list.push(id);
            return null;
        });
        
        let search = this.state.search;
        search.Coaches = list;

        this.setState({ search: search }, async () => this.LoadSchedules());
    }

    // Cleans the data up, assigning schedules to coaches
    CalendarData = async () => {
        let list = [];
        this.state.coaches.map(coach => {
            let datum = {
                coach: coach
            };
            let schedule = [];
            
            // Builds the assigned tutor rows first
            this.state.schedules.assigned.map(entry => {
                if (entry.accountId === coach.id) {
                    this.state.courses.map(course => {
                        if (course.id === entry.courseId) {
                            entry.course = course;
                        }
                        return null;
                    })
                    schedule.push(entry);
                }
                return null;
            });

            // Builds the preferred tutor rows after the assigned
            this.state.schedules.preferred.map(entry => {
                if (entry.accountId === coach.id) {
                    this.state.courses.map(course => {
                        if (course.id === entry.courseId) {
                            entry.course = course;
                        }
                        return null;
                    })
                    schedule.push(entry);
                }
                return null;
            });
            datum.schedule = schedule;
            list.push(datum);
            return null;
        });
        this.setState({ calendarData: list });
    }

    // Grabs a list of coaches based on all of the returned schedules of the day
    LoadCoaches = async () => {
        let coachIds = {
            accounts: []
        };

        // Putting the assigned coaches of the day first (matters when working with a course filter)
        this.state.schedules.assigned.map(schedule => {
            if (coachIds.accounts.indexOf(schedule.accountId) === -1) {
                coachIds.accounts.push(schedule.accountId);
            }
            return null;
        });

        // Putting any other coach of the day after the assignments
        this.state.schedules.preferred.map(schedule => {
            if (coachIds.accounts.indexOf(schedule.accountId) === -1) {
                coachIds.accounts.push(schedule.accountId);
            }
            return null;
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
        axios.post(this.props.APIS.schedule + 'find', this.state.search)
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
                        return null;
                    })
                    this.setState({ courses: courseList }, async () => this.LoadSchedules())
                }
            })
    }

    // Interprets the time input and makes the appropriate adjustments to the filter
    ChangeTime = (event) => {
        let item = event.target;
        let selections = this.state.selections;
        switch (item.name) {
            case "StartTime":
                if (this.ConvertTime(item.value) > this.ConvertTime(selections.time.EndTime)) {
                    selections.time.StartTimeError = "Cannot set a time bigger than the end time";
                }
                else {
                    selections.time.StartTime = item.value;
                    selections.time.StartTimeError = "";
                    this.UpdateTime(this.ConvertTime(item.value), this.ConvertTime(selections.time.EndTime));
                }
                break;
            case "EndTime":
                if (this.ConvertTime(item.value) < this.ConvertTime(selections.time.StartTime)) {
                    selections.time.EndTimeError = "Cannot set a time smaller than the start time";
                }
                else {
                    selections.time.EndTime = item.value;
                    selections.time.EndTimeError = "";
                    this.UpdateTime(this.ConvertTime(selections.time.StartTime), this.ConvertTime(item.value));
                }
                break;
            default:
                break;
        }
        this.setState({ selections: selections });
    }

    // Turns the time from input time to seconds since midnight
    ConvertTime = (time) => {
        let brokenTime = time.split(":");
        return (Number(brokenTime[0]) * 60) + Number(brokenTime[1]);
    }

    // Loads the courses, which loads the schedules, which loads coaches, and eventually the calendar
    componentDidMount = async () => {
        await this.GetAllCourses();
    }
    render() {

        // Grabs day of the week from sunday to do calculations
        let date = new Date(this.state.search.Year, 0, this.state.search.Day).getDay();

        // Generates the necessary data for the day tabs
        let tabs = [
            { name: "Sun", selected: date === 0, value: 0 - date},
            { name: "Mon", selected: date === 1, value: 1 - date },
            { name: "Tue", selected: date === 2, value: 2 - date },
            { name: "Wed", selected: date === 3, value: 3 - date },
            { name: "Thu", selected: date === 4, value: 4 - date },
            { name: "Fri", selected: date === 5, value: 5 - date },
            { name: "Sat", selected: date === 6, value: 6 - date }
        ];

        // Preparing data for the filters
        let courses = {
            selected: this.state.selections.courses,
            unselected: []
        };
        let coaches = {
            selected: this.state.selections.coaches,
            unselected: []
        };
        this.state.courses.map(course => {
            if (courses.selected.indexOf(course.code) === -1) {
                courses.unselected.push(course.code);
            }
            return null;
        });
        this.state.coaches.map(coach => {
            if (coaches.selected.indexOf(coach.name) === -1) {
                coaches.unselected.push(coach.name);
            }
            return null;
        });
        return (
            <div id="Framing" className="container vertical justify-start max-width">
                <div className="container horizontal max-width">
                    <DateSelection ChangeDay={this.ChangeDay} Year={this.state.search.Year} Day={this.state.search.Day} Tabs={tabs} />
                    <SearchOptions Courses={courses} Coaches={coaches} Time={this.state.selections.time} UpdateCoaches={this.UpdateCoaches} UpdateCourses={this.UpdateCourses} UpdateTime={this.ChangeTime} key={this.state.courses + this.state.coaches} />
                </div>
                <Calendar TutorNavigation={this.props.TutorNavigation} Auxilary={this.state.search} data={this.state.calendarData} title={"Coaches"} key={this.state.calendarData}/>
            </div>
        )
    }
}

export default HomeFrame;