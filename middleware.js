import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const password = req.cookies.get("app_pass")?.value;

  // Set your password here
  const correctPassword = "porsche123"; 

  // If user already authenticated, allow
  if (password === correctPassword) {
    return NextResponse.next();
  }

  // Check if user submitted a password via URL
  const submittedPass = url.searchParams.get("pass");
  if (submittedPass === correctPassword) {
    const res = NextResponse.redirect(url.origin + url.pathname);
    res.cookies.set("app_pass", correctPassword, { path: "/", httpOnly: false });
    return res;
  }

  // Otherwise show a simple password page
  return new NextResponse(
    `
      <html>
        <body style="font-family:Arial; display:flex; height:100vh; justify-content:center; align-items:center; background:#111; color:white;">
          <form method="GET" style="text-align:center;">
            <h2>Protected App</h2>
            <input name="pass" type="password" placeholder="Enter Password" 
              style="padding:10px; border-radius:5px; margin-top:10px;" />
            <br/><br/>
            <button style="padding:10px 20px; border-radius:5px;">Enter</button>
          </form>
        </body>
      </html>
    `,
    { status: 401, headers: { "content-type": "text/html" } }
  );
}
