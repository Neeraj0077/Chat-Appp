import { useState } from "react";

const VerticalElipseModal = ({ isOpen }) => {
console.log("Modal render:", isOpen);
    return (
        <>
            {isOpen &&
                (
                    <div className="absolute right-0 top-7 z-50 bg-base-100 border border-base-300 rounded-xl shadow-lg w-48 py-1 overflow-hidden">
                        <button
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"

                        >
                            Select users
                        </button>
                        <button
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"

                        >
                            New group
                        </button>
                        <button
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"

                        >
                            Archived chats
                        </button>
                        <button
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"

                        >
                            Settings
                        </button>
                    </div>
                )}
        </>
    )
}

export default VerticalElipseModal;


