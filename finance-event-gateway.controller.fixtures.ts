import {
  BeneficiaryAccountType,
  CloudEventData_v1_0_1,
  InitialProvideProofOfPaymentTaskData,
  makeHttpStatusCode,
  PaymentCurrency,
  PaymentDetailsReason,
  PaymentStatus,
  ProvideProofProofStatus,
  ProvideProofTaskStatus,
  ProvideProofTaskType,
  UpdatedProvideProofOfPaymentTaskData,
} from "@app/types";

export const validEvent: CloudEventData_v1_0_1<InitialProvideProofOfPaymentTaskData> =
  {
    id: "",
    source: "",
    specversion: "1.0",
    type: "provide-proof-task.created",
    dataschema: "",
    subject: "",
    time: "",
    data: {
      taskID: "task-id",
      taskStatus: ProvideProofTaskStatus.TASK_CREATED,
      taskType: ProvideProofTaskType.ProvideProofOfPayment,
      proofStatus: ProvideProofProofStatus.AWAITING_PROOF,
      context: {
        transactionReference: "12345",
        paymentDetails: {
          paymentReason: PaymentDetailsReason.CAR_FINANCE_DEAL_PAYOUT,
          paymentReference: "12345",
          paymentAmount: 10000000.99,
          paymentCurrency: PaymentCurrency.GBP,
        },
        beneficiary: {
          beneficiaryAccount: {
            kind: BeneficiaryAccountType.UK_BANK_ACCOUNT,
            accountName: "Dr Evil",
            accountNumber: "11111111",
            sortCode: "111111",
          },
          beneficiaryAddress: {
            line1: "moon base",
            line2: "dark side of the moon",
            line3: "",
            town: "",
            county: "",
            postcode: "",
          },
        },
      },
    },
  };

export const validDataResponse: UpdatedProvideProofOfPaymentTaskData = {
  taskID: "task-id",
  taskStatus: ProvideProofTaskStatus.TASK_UPDATED,
  taskType: ProvideProofTaskType.ProvideProofOfPayment,
  proofStatus: ProvideProofProofStatus.AWAITING_PROOF,
  context: {
    transactionReference: "12345",
    paymentDetails: {
      paymentReason: PaymentDetailsReason.CAR_FINANCE_DEAL_PAYOUT,
      paymentReference: "12345",
      paymentAmount: 10000000.99,
      paymentCurrency: PaymentCurrency.GBP,
    },
    beneficiary: {
      beneficiaryAccount: {
        kind: BeneficiaryAccountType.UK_BANK_ACCOUNT,
        accountName: "Dr Evil",
        accountNumber: "11111111",
        sortCode: "111111",
      },
      beneficiaryAddress: {
        line1: "moon base",
        line2: "dark side of the moon",
        line3: "",
        town: "",
        county: "",
        postcode: "",
      },
    },
  },
  evidence: {
    paymentProviderReference: "Muuid",
    paymentStatus: PaymentStatus.IN_PROGRESS,
    responseDetails: {
      headers: [],
      statusCode: makeHttpStatusCode(200),
    },
  },
};

export const invalidEvent: CloudEventData_v1_0_1<InitialProvideProofOfPaymentTaskData> =
  {
    id: "",
    source: "",
    specversion: "1.0",
    type: "provide-proof-task.broken",
    dataschema: "",
    subject: "",
    time: "",
    data: {
      taskID: "task-id",
      taskStatus: ProvideProofTaskStatus.TASK_CREATED,
      taskType: ProvideProofTaskType.ProvideProofOfPayment,
      proofStatus: ProvideProofProofStatus.AWAITING_PROOF,
      context: {
        transactionReference: "12345",
        paymentDetails: {
          paymentReason: PaymentDetailsReason.CAR_FINANCE_DEAL_PAYOUT,
          paymentReference: "12345",
          paymentAmount: 10000000.99,
          paymentCurrency: PaymentCurrency.GBP,
        },
        beneficiary: {
          beneficiaryAccount: {
            kind: BeneficiaryAccountType.UK_BANK_ACCOUNT,
            accountName: "Dr Evil",
            accountNumber: "11111111",
            sortCode: "111111",
          },
          beneficiaryAddress: {
            line1: "moon base",
            line2: "dark side of the moon",
            line3: "",
            town: "",
            county: "",
            postcode: "",
          },
        },
      },
    },
  };
