import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabGroup: React.FC<TabGroupProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b cardMain border-gray-200 ">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-3 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none
              ${
                activeTab === tab.id
                  ? 'border-[#f4d06f] text-[#f4d06f]' 
                  : 'border-transparent text-gray-300 '  
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabGroup;