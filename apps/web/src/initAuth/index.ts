import { NextRequest, NextResponse } from "next/server";
import { UnAuthorizedError } from "../utils/exceptions";
import { GET } from "../app/(private)/api/route";
import { isProtectedRoute } from "../utils";

const REDIRECT_URL = "redirect-url";

const initAuth = async (req: NextRequest, res: typeof NextResponse) => {
  try {
    if (isProtectedRoute(req.nextUrl.pathname)) {
      await GET().then(
        () => {
          return res.next();
        },
        (error) => {
          throw error;
        }
      );
      return onAuthSuccess(req, res);
    }

    return res.next();
  } catch (error) {
    if (error instanceof UnAuthorizedError) {
      const loginURL = redirectToLogIn(req);
      const response = res.redirect(loginURL, { status: 301 });

      const returnResponse = new Response(response.body, response);
      return returnResponse;
    }
  }
};

const shouldRedirect = (currentPath: URL) => {
  const hasRedirectPath = currentPath.searchParams.get(REDIRECT_URL);
  if (hasRedirectPath) return false;

  const hasRoute = isProtectedRoute(currentPath.pathname);
  if (hasRoute) return true;
};

const getAuthRedirect = (url: URL) => {
  const redirectPath = url.searchParams.get(REDIRECT_URL);
  const redirectURL = redirectPath?.startsWith("/")
    ? `${url.origin}${redirectPath}`
    : redirectPath;

  const redirectHasSameOrigin = new URL(redirectURL!).origin === url.origin;

  if (redirectHasSameOrigin) return redirectURL;
};

const onAuthSuccess = (req: NextRequest, res: typeof NextResponse) => {
  const hasRedirect = getAuthRedirect(req.nextUrl);
  if (hasRedirect) {
    return res.redirect(hasRedirect);
  }
  return res.next();
};

const redirectToLogIn = (req: NextRequest) => {
  const loginURL = "/login";
  const redirectLogin = req.nextUrl.clone();

  if (shouldRedirect(req.nextUrl)) {
    redirectLogin.pathname = loginURL;
    redirectLogin.searchParams.set(REDIRECT_URL, req.nextUrl.href);
    return redirectLogin;
  }
  return req.nextUrl.href;
};

export default initAuth;
