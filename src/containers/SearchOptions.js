import React, {Component} from 'react'

class SearchOptions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputText: '',
            options: this.props.options,
            matchedOptions: [],
            optionSelected: false,
        }
    }

    onClick = (value) => {
        this.setState({optionSelected: true});
        this.setState({inputText: value})
        this.props.onChange(value)
    }

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