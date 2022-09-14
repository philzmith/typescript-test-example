import { ConfigModule } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoseMock as DBMock } from "@app/domain/helpers";
import {
  CloudEventData_v1_0_1,
  InitialProvideProofOfPaymentTaskData,
  Payload,
} from "@app/types";
import { ProvideProofEventHandler } from "../events/ProvideProofEventHandler";
import { FinancialRulesService } from "../financial-rules/FinancialRulesService";
import { MockPaymentProvider } from "../PaymentProvider/MockPaymentProvider";
import { ProvideProofOfPaymentRepository } from "../../../lib/repository/provide-proof-of-payment-repository";
import { FinanceEventGatewayController } from "./finance-event-gateway.controller";
import {
  invalidEvent,
  validDataResponse,
  validEvent,
} from "./finance-event-gateway.controller.fixtures";

describe("TreasuryEventGatewayController", () => {
  let eventGatewayController: FinanceEventGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FinanceEventGatewayController],
      providers: [
        ProvideProofOfPaymentRepository,
        {
          provide: getModelToken("ProvideProofTask"),
          useValue: DBMock,
        },
        {
          provide: "PaymentProvider",
          useFactory: () => {
            return new MockPaymentProvider();
          },
        },
        ProvideProofEventHandler,
        {
          provide: "FinancialRulesService",
          useFactory: () => {
            return new FinancialRulesService();
          },
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    DBMock.dbEntries = [];

    eventGatewayController = app.get<FinanceEventGatewayController>(
      FinanceEventGatewayController
    );
  });

  it("should save data to the database when task-created event is consumed", async () => {
    const taskCreatedEvent: Payload<
      CloudEventData_v1_0_1<InitialProvideProofOfPaymentTaskData>
    > = {
      magicByte: 1,
      attributes: 1,
      timestamp: 1,
      offset: 1,
      value: validEvent,
      headers: {},
      isControlRecord: true,
      batchContext: {},
      topic: "",
      partition: 1,
    };

    await eventGatewayController.taskHandler(taskCreatedEvent);

    expect(DBMock.dbEntries[0]).toEqual(validDataResponse);
  });

  it("should save data to the database when task-created api is called", async () => {
    await eventGatewayController.apiTaskHandler(validEvent);

    expect(DBMock.dbEntries[0]).toEqual(validDataResponse);
  });

  it("should log an error if an exception is thrown", async () => {
    const payload: Payload<
      CloudEventData_v1_0_1<InitialProvideProofOfPaymentTaskData>
    > = {
      magicByte: 1,
      attributes: 1,
      timestamp: 1,
      offset: 1,
      value: invalidEvent,
      headers: {},
      isControlRecord: true,
      batchContext: {},
      topic: "",
      partition: 1,
    };

    const loggerSpy = jest.spyOn(eventGatewayController.logger, "error");

    await eventGatewayController.taskHandler(payload);

    expect(loggerSpy).toBeCalled();
  });
});
