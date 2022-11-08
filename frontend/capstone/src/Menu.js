import React from 'react'
import './Menu.css'

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            label: this.props.label,
            open: false
        };
    }
    ChangeOpen() {
        this.setState({ open: !this.state.open });
    }
    UnSelect(name) {
        let selectedCopy = this.props.options.selected.slice();
        selectedCopy.splice(selectedCopy.indexOf(name), 1);
        this.props.update(selectedCopy);
    }
    Select(name) {
        let selectedCopy = this.props.options.selected.slice();
        selectedCopy.push(name);
        this.props.update(selectedCopy);
    }
    render() {
        return (
            <div className="container vertical justify-start item max-height max-width">
                <div className="container horizontal align-start item">
                    <div className="item">{this.state.label}</div>
                    <div className="container vertical item">
                        {this.state.open
                            ? <div>
                                <div className="button" onClick={evt => this.ChangeOpen()}>Close</div>
                                <div className="dropdown">
                                {this.props.options.unselected.map(option => {
                                    return (
                                        <div className={`option container horizontal justify-around max-width ${option.slice(0, 3)}`} onClick={evt => { this.Select(option); this.ChangeOpen() }} key={option}>
                                            <div className="item">{option}</div>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                            : <div className="button" onClick={evt => this.ChangeOpen()}>Open</div>
                        }
                    </div>
                </div>
                <div className="selection container horizontal justify-start item">
                    {this.props.options.selected.map(option => {
                        return (
                            <div className="selected container horizontal item" onClick={evt => this.UnSelect(option)} key={option}>
                                <div className="item" >{option}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Menu;