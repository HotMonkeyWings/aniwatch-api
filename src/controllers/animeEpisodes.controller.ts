import createHttpError from "http-errors";
import { type RequestHandler } from "express";
import { scrapeAnimeEpisodes } from "../parsers/index.ts";
import { type AnimeEpisodePathParams } from "../models/controllers/index.ts";

// /anime/episodes/${anime-id}
const getAnimeEpisodes: RequestHandler<
  AnimeEpisodePathParams,
  Awaited<ReturnType<typeof scrapeAnimeEpisodes>>,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const animeId = req.params.animeId
      ? decodeURIComponent(req.params.animeId)
      : null;

    if (animeId === null) {
      throw createHttpError.BadRequest("Anime Id required");
    }

    const data = await scrapeAnimeEpisodes(animeId);

    res.status(200).json(data);
  } catch (err: any) {
    console.error(err);
    next(err);
  }
};

export default getAnimeEpisodes;
