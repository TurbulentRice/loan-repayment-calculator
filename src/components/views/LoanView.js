// import Loan from '../../utility/loan';
import LinePlot from './viewChildren/ModelPlot.js'
import InfoCard from './viewChildren/InfoCard.js'

// *VIEW* component
// Houses *MODEL* in 


// Sibling component to QueueView

// Receives currentlySelected Loan via props
// Card containing graph and info tied to a loan object
// Rather than keep state specific to the LoanView component obj,
// model this separately using purely the Loan and PriorityQueue data structures
// Use LoanView to model a generic loan obj with whatever properties
const LoanView = ({ currentLoan }) => {

  // Logic: if currentLoan is missing/incomplete, do not continue
  if (!currentLoan) return <div></div>;

  // Otherwise, make a solved Loan to display
  // Depending on Tool toggle, this can 
  const loanToDisplay = currentLoan.solveInPlace();

  // Takes a Loan object, makes traces
  const makeLoanTrace = loan => [{
    x: [...loan.paymentHistory.paymentNum],
    y: [...loan.paymentHistory.balance],
  }]

  return (
    
    <div className="view-parent border rounded">

      <InfoCard info={loanToDisplay.loanInfo}/>

      <LinePlot plotData={makeLoanTrace(loanToDisplay)}/>  
        
    </div>
    
  )
}
export default LoanView;
