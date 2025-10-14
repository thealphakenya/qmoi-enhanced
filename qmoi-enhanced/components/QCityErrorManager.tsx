import React, { useEffect, useState } from "react";
import { useQCity } from "../hooks/useQCity";
import fs from "fs";

const ERRORS_FILE = "ERRORSREADME.md";

export const QCityErrorManager: React.FC = () => {
  const { status, trackError, refetchStatus } = useQCity();
  const [errors, setErrors] = useState(status?.errors || []);

  useEffect(() => {
    if (status?.errors) setErrors(status.errors);
  }, [status]);

  useEffect(() => {
    // Save errors to ERRORSREADME.md
    if (errors.length > 0) {
      const content =
        "# Q-city Error Log\n\n" +
        errors
          .map(
            (e) =>
              `- [${e.status === "resolved" ? "x" : " "}] ${e.type} (${e.priority}) - ${e.message} (ID: ${e.id}) @ ${new Date(e.timestamp).toLocaleString()}`,
          )
          .join("\n");
      fs.writeFileSync(ERRORS_FILE, content);
    }
  }, [errors]);

  const handleFix = (id: string) => {
    // Mark error as resolved and remove from list
    setErrors((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "resolved" } : e)),
    );
    // Optionally call backend to fix error
    const err = errors.find((e) => e.id === id);
    if (
      err &&
      err.id &&
      err.appId &&
      err.type &&
      err.message &&
      typeof err.timestamp === "number" &&
      err.priority &&
      err.status
    ) {
      trackError({ ...err, status: "resolved" });
    }
    refetchStatus();
  };

  const handleRemove = (id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
    // Update file
    const content =
      "# Q-city Error Log\n\n" +
      errors
        .filter((e) => e.id !== id)
        .map(
          (e) =>
            `- [${e.status === "resolved" ? "x" : " "}] ${e.type} (${e.priority}) - ${e.message} (ID: ${e.id}) @ ${new Date(e.timestamp).toLocaleString()}`,
        )
        .join("\n");
    fs.writeFileSync(ERRORS_FILE, content);
  };

  return (
    <div className="qcity-error-manager">
      <h2>Q-city Errors</h2>
      <ul>
        {errors.map((e) => (
          <li key={e.id}>
            <span>
              <b>{e.type}</b> ({e.priority}) - {e.message} @{" "}
              {new Date(e.timestamp).toLocaleString()}
            </span>
            {e.status !== "resolved" && (
              <button onClick={() => handleFix(e.id)}>Fix</button>
            )}
            <button onClick={() => handleRemove(e.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {errors.length === 0 && <p>No errors found.</p>}
    </div>
  );
};
