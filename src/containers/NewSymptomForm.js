import React, {Component} from 'react'
import './formStyles.css'
import Button from '../components/Button'

//form for creating a new symptom 
class NewSymptomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            description: '',
        }
    }

    //functions for updating the state on text inputs
    onNameChange = (e) => {
        let value = e.target.value;
        this.setState({name: value});
    }

    onDescChange = (e) => {
        let value = e.target.value;
        this.setState({description: value});
    }

    //render setup for the form 
    render() {
        const {name, description} = this.state;
        let buttonEnebled = (name.length > 0 && description.length > 0);
        return(
            <div className="grid items-center">
                <p className='form-title'>{this.props.title}</p>
                <p className='form-label'>Name:</p>

                <input 
                    className='text-input'
                    type='text' 
                    value={name} 
                    onChange={this.onNameChange} 
                />

                <p className='form-label'>Description:</p>

                <textarea
                    className='text-input'
                    rows='3'
                    cols='50'
                    value={description} 
                    onChange={this.onDescChange} 
                />

                <Button
                    onClickFunction={() => this.props.onSubmitFunction(name, description)}
                    title='Submit'
                    isEnabled={buttonEnebled}
                />
            </div>
        )
    }
}

export default NewSymptomForm;