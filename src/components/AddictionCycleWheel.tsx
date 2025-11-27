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
    { label: "Passage\nof Time", angle: 255 },
  ];

  const centerX = 200;
  const centerY = 200;
  const radius = 140;
  const textRadius = 165;

  // Calculate position for each stage
  const getPosition = (angle: number, r: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  };

  // Generate arrow path between two angles
  const getArrowPath = (startAngle: number, endAngle: number) => {
    const arrowRadius = radius;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const startX = centerX + arrowRadius * Math.cos(startRad);
    const startY = centerY + arrowRadius * Math.sin(startRad);
    const endX = centerX + arrowRadius * Math.cos(endRad);
    const endY = centerY + arrowRadius * Math.sin(endRad);
    
    // Use arc
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    
    return `M ${startX} ${startY} A ${arrowRadius} ${arrowRadius} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-auto">
        {/* Arrows around the wheel */}
        {stages.map((stage, index) => {
          const nextIndex = (index + 1) % stages.length;
          const startAngle = stage.angle + 8;
          let endAngle = stages[nextIndex].angle - 8;
          
          // Handle wrap-around for the last segment
          if (index === stages.length - 1) {
            endAngle = stages[nextIndex].angle + 360 - 8;
          }
          
          const arrowRadius = radius;
          const actualEndAngle = stages[nextIndex].angle - 8;
          const endRad = (actualEndAngle - 90) * (Math.PI / 180);
          const endX = centerX + arrowRadius * Math.cos(endRad);
          const endY = centerY + arrowRadius * Math.sin(endRad);
          
          // Arrow head direction
          const arrowAngle = endRad + Math.PI / 2;
          const arrowSize = 10;
          const arrow1X = endX - arrowSize * Math.cos(arrowAngle - 0.5);
          const arrow1Y = endY - arrowSize * Math.sin(arrowAngle - 0.5);
          const arrow2X = endX - arrowSize * Math.cos(arrowAngle + 0.5);
          const arrow2Y = endY - arrowSize * Math.sin(arrowAngle + 0.5);
          
          return (
            <g key={index}>
              <path
                d={getArrowPath(startAngle, endAngle)}
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon
                points={`${endX},${endY} ${arrow1X},${arrow1Y} ${arrow2X},${arrow2Y}`}
                fill="white"
              />
            </g>
          );
        })}
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 15}
          textAnchor="middle"
          className="font-bold text-xl"
          style={{ fontSize: '20px', fill: 'white' }}
        >
          The Cycle
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          className="font-bold text-xl"
          style={{ fontSize: '20px', fill: 'white' }}
        >
          of Addiction
        </text>
        
        {/* Stage labels */}
        {stages.map((stage, index) => {
          const pos = getPosition(stage.angle, textRadius);
          const lines = stage.label.split('\n');
          
          return (
            <text
              key={index}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-semibold"
              style={{ fontSize: '12px', fill: 'white' }}
            >
              {lines.map((line, lineIndex) => (
                <tspan
                  key={lineIndex}
                  x={pos.x}
                  dy={lineIndex === 0 ? `-${(lines.length - 1) * 0.5}em` : '1.1em'}
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
