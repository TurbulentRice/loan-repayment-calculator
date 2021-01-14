import React from 'react';
import PriorityQueue from '../utility/priorityQueue.js'
import LoanView from './LoanView.js'
import LoanIndex from './LoanIndex';
import { Button } from 'react-bootstrap';

/*
Main display container, housing
1) LoanIndex - list of Loan objects currently held in App.js
2) LoanView - chart, info, and controller of Loan branch projections

Keeps track of in state:
1) Index of currently selected Loan object in props
  Dynamically keeps
*/


// Props:
// Loans, removeLoan()
class LoanDisplay extends React.Component {
  constructor(props) {
    super(props)
    // Don't copy props!
    // state.currentlySelected will only point to the index of
    // currently selected Loan obj in props
    this.state = {
      queueToggle: false,
      currentlySelected: 0
    }
    
  }

  // Passed to LoanIndex, receives reference to loan Obj to display
  selectLoan = selectedLoan => {
    this.setState({currentlySelected: this.props.loans.findIndex(loan => loan === selectedLoan)})
  }

  removeLoan = loan => {
    // Call props.removeLoan
    this.props.removeLoan(loan)
    // Adjust currentlySelected to reflect change in LoanIndex
    this.setState(prevState => ({currentlySelected: prevState.currentlySelected && prevState.currentlySelected - 1}))
  }

  toggleQueueView = () => {
    this.setState((prevState => ({queueToggle: !prevState.queueToggle})))
  }

  render() {
    return (
      <div className="loan-display row p-2 m-0">

        <div className="col-4 p-2 m-0">
          <LoanIndex loans={this.props.loans} selectLoan={this.selectLoan} removeLoan={this.removeLoan}/>
          {(this.props.loans.length > 0) && <Button className="mt-2" block onClick={this.toggleQueueView} >Show all loans</Button>}
        </div>


        <LoanView currentLoan={
          this.state.queueToggle ? new PriorityQueue(this.props.loans)
          : this.props.loans[this.state.currentlySelected]}/>

        

      </div>
      
    )
  }
}

export default LoanDisplay
