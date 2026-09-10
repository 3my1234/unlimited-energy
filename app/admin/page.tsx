import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import AdminDashboard from "./admin-dashboard";
import styles from "./admin.module.css";

export default async function AdminPage() {
  if (!await isAdmin()) redirect("/admin/login");
  return <main className={styles.shell}><AdminDashboard /></main>;
}
