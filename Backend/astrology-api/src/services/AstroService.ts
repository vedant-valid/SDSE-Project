import axios, { AxiosInstance } from "axios";
import {
  chartTypeToEndpoint,
  ChartType,
  vedicAstroConfig,
} from "../config/vedicAstroConfig";
import { BaseService } from "../core/BaseService";
import { DoshaResult, DoshaType, VedicParams, VedicPlanet } from "../types/vedic";
import { IAstroService } from "./interfaces/IAstroService";

// Manglik: Mars in these houses (traditional + extended list)
const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

// Nadi groups based on nakshatra — used for individual nadi identification
const NADI_MAP: Record<string, string> = {
  Ashwini: "Aadi",      Magha: "Aadi",           Mula: "Aadi",
  Bharani: "Madhya",    "Purva Phalguni": "Madhya", "Purva Ashadha": "Madhya",
  Krittika: "Antya",    "Uttara Phalguni": "Antya", "Uttara Ashadha": "Antya",
  Rohini: "Antya",      Hasta: "Antya",           Shravana: "Antya",
  Mrigashira: "Madhya", Chitra: "Madhya",          Dhanishta: "Madhya",
  Ardra: "Aadi",        Swati: "Aadi",             Shatabhisha: "Aadi",
  Punarvasu: "Aadi",    Vishakha: "Aadi",          "Purva Bhadrapada": "Aadi",
  Pushya: "Madhya",     Anuradha: "Madhya",        "Uttara Bhadrapada": "Madhya",
  Ashlesha: "Antya",    Jyeshtha: "Antya",         Revati: "Antya",
};

export class AstroService extends BaseService implements IAstroService {
  protected readonly serviceName = "AstroService";
  private readonly client: AxiosInstance;
  private readonly freeAstroClient: AxiosInstance;

  constructor() {
    super();
    this.client = axios.create({
      baseURL: vedicAstroConfig.baseURL,
      timeout: vedicAstroConfig.timeout,
      headers: { "x-api-key": vedicAstroConfig.apiKey },
    });
    this.freeAstroClient = axios.create({
      baseURL: vedicAstroConfig.chartBaseURL,
      timeout: vedicAstroConfig.timeout,
    });
  }

  private async callApi(endpoint: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const response = await this.client.post(endpoint, body);
      return response.data as Record<string, unknown>;
    } catch (err) {
      if (err instanceof AxiosError) {
        const detail = err.response?.data?.detail ?? err.response?.data?.error ?? err.message;
        const msg = Array.isArray(detail) ? (detail[0]?.msg ?? JSON.stringify(detail)) : String(detail);
        throw Object.assign(new Error(`Astro API error: ${msg}`), { statusCode: 502 });
      }
      throw err;
    }
  }

  public fetchVedicChart(params: VedicParams): Promise<Record<string, unknown>> {
    return this.callApi(vedicAstroConfig.endpoints.vedicCalculate, params as unknown as Record<string, unknown>);
  }

  // ── Dosha computations from chart data ────────────────────────────────────

  public computeDosha(doshaType: DoshaType, chartData: Record<string, unknown>): DoshaResult {
    const planets = (chartData.planets ?? []) as VedicPlanet[];
    switch (doshaType) {
      case "manglik":   return this.computeManglik(planets);
      case "kalsarp":   return this.computeKalSarp(planets);
      case "sadesati":  return this.extractSadeSati(chartData);
      case "pitradosh": return this.computePitraDosh(planets);
      case "nadi":      return this.computeNadi(planets);
    }
  }

  private computeManglik(planets: VedicPlanet[]): DoshaResult {
    const mars = planets.find(p => p.name === "Mars");
    const isPresent = mars ? MANGLIK_HOUSES.includes(mars.house) : false;
    return {
      is_present: isPresent,
      details: {
        mars_house: mars?.house,
        mars_sign: mars?.sign,
        mars_nakshatra: mars?.nakshatra,
        description: isPresent
          ? `Mars is in house ${mars!.house} (${mars!.sign}), indicating Manglik Dosha.`
          : `Mars is in house ${mars?.house} (${mars?.sign}) — no Manglik Dosha.`,
      },
      remedies: isPresent ? [
        "Perform Mangal Puja every Tuesday",
        "Visit Mangalnath Temple, Ujjain",
        "Chant 'Om Angarakaya Namah' 108 times daily",
        "Donate red lentils (masoor dal) on Tuesdays",
        "Wear red coral (Moonga) gemstone after consulting a Jyotishi",
      ] : [],
    };
  }

  private computeKalSarp(planets: VedicPlanet[]): DoshaResult {
    const rahu = planets.find(p => p.name === "Rahu");
    const ketu = planets.find(p => p.name === "Ketu");
    if (!rahu || !ketu) return { is_present: false, details: { description: "Rahu/Ketu data not available" }, remedies: [] };

    const rahuDeg = rahu.absolute_degree;
    const ketuDeg = ketu.absolute_degree;
    const others = planets.filter(p => !["Rahu", "Ketu"].includes(p.name));

    const inArc = (deg: number, from: number, to: number): boolean => {
      if (from <= to) return deg >= from && deg <= to;
      return deg >= from || deg <= to;
    };

    const allInKalSarp  = others.every(p => inArc(p.absolute_degree, ketuDeg, rahuDeg));
    const allInAnant    = others.every(p => inArc(p.absolute_degree, rahuDeg, ketuDeg));
    const isPresent = allInKalSarp || allInAnant;

    return {
      is_present: isPresent,
      details: {
        rahu_house: rahu.house, rahu_sign: rahu.sign,
        ketu_house: ketu.house, ketu_sign: ketu.sign,
        type: isPresent ? (allInKalSarp ? "Kaal Sarp" : "Anant Kaal Sarp") : "None",
        description: isPresent
          ? `All planets are hemmed between Rahu (${rahu.sign}, H${rahu.house}) and Ketu (${ketu.sign}, H${ketu.house}), indicating Kaal Sarp Dosha.`
          : "Planets are not confined between Rahu and Ketu — no Kaal Sarp Dosha.",
      },
      remedies: isPresent ? [
        "Perform Nagbali Puja at Trimbakeshwar Jyotirlinga",
        "Chant 'Om Namah Shivaya' 108 times daily",
        "Keep silver Nag-Nagin idol at the puja altar",
        "Donate milk to snakes on Nag Panchami",
        "Recite Kaal Sarp Stotra on Mondays",
      ] : [],
    };
  }

  private extractSadeSati(chartData: Record<string, unknown>): DoshaResult {
    const ss = chartData.sade_sati as { active?: boolean; phase?: string; description?: string } | undefined;
    const isPresent = ss?.active ?? false;
    return {
      is_present: isPresent,
      details: {
        phase: ss?.phase ?? null,
        description: ss?.description ?? (isPresent ? "Saturn is transiting Moon Rashi" : "Sade Sati is not currently active"),
      },
      remedies: isPresent ? [
        "Recite Shani Chalisa every Saturday",
        "Offer mustard oil to Shani Dev on Saturdays",
        "Donate black sesame (kala til) on Saturdays",
        "Chant 'Om Sham Shanaishcharaya Namah' 108 times daily",
        "Feed crows (Kakbali) on Saturdays",
      ] : [],
    };
  }

  private computePitraDosh(planets: VedicPlanet[]): DoshaResult {
    const sun  = planets.find(p => p.name === "Sun");
    const rahu = planets.find(p => p.name === "Rahu");
    const ketu = planets.find(p => p.name === "Ketu");

    const withRahu = sun && rahu && sun.house === rahu.house;
    const withKetu = sun && ketu && sun.house === ketu.house;
    const isPresent = Boolean(withRahu || withKetu);

    return {
      is_present: isPresent,
      details: {
        sun_house: sun?.house,
        sun_sign: sun?.sign,
        conjunction: withRahu ? "Sun–Rahu" : withKetu ? "Sun–Ketu" : "None",
        description: isPresent
          ? `Sun is conjunct ${withRahu ? "Rahu" : "Ketu"} in house ${sun!.house} (${sun!.sign}), indicating Pitra Dosha.`
          : `Sun is in house ${sun?.house} (${sun?.sign}) — no Pitra Dosha.`,
      },
      remedies: isPresent ? [
        "Perform Pitra Tarpan on all Amavasya (new moon) days",
        "Feed crows (Kakbali) daily, especially on Saturdays",
        "Donate food and clothes to Brahmins on Pitru Paksha",
        "Recite Pitra Stotram daily",
        "Perform Shraddha ceremony annually",
      ] : [],
    };
  }

  private computeNadi(planets: VedicPlanet[]): DoshaResult {
    const moon = planets.find(p => p.name === "Moon");
    const nakshatra = moon?.nakshatra ?? "";
    const nadi = NADI_MAP[nakshatra] ?? "Unknown";

    return {
      is_present: false, // Nadi Dosha is for marriage compatibility, not individual
      details: {
        moon_nakshatra: nakshatra,
        moon_pada: moon?.pada,
        nadi_group: nadi,
        description: nakshatra
          ? `Moon is in ${nakshatra} Nakshatra (pada ${moon?.pada}), ${nadi} Nadi. Nadi Dosha is assessed during marriage matching.`
          : "Moon nakshatra data not available.",
      },
      remedies: [],
    };
  }

  // ── Legacy method stubs (kept for interface compliance) ───────────────────

  public fetchManglikDosh(_params: VedicParams): Promise<Record<string, unknown>> {
    throw new Error("Use fetchVedicChart + computeDosha instead");
  }

  public fetchOtherdosha(_params: VedicParams, _type: string): Promise<Record<string, unknown>> {
    throw new Error("Use fetchVedicChart + computeDosha instead");
  }

  public fetchBirthChart(params: VedicParams): Promise<Record<string, unknown>> {
    return this.fetchVedicChart(params);
  }

  public async fetchChartByType(params: VedicParams, chartType: ChartType): Promise<Record<string, unknown>> {
    const isSupported = Object.values(chartTypeToEndpoint).includes(chartType);
    if (!isSupported) {
      throw new Error(`Unsupported chart type: ${chartType}`);
    }

    const [day, month, year] = params.dob.split("/").map((value) => Number(value));
    const [hours, minutes] = params.tob.split(":").map((value) => Number(value));
    const timezone = Number(String(params.tz).replace("+", ""));

    const payload = {
      year,
      month,
      date: day,
      hours,
      minutes,
      seconds: 0,
      latitude: params.lat,
      longitude: params.lon,
      timezone,
      config: {
        observation_point: "topocentric",
        ayanamsha: "lahiri",
      },
      language: "en",
    };

    const response = await this.freeAstroClient.post(chartType, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": vedicAstroConfig.chartApiKey,
      },
    });

    return response.data as Record<string, unknown>;
  }
}

export const astroService = new AstroService();
