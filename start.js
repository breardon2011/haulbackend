import { promises as fsPromises } from 'fs'
import xml2js from "xml2js";
import { Inspection, Vehicle, Violation } from './models.js';


const filepath = './data.xml'; 

export const loadData = async () => {
    try {
      const xmlData = await fsPromises.readFile(filepath, 'utf8');
      
      const data = await parseXml(xmlData);
      console.log(data);
         
      const inspections = data.carrierData.inspections[0].inspection; 

      inspections.forEach( async (inspection) => {

        const existingInspection = await Inspection.findOne({
            where: {
              report_number: inspection.$.report_number,
            },
          });
        
          if (existingInspection) {
            console.log('Inspection already exists:', inspection.$.report_number);
            return;
          }

        const vehiclesArray = await returnVehicleArray(inspection.vehicles[0].vehicle);
        const violationsArray = await returnViolationArray(inspection.violations[0].violation);
        
        const inspectionData = {
           "inspection_date": inspection.$.inspection_date,
           "report_state": inspection.$.report_state, 
           "report_number": inspection.$.report_number, 
           "level": inspection.$.level,
           "time_weight": inspection.$.time_weight,
           "Placarable_HM_Veh_Insp": inspection.$.Placarable_HM_Veh_Insp, 
           "HM_inspection" : inspection.$.HM_inspection, 
           "status": returnStatus(violationsArray),

        }

        console.log(inspectionData)
        const newInspection = await Inspection.create(inspectionData) 

        vehiclesArray.forEach( async (vehicle) => {
            const newVehicle = await Vehicle.create(vehicle)
            await newInspection.addVehicle(newVehicle)
        })

        violationsArray.forEach( async (violation) => {
            const newViolation = await Violation.create(violation)
            await newInspection.addViolation(newViolation)
        })
      });
      

    } catch (err) {
      console.error('Error reading or parsing the XML file:', err);
    }
};

async function parseXml(xmlData){
    const parser = new xml2js.Parser();

    const parsedData = await parser.parseStringPromise(xmlData); 

    return parsedData;
}

function returnStatus(violationsArray){
    if(violationsArray.length == 0){
        return "No Violation"
    }else{
        return "Unresolved"
    }
}

async function returnVehicleArray(vehicles){
    const vehiclesArray = []

    const filteredVehicles = vehicles.filter((vehicle) => {
        const vehicleAttributes = vehicle['$'];
        return vehicleAttributes.hasOwnProperty('vehicle_id_number');
      });
    for (const vehicle of filteredVehicles) {
        const vehicleObject= vehicle['$'];

        vehiclesArray.push(vehicleObject)
      
    }

    return vehiclesArray

}
// could be refactored to parameterize property, one function
async function returnViolationArray(violations){
    const violationArray = []

    const filteredViolations = violations.filter((violation) => {
        const violationAttributes = violation['$']
        return violationAttributes.hasOwnProperty('BASIC')
    })

    for(const violation of filteredViolations){
        const violationObject = violation['$']
        violationArray.push(violationObject)
    }

    return violationArray

}

loadData();