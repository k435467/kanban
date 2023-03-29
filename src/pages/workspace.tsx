import React from "react";
import { signOut } from "@/firebase/google";

export default function Myspace() {
  return (
    <div>
      <div>logged in!</div>
      <button
        className="w-full border-2 rounded flex items-center justify-center p-1 gap-1.5"
        onClick={signOut}
      >
        <div className="text-lg">Log Out</div>
      </button>
    </div>
  );
}
