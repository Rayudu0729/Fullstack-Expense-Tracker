import incomeImg from '../../assets/images/income.png'
import expenseImg from '../../assets/images/expense.png'
import cashInHandImg from '../../assets/images/cashInHand.png'
import transactionImg from '../../assets/images/transaction.png'

function DashboardDetailBox({ total_income, total_expense, cash_in_hand, no_of_transactions }) {

    return (
        <div className='details'>
            <div className='detail-card detail-income'>
                <div className='detail-icon-wrap emerald'>
                    <img src={incomeImg} alt="Income" />
                </div>
                <div className='detail-info'>
                    <span className='detail-label'>Income</span>
                    <span className='detail-value'>₹{total_income.toLocaleString()}</span>
                </div>
            </div>
            <div className='detail-card detail-expense'>
                <div className='detail-icon-wrap rose'>
                    <img src={expenseImg} alt="Expense" />
                </div>
                <div className='detail-info'>
                    <span className='detail-label'>Expense</span>
                    <span className='detail-value'>₹{total_expense.toLocaleString()}</span>
                </div>
            </div>
            <div className='detail-card detail-cash'>
                <div className='detail-icon-wrap cyan'>
                    <img src={cashInHandImg} alt="Cash in Hand" />
                </div>
                <div className='detail-info'>
                    <span className='detail-label'>Cash in Hand</span>
                    <span className='detail-value'>₹{cash_in_hand.toLocaleString()}</span>
                </div>
            </div>
            <div className='detail-card detail-transactions'>
                <div className='detail-icon-wrap violet'>
                    <img src={transactionImg} alt="Transactions" />
                </div>
                <div className='detail-info'>
                    <span className='detail-label'>Transactions</span>
                    <span className='detail-value'>{no_of_transactions}</span>
                </div>
            </div>
        </div>
    )
}

export default DashboardDetailBox;