import React, {Component} from 'react'

//class for displaying a tooltip to the screen
class Tooltip extends Component {
    //initial setup
    constructor(props) {
        super(props);
        
        this.state = {
            text: '',
            isActive: false,
        }
    }

    //function for updating the text of the tooltip
    setText = (text) => {
        this.setState({text: text});
    }

    //toggle the tooltip on and off
    toggle = () => {
        const {isActive} = this.state;
        this.setState({isActive: !isActive});
    }

    //basic render function
    render() {
        const {text, isActive} = this.state
        return(
            <div
                className={(isActive)? 'tooltip-outer' : 'tooltip-inactive'}
            >
                <p className='tooltip-text'>
                    {text}
                </p>
            </div>
        )
    }
}

export default Tooltip;