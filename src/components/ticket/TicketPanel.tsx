import React, { useEffect, useState } from "react";
import { ChevronDown, Search, MapPin, Users } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TicketPanelProps {
  initialLongDescription?: string;
  initialShortDescription?: string;
  apiUrl?: string;
}

const TicketPanel: React.FC<TicketPanelProps> = ({
  initialLongDescription,
  initialShortDescription,
  apiUrl = "https://api-config.amsgenius.com/api/create-ticket",
}) => {
  const [priority, setPriority] = useState("");
  const [module, setModule] = useState("");
  const [location, setLocation] = useState("");
  const [impact, setImpact] = useState("");
  const [urgency, setUrgency] = useState("");
  const [chatScope, setChatScope] = useState("");
  const [shortDescription, setShortDescription] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [assignmentGroup, setAssignmentGroup] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationList, setShowLocationList] = useState(false);
  const [assignmentSearch, setAssignmentSearch] = useState("");
  const [showAssignmentList, setShowAssignmentList] = useState(false);
  const [category1, setCategory1] = useState("SAP");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");
  const [category4, setCategory4] = useState("");
  const [soldToParty, setSoldToParty] = useState("");
  const [customerId, setCustomerId] = useState("babu.s@sirc.sa");
  const [status, setStatus] = useState("");
  const [incidentNumber, setIncidentNumber] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialLongDescription) {
      setDescription(initialLongDescription);
    }
    if (initialShortDescription) {
      setShortDescription(initialShortDescription);
    }
  }, [initialLongDescription, initialShortDescription]);

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "India",
    "Brazil",
    "Mexico",
    "Saudi Arabia",
    "UAE",
  ];

  const chatScopeOptions = [
    "Global",
    "Regional",
    "Team",
    "Individual",
    "Department",
  ];

  const assignmentGroups = [
    "IT Support",
    "Network Team",
    "Security Team",
    "Database Team",
    "Application Team",
    "Infrastructure Team",
  ];

  const category1Options = [
    "SAP"
  ];

  const category2Options = [
    "SAP Analytics Cloud ",
    "Sales & Distribution ",
    "Project Systems ",
    "Real Estate Management ",
    "Ariba",
    "Quality Management",
    "Plant Maintenance ",
    "PROLOGA",
    "Basis",
    "Finance & Controlling ",
    "Material Management ",
    "SuccessFactors ",
    "Production Planning ",
    "SuccessFactors EC ",
    "Solution Manager ",
    "SuccessFactors ECP ",
    "SuccessFactors RCM ",
    "SuccessFactors LMS ",
    "SuccessFactors PMGM ",
    "SuccessFactors Compensation ",
    "SuccessFactors Onboarding ",
    "Treasury Risk Management ",
    "SAP Analytics Cloud ",
    "SuccessFactors Time Tracking ",
  ];

  const category3Options = [
    "Incident",
    "Change Request ",
    "Training",
    "New User Request ",
    "Roles & Authorization ",
    "User Delegation",
    "Clarification",
  ];

  const category4Options = [
    "Incident - Not Applicable ",
    "Incident - Development ",
    "Incident - Enhancement ",
    "Incident - Mini Project ",
    "Incident - Form ",
    "Incident - Report ",
    "Incident - Configuration ",
    "Incident - Authorization ",
    "Change Request - Development ",
    "Change Request - Enhancement ",
    "Change Request - Mini Project ",
    "Change Request - Form ",
    "Change Request - Report ",
    "Change Request - Configuration ",
    "Change Request - Authorization ",
    "Change Request - Workflow ",
    "Change Request - Delegation ",
    "Change Request - Role Assignment",
    "Change Request - New User ",
  ];

  const soldToPartyOptions = [
    "Saudi Investment Recycling Company",
    "AKAM",
    "Reviva",
    "SAIL",
  ];

  const statusOptions = ["New", "In Progress", "Pending", "Resolved", "Closed"];

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredAssignmentGroups = assignmentGroups.filter((group) =>
    group.toLowerCase().includes(assignmentSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    setLoading(true);

    const ticketData: { [key: string]: any } = {
      priority:
        priority === "P1"
          ? "Very High"
          : priority === "P2"
          ? "High"
          : priority === "P3"
          ? "Medium"
          : "Low",
      summary: shortDescription,
      customerId: customerId,
    }; 
    if (description) ticketData.notes = description;
    if (category1) ticketData.category1 = category1;
    if (category2) ticketData.category2 = category2;
    if (category3) ticketData.category3 = category3;
    if (category4) ticketData.category4 = category4;
    if (soldToParty) ticketData.soldToParty = soldToParty;
    if (impact) ticketData.impact = impact;
    if (urgency) ticketData.urgency = urgency;
    if (status) ticketData.status = status;
    if (incidentNumber) ticketData.incidentNumber = incidentNumber;
    if (module) ticketData.module = module;
    if (location) ticketData.location = location;  
    if (chatScope) ticketData.chatScope = chatScope;
    if (assignmentGroup) ticketData.assignmentGroup = assignmentGroup; 

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Ticket created successfully:", result);

        const successMessage =
          result.messageDescription || "Ticket created successfully!";
        const ticketInfo = result.sapIncidentID
          ? ` | SAP ID: ${result.sapIncidentID}`
          : result.itsmIncidentID
          ? ` | ITSM ID: ${result.itsmIncidentID}`
          : "";

        toast.success(`${successMessage}${ticketInfo}`, {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        }); 
        setPriority("");
        setModule("");
        setLocation("");
        setImpact("");
        setUrgency("");
        setChatScope("");
        setShortDescription("");
        setDescription("");
        setAssignmentGroup("");
        setCategory2(""); 
        setCategory3("");
        setCategory4("");
        setSoldToParty(""); 
        setStatus("");  
        setIncidentNumber("");
        setLocationSearch("");
        setAssignmentSearch("");
      } else {
        const errorData = await response.json().catch(() => ({
          messageCode: "Error",
          messageDescription: "Failed to create ticket",
        }));
        console.error("Error creating ticket:", errorData);

        const errorMessage =
          errorData.messageDescription ||
          errorData.message ||
          "Failed to create ticket";
        const errorCode = errorData.messageCode
          ? ` (${errorData.messageCode})`
          : "";

        toast.error(`${errorMessage}${errorCode}`, {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Network error:", error);

      toast.error(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="flex flex-col items-center text-white">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-3 text-lg">Creating Ticket...</p>
          </div>
        </div>
      )}

      <div className="h-full golden-border p-3 cardMain bg-gray-900 flex flex-col">
        <style>{`
          .scroll::-webkit-scrollbar {
            width: 7px;
          }

          .scroll::-webkit-scrollbar-track {
            background: #30303000;
          }

          .scroll::-webkit-scrollbar-thumb {
            background-color: rgb(70, 70, 70);
            border-radius: 8px;
          }

          /* Custom toast styles */
          .Toastify__toast--success {
            background: linear-gradient(135deg, #10b981, #059669);
            border-left: 4px solid #34d399;
          }

          .Toastify__toast--error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-left: 4px solid #f87171;
          }

          .Toastify__toast {
            border-radius: 8px;
            font-family: system-ui, -apple-system, sans-serif;
          }

          .Toastify__close-button {
            color: white;
            opacity: 0.8;
          }

          .Toastify__close-button:hover {
            opacity: 1;
          }

          .Toastify__progress-bar--success {
            background: #34d399;
          }

          .Toastify__progress-bar--error {
            background: #f87171;
          }
        `}</style>
        <h2 className="text-2xl font-bold text-white mb-6">Create Ticket</h2>

        <div className="flex-grow overflow-y-auto pr-2 scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-white mb-2"
              >
                Priority *
              </label>
              <div className="relative">
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Select Priority</option>
                  <option value="P1">P1 - Very High </option>
                  <option value="P2">P2 - High</option>
                  <option value="P3">P3 - Medium</option>
                  <option value="P4">P4 - Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="impact"
                className="block text-sm font-medium text-white mb-2"
              >
                Impact
              </label>
              <div className="relative">
                <select
                  id="impact"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading}  
                >
                  <option value="">Select Impact</option>
                  <option value="Disaster">Disaster</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="None">None</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="urgency"
                className="block text-sm font-medium text-white mb-2"
              >
                Urgency
              </label>
              <div className="relative">
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading}  
                >
                  <option value="">Select Urgency</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Very High">Very High</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-white mb-2"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading}  
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="category1"
                className="block text-sm font-medium text-white mb-2"
              >
                Category 1 *
              </label>
              <div className="relative">
                <select
                  id="category1"
                  value={category1}
                  onChange={(e) => setCategory1(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Select Category 1</option>
                  {category1Options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div> 
            <div>
              <label
                htmlFor="category2"
                className="block text-sm font-medium text-white mb-2"
              >
                Category 2 *
              </label>
              <div className="relative">
                <select
                  id="category2"
                  value={category2}
                  onChange={(e) => setCategory2(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading} 
                >
                  <option value="">Select Category 2</option>
                  {category2Options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>
 
            <div>
              <label
                htmlFor="category3"
                className="block text-sm font-medium text-white mb-2"
              >
                Category 3
              </label>
              <div className="relative">
                <select
                  id="category3"
                  value={category3}
                  onChange={(e) => setCategory3(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading} 
                >
                  <option value="">Select Category 3</option>
                  {category3Options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>
 
            <div>
              <label
                htmlFor="category4"
                className="block text-sm font-medium text-white mb-2"
              >
                Category 4
              </label>
              <div className="relative">
                <select
                  id="category4"
                  value={category4}
                  onChange={(e) => setCategory4(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading} 
                >
                  <option value="">Select Category 4</option>
                  {category4Options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>
 
            <div>
              <label
                htmlFor="soldToParty"
                className="block text-sm font-medium text-white mb-2"
              >
                Sold To Party *
              </label>
              <div className="relative">
                <select
                  id="soldToParty"
                  value={soldToParty}
                  onChange={(e) => setSoldToParty(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading}  
                >
                  <option value="">Select Sold To Party</option>
                  {soldToPartyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>
 
            <div>
              <label
                htmlFor="customerId"
                className="block text-sm font-medium text-white mb-2"
              >
                Customer ID *
              </label>
              <input
                type="email"
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter customer email..."
                className="block w-full px-4 py-3 border border-blue-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                disabled={loading}  
              />
            </div> 
            <div>
              <label
                htmlFor="incidentNumber"
                className="block text-sm font-medium text-white mb-2"
              >
                Incident Number
              </label>
              <input
                type="text"
                id="incidentNumber"
                value={incidentNumber}
                onChange={(e) => setIncidentNumber(e.target.value)}
                placeholder="Enter incident number..."
                className="block w-full px-4 py-3 border border-blue-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                disabled={loading} 
              />
            </div> 
            <div>
              <label
                htmlFor="module"
                className="block text-sm font-medium text-white mb-2"
              >
                Module
              </label>
              <div className="relative">
                <select
                  id="module"
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading} 
                >
                  <option value="">Select Module</option>
                  <option value="accounting">Accounting</option>
                  <option value="inventory">Inventory</option>
                  <option value="sales">Sales</option>
                  <option value="production">Production</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div> 
            <div className="relative">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-white mb-2"
              >
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationList(true);
                  }}
                  onFocus={() => setShowLocationList(true)}
                  placeholder="Type country name..."
                  className="block w-full px-4 py-3 pr-10 border border-blue-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading} 
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {showLocationList && filteredCountries.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-blue-500 rounded-md max-h-40 overflow-y-auto scroll">
                    {filteredCountries.map((country) => (
                      <div
                        key={country}
                        onClick={() => {
                          setLocation(country);
                          setLocationSearch(country);
                          setShowLocationList(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white flex items-center"
                      >
                        <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                        {country}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div> 
            <div>
              <label
                htmlFor="chatScope"
                className="block text-sm font-medium text-white mb-2"
              >
                Chat Scope
              </label>
              <div className="relative">
                <select
                  id="chatScope"
                  value={chatScope}
                  onChange={(e) => setChatScope(e.target.value)}
                  className="block w-full px-4 py-3 border border-blue-500 rounded-md appearance-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading} 
                >
                  <option value="">Select Chat Scope</option>
                  {chatScopeOptions.map((scope) => (
                    <option key={scope} value={scope.toLowerCase()}>
                      {scope}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium text-white mb-2"
              >
                Summary *
              </label>
              <textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary of the issue..."
                className="block w-full px-4 py-3 border border-blue-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500 resize-none"
                disabled={loading} 
              />
            </div>
 
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white mb-2"
              >
                Notes
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Detailed description of the issue..."
                className="block w-full px-4 py-3 border border-blue-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500 resize-none"
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2 relative">
              <label
                htmlFor="assignmentGroup"
                className="block text-sm font-medium text-white mb-2"
              >
                Assignment Group
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="assignmentGroup"
                  value={assignmentSearch}
                  onChange={(e) => {
                    setAssignmentSearch(e.target.value);
                    setShowAssignmentList(true);
                  }}
                  onFocus={() => setShowAssignmentList(true)}
                  placeholder="Search assignment group..."
                  className="block w-full px-4 py-3 pr-10 border border-blue-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-blue-500"
                  disabled={loading}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {showAssignmentList && filteredAssignmentGroups.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-blue-500 rounded-md max-h-40 overflow-y-auto scroll">
                    {filteredAssignmentGroups.map((group) => (
                      <div
                        key={group}
                        onClick={() => {
                          setAssignmentGroup(group);
                          setAssignmentSearch(group);
                          setShowAssignmentList(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white flex items-center"
                      >
                        <Users className="h-4 w-4 mr-2 text-blue-400" />
                        {group}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> 
        <button
          onClick={handleSubmit}
          disabled={loading || !shortDescription || !customerId}
          className="mt-6 w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 disabled:bg-gray-600 text-white font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
 
        {(showLocationList || showAssignmentList) && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => {
              setShowLocationList(false);
              setShowAssignmentList(false);
            }}
          />
        )}
      </div>
 
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default TicketPanel;