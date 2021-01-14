import React from 'react';
import './App.css';
import Loan from './utility/loan.js'
import LoanEntry from './components/LoanEntry.js'
import LoanDisplay from './components/LoanDisplay.js';


class App extends React.Component {
  constructor() {
    super()
    /*
    App will hold all user's Loan objects in state, and pass down
    references as props as needed.
    
    Provides methods for adding / removing Loan objs, which will update the
    child components who are displaying them.
    */
    this.state = {
      loans: []
      }
  }

  // Passed down to LoanEntry via props
  // Receives loan ingredients, creates + stores new Loan obj in state
  submitNewLoan = (loanIngredients) => {
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
