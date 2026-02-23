import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../../../assets/styles/forgotPassword.css';

function RegistrationSuccess() {
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

                {/* Success icon */}
                <div style={{
                    fontSize: '64px',
                    marginBottom: '16px',
                    animation: 'fpScaleIn 0.6s ease-out 0.2s both'
                }}>
                    🎉
                </div>

                {/* Header */}
                <div className="fp-header">
                    <h2>You're All Set!</h2>
                    <p>Your account has been successfully created</p>
                </div>

                {/* Success message */}
                <div className='fp-info' style={{ marginBottom: '28px' }}>
                    Congratulations! Your email has been verified and your account is ready to use.
                </div>

                {/* Login button */}
                <Link to='/auth/login' style={{ textDecoration: 'none' }}>
                    <button className="fp-submit-btn">
                        Sign In Now →
                    </button>
                </Link>
            </div>
        </div>
    )
}
export default RegistrationSuccess;