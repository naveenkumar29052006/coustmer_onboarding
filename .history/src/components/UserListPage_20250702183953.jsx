import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import servicesConfig from './servicesConfig';
import ProposalTable from './ProposalTable';

const SERVICE_OPTIONS = [
  { id: 1, label: "Service 1" },
  { id: 2, label: "Service 2" },
  { id: 3, label: "Service 3" },
  { id: 4, label: "Service 4" },
  { id: 5, label: "Service 5" },
  { id: 6, label: "Service 6" },
  { id: 7, label: "Service 7" },
  { id: 8, label: "Service 8" },
  { id: 9, label: "Service 9" },
  { id: 10, label: "Service 10" },
  { id: 11, label: "Service 11" },
  { id: 12, label: "Service 12" },
];

const statusColor = (status) =>
  status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

// Helper to safely split comma-separated strings
function safeSplit(str) {
  return typeof str === "string" && str.trim().length > 0 ? str.split(",") : [];
}

// Helper to decode code to full label path
function decodeCodeToLabels(code) {
  if (!code || typeof code !== 'string') return [];

  // Try to find the service number
  const match = code.match(/^(\d+)/);
  if (!match) return [];

  const serviceNum = parseInt(match[1], 10);
  const serviceConfig = servicesConfig[serviceNum - 1];
  if (!serviceConfig) return [];

  const labels = [serviceConfig.label];
  let rest = code.slice(match[1].length);
  let currentSubcats = serviceConfig.subcategories;

  for (let i = 0; rest.length > 0 && currentSubcats && currentSubcats.length > 0; i++) {
    if (i === 0) {
      // First sub: letter
      const idx = rest[0].charCodeAt(0) - 97;
      if (idx < 0 || idx >= currentSubcats.length) break;
      labels.push(currentSubcats[idx].label);
      currentSubcats = currentSubcats[idx].subcategories;
      rest = rest.slice(1);
    } else {
      // Next subs: number
      const numMatch = rest.match(/^(\d+)/);
      if (!numMatch) break;
      const idx = parseInt(numMatch[1], 10) - 1;
      if (idx < 0 || idx >= (currentSubcats ? currentSubcats.length : 0)) break;
      labels.push(currentSubcats[idx].label);
      currentSubcats = currentSubcats[idx].subcategories;
      rest = rest.slice(numMatch[1].length);
    }
  }

  return labels;
}

// Helper to format service details
function formatServiceDetails(user) {
  if (user.service_details && Array.isArray(user.service_details) && user.service_details.length > 0) {
    return user.service_details.map(detail => {
      let serviceText = detail.service || '';
      if (detail.service_option) {
        serviceText += ` - ${detail.service_option}`;
      }
      if (detail.sub_option) {
        serviceText += ` - ${detail.sub_option}`;
      }
      return serviceText;
    }).join(', ');
  }

  // Fallback to decoding codes if service_details not available
  if (user.additional_info && Array.isArray(user.additional_info)) {
    return user.additional_info.map(code => decodeCodeToLabels(code).join(' > ')).join(', ');
  }

  return 'No service details';
}

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [whatsappFilter, setWhatsappFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/users")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    // Search by name, email, or company
    const searchMatch =
      (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase())) ||
      (user.company && user.company.toLowerCase().includes(search.toLowerCase()));

    // Service filter
    const servicesArr = Array.isArray(user.selected_services)
      ? user.selected_services
      : [];
    const serviceMatch =
      !serviceFilter || servicesArr.includes(serviceFilter);

    // WhatsApp filter
    const whatsappMatch =
      whatsappFilter === ""
        ? true
        : String(user.whatsapp_status) === whatsappFilter;

    // Email filter
    const emailMatch =
      emailFilter === ""
        ? true
        : String(user.email_status) === emailFilter;

    return searchMatch && serviceMatch && whatsappMatch && emailMatch;
  });

  // Sorting logic
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortArrow = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  // Sort users by created_at descending
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bDate - aDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const paginatedUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen p-8 bg-gray-50 w-full font-poppins">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-8 text-[#222] font-poppins">User List</h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 p-6 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-[#534DAF] font-poppins">Registered Users</h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center justify-center h-10 min-w-[120px] px-3 bg-[#FF8000]/10 text-[#FF8000] rounded-lg font-bold text-base shadow-sm border border-[#FF8000]/30">
                <span className="mr-2">Total Users:</span> <span>{users.length}</span>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8000] focus:outline-none shadow-sm font-poppins"
              />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm font-poppins"
              >
                <option value="">All Services</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={whatsappFilter}
                onChange={(e) => setWhatsappFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm font-poppins"
              >
                <option value="">WhatsApp: All</option>
                <option value="1">Sent</option>
                <option value="0">Not Sent</option>
              </select>
              <select
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm font-poppins"
              >
                <option value="">Email: All</option>
                <option value="1">Sent</option>
                <option value="0">Not Sent</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-gray-500">No users found.</div>
          ) : (
            <div className="rounded-lg w-full">
              <table className="w-full bg-white rounded-2xl overflow-hidden font-poppins text-sm">
                <thead>
                  <tr className="bg-[#FF8000] text-white text-base">
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Company</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">WhatsApp Status</th>
                    <th className="px-4 py-3 font-semibold">Email Status</th>
                    <th className="px-4 py-3 font-semibold">Created At</th>
                    <th className="px-4 py-3 font-semibold">Updated At</th>
                    <th className="px-4 py-3 font-semibold">Service Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, idx) => (
                    <tr key={user._id || idx} className="border-b last:border-b-0 hover:bg-[#FFF3E6] transition">
                      <td className="px-4 py-2 text-[#222]">{user.name}</td>
                      <td className="px-4 py-2 text-[#222]">{user.email}</td>
                      <td className="px-4 py-2 text-[#222]">{user.company || user.company_name || '-'}</td>
                      <td className="px-4 py-2 text-[#222]">{user.phone || '-'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold font-poppins flex items-center justify-center ${user.whatsapp_status === 1 ? 'bg-[#009933]/10 text-[#009933] border border-[#009933]/30' : 'bg-[#FF8000]/10 text-[#FF8000] border border-[#FF8000]/30'}`}>
                          {user.whatsapp_status === 1 ? (
                            <span className="text-lg" role="img" aria-label="sent">✔</span>
                          ) : (
                            <span className="text-lg" role="img" aria-label="not sent">✖</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold font-poppins flex items-center justify-center ${user.email_status === 1 ? 'bg-[#009933]/10 text-[#009933] border border-[#009933]/30' : 'bg-[#FF8000]/10 text-[#FF8000] border border-[#FF8000]/30'}`}>
                          {user.email_status === 1 ? (
                            <span className="text-lg" role="img" aria-label="sent">✔</span>
                          ) : (
                            <span className="text-lg" role="img" aria-label="not sent">✖</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-[#222]">{user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2 text-[#222]">{user.updated_at ? new Date(user.updated_at).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2 text-[#222]">{formatServiceDetails(user)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination controls */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded-full bg-[#FF8000] text-white font-semibold shadow hover:bg-[#ff9900] transition disabled:opacity-50 font-poppins"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="font-medium text-[#222] font-poppins">Page {page} of {totalPages}</span>
                <button
                  className="px-4 py-2 rounded-full bg-[#FF8000] text-white font-semibold shadow hover:bg-[#ff9900] transition disabled:opacity-50 font-poppins"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
