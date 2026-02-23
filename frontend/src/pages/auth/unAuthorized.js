import { useNavigate, Link } from "react-router-dom";
import '../../assets/styles/forgotPassword.css';

function UnAuthorizedAccessPage() {
    const navigate = useNavigate();

    return (
        <div className='fp-page'>
            {/* Decorative orbs */}
            <div className="fp-orb orb-top-right"></div>
            <div className="fp-orb orb-bottom-left"></div>

            <div className='fp-card' style={{ textAlign: 'center' }}>
                {/* Brand */}
                <div className="fp-brand">
                    <Link to="/" className="fp-brand-name">MyWallet</Link>
                </div>

                {/* Error icon */}
                <div style={{
                    fontSize: '64px',
                    marginBottom: '16px',
                    animation: 'fpScaleIn 0.6s ease-out 0.2s both'
                }}>
                    🔒
                </div>

                {/* Header */}
                <div className="fp-header">
                    <h2>401 — Unauthorized</h2>
                    <p>You don't have permission to access this page</p>
                </div>

                {/* Error message */}
                <div className='fp-error' style={{ marginBottom: '28px' }}>
                    Sorry, it looks like you attempted to access a page you're not authorized to view. Try refreshing or go back to the home page.
                </div>

                {/* Home button */}
                <button className="fp-submit-btn" onClick={() => navigate("/")}>
                    ← Go to Home
                </button>

                {/* Login link */}
                <div className='fp-login-link'>
                    Need to sign in? <Link to="/auth/login">Sign in here</Link>
                </div>
            </div>
        </div>
    )
}
export default UnAuthorizedAccessPage;