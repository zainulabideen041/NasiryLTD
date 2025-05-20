"use client";

import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-2 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default Loading;
