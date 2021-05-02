import LinePlot from './viewChildren/ModelPlot.js'
import InfoCard from './viewChildren/InfoCard.js'
import PriorityQueue from '../../utility/priorityQueue';

// Sibling component to LoanView

// Receives list of all user's Loan objects via props
// Creates PriorityQueue object from props
const QueueView = ({ allLoans }) => {

  // Logic: if nothing is passed in, return an empty div
  if (!allLoans) return <div></div> ;

  // Otheriwse, make a new PriorityQueue object
  const currentQueue = new PriorityQueue(allLoans)

  // Change: Depending on tool toggle, change what history of currentQuue is displayed
  const queueToDisplay = currentQueue.avalanche();

  // Takes a PriorityQueue object, reduces to list of loan trace objects
  const makePriorityQueueTrace = queue => {
    // Takes a Loan object, makes traces
    const makeLoanTrace = loan => [{
      x: [...loan.paymentHistory.paymentNum],
      y: [...loan.paymentHistory.balance],
    }]

    return queue.Queue.reduce((a, b) => [...a, ...makeLoanTrace(b)], [])
  }

  return (

    <div className="view-parent border rounded">

      <InfoCard info={queueToDisplay.queueInfo}/>

      <LinePlot plotData={makePriorityQueueTrace(queueToDisplay)}/>

    </div>
    
  )
}
export default QueueView;
