import React, { useState } from "react";
import Modal from "react-modal";

const ArrivalService = () => {
    const [arrivalRate, setArrivalRate] = useState(null);
    const [serviceRate, setServiceRate] = useState(null);
    const [cpValues, setCpValues] = useState([]);
    const [cpLookupTable, setCpLookupTable] = useState([]);
    const [interArrivalTimes, setInterArrivalTimes] = useState([]);
    const [arrivalTimes, setArrivalTimes] = useState([]);
    const [serviceTimes, setServiceTimes] = useState([]);
    const [tableGenerated, setTableGenerated] = useState(false);
    const [isOpen, setIsOpen] = useState(true);


    const handleArrivalRateChange = (e) => {
        setArrivalRate(e.target.value);
    };
    const handleServiceRateChange = (e) => {
        setServiceRate(e.target.value);
    };

    const saveValues = () => {
        const lambda = parseFloat(arrivalRate);
        if (isNaN(lambda) || lambda <= 0) {
            alert("Please enter a valid positive arrival rate (λ).");
            return;
        }

        let x = 0;
        let cumulativeProbability = 0;
        const calculatedCpValues = [];
        const calculatedCpLookupTable = [];

        while (cumulativeProbability < 0.9999999) {
            const factorial = calculateFactorial(x);
            const probability = (Math.exp(-lambda) * Math.pow(lambda, x)) / factorial;
            cumulativeProbability += probability;
            calculatedCpValues.push({ x, cumulativeProbability });
            calculatedCpLookupTable.push(cumulativeProbability);
            x++;
        }

        calculatedCpLookupTable.unshift(0);

        setCpValues(calculatedCpValues);
        setCpLookupTable(calculatedCpLookupTable);

        setIsOpen(false)
    };
    const generatePriorityTable = () => {
        const iATime = [];
        let previousArrivalTime = 0;

        for (let i = 0; i < cpLookupTable.length; i++) {
            const randomIndex = Math.floor(Math.random() * cpLookupTable.length);
            iATime.push(randomIndex);
        }
        setInterArrivalTimes(iATime);

        const arrivalTimes = iATime.map((value) => {
            const currentInterArrivalTime = value;
            const arrivalTime = previousArrivalTime + currentInterArrivalTime;
            previousArrivalTime = arrivalTime;
            return arrivalTime;
        });

        setArrivalTimes(arrivalTimes);


        const serTime = []
        for (let i = 0; i < cpLookupTable.length; i++) {
            const serviceTime = Math.ceil((-serviceRate) * Math.log(Math.random()))
            serTime.push(serviceTime);
        }
        setServiceTimes(serTime);
        setTableGenerated(true)

    }

    const calculateFactorial = (n) => {
        if (n === 0) return 1;
        let factorial = 1;
        for (let i = 1; i <= n; i++) {
            factorial *= i;
        }
        return factorial;
    };
    // Calculate Utilization Factor (ρ)
    const utilizationFactor = parseFloat(arrivalRate) / parseFloat(serviceRate);

    // Calculate Average Time a Customer Spends in the System (W)
    const avgTimeInSystem = (utilizationFactor > 0) ? 1 / (parseFloat(serviceRate) - parseFloat(arrivalRate)) : 0;

    // Calculate Average Time a Customer Spends Waiting in the Queue (Wq)
    const avgTimeInQueue = (utilizationFactor > 0) ? avgTimeInSystem - 1 / parseFloat(serviceRate) : 0;

    // Calculate Average Number of Customers in the Queue (Lq)
    const avgCustomersInQueue = parseFloat(arrivalRate) * avgTimeInQueue;

    // Calculate Average Number of Customers in the System (L)
    const avgCustomersInSystem = parseFloat(arrivalRate) * avgTimeInSystem;


    return (
        <div className="text-white flex flex-col items-center justify-center ">
            <Modal
                isOpen={isOpen}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
            >
                <div className="bg-[#393939] w-1/2 rounded-lg p-8 text-center flex flex-col justify-center items-center">
                    <h2 className="text-2xl font-bold mb-4">Enter arrival and service rate</h2>
                    <input
                        type="number"
                        placeholder="Arrival Rate"
                        value={arrivalRate}
                        onChange={handleArrivalRateChange}
                        className="w-[150px] block mx-auto py-2 px-3 border text-black border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="number"
                        placeholder="Service Rate"
                        value={serviceRate}
                        onChange={handleServiceRateChange}
                        className="w-[150px] block mx-auto py-2 px-3 border text-black border-gray-300 rounded-md mb-4"
                    />
                    <button
                        onClick={saveValues} // Call the function to generate the table
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-40"
                    >
                        Save values
                    </button>
                </div>
            </Modal>
            <h1 className="text-3xl font-bold py-8 text-center">Random Service and Arrival Generator</h1>
            {!tableGenerated && ( // Render the button only if the table has not been generated
                <button
                    onClick={generatePriorityTable} // Call the function to generate the table
                    className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-40"
                >
                    Generate
                </button>)}

            {tableGenerated && (

                <div>

                    <div>

                        <p>Utilization Factor (ρ): <span className="text-blue-500">  {utilizationFactor.toFixed(6)} </span></p>
                        <p>Average Time a Customer Spends in the System (W):  <span className="text-blue-500"> {avgTimeInSystem.toFixed(6)}</span></p>
                        <p>Average Time a Customer Spends Waiting in the Queue (Wq): <span className="text-blue-500">  {avgTimeInQueue.toFixed(6)}</span> </p>
                        <p>Average Number of Customers in the Queue (Lq):  <span className="text-blue-500"> {avgCustomersInQueue.toFixed(6)}</span></p>
                        <p>Average Number of Customers in the System (L):  <span className="text-blue-500"> {avgCustomersInSystem.toFixed(6)}</span></p>
                    </div>

                    <table className="border-collapse w-full mt-4 mb-7">
                        <thead>
                            <tr>
                                <th className="border text-blue-500 border-gray-300 p-2" >S.no#</th>
                                <th className="border text-blue-500 border-gray-300 p-2">Cumulative Probability (Cp)</th>
                                <th className="border text-blue-500 border-gray-300 p-2">Cp Lookup</th>
                                <th className="border text-blue-500 border-gray-300 p-2">Avg Time Between Arrivals</th>
                                <th className="border text-blue-500 border-gray-300 p-2">Inter Arrival Time</th>
                                <th className="border text-blue-500 border-gray-300 p-2">Arrival Time</th>
                                <th className="border text-blue-500 border-gray-300 p-2">Service Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cpValues.map((value, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{value.x + 1}</td>
                                    <td className="border border-gray-300 p-2">{value.cumulativeProbability.toFixed(6)}</td>
                                    <td className="border border-gray-300 p-2">{cpLookupTable[index].toFixed(6)}</td>
                                    <td className="border border-gray-300 p-2">{value.x}</td>
                                    <td className="border border-gray-300 p-2">{interArrivalTimes[index] || 0}</td>
                                    <td className="border border-gray-300 p-2">{arrivalTimes[index] || 0}</td>
                                    <td className="border border-gray-300 p-2">{serviceTimes[index] || 1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );

};

export default ArrivalService;
