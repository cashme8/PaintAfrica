import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CropCard from "../../components/common/CropCard";
import Button from "../../components/common/Button";
import { mockChats } from "../../lib/chatData";
import { useAuth } from "../../auth/AuthContext";

export default function Chat() {
  const { orderId } = useParams();
  const { user, role } = useAuth();
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(mockChats);

  const chat = useMemo(() => {
    return threads.find((item) => item.orderId === orderId) || threads[0];
  }, [threads, orderId]);

  function sendMessage() {
    if (!draft.trim()) return;
    const sender = user?.user_metadata?.full_name || (role === "business" ? "Printing company" : "Client");
    const newMessage = {
      id: Date.now(),
      sender,
      role: role || "customer",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setThreads((prev) =>
      prev.map((item) =>
        item.orderId === chat.orderId
          ? { ...item, messages: [...item.messages, newMessage], lastUpdated: newMessage.time }
          : item
      )
    );
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="job-number text-xs text-ink-600">Follow-up chat</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-carbon-900">Order conversation</h1>
          <p className="mt-1 text-sm text-carbon-500">
            {chat.orderId} · {chat.orderTitle}
          </p>
        </div>
        <Link to={role === "business" ? "/business/dashboard" : "/orders"}>
          <Button variant="outline" size="sm">Back</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <CropCard className="flex h-[70vh] flex-col">
          <div className="border-b border-stock-200 pb-4">
            <p className="text-sm font-medium text-carbon-900">Participants</p>
            <p className="text-xs text-carbon-500">{chat.participants.join(" · ")}</p>
            <p className="mt-1 text-xs text-carbon-500">Last updated: {chat.lastUpdated}</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto py-4 pr-1">
            {chat.messages.map((message) => {
              const mine = user?.user_metadata?.full_name === message.sender;
              const bubbleClass = mine
                ? "ml-auto bg-ink-600 text-stock-50"
                : message.role === "business"
                  ? "bg-proof-500/10 text-carbon-900"
                  : "bg-stock-100 text-carbon-900";
              return (
                <div key={message.id} className={`max-w-[80%] rounded-sm px-4 py-3 ${bubbleClass}`}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-xs opacity-80">
                    <span className="font-medium">{message.sender}</span>
                    <span>{message.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-stock-200 pt-4">
            <label className="text-sm font-medium text-carbon-700">Send update or follow-up</label>
            <textarea
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message to the customer or printing company..."
              className="mt-2 w-full rounded-sm border border-stock-300 bg-stock-50 px-3.5 py-2.5 text-sm outline-none focus:border-ink-600"
            />
            <div className="mt-3 flex justify-end">
              <Button onClick={sendMessage}>Send message</Button>
            </div>
          </div>
        </CropCard>

        <CropCard>
          <h2 className="font-display text-lg font-semibold text-carbon-900">Chat purpose</h2>
          <ul className="mt-3 space-y-3 text-sm text-carbon-500">
            <li>Share order updates between the customer and printing company.</li>
            <li>Confirm delivery dates, production progress, or changes to the brief.</li>
            <li>Keep quotation documents and follow-up messages in one place.</li>
          </ul>
        </CropCard>
      </div>
    </div>
  );
}
