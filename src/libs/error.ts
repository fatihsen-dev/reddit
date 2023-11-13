import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HttpError } from "~/libs/sessionCheck";

interface IReturn {
  message: string;
  statusCode: number;
}

export const errorHandler = (error: unknown): IReturn => {
  if (error instanceof PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  } else if (error instanceof HttpError) {
    return {
      message: error.message,
      statusCode: error.status,
    };
  } else if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    };
  } else {
    return {
      message: "something went wrong",
      statusCode: 500,
    };
  }
};

const handlePrismaError = (err: PrismaClientKnownRequestError): IReturn => {
  switch (err.code) {
    case "P1006":
      return {
        message: `Data could not be saved`,
        statusCode: 400,
      };
    case "P1007":
      return {
        message: `Data could not be deleted`,
        statusCode: 400,
      };
    case "P1008":
      return {
        message: `Data could not be updated`,
        statusCode: 400,
      };
    default:
      return {
        message: `Something went wrong`,
        statusCode: 500,
      };
  }
};
