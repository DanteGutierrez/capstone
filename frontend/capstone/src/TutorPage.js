import React from 'react'
import axios from 'axios'
import './TutorPage.css'


class TutorInfo extends React.Component {
    render() {
        return (
            <div className="container horizontal max-width item wireframe">
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
                            this.props.Courses.map(course => {
                                if (course.id == this.props.Tutor.assignedCourse){
                                return (
                                    <div className="item course" key={course.code}>{`${course.code} - ${course.name}`}</div>
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

class Schedule extends React.Component {
    render() {
        return (
            <div className="container vertical max-width max-height"></div>
        )
    }
}

class TutorFrame extends React.Component {

    render() {
        return (
            <div className="container vertical justify-start max-width max-height wireframe">
                <TutorInfo Tutor={this.props.Tutor} />
                <div className="container horizontal max-width max-height wireframe">
                    <ClassSelection Tutor={this.props.Tutor} Courses={this.props.Courses} />
                    <Schedule />
                </div>
            </div>
        )
    }
}
export default TutorFrame;