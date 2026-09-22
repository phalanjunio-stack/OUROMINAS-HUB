import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Exclui api/_next e qualquer caminho com extensão de arquivo (imagens,
  // fontes etc. em /public) — sem isso o otimizador de imagem do Next tenta
  // buscar o arquivo internamente, cai no redirect de login e recebe HTML
  // no lugar dos bytes da imagem.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
