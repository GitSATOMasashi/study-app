import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("App", () => {

  beforeEach(() => {
    vi.mock("../supabase.ts", () => ({
      fetchRecords: vi.fn().mockResolvedValue([{ id: 1, title: "test", time: 2 }]),
      addRecord: vi.fn().mockResolvedValue([{ id: 2, title: "テスト", time: 1 }]),
    }));
  });

  test("アプリタイトルが表示されている", async () => {
    render(<App />);

    await waitFor(() => {
        expect(screen.queryByText("Loading...")).toBeNull();
    })

    expect(
      screen.getByRole("heading", { name: "学習記録アプリ！！" })
    ).toBeInTheDocument();
  });

  test("学習記録をすることができる", async () => {
    render(<App />);
    await waitFor(() => {
        expect(screen.queryByText("Loading...")).toBeNull();
    })

    const studyContentInput = screen.getByLabelText("学習内容")
    const studyTimeInput = screen.getByLabelText("学習時間")

    fireEvent.change(studyContentInput, { target: { value: "テスト" } });
    fireEvent.change(studyTimeInput, { target: { value: 1 } });

    const addButton = screen.getByRole("button", { name: "登録" });
    fireEvent.click(addButton);

    await waitFor(() => {
      const recordList = screen.getByRole("list")
      expect(within(recordList).getByText("テスト - 1時間")).toBeInTheDocument();
    });
  });
});