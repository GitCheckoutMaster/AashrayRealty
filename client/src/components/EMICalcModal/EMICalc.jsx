import React, { useMemo } from "react";
import { Modal } from "@mantine/core";
import "./EMICalcStyle.css";

const EMICalc = ({ opened, setOpened }) => {
	const [loanAmount, setLoanAmount] = React.useState(0);
	const [interestRate, setInterestRate] = React.useState(0);
	const [loanTenure, setLoanTenure] = React.useState(0);

	const emi = useMemo(() => {
		if (loanAmount > 0 && interestRate > 0 && loanTenure > 0) {
			const monthlyRate = interestRate / (12 * 100);
			const months = loanTenure * 12; 
			return (
				(loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
				(Math.pow(1 + monthlyRate, months) - 1)
			).toFixed(2);
		}
		return 0;
	}, [loanAmount, interestRate, loanTenure]);

	const totalInterest = useMemo(() => {
		return emi > 0 ? (emi * (loanTenure * 12) - loanAmount).toFixed(2) : 0;
	}, [emi, loanTenure, loanAmount]);

  const totalAmountPayable = useMemo(() => {
    return emi > 0 ? (emi * (loanTenure * 12)).toFixed(2) : 0;
  })

	return (
		<Modal
			title={
				<h2 style={{ color: "var(--primary)", fontSize: "24px" }}>
					EMI Calculator
				</h2>
			}
			opened={opened}
			onClose={() => setOpened(false)}
			size="md"
		>
			<div className="emi-calc">
				<div className="emi-calc__input">
					<label>Loan Amount</label>
					<input
						type="number"
						placeholder="Enter loan amount"
						onChange={(e) => setLoanAmount(e.target.value)}
					/>
				</div>
				<div className="emi-calc__input">
					<label>Interest Rate (yearly)</label>
					<input
						type="number"
						placeholder="Enter interest rate"
						onChange={(e) => setInterestRate(e.target.value)}
					/>
				</div>
				<div className="emi-calc__input">
					<label>Loan Tenure (in years)</label>
					<input
						type="number"
						placeholder="Enter loan tenure"
						onChange={(e) => setLoanTenure(e.target.value)}
					/>
				</div>
				<div className="emi-calc__output">
					<div className="emi-calc__output__item">
						<h3>EMI</h3>
						<p>
							Rs. {emi}
						</p>
					</div>
					<div className="emi-calc__output__item">
						<h3>Total Interest Payable</h3>
						<p>
							Rs. {totalInterest}
						</p>
					</div>
					<div className="emi-calc__output__item">
						<h3>Total Amount Payable</h3>
						<p>
							Rs. {totalAmountPayable}
						</p>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default EMICalc;
