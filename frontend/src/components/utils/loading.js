import './Loading.css';

const Loading = ({ fullPage = false }) => {
    return (
        <div className={`loading-container${fullPage ? ' loading-fullpage' : ''}`}>
            <div className="loading-content">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-dot"></div>
                </div>
                <div className="loading-text">Loading...</div>
            </div>
        </div>
    )
}

export default Loading;