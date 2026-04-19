import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Reports = () => {
  // Sample report data (later connect API)
  const reports = [
    { type: "Sales", amount: 15000, date: "2026-04-10" },
    { type: "Purchase", amount: 8000, date: "2026-04-11" },
    { type: "Sales", amount: 12000, date: "2026-04-12" },
  ];

  // Calculate totals
  const totalSales = reports
    .filter(r => r.type === "Sales")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPurchase = reports
    .filter(r => r.type === "Purchase")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="d-flex">


      <div className="flex-grow-1">
        <Navbar />

        <div className="p-4">
          <h3>Reports</h3>

          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card p-3 bg-success text-white">
                <h5>Total Sales</h5>
                <h4>₹{totalSales}</h4>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3 bg-danger text-white">
                <h5>Total Purchase</h5>
                <h4>₹{totalPurchase}</h4>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.type}</td>
                  <td>₹{report.amount}</td>
                  <td>{report.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;