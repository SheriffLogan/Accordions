import React, { useState, useEffect } from 'react';
import './history.css';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ExpandCircleDownSharpIcon from '@mui/icons-material/ExpandCircleDownSharp';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InnerAccordion from "./SubAccordian.js";
import { Paper } from '@mui/material';

const ActiveHistory: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [parentHeight, setParentHeight] = useState<string>('13vh'); // Initial collapsed state height
  const [expandedInnerIndex, setExpandedInnerIndex] = useState<number | null>(null); // Track expanded inner index

  const toggleAccordion = () => {
    setExpanded(!expanded);
    setExpandedInnerIndex(null); // Reset expanded inner index when parent accordion collapses
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleInnerAccordionToggle = (index: number) => {
    if (index === expandedInnerIndex) {
      setExpandedInnerIndex(null); // Collapse the clicked inner accordion
    } else {
      setExpandedInnerIndex(index); // Expand the clicked inner accordion
    }
  };

  useEffect(() => {
    // Calculate total height of expanded inner accordions
    const totalInnerAccordionHeight = expandedInnerIndex !== null ? 200 : 0; // Adjust 200 based on inner accordion content

    // Calculate and set the parent accordion height based on inner accordions
    const innerAccordionHeight = expanded ? `calc(40vh + ${totalInnerAccordionHeight}px)` : '13vh';
    setParentHeight(innerAccordionHeight);
  }, [expanded, expandedInnerIndex]);

  return (
    <Paper className={`accordion ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="top-bar">
        <div className="title-section">
          <HistoryRoundedIcon className="icon" />
          <h2 className="title">Active History</h2>
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
        <div className="content">
          {/* Place your content here */}
          <div className="inner-accordions">
            <InnerAccordion
              title="Accordion 1"
              expanded={expandedInnerIndex === 0}
              onToggle={() => handleInnerAccordionToggle(0)}
            />
            <InnerAccordion
              title="Accordion 2"
              expanded={expandedInnerIndex === 1}
              onToggle={() => handleInnerAccordionToggle(1)}
            />
            <InnerAccordion
              title="Accordion 3"
              expanded={expandedInnerIndex === 2}
              onToggle={() => handleInnerAccordionToggle(2)}
            />
            <InnerAccordion
              title="Accordion 4"
              expanded={expandedInnerIndex === 3}
              onToggle={() => handleInnerAccordionToggle(3)}
            />
            <InnerAccordion
              title="Accordion 5"
              expanded={expandedInnerIndex === 4}
              onToggle={() => handleInnerAccordionToggle(4)}
            />
            <InnerAccordion
              title="Accordion 6"
              expanded={expandedInnerIndex === 5}
              onToggle={() => handleInnerAccordionToggle(5)}
            />
          </div>
        </div>
      )}
    </Paper>
  );
};

export default ActiveHistory;
