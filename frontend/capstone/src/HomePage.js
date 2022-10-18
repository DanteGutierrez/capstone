import React from 'react';
import './HomePage.css';
import Menu from './Menu';







class SearchOptions extends React.Component {
    render() {
        return (
            <div className="container horizontal max-height max-width justify-around item wireframe">
                <Menu label="Class: " options={["one", "two", "three", "four", "five", "six", "seven", "CSC000"]} />
                <Menu label="Time: " options={["one", "two", "three", "four", "five"]} />
                <Menu label="Tutor: " options={["one", "two", "three", "four", "five"]} />
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
    render() {
        return (
            <div className="container vertical max-height max-width wireframe">
                <div className="container horizontal max-width item wireframe">
                    <DateSelection />
                    <SearchOptions />
                </div>
            </div>
        )
    }
}

export default Frame;