'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { messagesApi } from '@/lib/messages';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Conversation {
  id: string;
  isGroup: boolean;
  title?: string;
  otherUser?: {
    id: string;
    userProfile?: {
      firstName: string;
      lastName: string;
      avatar?: string;
      headline?: string;
    };
    companyProfile?: {
      companyName: string;
      logo?: string;
    };
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  lastMessageAt?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender?: {
    id: string;
    userProfile?: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    companyProfile?: {
      companyName: string;
      logo?: string;
    };
  };
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Obtener userId de la URL
  const targetUserId = searchParams.get('userId');

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadConversations();
  }, [isAuthenticated, isHydrated, router]);

  // Procesar userId de la URL después de cargar conversaciones
  useEffect(() => {
    if (!targetUserId || loading || !isAuthenticated) return;
    
    handleOpenConversationWithUser(targetUserId);
  }, [targetUserId, loading, isAuthenticated]);

  // Función para abrir/crear conversación con un usuario específico
  const handleOpenConversationWithUser = async (userId: string) => {
    setLoadingChat(true);
    try {
      // Buscar si ya existe en las conversaciones cargadas
      const existingConv = conversations.find(c => c.otherUser?.id === userId);
      
      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        // Crear o obtener conversación del backend
        const response = await messagesApi.getOrCreateConversation(userId);
        const newConv = response.data;
        
        // Transformar la respuesta para el formato esperado
        const otherParticipant = newConv.participants?.find((p: any) => p.userId !== user?.id);
        const formattedConv: Conversation = {
          id: newConv.id,
          isGroup: newConv.isGroup,
          title: newConv.title,
          otherUser: otherParticipant?.user || null,
          unreadCount: 0,
          lastMessageAt: newConv.lastMessageAt,
        };
        
        // Agregar a la lista si es nueva
        if (!conversations.find(c => c.id === formattedConv.id)) {
          setConversations([formattedConv, ...conversations]);
        }
        
        setSelectedConversation(formattedConv);
      }
      
      // Limpiar el parámetro de la URL
      router.replace('/messages', { scroll: false });
    } catch (error) {
      console.error('Error opening conversation:', error);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await messagesApi.getConversations();
      setConversations(response.data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await messagesApi.getMessages(conversationId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const response = await messagesApi.sendMessage(selectedConversation.id, newMessage);
      setMessages([...messages, response.data]);
      setNewMessage('');
      
      setConversations(conversations.map(c => 
        c.id === selectedConversation.id
          ? { ...c, lastMessage: { content: newMessage, createdAt: new Date().toISOString(), senderId: user?.id || '' } }
          : c
      ));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getUserName = (conv: Conversation) => {
    if (conv.otherUser?.companyProfile) return conv.otherUser.companyProfile.companyName;
    if (conv.otherUser?.userProfile) return `${conv.otherUser.userProfile.firstName} ${conv.otherUser.userProfile.lastName}`;
    return 'Usuario';
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="flex h-full">
            {/* Lista de conversaciones */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">✉️ Mensajes</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p>No hay conversaciones aún</p>
                    <p className="text-sm mt-1">Conecta con otros usuarios para chatear</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                          {getUserName(conv).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">{getUserName(conv)}</h3>
                            {conv.unreadCount > 0 && (
                              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Área de chat */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header del chat */}
                  <div 
                    className="p-4 border-b border-gray-200 flex items-center space-x-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/profile/${selectedConversation.otherUser?.id}`)}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                      {getUserName(selectedConversation).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{getUserName(selectedConversation)}</h3>
                      {selectedConversation.otherUser?.userProfile?.headline && (
                        <p className="text-sm text-gray-500">{selectedConversation.otherUser.userProfile.headline}</p>
                      )}
                    </div>
                  </div>

                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => {
                      const isOwn = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isOwn
                                  ? 'bg-purple-600 text-white rounded-br-md'
                                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
                              }`}
                            >
                              <p>{msg.content}</p>
                            </div>
                            <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : ''}`}>
                              {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: es })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input de mensaje */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="bg-purple-600 hover:bg-purple-700 rounded-full px-6"
                      >
                        {sending ? '...' : 'Enviar'}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium">Selecciona una conversación</h3>
                    <p className="text-sm mt-1">Elige un chat de la lista para comenzar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
