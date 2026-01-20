import { useEffect, useState } from "react";
import { addRecord, fetchRecords } from "./supabase";

type Record = {
  id: number;
  title: string;
  time: number;
};

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [learningContent, setLearningContent] = useState("");
  const [learningTime, setLearningTime] = useState(0);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    const setupRecords = async () => {
      const records = await fetchRecords();
      setRecords(records);
    };
    
    setupRecords();
  }, []);

  const handleAddRecord = async () => {
    if (learningContent === "" || learningTime === 0) {
      setIsError("学習内容と学習時間を入力してください");
      return;
    }

    const data = await addRecord(learningContent, learningTime);
    setRecords([...records, data[0]]);
    setLearningContent("");
    setLearningTime(0);
    setIsError("");
  };

  const sumTime = records.reduce((acc, record) => acc + record.time, 0);

  return (
    <>
      {records.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>学習記録アプリ！！</h1>
          <div>
            <label htmlFor="study-content">学習内容</label>
            <input
              id="study-content"
              onChange={(e) => setLearningContent(e.target.value)}
              value={learningContent}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="study-time">学習時間</label>
            <input
              id="study-time"
              onChange={(e) => setLearningTime(Number(e.target.value))}
              value={learningTime}
              type="number"
            />
          </div>
          <button onClick={handleAddRecord}>登録</button>
          <div>{isError}</div>
          <ul>
            {records.map((record) => (
              <li key={record.title}>
                {record.title} - {record.time}時間
              </li>
            ))}
          </ul>
          <div>合計学習時間: {sumTime}時間</div>
        </div>
      )}
    </>
  );
}

export default App;
