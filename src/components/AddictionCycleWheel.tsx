import React from 'react';

const AddictionCycleWheel = () => {
  // Positions for each stage around the wheel (in degrees, starting from top)
  const stages = [
    { label: "Emotional\nPain", angle: -60 },
    { label: "Fantasizing", angle: -15 },
    { label: "Obsessing", angle: 30 },
    { label: "Substance\nAbuse", angle: 75 },
    { label: "Loss of\nControl", angle: 120 },
    { label: "Guilt & Shame\nOver Consequences", angle: 165 },
    { label: "Cessation\nof Use", angle: 210 },
    { label: "Abstinence Without\nTreating Root Causes", angle: 255 },
  ];

  const centerX = 400;
  const centerY = 200;
  const radiusX = 160;
  const radiusY = 110;
  const textRadiusX = 260;
  const textRadiusY = 170;

  const totalStages = stages.length;
  const animationDuration = 8; // Total cycle duration in seconds
  const stageDelay = animationDuration / totalStages;

  // Calculate position for each stage on ellipse
  const getPosition = (angle: number, rx: number, ry: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + rx * Math.cos(rad),
      y: centerY + ry * Math.sin(rad),
    };
  };

  // Generate arrow path between two angles on ellipse
  const getArrowPath = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const startX = centerX + radiusX * Math.cos(startRad);
    const startY = centerY + radiusY * Math.sin(startRad);
    const endX = centerX + radiusX * Math.cos(endRad);
    const endY = centerY + radiusY * Math.sin(endRad);
    
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    
    return `M ${startX} ${startY} A ${radiusX} ${radiusY} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <style>
        {`
          @keyframes pulse-text {
            0%, 12.5%, 100% {
              transform: scale(1);
              opacity: 0.9;
            }
            6.25% {
              transform: scale(1.15);
              opacity: 1;
            }
          }
          .cycle-text {
            transform-origin: center;
            transform-box: fill-box;
          }
        `}
      </style>
      <svg viewBox="0 0 800 400" className="w-full h-auto">
        {/* Define drop shadow filter for text */}
        <defs>
          <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
          </filter>
          <filter id="centerTextShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6"/>
          </filter>
        </defs>

        {/* Arrows around the ellipse */}
        {stages.map((stage, index) => {
          const nextIndex = (index + 1) % stages.length;
          const startAngle = stage.angle + 8;
          let endAngle = stages[nextIndex].angle - 8;
          
          if (index === stages.length - 1) {
            endAngle = stages[nextIndex].angle + 360 - 8;
          }
          
          const actualEndAngle = stages[nextIndex].angle - 8;
          const endRad = (actualEndAngle - 90) * (Math.PI / 180);
          const endX = centerX + radiusX * Math.cos(endRad);
          const endY = centerY + radiusY * Math.sin(endRad);
          
          const tangentAngle = Math.atan2(radiusX * Math.sin(endRad + Math.PI/2), radiusY * Math.cos(endRad + Math.PI/2));
          const arrowSize = 12;
          const arrow1X = endX - arrowSize * Math.cos(tangentAngle - 0.5);
          const arrow1Y = endY - arrowSize * Math.sin(tangentAngle - 0.5);
          const arrow2X = endX - arrowSize * Math.cos(tangentAngle + 0.5);
          const arrow2Y = endY - arrowSize * Math.sin(tangentAngle + 0.5);
          
          return (
            <g key={index}>
              <path
                d={getArrowPath(startAngle, endAngle)}
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
              />
              <polygon
                points={`${endX},${endY} ${arrow1X},${arrow1Y} ${arrow2X},${arrow2Y}`}
                fill="white"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
              />
            </g>
          );
        })}
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 18}
          textAnchor="middle"
          className="font-black"
          style={{ 
            fontSize: '28px', 
            fill: 'white',
            filter: 'url(#centerTextShadow)',
            letterSpacing: '0.5px'
          }}
        >
          The Cycle
        </text>
        <text
          x={centerX}
          y={centerY + 18}
          textAnchor="middle"
          className="font-black"
          style={{ 
            fontSize: '28px', 
            fill: 'white',
            filter: 'url(#centerTextShadow)',
            letterSpacing: '0.5px'
          }}
        >
          of Addiction
        </text>
        
        {/* Stage labels with animation */}
        {stages.map((stage, index) => {
          const pos = getPosition(stage.angle, textRadiusX, textRadiusY);
          const lines = stage.label.split('\n');
          const delay = index * stageDelay;
          
          return (
            <text
              key={index}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold cycle-text"
              style={{ 
                fontSize: '16px', 
                fill: 'white',
                filter: 'url(#textShadow)',
                letterSpacing: '0.3px',
                animation: `pulse-text ${animationDuration}s ease-in-out infinite`,
                animationDelay: `${delay}s`
              }}
            >
              {lines.map((line, lineIndex) => (
                <tspan
                  key={lineIndex}
                  x={pos.x}
                  dy={lineIndex === 0 ? `-${(lines.length - 1) * 0.6}em` : '1.2em'}
                >
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default AddictionCycleWheel;
