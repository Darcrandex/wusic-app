/**
 * @name ContentPage
 * @description
 * @author darcrand
 */

"use client";

import dayjs from "dayjs";

export default function ContentPage() {
  const today = dayjs().format("YYYY-MM-DD");
  return (
    <>
      <h1>ContentPage</h1>
      <p>{today}</p>
    </>
  );
}
