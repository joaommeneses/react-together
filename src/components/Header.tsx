import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Whiteboard.css';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-top">
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>{title}</h1>
      </div>
    </header>
  );
}