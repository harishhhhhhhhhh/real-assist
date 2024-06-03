import { ChangeEvent, Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import { ChatRequestOptions } from "ai";
import { Message } from "ai/react";

export interface ChatProps {
    chatId?: string;
    messages: Message[];
    input: string;
    isLoading: boolean;
    loadingSubmit?: boolean;
    formRef: RefObject<HTMLFormElement>;
    isMobile?: boolean;
    error: undefined | Error;
    stop: () => void;
    handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (
      e: FormEvent<HTMLFormElement>,
      chatRequestOptions?: ChatRequestOptions
    ) => void;
    setInput?: Dispatch<SetStateAction<string>>;
  }