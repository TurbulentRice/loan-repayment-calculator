import React from 'react';
import Plot from 'react-plotly.js';
// import Loan from './loan.js'
// import {Button} from "react-bootstrap";


// Card containing graph and info tied to a loan object
// Rather than keep state specific to the LoanView component obj,
// model this separately using purely the Loan and PriorityQueue data structures
// Use LoanView to model a generic loan obj with whatever properties


const LoanView = ({ loan }) => {
  // Logic: if loan is missing/incomplete, do not continue
  if (!loan) return <div></div> ;


  const makeLoanTrace = loan => [{
    x: [...loan.paymentHistory.paymentNum],
    y: [...loan.paymentHistory.balance],

  }]
  

  // const { startBalance, interestRate, paymentAmount, title, term } = loan;
  const loanInfo = (loan) => (
    <section>
      <div className="row">
        
      </div>
      <p>Title: {loan.title}</p>
      <p>Start balance: ${loan.startBalance}</p>
      <p>Interest rate: {loan.interestRate}% APR</p>
      <p>Payment amount: ${loan.paymentAmount}</p>
      <p>Term: {loan.term} months ({loan.term/12} years)</p>
      <p>Payments made: {loan.currentPaymentNum}</p>
    </section>
  )

  return (
    <div className="loan-view border rounded col-8 mt-2 pl-0 pb-0 pt-3">
      <div className="row">
        <div className="col-8">
          <Plot
          data={makeLoanTrace(loan.solveInPlace())}

          />
        </div>
        <div className="loan-info col-4 d-flex justify-content-right">
          {loanInfo(loan.solveInPlace())}
        </div>
      </div>
      
    </div>
    
  )
}
export default LoanView;
