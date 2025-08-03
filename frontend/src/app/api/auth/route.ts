export async function POST(request: Request) {
  const body = await request.json();
  const sessionToken = body.sessionToken as string;
  const expiresAt = body.expiresAt as string;
  const role = body.role as "admin" | "user";

  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 400,
      }
    );
  }
  const expiresDate = new Date(expiresAt).toUTCString();

  // return Response.json(body, {
  //   status: 200,
  //   headers: {
  //     'Set-Cookie': `sessionToken=${sessionToken}; role=${role}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`,
  //   },
  // });
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`
  );
  headers.append(
    "Set-Cookie",
    `role=${role}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`
  );
  headers.set("Content-Type", "application/json");

  return new Response(JSON.stringify(body), {
    status: 200,
    headers,
  });
}
