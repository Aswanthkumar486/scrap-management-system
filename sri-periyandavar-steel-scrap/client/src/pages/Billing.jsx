import { useEffect, useState } from "react";
import API from "../utils/api";

function Billing() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const res = await API.get("/sales");
    setData(res.data);
  };

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="p-4">
      <h4>Billing</h4>

      <table className="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d,i)=>(
            <tr key={i}>
              <td>{d.customerName}</td>
              <td>{d.product}</td>
              <td>{d.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5>Total Revenue: ₹{total}</h5>
    </div>
  );
}

export default Billing;