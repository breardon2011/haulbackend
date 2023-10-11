import express from "express";
import cors from "cors"
import { getVehicleAndInspections, getVehicle, getInspection, getUniqueBasicValues, listInspections, listTable, listVehicles, listViolations } from "./operations.js";
import { loadData } from "./start.js";


const app = express(); 

app.use(cors({
    origin: 'http://localhost:3000',
  }));
  


const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.get("/inspections", async (req, res) => {
    const inspections = await listTable();
    res.send(inspections);
  });



app.get("/inspections_raw", async (req, res) => {
    const inspections = await listInspections();
    res.send(inspections);
  });

app.get("/inspections/:id", async (req, res) => {
    const inspectionId = req.params.id
    const inspection = await getInspection(inspectionId);
    res.send(inspection);
});

app.get("/vehicles", async (req,res)=> { 
    const vehicles = await listVehicles(); 
    res.send(vehicles)
})

app.get("/vehicles/:id", async (req, res) => {
    const vehicleId = req.params.id
    const vehicle = await getVehicleAndInspections(vehicleId)
    res.send(vehicle)
})

app.get("/violations", async (req, res) => {
    const violations = await listViolations(); 
    res.send(violations)
})

app.get("/basic", async(req, res) => {
    const uniqueBasicValues = await getUniqueBasicValues()
    res.send(uniqueBasicValues)
})

