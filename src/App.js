import React, {Component} from 'react';
import SearchOptions from './containers/SearchOptions'
import Button from './components/Button'
import './App.css';

const temp = [
 {name: 'coughing'},
 {name: 'breathing impairement'},
 {name: 'fever'},
 {name: 'pain'},
 {name: 'bleeding eyes'},
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      symptoms: temp,
      currentSymptoms: [],
      inputText: '',
      newSymptom: false,
    }
  }

  onSearchChange = (value) => {
    const {symptoms} = this.state;
    this.setState({inputText: value})
    let filteredSymptoms = symptoms.filter((s) => {
      return s.name === value;
    });

    if(!filteredSymptoms.length && value) {
      this.setState({newSymptom: true});
    }
    else {
      this.setState({newSymptom: false});
    }
  }

  onAddButton = () => {
    const {symptoms, inputText, currentSymptoms} = this.state

    let matchedSymptoms = currentSymptoms;

    for(let i=0; i<symptoms.length; i++) {

      let s = symptoms[i];

      if(s.name === inputText) {
        var add = true;
        for(let i=0; i<currentSymptoms.length; i++) {
          let olds = currentSymptoms[i];
          if(s.name === olds.name) add = false;
        }
        if (add) matchedSymptoms.push(s);
      }
    }

    this.setState({currentSymptoms: matchedSymptoms});
  }

  onCreateNewSymptom = () => {

  }

  render() {
    const {symptoms, inputText, currentSymptoms, newSymptom} = this.state;

    var canAdd = (inputText.length)
    var processedSymptoms = '';
    var newSymptomButton = '';
    if(newSymptom) {
      newSymptomButton = 
      <div className='grid cols2'>
        <p>No matched symptoms available!</p>
        <Button 
          onClickFunction={this.onCreateNewSymptom} 
          title='Create New Symptom'
          isEnabled={true}
        />
      </div>
    }


    if(currentSymptoms.length) {
      processedSymptoms = currentSymptoms.map((s, i) => {
        return(
          <p key={i}>{s.name}</p>
        )
      });
    }
    else {
      processedSymptoms = <p>No symptoms selected! Add some using the search bar.</p>
    }

    return(
      <div className="App">

        <p className='title'>E.T.M.D</p>

        <div className='app-body'>
          <div>
            <SearchOptions options={symptoms} onChange={this.onSearchChange} />
            <Button 
              onClickFunction={this.onAddButton} 
              title='Add to Symptom List'
              isEnabled={canAdd}
            />
          </div>
          {newSymptomButton}
          <div>
            <p>Current Symptoms:</p>
            {processedSymptoms}
          </div>
          
        </div>
      </div>
    );
  }
}

export default App;
