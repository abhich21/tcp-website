"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Mail, Trash2, Phone, Briefcase, Calendar } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  service?: string;
  message: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMessages();
      } else {
        alert("Failed to delete message");
      }
    } catch (error) {
      alert("Error deleting message");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Contact Messages"
        subtitle="View and manage customer inquiries"
      />

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-[family-name:var(--font-montserrat)]">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <EmptyState
          title="No Messages Yet"
          description="Contact messages will appear here once submitted through the contact form"
          icon={MessageSquare}
        />
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <Card key={message.id} className="bg-[#1a1a1d] border-white/8 hover:border-white/12 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <Mail className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white font-[family-name:var(--font-montserrat)]">
                      {message.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500 font-[family-name:var(--font-montserrat)]">
                        {new Date(message.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(message.id)}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-[family-name:var(--font-montserrat)]">Email</p>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-[family-name:var(--font-montserrat)]"
                      >
                        {message.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-[family-name:var(--font-montserrat)]">Phone</p>
                      <a
                        href={`tel:${message.phone}`}
                        className="text-sm text-gray-300 hover:text-white transition-colors font-[family-name:var(--font-montserrat)]"
                      >
                        {message.phone}
                      </a>
                    </div>
                  </div>
                  {message.service && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 font-[family-name:var(--font-montserrat)]">Service</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-lime-400/10 text-lime-400 border border-lime-400/20 font-[family-name:var(--font-montserrat)]">
                          {message.service}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-[family-name:var(--font-montserrat)]">Message</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-[family-name:var(--font-montserrat)]">
                    {message.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
