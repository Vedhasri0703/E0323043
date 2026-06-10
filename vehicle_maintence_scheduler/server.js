import express from "express";
import axios from "axios";
import {scheduleVehicles} from "./scheduler.js";

const app = express();

const PORT = 3000;

async function getToken() {
    try {
        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/auth",
            {
                email: "vedhakumar0665@gmail.com",
                name: "VEDHASRI K",
                rollNo: "E0323043",
                accessCode: "DvwEDZ",
                clientID: "06e47df1-a2b6-4162-b7c5-74fad2c252f7",
                clientSecret: "vxBFyyQDxGaPFrnk"
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.log("Token Error:",error.response?.data || error.message);
        throw error;
    }
}

async function getDepots(token) {
    try {
        const response = await axios.get(
        "http://4.224.186.213/evaluation-service/depots",
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        return response.data.depots;
    } catch (error) {
        console.log("Depot Error:",error.response?.data || error.message);
        throw error;
    }
}

async function getVehicles(token) {
  try {
    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/vehicles",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.vehicles;
  } catch (error) {
    console.log("Vehicle Error:", error.response?.data || error.message);
    throw error;
  }
}


app.get("/schedule", async (req, res) => {
    try {
        console.log("Getting Token...");
        const token = await getToken();

        console.log("Fetching Depots...");
        const depots = await getDepots(token);

        console.log("Fetching Vehicles...");
        const vehicles = await getVehicles(token);

        const schedules = [];

        for (const depot of depots) {
            console.log(`Processing Depot ${depot.ID}`);

            const result = scheduleVehicles(vehicles, depot.MechanicHours);

            schedules.push({
                depotId: depot.ID,
                mechanicHours:depot.MechanicHours,
                totalImpact:result.maxImpact,
                totalTasks:result.selectedTasks.length,
                selectedTasks:result.selectedTasks,
            });
        }

        return res.json({
            success: true,
            totalDepots:
            schedules.length,
            schedules,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error:
                error.response?.data ||
                error.message,
            });
        }
    }
);

app.get("/", (req, res) => {
  res.json({
    message:
      "Vehicle Maintenance Scheduler Running",
  });
});

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});