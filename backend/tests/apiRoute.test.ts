import request from "supertest";
import app, {API_BASE_URL} from "../src/app";
import { OpenWeatherAPI } from "../src/openWeatherAPI";
import type { GeoLocationData } from "../src/apiTypes";


jest.mock("../src/openWeatherAPI");

describe(`GET ${API_BASE_URL}`, () => {
  it("should return 422 if city parameter is missing",  (done) => {
    request(app)
      .get(`${API_BASE_URL}/search`)
      .expect('Content-Type', /json/)
      .expect(422)
      .expect({
        success: false,
        message: 'city is/are missing or invalid.',
        error: "The parameter 'city' is/are missing or invalid."
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  // todo: might fail due to sequence of cities or lat/lon changes
  it("should return list of cities with details",  async() => {
    const mockResponse: GeoLocationData = {
      success: true,
      data: [
        {
          city: "London",
          country: "GB",
          lat: 51.5073219,
          lon: -0.1276474
        },
        {
          city: "City of London",
          country: "GB",
          lat: 51.5156177,
          lon: -0.0919983
        },
        {
          city: "London",
          country: "CA",
          lat: 42.9832406,
          lon: -81.243372
        }
      ]
    };

    (OpenWeatherAPI as jest.Mock).mockImplementation(() => ({
      getGeoLocation: jest.fn().mockResolvedValue(mockResponse.data)
    }));

    const res = await request(app)
                        .get(`${API_BASE_URL}/search`)
                        .query({ city: "London", limit: 3 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);
  });

  it("should return a city with details",  async() => {
    const mockResponse = {
      success: true,
      data: {
        city: "London",
        country: "GB",
        lat: 51.5073219,
        lon: -0.1276474
      }
    };

    (OpenWeatherAPI as jest.Mock).mockImplementation(() => ({
      reverseGeoLocation: jest.fn().mockResolvedValue(mockResponse.data)
    }));

    const res = await request(app)
                        .get(`${API_BASE_URL}/search-by-coord`)
                        .query({ lat: "51.5073219", lon: "-0.1276474" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);
  });
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
});
