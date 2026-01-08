import { useEffect, useState } from "react";
import supabase from "./supabase";

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
    const fetchRecords = async () => {
      const { data, error } = (await supabase.from("records").select()) as {
        data: Record[];
        error: Error | null;
      };
      if (error) {
        setIsError(error.message);
        return;
      }

      setRecords(data);
    };

    fetchRecords();
  }, []);

  const handleAddRecord = async () => {
    if (learningContent === "" || learningTime === 0) {
      setIsError("学習内容と学習時間を入力してください");
      return;
    }
    // setRecords([...records, { title: learningContent, time: learningTime }]);
    const { data, error } = await supabase
      .from("records")
      .insert({ title: learningContent, time: learningTime })
      .select();
    if (error) {
      setIsError(error.message);
      return;
    }

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
            <label>学習内容</label>
            <input
              onChange={(e) => setLearningContent(e.target.value)}
              value={learningContent}
              type="text"
            />
          </div>
          <div>
            <label>学習時間</label>
            <input
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
                {record.id} - {record.title} - {record.time}時間
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
