// Loan class

/*
Terms:
    "Solvable loan": A Loan object that can eventually be paid
    off with its current balance/interest/payment values,
    I.E can call payOff() or solveInPlace() without error or infinte loop 
*/

// Takes an object in form:
// {startBalance: , interestRate: , paymentAmount: , title:, term: }
export default class Loan {
    constructor({ startBalance, interestRate, paymentAmount, title, term }) {
        // Loan title and term (in months)
        this.title = title || "Untitled";
        this.term = term || 0;
        // Primary attributes
        this.startBalance = startBalance;
        // Payment history object (state)
        this.paymentHistory = {
            balance: [this.startBalance],
            principal: [0],
            interest: [0],
            paymentNum: [0]
        }
        this.interestRate = interestRate;
        this.paymentAmount = paymentAmount;
    }

    // Static rounding function - in place of Decimal object
    static round(number) {
        return Math.round(number * 100) / 100;
    }

    // Primary attribute getter/setters
    // These will allow safe editing of properties and reduce unexpected behavior

    // Start Balance
    set startBalance(balance) {
        this._startBalance = (balance === undefined || balance === '') ? 0
            : Loan.round(balance);
    }
    get startBalance() {
        return this._startBalance;
    }

    // Interest Rate
    set interestRate(rate) {
        this._interestRate = (rate === undefined || rate === '') ? 0
            : Loan.round(rate);
    }
    get interestRate() {
        return this._interestRate;
    }

    // Payment Amount
    // If this is too low then it will be unsolveable
    // 
    set paymentAmount(amount) {
        this._paymentAmount = Loan.round(amount) || Loan.round(this.minPayment);
    }
    get paymentAmount() {
        return this._paymentAmount
    }

    // Utility property getters

    /* minPayment()
        Returns either:
            1) Payment necessary to complete Loan on time (based on term & ir)
            2) Absolute minimum payment necessary to yield a solvable Loan
        - If interestRate is 0, this will yield a divide by 0 error
        - If term is 0 or omitted, this will not yield a helpful number
        In either of these cases, minPayment will default to interestDue + 1
        This is useful behavior because we usually call this to determine
        a reasonable paymentAmount that will not throw an error or result
        in an unsolvable loan (one that will never be paid off)
    */
    get minPayment() {
        // Discount factor = {[(r+1)n]-1}/[r(1+r)^n]
        const [r, n] = [this.monthlyIR, this.term]
        const discountFactor = () => {
            return (((r + 1) ** n) - 1) / (r * (r + 1) ** n)
        }
        return (r && n) ? (this.startBalance / discountFactor()) : this.interestDue + 1
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
    // Loan efficiency testing methods
    // If no payments made, return 0 to avoid divide by 0 error
    get percentPaidToInterest() {
        return !this.totalPaid ? 0 : Loan.round((this.interestPaid / this.totalPaid) * 100)
    }
    get percentPaidToPrincipal() {
        return !this.totalPaid ? 0 : Loan.round((this.principalPaid / this.totalPaid) * 100)
    }
    get principalEfficiency() {
        return !this.totalPaid ? 0 : Loan.round(this.principalPaid / this.interestPaid)
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

        // Never overpay, but may continue to pay 0
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
        return new Loan({
            startBalance: this.currentBalance,
            interestRate: this.interestRate,
            paymentAmount: this.paymentAmount,
            title: this.title + '(branch)',
            term: this.term
        })
    }

    solveInPlace() {
        const branch = this.branch();
        return branch.payOff() ? branch : this;
    }
}