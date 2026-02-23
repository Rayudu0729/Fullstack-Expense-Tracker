import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthService from '../../../services/auth.service';
import '../../../assets/styles/forgotPassword.css';

function ForgotPasswordChangePassword() {
    const navigate = useNavigate();
    const { email } = useParams();

    const { register, handleSubmit, watch, formState } = useForm();
    const password = useRef({});
    password.current = watch('password', "");

    const [response_error, setResponseError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        await AuthService.resetPassword(email, data.password).then(
            (response) => {
                console.log(response);
                if (response.data.status === "SUCCESS") {
                    setResponseError("");
                    navigate(`/auth/login`);
                } else {
                    setResponseError("Reset password failed: Something went wrong!");
                }
            },
            (error) => {
                if (error.response) {
                    const resMessage = error.response.data.response;
                    setResponseError(resMessage);
                    console.log(error.response);
                } else {
                    setResponseError("Reset password failed: Something went wrong!");
                }
            }
        );
        setIsLoading(false);
    };

    return (
        <div className='fp-page'>
            {/* Decorative orbs */}
            <div className='fp-orb orb-top-right'></div>
            <div className='fp-orb orb-bottom-left'></div>

            {/* Back to login */}
            <Link to='/auth/login' className='fp-back-link'>← Back to Login</Link>

            {/* Card */}
            <div className='fp-card'>
                {/* Brand */}
                <div className='fp-brand'>
                    <Link to='/' className='fp-brand-name'>MyWallet</Link>
                </div>

                {/* Header */}
                <div className='fp-header'>
                    <h2>Reset Password</h2>
                    <p>Create a new password for your account</p>
                </div>

                {/* Error */}
                {response_error !== "" && (
                    <div className='fp-error'>{response_error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='fp-field'>
                        <label>New Password</label>
                        <input
                            type='password'
                            placeholder='••••••••'
                            {
                            ...register('password', {
                                required: 'Password is required!',
                                minLength: {
                                    value: 8,
                                    message: "Password must have atleast 8 characters"
                                }
                            })
                            }
                        />
                        {formState.errors.password && <span className='field-error'>{formState.errors.password.message}</span>}
                    </div>

                    <div className='fp-field'>
                        <label>Confirm Password</label>
                        <input
                            type='password'
                            placeholder='••••••••'
                            {
                            ...register('cpassword', {
                                required: 'Confirm password is required!',
                                minLength: {
                                    value: 8,
                                    message: "Password must have atleast 8 characters"
                                },
                                validate: cpass => cpass === password.current || "Passwords do not match!"
                            })
                            }
                        />
                        {formState.errors.cpassword && <span className='field-error'>{formState.errors.cpassword.message}</span>}
                    </div>

                    <button
                        type='submit'
                        className={isLoading ? "fp-submit-btn loading" : "fp-submit-btn"}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Reset Password"}
                    </button>
                </form>

                <div className='fp-login-link'>
                    Remember your password? <Link to='/auth/login'>Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordChangePassword;