import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as XLSX from "xlsx";
const DAY_IN_MONTHS = 30.4375;
const DAY_IN_YEARS = 365.25;
const MONTH_IN_YEARS = 12;
type LfaHeaderType = Record<
  | "Day"
  | "L"
  | "M"
  | "S"
  | "SD4neg"
  | "SD3neg"
  | "SD2neg"
  | "SD1neg"
  | "SD0"
  | "SD1"
  | "SD2"
  | "SD3"
  | "SD4",
  number
>;
type ChartDataType = {
  ageInDays: number;
  ageInMonths: number;
  ageInYears: number;
  sd3neg: number;
  sd2neg: number;
  sd1neg: number;
  sd0: number;
  sd1: number;
  sd2: number;
  sd3: number;
  l: number;
  s: number;
  m: number;
};
type ChildDataType = {
  name: string;
  ageInDays: number;
  ageInMonths: number;
  ageInYears: number;
  height: number;
};
// Colors for different percentiles
const colors = {
  sd3neg: "#ff5252", // Red for -3SD (0.1th percentile)
  sd2neg: "#ff9800", // Orange for -2SD (2.3rd percentile)
  sd1neg: "#ffeb3b", // Yellow for -1SD (16th percentile)
  sd0: "#4caf50", // Green for Median (50th percentile)
  sd1: "#2196f3", // Light blue for +1SD (84th percentile)
  sd2: "#3f51b5", // Blue for +2SD (97.7th percentile)
  sd3: "#9c27b0", // Purple for +3SD (99.9th percentile)
};

function computeZScoreLMS(X: number, L: number, M: number, S: number): number {
  if (L === 0) {
    return Math.log(X / M) / S; // Utilisation de la formule logarithmique pour L = 0
  }

  return (Math.pow(X / M, L) - 1) / (L * S);
}
function computeExtremeZScore(
  X: number,
  X3: number,
  X2: number,
  isAbove: boolean
): number {
  if (isAbove) {
    return 3 + (X - X3) / (X3 - X2);
  } else {
    return -3 + (X - X3) / (X2 - X3);
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [displayMode, setDisplayMode] = useState<"months" | "years">("months");
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [error, setError] = useState<string>("");
  const [childData, setChildData] = useState<ChildDataType[]>([]);
  const [childName, setChildName] = useState<string>("");
  const [childAge, setChildAge] = useState<number | null>(null);
  const [childHeight, setChildHeight] = useState<number | null>(null);
  // const [childZScore, setChildZScore] = useState("");
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${window.location.origin}/lfa/lhfa-boys-zscore-expanded-tables.xlsx`
        );
        const data = await response.arrayBuffer();
        const lfaWorkBook = XLSX.read(data, { type: "array" });
        const lfaSheetName = lfaWorkBook.SheetNames[0];
        const lfaSheet = lfaWorkBook.Sheets[lfaSheetName];
        const lfaData: LfaHeaderType[] = XLSX.utils.sheet_to_json(lfaSheet);
        // Process the data for the chart
        // We'll take data points at specific intervals to avoid overloading the chart
        const processedData: ChartDataType[] = [];
        const dayIntervals = displayMode === "months" ? 30 : 90; // Monthly or quarterly data points

        lfaData.forEach((row: LfaHeaderType, index) => {
          // Filter to reduce data points (monthly or quarterly)
          if (index % dayIntervals === 0 || index === lfaData.length - 1) {
            const ageInDays = row.Day;
            const ageInMonths = ageInDays / DAY_IN_MONTHS; // Approximate months
            const ageInYears = ageInDays / DAY_IN_YEARS; // Approximate years

            processedData.push({
              ageInDays,
              ageInMonths: parseFloat(ageInMonths.toFixed(1)),
              ageInYears: parseFloat(ageInYears.toFixed(2)),
              sd3neg: row.SD3neg,
              sd2neg: row.SD2neg,
              sd1neg: row.SD1neg,
              sd0: row.SD0, // Median
              sd1: row.SD1,
              sd2: row.SD2,
              sd3: row.SD3,
              l: row.L,
              m: row.M,
              s: row.S,
            });
          }
        });
        setChartData(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load WHO growth chart data");
        setLoading(false);
      }
    };
    loadData();
  }, [displayMode]);

  const calculateZScore = (age: number, height: number) => {
    // Find the closest age in our dataset
    const ageInDays =
      displayMode === "months" ? age * DAY_IN_MONTHS : age * DAY_IN_YEARS;
    const closestDataPoint = chartData.reduce((prev, curr) => {
      return Math.abs(curr.ageInDays - ageInDays) <
        Math.abs(prev.ageInDays - ageInDays)
        ? curr
        : prev;
    });

    // Calculate Z-score using the LMS method
    // Z = ((height / M)^L - 1) / (L * S)
    // Since L is 1 in this dataset, we can simplify to:
    // Z = (height - M) / (S * M)
    console.log(closestDataPoint);
    const z = computeZScoreLMS(
      height,
      closestDataPoint.l,
      closestDataPoint.m,
      closestDataPoint.s
    );
    console.log("Zscore value of is", z);
    // For this simplified visualization, we'll just check which percentile curves the height falls between
    if (height < closestDataPoint.sd3neg) return "< -3SD (severely stunted)";
    if (height < closestDataPoint.sd2neg)
      return "Between -3SD and -2SD (stunted)";
    if (height < closestDataPoint.sd1neg)
      return "Between -2SD and -1SD (low normal)";
    if (height < closestDataPoint.sd0)
      return "Between -1SD and median (normal)";
    if (height < closestDataPoint.sd1)
      return "Between median and +1SD (normal)";
    if (height < closestDataPoint.sd2) return "Between +1SD and +2SD (normal)";
    if (height < closestDataPoint.sd3) return "Between +2SD and +3SD (tall)";
    return "> +3SD (very tall)";
  };
  const addChildDataPoint = () => {
    if (childName && childAge && childHeight) {
      const ageValue = parseFloat(childAge.toFixed(1));
      const heightValue = parseFloat(childHeight.toFixed(1));

      // Convert age to days based on the current display mode
      let ageInDays;
      if (displayMode === "months") {
        ageInDays = ageValue * DAY_IN_MONTHS;
      } else {
        ageInDays = ageValue * DAY_IN_YEARS;
      }

      // Add the new data point
      const newDataPoint = {
        name: childName,
        ageInDays,
        ageInMonths:
          displayMode === "months" ? ageValue : ageValue * MONTH_IN_YEARS,
        ageInYears:
          displayMode === "years" ? ageValue : ageValue / MONTH_IN_YEARS,
        height: heightValue,
      };

      setChildData([...childData, newDataPoint]);

      // Reset form fields
      setChildName("");
      setChildAge(null);
      setChildHeight(null);
    }
  };
  const removeChildDataPoint = (index: number) => {
    const updatedData = [...childData];
    updatedData.splice(index, 1);
    setChildData(updatedData);
  };
  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === "months" ? "years" : "months");
  };
  if (loading) {
    return (
      <div className="p-8 text-center">Loading WHO growth chart data...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  return (
    <>
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Courbe de croissance de l'OMS: Taille debout/couchée pour âge
        </h2>

        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={toggleDisplayMode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Display in {displayMode === "months" ? "Years" : "Months"}
          </button>

          <div className="text-sm text-gray-600">
            <p>Length (0-24 months) / Height (2-5 years)</p>
          </div>
        </div>
        <div className="h-100 w-full mb-8">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis
                dataKey={
                  displayMode === "months" ? "ageInMonths" : "ageInYears"
                }
                label={{
                  value: `Age (${displayMode})`,
                  position: "insideTopRight",
                  offset: -20,
                }}
              />
              <YAxis
                domain={[40, 130]}
                label={{
                  value: "Length/Height (cm)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              {/* <Tooltip
                formatter={(value) => [
                  `${parseFloat(value.toString()).toFixed(1)} cm`,
                  "",
                ]}
                labelFormatter={(value) => `Age: ${value} ${displayMode}`}
              /> */}
              <Tooltip
                formatter={(value) => `${value} cm`}
                labelFormatter={(value) => `Age: ${value} ${displayMode}`}
              />
              <Legend />
              {/* Standard Deviation Lines */}
              <Line
                type="monotone"
                dataKey="sd3neg"
                name="-3SD (0.1%)"
                stroke={colors.sd3neg}
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sd2neg"
                name="-2SD (2.3%)"
                stroke={colors.sd2neg}
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sd1neg"
                name="-1SD (16%)"
                stroke={colors.sd1neg}
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sd0"
                name="Median (50%)"
                stroke={colors.sd0}
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sd1"
                name="+1SD (84%)"
                stroke={colors.sd1}
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sd2"
                name="+2SD (98%)"
                stroke={colors.sd2}
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sd3"
                name="+3SD (99.9%)"
                stroke={colors.sd3}
                dot={false}
                strokeWidth={2}
              />
              {/* Plot child data points */}
              {childData.map((child, index) => {
                return (
                  <Line
                    key={index}
                    type="monotone"
                    data={[
                      {
                        [displayMode === "months"
                          ? "ageInMonths"
                          : "ageInYears"]:
                          displayMode === "months"
                            ? child.ageInMonths
                            : child.ageInYears,
                        heigth: child.height,
                      },
                    ]}
                    dataKey="height"
                    name={`${child.name}`}
                    stroke="#000"
                    strokeWidth={0}
                    dot={{
                      r: 6,
                      fill: "#ff4081",
                      stroke: "#000",
                      strokeWidth: 0,
                    }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Child data input form */}
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Add Child Measurement</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Child's Name
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age ({displayMode === "months" ? "months" : "years"})
              </label>
              <input
                type="number"
                value={childAge as number}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className="w-full p-2 border rounded"
                placeholder={`Age in ${displayMode}`}
                min="0"
                max={displayMode === "months" ? "60" : "5"}
                step="0.1"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={childHeight as number}
                onChange={(e) => setChildHeight(Number(e.target.value))}
                className="w-full p-2 border rounded"
                placeholder="Height in cm"
                min="40"
                max="130"
                step="0.1"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addChildDataPoint}
                disabled={!childName || !childAge || !childHeight}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
              >
                Add Data Point
              </button>
            </div>
          </div>
        </div>

        {/* Child data display */}
        {childData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Child Measurements</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Age ({displayMode})</th>
                    <th className="py-2 px-4 border-b">Height (cm)</th>
                    <th className="py-2 px-4 border-b">Percentile Status</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {childData.map((child, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{child.name}</td>
                      <td className="py-2 px-4 border-b">
                        {displayMode === "months"
                          ? child.ageInMonths.toFixed(1)
                          : child.ageInYears.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">{child.height}</td>
                      <td className="py-2 px-4 border-b">
                        {calculateZScore(
                          displayMode === "months"
                            ? child.ageInMonths
                            : child.ageInYears,
                          child.height
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => removeChildDataPoint(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <h3 className="font-semibold mb-1">Interpreting the Chart:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              This chart shows WHO growth standards for girls aged 0-5 years.
            </li>
            <li>Length is measured for children 0-24 months (lying down).</li>
            <li>Height is measured for children 2-5 years (standing up).</li>
            <li>
              The different lines represent standard deviation scores
              (z-scores).
            </li>
            <li>Children below -2SD are considered stunted (short for age).</li>
            <li>Children below -3SD are considered severely stunted.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
