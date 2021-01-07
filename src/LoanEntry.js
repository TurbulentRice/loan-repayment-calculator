import React from 'react';
import { Button, Form, Col } from "react-bootstrap";

const LoanEntry = props => {
  const { title, startBalance, interestRate, paymentAmount } = props.values;


  // Input handlers
  const handleTitleChange = e => {
    props.updateState({title: e.target.value})
  }
  const handleStartBalChange = e => {
    props.updateState({startBalance: e.target.value})
  }
  const handleInterestChange = e => {
    props.updateState({interestRate: e.target.value})
  }
  const handlePaymentChange = e => {
    props.updateState({paymentAmount: e.target.value})
  }
  const handleLoanEntrySubmit = e => {
    // Prevent page reloading and have App make loan/update state
    e.preventDefault();
    props.submitNewLoan()
  }

  return (
  <div id="loanEntryDiv" className="loan-entry p-2">
        <Form onSubmit={handleLoanEntrySubmit}>
          <Form.Row>
            <Col>
              {/* <Form.Label>Title:</Form.Label> */}
              <Form.Control placeholder="Title" value={title} onChange={handleTitleChange}/>
            </Col>
            <Col>
              <Form.Control placeholder="Start balance" value={startBalance} onChange={handleStartBalChange}/>
            </Col>
            <Col>
              <Form.Control placeholder="Interest rate (%APR)" value={interestRate} onChange={handleInterestChange}/>
            </Col>
            <Col>
              <Form.Control placeholder="Monthly payment" value={paymentAmount} onChange={handlePaymentChange}/>
            </Col>
            <Button className="btn btn-primary" type="submit">
            Add
            </Button>
          </Form.Row>
          
        </Form>
      </div>
  )
}

export default LoanEntry;