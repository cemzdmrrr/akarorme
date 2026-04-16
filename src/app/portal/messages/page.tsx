'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurrentClientId } from '@/lib/b2b-auth';
import { usePortalContext } from '@/app/portal/template';
import {
  getConversations,
  getMessagesForConversation,
  createConversation,
  sendMessage,
  markConversationRead,
} from '@/lib/b2b-store';
import type { B2BConversation, B2BMessage } from '@/types/b2b';

export default function PortalMessages() {
  const { client } = usePortalContext();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<B2BConversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<B2BConversation | null>(null);
  const [messages, setMessages] = useState<B2BMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');

  const cid = getCurrentClientId();

  const refresh = useCallback(() => {
    if (!cid) return;
    const items = getConversations(cid);
    setConversations(items);
  }, [cid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openConversation = useCallback((conv: B2BConversation) => {
    setSelectedConv(conv);
    setMessages(getMessagesForConversation(conv.id));
    markConversationRead(conv.id, 'client');
    refresh();
    setShowNew(false);
  }, [refresh]);

  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (!conversationId || conversations.length === 0) return;
    const target = conversations.find((item) => item.id === conversationId);
    if (target) {
      openConversation(target);
    }
  }, [conversations, openConversation, searchParams]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!cid || !client || !selectedConv || !newMessage.trim()) return;
    sendMessage(
      selectedConv.id,
      cid,
      'client',
      client.contactPerson,
      selectedConv.subject,
      newMessage.trim(),
    );
    setNewMessage('');
    setMessages(getMessagesForConversation(selectedConv.id));
    refresh();
  }

  function handleNewConversation(e: React.FormEvent) {
    e.preventDefault();
    if (!cid || !client || !newSubject.trim() || !newBody.trim()) return;
    const conv = createConversation(cid, client.contactPerson, client.companyName, newSubject.trim());
    sendMessage(conv.id, cid, 'client', client.contactPerson, newSubject.trim(), newBody.trim());
    setNewSubject('');
    setNewBody('');
    setShowNew(false);
    refresh();
    openConversation(conv);
  }

  const inputClass = 'w-full rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20';

  return (
    <div className="flex h-[calc(100vh-52px)] lg:h-screen">
      <div className="flex w-80 flex-shrink-0 flex-col border-r border-brand-dark-3 bg-brand-dark">
        <div className="flex items-center justify-between border-b border-brand-dark-3 p-4">
          <h1 className="text-lg font-display font-bold text-brand-white">Mesajlar</h1>
          <button
            onClick={() => {
              setShowNew(true);
              setSelectedConv(null);
            }}
            className="rounded-lg bg-brand-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-accent-light"
          >
            + Yeni
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-xs text-brand-grey">Henüz mesaj bulunmuyor.</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={`w-full border-b border-brand-dark-3 p-4 text-left transition-colors ${
                  selectedConv?.id === conv.id ? 'bg-brand-dark-2' : 'hover:bg-brand-dark-2/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="truncate pr-2 text-sm font-medium text-brand-white">{conv.subject}</p>
                  {conv.unreadClient > 0 && (
                    <span className="flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-brand-accent px-1.5 text-[10px] font-bold text-white">
                      {conv.unreadClient}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-brand-grey">
                  {new Date(conv.lastMessageAt).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-brand-black">
        {showNew ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="w-full max-w-lg">
              <h2 className="mb-4 text-lg font-semibold text-brand-white">Yeni Mesaj</h2>
              <form onSubmit={handleNewConversation} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brand-grey">Konu</label>
                  <input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Mesaj konusu..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-brand-grey">Mesaj</label>
                  <textarea
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    required
                    rows={6}
                    className={inputClass}
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light">
                    Mesajı Gönder
                  </button>
                  <button type="button" onClick={() => setShowNew(false)} className="rounded-lg border border-brand-dark-3 px-5 py-2.5 text-sm text-brand-grey transition-colors hover:text-brand-white">
                    Vazgeç
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : selectedConv ? (
          <>
            <div className="border-b border-brand-dark-3 px-6 py-4">
              <h2 className="text-sm font-semibold text-brand-white">{selectedConv.subject}</h2>
              <p className="text-xs text-brand-grey">AKAR ÖRME ile görüşme</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderRole === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-xl p-4 ${
                    msg.senderRole === 'client'
                      ? 'border border-brand-accent/20 bg-brand-accent/15'
                      : 'border border-brand-dark-3 bg-brand-dark-2'
                  }`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-medium text-brand-grey-light">{msg.senderName}</span>
                      <span className="text-[10px] text-brand-grey">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-brand-white">{msg.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex gap-3 border-t border-brand-dark-3 p-4">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Yanıtınızı yazın..."
                className="flex-1 rounded-lg border border-brand-dark-3 bg-brand-dark-2 px-3.5 py-2.5 text-sm text-brand-white placeholder-brand-grey focus:border-brand-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
              >
                Gönder
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="mb-3 text-sm text-brand-grey">Bir konuşma seçin ya da yeni mesaj başlatın</p>
              <button
                onClick={() => setShowNew(true)}
                className="text-sm text-brand-accent-light hover:underline"
              >
                + Yeni Mesaj
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
