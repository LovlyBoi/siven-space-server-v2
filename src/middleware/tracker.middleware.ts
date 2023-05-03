import type { Middleware } from "koa";
import { recommender } from "../utils/collaborativeFilter";
import { ErrorType, useEmit } from "../utils/useErrorEmit";

export const createVisitRecommend: Middleware = async (ctx, next) => {
  const blogId = ctx.params.id as string;
  const visitorId = ctx.query.visitorId as string;
  if (!blogId || !visitorId) return await next();
  console.log(visitorId, blogId)
  recommender.addVisit(visitorId, blogId);
  recommender.persistence();
  await next();
};
