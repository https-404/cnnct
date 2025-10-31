export function ChatPlaceholder() {
  return (
    <div className="flex-1 flex items-center justify-center relative w-full">
      <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
        <div className="bg-accent p-6 rounded-full mb-6">
          <ChatBubbleIcon className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Your messages</h3>
        <p className="text-center max-w-md text-sm px-4">
          Select a conversation from the list to start chatting or search for a friend to begin a new conversation.
        </p>
      </div>
    </div>
  );
}

function ChatBubbleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  );
}
