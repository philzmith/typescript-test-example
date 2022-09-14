import { Body, Controller, Inject, Post } from "@nestjs/common";
import { Client, ClientKafka, EventPattern } from "@nestjs/microservices";
import { microserviceConfig } from "@app/domain/config";
import { distributeEvent, EventHandlerMap } from "@app/events";
import { Logger } from "@app/logger/class";
import {
  CloudEventData_v1_0_1,
  Payload,
  ProvideProofOfPaymentTaskData,
} from "@app/types";
import { ProvideProofEventHandler } from "../events/ProvideProofEventHandler";
import { FinancialRuleHandler } from "../financial-rules/FinancialRuleHandler";

import { TaskCreatedHandler } from "../handlers/task-created.handler";
import { TaskUpdatedHandler } from "../handlers/task-updated.handler";
import { PaymentProvider } from "../PaymentProvider/PaymentProvider";
import { ProvideProofOfPaymentRepository } from "../../../lib/repository/provide-proof-of-payment-repository";

@Controller()
export class FinanceEventGatewayController {
  @Client(
    microserviceConfig(
      process.env.KAFKA_BOOTSTRAP_SERVERS || "localhost:9092",
      "treasury",
      "treasury-consumer"
    )
  )
  eventPublisher: ClientKafka;

  eventDispatchMap: EventHandlerMap = {
    "provide-proof-task.created": new TaskCreatedHandler(
      this.dataService,
      this.paymentProvider,
      this.eventHandler,
      this.financialRules
    ),
    "provide-proof-task.updated": new TaskUpdatedHandler(this.dataService),
  };

  public logger = new Logger(FinanceEventGatewayController.name, true);

  constructor(
    public readonly dataService: ProvideProofOfPaymentRepository,
    @Inject("PaymentProvider")
    private readonly paymentProvider: PaymentProvider,
    private readonly eventHandler: ProvideProofEventHandler,
    @Inject("FinancialRulesService")
    private readonly financialRules: FinancialRuleHandler
  ) {}

  @Post()
  async apiTaskHandler(@Body() body) {
    await distributeEvent(body, this.eventDispatchMap);
    return body;
  }

  @EventPattern("provide-proof-task")
  async taskHandler(
    payload: Payload<CloudEventData_v1_0_1<ProvideProofOfPaymentTaskData>>
  ) {
    try {
      await distributeEvent(payload.value, this.eventDispatchMap);
    } catch (exception) {
      this.logger.error(exception);
    }
  }
}
