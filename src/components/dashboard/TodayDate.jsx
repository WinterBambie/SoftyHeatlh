import React from 'react';

const TodayDate = () => {
  // Equivalente a date('Y-m-d') en PHP
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
  const dd = String(today.getDate()).padStart(2, '0');
  
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  return (
    <div style={{ textAlign: 'right' }}>
      <p style={{ 
        fontSize: '14px', 
        color: 'rgb(119, 119, 119)', 
        padding: 0, 
        margin: 0 
      }}>
        Fecha de hoy
      </p>
      <p className="heading-sub12" style={{ 
        padding: 0, 
        margin: 0,
        fontWeight: 'bold',
        color: 'black' 
      }}>
        {formattedDate}
      </p>
    </div>
  );
};

export default TodayDate;