const MessageStatus = ({ status }) => {
    if (status === "seen") {
        return (
            <span className="inline-flex items-center ml-1" title="Seen">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5.5L4.5 9L10 2" stroke="oklch(var(--p))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 5.5L8.5 9L14 2" stroke="oklch(var(--p))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        );
    }

    if (status === "delivered") {
        return (
            <span className="inline-flex items-center ml-1" title="Delivered">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5.5L4.5 9L10 2" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 5.5L8.5 9L14 2" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        );
    }

    return (
        <span className="inline-flex items-center ml-1" title="Sent">
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.5L4.5 9L9 2" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
};

export default MessageStatus;