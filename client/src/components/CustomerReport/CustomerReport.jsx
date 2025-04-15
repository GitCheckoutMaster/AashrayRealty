import { useState } from "react";
import { getCustomers } from "../../utils/api";
import { useQuery } from "react-query";
import { useEffect } from "react";
import "./CustomerReportStyle.css";
import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const OrderReport = () => {
  const token = localStorage.getItem("access_token");
  const [customers, setCustomers] = useState([]);
  const { data, isLoading } = useQuery("customers", () => getCustomers(token), {
    onSuccess: (res) => {
      setCustomers(res.data);
      // console.log(data);
    },
  });
	const [properties, setProperties] = useState([]);
	const printRef = React.useRef(null);

	const handleDownloadPdf = async () => {
		const element = printRef.current;
		if (!element) {
			return;
		}

		const canvas = await html2canvas(element, {
			scale: 2,
		});
		const data = canvas.toDataURL("image/png");

		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "px",
			format: "a4",
		});

		const imgProperties = pdf.getImageProperties(data);
		const pdfWidth = pdf.internal.pageSize.getWidth();

		const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

		pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
		pdf.save("customerReport.pdf");
	};

	if (isLoading) {
		return <div>loading...</div>;
	}

	return (
		<div className="customer-report">
			<div className="container" ref={printRef}>
				<header className="header">
					<div className="right-header">
						<h2>Aashray Realty</h2>
						<p>
							1003 One World West, T-Junction,
							<br /> S.P. Ring Road, Near Ambli,
							<br />
							Ahmedabad-380058
							<br />
							<br />
						</p>
						<p>
							Date: <span id="currentDate"> {new Date().toLocaleDateString()} </span>
						</p>
					</div>
					<h1>Customer Report</h1>
				</header>

				<table className="table">
					<thead>
						<tr>
							<th>Customer ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Address</th>
							<th>Phone</th>
							<th>Joined On</th>
						</tr>
					</thead>
					<tbody>
						{customers?.map((customer) => {
							return (
								<tr>
									<td>{customer.id.slice(0, 5)}...</td>
									{/* <td>{new Date(booking.date).toLocaleDateString()}</td> */}
									<td>{customer.name}</td>
									<td>{customer.email}</td>
									<td>{customer.address}</td>
									<td>{customer.phoneNumber}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				<script>
					document.getElementById("currentDate").innerText = new
					Date().toLocaleDateString();
				</script>
			</div>
      <button className="button" onClick={handleDownloadPdf}>Download PDF</button>
		</div>
	);
};

export default OrderReport;
