import { isContentStatus } from "@/lib/content/types";
import type { PaginatedResult, PaginationOptions } from "@/lib/api/pagination";
import { curriculumRepository } from "@/features/learning/repositories/curriculum.repository";
import type {
  LessonInput,
  LessonRow,
  RegionInput,
  RegionRow,
  UnitRow,
} from "@/features/learning/types/curriculum.types";

function validateRegion(input: RegionInput): string | null {
  if (!input.slug.trim()) return "Slug is required.";
  if (!input.name.trim()) return "Name is required.";
  if (input.status && !isContentStatus(input.status)) {
    return "Invalid status.";
  }
  return null;
}

function validateLesson(input: LessonInput): string | null {
  if (!input.unitId) return "Unit is required.";
  if (!input.title.trim()) return "Title is required.";
  if (input.status && !isContentStatus(input.status)) {
    return "Invalid status.";
  }
  return null;
}

class CurriculumAdminService {
  listRegions(
    pagination: PaginationOptions = {},
  ): Promise<PaginatedResult<RegionRow>> {
    return curriculumRepository.listRegions(pagination);
  }

  getRegionById(id: string): Promise<RegionRow | null> {
    return curriculumRepository.findRegionById(id);
  }

  async createRegion(input: RegionInput): Promise<RegionRow> {
    const error = validateRegion(input);
    if (error) throw new Error(error);
    return curriculumRepository.createRegion(input);
  }

  async updateRegion(id: string, input: RegionInput): Promise<RegionRow> {
    const error = validateRegion(input);
    if (error) throw new Error(error);
    return curriculumRepository.updateRegion(id, input);
  }

  removeRegion(id: string): Promise<void> {
    return curriculumRepository.removeRegion(id);
  }

  listUnits(): Promise<UnitRow[]> {
    return curriculumRepository.listUnits();
  }

  listLessons(
    pagination: PaginationOptions = {},
  ): Promise<PaginatedResult<LessonRow>> {
    return curriculumRepository.listLessons(pagination);
  }

  getLessonById(id: string): Promise<LessonRow | null> {
    return curriculumRepository.findLessonById(id);
  }

  async createLesson(input: LessonInput): Promise<LessonRow> {
    const error = validateLesson(input);
    if (error) throw new Error(error);
    return curriculumRepository.createLesson(input);
  }

  async updateLesson(id: string, input: LessonInput): Promise<LessonRow> {
    const error = validateLesson(input);
    if (error) throw new Error(error);
    return curriculumRepository.updateLesson(id, input);
  }

  removeLesson(id: string): Promise<void> {
    return curriculumRepository.removeLesson(id);
  }
}

export const curriculumAdminService = new CurriculumAdminService();
