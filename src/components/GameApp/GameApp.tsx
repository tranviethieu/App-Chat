"use client";
import { Button, Flex } from "antd";
import { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import "@ant-design/v5-patch-for-react-19";
import {
  db,
  auth,
  provider,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  facebookProvider,
} from "~/lib/firebase";

const GameApp: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchLevel(userData.uid);
    }
  }, []);

  //   const handleLogin = async () => {
  //     try {
  //       const result = await signInWithPopup(auth, provider);
  //       const userData = result.user;
  //       setUser(userData);
  //       localStorage.setItem("user", JSON.stringify(userData));
  //       await initializeUser(userData.uid);
  //     } catch (error) {
  //       console.error("Login error:", error);
  //     }
  //   };
  const handleLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      await initializeUser(userData.uid);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
  };

  // Kiểm tra nếu user chưa có trong Firestore thì tạo mới
  const initializeUser = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, { level: 1 });
      setLevel(1);
    } else {
      setLevel(userSnap.data().level);
    }
  };

  // Lấy level từ Firestore khi user đăng nhập lại
  const fetchLevel = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setLevel(userSnap.data().level);
    }
  };

  // Khi user chia sẻ lên Facebook
  const shareOnFacebook = async () => {
    const userRef = doc(db, "links", "facebook");
    const userSnapFace = await getDoc(userRef);

    if (!!userSnapFace.data()) {
      const shareUrl = userSnapFace.data()?.link;
      debugger;
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(facebookShareUrl, "_blank");
      increaseLevel();
    }
  };

  // Tăng level và cập nhật vào Firestore
  const increaseLevel = async () => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let newLevel = level + 1;

    if (userSnap.exists()) {
      // Nếu user đã có trong Firestore -> Cập nhật level
      await updateDoc(userRef, { level: newLevel });
    } else {
      // Nếu user chưa có trong Firestore -> Tạo mới với level 1
      newLevel = 1;
      await setDoc(userRef, { level: newLevel });
    }

    setLevel(newLevel);
  };

  return (
    <div>
      {user ? (
        <>
          <h1 style={{ marginBottom: 40 }}>Chia sẻ để tăng Level!</h1>
          <h2 style={{ marginBottom: 10 }}>Xin chào, {user.displayName}!</h2>
          <p style={{ marginBottom: 40 }}>Level: {level}</p>
          <Flex gap={20} style={{ marginBottom: 20 }}>
            <h4>Nhiệm vụ 1:</h4>
            <Button onClick={shareOnFacebook} disabled={level > 1}>
              Chia sẻ lên Facebook
            </Button>
          </Flex>
          <Flex gap={20}>
            <h4>Nhiệm vụ 2:</h4>
            <Button onClick={shareOnFacebook} disabled>
              Chia sẻ lên TikTok
            </Button>
          </Flex>
          <Button onClick={handleLogout} style={{ marginTop: 20 }}>
            Đăng xuất
          </Button>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: 40 }}>Đăng nhập</h1>
          <Flex gap={10} vertical>
            <Button
              color="danger"
              variant="outlined"
              onClick={() => handleLogin(provider)}
            >
              Đăng nhập với Google
            </Button>
            <Button
              type="primary"
              onClick={() => handleLogin(facebookProvider)}
            >
              Đăng nhập với Facebook
            </Button>
          </Flex>
        </>
      )}
    </div>
  );
};

export default GameApp;
