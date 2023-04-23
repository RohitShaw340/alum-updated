import Cookies from "universal-cookie";

export default async function Logout() {
  let cookies = new Cookies();
  await fetch("/api/logout")
    .then((e) =>
      cookies.set("session_id", process.env.SESSION_REMOVE, {
        domain: ".nsut.alumninet.in",
        path: "/",
      })
    )
    .then(() => location.reload());
}
