import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

const Toast = ({ message, type = 'info', onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
    };

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-400',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-400',
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-400',
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-400',
        },
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

    return (
        <div
            className={clsx(
                'flex items-center gap-3 min-w-80 max-w-md p-4 rounded-lg border shadow-lg transition-all duration-300 transform',
                bgColor,
                borderColor,
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            )}
        >
            <Icon className={clsx('w-5 h-5 flex-shrink-0', iconColor)} />
            <p className={clsx('flex-1 text-sm font-medium', textColor)}>{message}</p>
            <button
                onClick={handleClose}
                className={clsx('flex-shrink-0 hover:opacity-70 transition-opacity', textColor)}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
