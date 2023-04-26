import { Instance } from "../core/index.js";

export class CleanUpLoseInstance {
  private killPRIds = [];

  private getAllLiveInstances() {}

  private getPRStatus(prId: string) {}

  private updateDanglingInstance() {}

  private terminateDeadInstances() {}

  /**
   * get all live instance,
   * check if PR status is live
   *
   * update dangling instance to killPRIds
   * terminate all killPRIds
   *
   */
  run() {}
}
