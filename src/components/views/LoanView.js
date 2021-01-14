import Plot from 'react-plotly.js';
import Loan from '../../utility/loan';
// import Loan from './loan.js'
// import {Button} from "react-bootstrap";

// Sibling component to PriorityQueueView

// Card containing graph and info tied to a loan object
// Rather than keep state specific to the LoanView component obj,
// model this separately using purely the Loan and PriorityQueue data structures
// Use LoanView to model a generic loan obj with whatever properties


// We want LoanView to handle not only Loan objects, but PriorityQueues as well
const LoanView = ({ currentLoan }) => {
  // Logic: if currentLoan is missing/incomplete, do not continue
  if (!currentLoan) return <div></div> ;

  // Check Loan vs PriorityQueue
  const isLoan = currentLoan instanceof Loan;


  // Takes a Loan object, makes traces
  const makeLoanTrace = loan => [{
    x: [...loan.paymentHistory.paymentNum],
    y: [...loan.paymentHistory.balance],

  }]

  // Takes a PriorityQueue object,
  // reduces to list of loan trace objects
  const makePriorityQueueTrace = queue => queue.Queue.reduce((a, b) => [...a, ...makeLoanTrace(b)], [])
  

  // const { startBalance, interestRate, paymentAmount, title, term } = loan;
  const loanInfo = (loan) => (
    <section>
      <p>Title: {loan.title}</p>
      <p>Start balance: ${loan.startBalance}</p>
      <p>Interest rate: {loan.interestRate}% APR</p>
      <p>Payment amount: ${loan.paymentAmount}</p>
      <p>Term: {loan.term} months ({loan.term/12} years)</p>
      <p>Payments made: {loan.currentPaymentNum}</p>
    </section>
  )
  const priorityQueueInfo = (queue) => (
    <section>
      {Object.entries(queue.queueInfo).map(([key, value], index) => <p key={index}>{key}: {value}</p>)}
    </section>
  )

  return (
    <div className="loan-view border rounded col-8 mt-2 pl-0 pb-0 pt-3">
      <div className="row">
        <div className="col-8">
          <Plot
          data={isLoan ? makeLoanTrace(currentLoan.solveInPlace()) : makePriorityQueueTrace(currentLoan.avalanche())}

          />
        </div>
        <div className="loan-info col-4 d-flex justify-content-right">
          {isLoan ? loanInfo(currentLoan.solveInPlace()) : priorityQueueInfo(currentLoan.avalanche())}
        </div>
      </div>
      
    </div>
    
  )
}
export default LoanView;
