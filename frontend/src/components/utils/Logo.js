import { useNavigate } from "react-router-dom";

function Logo() {
    const navigate = useNavigate();
    return (
        <h1 className="logo" onClick={() => { navigate('/') }}>
            <span className='logo-icon'>
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="sidebarBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3de388" />
                            <stop offset="100%" stopColor="#12a8b9" />
                        </linearGradient>
                        <clipPath id="sidebarBounds">
                            <rect x="30" y="30" width="140" height="140" />
                        </clipPath>
                        <mask id="sidebar-mask-a">
                            <rect width="200" height="200" fill="white" />
                            <path d="M 125 125 L 90 76" fill="none" stroke="black" strokeWidth="40" strokeLinecap="round" />
                        </mask>
                        <mask id="sidebar-mask-b">
                            <rect width="200" height="200" fill="white" />
                            <path d="M 75 75 L 110 124" fill="none" stroke="black" strokeWidth="40" strokeLinecap="round" />
                        </mask>
                    </defs>
                    <rect width="200" height="200" rx="40" fill="url(#sidebarBgGrad)" />
                    <g clipPath="url(#sidebarBounds)">
                        <path d="M 43 190 L 43 30 L 100 110 L 157 30 L 157 190" fill="none" stroke="#ffffff" strokeWidth="26" strokeLinejoin="miter" strokeMiterlimit="10" mask="url(#sidebar-mask-a)" />
                        <path d="M 43 10 L 43 170 L 100 90 L 157 170 L 157 10" fill="none" stroke="#ffffff" strokeWidth="26" strokeLinejoin="miter" strokeMiterlimit="10" mask="url(#sidebar-mask-b)" />
                    </g>
                </svg>
            </span>
            MyWallet
        </h1>
    )
}

export default Logo;