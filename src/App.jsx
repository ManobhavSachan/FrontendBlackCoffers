import { useState, useEffect } from "react";
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

  const [filters, setFilters] = useState({
    endYear: "",
    topics: "",
    sector: "",
    region: "",
    pest: "",
    source: "",
    swot: "",
    country: "",
  });

  // Function to handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value == "All" ? "" : value,
    }));
  };

  const handleSelectChange = (option, name) => {
    handleFilterChange(name, option);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backend-black-coffers.onrender.com/api/filters"
        );
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://backend-black-coffers.onrender.com/api/data",
          filters
        );
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
  }, [filters]);

  const createDataObject = (responseData, property) => {
    const data = [];
    responseData.forEach((item) => {
      let propertyValue = item[property];
      if (propertyValue == "") {
        propertyValue = "Others";
      }
      const existingDataObject = data.find(
        (obj) => obj[property] === propertyValue
      );

      if (existingDataObject) {
        existingDataObject.frequency++;
      } else {
        data.push({
          [property]: propertyValue,
          frequency: 1,
        });
      }
    });
    data.sort((a, b) => a[property] - b[property]);
    return { data };
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="flex justify-center space-x-4">
          {apiData.distinctEndYears && (
            <SelectMenu
              title="End Year"
              options={apiData.distinctEndYears}
              onSelectChange={(e) => handleSelectChange(e, "endYear")}
            />
          )}

          {apiData.distinctTopics && (
            <SelectMenu
              title="Topics"
              options={apiData.distinctTopics}
              onSelectChange={(e) => handleSelectChange(e, "topics")}
            />
          )}

          {apiData.distinctSectors && (
            <SelectMenu
              title="Sector"
              options={apiData.distinctSectors}
              onSelectChange={(e) => handleSelectChange(e, "sector")}
            />
          )}

          {apiData.distinctRegions && (
            <SelectMenu
              title="Region"
              options={apiData.distinctRegions}
              onSelectChange={(e) => handleSelectChange(e, "region")}
            />
          )}
        </div>
        <div className="flex justify-center space-x-4 pt-2">
          {apiData.distinctPESTs && (
            <SelectMenu
              title="PEST"
              options={apiData.distinctPESTs}
              onSelectChange={(e) => handleSelectChange(e, "pest")}
            />
          )}

          {apiData.distinctSources && (
            <SelectMenu
              title="Source"
              options={apiData.distinctSources}
              onSelectChange={(e) => handleSelectChange(e, "source")}
            />
          )}

          {apiData.distinctSWOTs && (
            <SelectMenu
              title="Country"
              options={apiData.distinctSWOTs}
              onSelectChange={(e) => handleSelectChange(e, "country")}
            />
          )}
        </div>
        <div className="flex justify-center space-x-4 pt-10">
          {likelihood.data && (
            <BarChart
              data={likelihood}
              xlabel="Likelihood"
              ylabel="Frequency"
              keyword="likelihood"
              rotate={false}
              title="Likelihood Chart"
            />
          )}
          {relevance.data && (
            <BarChart
              data={relevance}
              xlabel="Relevance"
              ylabel="Frequency"
              keyword="relevance"
              title="Relevance Chart"
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
              title="Intensity Chart"
            />
          )}
          {year.data && (
            <BarChart
              data={year}
              xlabel="Year"
              ylabel="Frequency"
              keyword="end_year"
              title="Year Chart"
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
              title="Country Chart"
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
              title="Topics Chart"
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
              title="Region Chart"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
