import React from 'react';
import { Button, Form, Col } from "react-bootstrap";

// Keeps current form values in state
// Is passed submitNewLoan() via props from App, uses this to communicate with main app
// without having to store form state in App
class LoanEntry extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      startBalance: '',
      interestRate: '',
      paymentAmount: '',
      term: '',
      }
  }

  /*
  Input handlers
  In general, we don't want to confuse the utility data structures (Loan, PriorityQueue)
  To that end, ensure inputs are optimal for Loan object construction
  I.e. reject non-numbers
  */
  handleTitleChange = e => {
    this.setState({title: e.target.value})
  }
  handleStartBalChange = e => {
    !(isNaN(e.target.value)) && this.setState({startBalance: e.target.value})
  }
  handleInterestChange = e => {
    !(isNaN(e.target.value)) && this.setState({interestRate: e.target.value})
  }
  handlePaymentChange = e => {
    !(isNaN(e.target.value)) && this.setState({paymentAmount: e.target.value})
  }
  handleTermChange = e => {
    !(isNaN(e.target.value)) && this.setState({term: e.target.value})
  }

  handleLoanEntrySubmit = e => {
    // Prevent page reloading
    e.preventDefault();
    /*
    Snapshot current state values, send back up to App to create Loan obj
    We take a shallow copy here rather than simply sending this.state
    because App's submitNewLoan() will run asynchronously, and if LoanEntry state
    is reset before submitNewLoan runs, Loan parameters will be empty
    */
    this.props.submitNewLoan({...this.state})
    // Reset form state, triggering rerender of form
    this.setState({
      title: '',
      startBalance: '',
      interestRate: '',
      paymentAmount: '',
      term: ''
    })
  }

  render() {
    const {title, startBalance, interestRate, paymentAmount, term} = this.state;
    return (
      <div id="loanEntryDiv" className="loan-entry p-2">
            <Form onSubmit={this.handleLoanEntrySubmit}>
              <Form.Row>
                <Col>
                  {/* <Form.Label>Title:</Form.Label> */}
                  <Form.Control placeholder="Title" value={title} onChange={this.handleTitleChange}/>
                </Col>
                <Col>
                  <Form.Control placeholder="Start balance" value={startBalance} onChange={this.handleStartBalChange}/>
                </Col>
                <Col>
                  <Form.Control placeholder="Interest rate (%APR)" value={interestRate} onChange={this.handleInterestChange}/>
                </Col>
                <Col>
                  <Form.Control placeholder="Monthly payment" value={paymentAmount} onChange={this.handlePaymentChange}/>
                </Col>
                <Col>
                  <Form.Control placeholder="Term (months)" value={term} onChange={this.handleTermChange}/>
                </Col>
                <Button className="btn btn-primary" type="submit">
                Add
                </Button>
              </Form.Row>
              
            </Form>
          </div>
      )
  }
}

export default LoanEntry;