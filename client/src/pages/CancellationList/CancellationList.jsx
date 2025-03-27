import { useQuery } from "react-query";
import { getEveryCancellation, getProperty } from "../../utils/api";
import { useEffect, useState } from "react";
import "./CancellationListStyle.css";
import { useNavigate } from "react-router-dom";

const CancellationList = () => {
  const [property, setProperty] = useState([]);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(
    "cancellations",
    async () => {
      const response = getEveryCancellation(localStorage.getItem("access_token"));
      return response;
    },
  );
  
  useEffect(() => {
    // console.log(property?.length, data?.length)
    if (property?.length === data?.length) {
      return;
    }
    data?.map(async (cancellation) => {
      const res = await getProperty(cancellation.residencyId);
      setProperty((prev) => {
        if (!prev.some((item) => item.id === res.id)) {
          return [...prev, res];
        }
        return prev;
      });
      
      // console.log(property);
    });
  }, [data]);

  const downloadReportHandler = () => {
    // navigate("/dashboard/order-report");
    window.open("/dashboard/cancellation-report", "_blank");
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="booking-list">
      <div className="booking-list-header">
        <h2>Cancellation List</h2>
        <button className="button" onClick={downloadReportHandler}>Download Report</button>
      </div>
      <div className="booking-list-content">
        <table>
          <thead>
            <tr>
              <th>Cancellation ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Property</th>
              <th>Location</th>
              <th>Price</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((cancellation, index) => (
              <tr key={index}>
                <td>{cancellation.id.slice(0, 5)}...</td>
                <td>{new Date(cancellation.createdAt).toLocaleDateString()}</td>
                <td>{cancellation.userEmail}</td>
                {property?.map((prop, index) => {
                  if (prop.id === cancellation.residencyId) {
                    return (
                      <>
                        <td>{prop.title}</td>
                        <td>{prop.address}</td>
                        <td>{prop.price}</td>
                        <td>{prop.type}</td>
                      </>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CancellationList;
