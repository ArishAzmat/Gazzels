import clsx from 'clsx';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend, subtitle }) => {
    const colorConfig = {
        primary: {
            bg: 'bg-primary/10',
            icon: 'text-primary',
            border: 'border-primary/10',
            shadow: 'shadow-primary/5',
        },
        secondary: {
            bg: 'bg-secondary/10',
            icon: 'text-secondary',
            border: 'border-secondary/10',
            shadow: 'shadow-secondary/5',
        },
        accent: {
            bg: 'bg-highlight/20',
            icon: 'text-primary-light',
            border: 'border-highlight/20',
            shadow: 'shadow-highlight/5',
        },
        success: {
            bg: 'bg-emerald-50',
            icon: 'text-emerald-600',
            border: 'border-emerald-100',
            shadow: 'shadow-emerald-500/5',
        },
    };

    const colors = colorConfig[color] || colorConfig.primary;

    return (
        <div className={clsx(
            "bg-white rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group",
            colors.border,
            colors.shadow
        )}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-secondary uppercase tracking-wider">{title}</p>
                    <div className="mt-3 flex items-baseline">
                        <p className="text-3xl font-bold text-primary tracking-tight">{value}</p>
                        {trend && (
                            <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {trend}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-500 font-medium">{subtitle}</p>
                    )}
                </div>
                <div className={clsx(
                    'p-4 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm',
                    colors.bg
                )}>
                    <Icon className={clsx('w-6 h-6', colors.icon)} />
                </div>
            </div>

            {/* Subtle decorative element */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default StatsCard;
