import React, {Component} from 'react';
import SearchOptions from './containers/SearchOptions'
import Button from './components/Button'
import Modal from './containers/Modal'
import NewSymptomForm from './containers/NewSymptomForm'
import NewDiseaseForm from './containers/NewDiseaseForm'
import Tooltip from './components/Tooltip'
import {fetchGet, fetchPost} from './scripts/tools'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    //setting initial state
    this.state = {
      route: 'symptoms',
      symptoms: [],
      matchedDiseases: [],
      diseaseSelected: false,
      selectedDiseaseIndex: -1,
      currentSymptoms: [],
      inputText: '',
      isNewSymptom: false,
      modalContent: '',
    }

    //getting all symptoms from the database for searching
    this.getSymptoms();
  }

  //function for retrieving the symptoms from the database
  getSymptoms = () => {
    fetchGet('getsymptoms', '', (resp) => {
      
      //updating the state on a successful retrieval of symptoms
      if(resp.success) this.setState({symptoms: resp.data})
      this.search.updateOptions(resp.data);
    });
  }

  //simple function for a route change on the site
  onRouteChange(route) {
    this.setState({route: route})
    if(route === 'symptoms') {
      this.setState({diseaseSelected: false})
    }
  }

  //updating the search field with filtered list
  onSearchChange = (value) => {
    const {symptoms} = this.state;

    this.setState({inputText: value})

    let filteredSymptoms = symptoms.filter((s) => {
      return s.name === value;
    });

    //checking to see if the imput text matched any existing symptoms
    if(!filteredSymptoms.length && value) {
      this.setState({isNewSymptom: true});
    }
    else {
      this.setState({isNewSymptom: false});
    }
  }

  //function for what happens when the add symptom button is pressed
  onAddButton = () => {
    const {symptoms, inputText, currentSymptoms} = this.state

    let matchedSymptoms = currentSymptoms;

    //parse through all symptoms 
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

  //handler for the create symptom button
  onCreateNewSymptom = () => {
    const {inputText} = this.state;

    //create the form
    let form = 
    <NewSymptomForm 
      title="Create New Symptom"
      name={inputText}
      onSubmitFunction={this.onSubmitNewSymptom}
    />

    //update the model content to be the form
    this.setState({modalContent: form}, this.modal.open);
  }

  //handler for the create disease button
  onCreateNewDisease = () => {

    //creating the form
    let form = 
    <NewDiseaseForm 
      title="Create New Disease"
      name={''}
      onSubmitFunction={this.onSubmitNewDisease}
    />

    //update the model content
    this.setState({modalContent: form}, this.modal.open);
  }

  //handler for the submit new disease button
  onSubmitNewDisease = (name, description) => {
    
    //creating the request body
    var body = {
      name: name,
      description: description
    }
    
    //requesting that the database create the disease
    fetchPost('createdisease', body, this.onCreateDisease);

    //closing the modal
    this.modal.close();
    this.setState({modalContent: <div></div>})
    
    //switching the site back to home
    this.onRouteChange('symptoms');
  }

  //callback for the create disease request
  onCreateDisease = (resp) => {
    const {currentSymptoms} = this.state;

    //getting the new diseases id for later use
    var disease_id = resp.data.id;

    var sList = [];

    //parse through all current symptoms
    for(let i=0; i<currentSymptoms.length; i++) {

      let sId = currentSymptoms[i].id;

      //for each symptom, create a list entry with id and dis id
      let sComp = [
        sId,
        disease_id
      ]

      //add to the list
      sList.push(sComp);
    }

    //creating the request body
    var body = {
      symptoms: sList,
      disease_id: disease_id
    }

    //request that the database link all symptoms to the newly created disease
    fetchPost('creatediseasesymptoms', body, (resp) => console.log(resp));
  }

  //handler for the submit new symptom button
  onSubmitNewSymptom = (name, description) => {
    const {currentSymptoms} = this.state;

    //create the request body
    let newS = {
      name: name,
      description: description
    }

    //request that the database make a new symptom
    fetchPost('createsymptom', newS, this.getSymptoms);

    //update the current symptoms on the site
    let newSymptoms = currentSymptoms;

    newSymptoms.push(newS);

    this.setState({currentSymptoms: newSymptoms});
    this.setState({isNewSymptom: false});

    //close the modal
    this.modal.close();
    this.setState({modalContent: <div></div>})

  }

  //handler for the diagnose button
  onDiagnoseButton = () => {
    const {currentSymptoms} = this.state;

    //creating the request body
    var body = {
      symptoms: currentSymptoms
    }

    //request that the database match the diseases
    fetchPost('getdiseases', body, (resp) => {

      this.setState({matchedDiseases: resp.data});
      this.onRouteChange('diseases');

      console.log(resp) //TEMP
    })
  }

  onConfirmDisease = () => {
    const {currentSymptoms, matchedDiseases, selectedDiseaseIndex} = this.state;

    //getting the new diseases id for later use
    var disease_id = matchedDiseases[selectedDiseaseIndex].id;
    console.log(matchedDiseases)

    var sList = [];

    //parse through all current symptoms
    for(let i=0; i<currentSymptoms.length; i++) {

      let sId = currentSymptoms[i].id;

      //for each symptom, create a list entry with id and dis id
      let sComp = [
        sId,
        disease_id
      ]

      //add to the list
      sList.push(sComp);
    }

    //creating the request body
    var body = {
      symptoms: sList,
      disease_id: disease_id
    }

    //request that the database link all symptoms to the newly created disease
    fetchPost('creatediseasesymptoms', body, (resp) => this.onRouteChange('symptoms'));
  }

  createDescription = (text) => {
    this.tooltip.setText(text);
    this.tooltip.toggle()
  }

  render() {
    const {symptoms, inputText, currentSymptoms,
          isNewSymptom, modalContent, route, matchedDiseases} = this.state;

    var currentScreen = <div></div>
    //switching the display based on route
    switch(route) {
      //symptoms screen
      case 'symptoms':
        var canAdd = (inputText.length)

        var processedSymptoms = '';
        var newSymptomButton = '';

        //add the new symptom options if available
        if(isNewSymptom) {
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

        //if there are symptoms to be displayed create the html objects to do so
        if(currentSymptoms.length) {
          processedSymptoms = currentSymptoms.map((s, i) => {
            let alt = (i % 2 === 0);
            return(
              <p 
                key={i}
                onMouseOver={() => this.createDescription(s.description)}
                onMouseOut={() => this.tooltip.toggle()}
                className={(alt)? 'list-symptom-0' : 'list-symptom-1'}
              >
                {s.name}
              </p>
            )
          });
        }
        else {
          processedSymptoms = <p>No symptoms selected! Add some using the search bar.</p>
        }
        //creating the symptoms screen
        currentScreen = 
        <div>
          <div>
              <p>Search Symptoms</p>

              <SearchOptions 
                options={symptoms} 
                onChange={this.onSearchChange}
                ref={(node) => {this.search = node}}
              />

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

            <Button 
              onClickFunction={this.onDiagnoseButton} 
              title='Diagnose Disease!'
              isEnabled={(processedSymptoms.length > 0)}
            />
          </div>
        break;

      //creating the diseases screen
      case 'diseases':
        const {selectedDiseaseIndex} = this.state;
        console.log(selectedDiseaseIndex)
        
        //map the matched diseases to display objects
        var diseaseDisplay = matchedDiseases.map((d, i) => {
          return(
            <div 
              key={i}
              className={(selectedDiseaseIndex === i)? 'disease-card disease-card-selected' : 'disease-card'}
              onMouseOver={() => this.createDescription(d.description)}
              onMouseOut={() => this.tooltip.toggle()}
              onClick={() => {
                this.setState({selectedDiseaseIndex: i})
                this.setState({diseaseSelected: true})
              }}
            >
              <p>Name: {d.name}</p>
              <p>Matched Symptoms: {d.count}</p>
            </div>
          )
        })

        //display a message if there are no matched diseases
        if(matchedDiseases.length <= 0) {
          diseaseDisplay = 
          <div className='grid cols2'>
            <p>No Diseases Matched!</p>
            <Button 
              onClickFunction={this.onCreateNewDisease} 
              title='Create New Disease'
              isEnabled={true}
            />
          </div>
        }
        
        //create the main screen structure
        currentScreen = 
        <div>
          <p>Matched Diseases:</p>
          <p>Please Select the Correct Disease</p>
          {diseaseDisplay}
          <Button 
              onClickFunction={() => this.onConfirmDisease()} 
              title='Confirm This Disease'
              isEnabled={this.state.diseaseSelected}
            />
          <p>Not the diseases you were looking for?</p>
          <Button 
              onClickFunction={this.onCreateNewDisease} 
              title='Create a New Disease'
              isEnabled={true}
            />
        </div>
        break;

      default:
        break;
    }

    //create the main app structure
    return(
      <div className="App">

        <p className='title'>E.T.M.D</p>

        <div className='app-body'>
          {currentScreen}
        </div>
        <Modal ref={(node) => {this.modal = node}}>
          {modalContent}
        </Modal>
        <Tooltip ref={(node) => {this.tooltip = node}} />
      </div>
    );
  }
}

export default App;
