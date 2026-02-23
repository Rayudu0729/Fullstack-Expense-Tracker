import { Link } from 'react-router-dom';
import '../assets/styles/welcome.css';
import expenseIcon from '../assets/images/expense.png';
import cashIcon from '../assets/images/cashInHand.png';
import transactionIcon from '../assets/images/transaction.png';

function Welcome() {
    return (
        <div className="welcome-page">
            {/* ===== NAVBAR ===== */}
            <nav className="welcome-nav">
                <span className="nav-brand">MyWallet</span>
                <div className="nav-links">
                    <Link to="/auth/login" className="nav-link ghost">Log In</Link>
                    <Link to="/auth/register" className="nav-link filled">Get Started</Link>
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className="hero-section">
                <div className="hero-layout">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            Smart Finance Tracking
                        </div>
                        <h1>
                            Master Your<br />
                            <span className="gradient-text">Money Flow</span>
                        </h1>
                        <p className="hero-tagline">
                            Track expenses, plan budgets, and grow your savings with
                            intelligent insights. Take the guesswork out of your finances.
                        </p>
                        <div className="hero-actions">
                            <Link to="/auth/register">
                                <button className="btn-glow">Start Free →</button>
                            </Link>
                            <Link to="/auth/login">
                                <button className="btn-ghost">Log In</button>
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-orb">
                            <span className="orbit-item">📊</span>
                            <span className="orbit-item">💳</span>
                            <span className="orbit-item">📈</span>
                        </div>
                    </div>
                </div>
                <div className="scroll-indicator">↓</div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section className="stats-bar">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">10K+</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">₹5Cr+</div>
                        <div className="stat-label">Tracked This Month</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">99.9%</div>
                        <div className="stat-label">Uptime</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">4.9★</div>
                        <div className="stat-label">User Rating</div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="features-section">
                <div className="section-header">
                    <div className="section-tag">✦ Features</div>
                    <h2>Built for Your Wallet</h2>
                    <p>Powerful tools that make managing money feel effortless</p>
                </div>
                <div className="bento-grid">
                    <div className="bento-card">
                        <div className="bento-icon emerald">
                            <img src={expenseIcon} alt="Track Expenses" />
                        </div>
                        <h3>Expense Tracking</h3>
                        <p>Log every transaction in seconds. Categorize spending and see exactly where your money goes each day.</p>
                    </div>
                    <div className="bento-card">
                        <div className="bento-icon cyan">
                            <img src={cashIcon} alt="Budget Planning" />
                        </div>
                        <h3>Budget Planning</h3>
                        <p>Set monthly budgets and get instant alerts. Stay ahead of your goals with real-time progress tracking.</p>
                    </div>
                    <div className="bento-card">
                        <div className="bento-icon violet">
                            <img src={transactionIcon} alt="Smart Reports" />
                        </div>
                        <h3>Smart Reports</h3>
                        <p>Beautiful charts and analytics. Visualize income vs. expenses and make data-driven financial decisions.</p>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="how-it-works-section">
                <div className="section-header">
                    <div className="section-tag">✦ How It Works</div>
                    <h2>Up and Running in Minutes</h2>
                    <p>Three simple steps to financial clarity</p>
                </div>
                <div className="timeline">
                    <div className="timeline-step">
                        <div className="timeline-dot emerald">1</div>
                        <h3>Create Account</h3>
                        <p>Sign up in 30 seconds with your email. No credit card required.</p>
                    </div>
                    <div className="timeline-step">
                        <div className="timeline-dot cyan">2</div>
                        <h3>Track Everything</h3>
                        <p>Add income and expenses. Categorize them effortlessly.</p>
                    </div>
                    <div className="timeline-step">
                        <div className="timeline-dot violet">3</div>
                        <h3>Get Insights</h3>
                        <p>View dashboards and reports. Understand your spending patterns.</p>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Own Your <span className="gradient-text">Finances</span>?</h2>
                    <p>Join thousands of users who have transformed the way they manage money. It's free to get started.</p>
                    <Link to="/auth/register">
                        <button className="btn-glow">Create Free Account →</button>
                    </Link>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="welcome-footer">
                <p>© 2026 <span className="footer-brand">MyWallet</span>. Built by <a href="https://www.linkedin.com/in/saipraveena00829" target="_blank" rel="noopener noreferrer" className="footer-link">Saipraveena</a></p>
            </footer>
        </div>
    );
}

export default Welcome;