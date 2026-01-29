import { X, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setShow(true);
        else setTimeout(() => setShow(false), 300); // Wait for animation
    }, [isOpen]);

    if (!show) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return createPortal(
        <div className={clsx(
            "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}>
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={clsx(
                "bg-white rounded-2xl shadow-2xl w-full z-10 overflow-hidden transform transition-all duration-300 border border-gray-100",
                sizeClasses[size],
                isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
            )}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-primary">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
