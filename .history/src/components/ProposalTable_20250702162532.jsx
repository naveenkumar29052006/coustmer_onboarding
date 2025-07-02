import React from 'react';

/**
 * ProposalTable Component
 * Reusable table for displaying service details with business proposal styling
 * @param {Array} serviceDetails - Array of service detail objects
 */
const ProposalTable = ({ serviceDetails = [] }) => {
  // Ensure random price is set for each detail (if not already present)
  const detailsWithPrice = serviceDetails.map(detail => {
    if (!detail._randomPrice) {
      detail._randomPrice = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
    }
    return detail;
  });
  const total = detailsWithPrice.reduce((sum, d) => sum + (d._randomPrice || 0), 0);

  return (
    <table className="proposal-table w-full border border-gray-800 text-sm table-auto">
      <thead>
        <tr className="bg-orange-500 text-white">
          <th className="px-4 py-2 border border-gray-800 w-16">S.No</th>
          <th className="px-4 py-2 border border-gray-800">Service</th>
          <th className="px-4 py-2 border border-gray-800">Option</th>
          <th className="px-4 py-2 border border-gray-800">Sub Option</th>
        </tr>
      </thead>
      <tbody>
        {detailsWithPrice.map((detail, idx) => (
          <tr key={idx} className="bg-transparent border-b border-gray-800">
            <td className="px-4 py-2 border border-gray-800 text-center">{idx + 1}</td>
            <td className="px-4 py-2 border border-gray-800">{detail.service}</td>
            <td className="px-4 py-2 border border-gray-800">{detail.option || '-'}</td>
            <td className="px-4 py-2 border border-gray-800">{detail.sub_option || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProposalTable; 