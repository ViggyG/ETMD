import React, {Component} from 'react'
import Button from '../components/Button'
import './Modal.css'

//class for popup forms 
class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    //close the modal
    close = () => {
        this.setState({isOpen: false});
    }

    //open the modal so content is rendered
    open = () => {
        this.setState({isOpen: true});
    }

    render() {
        const {isOpen} = this.state;

        const style = (isOpen)? 'modal-open' : 'modal-closed';

        return(
            <div className={style}>
                <div className='modal-content'>
                    
                    <div className="modal-options">
                        <Button 
                            onClickFunction={this.close}
                            title="Close"
                            isEnabled={true}
                        />
                    </div>
                    
                    {this.props.children}
                </div>
                
                
            </div>
        )
    }
}

export default Modal;