import QmoiAutoDistribution from "../../QmoiAutoDistribution";

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
