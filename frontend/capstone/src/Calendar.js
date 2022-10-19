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
class Frame extends React.Component {
    GenerateRow(data) {
        let tracker = 0;
        let row = `<div class="row name">${data.coach.preferredname}</div>`;
        data.schedule.map(entry => {
            if (entry.starttime > tracker) {
                row += `<div class="row block" style="width: ${((entry.starttime - tracker) / 60) * width}px;"></div>`;
            }
            row += `
            <div class="row other" style="width: ${(entry.duration / 60) * width}px;"><div class="info container vertical wireframe"><div class="item wireframe">${data.coach.preferredname}</div><div class="item wireframe">${TimeConvert(entry.starttime) + " - " + TimeConvert(entry.starttime + entry.duration)}</div></div></div>`;
            tracker = entry.starttime + entry.duration;
        });
        row += `<div class="row block" style="width: ${((((StartingPoint + 13) * 60) - tracker)/60) * width}px;"></div>`;
        return (row);
    }
    render() {
        return (
            <div id="Frame" className="container horizontal max-width max-height justify-start align-start wireframe">
                {/* <div className="container vertical justify-start coaches item wireframe">
                    <div className="times max-width">Coaches</div>
                    {this.props.data.map(data => {
                        return (
                            <div className="row spacer item">{data.coach.preferredname}</div>
                        )
                    })}
                </div> */}
                <div id="Calendar" className="container vertical box-bind justify-start align-start item wireframe">
                    <div className="container horizontal justify-start align-start box max-height">
                        
                        {Times.map(value => {
                            return (
                                <>
                                    <div className="spacer"></div>
                                    <div className="lines max-height"></div>
                                </>
                            )
                        })}
                        <div className="spacer"></div>
                    </div>
                    <div className="container horizontal justify-start align-start">
                        <div className="times max-width">Coaches</div>
                        {Times.map(value => {
                            return (
                                <div className="times">{value}</div>
                            )
                        })}
                    </div>
                    <div className="bars"></div>
                    {this.props.data.map(data => {
                        return (
                            <>
                                <div className="container horizontal" dangerouslySetInnerHTML={{ __html: this.GenerateRow(data) }}></div>
                                <div className="bars"></div>
                            </>
                            )
                        })}
                </div>
            </div>
        )
    }
}
export default Frame;