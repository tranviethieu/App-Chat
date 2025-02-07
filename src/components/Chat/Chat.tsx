"use client";
import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { Input, Button, List } from "antd";
import {
  db,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "~/lib/firebase";

const Chat = () => {
  const [messages, setMessages] = useState<
    { id: string; name: string; text: string; createdAt: any }[]
  >([]);
  const [name, setName] = useState(""); // Tên người gửi
  const [newMessage, setNewMessage] = useState(""); // Nội dung tin nhắn

  // Lấy tên từ Local Storage khi trang load
  useEffect(() => {
    const savedName = localStorage.getItem("chatUserName");
    if (savedName) {
      setName(savedName);
    }
  }, []);

  // Lưu tên vào Local Storage khi người dùng nhập
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    localStorage.setItem("chatUserName", newName);
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: {
        id: string;
        name: string;
        text: string;
        createdAt: any;
      }[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as {
          id: string;
          name: string;
          text: string;
          createdAt: any;
        });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || name.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      name,
      text: newMessage,
      createdAt: serverTimestamp(),
    });

    setNewMessage(""); // Reset nội dung chat
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Live Chat</h2>

      {/* Hiển thị tin nhắn */}
      <List
        bordered
        dataSource={messages}
        renderItem={(message) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <strong>{message.name}:</strong> {message.text}
            </div>
          </List.Item>
        )}
      />

      {/* Form nhập tin nhắn */}
      <form onSubmit={sendMessage} style={{ marginTop: 16 }}>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange} // Lưu vào Local Storage
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" htmlType="submit" block>
          Send
        </Button>
      </form>
    </div>
  );
};

export default Chat;
