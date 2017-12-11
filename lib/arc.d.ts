import * as BigNumber from 'bignumber.js';
import * as Web3 from "web3";

declare module 'daostack-arc' {

/*******************************
 * Arc
 */
export interface ArcContractInfo {
    /**
     * TruffleContract as obtained via require()
     */
    contract: any;
    address: string;
}

/**
 * An object with property names being a contract key and property value as the corresponding ArcContractInfo.
 * For all deployed contracts exposed by Arc.
 */
export interface ArcDeployedContractKeys {
  SimpleContributionScheme: ArcContractInfo;
  GenesisScheme: ArcContractInfo;
  GlobalConstraintRegistrar: ArcContractInfo;
  SchemeRegistrar: ArcContractInfo;
  SimpleICO: ArcContractInfo;
  TokenCapGC: ArcContractInfo;
  UpgradeScheme: ArcContractInfo;
  AbsoluteVote: ArcContractInfo;
}

/**
 * ArcDeployedContractKeys, and those contracts organized by type.
 */
export interface ArcDeployedContracts {
    allContracts : ArcDeployedContractKeys;
    /**
     * All deployed schemes
     */
    schemes: Array<ArcContractInfo>;
    /**
     * All deployed voting machines
     */
    votingMachines: Array<ArcContractInfo>;
    /**
     * All deployed global constraints
     */
    globalConstraints: Array<ArcContractInfo>;
}

// from arc.js
export function configure(options : any): Web3;
export function getDeployedContracts() : ArcDeployedContracts;

/*******************************
 * Wallet
 */
export class Wallet {
  static new() : Wallet;
  static fromEncrypted(encryptedJSON: string, password: string) : Wallet
  static fromMnemonic(mnemonic: string) : Wallet
  static fromPrivateKey(privateKey : string) : Wallet

  encrypt(password: string, progressCallback: (progress: number) => void) : string
  getEtherBalance(inWei? : boolean) : BigNumber.BigNumber | string
  getMnemonic() : string
  getOrgTokenBalance(organizationAvatarAddress : string, inWei? : boolean) : BigNumber.BigNumber | string
  getPublicAddress() : string
  getProvider() : any
  sendEther(accountAddress : string, numEther: number | string) : any // TODO return value
  sendOrgTokens(organizationAvatarAddress : string, toAccountAddress : string, numTokens : number | string) : any // TODO return value
}

/********************************
 * Organization
 */
export class Organization  {
  /**
   * includes static `new` and `at`
   */
  avatar: any;
  /**
   * Controller truffle contract
   */
  controller: any;
  /**
   * DAOToken truffle contract
   */
  token: any;
  /**
   * Reputation truffle contract
   */
  reputation: any;
  /**
   * AbsoluteVote truffle contract
   */
  votingMachine: any;

  schemes(contractName?:string) : any;
  scheme(contractName:string) : any;
  // checkSchemeConditions(contractName:string);
  // proposeScheme(options?);
  // proposeGlobalConstraint(options?);
  // vote(proposalId, choice, params);
  static new(options:any): Organization;
  static at(avatarAddress:string): Organization;
}


/********************************
 * Utils
 */
export interface TransactionLog {
  'address': string,
  'blockHash': string,
  'blockNumber': number
  'data': string,
  'logIndex': number,
  'topics': Array<string>,
  'transactionHash': string,
  'transactionIndex': number,
  "type": string
}

export interface TransactionLogTruffle {
  'address': string,
  'args': any
  'blockHash': string,
  'blockNumber': number
  'event': string,
  'logIndex': number,
  'transactionHash': string,
  'transactionIndex': number,
  "type": string
}

export interface TransactionReceipt {
  'blockHash': string, // 32 Bytes - hash of the block where this transaction was in.
  'blockNumber': number // block number where this transaction was in.
  'transactionHash': string, // 32 Bytes - hash of the transaction.
  'transactionIndex': number, //integer of the transactions index position in the block.
  'from': string, // 20 Bytes - address of the sender.
  'to': string, // 20 Bytes - address of the receiver. null when its a contract creation transaction.
  'cumulativeGasUsed': number, //The total amount of gas used when this transaction was executed in the block.
  'gasUsed': number, //  The amount of gas used by this specific transaction alone.
  'contractAddress': string, // 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise null.
  'logs': Array<TransactionLog>, // Array of log objects, which this transaction generated.
}

export interface TransactionReceiptTruffle {
  transactionHash: string,
  logs: Array<TransactionLogTruffle>,
  receipt: TransactionReceipt,
  tx: string // address of the transaction
}

export function requireContract(contractName : string): any;
export function getWeb3():Web3;
export function getValueFromLogs(tx:TransactionReceiptTruffle, arg:string, eventName:string, index:number):string;
export function getDefaultAccount():any;

export class ExtendTruffleContract {
  static new(options:any): any;
  static at(address:string): any;
  static deployed(): any;

  /**
   * Call setParameters on this contract, returning promise of the parameters hash.
   * @params Should contain property names expected by the specific contract type.
   */
  setParams(params: any): string;
}

export class ExtendTruffleScheme extends ExtendTruffleContract {
  /**
   * Returns a string containing 1s and 0s representing scheme permissions as follows:
   *
   * All 0: Not registered,
   * 1st bit: Flag if the scheme is registered,
   * 2nd bit: Scheme can register other schemes
   * 3th bit: Scheme can add/remove global constraints
   * 4rd bit: Scheme can upgrade the controller
   *
   */
  getDefaultPermissions(overrideValue: string): string;
}

export interface StandardNewSchemeParams {
    fee?: BigNumber.BigNumber | string, // the fee to use this scheme, in Wei
    beneficiary?: string, // default is default account,
    tokenAddress?: string, // the address of a token to use
}

export interface StandardSchemeParams {
  voteParametersHash: string,
  votingMachine: string // address
}

/********************************
 * GlobalConstraintRegistrar
 */
export interface GlobalConstraintRegistrarNewParams extends StandardNewSchemeParams { }

export interface GlobalConstraintRegistrarParams extends StandardSchemeParams { }

export interface ProposeToAddModifyGlobalConstraintParams {
    /**
     * avatar address
     */
    avatar: string
    /**
     *  the address of the global constraint to add
     */
    , globalConstraint: string
    /**
     * hash of the parameters of the global contraint
     */
    , globalConstraintParametersHash: string
    /**
     * voting machine to use when voting to remove the global constraint
     */
    , votingMachineHash: string
}

export interface ProposeToRemoveGlobalConstraintParams {
    /**
     * avatar address
     */
    avatar: string
    /**
     *  the address of the global constraint to remove
     */
    , globalConstraint: string
  }

export class GlobalConstraintRegistrar extends ExtendTruffleScheme {
  static new(options:GlobalConstraintRegistrarNewParams): GlobalConstraintRegistrar;
  static at(address:string): GlobalConstraintRegistrar;
  static deployed(): GlobalConstraintRegistrar;

  /**
   *  propose to add or modify a global constraint
   * @param opts ProposeToAddModifyGlobalConstraintParams
   */
  proposeToAddModifyGlobalConstraint(opts: ProposeToAddModifyGlobalConstraintParams): TransactionReceiptTruffle;
  /**
   * propose to remove a global constraint
   * @param opts ProposeToRemoveGlobalConstraintParams
   */
  proposeToRemoveGlobalConstraint(opts: ProposeToRemoveGlobalConstraintParams): TransactionReceiptTruffle;

  setParams(params: GlobalConstraintRegistrarParams): string;
}

/********************************
 * SchemeRegistrar
 */
  export interface SchemeRegistrarNewParams extends StandardNewSchemeParams { }

  export interface SchemeRegistrarParams extends StandardSchemeParams { }

  export interface ProposeToAddModifySchemeParams {
      /**
       * avatar address
       */
      avatar: string
      /**
       * scheme address
       */
      , scheme: string
      /**
       * scheme identifier, like "SchemeRegistrar" or "SimpleContributionScheme".
       * pass null if registering a non-arc scheme
       */
      , schemeKey?: string|null
      /**
       * hash of scheme parameters. These must be already registered with the new scheme.
       */
      , schemeParametersHash: string
      /**
       * The fee that the scheme charges to register an organization in the scheme.  The controller
       * will be asked in advance to approve this expenditure.
       *
       * If schemeKey is given but fee is not then we use the amount of the fee of the
       * Arc scheme given by scheme and schemeKey.
       *
       * Fee is required when schemeKey is not given (non-Arc schemes).
       *
       * The fee is paid using the token given by tokenAddress.  In Wei.
       */
      , fee?: BigNumber.BigNumber | string | null
      /**
       * The token used to pay the fee that the scheme charges to register an organization in the scheme.
       *
       * If schemeKey is given but tokenAddress is not then we use the token address of the
       * Arc scheme given by scheme and schemeKey.
       *
       * tokenAddress is required when schemeKey is not given (non-Arc schemes).
       */
      , tokenAddress?: string | null
      /**
       * true if the given scheme is able to register/unregister/modify schemes.
       *
       * isRegistering should only be supplied when schemeKey is not given (and thus the scheme is non-Arc).
       * Otherwise we determine it's value based on scheme and schemeKey.
       */
      , isRegistering?: boolean|null
      /**
       * true to register organization into the scheme when the proposal is approved.
       * If false then caller must do it manually via scheme.registerOrganization(avatarAddress).
       * Default is true.
       */
      , autoRegister?:boolean
    }

  export interface ProposeToRemoveSchemeParams {
      /**
       * avatar address
       */
      avatar: string
      /**
       *  the address of the global constraint to remove
       */
      , scheme: string
    }

  export class SchemeRegistrar extends ExtendTruffleScheme {
    static new(options:SchemeRegistrarNewParams): SchemeRegistrar;
    static at(address:string): SchemeRegistrar;
    static deployed(): SchemeRegistrar;
    /**
     *  propose to add or modify a scheme
     * @param opts ProposeToAddModifySchemeParams
     */
    proposeToAddModifyScheme(opts: ProposeToAddModifySchemeParams): TransactionReceiptTruffle;
    /**
     * propose to remove a scheme
     * @param opts ProposeToRemoveSchemeParams
     */
    proposeToRemoveScheme(opts: ProposeToRemoveSchemeParams): TransactionReceiptTruffle;
    setParams(params: SchemeRegistrarParams): string;
  }

/********************************
 * UpgradeScheme
 */
  export interface UpgradeSchemeNewParams extends StandardNewSchemeParams { }

  export interface UpgradeSchemeParams extends StandardSchemeParams { }

  export interface ProposeUpgradingSchemeParams {
      /**
       * avatar address
       */
      avatar: string
      /**
       *  upgrading scheme address
       */
      , scheme: string
      /**
       * hash of the parameters of the upgrading scheme. These must be already registered with the new scheme.
       */
      , schemeParametersHash: string
      /**
       * true to register organization into the scheme when the proposal is approved.
       * If false then caller must do it manually via scheme.registerOrganization(avatarAddress).
       * Default is true.
       */
      , autoRegister:true
      /**
       * The fee that the scheme charges to register an organization in the new upgrade scheme.
       * The controller will be asked in advance to approve this expenditure.
       *
       * If the new UpgradeScheme is an Arc scheme, you may omit fee and we will
       * obtain the values directly from the submitted scheme.
       * Otherwise fee is required.
       *
       * The fee is paid using the token given by tokenAddress.  In Wei.
       */
      , fee?: BigNumber.BigNumber | string | null
      /**
       * address of token that will be used when paying the fee.
       *
       * If the new UpgradeScheme is an Arc scheme, you may omit tokenAddress and we will
       * obtain the values directly from the submitted scheme.
       * Otherwise tokenAddress is required.
       */
      , tokenAddress?: string | null
    }

  export interface ProposeControllerParams {
      /**
       * avatar address
       */
      avatar: string
      /**
       *  controller address
       */
      , controller: string
    }

  export class UpgradeScheme extends ExtendTruffleScheme {
    static new(options:UpgradeSchemeNewParams): UpgradeScheme;
    static at(address:string): UpgradeScheme;
    static deployed(): UpgradeScheme;
    /**
     * propose to replace this UpgradingScheme
     * @param opts ProposeUpgradingSchemeParams
     */
    proposeUpgradingScheme(opts: ProposeUpgradingSchemeParams): TransactionReceiptTruffle;
    /**
     * propose to replace this DAO's controller
     * @param opts ProposeControllerParams
     */
    proposeController(opts: ProposeControllerParams): TransactionReceiptTruffle;
    setParams(params: UpgradeSchemeParams): string;
  }

/********************************
 * SimpleContributionScheme
 */
  export interface SimpleContributionSchemeNewParams extends StandardNewSchemeParams { }

  export interface SimpleContributionSchemeParams extends StandardSchemeParams {
    orgNativeTokenFee: BigNumber.BigNumber | string,
    schemeNativeTokenFee: BigNumber.BigNumber | string
  }

  export interface ProposeContributionParams {
      /**
       * avatar address
       */
      avatar: string,
      /**
       * description of the constraint
       */
      description: string,
      /**
       * reward in the DAO's native token.  In Wei. Default is 0;
       */
      nativeTokenReward?: BigNumber.BigNumber | string,
      /**
       * reward in the DAO's native reputation.  In Wei. Default is 0;
       */
      reputationReward?: BigNumber.BigNumber | string,
      /**
       * reward in ethers.  In Wei. Default is 0;
       */
      ethReward?: BigNumber.BigNumber | string,
      /**
       * reward in the given external token.  In Wei. Default is 0;
       */
      externalTokenReward?: BigNumber.BigNumber | string,
      /**
       * the address of an external token (for externalTokenReward)
       * Only required when externalTokenReward is given and non-zero.
       */
      externalToken?: string,
      /**
       *  beneficiary address
       */
      beneficiary: string
    }

  export class SimpleContributionScheme extends ExtendTruffleScheme {
    static new(options:SimpleContributionSchemeNewParams): SimpleContributionScheme;
    static at(address:string): SimpleContributionScheme;
    static deployed(): SimpleContributionScheme;
    /**
     * propose to make a contribution
     * @param opts ProposeContributionParams
     */
    proposeContribution(opts: ProposeContributionParams): TransactionReceiptTruffle;
    setParams(params: SimpleContributionSchemeParams): string;
  }
}