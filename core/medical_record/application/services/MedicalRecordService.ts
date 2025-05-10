/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IMedicalRecordService } from "./interfaces";
import {
  CreateMedicalRecordRequest,
  CreateMedicalRecordResponse,
  GetMedicalRecordRequest,
  GetMedicalRecordResponse,
  UpdateMedicalRecordRequest,
  UpdateMedicalRecordResponse,
  DeleteMedicalRecordRequest,
  DeleteMedicalRecordResponse,
  AddDataToMedicalRecordRequest,
  AddDataToMedicalRecordResponse
} from "../useCases";
import { MedicalRecordDto } from "../dtos";

export interface MedicalRecordServiceUseCases {
  createUC: UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse>;
  getUC: UseCase<GetMedicalRecordRequest, GetMedicalRecordResponse>;
  updateUC: UseCase<UpdateMedicalRecordRequest, UpdateMedicalRecordResponse>;
  deleteUC: UseCase<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse>;
  addDataUC: UseCase<AddDataToMedicalRecordRequest, AddDataToMedicalRecordResponse>;
}

export class MedicalRecordService implements IMedicalRecordService {
  constructor(private readonly ucs: MedicalRecordServiceUseCases) {}

  async create(req: CreateMedicalRecordRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(req: GetMedicalRecordRequest): Promise<AppServiceResponse<MedicalRecordDto> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async update(req: UpdateMedicalRecordRequest): Promise<AppServiceResponse<void> | Message> {
    const res = await this.ucs.updateUC.execute(req);
    if (res.isRight()) return { data: void 0 };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async delete(req: DeleteMedicalRecordRequest): Promise<AppServiceResponse<void> | Message> {
    const res = await this.ucs.deleteUC.execute(req);
    if (res.isRight()) return { data: void 0 };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async addData(req: AddDataToMedicalRecordRequest): Promise<AppServiceResponse<void> | Message> {
    const res = await this.ucs.addDataUC.execute(req);
    if (res.isRight()) return { data: void 0 };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}