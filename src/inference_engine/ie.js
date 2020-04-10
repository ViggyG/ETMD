//this would normally exist with a package.json in a typical node setup.

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

//initial setup
const portnum = 3001;

const app = express();

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cors());

const defaultRespData = () => {
    return (
        {
            data: null,
            success: "",
            error: ""
        }
    )
}

//creating the sql connection
connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'Happy@TheDatabase234',
    database: 'etmddb'
});

connection.connect((err) => {
    if(err) throw err;
})

//route for retrieving the symptoms from the database
app.get('/getsymptoms', (req, resp) => {
    var respData = defaultRespData();

    //query construction
    var q = "CALL get_symptoms";

    //query database
    connection.query(q, (err, res) => {
        
        if(err) {
            //on error return error
            respData.error = "failed to get symptoms";
            console.log(err);
            resp.json(respData);
        }
        else{
            //return data on success
            respData.success = "Symptoms have been found!"
            respData.data = res[0];
            resp.json(respData);
        }
    })
})

//route for creating a new symptom
app.post('/createsymptom', (req, resp) => {
    //this function follows the exact structure of the previous one
    const {name, description} = req.body;

    var respData = defaultRespData();

    var q = `CALL create_symptom('${name}','${description}')`;

    connection.query(q, (err, res) => {
        console.log(res);
        if(err) {
            respData.error = "failed to create symptom";
            console.log(err);
            resp.json(respData);
        }
        else{
            respData.success = "Symptom has been created."
            resp.json(respData);
        }
    })
});

//route for linking a set of symptoms to a disease
app.post('/creatediseasesymptoms', (req, resp) => {
    //retrieve symptoms and disease id
    const symptoms = req.body.symptoms;
    const disease_id = req.body.disease_id

    var respData = defaultRespData();

    //first remove symptoms from the id
    connection.query(`CALL delete_disease_symptoms(${disease_id});`, (err, res) => {
        if(err) {
            console.log(err)
            resp.error = 'failed to delete symptoms'
            resp.json(respData);
        }
        else {
            //then insert the updated list from the request
            var q = `INSERT INTO disease_symptoms(symptom_id, disease_id) VALUES ?`;
            connection.query(q, [symptoms], (err, res) => {
                console.log(res);
                if(err) {
                    respData.error = "failed to link symptom";
                    console.log(err);
                    resp.json(respData);
                }
                else{
                    respData.success = "Symptoms have been linked."
                    resp.json(respData);
                }
            })
        }
    })
    
});

//route for creating a disease
app.post('/createdisease', (req, resp) => {
    const {name, description} = req.body;

    var respData = defaultRespData();

    var q = `CALL create_disease('${name}','${description}');`;

    connection.query(q, (err, res) => {
        console.log(res);

        if(err) {
            respData.error = "failed to create symptom";
            console.log(err);
            resp.json(respData);
        }
        else{
            respData.success = "Symptom has been created."
            respData.data = res[0][0];
            resp.json(respData);
        }
    })
})

//route for diagnosing a disease based on a set of symptoms
//this is the Inference Engine for the system.
app.post('/getdiseases', (req, resp) => {
    //get the set of symptoms 
    const {symptoms} = req.body;

    var respData = defaultRespData();

    //simple control object for keeping track of progress through the list
    var controller = {
        total: symptoms.length,
        numProcessed: 0,
    }

    //the results list to be sent when finished
    var diseaseResults = []

    //iterate through the symptoms list
    for(let i=0; i<symptoms.length; i++) {

        let symptom = symptoms[i].name; //select symptom name

        var q = `CALL get_diseases_by_symptom('${symptom}')`; //query construction

        //get diseases based on the symptom
        connection.query(q, (err, res) => {
            const {total} = controller;

            var diseases = res[0]; //retrieve the list of results

            if(err) {
                //return error if there is one
                respData.error = "Disease Analysis failed"
                console.log(err);
            } else {

               respData.success = 'Disease Analysis Successful!'; //update message

               //iterate through the found diseases
               for(let i=0; i<diseases.length; i++) {

                    //get disease data
                    var disease = diseases[i].disease_name;
                    var description = diseases[i].description;
                    var disease_id = diseases[i].disease_id;

                    var foundIndex = -1; 

                    //iterate through disease results
                    for(let j=0; j<diseaseResults.length; j++) {
                        //if the current disease matches one already found update the found index
                        if(disease === diseaseResults[j].name) {
                            foundIndex = j;
                        }
                    }

                    if(foundIndex === -1) {
                        //if a disease was not found create a new one with default parameters
                        diseaseResults.push({
                            name: disease,
                            description: description,
                            id: disease_id,
                            count: 1
                        })
                    }
                    else {
                        //if a disease was found update the count of matched symptoms
                        diseaseResults[foundIndex].count++;
                    }
               }
            }

            console.log(diseaseResults);

            //update the controller
            controller.numProcessed++;

            //finish and respond only when all symptoms have been processed
            if(controller.numProcessed === total) {
                respData.data = diseaseResults;
                resp.json(respData);
            }
        });
    }
})

//start server
app.listen(portnum, ()=>{
    console.log("App live on port: "+portnum);
})