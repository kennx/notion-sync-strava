import dotenv from "dotenv";
import { insertActivity } from "./notion";
import { getLoggedInAthleteActivities } from "./strava";
dotenv.config();

const client_id = process.env["STRAVA_CLIENT_ID"]!;
const client_secret = process.env["STRAVA_CLIENT_SECRET"]!;
const refresh_token = process.env["STRAVA_REFRESH_TOKEN"]!;

const auth = process.env["NOTION_TOKEN"]!;
const database_id = process.env["NOTION_DATABASE_ID"]!;
const mapbox_access_token = process.env["MAPBOX_ACCESS_TOKEN"]!

async function main() {
  try {
    let loop: boolean = true;
    let page = 1;
    while (loop) {
      const results = await getLoggedInAthleteActivities(
        {
          client_id,
          client_secret,
          refresh_token,
        },
        {
          page,
          per_page: 10,
        }
      );
      loop = !!results.length;
      for (const activity of results) {
        await insertActivity({ auth, database_id, mapbox_access_token }, activity);
        console.log(activity.name, "success 👌");
      }
      page = page + 1;
    }
  } catch (error) {
    console.log(error);
  }
}

main();
