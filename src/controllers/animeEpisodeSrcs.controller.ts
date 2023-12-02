import createHttpError from "http-errors";
import { type RequestHandler } from "express";
import { scrapeAnimeEpisodeSources } from "../parsers/index.ts";
import { type AnimeServers, Servers } from "../models/anime.js";
import { type AnimeEpisodeSrcsQueryParams } from "../models/controllers/index.ts";

// /anime/episode-srcs?id=${episodeId}?server=${server}&category=${category (dub or sub)}
const getAnimeEpisodeSources: RequestHandler<
  unknown,
  Awaited<ReturnType<typeof scrapeAnimeEpisodeSources>>,
  unknown,
  AnimeEpisodeSrcsQueryParams
> = async (req, res, next) => {
  try {
    const episodeId = req.query.id ? decodeURIComponent(req.query.id) : null;

    const server = (
      req.query.server
        ? decodeURIComponent(req.query.server)
        : Servers.VidStreaming
    ) as AnimeServers;

    const category = (
      req.query.category ? decodeURIComponent(req.query.category) : "sub"
    ) as "sub" | "dub";

    if (episodeId === null) {
      throw createHttpError.BadRequest("Anime episode id required");
    }

    const data = await scrapeAnimeEpisodeSources(episodeId, server, category);

    res.status(200).json(data);
  } catch (err: any) {
    console.error(err);
    next(err);
  }
};

export default getAnimeEpisodeSources;
