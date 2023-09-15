import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './history.css';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ExpandCircleDownSharpIcon from '@mui/icons-material/ExpandCircleDownSharp';
import InnerAccordion from "./InnerAccordion";
import { Paper } from '@mui/material';
import "../../styles/tailwind.css"

interface AccordionData {
  PartitionKey: string;
  RowKey: string;
  Logs: string;
  Timestamp: string;
}

const ActiveHistory: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [parentHeight, setParentHeight] = useState<string>('13vh'); // Initial collapsed state height
  const [expandedInnerIndex, setExpandedInnerIndex] = useState<number | null>(null); // Track expanded inner index
  const [accordionData, setAccordionData] = useState<AccordionData[]>([]);


  const toggleAccordion = () => {
    setExpanded(!expanded);
    setExpandedInnerIndex(null); // Reset expanded inner index when parent accordion collapses

  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://stk3psfo35musj6.table.core.windows.net/Chatlogs?sv=2019-02-02&st=2023-08-28T13%3A02%3A06Z&se=2025-08-29T13%3A02%3A00Z&sp=raud&sig=MxUk4XoiSebJ6ei5I4%2BC%2B81mf4bhnB2%2FqsuZCqQYQSk%3D&tn=Chatlogs', {
      });
      const data = response.data;
      //console.log(data.value[0]);
      setAccordionData(data.value);
      // console.log('accordionData', accordionData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInnerAccordionToggle = (index: number) => {
    if (index === expandedInnerIndex) {
      setExpandedInnerIndex(null); // Collapse the clicked inner accordion
    } else {
      setExpandedInnerIndex(index); // Expand the clicked inner accordion
    }
  };

  useEffect(() => {


    fetchData();
    // Calculate total height of expanded inner accordions
    const totalInnerAccordionHeight = expandedInnerIndex !== null ? 200 : 0; // Adjust 200 based on inner accordion content

    // Calculate and set the parent accordion height based on inner accordions
    const innerAccordionHeight = expanded ? `calc(40vh + ${totalInnerAccordionHeight}px)` : '13vh';
    setParentHeight(innerAccordionHeight);
  }, [expanded, expandedInnerIndex]);

  return (
    <Paper className={`accordion ${expanded ? 'expanded' : 'collapsed'}`} style={{ backgroundColor: '#fbfbfb' }}>
      <div className="top-bar">
        <div className="title-section">
          <HistoryRoundedIcon className="icon" />
          <h2 className="header-title">Active History</h2>
        </div>
        {expanded ? (
          <>
            <ExpandCircleDownSharpIcon
              className="expand-icon orange"
              onClick={toggleAccordion}
              style={{ transform: 'rotate(180deg)' }}
            />
          </>
        ) : (
          <ExpandCircleDownSharpIcon className="expand-icon orange" onClick={toggleAccordion} />
        )}
      </div>
      {expanded && (
        <div className="custom-flex-container">
          {Array.isArray(accordionData) && accordionData.slice(0, 6).map((data, index) => {

            const logsArray = data.Logs.split(',');

            // Extract the title and description
            const title = (logsArray[0]?.trim() || '').replace(/{|}/g, ''); // Remove '{' and '}'
            const description = (logsArray.slice(0, 2).join(',').trim() || '').replace(/{|}/g, ''); // Remove '{' and '}'

            // Parse the timestamp
            const timestampArray = data.Timestamp.split(' ');
            const timestamp = new Date(timestampArray.join('T')); // Convert to a Date object

            // Format the timestamp to standard date and 24-hour time (HH:mm)
            const formattedDate = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')}`;
            const formattedTime = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

            return (
              <div key={data.RowKey} className="custom-flex-item">
                <InnerAccordion
                  title={title}
                  description={description}
                  dateTime={`${formattedDate} | ${formattedTime}`}
                  expanded={expandedInnerIndex === index}
                  onToggle={() => handleInnerAccordionToggle(index)}
                />
              </div>
            );
          })}

        </div>
      )}
    </Paper>
  );
};

export default ActiveHistory;
