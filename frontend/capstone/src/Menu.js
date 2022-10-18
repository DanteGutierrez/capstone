import React from 'react'
import './Menu.css'

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            label: this.props.label,
            unselected: this.props.options,
            selected: [],
            open: false
        };
    }
    Open() {
        this.setState({ open: true });
    }
    Close() {
        this.setState({ open: false });
    }
    UnSelect(name) {
        let unselectedCopy = this.state.unselected.slice();
        let selectedCopy = this.state.selected.slice();
        unselectedCopy.push(name);
        selectedCopy.splice(selectedCopy.indexOf(name), 1);
        this.setState({
            unselected: unselectedCopy,
            selected: selectedCopy
        });
    }
    Select(name) {
        let unselectedCopy = this.state.unselected.slice();
        let selectedCopy = this.state.selected.slice();
        selectedCopy.push(name);
        unselectedCopy.splice(unselectedCopy.indexOf(name), 1);
        this.setState({
            unselected: unselectedCopy,
            selected: selectedCopy
        });
    }
    render() {
        return (
            <div class="container vertical justify-start item max-height max-width">
                <div className="container horizontal align-start item">
                    <div className="item">{this.state.label}</div>
                    <div className="container vertical item">
                        {this.state.open
                            ? <div>
                                <div className="button" onClick={evt => this.Close()}>Close</div>
                                <div class="dropdown">
                                {this.state.unselected.map(option => {
                                    return (
                                        <div className="option container horizontal justify-around max-width" onClick={evt => { this.Select(option); this.Close() }}>
                                            <div className="item">{option}</div>
                                            <div className="color item"></div>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                            : <div className="button" onClick={evt => this.Open()}>Open</div>
                        }
                    </div>
                </div>
                <div className="selection container horizontal justify-start item ">
                    {this.state.selected.map(option => {
                        return (
                            <div className="selected container horizontal item" onClick={evt => this.UnSelect(option)}>
                                <div className="item">{option}</div>
                                <div className="close"></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Menu;