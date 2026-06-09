import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data } satisfies ApiSuccess<T>, {
    status,
  });
}

export function jsonError(
  error: string,
  status = 400,
  code?: string,
) {
  return NextResponse.json(
    { success: false, error, code } satisfies ApiFailure,
    { status },
  );
}

export function unauthorized(message = "Authentication required.") {
  return jsonError(message, 401, "UNAUTHORIZED");
}

export function forbidden(message = "Insufficient permissions.") {
  return jsonError(message, 403, "FORBIDDEN");
}

export function notFound(message = "Resource not found.") {
  return jsonError(message, 404, "NOT_FOUND");
}
