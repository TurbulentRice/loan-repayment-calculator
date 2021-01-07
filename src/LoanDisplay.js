import React from 'react';
import LoanView from './LoanView.js'
import LoanIndex from './LoanIndex';

// Receives list of loan objects
class LoanDisplay extends React.Component {
  constructor(props) {
    super(props)
    // Grab the loan list
    // this.loans = props.loans;
    // Initialize state to first loan in list
    this.state = {
      currentlySelected: 0
    }
    
  }

  updateCurrentlySelected = e => {
    const index = Number(e.currentTarget.getAttribute('datakey'));
    console.log("index:", index)
    this.setState({currentlySelected: this.props.loans[index]})
  }

  render() {
    const { loans } = this.props;
    return (
      <div className="loan-display row p-2 m-0">
        {/* Display Index on left and View on right */}
        <LoanIndex loans={loans} onSelectLoan={this.updateCurrentlySelected}/>
        <LoanView loan={this.state.currentlySelected}/>
        {/* {loans.map((loan, index) => <LoanView loan={loan} key={index}/>)} */}
      </div>
    )
  }
}

export default LoanDisplay
