import Loan from './loan.js'

export default class PriorityQueue {
    constructor(loanList, monthlyBudget, title) {
        this.Queue = [...loanList];
        this.monthlyBudget = monthlyBudget;
        this.title = title || "Untitled";
    }

    // Primary attribute getters/setters
    set monthlyBudget (budget) {
        this._monthlyBudget = Loan.round(budget) || this.derivedMonthlyBudget;
    }
    get monthlyBudget () {
        return this._monthlyBudget;
    }

    // Utility methods
    get size() {
        return this.Queue.length;
    }
    get duration() {
        return Math.max(...this.Queue.map(loan => loan.currentPaymentNum));
    }
    get numPayments() {
        return this.Queue.reduce((a, b) => a + b.currentPaymentNum, 0);
    }
    get principalPaid() {
        return Loan.round(this.Queue.reduce((a, b) => a + b.principalPaid, 0));
    }
    get interestPaid() {
        return Loan.round(this.Queue.reduce((a, b) => a + b.interestPaid, 0));
    }
    get totalPaid() {
        return Loan.round(this.Queue.reduce((a, b) => a + b.totalPaid, 0));
    }
    get startBalance() {
        return this.Queue.reduce((a, b) => a + b.startBalance, 0);
    }
    get avgInterestRate() {
        return Loan.round(this.Queue.reduce((a, b) => a + b.interestRate, 0) / this.size);
    }
    // Queue payoff efficiency tester methods
    get avgPercentPaidToInterest() {
        return Loan.round((this.interestPaid / this.totalPaid) * 100);
    }
    get avgPercentPaidToPrincipal() {
        return Loan.round((this.principalPaid / this.totalPaid) * 100);
    }
    // Average principalEfficiency value across all Loans in Queue
    get avgPrincipalEfficiency() {
        return Loan.round(this.Queue.reduce((a, b) => a + b.principalEfficiency, 0) / this.size); 
    }
    // Total principal paid / total interest paid (likely same as above)
    get normalPrincipalEfficiency() {
        return Loan.round(this.principalPaid / this.interestPaid); 
    }


    get minMonthlyBudget() {
        return Loan.round(this.Queue.reduce((a, b) => a + b.minPayment, 0));
    }
    // Monthly budget derived from all Loan obj payment amts
    get derivedMonthlyBudget() {
        return Loan.round(this.Queue.reduce((a, b) => a + b.paymentAmount, 0));
    }

    get queueInfo() {
        return {
            title: this.title,
            startBalance: this.startBalance,
            avgInterestRate: this.avgInterestRate,
            totalPaid: this.totalPaid,
            interestPaid: this.interestPaid,
            principalPaid: this.principalPaid
        }
    }


    // Payment configuration methods
    isComplete() {
        return this.Queue.every(loan => loan.isComplete());
    }

    addLoan(newLoan) {
        newLoan instanceof Loan && this.Queue.push(newLoan);
    }

    addLoans(newLoans) {
        newLoans instanceof Array && newLoans.forEach(loan => this.addLoan(loan))
    }

    // Return a new PriorityQueue object of branched loans from instance
    branchQueue() {
        return new PriorityQueue(this.Queue.map(loan => loan.branch()), this.monthlyBudget, (this.title +`(branch)`))
    }

    prioritizeLoans(key) {
        let sortFunc = key === 'avalanche' ? (a, b) => a === b ? a.currentBalance - b.currentPaymentNum : a.interestRate - b.interestRate 
        : key === 'blizzard' ? (a, b) => a.interestDue - b.interestDue
        : (a, b) => b.currentBalance - a.currentBalance

        this.Queue.sort(sortFunc)
    }

    // Set paymentAmount attribute for each loan in Queue based on minimum target key
    // Return remainder after minimum is satisfied
    setPayments(target) {
        let budget = this.monthlyBudget;
        const setPaymentFunc = {
            interest: (loan) => loan.paymentAmount = loan.interestDue,
            minimum: (loan) => loan.paymentAmount = loan.minPayment,
            equal: (loan) => loan.paymentAmount = (this.monthlyBudget / this.size)
        }

        this.Queue.forEach(loan => {
            setPaymentFunc[target](loan)
            budget -= loan.paymentAmount
        })
        return budget;
    }

    // Determine and set paymentAmounts for each loan
    distributePayments(key, remainder) {
        // Spread-style dsitribution, Cascade and Ice Slide only
        // Cascade spreads remainder proportional to impact on total IR
        // Ice Slide spreads remainder proportional to impact on total MI
        const spreadRemainder = () => {
            const total = (key === "cascade")
                ? this.Queue.reduce((a, b) => a + b.interestRate, 0)
                : this.Queue.reduce((a, b) => a + b.interestDue, 0)

            const extra = (key === "cascade")
                ? this.Queue.map(loan => (loan.interestRate / total) * remainder)
                : this.Queue.map(loan => (loan.interestDue / total) * remainder)

            this.Queue.forEach((loan, index) => loan.paymentAmount = extra[index])
            }
        // Target-style distribution (give target element 100% of remainder)
        const targetRemainder = () => {
            this.Queue[this.size-1].paymentAmount += remainder
        }

        (key === 'cascade' || key ==='iceSlide')
            ? spreadRemainder() : targetRemainder()
    }

    // Algorithm methods
    
    // Return a config object ticket, used by debt solve to customize solve
    // queueConfig(strategyName) {
    //     const config = {
    //         avalanche: {},
    //         blizzard: {},
    //         snowball: {},
    //         cascade: {},
    //         iceSlide: {}  
    //     }
    // }

    // Main algo driver, solve-in-place, returns completed PriorityQueue
    debtSolve(key, minimum) {
        let orderOnce = (key === 'avalanche' || key === 'snowball')
        let orderEvery = (key === 'blizzard')

        // Create tempQueue and completedQueue empty structures
        let tempQueue = this.branchQueue()
        let completedQueue = new PriorityQueue([], this.monthlyBudget, this.title+`(${key})`)

        orderOnce && tempQueue.prioritizeLoans(key)

        // 4) Execute until all loans popped from temp->completed
        while (tempQueue.size > 0) {
            // 3) Step through payments until at least one is complete
            while (tempQueue.Queue.every(loan => !loan.isComplete())) {
                orderEvery && tempQueue.prioritizeLoans(key)

                // Set payments and get remainder, handle negative
                let remainder = tempQueue.setPayments(minimum)
                if (remainder <= 0) {
                    alert('Budget cannot cover payments')
                    return this;
                }

                tempQueue.distributePayments(key, remainder)

                // Make one payment for each loan in temp
                tempQueue.Queue.forEach(loan => loan.payMonth())
            }
            // Add completed loans to completed
            completedQueue.addLoans(tempQueue.Queue.filter(loan => loan.isComplete()))
            // Remove completed loans from tempQueue
            tempQueue.Queue = tempQueue.Queue.filter(loan => !(loan.isComplete()))
        }
        return completedQueue
    }

    // ############################################################
    //      REPAYMENT STRATEGIES
    // ############################################################
    // # ORDERED:       Focus on targeting a single loan each cycle,
    // #                paying only minimums on all except target,
    // #                paying one off at a time
    // ############################################################
    // Avalanche:       Order loans by interest rate, balance,
    // #                target highest ir until all paid off.
    // #                Consistently results in lowest interest paid
    // #                over course of large loans.
    avalanche(minimum='minimum') {
        return this.debtSolve('avalanche', minimum)
    }
    // ############################################################
    // # Blizzard:      Order loans by monthly interest cost,
    // #                target most expensive until all paid off.
    // #                Provides some benefits for small loans,
    // #                and/or large budgets
    blizzard(minimum='minimum') {
        return this.debtSolve('blizzard', minimum)
    }
    // ############################################################
    // # Snowball:      Order loans by balance, target loan with
    // #                lowest starting bal, pay until all paid off.
    // #                Largely motivaitonal, not cost-effective.
    snowball(minimum='minimum') {
        return this.debtSolve('snowball', minimum)
    }
    // ############################################################
    // # UNORDERED:     Focus on spreading payments strategically, rather
    // #                than strict targeting. In the short term, these
    // #                methods can reduce monthly cost.
    // ############################################################
    // # Cascade:       Unordered, distribute % of budget to each loan
    // #                proportional to its % contribution to total
    // #                interest rate of all loans.
    cascade(minimum='minimum') {
        return this.debtSolve('cascade', minimum)
    }
    // ############################################################
    // # Ice Slide:     Unordered, distribute % of budget to each loan
    // #                proportional to its % contribution to total
    // #                monthly cost (minimum payments) of all loans.
    iceSlide(minimum='minimum') {
        return this.debtSolve('iceSlide', minimum)
    }

    // return a list of completed (isComplete()) PriorityQueues
    // represents all repayment strategies
    // Can then be ordered by PriorityQueue.getInterestPaid(), etc...
    methodCompare(minimum='minimum') {
        return [
            this.avalanche(minimum),
            this.blizzard(minimum),
            this.cascade(minimum),
            this.iceSlide(minimum),
            this.snowball(minimum)
        ].sort((a, b) => (a.interestPaid - b.interestPaid))
    }
}
