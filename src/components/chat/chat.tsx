import { ChatProps } from "@/models/ChatProps";
import ChatBottombar from "./chat-bottombar";
import ChatTopbar from "./chat-topbar";
import ChatList from "./chat-list";

export function Chat({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  chatId,
  loadingSubmit,
  formRef,
  isMobile,
  setInput,
}: ChatProps) {
  return (
    <div className="flex flex-col justify-between w-full max-w-3xl h-full ">
      <ChatTopbar
        chatId={chatId}
        messages={messages}
      />

      <ChatList
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        stop={stop}
        formRef={formRef}
        isMobile={isMobile}
      />

      <ChatBottombar
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        stop={stop}
        formRef={formRef}
        setInput={setInput}
      />
    </div>
  );
}
