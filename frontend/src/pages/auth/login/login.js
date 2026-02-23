import { useEffect, useState } from 'react';
import '../../../assets/styles/login.css';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../../services/auth.service';

function Login() {

    const navigate = useNavigate();

    useEffect(() => {
        if (AuthService.getCurrentUser() && AuthService.getCurrentUser().roles.includes("ROLE_USER")) {
            navigate("/user/dashboard");
        } else if (AuthService.getCurrentUser() && AuthService.getCurrentUser().roles.includes("ROLE_ADMIN")) {
            navigate("/admin/transactions");
        }
    }, [])


    const { register, handleSubmit, formState } = useForm();

    const [response_error, setResponseError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true)
        await AuthService.login_req(data.email, data.password).then(
            () => {
                setResponseError("");

                setTimeout(() => {
                    if (AuthService.getCurrentUser().roles.includes("ROLE_USER")) {
                        navigate("/user/dashboard");
                    } else if (AuthService.getCurrentUser().roles.includes("ROLE_ADMIN")) {
                        navigate("/admin/transactions");
                    }
                }, 5000)
                localStorage.setItem("message", JSON.stringify({ status: "SUCCESS", text: "Login successfull!" }))
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                console.log(resMessage);
                if (resMessage === "Bad credentials") {
                    setResponseError("Invalid email or password!");
                } else {
                    setResponseError("Something went wrong: Try again later!");
                }
            }
        );
        setIsLoading(false);
    }

    return (
        <div className='login-page'>
            {/* Decorative orbs */}
            <div className='login-orb orb-top-right'></div>
            <div className='login-orb orb-bottom-left'></div>

            {/* Back to home */}
            <Link to='/' className='login-back-link'>← Back to Home</Link>

            {/* Login Card */}
            <div className='login-card'>
                {/* Brand */}
                <div className='login-brand'>
                    <Link to='/' className='login-brand-name'>MyWallet</Link>
                </div>

                {/* Header */}
                <div className='login-header'>
                    <h2>Welcome Back</h2>
                    <p>Sign in to manage your finances</p>
                </div>

                {/* Error */}
                {response_error !== "" && (
                    <div className='login-error'>{response_error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='login-field'>
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

                    <div className='login-field'>
                        <label>Password</label>
                        <input
                            type='password'
                            placeholder='••••••••'
                            {
                            ...register('password', {
                                required: 'Password is required!'
                            })
                            }
                        />
                        {formState.errors.password && <span className='field-error'>{formState.errors.password.message}</span>}
                    </div>

                    <div className='login-forgot'>
                        <Link to='/auth/forgetpassword/verifyEmail'>Forgot password?</Link>
                    </div>

                    <button
                        type='submit'
                        className={isLoading ? "login-submit-btn loading" : "login-submit-btn"}
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className='login-register-link'>
                    New here? <Link to='/auth/register'>Create an account</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;