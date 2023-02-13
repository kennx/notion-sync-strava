import { Strava } from "strava";
import type { RefreshTokenRequest } from "strava"

export type ActivitiesFilter = {
  before?: number;
  after?: number;
  page?: number;
  per_page?: number;
};

export async function getActivitiesByAthlete(requestConfig: RefreshTokenRequest, activitiesFilter: ActivitiesFilter) {
  try {
    const strava = new Strava(requestConfig);
    return await strava.activities.getLoggedInAthleteActivities(activitiesFilter);
  } catch (error) {
    console.log(error?.toString())
  }
}