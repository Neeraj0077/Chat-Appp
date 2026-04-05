const MessageStatus = ({ status }) => {
    if (status === "seen") {
        return (
            <span className="inline-flex items-center" title="Seen">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className="text-primary">
                    <path d="M1 5.5L4.5 9L10 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5.5L8.5 9L14 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
        );
    }

    if (status === "delivered") {
        return (
            <span className="inline-flex items-center" title="Delivered">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className="opacity-50">
                    <path d="M1 5.5L4.5 9L10 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5.5L8.5 9L14 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
        );
    }

    // sent — single grey tick
    return (
        <span className="inline-flex items-center" title="Sent">
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="opacity-50">
                <path d="M1 5.5L4.5 9L9 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </span>
    );
};

export default MessageStatus;