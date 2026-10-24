/** Close a lead without deleting contact history or changing paid bookings. */
export async function closeAbandonedBooking(
  id: string,
  update: (id: string, changes: { completed: true }) => Promise<{ id: string; completed: boolean } | null>,
): Promise<void> {
  if (!id) throw new Error("No booking selected");
  const row = await update(id, { completed: true });
  if (row?.id !== id || row.completed !== true) throw new Error("Booking removal was not confirmed");
}