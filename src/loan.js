// Loan class

// Argument option?
// {startBalance: , interestRate: , paymentAmount: , title:, term: }

export default class Loan {
  constructor(startBalance, interestRate, paymentAmount, title, term) {
    // Loan title and term (in months)
    this.title = title || "Untitled";
    this.term = term || 12;
    // Primary attributes
    this.startBalance = startBalance;
    this.interestRate = interestRate;
    this.paymentAmount = paymentAmount;
    // Payment history object (state)
    this.paymentHistory = {
        balance: [this.startBalance],
        principal: [0],
        interest: [0],
        paymentNum: [0]
    }
  }

  // Static rounding function - in place of Decimal object
  static round(number) {
      return Math.round(number * 100) / 100;
  }

  // Primary attribute getter/setters
  // These will allow us safer editing of properties

  // Start Balance
  set startBalance(balance) {
      this._startBalance = (balance === undefined) ? 0
          : Loan.round(balance);
  }
  get startBalance() {
      return this._startBalance;
  }

  // Interest Rate
  set interestRate(rate) {
      this._interestRate = Loan.round(rate) || 5;
  }
  get interestRate() {
      return this._interestRate;
  }

  // Payment Amount
  set paymentAmount(amount) {
      this._paymentAmount = amount ? Loan.round(amount)
        : Loan.round(this.minPayment) || 0
  }
  get paymentAmount() {
      return this._paymentAmount
  }

  // Utility property getters

  get minPayment() {
      // Discount factor = {[(r+1)n]-1}/[r(1+r)^n]
      const discountFactor = () => {
          const [r, n] = [this.monthlyIR, this.term]
          return (((r + 1) ** n) - 1) / (r * (r + 1) ** n)
      }
      return this.startBalance / discountFactor()
  }
  get currentPaymentNum() {
      return this.paymentHistory.paymentNum[this.paymentHistory.paymentNum.length-1];
  }
  get currentBalance() {
      return this.paymentHistory.balance[this.currentPaymentNum];
  }
  get monthlyIR() {
      return (this.interestRate / 12) / 100;
  }
  get interestDue() {
      return this.monthlyIR * this.currentBalance;
  }
  get interestPaid() {
      return this.paymentHistory.interest.reduce((a, b) => a + b, 0);
  }
  get principalPaid() {
      return this.paymentHistory.principal.reduce((a, b) => a + b, 0);
  }
  get totalPaid() {
      return this.interestPaid + this.principalPaid;
  }
  get loanInfo() {
      return {
          title: this.title,
          startBalance: this.startBalance,
          interestRate: this.interestRate,
          totalPaid: this.totalPaid,
          interestPaid: this.interestPaid,
          principalPaid: this.principalPaid
      }
  }

  // Payment methods

  // This should ideally check balance === 0, but until we have
  // precise Decimal math, can't be sure it will come out to 0
  isComplete() {
      return (this.currentBalance <= 0);
  }

  installPayment(balance, principal, interest) {
      this.paymentHistory.balance.push(Loan.round(balance))
      this.paymentHistory.principal.push(Loan.round(principal))
      this.paymentHistory.interest.push(Loan.round(interest))
      this.paymentHistory.paymentNum.push(this.currentPaymentNum + 1)
  }

  payMonth() {
      // Get interest due, subtract from principal payment
      let [interestPayment, principalPayment] = [this.interestDue, this.paymentAmount - this.interestDue];

      // Never overpay
      principalPayment > this.currentBalance && (principalPayment = this.currentBalance);

      const fwdBalance = this.currentBalance - principalPayment

      // Payment won't cover interest, entire payment goes to interest
      principalPayment < 0 && ([interestPayment, principalPayment] = [this.paymentAmount, 0]);

      this.installPayment(fwdBalance, principalPayment, interestPayment)
  }


  payMonths(numMonths) {
      for (let i = 0; i < numMonths; i++) {
          if (this.isComplete()) break
          this.payMonth();
      }
  }

  payOff() {
      // Handle infinite loop
      if (this.paymentAmount <= this.interestDue) return false

      while (!this.isComplete()) {
          this.payMonth();
      }
      return true;
  }

  branch() {
      return new Loan(
          this.currentBalance,
          this.interestRate,
          this.paymentAmount,
          this.title + '(branch)',
          this.term
          )
  }

  solveInPlace() {
      const branch = this.branch();
      return branch.payOff() ? branch : this;
  }
}