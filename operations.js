import { Inspection, Vehicle, Violation } from "./models.js";

const formatDate = (date) => { 
    const newDate = new Date(date)
    const formattedDate = newDate.toLocaleDateString("en-US");

    return formattedDate
}
export const listInspections = () => { 
   return Inspection.findAll({
        include: [Vehicle,Violation]
    })

}

export const listTable = async () => { 
    const inspections = await Inspection.findAll({
        include: [Vehicle,Violation]
    })

    return inspections.map(inspection => {
        // Safely get the unique BASIC values
        const uniqueBASIC = inspection.Violations && Array.isArray(inspection.Violations) 
            ? [...new Set(inspection.Violations.map(v => v.BASIC))]
            : [];
    
        // Safely get the license_number
        const licenseNumber = inspection.Vehicles && Array.isArray(inspection.Vehicles) && inspection.Vehicles[0]
            ? inspection.Vehicles[0].license_number
            : null;
    
        return {
            id: inspection.id,
            inspection_date: formatDate(inspection.inspection_date),
            status: inspection.status,
            report_number: inspection.report_number,
            license_number: licenseNumber,
            time_weight: inspection.time_weight,
            BASIC: uniqueBASIC.join(', '), 
        };
    });
    


}

export const getInspection = async (id) => { 
    return Inspection.findByPk(id, {
        include: [Vehicle,Violation]
    })
}

export const getVehicle = async (id) => { 
    return Vehicle.findByPk(id)
}

export const getVehicleAndInspections = async (id) => {

    const vehicle = await Vehicle.findOne({
        where: {
            id: id
        },
        include: {
            model: Inspection,
            through: {
                attributes: [], // this ensures that the through-table attributes are not returned in the result
            }
        }
    });

    return vehicle
}

export const listViolations = () => {
    return Violation.findAll() 
}

export const listVehicles = () => { 
    return Vehicle.findAll()
}


export const getUniqueBasicValues = async () => {
    const violations = await Violation.findAll();

    const uniqueBasicValues = new Set();
  
    for (const violation of violations) {
      uniqueBasicValues.add(violation.BASIC);
    }
  
    return Array.from(uniqueBasicValues);
  };
  