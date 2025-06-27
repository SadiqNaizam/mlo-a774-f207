import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const strengthLevels = [
  { label: "Too Weak", color: "bg-red-500", textColor: "text-red-500" },
  { label: "Weak", color: "bg-orange-500", textColor: "text-orange-500" },
  { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-500" },
  { label: "Strong", color: "bg-green-500", textColor: "text-green-500" },
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  console.log('PasswordStrengthIndicator loaded');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let score = 0;
    if (password.length > 0) {
      score = 1; // Start with "Too Weak" if there's any input
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
    }
    
    // Clamp score between 0 and 4
    const finalScore = Math.min(score > 0 ? score -1 : 0, 4);
    if(password.length === 0) {
      setStrength(0);
    } else {
      // We use finalScore for level, and score for the number of bars to light up
      // which should be at least 1 if there is any password
      setStrength(score);
    }

  }, [password]);

  const getStrengthLevel = () => {
    if (password.length === 0) return null;
    if (strength <= 1) return strengthLevels[0];
    if (strength === 2) return strengthLevels[1];
    if (strength === 3 || strength === 4) return strengthLevels[2];
    if (strength >= 5) return strengthLevels[3];
    return null;
  };
  
  const currentStrength = getStrengthLevel();

  return (
    <div className="w-full mt-2">
      <div className="flex gap-x-1.5 w-full">
        {Array.from({ length: 4 }).map((_, index) => {
          const barIndex = index + 1;
          let barColor = "bg-gray-200 dark:bg-gray-700"; // Default color
          if (strength > 0) {
            if (barIndex <= 1 && strength > 0) barColor = strengthLevels[0].color; // Red
            if (barIndex <= 2 && strength >= 3) barColor = strengthLevels[1].color; // Orange
            if (barIndex <= 3 && strength >= 4) barColor = strengthLevels[2].color; // Yellow
            if (barIndex <= 4 && strength >= 5) barColor = strengthLevels[3].color; // Green
          }
          
          return (
            <div
              key={index}
              className={cn("h-1.5 flex-1 rounded-full transition-colors", barColor)}
            />
          );
        })}
      </div>
      {currentStrength && (
        <p className={cn("text-xs mt-1.5 font-medium", currentStrength.textColor)}>
          Password strength: {currentStrength.label}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;