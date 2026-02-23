import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthService from '../../../services/auth.service';
import '../../../assets/styles/forgotPassword.css';

const ForgotPasswordEmailVerfication = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState } = useForm();

    const [response_error, setResponseError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        await AuthService.forgotPasswordVerifyEmail(data.email).then(
            (response) => {
                console.log(response.data.message);
                if (response.data.status === 'SUCCESS') {
                    setResponseError("");
                    navigate(`/auth/forgotPassword/verifyAccount/${data.email}`);
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
        console.log(data);
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
                    <h2>Forgot Password</h2>
                    <p>Enter the email address registered with your account</p>
                </div>

                {/* Error */}
                {response_error !== "" && (
                    <div className='fp-error'>{response_error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='fp-field'>
                        <label>Email</label>
                        <input
                            type='text'
                            placeholder='you@example.com'
                            {...register('email', {
                                required: "Email is required!",
                                pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: "Invalid email address!" }
                            })}
                        />
                        {formState.errors.email && <span className='field-error'>{formState.errors.email.message}</span>}
                    </div>

                    <button
                        type='submit'
                        className={isLoading ? "fp-submit-btn loading" : "fp-submit-btn"}
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className='fp-login-link'>
                    Remember your password? <Link to='/auth/login'>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordEmailVerfication;
