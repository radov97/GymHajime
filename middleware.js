import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "it", "es", "ro", "fr", "de", "tl"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/((?!api|_next|.*..*).*)"],
};
