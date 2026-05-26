"use client";
import React from "react";
export interface Deal {
  id: string;
  title: string;
  details: string;
  expires: string;
}
export interface DealsPopupProps {
  deals?: Deal[];
  onClose?: () => void;
}
const DealsPopup: React.FC<DealsPopupProps> = ({ deals = [], onClose }) => {
  return (
    <div className="deals-popup rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Special Offers</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-200"
        >
          ×
        </button>
      </div>
      {deals.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No active deals are available right now.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {deals.map((deal) => (
            <li key={deal.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{deal.title}</p>
              <p className="mt-1 text-sm text-slate-600">{deal.details}</p>
              <p className="mt-2 text-xs text-slate-500">Expires: {deal.expires}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default DealsPopup;
