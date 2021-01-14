import React from 'react';
import './App.css';
import Loan from './utility/loan.js'
import LoanEntry from './components/LoanEntry.js'
import LoanDisplay from './components/LoanDisplay.js';


class App extends React.Component {
  constructor() {
    super()
    /*
    Loans in state will be identified by index in array? This is simplest
    As opposed to empty object that is dynamically filled with title: Loan pairs
    Advantage of empty Obj: adding new Loan with dup title will overwrite first,
    and Loans can be accessed by this.state[title], rather than this.state.loans[index]
    Advantage of Array: map/filter loan objs
    */
    this.state = {
      loans: []
      }
  }

  // Passed down to LoanEntry form via props
  // Receives loan ingredients, creates + stores new Loan obj in state
  submitNewLoan = (loanIngredients) => {
    // This is where some optimizing can happen before Loan construction
    // I.E. check ingredients for empties, make sure what we pass is good
    this.setState(prevState => ({loans: [...prevState.loans, new Loan(loanIngredients)]}))
  }

  // Passed down to LoanDisplay -> LoanIndex -> LoanIndexItem via props,
  // Receives reference to loan obj, removes Loan obj in state that matches ref
  removeLoan = (loanToDelete) => {
    this.setState(prevState => ({loans: prevState.loans.filter(loan => loan !== loanToDelete)}))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header p-5">
          Loan Repayment Calculator
        </header>

        <div className="row">
          <div className="loanEntryCol col">

            <LoanEntry submitNewLoan={this.submitNewLoan}/>

          </div>
        </div>

        <LoanDisplay 
          loans={this.state.loans}
          removeLoan={this.removeLoan}/>

      </div>
    );
  }
}

export default App;
