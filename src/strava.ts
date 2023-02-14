import { Strava } from "strava";
import type { RefreshTokenRequest } from "strava"

export type ActivitiesFilter = {
  before?: number;
  after?: number;
  page?: number;
  per_page?: number;
};

export async function getLoggedInAthleteActivities(requestConfig: RefreshTokenRequest, activitiesFilter?: ActivitiesFilter) {
  try {
    const filter: ActivitiesFilter = activitiesFilter || { page: 1, per_page: 30 };
    filter.page = filter.page || 1;
    filter.per_page = filter.per_page || 30; 
    const strava = new Strava(requestConfig);
    return await strava.activities.getLoggedInAthleteActivities(activitiesFilter);
  } catch (error) {
    console.log(error?.toString())
    return [];
  }
}