import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import userImg from '../../assets/images/user.png';
import useProfileImage from "../../hooks/useProfileImage";

/* ── Confirmation Modal ── */
const LogoutModal = ({ onConfirm, onCancel }) => (
    <>
        {/* Backdrop */}
        <div
            onClick={onCancel}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
                zIndex: 1000,
            }}
        />
        {/* Dialog */}
        <div style={{
            position: "fixed",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1001,
            background: "rgba(10,20,40,0.97)",
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: "20px",
            padding: "36px 32px",
            width: "min(90vw, 360px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
        }}>
            {/* Icon */}
            <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(244,63,94,0.15)",
                border: "1px solid rgba(244,63,94,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", marginBottom: "4px",
            }}>🔓</div>

            <h2 style={{ color: "#f8fafc", fontSize: "17px", fontWeight: 700, fontFamily: "Inter, sans-serif", margin: 0 }}>
                Log out?
            </h2>
            <p style={{ color: "#64748b", fontSize: "13px", fontFamily: "Inter, sans-serif", textAlign: "center", margin: 0 }}>
                Are you sure you want to log out of your account?
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px", width: "100%" }}>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1, padding: "10px 0", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.05)", color: "#94a3b8",
                        fontSize: "14px", fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: "pointer",
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    style={{
                        flex: 1, padding: "10px 0", borderRadius: "10px", border: "none",
                        background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                        color: "#fff", fontSize: "14px", fontWeight: 600,
                        fontFamily: "Inter, sans-serif", cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(244,63,94,0.35)",
                    }}
                >
                    Yes, Log out
                </button>
            </div>
        </div>
    </>
);

/* ── Header ── */
const Header = memo(({ title }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [profileImg] = useProfileImage();
    const [dropdownOpen, setDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const u = AuthService.getCurrentUser();
        if (u) { setEmail(u.email); setUsername(u.username); }
    }, []);

    /* Close dropdown when clicking outside */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        AuthService.logout_req();
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            <div className='top'>
                <div className="title">
                    <h1>{title}</h1>
                </div>

                {/* Profile area — clickable */}
                <div
                    ref={dropdownRef}
                    style={{ position: "relative", cursor: "pointer", userSelect: "none" }}
                >
                    <div
                        className='profile'
                        onClick={() => setDropdown(prev => !prev)}
                        style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            padding: "6px 10px", borderRadius: "12px",
                            transition: "background 0.2s",
                            background: dropdownOpen ? "rgba(52,211,153,0.08)" : "transparent",
                        }}
                    >
                        <div className="profile-img">
                            {!profileImg && <img src={userImg} width={50} height={50} alt='user' />}
                            {profileImg !== null && <img src={profileImg} width={50} height={50} alt='user' />}
                        </div>
                        <div>
                            <p>{username}</p>
                            <p>{email}</p>
                        </div>
                        {/* Chevron */}
                        <span style={{
                            color: "#64748b", fontSize: "12px", marginLeft: "2px",
                            transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                            display: "inline-block",
                        }}>▾</span>
                    </div>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 8px)", right: 0,
                            minWidth: "180px",
                            background: "rgba(10,20,40,0.97)",
                            border: "1px solid rgba(52,211,153,0.15)",
                            borderRadius: "12px",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                            overflow: "hidden",
                            zIndex: 999,
                            backdropFilter: "blur(12px)",
                            animation: "fadeInDown 0.15s ease",
                        }}>
                            <button
                                onClick={() => { setDropdown(false); setShowModal(true); }}
                                style={{
                                    width: "100%", padding: "12px 18px",
                                    display: "flex", alignItems: "center", gap: "10px",
                                    background: "transparent", border: "none",
                                    color: "#f43f5e", fontSize: "14px", fontWeight: 600,
                                    fontFamily: "Inter, sans-serif", cursor: "pointer",
                                    textAlign: "left",
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(244,63,94,0.1)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <span style={{ fontSize: "16px" }}>🔓</span>
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation modal */}
            {showModal && (
                <LogoutModal
                    onConfirm={handleLogout}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </>
    );
});

export default Header;