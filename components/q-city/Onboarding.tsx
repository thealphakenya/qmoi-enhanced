import QmoiAutoDistribution from "@/components/QmoiAutoDistribution";
import React from "react";

const Onboarding: React.FC = () => {
  const isMaster = true; // Replace with actual master check logic
  return (
    <div>
      {isMaster && (
        <div className="my-8">
          <QmoiAutoDistribution />
        </div>
      )}
    </div>
  );
};

export default Onboarding;
