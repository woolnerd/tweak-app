export default function handleDatabaseError(error: unknown): void {
  if (error instanceof Error) {
    throw new Error(`Database operation failed: ${error.message}`);
  } else {
    throw new Error("Database operation failed with unknown error");
  }
}
