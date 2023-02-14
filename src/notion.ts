import { Client } from "@notionhq/client";
import { SummaryActivity } from "strava";
import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import { getEndDateLocal, getMapboxImageUrl, getTimezone } from "./utils";

export async function insertActivity(
  config: { auth: string; database_id: string; mapbox_access_token: string },
  activity: SummaryActivity
) {
  const notion = new Client({ auth: config.auth });
  try {
    let children: Array<BlockObjectRequest> = [];

    if (activity.map?.summary_polyline) {
      const url = getMapboxImageUrl(
        activity.map.summary_polyline,
        config.mapbox_access_token
      );
      const start_latitude = [activity.start_latlng[0], activity.start_latlng[1]]
      children = [
        {
          type: "embed",
          embed: {
            url: `https://maps.google.com/maps?q=${start_latitude.join(",")}&hl=zh-cn`
          }
        },
      ];
    }

    const timeZone = getTimezone(activity.timezone);

    await notion.pages.create({
      parent: {
        database_id: config.database_id,
      },
      properties: {
        name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: activity.name || "",
              },
            },
          ],
        },
        distance: {
          type: "number",
          number: activity.distance || null,
        },
        moving_time: {
          type: "number",
          number: activity.moving_time || null,
        },
        elapsed_time: {
          type: "number",
          number: activity.elapsed_time || null,
        },
        total_elevation_gain: {
          type: "number",
          number: activity.total_elevation_gain || null,
        },
        average_speed: {
          type: "number",
          number: activity.average_speed || null,
        },
        average_heartrate: {
          type: "number",
          number: activity.average_heartrate || null,
        },
        type: {
          type: "select",
          select: {
            name: activity.type || null,
          },
        },
        start_date_local: {
          type: "date",
          date: {
            start: new Date(activity.start_date_local).toISOString() || "",
            time_zone: "Asia/Shanghai",
          },
        },
        end_date_local: {
          type: "date",
          date: {
            start: getEndDateLocal(
              activity.start_date_local,
              activity.elapsed_time
            ),
            time_zone: timeZone,
          },
        },
        timezone: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: activity.timezone || "",
              },
            },
          ],
        },
        location_country: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: activity.location_country || "",
              },
            },
          ],
        },
        location_state: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: activity.location_state || "",
              },
            },
          ],
        },
        location_city: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: activity.location_city || "",
              },
            },
          ],
        },
        id: {
          type: "number",
          number: activity.id,
        },
        map_id: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: activity.map?.id || "",
              },
            },
          ],
        },
        map_summary_polyline: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: activity.map?.summary_polyline || "",
              },
            },
          ],
        },
      },
      children,
    });
  } catch (error) {
    console.log(error);
  }
}

