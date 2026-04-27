import { Request, Response } from "express";
import { ChartType } from "../config/vedicAstroConfig";
import { BaseController } from "../core/BaseController";
import { BirthChartModel } from "../models/BirthChartModel";
import { IUserProfile, UserProfileModel } from "../models/UserProfileModel";
import { astroService } from "../services/AstroService";
import { VedicParams } from "../types/vedic";
import { getCoordinates } from "../utils/geocodingHelper";

class ChartController extends BaseController {
  private buildParams(profile: IUserProfile): VedicParams {
    const d = new Date(profile.personalInfo.dateOfBirth);
    const [hour, minute] = profile.personalInfo.timeOfBirth.split(":").map(Number);
    const params: VedicParams = {
      year:  d.getFullYear(),
      month: d.getMonth() + 1,
      day:   d.getDate(),
      hour,
      minute,
      city: profile.personalInfo.placeOfBirth.city,
    };
    const coords = profile.personalInfo.placeOfBirth.coordinates;
    if (coords?.latitude != null && coords?.longitude != null) {
      params.lat = coords.latitude;
      params.lng = coords.longitude;
    }
    return params;
  }

  public generateChart = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return this.fail(res, 401, "Unauthorized");

    const profile = await UserProfileModel.findOne({ userId, isDeleted: false });
    if (!profile) return this.fail(res, 404, "Please create your profile first");

    const chartType = (req.body.chartType || "horoscope-chart-svg-code") as ChartType;
    const chartData = await astroService.fetchChartByType(
      this.buildChartParamsFromProfile(profile),
      chartType
    );

    const svgValue =
      (chartData.output as string | undefined) ||
      (chartData.svg as string | undefined) ||
      (chartData.svg_chart as string | undefined) ||
      (chartData.chart_url as string | undefined) ||
      "";

    const chart = await BirthChartModel.create({
      userId,
      profileId: profile._id,
      chartName: req.body.chartName || "My Birth Chart",
      chartData,
      chartImage: String(svgValue),
      generatedAt: new Date(),
    });

    return this.created(res, chart, "Birth chart generated successfully");
  });

  public getChart = this.asyncHandler(async (req: Request, res: Response) => {
    const reqUser = req.user;
    if (!reqUser) return this.fail(res, 401, "Unauthorized");

    const targetUserId = req.params.userId || reqUser._id;
    if (reqUser.role !== "admin" && String(targetUserId) !== String(reqUser._id)) {
      return this.fail(res, 403, "Insufficient access");
    }

    const charts = await BirthChartModel.find({ userId: targetUserId, isDeleted: false }).sort({ createdAt: -1 });
    return res.json({ success: true, count: charts.length, data: charts });
  });

  public getChartById = this.asyncHandler(async (req: Request, res: Response) => {
    const reqUser = req.user;
    if (!reqUser) return this.fail(res, 401, "Unauthorized");

    const chart = await BirthChartModel.findById(req.params.chartId);
    if (!chart || chart.isDeleted) return this.fail(res, 404, "Chart not found");

    if (reqUser.role !== "admin" && String(chart.userId) !== String(reqUser._id)) {
      return this.fail(res, 403, "Insufficient access");
    }

    return this.ok(res, chart);
  });

  public renameChart = this.asyncHandler(async (req: Request, res: Response) => {
    const reqUser = req.user;
    if (!reqUser) return this.fail(res, 401, "Unauthorized");

    const chart = await BirthChartModel.findById(req.params.chartId);
    if (!chart || chart.isDeleted) return this.fail(res, 404, "Chart not found");

    if (reqUser.role !== "admin" && String(chart.userId) !== String(reqUser._id)) {
      return this.fail(res, 403, "Insufficient access");
    }

    chart.chartName = req.body.chartName || chart.chartName;
    await chart.save();
    return this.ok(res, chart, "Chart renamed");
  });

  public generateForGuest = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return this.fail(res, 401, "Unauthorized");

    const { name, gender, dateOfBirth, timeOfBirth, city, state, country, latitude, longitude } =
      req.body as {
        name: string; gender: string; dateOfBirth: string; timeOfBirth: string;
        city: string; state?: string; country: string;
        latitude?: number; longitude?: number;
      };

    const d = new Date(dateOfBirth);
    const [hour, minute] = timeOfBirth.split(":").map(Number);

    let lat = latitude;
    let lng = longitude;
    if (lat == null || lng == null) {
      const coords = await getCoordinates(city, country);
      if (coords) { lat = coords.latitude; lng = coords.longitude; }
    }

    const params: VedicParams = {
      year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
      hour, minute, city,
      ...(lat != null && lng != null ? { lat, lng } : {}),
    };

    const chartData = await astroService.fetchVedicChart(params);

    const chart = await BirthChartModel.create({
      userId,
      chartName: `${name}'s Kundali`,
      chartData,
      chartImage: "",
      generatedAt: new Date(),
      guestDetails: { name, gender, dateOfBirth, timeOfBirth, city, state, country },
    });

    return this.created(res, chart, "Chart generated successfully");
  });

  public saveChart = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return this.fail(res, 401, "Unauthorized");

    const profile = await UserProfileModel.findOne({ userId, isDeleted: false });
    if (!profile) return this.fail(res, 404, "Please create your profile first");

    const chartData = await astroService.fetchVedicChart(this.buildParams(profile));

    const chart = await BirthChartModel.create({
      userId,
      profileId: profile._id,
      chartName: req.body.chartName || "My Birth Chart",
      chartData,
      chartImage: "",
      generatedAt: new Date(),
    });
    return this.created(res, chart, "Chart saved successfully");
  });

  public deleteChart = this.asyncHandler(async (req: Request, res: Response) => {
    const reqUser = req.user;
    if (!reqUser) return this.fail(res, 401, "Unauthorized");

    const chart = await BirthChartModel.findById(req.params.chartId);
    if (!chart || chart.isDeleted) return this.fail(res, 404, "Chart not found");

    if (reqUser.role !== "admin" && String(chart.userId) !== String(reqUser._id)) {
      return this.fail(res, 403, "Insufficient access");
    }

    chart.isDeleted = true;
    await chart.save();
    return this.ok(res, null, "Chart deleted successfully");
  });
}

export const chartController = new ChartController();
