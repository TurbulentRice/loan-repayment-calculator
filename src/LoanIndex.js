import {ListGroup} from "react-bootstrap";

const LoanIndex = ({ loans, onSelectLoan }) => (
  <div className="col-4 p-2 m-0">
    <ListGroup>
      {loans.map((loan, index) => <LoanIndexItem loan={loan} key={index} id={index} onSelectLoan={onSelectLoan} />)}
    </ListGroup>
  </div>
)

const LoanIndexItem = ({ loan, id, onSelectLoan }) => {


  return (
    <ListGroup.Item action datakey={id} className="loan-index-item" onClick={onSelectLoan}>
      
      <section className="d-flex justify-content-between">
        <span><strong>{loan.title}</strong></span>
        <span>${loan.currentBalance}</span>
      </section>
      <section className="d-flex justify-content-between">
        
        <span>${loan.paymentAmount}/month</span>
        <span>{loan.interestRate}%</span>
      </section>
      

    </ListGroup.Item>
  )
}

export default LoanIndex