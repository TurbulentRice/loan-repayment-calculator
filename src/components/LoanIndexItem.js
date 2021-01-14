import {ListGroup, Button} from "react-bootstrap";

// Individual LoanIndexItem
// props: Loan, selectLoan()
const LoanIndexItem = ({ loan, selectLoan, removeLoan }) => (
  <ListGroup.Item className="loan-index-item">

    <section className="d-flex justify-content-between">
      <span><strong>{loan.title}</strong></span>
      <span>${loan.currentBalance}</span>
    </section>

    <section className="d-flex justify-content-between">
      <span>${loan.paymentAmount}/month</span>
      <span>{loan.interestRate}%</span>
    </section>

    <section className="d-flex justify-content-between">
      <Button variant="link" size="sm" className="p-0" onClick={() => removeLoan(loan)}>
        Remove
        <svg width="1em" height="1em" className="bi bi-trash" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
        </svg>
      </Button>
      <Button variant="link" size="sm" className="p-0" onClick={() => selectLoan(loan)}>
        View Loan
        <svg width="1em" height="1em" viewBox="0 0 32 32" className="icon icon-arrow-right" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.975 17.504l14.287.001-6.367 6.366L16.021 26l10.004-10.003L16.029 6l-2.128 2.129 6.367 6.366H5.977z"/>
        </svg>
      </Button>
    </section>
    
  </ListGroup.Item>
)

export default LoanIndexItem;