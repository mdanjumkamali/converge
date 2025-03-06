// Message Types
interface Message {
  id: string;
  text: string;
  sender: {
    name: string;
    phoneNumber?: string;
    avatar?: string;
  };
  timestamp: string;
  isOutgoing: boolean;
  status?: "sent" | "delivered" | "read";
  metadata?: {
    email?: string;
  };
}

// DateSeparator Component
const DateSeparator: React.FC<{ date: string }> = ({ date }) => {
  return (
    <div className="flex justify-center my-4">
      <div className="bg-gray-100 text-gray-500 text-sm px-4 py-1 rounded-lg">
        {date}
      </div>
    </div>
  );
};

// ChatMessage Component
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div
      className={`flex mb-2 ${message.isOutgoing ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[80%] p-2 rounded-lg ${
          message.isOutgoing
            ? "bg-green-100 rounded-tr-none"
            : "bg-white rounded-tl-none"
        }`}
      >
        {!message.isOutgoing && (
          <div className="text-sm font-medium text-green-500">
            {message.sender.name}
            {message.sender.phoneNumber && (
              <span className="ml-2 text-gray-400 text-xs">
                {message.sender.phoneNumber}
              </span>
            )}
          </div>
        )}

        <div className="text-sm">{message.text}</div>

        <div className="flex items-center justify-end mt-1 gap-1">
          {message.metadata?.email && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {message.metadata.email}
            </div>
          )}

          <div className="text-xs text-gray-400">{message.timestamp}</div>

          {message.isOutgoing && message.status && (
            <div className="text-blue-500">
              {message.status === "sent" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {message.status === "delivered" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {message.status === "read" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Avatar Component
const Avatar: React.FC<{ src?: string; fallback: string }> = ({
  src,
  fallback,
}) => {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm">{fallback}</span>
      )}
    </div>
  );
};

// Chat Component
const Chat: React.FC = () => {
  // Sample data
  const messages: Message[] = [
    {
      id: "1",
      text: "CVFER",
      sender: { name: "System" },
      timestamp: "11:51",
      isOutgoing: false,
    },
    {
      id: "2",
      text: "CDERT",
      sender: { name: "System" },
      timestamp: "11:54",
      isOutgoing: false,
    },
    {
      id: "3",
      text: "hello",
      sender: {
        name: "Periskope",
        phoneNumber: "+91 99718 44008",
      },
      timestamp: "12:07",
      isOutgoing: true,
      status: "read",
    },
    {
      id: "4",
      text: "Hello, South Euna!",
      sender: {
        name: "Roshnag Airtel",
        phoneNumber: "+91 63646 47925",
      },
      timestamp: "08:01",
      isOutgoing: false,
    },
    {
      id: "5",
      text: "Hello, Livonia!",
      sender: { name: "System" },
      timestamp: "08:01",
      isOutgoing: false,
    },
    {
      id: "6",
      text: "test el centro",
      sender: {
        name: "Periskope",
        phoneNumber: "+91 99718 44008",
      },
      timestamp: "09:49",
      isOutgoing: true,
      status: "read",
      metadata: {
        email: "bharat@hashlabs.dev",
      },
    },
    {
      id: "7",
      text: "CDERT",
      sender: {
        name: "Roshnag Airtel",
        phoneNumber: "+91 63646 47925",
      },
      timestamp: "09:49",
      isOutgoing: false,
    },
    {
      id: "8",
      text: "testing",
      sender: {
        name: "Periskope",
        phoneNumber: "+91 99718 44008",
      },
      timestamp: "09:49",
      isOutgoing: true,
      status: "read",
      metadata: {
        email: "bharat@hashlabs.dev",
      },
    },
  ];

  return (
    <div className="bg-gray-50 h-screen flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <DateSeparator date="22-01-2025" />

        {messages.slice(0, 5).map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        <DateSeparator date="23-01-2025" />

        {messages.slice(5).map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default Chat;
