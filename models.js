import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Inspection = sequelize.define('Inspection', {
    inspection_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    report_state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    report_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Placarable_HM_Veh_Insp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HM_inspection: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING, 
      allowNull: false,
    }
  });



export const Vehicle = sequelize.define('Vehicle', {
    unit: {
      type: DataTypes.INTEGER,
    },
    vehicle_id_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_type: {
      type: DataTypes.STRING,
    },
    license_state: {
      type: DataTypes.STRING,
    },
    license_number: {
      type: DataTypes.STRING,
    },
});


export const Violation = sequelize.define('Violation', {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time_severity_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BASIC: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    convicted_of_dif_charge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
});







Inspection.belongsToMany(Vehicle, { through: 'InspectionVehicles', foreignKey: 'InspectionId',});
Inspection.belongsToMany(Violation, { through: 'InspectionViolation' });



Vehicle.belongsToMany(Inspection, {
    through: 'InspectionVehicles',
    foreignKey: 'VehicleId', 
  });


Violation.belongsToMany(Inspection, { through: 'InspectionViolation' });

await Inspection.sync()//create tables 
await Vehicle.sync() 
await Violation.sync() 
await sequelize.sync()

