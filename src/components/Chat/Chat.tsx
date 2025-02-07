"use client";
import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { Input, Button, List, Flex } from "antd";
import {
  db,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "~/lib/firebase";
import { formatRelative } from "date-fns";
interface Message {
  id: string;
  name: string;
  text: string;
  createdAt: any;
  parentId?: string | null; // Thêm parentId để quản lý tin nhắn trả lời
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [replyTo, setReplyTo] = useState<string | null>(null); // ID của tin nhắn đang trả lời

  useEffect(() => {
    const chatUserName = localStorage.getItem("chatUserName");
    if (chatUserName) {
      setName(chatUserName);
    }
  }, []);
  // Lấy tin nhắn từ Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  // Xử lý gửi tin nhắn hoặc trả lời tin nhắn
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !name.trim()) return;

    await addDoc(collection(db, "messages"), {
      name,
      text: newMessage,
      createdAt: serverTimestamp(),
      parentId: replyTo, // Nếu có replyTo thì đây là tin nhắn trả lời
    });

    setNewMessage(""); // Reset nội dung chat
    setReplyTo(null); // Reset trạng thái trả lời
  };
  function formatDate(seconds: any) {
    let formattedDate = "";

    if (seconds) {
      formattedDate = formatRelative(new Date(seconds * 1000), new Date());

      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
  }
  // Lọc tin nhắn theo parentId (để hiển thị dạng nested)
  const renderMessages = (parentId: string | null = null) => {
    return messages
      .filter((msg) => msg.parentId === parentId)
      .map((msg) => (
        <div key={msg.id} style={{ marginLeft: parentId ? 20 : 0 }}>
          <List.Item
            style={{
              borderLeft: parentId ? "2px solid #1890ff" : "none",
              paddingLeft: 10,
              paddingBottom: 4,
              paddingTop: 4,
              borderBottom: ".6px solid rgb(201, 201, 201)",
            }}
          >
            <Flex wrap style={{ width: "100%", flexDirection: "column" }}>
              <div>
                <strong>{msg.name}:</strong> {msg.text}{" "}
              </div>
              <Flex wrap align="baseline" justify="space-between">
                <span style={{ fontSize: 8 }}>
                  {formatDate(msg?.createdAt?.seconds)}
                </span>
                <Button
                  type="link"
                  size="small"
                  onClick={() => setReplyTo(msg.id)}
                  style={{ fontSize: 8, padding: "0 10px" }}
                >
                  Reply
                </Button>
              </Flex>
            </Flex>
          </List.Item>
          {renderMessages(msg.id)} {/* Hiển thị các tin nhắn trả lời */}
        </div>
      ));
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Chat AI</h2>

      {/* Hiển thị danh sách tin nhắn */}
      <List bordered>{renderMessages()}</List>

      {/* Form nhập tin nhắn */}
      <form onSubmit={sendMessage} style={{ marginTop: 16 }}>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem("chatUserName", e.target.value);
          }}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder={replyTo ? "Replying..." : "Type a message"}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" htmlType="submit" block>
          {replyTo ? "Reply" : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default Chat;
