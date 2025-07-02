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
    <table className="proposal-table mx-auto max-w-3xl border border-gray-800 text-sm" style={{ width: '1000px', tableLayout: 'fixed' }}>
      <thead>
        <tr className="bg-orange-500 text-white">
          <th className="px-3 py-2 border border-gray-800">S.No</th>
          <th className="px-3 py-2 border border-gray-800">Service</th>
          <th className="px-3 py-2 border border-gray-800">Option</th>
          <th className="px-3 py-2 border border-gray-800">Sub Option</th>
          <th className="px-3 py-2 border border-gray-800">Price</th>
        </tr>
      </thead>
      <tbody>
        {detailsWithPrice.map((detail, idx) => (
          <tr key={idx} className="bg-transparent border-b border-gray-800">
            <td className="px-3 py-2 border border-gray-800 text-center">{idx + 1}</td>
            <td className="px-3 py-2 border border-gray-800">{detail.service}</td>
            <td className="px-3 py-2 border border-gray-800">{detail.option || '-'}</td>
            <td className="px-3 py-2 border border-gray-800">{detail.sub_option || '-'}</td>
            <td className="px-3 py-2 border border-gray-800 text-right font-semibold">{detail._randomPrice.toLocaleString()} <span className="text-xs font-normal">Per month</span></td>
          </tr>
        ))}
        {/* Total Row */}
        <tr className="bg-transparent font-bold">
          <td className="px-3 py-2 border border-gray-800 text-center" colSpan={4}>Total</td>
          <td className="px-3 py-2 border border-gray-800 text-right">{total.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ProposalTable; 