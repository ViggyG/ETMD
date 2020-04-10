import React, {Component} from 'react'

//class for displaying options as a user searches
class SearchOptions extends Component {
    constructor(props) {
        //initial setup
        super(props)
        this.state = {
            inputText: '',
            options: this.props.options,
            matchedOptions: [],
            optionSelected: false,
        }
        console.log(this.props.options)
    }

    //update the options available to the search bar
    updateOptions = (options) => {
        this.setState({options: options})
    }

    //function for handling when a user clicks on an option
    onClick = (value) => {
        this.setState({optionSelected: true});
        this.setState({inputText: value})
        this.props.onChange(value)
    }

    //update the options as the user enters text
    onChange = (e) => {
        const {options} = this.state;
        var value = e.target.value.toLowerCase();

        this.props.onChange(value)

        this.setState({inputText: value})
        this.setState({optionSelected: false})
        
        if(value) {

            var filteredOptions = options.filter((option) => {
            return option.name.includes(value);
            })

            var optionList = filteredOptions.map((option, i) => {
                return (
                    <p 
                        className='search-option' 
                        key={i}
                        onClick={() => this.onClick(option.name)}
                    >
                        {option.name}
                    </p>
                )
            })
            this.setState({matchedOptions: optionList})
        }
        else {
            this.setState({matchedOptions: []})
        }
        
    }

    render() {
        const {inputText, matchedOptions, optionSelected} = this.state;

        let displayOptions = <div></div>

        if(matchedOptions.length && !optionSelected) {
            displayOptions = 
            <div>
                {matchedOptions}
            </div>
        }

        return(
            <div className='search-options-outer'>
                <input
                    className='search-input'
                    type='text'
                    onChange={(event) => {this.onChange(event)}}
                    value={inputText}
                />
                {displayOptions}
            </div>
        )
    }
}

export default SearchOptions;