/**
 * @name RootPage
 * @description
 * @author darcrand
 */

import dayjs from 'dayjs'
import { redirect } from 'next/navigation'
export default function RootPage() {
  const tody = dayjs().format('YYYY-MM-DD')
  redirect(`/${tody}`)
}
