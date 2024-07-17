export interface StationResponse {
  station_codes: string[];
}

export interface StationData {
  id: number;
  station_code: string;
  station_type: string;
  install_date: string;
  timezone: string;
  ewx_user_id: string;
  lat: number;
  lon: number;
  location_description: string;
  background_place: string;
  active: boolean;
  api_config: string;
  sampling_interval: number;
  expected_readings_day: number;
  expected_readings_hour: number;
  first_reading_datetime: string;
  first_reading_datetime_utc: string;
  latest_reading_datetime: string;
  latest_reading_datetime_utc: string;
  supported_variables: string;
}
