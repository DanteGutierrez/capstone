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
            <div className="container vertical justify-start item">
                <div className="container horizontal align-start item">
                    <div className="item bolded" title="Change this filter">{this.state.label}</div>
                    <div className="container vertical item">
                        {this.state.open
                            ? <div className="opened">
                                <div className="button lame" onClick={evt => this.ChangeOpen()} title="Close list of filters">Close</div>
                                <div className="dropdown">
                                {this.props.options.unselected.map(option => {
                                    return (
                                        <div className={`option container horizontal justify-around max-width ${option.slice(0, 3)}`} title={`Add ${option} to filter`} onClick={evt => { this.Select(option); this.ChangeOpen() }} key={option}>
                                            <div className="item">{option}</div>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                            : <div className="button lame" onClick={evt => this.ChangeOpen()} title="Open list of filters">Open</div>
                        }
                    </div>
                </div>
                <div className="selection container horizontal justify-start item">
                    {this.props.options.selected.map(option => {
                        return (
                            <div className="selected container horizontal item" title={`Remove ${option} from filter`} onClick={evt => this.UnSelect(option)} key={option}>
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