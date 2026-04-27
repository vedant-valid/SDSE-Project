import { Request, Response } from "express";
import { BaseController } from "../core/BaseController";
import { DoshaReportModel } from "../models/DoshaReportModel";
import { UserProfileModel } from "../models/UserProfileModel";
import { doshaService } from "../services/doshaService";
import { astroService } from "../services/AstroService";
import { DoshaType, VedicParams } from "../types/vedic";

const DOSHA_TYPES: DoshaType[] = ["manglik", "kalsarp", "sadesati", "pitradosh", "nadi"];

class DoshaController extends BaseController {
  private buildParams(profile: InstanceType<typeof UserProfileModel>): VedicParams {
    const d = new Date((profile as any).personalInfo.dateOfBirth);
    const [hour, minute] = ((profile as any).personalInfo.timeOfBirth as string).split(":").map(Number);
    const coords = (profile as any).personalInfo.placeOfBirth.coordinates;
    const params: VedicParams = {
      year:  d.getFullYear(),
      month: d.getMonth() + 1,
      day:   d.getDate(),
      hour,
      minute,
      city: (profile as any).personalInfo.placeOfBirth.city,
    };
    if (coords?.latitude != null && coords?.longitude != null) {
      params.lat = coords.latitude;
      params.lng = coords.longitude;
    }
    return params;
  }

  public getDoshaTypes = this.asyncHandler(async (_req: Request, res: Response) => {
    return this.ok(res, DOSHA_TYPES);
  });

  public searchDoshas = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return this.fail(res, 401, "Unauthorized");

    const { type, severity, isPresent, page = "1", limit = "10", sort = "-createdAt", search } =
      req.query as Record<string, string>;

    const filter: Record<string, unknown> = { userId };
    if (type)      filter.doshaType = type;
    if (severity)  filter.severity = severity;
    if (isPresent !== undefined) filter.isPresent = isPresent === "true";

    const pageNum  = Number(page);
    const limitNum = Number(limit);
    const skip     = (pageNum - 1) * limitNum;

    if (search) {
      const all = await DoshaReportModel.find(filter).populate("profileId", "personalInfo").sort(sort);
      const filtered = all.filter((item: any) =>
        item.profileId?.personalInfo?.name?.toLowerCase().includes(search.toLowerCase())
      );
      return res.json({
        success: true, total: filtered.length, page: pageNum, limit: limitNum,
        data: filtered.slice(skip, skip + limitNum).map((r) => doshaService.formatReport(r as any)),
      });
    }

    const [items, total] = await Promise.all([
      DoshaReportModel.find(filter).populate("profileId", "personalInfo").sort(sort).skip(skip).limit(limitNum),
      DoshaReportModel.countDocuments(filter),
    ]);

    return res.json({
      success: true, total, page: pageNum, limit: limitNum,
      data: items.map((r) => doshaService.formatReport(r as any)),
    });
  });

  public checkDosha = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return this.fail(res, 401, "Unauthorized");

    const { doshaType, profileId } = req.body as { doshaType: DoshaType; profileId?: string };
    if (!DOSHA_TYPES.includes(doshaType)) {
      return this.fail(res, 400, `Invalid doshaType. Valid values: ${DOSHA_TYPES.join(", ")}`);
    }

    const profileFilter: Record<string, unknown> = { userId, isDeleted: false };
    if (profileId) profileFilter._id = profileId;

    const profile = await UserProfileModel.findOne(profileFilter);
    if (!profile) return this.fail(res, 404, "Profile not found");

    // Fetch full Vedic chart, then compute the requested dosha from it
    const chartData = await astroService.fetchVedicChart(this.buildParams(profile as any));
    const doshaResult = astroService.computeDosha(doshaType, chartData);

    const severity = doshaResult.is_present
      ? doshaService.calculateSeverity(doshaResult as unknown as Record<string, unknown>)
      : "low";

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const saved = await DoshaReportModel.create({
      userId,
      profileId: (profile as any)._id,
      doshaType,
      inputParams: this.buildParams(profile as any) as unknown as Record<string, unknown>,
      apiResponse: { ...doshaResult, chartSnapshot: { ayanamsha: chartData.ayanamsha, ascendant: chartData.ascendant } },
      isPresent: doshaResult.is_present,
      severity,
      remedies: doshaResult.remedies,
      cachedAt: new Date(),
      expiresAt,
    });

    return this.created(res, doshaService.formatReport(saved as any), "Dosha report generated successfully");
  });

  public getDoshaReport = this.asyncHandler(async (req: Request, res: Response) => {
    const reqUser = req.user;
    if (!reqUser) return this.fail(res, 401, "Unauthorized");

    const report = await DoshaReportModel.findById(req.params.doshaId).populate("profileId", "personalInfo");
    if (!report) return this.fail(res, 404, "Report not found");

    if (reqUser.role !== "admin" && String(report.userId) !== String(reqUser._id)) {
      return this.fail(res, 403, "Insufficient access");
    }

    return this.ok(res, doshaService.formatReport(report as any));
  });

  public deleteDoshaReport = this.asyncHandler(async (req: Request, res: Response) => {
    const reqUser = req.user;
    if (!reqUser) return this.fail(res, 401, "Unauthorized");

    const report = await DoshaReportModel.findById(req.params.doshaId);
    if (!report) return this.fail(res, 404, "Report not found");

    if (reqUser.role !== "admin" && String(report.userId) !== String(reqUser._id)) {
      return this.fail(res, 403, "Insufficient access");
    }

    await report.deleteOne();
    return this.ok(res, null, "Dosha report deleted");
  });
}

export const doshaController = new DoshaController();
