import dotenv from "dotenv";
import { insertActivity } from "./notion";
import { getLoggedInAthleteActivities } from "./strava";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
dotenv.config();

const client_id = process.env["STRAVA_CLIENT_ID"]!;
const client_secret = process.env["STRAVA_CLIENT_SECRET"]!;
const refresh_token = process.env["STRAVA_REFRESH_TOKEN"]!;

const auth = process.env["NOTION_TOKEN"]!;
const database_id = process.env["NOTION_DATABASE_ID"]!;
const mapbox_access_token = process.env["MAPBOX_ACCESS_TOKEN"]!
//1676325960
async function main() {
  try {

    const notion = new Client({ auth });
    const database = await notion.databases.query({
      database_id,
      sorts: [
        {
          property: "start_date_local",
          direction: "descending"
        }
      ]
    });

    let after = 0;
    let pageId = 0;

    const pageResult = database.results[0] as PageObjectResponse & any

    if (pageResult && pageResult.properties && pageResult.properties.start_date_local) {
      const start = pageResult.properties.start_date_local.date.start;
      pageId = pageResult.properties.id.number
      after = Number(new Date(start).getTime() / 1000);
    }

    console.log(pageId, after);
    

    let loop: boolean = true;
    let page = 1;
    while (loop) {
      let results = await getLoggedInAthleteActivities(
        {
          client_id,
          client_secret,
          refresh_token,
        },
        {
          after,
          page,
          per_page: 30,
        }
      );
      if (!!pageId) {
        results = results.filter(item => item.id !== pageId);
      }

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
