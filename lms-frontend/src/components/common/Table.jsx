import { Loader2, Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import clsx from 'clsx';

const Table = ({
    columns,
    data = [],
    isLoading = false,
    title,
    search,
    onSearchChange,
    actions
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header / Toolbar */}
            {(title || search !== undefined || actions) && (
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                    {title && <h2 className="text-xl font-bold text-primary">{title}</h2>}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                        {search !== undefined && (
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64 transition-all hover:border-gray-300"
                                />
                            </div>
                        )}
                        {actions}
                    </div>
                </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={clsx(
                                        "px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider",
                                        col.align === 'right' ? 'text-right' : 'text-left',
                                        col.className
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">Loading data...</p>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Inbox className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-900 font-medium">No data found</p>
                                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id || rowIndex}
                                    className="hover:bg-gray-50/80 transition-colors group"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={clsx(
                                                "px-6 py-4 text-sm text-gray-600 whitespace-nowrap",
                                                col.align === 'right' ? 'text-right' : 'text-left'
                                            )}
                                        >
                                            {(() => {
                                                const getValue = (obj, path) => {
                                                    if (!path) return undefined;
                                                    return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
                                                };
                                                const value = getValue(row, col.accessor);
                                                return col.render ? col.render(value, row) : value;
                                            })()}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Optional Placeholder) */}
            {!isLoading && data.length > 0 && false && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <span className="text-sm text-gray-500">Showing 1-10 of {data.length}</span>
                    <div className="flex gap-2">
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
