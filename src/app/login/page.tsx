/**
 * @name LoginPage
 * @description
 * @author darcrand
 */

"use client";

import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <>
      <h1>LoginPage</h1>
    </>
  );
}
