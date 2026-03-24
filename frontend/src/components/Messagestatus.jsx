// Single grey tick = sent
// Double grey tick = delivered  
// Double blue tick = seen

const MessageStatus = ({ status }) => {
    if (status === "seen") {
        // Double blue ticks
        return (
            <span className="inline-flex items-center ml-1" title="Seen">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* First tick */}
                    <path d="M1 5.5L4.5 9L10 2" stroke="#4FC3F7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Second tick (offset right) */}
                    <path d="M5 5.5L8.5 9L14 2" stroke="#4FC3F7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
        );
    }

    if (status === "delivered") {
        // Double grey ticks
        return (
            <span className="inline-flex items-center ml-1" title="Delivered">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5.5L4.5 9L10 2" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5.5L8.5 9L14 2" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
        );
    }

    // Default: single grey tick = sent
    return (
        <span className="inline-flex items-center ml-1" title="Sent">
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.5L4.5 9L9 2" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </span>
    );
};

export default MessageStatus;