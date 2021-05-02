import React from 'react';
import LoanView from './views/LoanView.js'
import QueueView from './views/QueueView.js'
import LoanIndex from './index/LoanIndex';
import { Button } from 'react-bootstrap';

/*
Main info display container, housing
1) LoanIndex - list of Loan objects currently held in App.js
2) LoanView - chart, info, and controller of Loan branch projections

Receives from props:
1) Array of Loan objects from App state
2) removeLoan() bound method for filtering out a loan (by reference)
    from App state.loans

Keeps track of in state:
1) Index of currently selected Loan object in props.
    This is to avoid referencing props in state.
    Use getter this.currentlySelectedLoan to reference selected Loan directly.
2) Toggle for PriorityQueueView vs LoanView
*/

class LoanDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentlySelected: 0,
      queueToggle: false
    }
  }

  // Method for getting reference to currently selected loan
  get currentlySelectedLoan() {
    return this.props.loans[this.state.currentlySelected]
  }
  indexOfLoan(loanToFind) {
    return this.props.loans.findIndex(loan => loan === loanToFind)
  }

  // Update state.currentlySelected with new index value.
  // Passed down to LoanIndexItem
  // Receives reference to loan Obj itself (this is to avoid unexpected behavior)
  // If queueToggle is false, this will display the selected Loan in LoanView
  // If queueToggle is true, this will highlight the loan in QueueView
  selectLoan = selectedLoan => {
    this.setState((prevState, props) => ({
      currentlySelected: props.loans.findIndex(loan => loan === selectedLoan)
    }))
  }

  // Wrapper for App.removeLoan()
  // Adjusts currentlySelected to reflect change in LoanIndex if necessary
  removeLoan = loan => {
    // If currentlySelected === 0 or loan to remove's index > currentlySelected, don't decrement
    const shouldDecrement = !(!this.state.currentlySelected || (this.indexOfLoan(loan) > this.state.currentlySelected))
    // This way we avoid uneccesary calls to setState and additional renders
    shouldDecrement && this.setState(prevState => ({
      currentlySelected: prevState.currentlySelected - 1
    }))
    this.props.removeLoan(loan)
  }

  toggleQueueView = () => {
    this.setState((prevState => ({queueToggle: !prevState.queueToggle})))
  }

  render() {
    return (
      <div className="loan-display row p-2 m-0">

        <div className="col-4 p-2">
          <LoanIndex loans={this.props.loans} selectLoan={this.selectLoan} removeLoan={this.removeLoan}/>
          {(this.props.loans.length > 0) && <Button className="mt-2" block onClick={this.toggleQueueView} >Show all loans</Button>}
        </div>

        <div className="col-8 p-2">
          { // If queueToggle is on, render a QueueView with all loans from props
            // otherwise render a single LoanView with currentlySelectedLoan
            this.state.queueToggle
            ? <QueueView allLoans={this.props.loans}/>
            : <LoanView currentLoan={this.currentlySelectedLoan} />
          }
        </div>

        

      </div>
      
    )
  }
}

export default LoanDisplay;
