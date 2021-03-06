"use strict";

import { Utils } from "../utils";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityTokenCapGC = Utils.requireContract("TokenCapGC");

export class TokenCapGC extends ExtendTruffleContract(SolidityTokenCapGC) {
  static async new() {
    const contract = await SolidityTokenCapGC.new();
    return new this(contract);
  }

  async setParams(params) {
    return await super.setParams(params.token, params.cap);
  }
}
