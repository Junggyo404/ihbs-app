import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export default function AdminTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  actions,
  emptyMessage = '데이터가 없습니다.',
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap',
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete || actions) && (
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 whitespace-nowrap">
                작업
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn('px-4 py-3 text-gray-700', col.className)}
                >
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key as string] ?? '-')}
                </td>
              ))}
              {(onEdit || onDelete || actions) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {actions ? (
                      actions(item)
                    ) : (
                      <>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                          >
                            수정
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                          >
                            삭제
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
