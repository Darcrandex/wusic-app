/**
 * @name AdminLayout
 * @description
 * @author darcrand
 */

"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";

export default function AdminLayout(props: PropsWithChildren) {
  return (
    <>
      <h1>AdminLayout</h1>
      <aside>
        <nav>
          <Link href="/admin">q</Link>
        </nav>
      </aside>

      <main>{props.children}</main>
    </>
  );
}
