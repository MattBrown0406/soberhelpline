/** A provider date/time is a wall clock, not a browser-local Date. */
export function bookingInstant(date: string, time: string, zone = 'America/Los_Angeles'): Date {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  let instant = wall;
  for (let i = 0; i < 4; i++) {
    const parts = formatter.formatToParts(new Date(instant));
    const part = (key: string) => Number(parts.find(p => p.type === key)?.value);
    const rendered = Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'));
    if (rendered === wall) return new Date(instant);
    instant += wall - rendered;
  }
  throw new Error('This appointment time does not exist in the provider timezone.');
}

export function bookingDateTime(date: string, time: string, zone: string, providerZone = 'America/Los_Angeles') {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: zone, year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  }).format(bookingInstant(date, time, providerZone));
}
