import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import styles from "../admin.module.css";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return <main className={styles.shell}>
    <section className={styles.loginCard}>
      <p className={styles.kicker}>Unlimited Energy Systems</p>
      <h1>Media administrator</h1>
      <p>Sign in to update the images and video shown on the public website.</p>
      {error && <p className={styles.error}>The password is incorrect.</p>}
      <form action="/api/admin/login" method="post" className={styles.form}>
        <label>Admin password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button type="submit">Sign in</button>
      </form>
      <Link href="/">Return to website</Link>
    </section>
  </main>;
}
