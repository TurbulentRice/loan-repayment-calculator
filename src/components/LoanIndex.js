import LoanIndexItem from "./LoanIndexItem.js"
import { ListGroup} from "react-bootstrap";

// List of LoanIndexItems
// props: loans, selectLoan, removeLoan
const LoanIndex = ({ loans, selectLoan, removeLoan }) => (

    <ListGroup>
      {loans.map((loan, index) => <LoanIndexItem loan={loan} selectLoan={selectLoan} removeLoan={removeLoan} key={index} />)}
    </ListGroup>

)

export default LoanIndex