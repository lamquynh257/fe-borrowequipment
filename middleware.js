export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/user", "/", "/branch", "/equipment", "/borrow"],
};
