import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  jsonb: any;
  timestamptz: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** columns and relationships of "BundleContracts" */
export type BundleContracts = {
  __typename?: 'BundleContracts';
  /** An object relationship */
  Bundle?: Maybe<Bundles>;
  BundleId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  Contract?: Maybe<Contracts>;
  ContractId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  functionSelectors: Scalars['jsonb'];
  id: Scalars['uuid'];
  order: Scalars['Int'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "BundleContracts" */
export type BundleContractsFunctionSelectorsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "BundleContracts" */
export type BundleContracts_Aggregate = {
  __typename?: 'BundleContracts_aggregate';
  aggregate?: Maybe<BundleContracts_Aggregate_Fields>;
  nodes: Array<BundleContracts>;
};

/** aggregate fields of "BundleContracts" */
export type BundleContracts_Aggregate_Fields = {
  __typename?: 'BundleContracts_aggregate_fields';
  avg?: Maybe<BundleContracts_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<BundleContracts_Max_Fields>;
  min?: Maybe<BundleContracts_Min_Fields>;
  stddev?: Maybe<BundleContracts_Stddev_Fields>;
  stddev_pop?: Maybe<BundleContracts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<BundleContracts_Stddev_Samp_Fields>;
  sum?: Maybe<BundleContracts_Sum_Fields>;
  var_pop?: Maybe<BundleContracts_Var_Pop_Fields>;
  var_samp?: Maybe<BundleContracts_Var_Samp_Fields>;
  variance?: Maybe<BundleContracts_Variance_Fields>;
};


/** aggregate fields of "BundleContracts" */
export type BundleContracts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<BundleContracts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "BundleContracts" */
export type BundleContracts_Aggregate_Order_By = {
  avg?: InputMaybe<BundleContracts_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<BundleContracts_Max_Order_By>;
  min?: InputMaybe<BundleContracts_Min_Order_By>;
  stddev?: InputMaybe<BundleContracts_Stddev_Order_By>;
  stddev_pop?: InputMaybe<BundleContracts_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<BundleContracts_Stddev_Samp_Order_By>;
  sum?: InputMaybe<BundleContracts_Sum_Order_By>;
  var_pop?: InputMaybe<BundleContracts_Var_Pop_Order_By>;
  var_samp?: InputMaybe<BundleContracts_Var_Samp_Order_By>;
  variance?: InputMaybe<BundleContracts_Variance_Order_By>;
};

/** aggregate avg on columns */
export type BundleContracts_Avg_Fields = {
  __typename?: 'BundleContracts_avg_fields';
  order?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "BundleContracts" */
export type BundleContracts_Avg_Order_By = {
  order?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "BundleContracts". All fields are combined with a logical 'AND'. */
export type BundleContracts_Bool_Exp = {
  Bundle?: InputMaybe<Bundles_Bool_Exp>;
  BundleId?: InputMaybe<Uuid_Comparison_Exp>;
  Contract?: InputMaybe<Contracts_Bool_Exp>;
  ContractId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<BundleContracts_Bool_Exp>>;
  _not?: InputMaybe<BundleContracts_Bool_Exp>;
  _or?: InputMaybe<Array<BundleContracts_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  functionSelectors?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type BundleContracts_Max_Fields = {
  __typename?: 'BundleContracts_max_fields';
  BundleId?: Maybe<Scalars['uuid']>;
  ContractId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  order?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "BundleContracts" */
export type BundleContracts_Max_Order_By = {
  BundleId?: InputMaybe<Order_By>;
  ContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type BundleContracts_Min_Fields = {
  __typename?: 'BundleContracts_min_fields';
  BundleId?: Maybe<Scalars['uuid']>;
  ContractId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  order?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "BundleContracts" */
export type BundleContracts_Min_Order_By = {
  BundleId?: InputMaybe<Order_By>;
  ContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "BundleContracts". */
export type BundleContracts_Order_By = {
  Bundle?: InputMaybe<Bundles_Order_By>;
  BundleId?: InputMaybe<Order_By>;
  Contract?: InputMaybe<Contracts_Order_By>;
  ContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  functionSelectors?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "BundleContracts" */
export enum BundleContracts_Select_Column {
  /** column name */
  BundleId = 'BundleId',
  /** column name */
  ContractId = 'ContractId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  FunctionSelectors = 'functionSelectors',
  /** column name */
  Id = 'id',
  /** column name */
  Order = 'order',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate stddev on columns */
export type BundleContracts_Stddev_Fields = {
  __typename?: 'BundleContracts_stddev_fields';
  order?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "BundleContracts" */
export type BundleContracts_Stddev_Order_By = {
  order?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type BundleContracts_Stddev_Pop_Fields = {
  __typename?: 'BundleContracts_stddev_pop_fields';
  order?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "BundleContracts" */
export type BundleContracts_Stddev_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type BundleContracts_Stddev_Samp_Fields = {
  __typename?: 'BundleContracts_stddev_samp_fields';
  order?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "BundleContracts" */
export type BundleContracts_Stddev_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type BundleContracts_Sum_Fields = {
  __typename?: 'BundleContracts_sum_fields';
  order?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "BundleContracts" */
export type BundleContracts_Sum_Order_By = {
  order?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type BundleContracts_Var_Pop_Fields = {
  __typename?: 'BundleContracts_var_pop_fields';
  order?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "BundleContracts" */
export type BundleContracts_Var_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type BundleContracts_Var_Samp_Fields = {
  __typename?: 'BundleContracts_var_samp_fields';
  order?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "BundleContracts" */
export type BundleContracts_Var_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type BundleContracts_Variance_Fields = {
  __typename?: 'BundleContracts_variance_fields';
  order?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "BundleContracts" */
export type BundleContracts_Variance_Order_By = {
  order?: InputMaybe<Order_By>;
};

/** columns and relationships of "Bundles" */
export type Bundles = {
  __typename?: 'Bundles';
  /** An array relationship */
  BundleContracts: Array<BundleContracts>;
  /** An aggregate relationship */
  BundleContracts_aggregate: BundleContracts_Aggregate;
  /** An object relationship */
  Creator?: Maybe<Wallets>;
  CreatorId?: Maybe<Scalars['uuid']>;
  abi: Scalars['jsonb'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description: Scalars['String'];
  id: Scalars['uuid'];
  name: Scalars['String'];
  types: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "Bundles" */
export type BundlesBundleContractsArgs = {
  distinct_on?: InputMaybe<Array<BundleContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BundleContracts_Order_By>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
};


/** columns and relationships of "Bundles" */
export type BundlesBundleContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<BundleContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BundleContracts_Order_By>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
};


/** columns and relationships of "Bundles" */
export type BundlesAbiArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "Bundles" */
export type Bundles_Aggregate = {
  __typename?: 'Bundles_aggregate';
  aggregate?: Maybe<Bundles_Aggregate_Fields>;
  nodes: Array<Bundles>;
};

/** aggregate fields of "Bundles" */
export type Bundles_Aggregate_Fields = {
  __typename?: 'Bundles_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Bundles_Max_Fields>;
  min?: Maybe<Bundles_Min_Fields>;
};


/** aggregate fields of "Bundles" */
export type Bundles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bundles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "Bundles" */
export type Bundles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bundles_Max_Order_By>;
  min?: InputMaybe<Bundles_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Bundles". All fields are combined with a logical 'AND'. */
export type Bundles_Bool_Exp = {
  BundleContracts?: InputMaybe<BundleContracts_Bool_Exp>;
  Creator?: InputMaybe<Wallets_Bool_Exp>;
  CreatorId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Bundles_Bool_Exp>>;
  _not?: InputMaybe<Bundles_Bool_Exp>;
  _or?: InputMaybe<Array<Bundles_Bool_Exp>>;
  abi?: InputMaybe<Jsonb_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  types?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type Bundles_Max_Fields = {
  __typename?: 'Bundles_max_fields';
  CreatorId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  types?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "Bundles" */
export type Bundles_Max_Order_By = {
  CreatorId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  types?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bundles_Min_Fields = {
  __typename?: 'Bundles_min_fields';
  CreatorId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  types?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "Bundles" */
export type Bundles_Min_Order_By = {
  CreatorId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  types?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Bundles". */
export type Bundles_Order_By = {
  BundleContracts_aggregate?: InputMaybe<BundleContracts_Aggregate_Order_By>;
  Creator?: InputMaybe<Wallets_Order_By>;
  CreatorId?: InputMaybe<Order_By>;
  abi?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  types?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Bundles" */
export enum Bundles_Select_Column {
  /** column name */
  CreatorId = 'CreatorId',
  /** column name */
  Abi = 'abi',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Types = 'types',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "ContractInstances" */
export type ContractInstances = {
  __typename?: 'ContractInstances';
  /** An object relationship */
  Contract?: Maybe<Contracts>;
  ContractId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  WalletContractInstances: Array<WalletContractInstances>;
  /** An aggregate relationship */
  WalletContractInstances_aggregate: WalletContractInstances_Aggregate;
  address: Scalars['String'];
  chainId: Scalars['Int'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "ContractInstances" */
export type ContractInstancesWalletContractInstancesArgs = {
  distinct_on?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<WalletContractInstances_Order_By>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
};


/** columns and relationships of "ContractInstances" */
export type ContractInstancesWalletContractInstances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<WalletContractInstances_Order_By>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
};

/** aggregated selection of "ContractInstances" */
export type ContractInstances_Aggregate = {
  __typename?: 'ContractInstances_aggregate';
  aggregate?: Maybe<ContractInstances_Aggregate_Fields>;
  nodes: Array<ContractInstances>;
};

/** aggregate fields of "ContractInstances" */
export type ContractInstances_Aggregate_Fields = {
  __typename?: 'ContractInstances_aggregate_fields';
  avg?: Maybe<ContractInstances_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<ContractInstances_Max_Fields>;
  min?: Maybe<ContractInstances_Min_Fields>;
  stddev?: Maybe<ContractInstances_Stddev_Fields>;
  stddev_pop?: Maybe<ContractInstances_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<ContractInstances_Stddev_Samp_Fields>;
  sum?: Maybe<ContractInstances_Sum_Fields>;
  var_pop?: Maybe<ContractInstances_Var_Pop_Fields>;
  var_samp?: Maybe<ContractInstances_Var_Samp_Fields>;
  variance?: Maybe<ContractInstances_Variance_Fields>;
};


/** aggregate fields of "ContractInstances" */
export type ContractInstances_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<ContractInstances_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "ContractInstances" */
export type ContractInstances_Aggregate_Order_By = {
  avg?: InputMaybe<ContractInstances_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<ContractInstances_Max_Order_By>;
  min?: InputMaybe<ContractInstances_Min_Order_By>;
  stddev?: InputMaybe<ContractInstances_Stddev_Order_By>;
  stddev_pop?: InputMaybe<ContractInstances_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<ContractInstances_Stddev_Samp_Order_By>;
  sum?: InputMaybe<ContractInstances_Sum_Order_By>;
  var_pop?: InputMaybe<ContractInstances_Var_Pop_Order_By>;
  var_samp?: InputMaybe<ContractInstances_Var_Samp_Order_By>;
  variance?: InputMaybe<ContractInstances_Variance_Order_By>;
};

/** aggregate avg on columns */
export type ContractInstances_Avg_Fields = {
  __typename?: 'ContractInstances_avg_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "ContractInstances" */
export type ContractInstances_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ContractInstances". All fields are combined with a logical 'AND'. */
export type ContractInstances_Bool_Exp = {
  Contract?: InputMaybe<Contracts_Bool_Exp>;
  ContractId?: InputMaybe<Uuid_Comparison_Exp>;
  WalletContractInstances?: InputMaybe<WalletContractInstances_Bool_Exp>;
  _and?: InputMaybe<Array<ContractInstances_Bool_Exp>>;
  _not?: InputMaybe<ContractInstances_Bool_Exp>;
  _or?: InputMaybe<Array<ContractInstances_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type ContractInstances_Max_Fields = {
  __typename?: 'ContractInstances_max_fields';
  ContractId?: Maybe<Scalars['uuid']>;
  address?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "ContractInstances" */
export type ContractInstances_Max_Order_By = {
  ContractId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type ContractInstances_Min_Fields = {
  __typename?: 'ContractInstances_min_fields';
  ContractId?: Maybe<Scalars['uuid']>;
  address?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "ContractInstances" */
export type ContractInstances_Min_Order_By = {
  ContractId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "ContractInstances". */
export type ContractInstances_Order_By = {
  Contract?: InputMaybe<Contracts_Order_By>;
  ContractId?: InputMaybe<Order_By>;
  WalletContractInstances_aggregate?: InputMaybe<WalletContractInstances_Aggregate_Order_By>;
  address?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "ContractInstances" */
export enum ContractInstances_Select_Column {
  /** column name */
  ContractId = 'ContractId',
  /** column name */
  Address = 'address',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate stddev on columns */
export type ContractInstances_Stddev_Fields = {
  __typename?: 'ContractInstances_stddev_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "ContractInstances" */
export type ContractInstances_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type ContractInstances_Stddev_Pop_Fields = {
  __typename?: 'ContractInstances_stddev_pop_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "ContractInstances" */
export type ContractInstances_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type ContractInstances_Stddev_Samp_Fields = {
  __typename?: 'ContractInstances_stddev_samp_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "ContractInstances" */
export type ContractInstances_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type ContractInstances_Sum_Fields = {
  __typename?: 'ContractInstances_sum_fields';
  chainId?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "ContractInstances" */
export type ContractInstances_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type ContractInstances_Var_Pop_Fields = {
  __typename?: 'ContractInstances_var_pop_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "ContractInstances" */
export type ContractInstances_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type ContractInstances_Var_Samp_Fields = {
  __typename?: 'ContractInstances_var_samp_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "ContractInstances" */
export type ContractInstances_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type ContractInstances_Variance_Fields = {
  __typename?: 'ContractInstances_variance_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "ContractInstances" */
export type ContractInstances_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** columns and relationships of "Contracts" */
export type Contracts = {
  __typename?: 'Contracts';
  /** An array relationship */
  BundleContracts: Array<BundleContracts>;
  /** An aggregate relationship */
  BundleContracts_aggregate: BundleContracts_Aggregate;
  /** An array relationship */
  ContractInstances: Array<ContractInstances>;
  /** An aggregate relationship */
  ContractInstances_aggregate: ContractInstances_Aggregate;
  /** An object relationship */
  Creator?: Maybe<Wallets>;
  CreatorId?: Maybe<Scalars['uuid']>;
  abi: Scalars['jsonb'];
  bytecode: Scalars['String'];
  contractType: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description: Scalars['String'];
  functionSelectors: Scalars['jsonb'];
  id: Scalars['uuid'];
  name: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
  version: Scalars['Int'];
};


/** columns and relationships of "Contracts" */
export type ContractsBundleContractsArgs = {
  distinct_on?: InputMaybe<Array<BundleContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BundleContracts_Order_By>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
};


/** columns and relationships of "Contracts" */
export type ContractsBundleContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<BundleContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BundleContracts_Order_By>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
};


/** columns and relationships of "Contracts" */
export type ContractsContractInstancesArgs = {
  distinct_on?: InputMaybe<Array<ContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ContractInstances_Order_By>>;
  where?: InputMaybe<ContractInstances_Bool_Exp>;
};


/** columns and relationships of "Contracts" */
export type ContractsContractInstances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<ContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ContractInstances_Order_By>>;
  where?: InputMaybe<ContractInstances_Bool_Exp>;
};


/** columns and relationships of "Contracts" */
export type ContractsAbiArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "Contracts" */
export type ContractsFunctionSelectorsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** order by aggregate values of table "Contracts" */
export type Contracts_Aggregate_Order_By = {
  avg?: InputMaybe<Contracts_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Contracts_Max_Order_By>;
  min?: InputMaybe<Contracts_Min_Order_By>;
  stddev?: InputMaybe<Contracts_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Contracts_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Contracts_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Contracts_Sum_Order_By>;
  var_pop?: InputMaybe<Contracts_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Contracts_Var_Samp_Order_By>;
  variance?: InputMaybe<Contracts_Variance_Order_By>;
};

/** order by avg() on columns of table "Contracts" */
export type Contracts_Avg_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Contracts". All fields are combined with a logical 'AND'. */
export type Contracts_Bool_Exp = {
  BundleContracts?: InputMaybe<BundleContracts_Bool_Exp>;
  ContractInstances?: InputMaybe<ContractInstances_Bool_Exp>;
  Creator?: InputMaybe<Wallets_Bool_Exp>;
  CreatorId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Contracts_Bool_Exp>>;
  _not?: InputMaybe<Contracts_Bool_Exp>;
  _or?: InputMaybe<Array<Contracts_Bool_Exp>>;
  abi?: InputMaybe<Jsonb_Comparison_Exp>;
  bytecode?: InputMaybe<String_Comparison_Exp>;
  contractType?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  functionSelectors?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  version?: InputMaybe<Int_Comparison_Exp>;
};

/** order by max() on columns of table "Contracts" */
export type Contracts_Max_Order_By = {
  CreatorId?: InputMaybe<Order_By>;
  bytecode?: InputMaybe<Order_By>;
  contractType?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  version?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Contracts" */
export type Contracts_Min_Order_By = {
  CreatorId?: InputMaybe<Order_By>;
  bytecode?: InputMaybe<Order_By>;
  contractType?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  version?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Contracts". */
export type Contracts_Order_By = {
  BundleContracts_aggregate?: InputMaybe<BundleContracts_Aggregate_Order_By>;
  ContractInstances_aggregate?: InputMaybe<ContractInstances_Aggregate_Order_By>;
  Creator?: InputMaybe<Wallets_Order_By>;
  CreatorId?: InputMaybe<Order_By>;
  abi?: InputMaybe<Order_By>;
  bytecode?: InputMaybe<Order_By>;
  contractType?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  functionSelectors?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  version?: InputMaybe<Order_By>;
};

/** select columns of table "Contracts" */
export enum Contracts_Select_Column {
  /** column name */
  CreatorId = 'CreatorId',
  /** column name */
  Abi = 'abi',
  /** column name */
  Bytecode = 'bytecode',
  /** column name */
  ContractType = 'contractType',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Description = 'description',
  /** column name */
  FunctionSelectors = 'functionSelectors',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  Version = 'version'
}

/** order by stddev() on columns of table "Contracts" */
export type Contracts_Stddev_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Contracts" */
export type Contracts_Stddev_Pop_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Contracts" */
export type Contracts_Stddev_Samp_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "Contracts" */
export type Contracts_Sum_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Contracts" */
export type Contracts_Var_Pop_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Contracts" */
export type Contracts_Var_Samp_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Contracts" */
export type Contracts_Variance_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** columns and relationships of "Hashtags" */
export type Hashtags = {
  __typename?: 'Hashtags';
  /** An array relationship */
  TweetHashtags: Array<TweetHashtags>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  tag: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "Hashtags" */
export type HashtagsTweetHashtagsArgs = {
  distinct_on?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TweetHashtags_Order_By>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "Hashtags". All fields are combined with a logical 'AND'. */
export type Hashtags_Bool_Exp = {
  TweetHashtags?: InputMaybe<TweetHashtags_Bool_Exp>;
  _and?: InputMaybe<Array<Hashtags_Bool_Exp>>;
  _not?: InputMaybe<Hashtags_Bool_Exp>;
  _or?: InputMaybe<Array<Hashtags_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  tag?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** Ordering options when selecting data from "Hashtags". */
export type Hashtags_Order_By = {
  TweetHashtags_aggregate?: InputMaybe<TweetHashtags_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tag?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Hashtags" */
export enum Hashtags_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Tag = 'tag',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "IdentityIntegrations" */
export type IdentityIntegrations = {
  __typename?: 'IdentityIntegrations';
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description: Scalars['String'];
  icon: Scalars['String'];
  id: Scalars['uuid'];
  name: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "IdentityIntegrations" */
export type IdentityIntegrations_Aggregate = {
  __typename?: 'IdentityIntegrations_aggregate';
  aggregate?: Maybe<IdentityIntegrations_Aggregate_Fields>;
  nodes: Array<IdentityIntegrations>;
};

/** aggregate fields of "IdentityIntegrations" */
export type IdentityIntegrations_Aggregate_Fields = {
  __typename?: 'IdentityIntegrations_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<IdentityIntegrations_Max_Fields>;
  min?: Maybe<IdentityIntegrations_Min_Fields>;
};


/** aggregate fields of "IdentityIntegrations" */
export type IdentityIntegrations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<IdentityIntegrations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "IdentityIntegrations". All fields are combined with a logical 'AND'. */
export type IdentityIntegrations_Bool_Exp = {
  _and?: InputMaybe<Array<IdentityIntegrations_Bool_Exp>>;
  _not?: InputMaybe<IdentityIntegrations_Bool_Exp>;
  _or?: InputMaybe<Array<IdentityIntegrations_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  icon?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type IdentityIntegrations_Max_Fields = {
  __typename?: 'IdentityIntegrations_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type IdentityIntegrations_Min_Fields = {
  __typename?: 'IdentityIntegrations_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** Ordering options when selecting data from "IdentityIntegrations". */
export type IdentityIntegrations_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  icon?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "IdentityIntegrations" */
export enum IdentityIntegrations_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Description = 'description',
  /** column name */
  Icon = 'icon',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** columns and relationships of "Integrations" */
export type Integrations = {
  __typename?: 'Integrations';
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description: Scalars['String'];
  guideUrl: Scalars['String'];
  icon: Scalars['String'];
  id: Scalars['uuid'];
  name: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};

/** Boolean expression to filter rows from the table "Integrations". All fields are combined with a logical 'AND'. */
export type Integrations_Bool_Exp = {
  _and?: InputMaybe<Array<Integrations_Bool_Exp>>;
  _not?: InputMaybe<Integrations_Bool_Exp>;
  _or?: InputMaybe<Array<Integrations_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  guideUrl?: InputMaybe<String_Comparison_Exp>;
  icon?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** Ordering options when selecting data from "Integrations". */
export type Integrations_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  guideUrl?: InputMaybe<Order_By>;
  icon?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Integrations" */
export enum Integrations_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Description = 'description',
  /** column name */
  GuideUrl = 'guideUrl',
  /** column name */
  Icon = 'icon',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "MeemContractIntegrations" */
export type MeemContractIntegrations = {
  __typename?: 'MeemContractIntegrations';
  /** An object relationship */
  Integration?: Maybe<Integrations>;
  IntegrationId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  MeemContract?: Maybe<MeemContracts>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  isEnabled: Scalars['Boolean'];
  isPublic: Scalars['Boolean'];
  metadata: Scalars['jsonb'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "MeemContractIntegrations" */
export type MeemContractIntegrationsMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** order by aggregate values of table "MeemContractIntegrations" */
export type MeemContractIntegrations_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemContractIntegrations_Max_Order_By>;
  min?: InputMaybe<MeemContractIntegrations_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "MeemContractIntegrations". All fields are combined with a logical 'AND'. */
export type MeemContractIntegrations_Bool_Exp = {
  Integration?: InputMaybe<Integrations_Bool_Exp>;
  IntegrationId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemContract?: InputMaybe<MeemContracts_Bool_Exp>;
  MeemContractId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<MeemContractIntegrations_Bool_Exp>>;
  _not?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
  _or?: InputMaybe<Array<MeemContractIntegrations_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  isPublic?: InputMaybe<Boolean_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** order by max() on columns of table "MeemContractIntegrations" */
export type MeemContractIntegrations_Max_Order_By = {
  IntegrationId?: InputMaybe<Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "MeemContractIntegrations" */
export type MeemContractIntegrations_Min_Order_By = {
  IntegrationId?: InputMaybe<Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "MeemContractIntegrations". */
export type MeemContractIntegrations_Order_By = {
  Integration?: InputMaybe<Integrations_Order_By>;
  IntegrationId?: InputMaybe<Order_By>;
  MeemContract?: InputMaybe<MeemContracts_Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isEnabled?: InputMaybe<Order_By>;
  isPublic?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "MeemContractIntegrations" */
export enum MeemContractIntegrations_Select_Column {
  /** column name */
  IntegrationId = 'IntegrationId',
  /** column name */
  MeemContractId = 'MeemContractId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  IsEnabled = 'isEnabled',
  /** column name */
  IsPublic = 'isPublic',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "MeemContractWallets" */
export type MeemContractWallets = {
  __typename?: 'MeemContractWallets';
  /** An object relationship */
  MeemContract?: Maybe<MeemContracts>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  Wallet?: Maybe<Wallets>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  role: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};

/** order by aggregate values of table "MeemContractWallets" */
export type MeemContractWallets_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemContractWallets_Max_Order_By>;
  min?: InputMaybe<MeemContractWallets_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "MeemContractWallets". All fields are combined with a logical 'AND'. */
export type MeemContractWallets_Bool_Exp = {
  MeemContract?: InputMaybe<MeemContracts_Bool_Exp>;
  MeemContractId?: InputMaybe<Uuid_Comparison_Exp>;
  Wallet?: InputMaybe<Wallets_Bool_Exp>;
  WalletId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<MeemContractWallets_Bool_Exp>>;
  _not?: InputMaybe<MeemContractWallets_Bool_Exp>;
  _or?: InputMaybe<Array<MeemContractWallets_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** order by max() on columns of table "MeemContractWallets" */
export type MeemContractWallets_Max_Order_By = {
  MeemContractId?: InputMaybe<Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "MeemContractWallets" */
export type MeemContractWallets_Min_Order_By = {
  MeemContractId?: InputMaybe<Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "MeemContractWallets". */
export type MeemContractWallets_Order_By = {
  MeemContract?: InputMaybe<MeemContracts_Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  Wallet?: InputMaybe<Wallets_Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "MeemContractWallets" */
export enum MeemContractWallets_Select_Column {
  /** column name */
  MeemContractId = 'MeemContractId',
  /** column name */
  WalletId = 'WalletId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "MeemContracts" */
export type MeemContracts = {
  __typename?: 'MeemContracts';
  /** An array relationship */
  MeemContractIntegrations: Array<MeemContractIntegrations>;
  /** An array relationship */
  MeemContractWallets: Array<MeemContractWallets>;
  /** An array relationship */
  Meems: Array<Meems>;
  /** An aggregate relationship */
  Meems_aggregate: Meems_Aggregate;
  address: Scalars['String'];
  contractURI: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  gnosisSafeAddress?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  isMaxSupplyLocked: Scalars['Boolean'];
  isTransferrable: Scalars['Boolean'];
  maxSupply: Scalars['String'];
  metadata: Scalars['jsonb'];
  mintPermissions: Scalars['jsonb'];
  name: Scalars['String'];
  slug: Scalars['String'];
  splits: Scalars['jsonb'];
  symbol: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMeemContractIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMeemContractWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractWallets_Order_By>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMeemsArgs = {
  distinct_on?: InputMaybe<Array<Meems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Meems_Order_By>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMeems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Meems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Meems_Order_By>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMintPermissionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsSplitsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "MeemContracts" */
export type MeemContracts_Aggregate = {
  __typename?: 'MeemContracts_aggregate';
  aggregate?: Maybe<MeemContracts_Aggregate_Fields>;
  nodes: Array<MeemContracts>;
};

/** aggregate fields of "MeemContracts" */
export type MeemContracts_Aggregate_Fields = {
  __typename?: 'MeemContracts_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<MeemContracts_Max_Fields>;
  min?: Maybe<MeemContracts_Min_Fields>;
};


/** aggregate fields of "MeemContracts" */
export type MeemContracts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemContracts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "MeemContracts". All fields are combined with a logical 'AND'. */
export type MeemContracts_Bool_Exp = {
  MeemContractIntegrations?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
  MeemContractWallets?: InputMaybe<MeemContractWallets_Bool_Exp>;
  Meems?: InputMaybe<Meems_Bool_Exp>;
  _and?: InputMaybe<Array<MeemContracts_Bool_Exp>>;
  _not?: InputMaybe<MeemContracts_Bool_Exp>;
  _or?: InputMaybe<Array<MeemContracts_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  contractURI?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  ens?: InputMaybe<String_Comparison_Exp>;
  ensFetchedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  gnosisSafeAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isMaxSupplyLocked?: InputMaybe<Boolean_Comparison_Exp>;
  isTransferrable?: InputMaybe<Boolean_Comparison_Exp>;
  maxSupply?: InputMaybe<String_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  mintPermissions?: InputMaybe<Jsonb_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  splits?: InputMaybe<Jsonb_Comparison_Exp>;
  symbol?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type MeemContracts_Max_Fields = {
  __typename?: 'MeemContracts_max_fields';
  address?: Maybe<Scalars['String']>;
  contractURI?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  gnosisSafeAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  maxSupply?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type MeemContracts_Min_Fields = {
  __typename?: 'MeemContracts_min_fields';
  address?: Maybe<Scalars['String']>;
  contractURI?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  gnosisSafeAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  maxSupply?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** Ordering options when selecting data from "MeemContracts". */
export type MeemContracts_Order_By = {
  MeemContractIntegrations_aggregate?: InputMaybe<MeemContractIntegrations_Aggregate_Order_By>;
  MeemContractWallets_aggregate?: InputMaybe<MeemContractWallets_Aggregate_Order_By>;
  Meems_aggregate?: InputMaybe<Meems_Aggregate_Order_By>;
  address?: InputMaybe<Order_By>;
  contractURI?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  ens?: InputMaybe<Order_By>;
  ensFetchedAt?: InputMaybe<Order_By>;
  gnosisSafeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isMaxSupplyLocked?: InputMaybe<Order_By>;
  isTransferrable?: InputMaybe<Order_By>;
  maxSupply?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  mintPermissions?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  splits?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "MeemContracts" */
export enum MeemContracts_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  ContractUri = 'contractURI',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Ens = 'ens',
  /** column name */
  EnsFetchedAt = 'ensFetchedAt',
  /** column name */
  GnosisSafeAddress = 'gnosisSafeAddress',
  /** column name */
  Id = 'id',
  /** column name */
  IsMaxSupplyLocked = 'isMaxSupplyLocked',
  /** column name */
  IsTransferrable = 'isTransferrable',
  /** column name */
  MaxSupply = 'maxSupply',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MintPermissions = 'mintPermissions',
  /** column name */
  Name = 'name',
  /** column name */
  Slug = 'slug',
  /** column name */
  Splits = 'splits',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "MeemIdentifications" */
export type MeemIdentifications = {
  __typename?: 'MeemIdentifications';
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  hasOnboarded: Scalars['Boolean'];
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** Boolean expression to filter rows from the table "MeemIdentifications". All fields are combined with a logical 'AND'. */
export type MeemIdentifications_Bool_Exp = {
  _and?: InputMaybe<Array<MeemIdentifications_Bool_Exp>>;
  _not?: InputMaybe<MeemIdentifications_Bool_Exp>;
  _or?: InputMaybe<Array<MeemIdentifications_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  hasOnboarded?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** Ordering options when selecting data from "MeemIdentifications". */
export type MeemIdentifications_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  hasOnboarded?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "MeemIdentifications" */
export enum MeemIdentifications_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  HasOnboarded = 'hasOnboarded',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "MeemIdentities" */
export type MeemIdentities = {
  __typename?: 'MeemIdentities';
  DefaultWalletId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  MeemIdentityIntegrations: Array<MeemIdentityIntegrations>;
  /** An aggregate relationship */
  MeemIdentityIntegrations_aggregate: MeemIdentityIntegrations_Aggregate;
  /** An array relationship */
  MeemIdentityWallets: Array<MeemIdentityWallets>;
  /** An aggregate relationship */
  MeemIdentityWallets_aggregate: MeemIdentityWallets_Aggregate;
  /** An object relationship */
  Wallet?: Maybe<Wallets>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  displayName?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  profilePicUrl?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "MeemIdentities" */
export type MeemIdentitiesMeemIdentityIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityIntegrations_Order_By>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
};


/** columns and relationships of "MeemIdentities" */
export type MeemIdentitiesMeemIdentityIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityIntegrations_Order_By>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
};


/** columns and relationships of "MeemIdentities" */
export type MeemIdentitiesMeemIdentityWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityWallets_Order_By>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
};


/** columns and relationships of "MeemIdentities" */
export type MeemIdentitiesMeemIdentityWallets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityWallets_Order_By>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
};

/** aggregated selection of "MeemIdentities" */
export type MeemIdentities_Aggregate = {
  __typename?: 'MeemIdentities_aggregate';
  aggregate?: Maybe<MeemIdentities_Aggregate_Fields>;
  nodes: Array<MeemIdentities>;
};

/** aggregate fields of "MeemIdentities" */
export type MeemIdentities_Aggregate_Fields = {
  __typename?: 'MeemIdentities_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<MeemIdentities_Max_Fields>;
  min?: Maybe<MeemIdentities_Min_Fields>;
};


/** aggregate fields of "MeemIdentities" */
export type MeemIdentities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemIdentities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemIdentities" */
export type MeemIdentities_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemIdentities_Max_Order_By>;
  min?: InputMaybe<MeemIdentities_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "MeemIdentities". All fields are combined with a logical 'AND'. */
export type MeemIdentities_Bool_Exp = {
  DefaultWalletId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemIdentityIntegrations?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
  MeemIdentityWallets?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
  Wallet?: InputMaybe<Wallets_Bool_Exp>;
  _and?: InputMaybe<Array<MeemIdentities_Bool_Exp>>;
  _not?: InputMaybe<MeemIdentities_Bool_Exp>;
  _or?: InputMaybe<Array<MeemIdentities_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  displayName?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  profilePicUrl?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type MeemIdentities_Max_Fields = {
  __typename?: 'MeemIdentities_max_fields';
  DefaultWalletId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  displayName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  profilePicUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "MeemIdentities" */
export type MeemIdentities_Max_Order_By = {
  DefaultWalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profilePicUrl?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type MeemIdentities_Min_Fields = {
  __typename?: 'MeemIdentities_min_fields';
  DefaultWalletId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  displayName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  profilePicUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "MeemIdentities" */
export type MeemIdentities_Min_Order_By = {
  DefaultWalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profilePicUrl?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "MeemIdentities". */
export type MeemIdentities_Order_By = {
  DefaultWalletId?: InputMaybe<Order_By>;
  MeemIdentityIntegrations_aggregate?: InputMaybe<MeemIdentityIntegrations_Aggregate_Order_By>;
  MeemIdentityWallets_aggregate?: InputMaybe<MeemIdentityWallets_Aggregate_Order_By>;
  Wallet?: InputMaybe<Wallets_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profilePicUrl?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "MeemIdentities" */
export enum MeemIdentities_Select_Column {
  /** column name */
  DefaultWalletId = 'DefaultWalletId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  DisplayName = 'displayName',
  /** column name */
  Id = 'id',
  /** column name */
  ProfilePicUrl = 'profilePicUrl',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations = {
  __typename?: 'MeemIdentityIntegrations';
  IdentityIntegrationId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  MeemIdentity?: Maybe<MeemIdentities>;
  MeemIdentityId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  metadata: Scalars['jsonb'];
  updatedAt: Scalars['timestamptz'];
  visibility: Scalars['String'];
};


/** columns and relationships of "MeemIdentityIntegrations" */
export type MeemIdentityIntegrationsMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Aggregate = {
  __typename?: 'MeemIdentityIntegrations_aggregate';
  aggregate?: Maybe<MeemIdentityIntegrations_Aggregate_Fields>;
  nodes: Array<MeemIdentityIntegrations>;
};

/** aggregate fields of "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Aggregate_Fields = {
  __typename?: 'MeemIdentityIntegrations_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<MeemIdentityIntegrations_Max_Fields>;
  min?: Maybe<MeemIdentityIntegrations_Min_Fields>;
};


/** aggregate fields of "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemIdentityIntegrations_Max_Order_By>;
  min?: InputMaybe<MeemIdentityIntegrations_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "MeemIdentityIntegrations". All fields are combined with a logical 'AND'. */
export type MeemIdentityIntegrations_Bool_Exp = {
  IdentityIntegrationId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemIdentity?: InputMaybe<MeemIdentities_Bool_Exp>;
  MeemIdentityId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<MeemIdentityIntegrations_Bool_Exp>>;
  _not?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
  _or?: InputMaybe<Array<MeemIdentityIntegrations_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  visibility?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type MeemIdentityIntegrations_Max_Fields = {
  __typename?: 'MeemIdentityIntegrations_max_fields';
  IdentityIntegrationId?: Maybe<Scalars['uuid']>;
  MeemIdentityId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  visibility?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Max_Order_By = {
  IdentityIntegrationId?: InputMaybe<Order_By>;
  MeemIdentityId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  visibility?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type MeemIdentityIntegrations_Min_Fields = {
  __typename?: 'MeemIdentityIntegrations_min_fields';
  IdentityIntegrationId?: Maybe<Scalars['uuid']>;
  MeemIdentityId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  visibility?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Min_Order_By = {
  IdentityIntegrationId?: InputMaybe<Order_By>;
  MeemIdentityId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  visibility?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "MeemIdentityIntegrations". */
export type MeemIdentityIntegrations_Order_By = {
  IdentityIntegrationId?: InputMaybe<Order_By>;
  MeemIdentity?: InputMaybe<MeemIdentities_Order_By>;
  MeemIdentityId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  visibility?: InputMaybe<Order_By>;
};

/** select columns of table "MeemIdentityIntegrations" */
export enum MeemIdentityIntegrations_Select_Column {
  /** column name */
  IdentityIntegrationId = 'IdentityIntegrationId',
  /** column name */
  MeemIdentityId = 'MeemIdentityId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  Visibility = 'visibility'
}

/** columns and relationships of "MeemIdentityWallets" */
export type MeemIdentityWallets = {
  __typename?: 'MeemIdentityWallets';
  /** An object relationship */
  MeemIdentity?: Maybe<MeemIdentities>;
  MeemIdentityId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  Wallet?: Maybe<Wallets>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "MeemIdentityWallets" */
export type MeemIdentityWallets_Aggregate = {
  __typename?: 'MeemIdentityWallets_aggregate';
  aggregate?: Maybe<MeemIdentityWallets_Aggregate_Fields>;
  nodes: Array<MeemIdentityWallets>;
};

/** aggregate fields of "MeemIdentityWallets" */
export type MeemIdentityWallets_Aggregate_Fields = {
  __typename?: 'MeemIdentityWallets_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<MeemIdentityWallets_Max_Fields>;
  min?: Maybe<MeemIdentityWallets_Min_Fields>;
};


/** aggregate fields of "MeemIdentityWallets" */
export type MeemIdentityWallets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemIdentityWallets" */
export type MeemIdentityWallets_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemIdentityWallets_Max_Order_By>;
  min?: InputMaybe<MeemIdentityWallets_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "MeemIdentityWallets". All fields are combined with a logical 'AND'. */
export type MeemIdentityWallets_Bool_Exp = {
  MeemIdentity?: InputMaybe<MeemIdentities_Bool_Exp>;
  MeemIdentityId?: InputMaybe<Uuid_Comparison_Exp>;
  Wallet?: InputMaybe<Wallets_Bool_Exp>;
  WalletId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<MeemIdentityWallets_Bool_Exp>>;
  _not?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
  _or?: InputMaybe<Array<MeemIdentityWallets_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type MeemIdentityWallets_Max_Fields = {
  __typename?: 'MeemIdentityWallets_max_fields';
  MeemIdentityId?: Maybe<Scalars['uuid']>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "MeemIdentityWallets" */
export type MeemIdentityWallets_Max_Order_By = {
  MeemIdentityId?: InputMaybe<Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type MeemIdentityWallets_Min_Fields = {
  __typename?: 'MeemIdentityWallets_min_fields';
  MeemIdentityId?: Maybe<Scalars['uuid']>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "MeemIdentityWallets" */
export type MeemIdentityWallets_Min_Order_By = {
  MeemIdentityId?: InputMaybe<Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "MeemIdentityWallets". */
export type MeemIdentityWallets_Order_By = {
  MeemIdentity?: InputMaybe<MeemIdentities_Order_By>;
  MeemIdentityId?: InputMaybe<Order_By>;
  Wallet?: InputMaybe<Wallets_Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "MeemIdentityWallets" */
export enum MeemIdentityWallets_Select_Column {
  /** column name */
  MeemIdentityId = 'MeemIdentityId',
  /** column name */
  WalletId = 'WalletId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "Meems" */
export type Meems = {
  __typename?: 'Meems';
  /** An object relationship */
  MeemContract?: Maybe<MeemContracts>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  Owner?: Maybe<Wallets>;
  OwnerId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** An array relationship */
  Tweets: Array<Tweets>;
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  meemType: Scalars['Int'];
  metadata: Scalars['jsonb'];
  mintedAt: Scalars['timestamptz'];
  mintedBy: Scalars['String'];
  tokenId: Scalars['String'];
  tokenURI: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "Meems" */
export type MeemsTransfersArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transfers_Order_By>>;
  where?: InputMaybe<Transfers_Bool_Exp>;
};


/** columns and relationships of "Meems" */
export type MeemsTweetsArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tweets_Order_By>>;
  where?: InputMaybe<Tweets_Bool_Exp>;
};


/** columns and relationships of "Meems" */
export type MeemsMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "Meems" */
export type Meems_Aggregate = {
  __typename?: 'Meems_aggregate';
  aggregate?: Maybe<Meems_Aggregate_Fields>;
  nodes: Array<Meems>;
};

/** aggregate fields of "Meems" */
export type Meems_Aggregate_Fields = {
  __typename?: 'Meems_aggregate_fields';
  avg?: Maybe<Meems_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Meems_Max_Fields>;
  min?: Maybe<Meems_Min_Fields>;
  stddev?: Maybe<Meems_Stddev_Fields>;
  stddev_pop?: Maybe<Meems_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Meems_Stddev_Samp_Fields>;
  sum?: Maybe<Meems_Sum_Fields>;
  var_pop?: Maybe<Meems_Var_Pop_Fields>;
  var_samp?: Maybe<Meems_Var_Samp_Fields>;
  variance?: Maybe<Meems_Variance_Fields>;
};


/** aggregate fields of "Meems" */
export type Meems_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Meems_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "Meems" */
export type Meems_Aggregate_Order_By = {
  avg?: InputMaybe<Meems_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Meems_Max_Order_By>;
  min?: InputMaybe<Meems_Min_Order_By>;
  stddev?: InputMaybe<Meems_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Meems_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Meems_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Meems_Sum_Order_By>;
  var_pop?: InputMaybe<Meems_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Meems_Var_Samp_Order_By>;
  variance?: InputMaybe<Meems_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Meems_Avg_Fields = {
  __typename?: 'Meems_avg_fields';
  meemType?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "Meems" */
export type Meems_Avg_Order_By = {
  meemType?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Meems". All fields are combined with a logical 'AND'. */
export type Meems_Bool_Exp = {
  MeemContract?: InputMaybe<MeemContracts_Bool_Exp>;
  MeemContractId?: InputMaybe<Uuid_Comparison_Exp>;
  Owner?: InputMaybe<Wallets_Bool_Exp>;
  OwnerId?: InputMaybe<Uuid_Comparison_Exp>;
  Transfers?: InputMaybe<Transfers_Bool_Exp>;
  Tweets?: InputMaybe<Tweets_Bool_Exp>;
  _and?: InputMaybe<Array<Meems_Bool_Exp>>;
  _not?: InputMaybe<Meems_Bool_Exp>;
  _or?: InputMaybe<Array<Meems_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  meemType?: InputMaybe<Int_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  mintedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  mintedBy?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<String_Comparison_Exp>;
  tokenURI?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type Meems_Max_Fields = {
  __typename?: 'Meems_max_fields';
  MeemContractId?: Maybe<Scalars['uuid']>;
  OwnerId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  meemType?: Maybe<Scalars['Int']>;
  mintedAt?: Maybe<Scalars['timestamptz']>;
  mintedBy?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  tokenURI?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "Meems" */
export type Meems_Max_Order_By = {
  MeemContractId?: InputMaybe<Order_By>;
  OwnerId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  meemType?: InputMaybe<Order_By>;
  mintedAt?: InputMaybe<Order_By>;
  mintedBy?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  tokenURI?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Meems_Min_Fields = {
  __typename?: 'Meems_min_fields';
  MeemContractId?: Maybe<Scalars['uuid']>;
  OwnerId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  meemType?: Maybe<Scalars['Int']>;
  mintedAt?: Maybe<Scalars['timestamptz']>;
  mintedBy?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  tokenURI?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "Meems" */
export type Meems_Min_Order_By = {
  MeemContractId?: InputMaybe<Order_By>;
  OwnerId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  meemType?: InputMaybe<Order_By>;
  mintedAt?: InputMaybe<Order_By>;
  mintedBy?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  tokenURI?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Meems". */
export type Meems_Order_By = {
  MeemContract?: InputMaybe<MeemContracts_Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  Owner?: InputMaybe<Wallets_Order_By>;
  OwnerId?: InputMaybe<Order_By>;
  Transfers_aggregate?: InputMaybe<Transfers_Aggregate_Order_By>;
  Tweets_aggregate?: InputMaybe<Tweets_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  meemType?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  mintedAt?: InputMaybe<Order_By>;
  mintedBy?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  tokenURI?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Meems" */
export enum Meems_Select_Column {
  /** column name */
  MeemContractId = 'MeemContractId',
  /** column name */
  OwnerId = 'OwnerId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  MeemType = 'meemType',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MintedAt = 'mintedAt',
  /** column name */
  MintedBy = 'mintedBy',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TokenUri = 'tokenURI',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate stddev on columns */
export type Meems_Stddev_Fields = {
  __typename?: 'Meems_stddev_fields';
  meemType?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "Meems" */
export type Meems_Stddev_Order_By = {
  meemType?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Meems_Stddev_Pop_Fields = {
  __typename?: 'Meems_stddev_pop_fields';
  meemType?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "Meems" */
export type Meems_Stddev_Pop_Order_By = {
  meemType?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Meems_Stddev_Samp_Fields = {
  __typename?: 'Meems_stddev_samp_fields';
  meemType?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "Meems" */
export type Meems_Stddev_Samp_Order_By = {
  meemType?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Meems_Sum_Fields = {
  __typename?: 'Meems_sum_fields';
  meemType?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "Meems" */
export type Meems_Sum_Order_By = {
  meemType?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Meems_Var_Pop_Fields = {
  __typename?: 'Meems_var_pop_fields';
  meemType?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "Meems" */
export type Meems_Var_Pop_Order_By = {
  meemType?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Meems_Var_Samp_Fields = {
  __typename?: 'Meems_var_samp_fields';
  meemType?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "Meems" */
export type Meems_Var_Samp_Order_By = {
  meemType?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Meems_Variance_Fields = {
  __typename?: 'Meems_variance_fields';
  meemType?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "Meems" */
export type Meems_Variance_Order_By = {
  meemType?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "Transfers" */
export type Transfers = {
  __typename?: 'Transfers';
  /** An object relationship */
  Meem?: Maybe<Meems>;
  MeemId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  from: Scalars['String'];
  id: Scalars['uuid'];
  to: Scalars['String'];
  transactionHash: Scalars['String'];
  transferredAt: Scalars['timestamptz'];
  updatedAt: Scalars['timestamptz'];
};

/** order by aggregate values of table "Transfers" */
export type Transfers_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transfers_Max_Order_By>;
  min?: InputMaybe<Transfers_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Transfers". All fields are combined with a logical 'AND'. */
export type Transfers_Bool_Exp = {
  Meem?: InputMaybe<Meems_Bool_Exp>;
  MeemId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Transfers_Bool_Exp>>;
  _not?: InputMaybe<Transfers_Bool_Exp>;
  _or?: InputMaybe<Array<Transfers_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  from?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  to?: InputMaybe<String_Comparison_Exp>;
  transactionHash?: InputMaybe<String_Comparison_Exp>;
  transferredAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** order by max() on columns of table "Transfers" */
export type Transfers_Max_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  from?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  to?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
  transferredAt?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Transfers" */
export type Transfers_Min_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  from?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  to?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
  transferredAt?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Transfers". */
export type Transfers_Order_By = {
  Meem?: InputMaybe<Meems_Order_By>;
  MeemId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  from?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  to?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
  transferredAt?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Transfers" */
export enum Transfers_Select_Column {
  /** column name */
  MeemId = 'MeemId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  From = 'from',
  /** column name */
  Id = 'id',
  /** column name */
  To = 'to',
  /** column name */
  TransactionHash = 'transactionHash',
  /** column name */
  TransferredAt = 'transferredAt',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "TweetHashtags" */
export type TweetHashtags = {
  __typename?: 'TweetHashtags';
  /** An object relationship */
  Hashtag?: Maybe<Hashtags>;
  HashtagId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  Tweet?: Maybe<Tweets>;
  TweetId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** order by aggregate values of table "TweetHashtags" */
export type TweetHashtags_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TweetHashtags_Max_Order_By>;
  min?: InputMaybe<TweetHashtags_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "TweetHashtags". All fields are combined with a logical 'AND'. */
export type TweetHashtags_Bool_Exp = {
  Hashtag?: InputMaybe<Hashtags_Bool_Exp>;
  HashtagId?: InputMaybe<Uuid_Comparison_Exp>;
  Tweet?: InputMaybe<Tweets_Bool_Exp>;
  TweetId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<TweetHashtags_Bool_Exp>>;
  _not?: InputMaybe<TweetHashtags_Bool_Exp>;
  _or?: InputMaybe<Array<TweetHashtags_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** order by max() on columns of table "TweetHashtags" */
export type TweetHashtags_Max_Order_By = {
  HashtagId?: InputMaybe<Order_By>;
  TweetId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "TweetHashtags" */
export type TweetHashtags_Min_Order_By = {
  HashtagId?: InputMaybe<Order_By>;
  TweetId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "TweetHashtags". */
export type TweetHashtags_Order_By = {
  Hashtag?: InputMaybe<Hashtags_Order_By>;
  HashtagId?: InputMaybe<Order_By>;
  Tweet?: InputMaybe<Tweets_Order_By>;
  TweetId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "TweetHashtags" */
export enum TweetHashtags_Select_Column {
  /** column name */
  HashtagId = 'HashtagId',
  /** column name */
  TweetId = 'TweetId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "Tweets" */
export type Tweets = {
  __typename?: 'Tweets';
  /** An object relationship */
  Meem?: Maybe<Meems>;
  MeemId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  TweetHashtags: Array<TweetHashtags>;
  conversationId: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  text: Scalars['String'];
  tweetId: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
  userId: Scalars['String'];
  userProfileImageUrl: Scalars['String'];
  username: Scalars['String'];
};


/** columns and relationships of "Tweets" */
export type TweetsTweetHashtagsArgs = {
  distinct_on?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TweetHashtags_Order_By>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};

/** order by aggregate values of table "Tweets" */
export type Tweets_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Tweets_Max_Order_By>;
  min?: InputMaybe<Tweets_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Tweets". All fields are combined with a logical 'AND'. */
export type Tweets_Bool_Exp = {
  Meem?: InputMaybe<Meems_Bool_Exp>;
  MeemId?: InputMaybe<Uuid_Comparison_Exp>;
  TweetHashtags?: InputMaybe<TweetHashtags_Bool_Exp>;
  _and?: InputMaybe<Array<Tweets_Bool_Exp>>;
  _not?: InputMaybe<Tweets_Bool_Exp>;
  _or?: InputMaybe<Array<Tweets_Bool_Exp>>;
  conversationId?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  text?: InputMaybe<String_Comparison_Exp>;
  tweetId?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  userId?: InputMaybe<String_Comparison_Exp>;
  userProfileImageUrl?: InputMaybe<String_Comparison_Exp>;
  username?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "Tweets" */
export type Tweets_Max_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  conversationId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  tweetId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
  userProfileImageUrl?: InputMaybe<Order_By>;
  username?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Tweets" */
export type Tweets_Min_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  conversationId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  tweetId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
  userProfileImageUrl?: InputMaybe<Order_By>;
  username?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Tweets". */
export type Tweets_Order_By = {
  Meem?: InputMaybe<Meems_Order_By>;
  MeemId?: InputMaybe<Order_By>;
  TweetHashtags_aggregate?: InputMaybe<TweetHashtags_Aggregate_Order_By>;
  conversationId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  tweetId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
  userProfileImageUrl?: InputMaybe<Order_By>;
  username?: InputMaybe<Order_By>;
};

/** select columns of table "Tweets" */
export enum Tweets_Select_Column {
  /** column name */
  MeemId = 'MeemId',
  /** column name */
  ConversationId = 'conversationId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Text = 'text',
  /** column name */
  TweetId = 'tweetId',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId',
  /** column name */
  UserProfileImageUrl = 'userProfileImageUrl',
  /** column name */
  Username = 'username'
}

/** columns and relationships of "WalletContractInstances" */
export type WalletContractInstances = {
  __typename?: 'WalletContractInstances';
  /** An object relationship */
  ContractInstance?: Maybe<ContractInstances>;
  ContractInstanceId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  Wallet?: Maybe<Wallets>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  name?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "WalletContractInstances" */
export type WalletContractInstances_Aggregate = {
  __typename?: 'WalletContractInstances_aggregate';
  aggregate?: Maybe<WalletContractInstances_Aggregate_Fields>;
  nodes: Array<WalletContractInstances>;
};

/** aggregate fields of "WalletContractInstances" */
export type WalletContractInstances_Aggregate_Fields = {
  __typename?: 'WalletContractInstances_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<WalletContractInstances_Max_Fields>;
  min?: Maybe<WalletContractInstances_Min_Fields>;
};


/** aggregate fields of "WalletContractInstances" */
export type WalletContractInstances_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "WalletContractInstances" */
export type WalletContractInstances_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<WalletContractInstances_Max_Order_By>;
  min?: InputMaybe<WalletContractInstances_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "WalletContractInstances". All fields are combined with a logical 'AND'. */
export type WalletContractInstances_Bool_Exp = {
  ContractInstance?: InputMaybe<ContractInstances_Bool_Exp>;
  ContractInstanceId?: InputMaybe<Uuid_Comparison_Exp>;
  Wallet?: InputMaybe<Wallets_Bool_Exp>;
  WalletId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<WalletContractInstances_Bool_Exp>>;
  _not?: InputMaybe<WalletContractInstances_Bool_Exp>;
  _or?: InputMaybe<Array<WalletContractInstances_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  note?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type WalletContractInstances_Max_Fields = {
  __typename?: 'WalletContractInstances_max_fields';
  ContractInstanceId?: Maybe<Scalars['uuid']>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "WalletContractInstances" */
export type WalletContractInstances_Max_Order_By = {
  ContractInstanceId?: InputMaybe<Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type WalletContractInstances_Min_Fields = {
  __typename?: 'WalletContractInstances_min_fields';
  ContractInstanceId?: Maybe<Scalars['uuid']>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "WalletContractInstances" */
export type WalletContractInstances_Min_Order_By = {
  ContractInstanceId?: InputMaybe<Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "WalletContractInstances". */
export type WalletContractInstances_Order_By = {
  ContractInstance?: InputMaybe<ContractInstances_Order_By>;
  ContractInstanceId?: InputMaybe<Order_By>;
  Wallet?: InputMaybe<Wallets_Order_By>;
  WalletId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "WalletContractInstances" */
export enum WalletContractInstances_Select_Column {
  /** column name */
  ContractInstanceId = 'ContractInstanceId',
  /** column name */
  WalletId = 'WalletId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Note = 'note',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "Wallets" */
export type Wallets = {
  __typename?: 'Wallets';
  /** An array relationship */
  Bundles: Array<Bundles>;
  /** An aggregate relationship */
  Bundles_aggregate: Bundles_Aggregate;
  /** An array relationship */
  Contracts: Array<Contracts>;
  /** An array relationship */
  MeemContractWallets: Array<MeemContractWallets>;
  /** An array relationship */
  MeemIdentities: Array<MeemIdentities>;
  /** An aggregate relationship */
  MeemIdentities_aggregate: MeemIdentities_Aggregate;
  /** An array relationship */
  MeemIdentityWallets: Array<MeemIdentityWallets>;
  /** An aggregate relationship */
  MeemIdentityWallets_aggregate: MeemIdentityWallets_Aggregate;
  /** An array relationship */
  Meems: Array<Meems>;
  /** An aggregate relationship */
  Meems_aggregate: Meems_Aggregate;
  /** An array relationship */
  WalletContractInstances: Array<WalletContractInstances>;
  /** An aggregate relationship */
  WalletContractInstances_aggregate: WalletContractInstances_Aggregate;
  address: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "Wallets" */
export type WalletsBundlesArgs = {
  distinct_on?: InputMaybe<Array<Bundles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bundles_Order_By>>;
  where?: InputMaybe<Bundles_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsBundles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bundles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bundles_Order_By>>;
  where?: InputMaybe<Bundles_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeemContractWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractWallets_Order_By>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeemIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentities_Order_By>>;
  where?: InputMaybe<MeemIdentities_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeemIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentities_Order_By>>;
  where?: InputMaybe<MeemIdentities_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeemIdentityWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityWallets_Order_By>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeemIdentityWallets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityWallets_Order_By>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeemsArgs = {
  distinct_on?: InputMaybe<Array<Meems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Meems_Order_By>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Meems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Meems_Order_By>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsWalletContractInstancesArgs = {
  distinct_on?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<WalletContractInstances_Order_By>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsWalletContractInstances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<WalletContractInstances_Order_By>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
};

/** aggregated selection of "Wallets" */
export type Wallets_Aggregate = {
  __typename?: 'Wallets_aggregate';
  aggregate?: Maybe<Wallets_Aggregate_Fields>;
  nodes: Array<Wallets>;
};

/** aggregate fields of "Wallets" */
export type Wallets_Aggregate_Fields = {
  __typename?: 'Wallets_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Wallets_Max_Fields>;
  min?: Maybe<Wallets_Min_Fields>;
};


/** aggregate fields of "Wallets" */
export type Wallets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Wallets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "Wallets". All fields are combined with a logical 'AND'. */
export type Wallets_Bool_Exp = {
  Bundles?: InputMaybe<Bundles_Bool_Exp>;
  Contracts?: InputMaybe<Contracts_Bool_Exp>;
  MeemContractWallets?: InputMaybe<MeemContractWallets_Bool_Exp>;
  MeemIdentities?: InputMaybe<MeemIdentities_Bool_Exp>;
  MeemIdentityWallets?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
  Meems?: InputMaybe<Meems_Bool_Exp>;
  WalletContractInstances?: InputMaybe<WalletContractInstances_Bool_Exp>;
  _and?: InputMaybe<Array<Wallets_Bool_Exp>>;
  _not?: InputMaybe<Wallets_Bool_Exp>;
  _or?: InputMaybe<Array<Wallets_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  ens?: InputMaybe<String_Comparison_Exp>;
  ensFetchedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** aggregate max on columns */
export type Wallets_Max_Fields = {
  __typename?: 'Wallets_max_fields';
  address?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Wallets_Min_Fields = {
  __typename?: 'Wallets_min_fields';
  address?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** Ordering options when selecting data from "Wallets". */
export type Wallets_Order_By = {
  Bundles_aggregate?: InputMaybe<Bundles_Aggregate_Order_By>;
  Contracts_aggregate?: InputMaybe<Contracts_Aggregate_Order_By>;
  MeemContractWallets_aggregate?: InputMaybe<MeemContractWallets_Aggregate_Order_By>;
  MeemIdentities_aggregate?: InputMaybe<MeemIdentities_Aggregate_Order_By>;
  MeemIdentityWallets_aggregate?: InputMaybe<MeemIdentityWallets_Aggregate_Order_By>;
  Meems_aggregate?: InputMaybe<Meems_Aggregate_Order_By>;
  WalletContractInstances_aggregate?: InputMaybe<WalletContractInstances_Aggregate_Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  ens?: InputMaybe<Order_By>;
  ensFetchedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Wallets" */
export enum Wallets_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Ens = 'ens',
  /** column name */
  EnsFetchedAt = 'ensFetchedAt',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** An array relationship */
  BundleContracts: Array<BundleContracts>;
  /** An aggregate relationship */
  BundleContracts_aggregate: BundleContracts_Aggregate;
  /** fetch data from the table: "BundleContracts" using primary key columns */
  BundleContracts_by_pk?: Maybe<BundleContracts>;
  /** An array relationship */
  Bundles: Array<Bundles>;
  /** An aggregate relationship */
  Bundles_aggregate: Bundles_Aggregate;
  /** fetch data from the table: "Bundles" using primary key columns */
  Bundles_by_pk?: Maybe<Bundles>;
  /** An array relationship */
  ContractInstances: Array<ContractInstances>;
  /** An aggregate relationship */
  ContractInstances_aggregate: ContractInstances_Aggregate;
  /** fetch data from the table: "ContractInstances" using primary key columns */
  ContractInstances_by_pk?: Maybe<ContractInstances>;
  /** An array relationship */
  Contracts: Array<Contracts>;
  /** fetch data from the table: "Contracts" using primary key columns */
  Contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table: "Hashtags" */
  Hashtags: Array<Hashtags>;
  /** fetch data from the table: "Hashtags" using primary key columns */
  Hashtags_by_pk?: Maybe<Hashtags>;
  /** fetch data from the table: "IdentityIntegrations" */
  IdentityIntegrations: Array<IdentityIntegrations>;
  /** fetch aggregated fields from the table: "IdentityIntegrations" */
  IdentityIntegrations_aggregate: IdentityIntegrations_Aggregate;
  /** fetch data from the table: "IdentityIntegrations" using primary key columns */
  IdentityIntegrations_by_pk?: Maybe<IdentityIntegrations>;
  /** fetch data from the table: "Integrations" */
  Integrations: Array<Integrations>;
  /** fetch data from the table: "Integrations" using primary key columns */
  Integrations_by_pk?: Maybe<Integrations>;
  /** An array relationship */
  MeemContractIntegrations: Array<MeemContractIntegrations>;
  /** fetch data from the table: "MeemContractIntegrations" using primary key columns */
  MeemContractIntegrations_by_pk?: Maybe<MeemContractIntegrations>;
  /** An array relationship */
  MeemContractWallets: Array<MeemContractWallets>;
  /** fetch data from the table: "MeemContractWallets" using primary key columns */
  MeemContractWallets_by_pk?: Maybe<MeemContractWallets>;
  /** fetch data from the table: "MeemContracts" */
  MeemContracts: Array<MeemContracts>;
  /** fetch aggregated fields from the table: "MeemContracts" */
  MeemContracts_aggregate: MeemContracts_Aggregate;
  /** fetch data from the table: "MeemContracts" using primary key columns */
  MeemContracts_by_pk?: Maybe<MeemContracts>;
  /** fetch data from the table: "MeemIdentifications" */
  MeemIdentifications: Array<MeemIdentifications>;
  /** fetch data from the table: "MeemIdentifications" using primary key columns */
  MeemIdentifications_by_pk?: Maybe<MeemIdentifications>;
  /** An array relationship */
  MeemIdentities: Array<MeemIdentities>;
  /** An aggregate relationship */
  MeemIdentities_aggregate: MeemIdentities_Aggregate;
  /** fetch data from the table: "MeemIdentities" using primary key columns */
  MeemIdentities_by_pk?: Maybe<MeemIdentities>;
  /** An array relationship */
  MeemIdentityIntegrations: Array<MeemIdentityIntegrations>;
  /** An aggregate relationship */
  MeemIdentityIntegrations_aggregate: MeemIdentityIntegrations_Aggregate;
  /** fetch data from the table: "MeemIdentityIntegrations" using primary key columns */
  MeemIdentityIntegrations_by_pk?: Maybe<MeemIdentityIntegrations>;
  /** An array relationship */
  MeemIdentityWallets: Array<MeemIdentityWallets>;
  /** An aggregate relationship */
  MeemIdentityWallets_aggregate: MeemIdentityWallets_Aggregate;
  /** fetch data from the table: "MeemIdentityWallets" using primary key columns */
  MeemIdentityWallets_by_pk?: Maybe<MeemIdentityWallets>;
  /** An array relationship */
  Meems: Array<Meems>;
  /** An aggregate relationship */
  Meems_aggregate: Meems_Aggregate;
  /** fetch data from the table: "Meems" using primary key columns */
  Meems_by_pk?: Maybe<Meems>;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** fetch data from the table: "Transfers" using primary key columns */
  Transfers_by_pk?: Maybe<Transfers>;
  /** An array relationship */
  TweetHashtags: Array<TweetHashtags>;
  /** fetch data from the table: "TweetHashtags" using primary key columns */
  TweetHashtags_by_pk?: Maybe<TweetHashtags>;
  /** An array relationship */
  Tweets: Array<Tweets>;
  /** fetch data from the table: "Tweets" using primary key columns */
  Tweets_by_pk?: Maybe<Tweets>;
  /** An array relationship */
  WalletContractInstances: Array<WalletContractInstances>;
  /** An aggregate relationship */
  WalletContractInstances_aggregate: WalletContractInstances_Aggregate;
  /** fetch data from the table: "WalletContractInstances" using primary key columns */
  WalletContractInstances_by_pk?: Maybe<WalletContractInstances>;
  /** fetch data from the table: "Wallets" */
  Wallets: Array<Wallets>;
  /** fetch aggregated fields from the table: "Wallets" */
  Wallets_aggregate: Wallets_Aggregate;
  /** fetch data from the table: "Wallets" using primary key columns */
  Wallets_by_pk?: Maybe<Wallets>;
};


export type Query_RootBundleContractsArgs = {
  distinct_on?: InputMaybe<Array<BundleContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BundleContracts_Order_By>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
};


export type Query_RootBundleContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<BundleContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BundleContracts_Order_By>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
};


export type Query_RootBundleContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootBundlesArgs = {
  distinct_on?: InputMaybe<Array<Bundles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bundles_Order_By>>;
  where?: InputMaybe<Bundles_Bool_Exp>;
};


export type Query_RootBundles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bundles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bundles_Order_By>>;
  where?: InputMaybe<Bundles_Bool_Exp>;
};


export type Query_RootBundles_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootContractInstancesArgs = {
  distinct_on?: InputMaybe<Array<ContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ContractInstances_Order_By>>;
  where?: InputMaybe<ContractInstances_Bool_Exp>;
};


export type Query_RootContractInstances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<ContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ContractInstances_Order_By>>;
  where?: InputMaybe<ContractInstances_Bool_Exp>;
};


export type Query_RootContractInstances_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Query_RootContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootHashtagsArgs = {
  distinct_on?: InputMaybe<Array<Hashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Hashtags_Order_By>>;
  where?: InputMaybe<Hashtags_Bool_Exp>;
};


export type Query_RootHashtags_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootIdentityIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<IdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<IdentityIntegrations_Order_By>>;
  where?: InputMaybe<IdentityIntegrations_Bool_Exp>;
};


export type Query_RootIdentityIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<IdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<IdentityIntegrations_Order_By>>;
  where?: InputMaybe<IdentityIntegrations_Bool_Exp>;
};


export type Query_RootIdentityIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Query_RootIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemContractIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


export type Query_RootMeemContractIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemContractWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractWallets_Order_By>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
};


export type Query_RootMeemContractWallets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemContractsArgs = {
  distinct_on?: InputMaybe<Array<MeemContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContracts_Order_By>>;
  where?: InputMaybe<MeemContracts_Bool_Exp>;
};


export type Query_RootMeemContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContracts_Order_By>>;
  where?: InputMaybe<MeemContracts_Bool_Exp>;
};


export type Query_RootMeemContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemIdentificationsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentifications_Order_By>>;
  where?: InputMaybe<MeemIdentifications_Bool_Exp>;
};


export type Query_RootMeemIdentifications_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentities_Order_By>>;
  where?: InputMaybe<MeemIdentities_Bool_Exp>;
};


export type Query_RootMeemIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentities_Order_By>>;
  where?: InputMaybe<MeemIdentities_Bool_Exp>;
};


export type Query_RootMeemIdentities_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemIdentityIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityIntegrations_Order_By>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
};


export type Query_RootMeemIdentityIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityIntegrations_Order_By>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
};


export type Query_RootMeemIdentityIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemIdentityWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityWallets_Order_By>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
};


export type Query_RootMeemIdentityWallets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityWallets_Order_By>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
};


export type Query_RootMeemIdentityWallets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemsArgs = {
  distinct_on?: InputMaybe<Array<Meems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Meems_Order_By>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


export type Query_RootMeems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Meems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Meems_Order_By>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


export type Query_RootMeems_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootTransfersArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transfers_Order_By>>;
  where?: InputMaybe<Transfers_Bool_Exp>;
};


export type Query_RootTransfers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootTweetHashtagsArgs = {
  distinct_on?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TweetHashtags_Order_By>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};


export type Query_RootTweetHashtags_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootTweetsArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tweets_Order_By>>;
  where?: InputMaybe<Tweets_Bool_Exp>;
};


export type Query_RootTweets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootWalletContractInstancesArgs = {
  distinct_on?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<WalletContractInstances_Order_By>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
};


export type Query_RootWalletContractInstances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<WalletContractInstances_Order_By>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
};


export type Query_RootWalletContractInstances_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootWalletsArgs = {
  distinct_on?: InputMaybe<Array<Wallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Wallets_Order_By>>;
  where?: InputMaybe<Wallets_Bool_Exp>;
};


export type Query_RootWallets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Wallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Wallets_Order_By>>;
  where?: InputMaybe<Wallets_Bool_Exp>;
};


export type Query_RootWallets_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  BundleContracts: Array<BundleContracts>;
  /** An aggregate relationship */
  BundleContracts_aggregate: BundleContracts_Aggregate;
  /** fetch data from the table: "BundleContracts" using primary key columns */
  BundleContracts_by_pk?: Maybe<BundleContracts>;
  /** An array relationship */
  Bundles: Array<Bundles>;
  /** An aggregate relationship */
  Bundles_aggregate: Bundles_Aggregate;
  /** fetch data from the table: "Bundles" using primary key columns */
  Bundles_by_pk?: Maybe<Bundles>;
  /** An array relationship */
  ContractInstances: Array<ContractInstances>;
  /** An aggregate relationship */
  ContractInstances_aggregate: ContractInstances_Aggregate;
  /** fetch data from the table: "ContractInstances" using primary key columns */
  ContractInstances_by_pk?: Maybe<ContractInstances>;
  /** An array relationship */
  Contracts: Array<Contracts>;
  /** fetch data from the table: "Contracts" using primary key columns */
  Contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table: "Hashtags" */
  Hashtags: Array<Hashtags>;
  /** fetch data from the table: "Hashtags" using primary key columns */
  Hashtags_by_pk?: Maybe<Hashtags>;
  /** fetch data from the table: "IdentityIntegrations" */
  IdentityIntegrations: Array<IdentityIntegrations>;
  /** fetch aggregated fields from the table: "IdentityIntegrations" */
  IdentityIntegrations_aggregate: IdentityIntegrations_Aggregate;
  /** fetch data from the table: "IdentityIntegrations" using primary key columns */
  IdentityIntegrations_by_pk?: Maybe<IdentityIntegrations>;
  /** fetch data from the table: "Integrations" */
  Integrations: Array<Integrations>;
  /** fetch data from the table: "Integrations" using primary key columns */
  Integrations_by_pk?: Maybe<Integrations>;
  /** An array relationship */
  MeemContractIntegrations: Array<MeemContractIntegrations>;
  /** fetch data from the table: "MeemContractIntegrations" using primary key columns */
  MeemContractIntegrations_by_pk?: Maybe<MeemContractIntegrations>;
  /** An array relationship */
  MeemContractWallets: Array<MeemContractWallets>;
  /** fetch data from the table: "MeemContractWallets" using primary key columns */
  MeemContractWallets_by_pk?: Maybe<MeemContractWallets>;
  /** fetch data from the table: "MeemContracts" */
  MeemContracts: Array<MeemContracts>;
  /** fetch aggregated fields from the table: "MeemContracts" */
  MeemContracts_aggregate: MeemContracts_Aggregate;
  /** fetch data from the table: "MeemContracts" using primary key columns */
  MeemContracts_by_pk?: Maybe<MeemContracts>;
  /** fetch data from the table: "MeemIdentifications" */
  MeemIdentifications: Array<MeemIdentifications>;
  /** fetch data from the table: "MeemIdentifications" using primary key columns */
  MeemIdentifications_by_pk?: Maybe<MeemIdentifications>;
  /** An array relationship */
  MeemIdentities: Array<MeemIdentities>;
  /** An aggregate relationship */
  MeemIdentities_aggregate: MeemIdentities_Aggregate;
  /** fetch data from the table: "MeemIdentities" using primary key columns */
  MeemIdentities_by_pk?: Maybe<MeemIdentities>;
  /** An array relationship */
  MeemIdentityIntegrations: Array<MeemIdentityIntegrations>;
  /** An aggregate relationship */
  MeemIdentityIntegrations_aggregate: MeemIdentityIntegrations_Aggregate;
  /** fetch data from the table: "MeemIdentityIntegrations" using primary key columns */
  MeemIdentityIntegrations_by_pk?: Maybe<MeemIdentityIntegrations>;
  /** An array relationship */
  MeemIdentityWallets: Array<MeemIdentityWallets>;
  /** An aggregate relationship */
  MeemIdentityWallets_aggregate: MeemIdentityWallets_Aggregate;
  /** fetch data from the table: "MeemIdentityWallets" using primary key columns */
  MeemIdentityWallets_by_pk?: Maybe<MeemIdentityWallets>;
  /** An array relationship */
  Meems: Array<Meems>;
  /** An aggregate relationship */
  Meems_aggregate: Meems_Aggregate;
  /** fetch data from the table: "Meems" using primary key columns */
  Meems_by_pk?: Maybe<Meems>;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** fetch data from the table: "Transfers" using primary key columns */
  Transfers_by_pk?: Maybe<Transfers>;
  /** An array relationship */
  TweetHashtags: Array<TweetHashtags>;
  /** fetch data from the table: "TweetHashtags" using primary key columns */
  TweetHashtags_by_pk?: Maybe<TweetHashtags>;
  /** An array relationship */
  Tweets: Array<Tweets>;
  /** fetch data from the table: "Tweets" using primary key columns */
  Tweets_by_pk?: Maybe<Tweets>;
  /** An array relationship */
  WalletContractInstances: Array<WalletContractInstances>;
  /** An aggregate relationship */
  WalletContractInstances_aggregate: WalletContractInstances_Aggregate;
  /** fetch data from the table: "WalletContractInstances" using primary key columns */
  WalletContractInstances_by_pk?: Maybe<WalletContractInstances>;
  /** fetch data from the table: "Wallets" */
  Wallets: Array<Wallets>;
  /** fetch aggregated fields from the table: "Wallets" */
  Wallets_aggregate: Wallets_Aggregate;
  /** fetch data from the table: "Wallets" using primary key columns */
  Wallets_by_pk?: Maybe<Wallets>;
};


export type Subscription_RootBundleContractsArgs = {
  distinct_on?: InputMaybe<Array<BundleContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BundleContracts_Order_By>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
};


export type Subscription_RootBundleContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<BundleContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BundleContracts_Order_By>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
};


export type Subscription_RootBundleContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootBundlesArgs = {
  distinct_on?: InputMaybe<Array<Bundles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bundles_Order_By>>;
  where?: InputMaybe<Bundles_Bool_Exp>;
};


export type Subscription_RootBundles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bundles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bundles_Order_By>>;
  where?: InputMaybe<Bundles_Bool_Exp>;
};


export type Subscription_RootBundles_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootContractInstancesArgs = {
  distinct_on?: InputMaybe<Array<ContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ContractInstances_Order_By>>;
  where?: InputMaybe<ContractInstances_Bool_Exp>;
};


export type Subscription_RootContractInstances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<ContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ContractInstances_Order_By>>;
  where?: InputMaybe<ContractInstances_Bool_Exp>;
};


export type Subscription_RootContractInstances_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Subscription_RootContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootHashtagsArgs = {
  distinct_on?: InputMaybe<Array<Hashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Hashtags_Order_By>>;
  where?: InputMaybe<Hashtags_Bool_Exp>;
};


export type Subscription_RootHashtags_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootIdentityIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<IdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<IdentityIntegrations_Order_By>>;
  where?: InputMaybe<IdentityIntegrations_Bool_Exp>;
};


export type Subscription_RootIdentityIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<IdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<IdentityIntegrations_Order_By>>;
  where?: InputMaybe<IdentityIntegrations_Bool_Exp>;
};


export type Subscription_RootIdentityIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Subscription_RootIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemContractIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


export type Subscription_RootMeemContractIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemContractWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractWallets_Order_By>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
};


export type Subscription_RootMeemContractWallets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemContractsArgs = {
  distinct_on?: InputMaybe<Array<MeemContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContracts_Order_By>>;
  where?: InputMaybe<MeemContracts_Bool_Exp>;
};


export type Subscription_RootMeemContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContracts_Order_By>>;
  where?: InputMaybe<MeemContracts_Bool_Exp>;
};


export type Subscription_RootMeemContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemIdentificationsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentifications_Order_By>>;
  where?: InputMaybe<MeemIdentifications_Bool_Exp>;
};


export type Subscription_RootMeemIdentifications_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentities_Order_By>>;
  where?: InputMaybe<MeemIdentities_Bool_Exp>;
};


export type Subscription_RootMeemIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentities_Order_By>>;
  where?: InputMaybe<MeemIdentities_Bool_Exp>;
};


export type Subscription_RootMeemIdentities_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemIdentityIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityIntegrations_Order_By>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
};


export type Subscription_RootMeemIdentityIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityIntegrations_Order_By>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
};


export type Subscription_RootMeemIdentityIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemIdentityWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityWallets_Order_By>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
};


export type Subscription_RootMeemIdentityWallets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityWallets_Order_By>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
};


export type Subscription_RootMeemIdentityWallets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemsArgs = {
  distinct_on?: InputMaybe<Array<Meems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Meems_Order_By>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


export type Subscription_RootMeems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Meems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Meems_Order_By>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


export type Subscription_RootMeems_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTransfersArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transfers_Order_By>>;
  where?: InputMaybe<Transfers_Bool_Exp>;
};


export type Subscription_RootTransfers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTweetHashtagsArgs = {
  distinct_on?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TweetHashtags_Order_By>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};


export type Subscription_RootTweetHashtags_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTweetsArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tweets_Order_By>>;
  where?: InputMaybe<Tweets_Bool_Exp>;
};


export type Subscription_RootTweets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootWalletContractInstancesArgs = {
  distinct_on?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<WalletContractInstances_Order_By>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
};


export type Subscription_RootWalletContractInstances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<WalletContractInstances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<WalletContractInstances_Order_By>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
};


export type Subscription_RootWalletContractInstances_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootWalletsArgs = {
  distinct_on?: InputMaybe<Array<Wallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Wallets_Order_By>>;
  where?: InputMaybe<Wallets_Bool_Exp>;
};


export type Subscription_RootWallets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Wallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Wallets_Order_By>>;
  where?: InputMaybe<Wallets_Bool_Exp>;
};


export type Subscription_RootWallets_By_PkArgs = {
  id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type MeemPartsFragment = { __typename?: 'Meems', tokenId: string, MeemContractId?: any | null, MeemContract?: { __typename?: 'MeemContracts', address: string, name: string, symbol: string } | null };

export type MeemContractPartsFragment = { __typename?: 'MeemContracts', slug: string, address: string, metadata: any, createdAt: any, name: string };

export type GetIsMemberOfClubQueryVariables = Exact<{
  walletAddress?: InputMaybe<Scalars['String']>;
  clubSlug?: InputMaybe<Scalars['String']>;
}>;


export type GetIsMemberOfClubQuery = { __typename?: 'query_root', Meems: Array<{ __typename?: 'Meems', tokenId: string, MeemContractId?: any | null, MeemContract?: { __typename?: 'MeemContracts', address: string, name: string, symbol: string } | null }> };

export type GetClubsAutocompleteQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
}>;


export type GetClubsAutocompleteQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', id: any, name: string, metadata: any, slug: string }> };

export type GetClubSlugQueryVariables = Exact<{
  contractAddress?: InputMaybe<Scalars['String']>;
}>;


export type GetClubSlugQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string }> };

export type GetClubQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetClubQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, metadata: any, createdAt: any, name: string, gnosisSafeAddress?: string | null, splits: any, maxSupply: string, mintPermissions: any, symbol: string, id: any, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string, Owner?: { __typename?: 'Wallets', address: string, ens?: string | null } | null }>, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', address: string, ens?: string | null } | null }>, MeemContractIntegrations: Array<{ __typename?: 'MeemContractIntegrations', IntegrationId?: any | null, id: any, isEnabled: boolean, metadata: any, isPublic: boolean, Integration?: { __typename?: 'Integrations', description: string, guideUrl: string, icon: string, id: any, name: string } | null }> }> };

export type GetClubSubscriptionSubscriptionVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetClubSubscriptionSubscription = { __typename?: 'subscription_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, metadata: any, createdAt: any, name: string, gnosisSafeAddress?: string | null, splits: any, maxSupply: string, mintPermissions: any, symbol: string, id: any, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string, Owner?: { __typename?: 'Wallets', address: string, ens?: string | null } | null }>, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', address: string, ens?: string | null } | null }>, MeemContractIntegrations: Array<{ __typename?: 'MeemContractIntegrations', IntegrationId?: any | null, id: any, isEnabled: boolean, metadata: any, isPublic: boolean, Integration?: { __typename?: 'Integrations', description: string, guideUrl: string, icon: string, id: any, name: string } | null }> }> };

export type ClubSubscriptionSubscriptionVariables = Exact<{
  address?: InputMaybe<Scalars['String']>;
}>;


export type ClubSubscriptionSubscription = { __typename?: 'subscription_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, createdAt: any, name: string, metadata: any, splits: any, mintPermissions: any, symbol: string, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string }>, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', ens?: string | null, address: string } | null }> }> };

export type MyClubsQueryVariables = Exact<{
  walletAddress?: InputMaybe<Scalars['String']>;
}>;


export type MyClubsQuery = { __typename?: 'query_root', Meems: Array<{ __typename?: 'Meems', tokenId: string, MeemContractId?: any | null, MeemContract?: { __typename?: 'MeemContracts', slug: string, address: string, createdAt: any, name: string, metadata: any, splits: any, mintPermissions: any, symbol: string, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', ens?: string | null, address: string } | null }> } | null }> };

export type GetIntegrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIntegrationsQuery = { __typename?: 'query_root', Integrations: Array<{ __typename?: 'Integrations', createdAt: any, deletedAt?: any | null, description: string, guideUrl: string, icon: string, id: any, name: string, updatedAt: any }> };

export type AllClubsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type AllClubsQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, createdAt: any, name: string, metadata: any, splits: any, mintPermissions: any, symbol: string, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string }>, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', ens?: string | null, address: string } | null }>, Meems_aggregate: { __typename?: 'Meems_aggregate', aggregate?: { __typename?: 'Meems_aggregate_fields', count: number } | null } }> };

export type MyClubsSubscriptionSubscriptionVariables = Exact<{
  walletAddress?: InputMaybe<Scalars['String']>;
}>;


export type MyClubsSubscriptionSubscription = { __typename?: 'subscription_root', Meems: Array<{ __typename?: 'Meems', tokenId: string, MeemContractId?: any | null, MeemContract?: { __typename?: 'MeemContracts', id: any, slug: string, address: string, createdAt: any, name: string, metadata: any, splits: any, gnosisSafeAddress?: string | null, mintPermissions: any, symbol: string, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', ens?: string | null, address: string } | null }>, Meems_aggregate: { __typename?: 'Meems_aggregate', aggregate?: { __typename?: 'Meems_aggregate_fields', count: number } | null } } | null }> };

export type GetBundleByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetBundleByIdQuery = { __typename?: 'query_root', Bundles: Array<{ __typename?: 'Bundles', id: any, abi: any, BundleContracts: Array<{ __typename?: 'BundleContracts', functionSelectors: any, Contract?: { __typename?: 'Contracts', ContractInstances: Array<{ __typename?: 'ContractInstances', address: string }> } | null }> }> };

export type MeemIdSubscriptionSubscriptionVariables = Exact<{
  walletAddress?: InputMaybe<Scalars['String']>;
}>;


export type MeemIdSubscriptionSubscription = { __typename?: 'subscription_root', MeemIdentities: Array<{ __typename?: 'MeemIdentities', updatedAt: any, profilePicUrl?: string | null, id: any, displayName?: string | null, deletedAt?: any | null, createdAt: any, Wallet?: { __typename?: 'Wallets', address: string, ens?: string | null } | null, MeemIdentityIntegrations: Array<{ __typename?: 'MeemIdentityIntegrations', metadata: any, visibility: string }> }> };

export const MeemPartsFragmentDoc = gql`
    fragment MeemParts on Meems {
  tokenId
  MeemContractId
  MeemContract {
    address
    name
    symbol
  }
}
    `;
export const MeemContractPartsFragmentDoc = gql`
    fragment MeemContractParts on MeemContracts {
  slug
  address
  metadata
  createdAt
  name
}
    `;
export const GetIsMemberOfClubDocument = gql`
    query GetIsMemberOfClub($walletAddress: String, $clubSlug: String) {
  Meems(
    where: {MeemContractId: {_is_null: false}, MeemContract: {slug: {_eq: $clubSlug}}}
  ) {
    ...MeemParts
  }
}
    ${MeemPartsFragmentDoc}`;

/**
 * __useGetIsMemberOfClubQuery__
 *
 * To run a query within a React component, call `useGetIsMemberOfClubQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIsMemberOfClubQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIsMemberOfClubQuery({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *      clubSlug: // value for 'clubSlug'
 *   },
 * });
 */
export function useGetIsMemberOfClubQuery(baseOptions?: Apollo.QueryHookOptions<GetIsMemberOfClubQuery, GetIsMemberOfClubQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIsMemberOfClubQuery, GetIsMemberOfClubQueryVariables>(GetIsMemberOfClubDocument, options);
      }
export function useGetIsMemberOfClubLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIsMemberOfClubQuery, GetIsMemberOfClubQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIsMemberOfClubQuery, GetIsMemberOfClubQueryVariables>(GetIsMemberOfClubDocument, options);
        }
export type GetIsMemberOfClubQueryHookResult = ReturnType<typeof useGetIsMemberOfClubQuery>;
export type GetIsMemberOfClubLazyQueryHookResult = ReturnType<typeof useGetIsMemberOfClubLazyQuery>;
export type GetIsMemberOfClubQueryResult = Apollo.QueryResult<GetIsMemberOfClubQuery, GetIsMemberOfClubQueryVariables>;
export const GetClubsAutocompleteDocument = gql`
    query GetClubsAutocomplete($query: String) {
  MeemContracts(where: {name: {_ilike: $query}}) {
    id
    name
    metadata
    slug
  }
}
    `;

/**
 * __useGetClubsAutocompleteQuery__
 *
 * To run a query within a React component, call `useGetClubsAutocompleteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClubsAutocompleteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClubsAutocompleteQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useGetClubsAutocompleteQuery(baseOptions?: Apollo.QueryHookOptions<GetClubsAutocompleteQuery, GetClubsAutocompleteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClubsAutocompleteQuery, GetClubsAutocompleteQueryVariables>(GetClubsAutocompleteDocument, options);
      }
export function useGetClubsAutocompleteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClubsAutocompleteQuery, GetClubsAutocompleteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClubsAutocompleteQuery, GetClubsAutocompleteQueryVariables>(GetClubsAutocompleteDocument, options);
        }
export type GetClubsAutocompleteQueryHookResult = ReturnType<typeof useGetClubsAutocompleteQuery>;
export type GetClubsAutocompleteLazyQueryHookResult = ReturnType<typeof useGetClubsAutocompleteLazyQuery>;
export type GetClubsAutocompleteQueryResult = Apollo.QueryResult<GetClubsAutocompleteQuery, GetClubsAutocompleteQueryVariables>;
export const GetClubSlugDocument = gql`
    query GetClubSlug($contractAddress: String) {
  MeemContracts(where: {address: {_eq: $contractAddress}}) {
    slug
  }
}
    `;

/**
 * __useGetClubSlugQuery__
 *
 * To run a query within a React component, call `useGetClubSlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClubSlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClubSlugQuery({
 *   variables: {
 *      contractAddress: // value for 'contractAddress'
 *   },
 * });
 */
export function useGetClubSlugQuery(baseOptions?: Apollo.QueryHookOptions<GetClubSlugQuery, GetClubSlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClubSlugQuery, GetClubSlugQueryVariables>(GetClubSlugDocument, options);
      }
export function useGetClubSlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClubSlugQuery, GetClubSlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClubSlugQuery, GetClubSlugQueryVariables>(GetClubSlugDocument, options);
        }
export type GetClubSlugQueryHookResult = ReturnType<typeof useGetClubSlugQuery>;
export type GetClubSlugLazyQueryHookResult = ReturnType<typeof useGetClubSlugLazyQuery>;
export type GetClubSlugQueryResult = Apollo.QueryResult<GetClubSlugQuery, GetClubSlugQueryVariables>;
export const GetClubDocument = gql`
    query GetClub($slug: String) {
  MeemContracts(where: {slug: {_eq: $slug}}) {
    slug
    address
    metadata
    createdAt
    name
    gnosisSafeAddress
    Meems {
      Owner {
        address
        ens
      }
      tokenId
      tokenURI
      mintedAt
      mintedBy
    }
    splits
    maxSupply
    mintPermissions
    symbol
    MeemContractWallets {
      role
      Wallet {
        address
        ens
      }
    }
    id
    MeemContractIntegrations(where: {isEnabled: {_eq: true}}) {
      IntegrationId
      id
      isEnabled
      metadata
      Integration {
        description
        guideUrl
        icon
        id
        name
      }
      isPublic
    }
  }
}
    `;

/**
 * __useGetClubQuery__
 *
 * To run a query within a React component, call `useGetClubQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClubQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClubQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetClubQuery(baseOptions?: Apollo.QueryHookOptions<GetClubQuery, GetClubQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClubQuery, GetClubQueryVariables>(GetClubDocument, options);
      }
export function useGetClubLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClubQuery, GetClubQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClubQuery, GetClubQueryVariables>(GetClubDocument, options);
        }
export type GetClubQueryHookResult = ReturnType<typeof useGetClubQuery>;
export type GetClubLazyQueryHookResult = ReturnType<typeof useGetClubLazyQuery>;
export type GetClubQueryResult = Apollo.QueryResult<GetClubQuery, GetClubQueryVariables>;
export const GetClubSubscriptionDocument = gql`
    subscription GetClubSubscription($slug: String) {
  MeemContracts(where: {slug: {_eq: $slug}}) {
    slug
    address
    metadata
    createdAt
    name
    gnosisSafeAddress
    Meems {
      Owner {
        address
        ens
      }
      tokenId
      tokenURI
      mintedAt
      mintedBy
    }
    splits
    maxSupply
    mintPermissions
    symbol
    MeemContractWallets {
      role
      Wallet {
        address
        ens
      }
    }
    id
    MeemContractIntegrations(where: {isEnabled: {_eq: true}}) {
      IntegrationId
      id
      isEnabled
      metadata
      Integration {
        description
        guideUrl
        icon
        id
        name
      }
      isPublic
    }
  }
}
    `;

/**
 * __useGetClubSubscriptionSubscription__
 *
 * To run a query within a React component, call `useGetClubSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetClubSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClubSubscriptionSubscription({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetClubSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GetClubSubscriptionSubscription, GetClubSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetClubSubscriptionSubscription, GetClubSubscriptionSubscriptionVariables>(GetClubSubscriptionDocument, options);
      }
export type GetClubSubscriptionSubscriptionHookResult = ReturnType<typeof useGetClubSubscriptionSubscription>;
export type GetClubSubscriptionSubscriptionResult = Apollo.SubscriptionResult<GetClubSubscriptionSubscription>;
export const ClubSubscriptionDocument = gql`
    subscription ClubSubscription($address: String) {
  MeemContracts(where: {address: {_eq: $address}}) {
    slug
    address
    createdAt
    name
    metadata
    Meems {
      tokenId
      tokenURI
      mintedAt
      mintedBy
    }
    splits
    mintPermissions
    symbol
    MeemContractWallets {
      role
      Wallet {
        ens
        address
      }
    }
  }
}
    `;

/**
 * __useClubSubscriptionSubscription__
 *
 * To run a query within a React component, call `useClubSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useClubSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClubSubscriptionSubscription({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useClubSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ClubSubscriptionSubscription, ClubSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ClubSubscriptionSubscription, ClubSubscriptionSubscriptionVariables>(ClubSubscriptionDocument, options);
      }
export type ClubSubscriptionSubscriptionHookResult = ReturnType<typeof useClubSubscriptionSubscription>;
export type ClubSubscriptionSubscriptionResult = Apollo.SubscriptionResult<ClubSubscriptionSubscription>;
export const MyClubsDocument = gql`
    query MyClubs($walletAddress: String) {
  Meems(where: {MeemContractId: {_is_null: false}}, distinct_on: MeemContractId) {
    tokenId
    MeemContractId
    MeemContract {
      slug
      address
      createdAt
      name
      metadata
      splits
      mintPermissions
      symbol
      MeemContractWallets {
        role
        Wallet {
          ens
          address
        }
      }
    }
  }
}
    `;

/**
 * __useMyClubsQuery__
 *
 * To run a query within a React component, call `useMyClubsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyClubsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyClubsQuery({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useMyClubsQuery(baseOptions?: Apollo.QueryHookOptions<MyClubsQuery, MyClubsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyClubsQuery, MyClubsQueryVariables>(MyClubsDocument, options);
      }
export function useMyClubsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyClubsQuery, MyClubsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyClubsQuery, MyClubsQueryVariables>(MyClubsDocument, options);
        }
export type MyClubsQueryHookResult = ReturnType<typeof useMyClubsQuery>;
export type MyClubsLazyQueryHookResult = ReturnType<typeof useMyClubsLazyQuery>;
export type MyClubsQueryResult = Apollo.QueryResult<MyClubsQuery, MyClubsQueryVariables>;
export const GetIntegrationsDocument = gql`
    query GetIntegrations {
  Integrations {
    createdAt
    deletedAt
    description
    guideUrl
    icon
    id
    name
    updatedAt
  }
}
    `;

/**
 * __useGetIntegrationsQuery__
 *
 * To run a query within a React component, call `useGetIntegrationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIntegrationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIntegrationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetIntegrationsQuery(baseOptions?: Apollo.QueryHookOptions<GetIntegrationsQuery, GetIntegrationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIntegrationsQuery, GetIntegrationsQueryVariables>(GetIntegrationsDocument, options);
      }
export function useGetIntegrationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIntegrationsQuery, GetIntegrationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIntegrationsQuery, GetIntegrationsQueryVariables>(GetIntegrationsDocument, options);
        }
export type GetIntegrationsQueryHookResult = ReturnType<typeof useGetIntegrationsQuery>;
export type GetIntegrationsLazyQueryHookResult = ReturnType<typeof useGetIntegrationsLazyQuery>;
export type GetIntegrationsQueryResult = Apollo.QueryResult<GetIntegrationsQuery, GetIntegrationsQueryVariables>;
export const AllClubsDocument = gql`
    query AllClubs($limit: Int, $offset: Int) {
  MeemContracts(
    order_by: {Meems_aggregate: {count: desc}}
    limit: $limit
    offset: $offset
  ) {
    slug
    address
    createdAt
    name
    metadata
    Meems {
      tokenId
      tokenURI
      mintedAt
      mintedBy
    }
    splits
    mintPermissions
    symbol
    MeemContractWallets {
      role
      Wallet {
        ens
        address
      }
    }
    Meems_aggregate {
      aggregate {
        count
      }
    }
  }
}
    `;

/**
 * __useAllClubsQuery__
 *
 * To run a query within a React component, call `useAllClubsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllClubsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllClubsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useAllClubsQuery(baseOptions?: Apollo.QueryHookOptions<AllClubsQuery, AllClubsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllClubsQuery, AllClubsQueryVariables>(AllClubsDocument, options);
      }
export function useAllClubsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllClubsQuery, AllClubsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllClubsQuery, AllClubsQueryVariables>(AllClubsDocument, options);
        }
export type AllClubsQueryHookResult = ReturnType<typeof useAllClubsQuery>;
export type AllClubsLazyQueryHookResult = ReturnType<typeof useAllClubsLazyQuery>;
export type AllClubsQueryResult = Apollo.QueryResult<AllClubsQuery, AllClubsQueryVariables>;
export const MyClubsSubscriptionDocument = gql`
    subscription MyClubsSubscription($walletAddress: String) {
  Meems(
    where: {MeemContractId: {_is_null: false}, Owner: {address: {_ilike: $walletAddress}}}
    distinct_on: MeemContractId
  ) {
    tokenId
    MeemContractId
    MeemContract {
      id
      slug
      address
      createdAt
      name
      metadata
      splits
      gnosisSafeAddress
      mintPermissions
      symbol
      MeemContractWallets {
        role
        Wallet {
          ens
          address
        }
      }
      Meems_aggregate {
        aggregate {
          count
        }
      }
    }
  }
}
    `;

/**
 * __useMyClubsSubscriptionSubscription__
 *
 * To run a query within a React component, call `useMyClubsSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMyClubsSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyClubsSubscriptionSubscription({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useMyClubsSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MyClubsSubscriptionSubscription, MyClubsSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MyClubsSubscriptionSubscription, MyClubsSubscriptionSubscriptionVariables>(MyClubsSubscriptionDocument, options);
      }
export type MyClubsSubscriptionSubscriptionHookResult = ReturnType<typeof useMyClubsSubscriptionSubscription>;
export type MyClubsSubscriptionSubscriptionResult = Apollo.SubscriptionResult<MyClubsSubscriptionSubscription>;
export const GetBundleByIdDocument = gql`
    query GetBundleById($id: uuid!) {
  Bundles(where: {id: {_eq: $id}}) {
    id
    abi
    BundleContracts {
      functionSelectors
      Contract {
        ContractInstances {
          address
        }
      }
    }
  }
}
    `;

/**
 * __useGetBundleByIdQuery__
 *
 * To run a query within a React component, call `useGetBundleByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBundleByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBundleByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBundleByIdQuery(baseOptions: Apollo.QueryHookOptions<GetBundleByIdQuery, GetBundleByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBundleByIdQuery, GetBundleByIdQueryVariables>(GetBundleByIdDocument, options);
      }
export function useGetBundleByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBundleByIdQuery, GetBundleByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBundleByIdQuery, GetBundleByIdQueryVariables>(GetBundleByIdDocument, options);
        }
export type GetBundleByIdQueryHookResult = ReturnType<typeof useGetBundleByIdQuery>;
export type GetBundleByIdLazyQueryHookResult = ReturnType<typeof useGetBundleByIdLazyQuery>;
export type GetBundleByIdQueryResult = Apollo.QueryResult<GetBundleByIdQuery, GetBundleByIdQueryVariables>;
export const MeemIdSubscriptionDocument = gql`
    subscription MeemIdSubscription($walletAddress: String) {
  MeemIdentities(where: {Wallet: {address: {_ilike: $walletAddress}}}) {
    updatedAt
    profilePicUrl
    id
    displayName
    deletedAt
    createdAt
    Wallet {
      address
      ens
    }
    MeemIdentityIntegrations {
      metadata
      visibility
    }
  }
}
    `;

/**
 * __useMeemIdSubscriptionSubscription__
 *
 * To run a query within a React component, call `useMeemIdSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMeemIdSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeemIdSubscriptionSubscription({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useMeemIdSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MeemIdSubscriptionSubscription, MeemIdSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MeemIdSubscriptionSubscription, MeemIdSubscriptionSubscriptionVariables>(MeemIdSubscriptionDocument, options);
      }
export type MeemIdSubscriptionSubscriptionHookResult = ReturnType<typeof useMeemIdSubscriptionSubscription>;
export type MeemIdSubscriptionSubscriptionResult = Apollo.SubscriptionResult<MeemIdSubscriptionSubscription>;