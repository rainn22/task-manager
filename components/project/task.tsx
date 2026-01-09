"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

type Props = {
  title: string;
  status: string;
  isCompleted: boolean;
  comments: Comment[];
};

export default function TaskCard({
  title,
  status,
  isCompleted,
  comments,
}: Props) {
  const [completed, setCompleted] = useState(isCompleted);

  const currentStatus = completed ? "done" : status ;


  return (
    <div className="border rounded-md p-4 hover:bg-gray-50">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:items-center">
        

        <div className="flex items-center gap-3 md:col-span-2 lg:col-span-1">
          <Checkbox
            checked={completed}
            onCheckedChange={() => setCompleted(!completed)}
          />

          <span
            className={`font-medium ${
              completed ? "line-through text-gray-500" : ""
            }`}
          >
            {title}
          </span>
        </div>


        <div className="flex items-center gap-2">
          {comments.map((comment) => {
            const firstLetter =
              comment.author?.trim().charAt(0).toUpperCase() ?? "?";

            return (
              <Avatar key={comment.id} className="w-6 h-6">
                <AvatarFallback className="flex items-center justify-center text-xs font-medium text-gray-600 bg-gray-300">
                  {firstLetter}
                </AvatarFallback>
              </Avatar>
            );
          })}
        </div>


        <div className="flex md:justify-end">
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              statusColors[currentStatus] || "bg-gray-100 text-gray-800"
            }`}
          >
            {currentStatus}
          </span>
        </div>
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  todo: "bg-red-100 text-red-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  done: "bg-teal-100 text-teal-800",
};
