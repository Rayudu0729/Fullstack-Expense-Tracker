import { useRef, useState } from 'react';
import '../../../assets/styles/register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthService from '../../../services/auth.service';

function Register() {

    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState } = useForm();
    const password = useRef({});
    password.current = watch('password', "");

    const [response_error, setResponseError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const onSubmit = async (data) => {
        setIsLoading(true)
        await AuthService.register_req(data.username, data.email, data.password).then(
            (response) => {
                console.log(response);
                if (response.data.status === "SUCCESS") {
                    setResponseError("");
                    navigate(`/auth/userRegistrationVerfication/${data.email}`);
                }
                else {
                    setResponseError("Registration failed: Something went wrong!")
                }
            },
            (error) => {
                if (error.response) {
                    const resMessage = error.response.data.response
                    setResponseError(resMessage);
                    console.log(error.response.data);
                } else {
                    setResponseError("Registration failed: Something went wrong!")
                }

            }
        );
        setIsLoading(false);
    }

    return (
        <div className='register-page'>
            {/* Decorative orbs */}
            <div className='register-orb orb-top-right'></div>
            <div className='register-orb orb-bottom-left'></div>

            {/* Back to home */}
            <Link to='/' className='register-back-link'>← Back to Home</Link>

            {/* Register Card */}
            <div className='register-card'>
                {/* Brand */}
                <div className='register-brand'>
                    <Link to='/' className='register-brand-name'>MyWallet</Link>
                </div>

                {/* Header */}
                <div className='register-header'>
                    <h2>Create Account</h2>
                    <p>Start managing your finances today</p>
                </div>

                {/* Error */}
                {response_error !== "" && (
                    <div className='register-error'>{response_error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='register-field'>
                        <label>Username</label>
                        <input
                            type='text'
                            placeholder='johndoe'
                            {...register('username', {
                                required: "Username is required!"
                            })}
                        />
                        {formState.errors.username && <span className='field-error'>{formState.errors.username.message}</span>}
                    </div>

                    <div className='register-field'>
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

                    <div className='register-field'>
                        <label>Password</label>
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

                    <div className='register-field'>
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
                        className={isLoading ? "register-submit-btn loading" : "register-submit-btn"}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className='register-terms'>
                    By registering, you agree to our user agreement, privacy policy, and cookie policy.
                </div>

                <div className='register-login-link'>
                    Already a member? <Link to='/auth/login'>Sign in</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;