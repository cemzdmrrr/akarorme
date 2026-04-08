'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  getConversations, getMessagesForConversation, sendMessage, markConversationRead,
  getClients, initializeB2BStore
} from '@/lib/b2b-store';
import type { B2BConversation, B2BMessage, B2BClient } from '@/types/b2b';

export default function AdminB2BMessages() {
  const [conversations, setConversations] = useState<B2BConversation[]>([]);
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<B2BMessage[]>([]);
  const [reply, setReply] = useState('');
  const msgEnd = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    initializeB2BStore();
    setConversations(getConversations());
    setClients(getClients());
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (selectedId) {
      markConversationRead(selectedId, 'admin');
      setMessages(getMessagesForConversation(selectedId));
      load();
    }
  }, [selectedId, load]);

  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clientName = (clientId: string) => {
    const c = clients.find((cl) => cl.id === clientId);
    return c ? c.companyName : 'Unknown';
  };

  const handleSend = () => {
    if (!reply.trim() || !selectedId) return;
    const convo = conversations.find((c) => c.id === selectedId);
    if (!convo) return;
    sendMessage(selectedId, convo.clientId, 'admin', 'Admin', convo.subject, reply.trim());
    setReply('');
    setMessages(getMessagesForConversation(selectedId));
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">B2B Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Respond to client messages and inquiries.</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-230px)] min-h-[500px]">
        {/* Conversation List */}
        <div className="w-80 rounded-xl bg-white border border-gray-200 overflow-hidden flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-400 p-4 text-center">No conversations yet.</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    selectedId === c.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.subject}</p>
                    {c.unreadAdmin > 0 && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{clientName(c.clientId)}</p>
                  {c.lastMessageAt && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(c.lastMessageAt).toLocaleString()}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 rounded-xl bg-white border border-gray-200 flex flex-col overflow-hidden">
          {!selectedId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to view messages.
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900">
                  {conversations.find((c) => c.id === selectedId)?.subject}
                </p>
                <p className="text-xs text-gray-500">{clientName(conversations.find((c) => c.id === selectedId)?.clientId || '')}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
                      m.senderRole === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{m.body}</p>
                      <p className={`text-[10px] mt-1 ${m.senderRole === 'admin' ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>

              {/* Reply Bar */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your reply..."
                    className="flex-1 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!reply.trim()}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
