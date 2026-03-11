"use client";

import React from "react";
import { useGetAllQuestions } from "@/hooks/useQuestion";
import { CategoricQuestions } from "@/types/global";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Category from "./Category";
import { Input } from "@/components/ui/input";
import { useDebouncedSearch } from "@/hooks/useHelpers";
import { searchText } from "@/lib/helpers";

const QuestionsPage: React.FC = (): React.JSX.Element => {
  const { data, isFetching } = useGetAllQuestions();
  const { search, setSearch, debouncedSearch } = useDebouncedSearch()
  const router = useRouter();

  const handleAddQuestion = () => router.push("/questions/add");

  const filterQuestionsBySearch = (
    categories: CategoricQuestions[],
    search: string
  ): CategoricQuestions[] => {
    if (!search || search.trim() === "") return categories;

    return categories
      .map((cat) => {
        const filteredQuestions = cat.questions.filter(
          (q) => searchText(search, q.question)
        );
        if (filteredQuestions.length === 0) return null;

        return { ...cat, questions: filteredQuestions };
      })
      .filter((cat): cat is CategoricQuestions => cat !== null);
  };

  const categoricalSearch = data?.data
    ? filterQuestionsBySearch(data.data, debouncedSearch)
    : [];

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-hidden">
      <div className="mb-2 flex justify-between items-center">
        <h1 className="font-semibold text-2xl text-text">Questions</h1>
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-[300px] w-[45%]"
        />
      </div>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] rounded-lg overflow-x-auto overflow-hidden">
        {isFetching ? (
          <LoadingPage />
        ) : !categoricalSearch || !categoricalSearch.length ? (
          <EmptyElement
            msg="There are no questions yet"
            action={
              <Button
                className="bg-main p-2 rounded-md shadow-sm text-face transition duration-300 hover:bg-main-hover cursor-pointer"
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>
            }
          />
        ) : (
          <div className="max-h-[100%] overflow-y-auto">
            {categoricalSearch.map((category: CategoricQuestions, catIndex: number) => (
              <Category
                key={category.category ?? `uncategorized-${catIndex}`}
                category={category}
              />
            ))}

            <Button
              onClick={handleAddQuestion}
              className="bg-main py-1 px-4 rounded shadow-sm absolute bottom-5 right-5 transition duration-300 hover:bg-main-hover cursor-pointer"
            >
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
