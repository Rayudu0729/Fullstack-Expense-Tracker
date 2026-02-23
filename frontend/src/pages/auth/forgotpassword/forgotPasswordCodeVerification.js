import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthService from '../../../services/auth.service';
import '../../../assets/styles/forgotPassword.css';

function ForgotPasswordCodeVerification() {
    const navigate = useNavigate();
    const { email } = useParams();

    const { register, handleSubmit, formState } = useForm();

    const [response_error, setResponseError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        await AuthService.forgotPasswordverifyCode(data.code).then(
            (response) => {
                console.log(response.data.message);
                if (response.data.status === 'SUCCESS') {
                    setResponseError("");
                    navigate(`/auth/forgotPassword/resetPassword/${email}`);
                } else {
                    setResponseError('Verification failed: Something went wrong!');
                }
            },
            (error) => {
                if (error.response) {
                    const resMessage = error.response.data.response;
                    setResponseError(resMessage);
                    console.log(resMessage);
                } else {
                    console.log(error.message);
                    setResponseError("Verification failed: Something went wrong!");
                }
            }
        );
        setIsLoading(false);
    };

    const resendCode = async () => {
        setResponseError("");
        setIsSending(true);
        await AuthService.resendResetPasswordVerificationCode(email).then(
            (response) => {
                console.log(response.data);
                if (response.data.status === "SUCCESS") {
                    console.log(response.data);
                    setResponseError("");
                } else {
                    setResponseError("Verification failed: Cannot resend email!");
                }
            },
            (error) => {
                if (error.response) {
                    const resMessage = error.response.data.response;
                    setResponseError(resMessage);
                    console.log(error);
                } else {
                    console.log(error);
                    setResponseError("Verification failed: Cannot resend email!");
                }
            }
        );
        setIsSending(false);
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
                    <h2>Verify Your Email</h2>
                    <p>Enter the verification code sent to your email</p>
                </div>

                {/* Info / Sending status */}
                {isSending ? (
                    <div className='fp-info'>Sending email to {email}...</div>
                ) : (
                    response_error === "" && (
                        <div className='fp-info'>
                            Verification code sent to <span className='fp-highlight'>{email}</span>
                        </div>
                    )
                )}

                {/* Error */}
                {response_error !== "" && (
                    <div className='fp-error'>{response_error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='fp-field'>
                        <label>Verification Code</label>
                        <input
                            type='text'
                            placeholder='Enter your code'
                            {...register('code', {
                                required: "Code is required!",
                            })}
                        />
                        {formState.errors.code && <span className='field-error'>{formState.errors.code.message}</span>}
                    </div>

                    <div className='fp-warning'>
                        ⏱ The verification code will expire within 15 minutes
                    </div>

                    <button
                        type='submit'
                        className={isLoading ? "fp-submit-btn loading" : "fp-submit-btn"}
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                </form>

                <div className='fp-login-link'>
                    Having problems? <span className='fp-action-link' onClick={resendCode}>{isSending ? "Sending code..." : "Resend code"}</span>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordCodeVerification;