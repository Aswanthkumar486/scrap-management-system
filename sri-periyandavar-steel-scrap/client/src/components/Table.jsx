// const Table = ({ data }) => {
//   return (
//     <table className="table table-bordered">
//       <thead>
//         <tr>
//           {data?.length > 0 &&
//             Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
//         </tr>
//       </thead>
//       <tbody>
//         {data?.map((item, i) => (
//           <tr key={i}>
//             {Object.values(item).map((val, j) => (
//               <td key={j}>{val}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default Table;
const Table = ({ data, title = "Scrap Records" }) => {
  return (
    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
      <div className="card-header bg-dark text-warning border-bottom border-warning py-3">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-clipboard-data-fill fs-4"></i>
          <h5 className="mb-0 fw-bold">{title}</h5>
          <span className="ms-auto badge bg-warning text-dark">
            <i className="bi bi-database"></i> Live Data
          </span>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead className="bg-gradient" style={{ background: "#2a241c" }}>
              <tr>
                {data?.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <th key={key} className="text-warning border-bottom border-warning py-3">
                      <i className="bi bi-database-gear me-2"></i>
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => (
                <tr key={i} className="border-bottom border-secondary">
                  {Object.values(item).map((val, j) => (
                    <td key={j} className="py-3 text-light">
                      {typeof val === 'number' && (Object.keys(item)[j]?.toLowerCase().includes('weight') || Object.keys(item)[j]?.toLowerCase().includes('kg')) 
                        ? <><i className="bi bi-weight-scale me-2 text-warning"></i>{val.toLocaleString()} kg</>
                        : typeof val === 'number' && Object.keys(item)[j]?.toLowerCase().includes('amount')
                        ? <><i className="bi bi-currency-rupee me-1 text-success"></i>{val.toLocaleString()}</>
                        : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer bg-dark border-top border-warning py-2">
        <small className="text-secondary">
          <i className="bi bi-truck me-1"></i> Total Records: {data?.length || 0} | Last updated: {new Date().toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
};

export default Table;