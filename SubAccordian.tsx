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
  description: string;
  dateTime: string;
  expanded: boolean;
  onToggle: () => void;
}

const InnerAccordion: React.FC<InnerAccordionProps> = ({ title, description, dateTime, expanded, onToggle }) => {
  const toggleAccordion = () => {
    onToggle(); // Notify parent about inner accordion toggle
  };

  return (
    <Accordion className={`inner-accordion ${expanded ? 'expanded' : 'collapsed'}`}>
      <AccordionSummary className="inner-accordion-header" expandIcon={null} onClick={toggleAccordion} style={{ backgroundColor: '#f4f8fb' }}>
        <div className="header-content" style={{ height: expanded ? '5vh' : 'auto'}}>
          <div className="header-top">
            <div className="title-section-inner">
              {title}
            </div>
            <div className="expand-icon-section">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
          </div>
          <div className="divider" style={{ display: expanded ? 'none' : 'block' }}></div>
          <div className="header-bottom " style={{ display: expanded ? 'none' : 'block' }}>
            <span className="date-time">{dateTime}</span>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ backgroundColor: '#f4f8fb' }}>
        {expanded && (
          <div className="inner-accordion-content">
            <div className="divider"></div>
            <div className="section">
              <div className="text-section">
                {description}
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
              <span className="date-time left">{dateTime}</span>
            </div>
          </div>
        )}
      </AccordionDetails>
      
    </Accordion>
  );
};

export default InnerAccordion;
