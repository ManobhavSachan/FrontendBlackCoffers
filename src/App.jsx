import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import SelectMenu from "./components/SelectMenu";
import BarChart from "./components/BarChart";
import axios from "axios";
import "./index.css";

function App() {
  // const data = {
  //   data: [
  //     { letter: "A", frequency: 0.08167 },
  //     { letter: "B", frequency: 0.01492 },
  //     { letter: "C", frequency: 0.02782 },
  //     { letter: "D", frequency: 0.04253 },
  //     { letter: "E", frequency: 0.12702 },
  //     { letter: "F", frequency: 0.02288 },
  //     { letter: "G", frequency: 0.02015 },
  //     { letter: "H", frequency: 0.06094 },
  //     { letter: "I", frequency: 0.06966 },
  //     { letter: "J", frequency: 0.00153 },
  //     { letter: "K", frequency: 0.00772 },
  //     { letter: "L", frequency: 0.04025 },
  //     { letter: "M", frequency: 0.02406 },
  //     { letter: "N", frequency: 0.06749 },
  //     { letter: "O", frequency: 0.07507 },
  //     { letter: "P", frequency: 0.01929 },
  //     { letter: "Q", frequency: 0.00095 },
  //     { letter: "R", frequency: 0.05987 },
  //     { letter: "S", frequency: 0.06327 },
  //     { letter: "T", frequency: 0.09056 },
  //     { letter: "U", frequency: 0.02758 },
  //     { letter: "V", frequency: 0.00978 },
  //     { letter: "W", frequency: 0.0236 },
  //     { letter: "X", frequency: 0.0015 },
  //     { letter: "Y", frequency: 0.01974 },
  //     { letter: "Z", frequency: 0.00074 },
  //   ],
  //   // columns: ["letter", "frequency"],
  // };
  const [intensity, setIntensity] = useState({});
  const [likelihood, setLikelihood] = useState({});
  const [relevance, setRelevance] = useState({});
  const [year, setYear] = useState({});
  const [country, setCountry] = useState({});
  const [topics, setTopics] = useState({});
  const [region, setRegion] = useState({});
  const [city, setCity] = useState({});
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://backend-black-coffers.onrender.com/api/data",
          {
            // Your filter parameters go here
            // end_ear: 2023,
            // region: "Western Africa",
            // Add other parameters as needed
          }
        );

        setApiData(response.data);
        setIntensity(createDataObject(response.data, "intensity"));
        setLikelihood(createDataObject(response.data, "likelihood"));
        setRelevance(createDataObject(response.data, "relevance"));
        setYear(createDataObject(response.data, "end_year"));
        setCountry(createDataObject(response.data, "country"));
        setTopics(createDataObject(response.data, "topic"));
        setRegion(createDataObject(response.data, "region"));
        setCity(createDataObject(response.data, "city"));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []); // Empty dependency array to execute the effect only once when the component mounts

  const createDataObject = (responseData, property) => {
    // Create an array to store the data
    const data = [];

    // Iterate through the response data
    responseData.forEach((item) => {
      const propertyValue = item[property];

      const existingDataObject = data.find(
        (obj) => obj[property] === propertyValue
      );

      if (existingDataObject) {
        // If the data object is present, update its frequency value
        existingDataObject.frequency++;
      } else {
        // If the data object is not present, create a new one
        data.push({
          [property]: propertyValue,
          frequency: 1, // Set the initial frequency to 1
        });
      }
    });
    data.sort((a, b) => a[property] - b[property]);
    console.log("ans", { data });
    // setTest({data});
    return { data };
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="flex justify-center space-x-4">
          <SelectMenu title="End Year" />
          <SelectMenu title="Topic" />
          <SelectMenu title="Sector" />
          <SelectMenu title="Region" />
        </div>
        <div className="flex justify-center space-x-4 pt-2">
          <SelectMenu title="Pestle" />
          <SelectMenu title="Source" />
          <SelectMenu title="Country" />
        </div>
        <div className="flex justify-center space-x-4 pt-2">
          
          {likelihood.data && (
            <BarChart
              data={likelihood}
              xlabel="Likelihood"
              ylabel="Frequency"
              keyword="likelihood"
              rotate={false}
            />
          )}
          {relevance.data && (
            <BarChart
              data={relevance}
              xlabel="Relevance"
              ylabel="Frequency"
              keyword="relevance"
            />
          )}
        </div>
        <div className="flex justify-center space-x-4 pt-2">
        {intensity.data && (
            <BarChart
              data={intensity}
              xlabel="Intensity"
              ylabel="Frequency"
              keyword="intensity"
            />
          )}
          {year.data && (
            <BarChart
              data={year}
              xlabel="Year"
              ylabel="Frequency"
              keyword="end_year"
            />
          )}
          
        </div>
        <div className="flex justify-center space-x-4 pt-2">
        {country.data && (
            <BarChart
              data={country}
              xlabel="Country"
              ylabel="Frequency"
              keyword="country"
              rotate={true}
            />
          )}
          </div>
          <div className="flex justify-center space-x-4 pt-2">
          {topics.data && (
            <BarChart
              data={topics}
              xlabel="Topics"
              ylabel="Frequency"
              keyword="topic"
              rotate={true}
            />
          )}
          </div>
        <div className="flex justify-center space-x-4 pt-2">
          {region.data && (
            <BarChart
              data={region}
              xlabel="Region"
              ylabel="Frequency"
              keyword="region"
              rotate={true}
            />
          )}
        </div>
      </div>

      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
    </>
  );
}

export default App;
