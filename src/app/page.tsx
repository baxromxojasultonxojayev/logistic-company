import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect / to /uz for Static Export compatibility
  redirect('/uz');
}
