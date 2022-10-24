import React from 'react';
import './Calendar.css';

const Times = ["12 am", "1 am", "2 am", "3 am", "4 am", "5 am", "6 am", "7 am", "8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm", "11 pm"]
const StartingPoint = 8;
const width = 120;
const TimeConvert = (start) => {
    let value = "";
    let minutes = start % 60;
    let time = (start-minutes) / 60;
    value += `${time % 12 == 0 ? 12 : time % 12}:${minutes < 10 ? "0" + minutes : minutes} ${time > 11 ? "pm" : "am"}`;
    return value;
}
class CalendarFrame extends React.Component {
    GenerateRow(data) {
        let row = '';
        data.schedule.map(entry => {
            let fullCourseCode = entry.course != undefined ? entry.course.code : "";
            let fullCourseName = entry.course != undefined ? entry.course.name : "";
            let courseCode = entry.course != undefined ? entry.course.code.slice(0, 3) : "";
            row += `
            <div key=${entry} class="row other ${courseCode}" style="width: ${(entry.duration / 60) * width}px; left: ${(entry.startTime / 60) * width}px;">
                <div class="info container vertical wireframe">
                    <div class="item wireframe">${data.coach.name}</div>
                    <div class="item wireframe">${fullCourseCode}</div>
                    <div class="item wireframe">${fullCourseName}</div>
                    <div class="item wireframe">${TimeConvert(entry.startTime) + " - " + TimeConvert(entry.startTime + entry.duration)}</div>
                </div>
            </div>`
        });
        return (row);
    }
    render() {
        return (
            <div id="Frame" className="max-height max-width wireframe">
                <div className="container horizontal">
                    <div id="Names" className="wireframe">
                        <div className="column title">Coaches</div>
                        {this.props.data.map(data => {
                            return (
                                <div className="column row mini-margin wireframe" key={data.coach.name}>{data.coach.name}</div>
                            )
                        })}
                    </div>
                    <div className='container vertical justify-start align-start box-bind wireframe'>
                        <div className="container horizontal justify-start align-start box max-height">
                                {Times.slice(0,Times.length - 1).map((value, i) => {
                                return (
                                    <>
                                        <div className="spacer"></div>
                                        <div className="lines max-height"></div>
                                    </>
                                )
                            })}
                            <div className="spacer"></div>
                        </div>
                        <div className="container horizontal justify-start align-start title">
                            {Times.map(value => {
                                return (
                                    <div className="column times">{value}</div>
                                )
                            })}
                        </div>
                        {this.props.data.map(data => {
                            return (
                                <>
                                    <div className="container horizontal time-row row" dangerouslySetInnerHTML={{ __html: this.GenerateRow(data) }}></div>
                                    <div className="bars"></div>
                                </>
                                )
                            })}
                    </div>
                </div>
            </div>
        )
    }
}
export default CalendarFrame;