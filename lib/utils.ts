export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  const [h, m] = timeString.split(':');
  const hour = parseInt(h, 10);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${displayHour}:${m}`;
}

export function getTodayDayOfWeek(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function studentIdToEmail(studentId: string): string {
  return `${studentId}@ihbs.local`;
}

export function emailToStudentId(email: string): string {
  return email.replace('@ihbs.local', '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    aired: 'bg-green-100 text-green-800',
    selected: 'bg-green-100 text-green-800',
    resolved: 'bg-green-100 text-green-800',
    held: 'bg-gray-100 text-gray-700',
    reviewing: 'bg-purple-100 text-purple-800',
    scheduled: 'bg-blue-100 text-blue-800',
    on_air: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-700',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-700';
}
