import type { Request } from "express";
import type { ParsedQs } from "qs";

// Use this for requests that have a typed body
export interface TypedRequestBody<T> extends Request {
  body: T;
}

// Use this for requests that have typed URL params
export interface TypedRequestParams<T extends Record<string, string>>
  extends Request {
  params: T;
}

// Use this for requests that have a typed query string
export interface TypedRequestQuery<T extends ParsedQs> extends Request {
  query: T;
}

// Use this for requests that have typed URL params and a typed query string
export interface TypedRequestParamsAndQuery<
  P extends Record<string, string>,
  Q extends ParsedQs,
> extends Request {
  params: P;
  query: Q;
}
