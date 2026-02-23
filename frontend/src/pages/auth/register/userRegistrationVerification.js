import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthService from '../../../services/auth.service';
import '../../../assets/styles/forgotPassword.css';

const UserRegistrationVerfication = () => {
    const navigate = useNavigate();

    const { email } = useParams();

    const { register, handleSubmit, formState } = useForm();

    const [response_error, setResponseError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true)
        const response = await AuthService.verifyRegistrationVerificationCode(data.code).then(
            (response) => {
                console.log(response.data);
                if (response.data.status === "SUCCESS") {
                    console.log(response.data);
                    navigate('/auth/success-registration')
                    setResponseError("");
                } else {
                    setResponseError("Verification failed: Cannot resend email!")
                }

            },
            (error) => {
                if (error.response) {
                    const resMessage = error.response.data.response;
                    setResponseError(resMessage);
                    console.log(error);
                } else {
                    console.log(error);
                    setResponseError("Verification failed: Cannot resend email!")
                }
            }
        );
        setIsLoading(false);
    }

    const resendCode = async () => {
        setIsSending(true)
        const response = await AuthService.resendRegistrationVerificationCode(email).then(
            (response) => {
                console.log(response.data.message);
                setResponseError("");
            },
            (error) => {
                setResponseError("cannot send email again!");
            }
        );
        setIsSending(false)
    }

    return (
        <div className='fp-page'>
            {/* Decorative orbs */}
            <div className="fp-orb orb-top-right"></div>
            <div className="fp-orb orb-bottom-left"></div>

            {/* Back link */}
            <Link to="/auth/register" className="fp-back-link">
                ← Back to Register
            </Link>

            <div className='fp-card'>
                {/* Brand */}
                <div className="fp-brand">
                    <Link to="/" className="fp-brand-name">MyWallet</Link>
                </div>

                {/* Header */}
                <div className="fp-header">
                    <h2>Verify Your Email</h2>
                    <p>Enter the verification code to complete registration</p>
                </div>

                {/* Status messages */}
                {isSending && (
                    <div className='fp-info'>Sending email to {email}...</div>
                )}

                {!isSending && response_error === "" && (
                    <div className='fp-info'>
                        The verification code has been sent to <span className="fp-highlight">{email}</span>.
                    </div>
                )}

                {response_error !== "" && (
                    <div className='fp-error'>{response_error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='fp-field'>
                        <label>Verification Code</label>
                        <input
                            placeholder='Enter verification code'
                            type='text'
                            {...register('code', {
                                required: "Code is required!",
                            })}
                        />
                        {formState.errors.code && <small className="field-error">{formState.errors.code.message}</small>}
                    </div>

                    <div className='fp-warning'>
                        ⏱ Please note that the verification code will expire within 15 minutes!
                    </div>

                    <button
                        type='submit'
                        className={isLoading ? "fp-submit-btn loading" : "fp-submit-btn"}
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : 'Verify'}
                    </button>
                </form>

                {/* Resend link */}
                <div className='fp-login-link'>
                    Having problems? <span className='fp-action-link' onClick={resendCode}>
                        {isSending ? "Sending code..." : 'Resend code'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserRegistrationVerfication;
