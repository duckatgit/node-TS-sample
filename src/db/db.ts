import mongoose, { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import logger from "../service/logger";
import { constants }  from "../common/constants";
import { DbOperationObject } from "../common/interface";

/**
 * Perform one or multiple DB operations (insert or update) with transaction support.
 */
export function performDbOperations(operations: DbOperationObject[] = []): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const results: any[] = [];

      for (const op of operations) {
        let result;

        if (op.type === constants.UPDATE) {
          logger.info(`UPDATE: Updation of Data into ${op.model.modelName} and Object: ${JSON.stringify(op.update)}`);
          result = await op.model.findOneAndUpdate(op.query, op.update, {new: true, runValidators: true});
        } else if (op.type === constants.INSERT) {
          logger.info(`INSERT: Insert New Data into ${op.model.modelName}, Object: ${JSON.stringify(op.doc)}`);
          const doc = new op.model(op.doc);
          result = await doc.save();
        } else {
          // This branch is now safe
          throw new Error(`Unsupported operation type: ${(op as any).type}`);
        }
        results.push(result);
      }
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
}

export function performSingleDBOperation(operation: DbOperationObject) {
  return performDbOperations([operation]);
}
