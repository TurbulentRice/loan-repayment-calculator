import React from 'react';
import './App.css';
import Loan from './loan.js'
import LoanEntry from './LoanEntry.js'
import LoanDisplay from './LoanDisplay';


class App extends React.Component {
  // state here will represent:
  // Form values and Loan data model
  // pass down values as props as necessary
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      startBalance: '',
      interestRate: '',
      paymentAmount: '',
      term: '',
      loans: []
      }
  }

  // Single change state function, takes a k/v pair and sets state
  updateState = (stateObject) => {
    this.setState(stateObject)
  }

  // Snapshot state data, create + store Loan obj
  submitNewLoan = () => {
    const newLoan = new Loan(
      this.state.startBalance,
      this.state.interestRate,
      this.state.paymentAmount,
      this.state.title,
      this.state.term)
    // add loan to state and reset fields
    this.updateState({
      title: '',
      startBalance: '',
      interestRate: '',
      paymentAmount: '',
      term: '',
      loans: [...this.state.loans, newLoan]
    })
  }

  removeLoan = (loanToDelete) => {
    this.updateState({loans: this.state.loans.filter(loan => loan !== loanToDelete)})
  }




  render() {
    return (
      <div className="App">
        <header className="App-header p-5">
          Loan Repayment Calculator
        </header>

        <div className="row">
          <div className="loanEntryCol col">
            <LoanEntry 
              submitNewLoan={this.submitNewLoan}
              updateState={this.updateState}
              values={this.state}/>
          </div>
        </div>
        <LoanDisplay loans={this.state.loans}/>
      </div>
    );
  }
}

export default App;
