import React, { useEffect, useRef, useState } from "react";
import { Send, ChevronDown } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, questionId?: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface Suggestion {
  id: string;
  questionText: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = "Type a message...", 
  disabled = false 
}) => {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set<string>());
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | undefined>(undefined);
  const [autocompleteDisabled, setAutocompleteDisabled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedMessage = useDebounce(message, 300);

  const shouldCallAPI = (text: string) => {
    console.log("🔍 shouldCallAPI check:", {
      text: `"${text}"`,
      textLength: text.length,
      trimLength: text.trim().length,
      endsWithSpace: text.endsWith(" "),
      autocompleteDisabled
    });
    
    if (!text.trim() || text.length < 2) return false; 
    if (autocompleteDisabled) {
      console.log("❌ API call blocked - autocomplete disabled");
      return false;
    } 
    const shouldCall = text.endsWith(" ") && text.trim().length > 1;
    console.log("🚀 API call decision:", shouldCall);
    return shouldCall;
  };

  const fetchSuggestions = async (keyword: string) => { 
    if (!shouldCallAPI(keyword)) { 
      if (!keyword.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
      }
      setIsLoading(false);
       
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      return;
    } 
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
     
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(true);
    }, 300);

    try {
      const response = await fetch(
        "https://api-config.amsgenius.com/api/autocomplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keyword: keyword.trim() }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
       
      if (!Array.isArray(data) || data.length === 0) {
        setSuggestions([]);
        setShowDropdown(false);
        setAutocompleteDisabled(true); 
        console.log("🛑 Empty response [] received - DISABLING autocomplete for this session");
        console.log("To re-enable: delete all input and retype");
        return;
      }

      const filteredData = data.filter(
        (item) => item && item.id && !selectedSuggestions.has(item.id)
      );
 
      if (filteredData.length === 0) {
        setSuggestions([]);
        setShowDropdown(false);
        console.log("All suggestions already selected - hiding dropdown");
        return;
      }

      setSuggestions(filteredData);
      setShowDropdown(true);
      setVisibleCount(5);
      
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching autocomplete suggestions:", error);
      }
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions(debouncedMessage);
  }, [debouncedMessage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message, selectedQuestionId);
       
      setMessage("");
      setSuggestions([]);
      setShowDropdown(false);
      setSelectedSuggestions(new Set());
      setSelectedQuestionId(undefined);
      setVisibleCount(5);
      setIsLoading(false);
      setAutocompleteDisabled(false); 
       
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      console.log("Message sent - autocomplete reset and re-enabled");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const previousValue = message;
    setMessage(newValue);
 
    if (!newValue.trim()) {
      setSelectedSuggestions(new Set());
      setSelectedQuestionId(undefined);
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
      setVisibleCount(5); 
      setAutocompleteDisabled(false);
       
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
       
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      console.log("✅ Input cleared - autocomplete fully reset and RE-ENABLED for fresh start");
    }
     
    if (previousValue.trim() === "" && newValue.trim().length > 0) {
      console.log("Fresh typing detected - autocomplete will trigger on space");
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
 
    setShowDropdown(false);
    
    // Then update the state
    setMessage(suggestion.questionText);
    setSelectedSuggestions((prev) => new Set(prev).add(suggestion.id));
    setSelectedQuestionId(suggestion.id);
    
    // Clear suggestions to prevent dropdown from showing again
    setSuggestions([]);
    setVisibleCount(5);
    setIsLoading(false);
    
    // Cancel any pending requests
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    
    console.log("Suggestion selected - dropdown hidden and state cleared");
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, suggestions.length));
  };

  const handleInputFocus = () => {
    // Only show dropdown if we have suggestions and the input has content that would trigger suggestions
    if (suggestions.length > 0 && message.trim() && shouldCallAPI(message)) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow clicking on suggestions before hiding
    setTimeout(() => {
      if (!dropdownRef.current?.matches(':hover')) {
        setShowDropdown(false);
      }
    }, 150);
  };

  const visibleSuggestions = suggestions.slice(0, visibleCount);
  const hasMoreSuggestions = visibleCount < suggestions.length;

  return (
    <div className="relative w-full">
      {showDropdown && (suggestions.length > 0 || isLoading) && (
        <div
          ref={dropdownRef}
          className="absolute bottom-full left-0 right-[20%] z-50 bg-gray-800 border border-gray-600 rounded-md shadow-lg mb-1"
          style={{ maxHeight: "320px" }}
        >
          {isLoading && (
            <div className="p-3 text-white/70 text-sm flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent mr-2"></div>
              Loading suggestions...
            </div>
          )}

          {!isLoading && visibleSuggestions.length > 0 && (
            <div className="flex flex-col">
              {hasMoreSuggestions && (
                <div
                  onClick={handleShowMore}
                  className="px-4 py-3 text-blue-400 hover:bg-gray-700 cursor-pointer transition-colors text-sm flex items-center justify-center border-b border-gray-600 bg-gray-750"
                >
                  <span className="mr-2">
                    Show more ({suggestions.length - visibleCount} remaining)
                  </span>
                  <ChevronDown size={16} />
                </div>
              )}

              <div
                className="overflow-y-auto custom-scrollbar"
                style={{
                  maxHeight: hasMoreSuggestions ? "240px" : "280px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#4B5563 #374151",
                }}
              >
                {visibleSuggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.id}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-3 text-white hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                  >
                    <div className="text-sm leading-relaxed">
                      {suggestion.questionText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && suggestions.length === 0 && shouldCallAPI(message) && (
            <div className="p-3 text-white/50 text-sm text-center">
              No suggestions found
            </div>
          )}
        </div>
      )}

      <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg w-[90%]">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-[80%] py-3 px-4 text-white bg-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />

        <button
          type="button"
          onClick={handleSubmit}
          className={`w-[20%] bg-blue-600 text-white py-3 px-4 rounded-r-lg transition-colors ${
            !message.trim() || disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          disabled={!message.trim() || disabled}
        >
          <span className="hidden sm:inline mr-2">Send</span>
          <Send size={18} className="inline-block" />
        </button>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default MessageInput;