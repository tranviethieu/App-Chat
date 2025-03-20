import styles from "./page.module.css";
//import Chat from "~/components/Chat";
import GameApp from "~/components/GameApp";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <GameApp />
          {/* <Chat /> */}
        </div>
      </main>
    </div>
  );
}
