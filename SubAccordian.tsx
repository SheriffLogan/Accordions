import React, { useState } from 'react';
import './history.css';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

interface InnerAccordionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
}

const InnerAccordion: React.FC<InnerAccordionProps> = ({ title, expanded, onToggle }) => {
  const toggleAccordion = () => {
    onToggle(); // Notify parent about inner accordion toggle
  };

  return (
    <Accordion className={`inner-accordion ${expanded ? 'expanded' : 'collapsed'}`}>
      <AccordionSummary className="inner-accordion-header"
        expandIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={toggleAccordion}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails>
      {expanded && (
        <div className="inner-accordion-content">
          <div className="section">
            <div className="text-section">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
          <div className="section">
            <div className="actions-section">
              <div className="icon-section">
                <DeleteForeverOutlinedIcon className="icon delete-icon" />
                <span className="delete-title">Delete Chat</span>
                <div className="spacer"></div>
                <ThumbUpOffAltIcon className="icon like-icon" />
                <ThumbDownOffAltIcon className="icon dislike-icon" />
              </div>
            </div>
          </div>
          <div className="footer-section">
            {/* Footer with date and time */}
            <span className="date-time left">Date and Time</span>
          </div>
        </div>
      )}
      </AccordionDetails>
      <div className={`footer ${expanded ? 'expanded' : 'collapsed'}`}>
        {/* Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document  */}
      </div>
    </Accordion>
  );
};

export default InnerAccordion;
