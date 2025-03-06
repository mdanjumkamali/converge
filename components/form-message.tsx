export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="border-l-2 border-gray-100 px-4 bg-white text-black">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-red-500 border-l-2 border-red-400 px-4 bg-white">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-black bg-white border-l-2 border-gray-100 px-4">
          {message.message}
        </div>
      )}
    </div>
  );
}
