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

/** append existing jsonb value of filtered columns with new jsonb value */
export type BundleContracts_Append_Input = {
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "BundleContracts" */
export type BundleContracts_Arr_Rel_Insert_Input = {
  data: Array<BundleContracts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<BundleContracts_On_Conflict>;
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

/** unique or primary key constraints on table "BundleContracts" */
export enum BundleContracts_Constraint {
  /** unique or primary key constraint on columns "ContractId", "BundleId" */
  BundleContractsBundleIdContractIdKey = 'BundleContracts_BundleId_ContractId_key',
  /** unique or primary key constraint on columns "id" */
  BundleContractsPkey = 'BundleContracts_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type BundleContracts_Delete_At_Path_Input = {
  functionSelectors?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type BundleContracts_Delete_Elem_Input = {
  functionSelectors?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type BundleContracts_Delete_Key_Input = {
  functionSelectors?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "BundleContracts" */
export type BundleContracts_Inc_Input = {
  order?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "BundleContracts" */
export type BundleContracts_Insert_Input = {
  Bundle?: InputMaybe<Bundles_Obj_Rel_Insert_Input>;
  BundleId?: InputMaybe<Scalars['uuid']>;
  Contract?: InputMaybe<Contracts_Obj_Rel_Insert_Input>;
  ContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  order?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "BundleContracts" */
export type BundleContracts_Mutation_Response = {
  __typename?: 'BundleContracts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<BundleContracts>;
};

/** on_conflict condition type for table "BundleContracts" */
export type BundleContracts_On_Conflict = {
  constraint: BundleContracts_Constraint;
  update_columns?: Array<BundleContracts_Update_Column>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
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

/** primary key columns input for table: BundleContracts */
export type BundleContracts_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type BundleContracts_Prepend_Input = {
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
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

/** input type for updating data in table "BundleContracts" */
export type BundleContracts_Set_Input = {
  BundleId?: InputMaybe<Scalars['uuid']>;
  ContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  order?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

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

/** Streaming cursor of the table "BundleContracts" */
export type BundleContracts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: BundleContracts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type BundleContracts_Stream_Cursor_Value_Input = {
  BundleId?: InputMaybe<Scalars['uuid']>;
  ContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  order?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** update columns of table "BundleContracts" */
export enum BundleContracts_Update_Column {
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

export type BundleContracts_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<BundleContracts_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<BundleContracts_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<BundleContracts_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<BundleContracts_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BundleContracts_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<BundleContracts_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BundleContracts_Set_Input>;
  where: BundleContracts_Bool_Exp;
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

/** append existing jsonb value of filtered columns with new jsonb value */
export type Bundles_Append_Input = {
  abi?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "Bundles" */
export type Bundles_Arr_Rel_Insert_Input = {
  data: Array<Bundles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Bundles_On_Conflict>;
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

/** unique or primary key constraints on table "Bundles" */
export enum Bundles_Constraint {
  /** unique or primary key constraint on columns "id" */
  BundlesPkey = 'Bundles_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Bundles_Delete_At_Path_Input = {
  abi?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Bundles_Delete_Elem_Input = {
  abi?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Bundles_Delete_Key_Input = {
  abi?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "Bundles" */
export type Bundles_Insert_Input = {
  BundleContracts?: InputMaybe<BundleContracts_Arr_Rel_Insert_Input>;
  Creator?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  CreatorId?: InputMaybe<Scalars['uuid']>;
  abi?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  types?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "Bundles" */
export type Bundles_Mutation_Response = {
  __typename?: 'Bundles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Bundles>;
};

/** input type for inserting object relation for remote table "Bundles" */
export type Bundles_Obj_Rel_Insert_Input = {
  data: Bundles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Bundles_On_Conflict>;
};

/** on_conflict condition type for table "Bundles" */
export type Bundles_On_Conflict = {
  constraint: Bundles_Constraint;
  update_columns?: Array<Bundles_Update_Column>;
  where?: InputMaybe<Bundles_Bool_Exp>;
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

/** primary key columns input for table: Bundles */
export type Bundles_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Bundles_Prepend_Input = {
  abi?: InputMaybe<Scalars['jsonb']>;
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

/** input type for updating data in table "Bundles" */
export type Bundles_Set_Input = {
  CreatorId?: InputMaybe<Scalars['uuid']>;
  abi?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  types?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "Bundles" */
export type Bundles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Bundles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Bundles_Stream_Cursor_Value_Input = {
  CreatorId?: InputMaybe<Scalars['uuid']>;
  abi?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  types?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "Bundles" */
export enum Bundles_Update_Column {
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

export type Bundles_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Bundles_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Bundles_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Bundles_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Bundles_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Bundles_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Bundles_Set_Input>;
  where: Bundles_Bool_Exp;
};

/** columns and relationships of "Clippings" */
export type Clippings = {
  __typename?: 'Clippings';
  /** An object relationship */
  Meem?: Maybe<Meems>;
  MeemId?: Maybe<Scalars['uuid']>;
  address: Scalars['String'];
  clippedAt: Scalars['timestamptz'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "Clippings" */
export type Clippings_Aggregate = {
  __typename?: 'Clippings_aggregate';
  aggregate?: Maybe<Clippings_Aggregate_Fields>;
  nodes: Array<Clippings>;
};

/** aggregate fields of "Clippings" */
export type Clippings_Aggregate_Fields = {
  __typename?: 'Clippings_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Clippings_Max_Fields>;
  min?: Maybe<Clippings_Min_Fields>;
};


/** aggregate fields of "Clippings" */
export type Clippings_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clippings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "Clippings" */
export type Clippings_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Clippings_Max_Order_By>;
  min?: InputMaybe<Clippings_Min_Order_By>;
};

/** input type for inserting array relation for remote table "Clippings" */
export type Clippings_Arr_Rel_Insert_Input = {
  data: Array<Clippings_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Clippings_On_Conflict>;
};

/** Boolean expression to filter rows from the table "Clippings". All fields are combined with a logical 'AND'. */
export type Clippings_Bool_Exp = {
  Meem?: InputMaybe<Meems_Bool_Exp>;
  MeemId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Clippings_Bool_Exp>>;
  _not?: InputMaybe<Clippings_Bool_Exp>;
  _or?: InputMaybe<Array<Clippings_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  clippedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "Clippings" */
export enum Clippings_Constraint {
  /** unique or primary key constraint on columns "id" */
  ClippingsPkey = 'Clippings_pkey'
}

/** input type for inserting data into table "Clippings" */
export type Clippings_Insert_Input = {
  Meem?: InputMaybe<Meems_Obj_Rel_Insert_Input>;
  MeemId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  clippedAt?: InputMaybe<Scalars['timestamptz']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Clippings_Max_Fields = {
  __typename?: 'Clippings_max_fields';
  MeemId?: Maybe<Scalars['uuid']>;
  address?: Maybe<Scalars['String']>;
  clippedAt?: Maybe<Scalars['timestamptz']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "Clippings" */
export type Clippings_Max_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  clippedAt?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Clippings_Min_Fields = {
  __typename?: 'Clippings_min_fields';
  MeemId?: Maybe<Scalars['uuid']>;
  address?: Maybe<Scalars['String']>;
  clippedAt?: Maybe<Scalars['timestamptz']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "Clippings" */
export type Clippings_Min_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  clippedAt?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "Clippings" */
export type Clippings_Mutation_Response = {
  __typename?: 'Clippings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Clippings>;
};

/** on_conflict condition type for table "Clippings" */
export type Clippings_On_Conflict = {
  constraint: Clippings_Constraint;
  update_columns?: Array<Clippings_Update_Column>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};

/** Ordering options when selecting data from "Clippings". */
export type Clippings_Order_By = {
  Meem?: InputMaybe<Meems_Order_By>;
  MeemId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  clippedAt?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: Clippings */
export type Clippings_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "Clippings" */
export enum Clippings_Select_Column {
  /** column name */
  MeemId = 'MeemId',
  /** column name */
  Address = 'address',
  /** column name */
  ClippedAt = 'clippedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "Clippings" */
export type Clippings_Set_Input = {
  MeemId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  clippedAt?: InputMaybe<Scalars['timestamptz']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "Clippings" */
export type Clippings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clippings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clippings_Stream_Cursor_Value_Input = {
  MeemId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  clippedAt?: InputMaybe<Scalars['timestamptz']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "Clippings" */
export enum Clippings_Update_Column {
  /** column name */
  MeemId = 'MeemId',
  /** column name */
  Address = 'address',
  /** column name */
  ClippedAt = 'clippedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Clippings_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clippings_Set_Input>;
  where: Clippings_Bool_Exp;
};

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

/** input type for inserting array relation for remote table "ContractInstances" */
export type ContractInstances_Arr_Rel_Insert_Input = {
  data: Array<ContractInstances_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<ContractInstances_On_Conflict>;
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

/** unique or primary key constraints on table "ContractInstances" */
export enum ContractInstances_Constraint {
  /** unique or primary key constraint on columns "id" */
  ContractInstancesPkey = 'ContractInstances_pkey'
}

/** input type for incrementing numeric columns in table "ContractInstances" */
export type ContractInstances_Inc_Input = {
  chainId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "ContractInstances" */
export type ContractInstances_Insert_Input = {
  Contract?: InputMaybe<Contracts_Obj_Rel_Insert_Input>;
  ContractId?: InputMaybe<Scalars['uuid']>;
  WalletContractInstances?: InputMaybe<WalletContractInstances_Arr_Rel_Insert_Input>;
  address?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "ContractInstances" */
export type ContractInstances_Mutation_Response = {
  __typename?: 'ContractInstances_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<ContractInstances>;
};

/** input type for inserting object relation for remote table "ContractInstances" */
export type ContractInstances_Obj_Rel_Insert_Input = {
  data: ContractInstances_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<ContractInstances_On_Conflict>;
};

/** on_conflict condition type for table "ContractInstances" */
export type ContractInstances_On_Conflict = {
  constraint: ContractInstances_Constraint;
  update_columns?: Array<ContractInstances_Update_Column>;
  where?: InputMaybe<ContractInstances_Bool_Exp>;
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

/** primary key columns input for table: ContractInstances */
export type ContractInstances_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "ContractInstances" */
export type ContractInstances_Set_Input = {
  ContractId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

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

/** Streaming cursor of the table "ContractInstances" */
export type ContractInstances_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ContractInstances_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ContractInstances_Stream_Cursor_Value_Input = {
  ContractId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** update columns of table "ContractInstances" */
export enum ContractInstances_Update_Column {
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

export type ContractInstances_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ContractInstances_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ContractInstances_Set_Input>;
  where: ContractInstances_Bool_Exp;
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

/** aggregated selection of "Contracts" */
export type Contracts_Aggregate = {
  __typename?: 'Contracts_aggregate';
  aggregate?: Maybe<Contracts_Aggregate_Fields>;
  nodes: Array<Contracts>;
};

/** aggregate fields of "Contracts" */
export type Contracts_Aggregate_Fields = {
  __typename?: 'Contracts_aggregate_fields';
  avg?: Maybe<Contracts_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Contracts_Max_Fields>;
  min?: Maybe<Contracts_Min_Fields>;
  stddev?: Maybe<Contracts_Stddev_Fields>;
  stddev_pop?: Maybe<Contracts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Contracts_Stddev_Samp_Fields>;
  sum?: Maybe<Contracts_Sum_Fields>;
  var_pop?: Maybe<Contracts_Var_Pop_Fields>;
  var_samp?: Maybe<Contracts_Var_Samp_Fields>;
  variance?: Maybe<Contracts_Variance_Fields>;
};


/** aggregate fields of "Contracts" */
export type Contracts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contracts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
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

/** append existing jsonb value of filtered columns with new jsonb value */
export type Contracts_Append_Input = {
  abi?: InputMaybe<Scalars['jsonb']>;
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "Contracts" */
export type Contracts_Arr_Rel_Insert_Input = {
  data: Array<Contracts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Contracts_On_Conflict>;
};

/** aggregate avg on columns */
export type Contracts_Avg_Fields = {
  __typename?: 'Contracts_avg_fields';
  version?: Maybe<Scalars['Float']>;
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

/** unique or primary key constraints on table "Contracts" */
export enum Contracts_Constraint {
  /** unique or primary key constraint on columns "id" */
  ContractsPkey = 'Contracts_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Contracts_Delete_At_Path_Input = {
  abi?: InputMaybe<Array<Scalars['String']>>;
  functionSelectors?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Contracts_Delete_Elem_Input = {
  abi?: InputMaybe<Scalars['Int']>;
  functionSelectors?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Contracts_Delete_Key_Input = {
  abi?: InputMaybe<Scalars['String']>;
  functionSelectors?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "Contracts" */
export type Contracts_Inc_Input = {
  version?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "Contracts" */
export type Contracts_Insert_Input = {
  BundleContracts?: InputMaybe<BundleContracts_Arr_Rel_Insert_Input>;
  ContractInstances?: InputMaybe<ContractInstances_Arr_Rel_Insert_Input>;
  Creator?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  CreatorId?: InputMaybe<Scalars['uuid']>;
  abi?: InputMaybe<Scalars['jsonb']>;
  bytecode?: InputMaybe<Scalars['String']>;
  contractType?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  version?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Contracts_Max_Fields = {
  __typename?: 'Contracts_max_fields';
  CreatorId?: Maybe<Scalars['uuid']>;
  bytecode?: Maybe<Scalars['String']>;
  contractType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  version?: Maybe<Scalars['Int']>;
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

/** aggregate min on columns */
export type Contracts_Min_Fields = {
  __typename?: 'Contracts_min_fields';
  CreatorId?: Maybe<Scalars['uuid']>;
  bytecode?: Maybe<Scalars['String']>;
  contractType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  version?: Maybe<Scalars['Int']>;
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

/** response of any mutation on the table "Contracts" */
export type Contracts_Mutation_Response = {
  __typename?: 'Contracts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Contracts>;
};

/** input type for inserting object relation for remote table "Contracts" */
export type Contracts_Obj_Rel_Insert_Input = {
  data: Contracts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Contracts_On_Conflict>;
};

/** on_conflict condition type for table "Contracts" */
export type Contracts_On_Conflict = {
  constraint: Contracts_Constraint;
  update_columns?: Array<Contracts_Update_Column>;
  where?: InputMaybe<Contracts_Bool_Exp>;
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

/** primary key columns input for table: Contracts */
export type Contracts_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Contracts_Prepend_Input = {
  abi?: InputMaybe<Scalars['jsonb']>;
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
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

/** input type for updating data in table "Contracts" */
export type Contracts_Set_Input = {
  CreatorId?: InputMaybe<Scalars['uuid']>;
  abi?: InputMaybe<Scalars['jsonb']>;
  bytecode?: InputMaybe<Scalars['String']>;
  contractType?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  version?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Contracts_Stddev_Fields = {
  __typename?: 'Contracts_stddev_fields';
  version?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "Contracts" */
export type Contracts_Stddev_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Contracts_Stddev_Pop_Fields = {
  __typename?: 'Contracts_stddev_pop_fields';
  version?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "Contracts" */
export type Contracts_Stddev_Pop_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Contracts_Stddev_Samp_Fields = {
  __typename?: 'Contracts_stddev_samp_fields';
  version?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "Contracts" */
export type Contracts_Stddev_Samp_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Contracts" */
export type Contracts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contracts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contracts_Stream_Cursor_Value_Input = {
  CreatorId?: InputMaybe<Scalars['uuid']>;
  abi?: InputMaybe<Scalars['jsonb']>;
  bytecode?: InputMaybe<Scalars['String']>;
  contractType?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  functionSelectors?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  version?: InputMaybe<Scalars['Int']>;
};

/** aggregate sum on columns */
export type Contracts_Sum_Fields = {
  __typename?: 'Contracts_sum_fields';
  version?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "Contracts" */
export type Contracts_Sum_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** update columns of table "Contracts" */
export enum Contracts_Update_Column {
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

export type Contracts_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Contracts_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Contracts_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Contracts_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Contracts_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Contracts_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Contracts_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Contracts_Set_Input>;
  where: Contracts_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Contracts_Var_Pop_Fields = {
  __typename?: 'Contracts_var_pop_fields';
  version?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "Contracts" */
export type Contracts_Var_Pop_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Contracts_Var_Samp_Fields = {
  __typename?: 'Contracts_var_samp_fields';
  version?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "Contracts" */
export type Contracts_Var_Samp_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Contracts_Variance_Fields = {
  __typename?: 'Contracts_variance_fields';
  version?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "Contracts" */
export type Contracts_Variance_Order_By = {
  version?: InputMaybe<Order_By>;
};

/** columns and relationships of "Discords" */
export type Discords = {
  __typename?: 'Discords';
  avatar?: Maybe<Scalars['String']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  discordId: Scalars['String'];
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
  username: Scalars['String'];
};

/** aggregated selection of "Discords" */
export type Discords_Aggregate = {
  __typename?: 'Discords_aggregate';
  aggregate?: Maybe<Discords_Aggregate_Fields>;
  nodes: Array<Discords>;
};

/** aggregate fields of "Discords" */
export type Discords_Aggregate_Fields = {
  __typename?: 'Discords_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Discords_Max_Fields>;
  min?: Maybe<Discords_Min_Fields>;
};


/** aggregate fields of "Discords" */
export type Discords_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Discords_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "Discords". All fields are combined with a logical 'AND'. */
export type Discords_Bool_Exp = {
  _and?: InputMaybe<Array<Discords_Bool_Exp>>;
  _not?: InputMaybe<Discords_Bool_Exp>;
  _or?: InputMaybe<Array<Discords_Bool_Exp>>;
  avatar?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  discordId?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  username?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "Discords" */
export enum Discords_Constraint {
  /** unique or primary key constraint on columns "id" */
  DiscordsPkey = 'Discords_pkey'
}

/** input type for inserting data into table "Discords" */
export type Discords_Insert_Input = {
  avatar?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  discordId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  username?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Discords_Max_Fields = {
  __typename?: 'Discords_max_fields';
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  discordId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  username?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Discords_Min_Fields = {
  __typename?: 'Discords_min_fields';
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  discordId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  username?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "Discords" */
export type Discords_Mutation_Response = {
  __typename?: 'Discords_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Discords>;
};

/** on_conflict condition type for table "Discords" */
export type Discords_On_Conflict = {
  constraint: Discords_Constraint;
  update_columns?: Array<Discords_Update_Column>;
  where?: InputMaybe<Discords_Bool_Exp>;
};

/** Ordering options when selecting data from "Discords". */
export type Discords_Order_By = {
  avatar?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  discordId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  username?: InputMaybe<Order_By>;
};

/** primary key columns input for table: Discords */
export type Discords_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "Discords" */
export enum Discords_Select_Column {
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  DiscordId = 'discordId',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  Username = 'username'
}

/** input type for updating data in table "Discords" */
export type Discords_Set_Input = {
  avatar?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  discordId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  username?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "Discords" */
export type Discords_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Discords_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Discords_Stream_Cursor_Value_Input = {
  avatar?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  discordId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  username?: InputMaybe<Scalars['String']>;
};

/** update columns of table "Discords" */
export enum Discords_Update_Column {
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  DiscordId = 'discordId',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  Username = 'username'
}

export type Discords_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Discords_Set_Input>;
  where: Discords_Bool_Exp;
};

/** columns and relationships of "Hashtags" */
export type Hashtags = {
  __typename?: 'Hashtags';
  /** An array relationship */
  TweetHashtags: Array<TweetHashtags>;
  /** An aggregate relationship */
  TweetHashtags_aggregate: TweetHashtags_Aggregate;
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


/** columns and relationships of "Hashtags" */
export type HashtagsTweetHashtags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TweetHashtags_Order_By>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};

/** aggregated selection of "Hashtags" */
export type Hashtags_Aggregate = {
  __typename?: 'Hashtags_aggregate';
  aggregate?: Maybe<Hashtags_Aggregate_Fields>;
  nodes: Array<Hashtags>;
};

/** aggregate fields of "Hashtags" */
export type Hashtags_Aggregate_Fields = {
  __typename?: 'Hashtags_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Hashtags_Max_Fields>;
  min?: Maybe<Hashtags_Min_Fields>;
};


/** aggregate fields of "Hashtags" */
export type Hashtags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Hashtags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
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

/** unique or primary key constraints on table "Hashtags" */
export enum Hashtags_Constraint {
  /** unique or primary key constraint on columns "id" */
  HashtagsPkey = 'Hashtags_pkey'
}

/** input type for inserting data into table "Hashtags" */
export type Hashtags_Insert_Input = {
  TweetHashtags?: InputMaybe<TweetHashtags_Arr_Rel_Insert_Input>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  tag?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Hashtags_Max_Fields = {
  __typename?: 'Hashtags_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  tag?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Hashtags_Min_Fields = {
  __typename?: 'Hashtags_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  tag?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "Hashtags" */
export type Hashtags_Mutation_Response = {
  __typename?: 'Hashtags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Hashtags>;
};

/** input type for inserting object relation for remote table "Hashtags" */
export type Hashtags_Obj_Rel_Insert_Input = {
  data: Hashtags_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Hashtags_On_Conflict>;
};

/** on_conflict condition type for table "Hashtags" */
export type Hashtags_On_Conflict = {
  constraint: Hashtags_Constraint;
  update_columns?: Array<Hashtags_Update_Column>;
  where?: InputMaybe<Hashtags_Bool_Exp>;
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

/** primary key columns input for table: Hashtags */
export type Hashtags_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "Hashtags" */
export type Hashtags_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  tag?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "Hashtags" */
export type Hashtags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Hashtags_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Hashtags_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  tag?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "Hashtags" */
export enum Hashtags_Update_Column {
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

export type Hashtags_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Hashtags_Set_Input>;
  where: Hashtags_Bool_Exp;
};

/** columns and relationships of "IdentityIntegrations" */
export type IdentityIntegrations = {
  __typename?: 'IdentityIntegrations';
  /** An array relationship */
  MeemIdentityIntegrations: Array<MeemIdentityIntegrations>;
  /** An aggregate relationship */
  MeemIdentityIntegrations_aggregate: MeemIdentityIntegrations_Aggregate;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description: Scalars['String'];
  icon: Scalars['String'];
  id: Scalars['uuid'];
  name: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "IdentityIntegrations" */
export type IdentityIntegrationsMeemIdentityIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityIntegrations_Order_By>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
};


/** columns and relationships of "IdentityIntegrations" */
export type IdentityIntegrationsMeemIdentityIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemIdentityIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemIdentityIntegrations_Order_By>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
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
  MeemIdentityIntegrations?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
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

/** unique or primary key constraints on table "IdentityIntegrations" */
export enum IdentityIntegrations_Constraint {
  /** unique or primary key constraint on columns "id" */
  IdentityIntegrationsPkey = 'IdentityIntegrations_pkey'
}

/** input type for inserting data into table "IdentityIntegrations" */
export type IdentityIntegrations_Insert_Input = {
  MeemIdentityIntegrations?: InputMaybe<MeemIdentityIntegrations_Arr_Rel_Insert_Input>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "IdentityIntegrations" */
export type IdentityIntegrations_Mutation_Response = {
  __typename?: 'IdentityIntegrations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<IdentityIntegrations>;
};

/** input type for inserting object relation for remote table "IdentityIntegrations" */
export type IdentityIntegrations_Obj_Rel_Insert_Input = {
  data: IdentityIntegrations_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<IdentityIntegrations_On_Conflict>;
};

/** on_conflict condition type for table "IdentityIntegrations" */
export type IdentityIntegrations_On_Conflict = {
  constraint: IdentityIntegrations_Constraint;
  update_columns?: Array<IdentityIntegrations_Update_Column>;
  where?: InputMaybe<IdentityIntegrations_Bool_Exp>;
};

/** Ordering options when selecting data from "IdentityIntegrations". */
export type IdentityIntegrations_Order_By = {
  MeemIdentityIntegrations_aggregate?: InputMaybe<MeemIdentityIntegrations_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  icon?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: IdentityIntegrations */
export type IdentityIntegrations_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "IdentityIntegrations" */
export type IdentityIntegrations_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "IdentityIntegrations" */
export type IdentityIntegrations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: IdentityIntegrations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type IdentityIntegrations_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "IdentityIntegrations" */
export enum IdentityIntegrations_Update_Column {
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

export type IdentityIntegrations_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<IdentityIntegrations_Set_Input>;
  where: IdentityIntegrations_Bool_Exp;
};

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
  /** An array relationship */
  MeemContractIntegrations: Array<MeemContractIntegrations>;
  /** An aggregate relationship */
  MeemContractIntegrations_aggregate: MeemContractIntegrations_Aggregate;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description: Scalars['String'];
  guideUrl: Scalars['String'];
  icon: Scalars['String'];
  id: Scalars['uuid'];
  name: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "Integrations" */
export type IntegrationsMeemContractIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


/** columns and relationships of "Integrations" */
export type IntegrationsMeemContractIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};

/** aggregated selection of "Integrations" */
export type Integrations_Aggregate = {
  __typename?: 'Integrations_aggregate';
  aggregate?: Maybe<Integrations_Aggregate_Fields>;
  nodes: Array<Integrations>;
};

/** aggregate fields of "Integrations" */
export type Integrations_Aggregate_Fields = {
  __typename?: 'Integrations_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Integrations_Max_Fields>;
  min?: Maybe<Integrations_Min_Fields>;
};


/** aggregate fields of "Integrations" */
export type Integrations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Integrations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "Integrations". All fields are combined with a logical 'AND'. */
export type Integrations_Bool_Exp = {
  MeemContractIntegrations?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
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

/** unique or primary key constraints on table "Integrations" */
export enum Integrations_Constraint {
  /** unique or primary key constraint on columns "id" */
  IntegrationsPkey = 'Integrations_pkey'
}

/** input type for inserting data into table "Integrations" */
export type Integrations_Insert_Input = {
  MeemContractIntegrations?: InputMaybe<MeemContractIntegrations_Arr_Rel_Insert_Input>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  guideUrl?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Integrations_Max_Fields = {
  __typename?: 'Integrations_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  guideUrl?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Integrations_Min_Fields = {
  __typename?: 'Integrations_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  guideUrl?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "Integrations" */
export type Integrations_Mutation_Response = {
  __typename?: 'Integrations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Integrations>;
};

/** input type for inserting object relation for remote table "Integrations" */
export type Integrations_Obj_Rel_Insert_Input = {
  data: Integrations_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Integrations_On_Conflict>;
};

/** on_conflict condition type for table "Integrations" */
export type Integrations_On_Conflict = {
  constraint: Integrations_Constraint;
  update_columns?: Array<Integrations_Update_Column>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};

/** Ordering options when selecting data from "Integrations". */
export type Integrations_Order_By = {
  MeemContractIntegrations_aggregate?: InputMaybe<MeemContractIntegrations_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  guideUrl?: InputMaybe<Order_By>;
  icon?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: Integrations */
export type Integrations_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "Integrations" */
export type Integrations_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  guideUrl?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "Integrations" */
export type Integrations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Integrations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Integrations_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  guideUrl?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "Integrations" */
export enum Integrations_Update_Column {
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

export type Integrations_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Integrations_Set_Input>;
  where: Integrations_Bool_Exp;
};

/** columns and relationships of "MeemContractGuilds" */
export type MeemContractGuilds = {
  __typename?: 'MeemContractGuilds';
  /** An object relationship */
  MeemContract?: Maybe<MeemContracts>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  MeemContractRoles: Array<MeemContractRoles>;
  /** An aggregate relationship */
  MeemContractRoles_aggregate: MeemContractRoles_Aggregate;
  createdAt: Scalars['timestamptz'];
  guildId: Scalars['Int'];
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "MeemContractGuilds" */
export type MeemContractGuildsMeemContractRolesArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRoles_Order_By>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};


/** columns and relationships of "MeemContractGuilds" */
export type MeemContractGuildsMeemContractRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRoles_Order_By>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};

/** aggregated selection of "MeemContractGuilds" */
export type MeemContractGuilds_Aggregate = {
  __typename?: 'MeemContractGuilds_aggregate';
  aggregate?: Maybe<MeemContractGuilds_Aggregate_Fields>;
  nodes: Array<MeemContractGuilds>;
};

/** aggregate fields of "MeemContractGuilds" */
export type MeemContractGuilds_Aggregate_Fields = {
  __typename?: 'MeemContractGuilds_aggregate_fields';
  avg?: Maybe<MeemContractGuilds_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<MeemContractGuilds_Max_Fields>;
  min?: Maybe<MeemContractGuilds_Min_Fields>;
  stddev?: Maybe<MeemContractGuilds_Stddev_Fields>;
  stddev_pop?: Maybe<MeemContractGuilds_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<MeemContractGuilds_Stddev_Samp_Fields>;
  sum?: Maybe<MeemContractGuilds_Sum_Fields>;
  var_pop?: Maybe<MeemContractGuilds_Var_Pop_Fields>;
  var_samp?: Maybe<MeemContractGuilds_Var_Samp_Fields>;
  variance?: Maybe<MeemContractGuilds_Variance_Fields>;
};


/** aggregate fields of "MeemContractGuilds" */
export type MeemContractGuilds_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemContractGuilds_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemContractGuilds" */
export type MeemContractGuilds_Aggregate_Order_By = {
  avg?: InputMaybe<MeemContractGuilds_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemContractGuilds_Max_Order_By>;
  min?: InputMaybe<MeemContractGuilds_Min_Order_By>;
  stddev?: InputMaybe<MeemContractGuilds_Stddev_Order_By>;
  stddev_pop?: InputMaybe<MeemContractGuilds_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<MeemContractGuilds_Stddev_Samp_Order_By>;
  sum?: InputMaybe<MeemContractGuilds_Sum_Order_By>;
  var_pop?: InputMaybe<MeemContractGuilds_Var_Pop_Order_By>;
  var_samp?: InputMaybe<MeemContractGuilds_Var_Samp_Order_By>;
  variance?: InputMaybe<MeemContractGuilds_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "MeemContractGuilds" */
export type MeemContractGuilds_Arr_Rel_Insert_Input = {
  data: Array<MeemContractGuilds_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContractGuilds_On_Conflict>;
};

/** aggregate avg on columns */
export type MeemContractGuilds_Avg_Fields = {
  __typename?: 'MeemContractGuilds_avg_fields';
  guildId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Avg_Order_By = {
  guildId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "MeemContractGuilds". All fields are combined with a logical 'AND'. */
export type MeemContractGuilds_Bool_Exp = {
  MeemContract?: InputMaybe<MeemContracts_Bool_Exp>;
  MeemContractId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemContractRoles?: InputMaybe<MeemContractRoles_Bool_Exp>;
  _and?: InputMaybe<Array<MeemContractGuilds_Bool_Exp>>;
  _not?: InputMaybe<MeemContractGuilds_Bool_Exp>;
  _or?: InputMaybe<Array<MeemContractGuilds_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  guildId?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "MeemContractGuilds" */
export enum MeemContractGuilds_Constraint {
  /** unique or primary key constraint on columns "id" */
  MeemContractGuildsPkey = 'MeemContractGuilds_pkey'
}

/** input type for incrementing numeric columns in table "MeemContractGuilds" */
export type MeemContractGuilds_Inc_Input = {
  guildId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "MeemContractGuilds" */
export type MeemContractGuilds_Insert_Input = {
  MeemContract?: InputMaybe<MeemContracts_Obj_Rel_Insert_Input>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  MeemContractRoles?: InputMaybe<MeemContractRoles_Arr_Rel_Insert_Input>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  guildId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type MeemContractGuilds_Max_Fields = {
  __typename?: 'MeemContractGuilds_max_fields';
  MeemContractId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  guildId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Max_Order_By = {
  MeemContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  guildId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type MeemContractGuilds_Min_Fields = {
  __typename?: 'MeemContractGuilds_min_fields';
  MeemContractId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  guildId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Min_Order_By = {
  MeemContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  guildId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "MeemContractGuilds" */
export type MeemContractGuilds_Mutation_Response = {
  __typename?: 'MeemContractGuilds_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemContractGuilds>;
};

/** input type for inserting object relation for remote table "MeemContractGuilds" */
export type MeemContractGuilds_Obj_Rel_Insert_Input = {
  data: MeemContractGuilds_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContractGuilds_On_Conflict>;
};

/** on_conflict condition type for table "MeemContractGuilds" */
export type MeemContractGuilds_On_Conflict = {
  constraint: MeemContractGuilds_Constraint;
  update_columns?: Array<MeemContractGuilds_Update_Column>;
  where?: InputMaybe<MeemContractGuilds_Bool_Exp>;
};

/** Ordering options when selecting data from "MeemContractGuilds". */
export type MeemContractGuilds_Order_By = {
  MeemContract?: InputMaybe<MeemContracts_Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  MeemContractRoles_aggregate?: InputMaybe<MeemContractRoles_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  guildId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: MeemContractGuilds */
export type MeemContractGuilds_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "MeemContractGuilds" */
export enum MeemContractGuilds_Select_Column {
  /** column name */
  MeemContractId = 'MeemContractId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  GuildId = 'guildId',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "MeemContractGuilds" */
export type MeemContractGuilds_Set_Input = {
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  guildId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type MeemContractGuilds_Stddev_Fields = {
  __typename?: 'MeemContractGuilds_stddev_fields';
  guildId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Stddev_Order_By = {
  guildId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type MeemContractGuilds_Stddev_Pop_Fields = {
  __typename?: 'MeemContractGuilds_stddev_pop_fields';
  guildId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Stddev_Pop_Order_By = {
  guildId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type MeemContractGuilds_Stddev_Samp_Fields = {
  __typename?: 'MeemContractGuilds_stddev_samp_fields';
  guildId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Stddev_Samp_Order_By = {
  guildId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "MeemContractGuilds" */
export type MeemContractGuilds_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemContractGuilds_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemContractGuilds_Stream_Cursor_Value_Input = {
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  guildId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type MeemContractGuilds_Sum_Fields = {
  __typename?: 'MeemContractGuilds_sum_fields';
  guildId?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Sum_Order_By = {
  guildId?: InputMaybe<Order_By>;
};

/** update columns of table "MeemContractGuilds" */
export enum MeemContractGuilds_Update_Column {
  /** column name */
  MeemContractId = 'MeemContractId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  GuildId = 'guildId',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type MeemContractGuilds_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<MeemContractGuilds_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemContractGuilds_Set_Input>;
  where: MeemContractGuilds_Bool_Exp;
};

/** aggregate var_pop on columns */
export type MeemContractGuilds_Var_Pop_Fields = {
  __typename?: 'MeemContractGuilds_var_pop_fields';
  guildId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Var_Pop_Order_By = {
  guildId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type MeemContractGuilds_Var_Samp_Fields = {
  __typename?: 'MeemContractGuilds_var_samp_fields';
  guildId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Var_Samp_Order_By = {
  guildId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type MeemContractGuilds_Variance_Fields = {
  __typename?: 'MeemContractGuilds_variance_fields';
  guildId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "MeemContractGuilds" */
export type MeemContractGuilds_Variance_Order_By = {
  guildId?: InputMaybe<Order_By>;
};

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

/** aggregated selection of "MeemContractIntegrations" */
export type MeemContractIntegrations_Aggregate = {
  __typename?: 'MeemContractIntegrations_aggregate';
  aggregate?: Maybe<MeemContractIntegrations_Aggregate_Fields>;
  nodes: Array<MeemContractIntegrations>;
};

/** aggregate fields of "MeemContractIntegrations" */
export type MeemContractIntegrations_Aggregate_Fields = {
  __typename?: 'MeemContractIntegrations_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<MeemContractIntegrations_Max_Fields>;
  min?: Maybe<MeemContractIntegrations_Min_Fields>;
};


/** aggregate fields of "MeemContractIntegrations" */
export type MeemContractIntegrations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemContractIntegrations" */
export type MeemContractIntegrations_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemContractIntegrations_Max_Order_By>;
  min?: InputMaybe<MeemContractIntegrations_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type MeemContractIntegrations_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "MeemContractIntegrations" */
export type MeemContractIntegrations_Arr_Rel_Insert_Input = {
  data: Array<MeemContractIntegrations_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContractIntegrations_On_Conflict>;
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

/** unique or primary key constraints on table "MeemContractIntegrations" */
export enum MeemContractIntegrations_Constraint {
  /** unique or primary key constraint on columns "MeemContractId", "IntegrationId" */
  MeemContractIntegrationsMeemContractIdIntegrationIdKey = 'MeemContractIntegrations_MeemContractId_IntegrationId_key',
  /** unique or primary key constraint on columns "id" */
  MeemContractIntegrationsPkey = 'MeemContractIntegrations_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type MeemContractIntegrations_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type MeemContractIntegrations_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type MeemContractIntegrations_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "MeemContractIntegrations" */
export type MeemContractIntegrations_Insert_Input = {
  Integration?: InputMaybe<Integrations_Obj_Rel_Insert_Input>;
  IntegrationId?: InputMaybe<Scalars['uuid']>;
  MeemContract?: InputMaybe<MeemContracts_Obj_Rel_Insert_Input>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type MeemContractIntegrations_Max_Fields = {
  __typename?: 'MeemContractIntegrations_max_fields';
  IntegrationId?: Maybe<Scalars['uuid']>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
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

/** aggregate min on columns */
export type MeemContractIntegrations_Min_Fields = {
  __typename?: 'MeemContractIntegrations_min_fields';
  IntegrationId?: Maybe<Scalars['uuid']>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "MeemContractIntegrations" */
export type MeemContractIntegrations_Mutation_Response = {
  __typename?: 'MeemContractIntegrations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemContractIntegrations>;
};

/** on_conflict condition type for table "MeemContractIntegrations" */
export type MeemContractIntegrations_On_Conflict = {
  constraint: MeemContractIntegrations_Constraint;
  update_columns?: Array<MeemContractIntegrations_Update_Column>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
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

/** primary key columns input for table: MeemContractIntegrations */
export type MeemContractIntegrations_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type MeemContractIntegrations_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
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

/** input type for updating data in table "MeemContractIntegrations" */
export type MeemContractIntegrations_Set_Input = {
  IntegrationId?: InputMaybe<Scalars['uuid']>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "MeemContractIntegrations" */
export type MeemContractIntegrations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemContractIntegrations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemContractIntegrations_Stream_Cursor_Value_Input = {
  IntegrationId?: InputMaybe<Scalars['uuid']>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "MeemContractIntegrations" */
export enum MeemContractIntegrations_Update_Column {
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

export type MeemContractIntegrations_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<MeemContractIntegrations_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<MeemContractIntegrations_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<MeemContractIntegrations_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<MeemContractIntegrations_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<MeemContractIntegrations_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemContractIntegrations_Set_Input>;
  where: MeemContractIntegrations_Bool_Exp;
};

/** columns and relationships of "MeemContractRolePermissions" */
export type MeemContractRolePermissions = {
  __typename?: 'MeemContractRolePermissions';
  /** An object relationship */
  MeemContractRole?: Maybe<MeemContractRoles>;
  MeemContractRoleId?: Maybe<Scalars['uuid']>;
  RolePermissionId?: Maybe<Scalars['String']>;
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Aggregate = {
  __typename?: 'MeemContractRolePermissions_aggregate';
  aggregate?: Maybe<MeemContractRolePermissions_Aggregate_Fields>;
  nodes: Array<MeemContractRolePermissions>;
};

/** aggregate fields of "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Aggregate_Fields = {
  __typename?: 'MeemContractRolePermissions_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<MeemContractRolePermissions_Max_Fields>;
  min?: Maybe<MeemContractRolePermissions_Min_Fields>;
};


/** aggregate fields of "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemContractRolePermissions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemContractRolePermissions_Max_Order_By>;
  min?: InputMaybe<MeemContractRolePermissions_Min_Order_By>;
};

/** input type for inserting array relation for remote table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Arr_Rel_Insert_Input = {
  data: Array<MeemContractRolePermissions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContractRolePermissions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "MeemContractRolePermissions". All fields are combined with a logical 'AND'. */
export type MeemContractRolePermissions_Bool_Exp = {
  MeemContractRole?: InputMaybe<MeemContractRoles_Bool_Exp>;
  MeemContractRoleId?: InputMaybe<Uuid_Comparison_Exp>;
  RolePermissionId?: InputMaybe<String_Comparison_Exp>;
  _and?: InputMaybe<Array<MeemContractRolePermissions_Bool_Exp>>;
  _not?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
  _or?: InputMaybe<Array<MeemContractRolePermissions_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "MeemContractRolePermissions" */
export enum MeemContractRolePermissions_Constraint {
  /** unique or primary key constraint on columns "MeemContractRoleId", "RolePermissionId" */
  MeemContractRolePermissionsMeemContractRoleIdRolePermissiKey = 'MeemContractRolePermissions_MeemContractRoleId_RolePermissi_key',
  /** unique or primary key constraint on columns "id" */
  MeemContractRolePermissionsPkey = 'MeemContractRolePermissions_pkey'
}

/** input type for inserting data into table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Insert_Input = {
  MeemContractRole?: InputMaybe<MeemContractRoles_Obj_Rel_Insert_Input>;
  MeemContractRoleId?: InputMaybe<Scalars['uuid']>;
  RolePermissionId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type MeemContractRolePermissions_Max_Fields = {
  __typename?: 'MeemContractRolePermissions_max_fields';
  MeemContractRoleId?: Maybe<Scalars['uuid']>;
  RolePermissionId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Max_Order_By = {
  MeemContractRoleId?: InputMaybe<Order_By>;
  RolePermissionId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type MeemContractRolePermissions_Min_Fields = {
  __typename?: 'MeemContractRolePermissions_min_fields';
  MeemContractRoleId?: Maybe<Scalars['uuid']>;
  RolePermissionId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Min_Order_By = {
  MeemContractRoleId?: InputMaybe<Order_By>;
  RolePermissionId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Mutation_Response = {
  __typename?: 'MeemContractRolePermissions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemContractRolePermissions>;
};

/** on_conflict condition type for table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_On_Conflict = {
  constraint: MeemContractRolePermissions_Constraint;
  update_columns?: Array<MeemContractRolePermissions_Update_Column>;
  where?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
};

/** Ordering options when selecting data from "MeemContractRolePermissions". */
export type MeemContractRolePermissions_Order_By = {
  MeemContractRole?: InputMaybe<MeemContractRoles_Order_By>;
  MeemContractRoleId?: InputMaybe<Order_By>;
  RolePermissionId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: MeemContractRolePermissions */
export type MeemContractRolePermissions_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "MeemContractRolePermissions" */
export enum MeemContractRolePermissions_Select_Column {
  /** column name */
  MeemContractRoleId = 'MeemContractRoleId',
  /** column name */
  RolePermissionId = 'RolePermissionId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Set_Input = {
  MeemContractRoleId?: InputMaybe<Scalars['uuid']>;
  RolePermissionId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "MeemContractRolePermissions" */
export type MeemContractRolePermissions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemContractRolePermissions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemContractRolePermissions_Stream_Cursor_Value_Input = {
  MeemContractRoleId?: InputMaybe<Scalars['uuid']>;
  RolePermissionId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "MeemContractRolePermissions" */
export enum MeemContractRolePermissions_Update_Column {
  /** column name */
  MeemContractRoleId = 'MeemContractRoleId',
  /** column name */
  RolePermissionId = 'RolePermissionId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type MeemContractRolePermissions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemContractRolePermissions_Set_Input>;
  where: MeemContractRolePermissions_Bool_Exp;
};

/** columns and relationships of "MeemContractRoles" */
export type MeemContractRoles = {
  __typename?: 'MeemContractRoles';
  /** An object relationship */
  MeemContract?: Maybe<MeemContracts>;
  /** An object relationship */
  MeemContractGuild?: Maybe<MeemContractGuilds>;
  MeemContractGuildId?: Maybe<Scalars['uuid']>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  MeemContractRolePermissions: Array<MeemContractRolePermissions>;
  /** An aggregate relationship */
  MeemContractRolePermissions_aggregate: MeemContractRolePermissions_Aggregate;
  createdAt: Scalars['timestamptz'];
  description: Scalars['String'];
  guildRoleId?: Maybe<Scalars['Int']>;
  id: Scalars['uuid'];
  imageUrl: Scalars['String'];
  integrationsMetadata: Scalars['jsonb'];
  isAdminRole: Scalars['Boolean'];
  isDefaultRole: Scalars['Boolean'];
  name: Scalars['String'];
  tokenAddress?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "MeemContractRoles" */
export type MeemContractRolesMeemContractRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRolePermissions_Order_By>>;
  where?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
};


/** columns and relationships of "MeemContractRoles" */
export type MeemContractRolesMeemContractRolePermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRolePermissions_Order_By>>;
  where?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
};


/** columns and relationships of "MeemContractRoles" */
export type MeemContractRolesIntegrationsMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "MeemContractRoles" */
export type MeemContractRoles_Aggregate = {
  __typename?: 'MeemContractRoles_aggregate';
  aggregate?: Maybe<MeemContractRoles_Aggregate_Fields>;
  nodes: Array<MeemContractRoles>;
};

/** aggregate fields of "MeemContractRoles" */
export type MeemContractRoles_Aggregate_Fields = {
  __typename?: 'MeemContractRoles_aggregate_fields';
  avg?: Maybe<MeemContractRoles_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<MeemContractRoles_Max_Fields>;
  min?: Maybe<MeemContractRoles_Min_Fields>;
  stddev?: Maybe<MeemContractRoles_Stddev_Fields>;
  stddev_pop?: Maybe<MeemContractRoles_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<MeemContractRoles_Stddev_Samp_Fields>;
  sum?: Maybe<MeemContractRoles_Sum_Fields>;
  var_pop?: Maybe<MeemContractRoles_Var_Pop_Fields>;
  var_samp?: Maybe<MeemContractRoles_Var_Samp_Fields>;
  variance?: Maybe<MeemContractRoles_Variance_Fields>;
};


/** aggregate fields of "MeemContractRoles" */
export type MeemContractRoles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemContractRoles" */
export type MeemContractRoles_Aggregate_Order_By = {
  avg?: InputMaybe<MeemContractRoles_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemContractRoles_Max_Order_By>;
  min?: InputMaybe<MeemContractRoles_Min_Order_By>;
  stddev?: InputMaybe<MeemContractRoles_Stddev_Order_By>;
  stddev_pop?: InputMaybe<MeemContractRoles_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<MeemContractRoles_Stddev_Samp_Order_By>;
  sum?: InputMaybe<MeemContractRoles_Sum_Order_By>;
  var_pop?: InputMaybe<MeemContractRoles_Var_Pop_Order_By>;
  var_samp?: InputMaybe<MeemContractRoles_Var_Samp_Order_By>;
  variance?: InputMaybe<MeemContractRoles_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type MeemContractRoles_Append_Input = {
  integrationsMetadata?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "MeemContractRoles" */
export type MeemContractRoles_Arr_Rel_Insert_Input = {
  data: Array<MeemContractRoles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContractRoles_On_Conflict>;
};

/** aggregate avg on columns */
export type MeemContractRoles_Avg_Fields = {
  __typename?: 'MeemContractRoles_avg_fields';
  guildRoleId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Avg_Order_By = {
  guildRoleId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "MeemContractRoles". All fields are combined with a logical 'AND'. */
export type MeemContractRoles_Bool_Exp = {
  MeemContract?: InputMaybe<MeemContracts_Bool_Exp>;
  MeemContractGuild?: InputMaybe<MeemContractGuilds_Bool_Exp>;
  MeemContractGuildId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemContractId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemContractRolePermissions?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
  _and?: InputMaybe<Array<MeemContractRoles_Bool_Exp>>;
  _not?: InputMaybe<MeemContractRoles_Bool_Exp>;
  _or?: InputMaybe<Array<MeemContractRoles_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  guildRoleId?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  imageUrl?: InputMaybe<String_Comparison_Exp>;
  integrationsMetadata?: InputMaybe<Jsonb_Comparison_Exp>;
  isAdminRole?: InputMaybe<Boolean_Comparison_Exp>;
  isDefaultRole?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "MeemContractRoles" */
export enum MeemContractRoles_Constraint {
  /** unique or primary key constraint on columns "id" */
  MeemContractRolesPkey = 'MeemContractRoles_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type MeemContractRoles_Delete_At_Path_Input = {
  integrationsMetadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type MeemContractRoles_Delete_Elem_Input = {
  integrationsMetadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type MeemContractRoles_Delete_Key_Input = {
  integrationsMetadata?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "MeemContractRoles" */
export type MeemContractRoles_Inc_Input = {
  guildRoleId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "MeemContractRoles" */
export type MeemContractRoles_Insert_Input = {
  MeemContract?: InputMaybe<MeemContracts_Obj_Rel_Insert_Input>;
  MeemContractGuild?: InputMaybe<MeemContractGuilds_Obj_Rel_Insert_Input>;
  MeemContractGuildId?: InputMaybe<Scalars['uuid']>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  MeemContractRolePermissions?: InputMaybe<MeemContractRolePermissions_Arr_Rel_Insert_Input>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  guildRoleId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  integrationsMetadata?: InputMaybe<Scalars['jsonb']>;
  isAdminRole?: InputMaybe<Scalars['Boolean']>;
  isDefaultRole?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  tokenAddress?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type MeemContractRoles_Max_Fields = {
  __typename?: 'MeemContractRoles_max_fields';
  MeemContractGuildId?: Maybe<Scalars['uuid']>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  guildRoleId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  tokenAddress?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Max_Order_By = {
  MeemContractGuildId?: InputMaybe<Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  guildRoleId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  imageUrl?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type MeemContractRoles_Min_Fields = {
  __typename?: 'MeemContractRoles_min_fields';
  MeemContractGuildId?: Maybe<Scalars['uuid']>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  guildRoleId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  tokenAddress?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Min_Order_By = {
  MeemContractGuildId?: InputMaybe<Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  guildRoleId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  imageUrl?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "MeemContractRoles" */
export type MeemContractRoles_Mutation_Response = {
  __typename?: 'MeemContractRoles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemContractRoles>;
};

/** input type for inserting object relation for remote table "MeemContractRoles" */
export type MeemContractRoles_Obj_Rel_Insert_Input = {
  data: MeemContractRoles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContractRoles_On_Conflict>;
};

/** on_conflict condition type for table "MeemContractRoles" */
export type MeemContractRoles_On_Conflict = {
  constraint: MeemContractRoles_Constraint;
  update_columns?: Array<MeemContractRoles_Update_Column>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "MeemContractRoles". */
export type MeemContractRoles_Order_By = {
  MeemContract?: InputMaybe<MeemContracts_Order_By>;
  MeemContractGuild?: InputMaybe<MeemContractGuilds_Order_By>;
  MeemContractGuildId?: InputMaybe<Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  MeemContractRolePermissions_aggregate?: InputMaybe<MeemContractRolePermissions_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  guildRoleId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  imageUrl?: InputMaybe<Order_By>;
  integrationsMetadata?: InputMaybe<Order_By>;
  isAdminRole?: InputMaybe<Order_By>;
  isDefaultRole?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: MeemContractRoles */
export type MeemContractRoles_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type MeemContractRoles_Prepend_Input = {
  integrationsMetadata?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "MeemContractRoles" */
export enum MeemContractRoles_Select_Column {
  /** column name */
  MeemContractGuildId = 'MeemContractGuildId',
  /** column name */
  MeemContractId = 'MeemContractId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  GuildRoleId = 'guildRoleId',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'imageUrl',
  /** column name */
  IntegrationsMetadata = 'integrationsMetadata',
  /** column name */
  IsAdminRole = 'isAdminRole',
  /** column name */
  IsDefaultRole = 'isDefaultRole',
  /** column name */
  Name = 'name',
  /** column name */
  TokenAddress = 'tokenAddress',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "MeemContractRoles" */
export type MeemContractRoles_Set_Input = {
  MeemContractGuildId?: InputMaybe<Scalars['uuid']>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  guildRoleId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  integrationsMetadata?: InputMaybe<Scalars['jsonb']>;
  isAdminRole?: InputMaybe<Scalars['Boolean']>;
  isDefaultRole?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  tokenAddress?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type MeemContractRoles_Stddev_Fields = {
  __typename?: 'MeemContractRoles_stddev_fields';
  guildRoleId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Stddev_Order_By = {
  guildRoleId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type MeemContractRoles_Stddev_Pop_Fields = {
  __typename?: 'MeemContractRoles_stddev_pop_fields';
  guildRoleId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Stddev_Pop_Order_By = {
  guildRoleId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type MeemContractRoles_Stddev_Samp_Fields = {
  __typename?: 'MeemContractRoles_stddev_samp_fields';
  guildRoleId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Stddev_Samp_Order_By = {
  guildRoleId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "MeemContractRoles" */
export type MeemContractRoles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemContractRoles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemContractRoles_Stream_Cursor_Value_Input = {
  MeemContractGuildId?: InputMaybe<Scalars['uuid']>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  guildRoleId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  integrationsMetadata?: InputMaybe<Scalars['jsonb']>;
  isAdminRole?: InputMaybe<Scalars['Boolean']>;
  isDefaultRole?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  tokenAddress?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type MeemContractRoles_Sum_Fields = {
  __typename?: 'MeemContractRoles_sum_fields';
  guildRoleId?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Sum_Order_By = {
  guildRoleId?: InputMaybe<Order_By>;
};

/** update columns of table "MeemContractRoles" */
export enum MeemContractRoles_Update_Column {
  /** column name */
  MeemContractGuildId = 'MeemContractGuildId',
  /** column name */
  MeemContractId = 'MeemContractId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  GuildRoleId = 'guildRoleId',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'imageUrl',
  /** column name */
  IntegrationsMetadata = 'integrationsMetadata',
  /** column name */
  IsAdminRole = 'isAdminRole',
  /** column name */
  IsDefaultRole = 'isDefaultRole',
  /** column name */
  Name = 'name',
  /** column name */
  TokenAddress = 'tokenAddress',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type MeemContractRoles_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<MeemContractRoles_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<MeemContractRoles_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<MeemContractRoles_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<MeemContractRoles_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<MeemContractRoles_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<MeemContractRoles_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemContractRoles_Set_Input>;
  where: MeemContractRoles_Bool_Exp;
};

/** aggregate var_pop on columns */
export type MeemContractRoles_Var_Pop_Fields = {
  __typename?: 'MeemContractRoles_var_pop_fields';
  guildRoleId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Var_Pop_Order_By = {
  guildRoleId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type MeemContractRoles_Var_Samp_Fields = {
  __typename?: 'MeemContractRoles_var_samp_fields';
  guildRoleId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Var_Samp_Order_By = {
  guildRoleId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type MeemContractRoles_Variance_Fields = {
  __typename?: 'MeemContractRoles_variance_fields';
  guildRoleId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "MeemContractRoles" */
export type MeemContractRoles_Variance_Order_By = {
  guildRoleId?: InputMaybe<Order_By>;
};

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

/** aggregated selection of "MeemContractWallets" */
export type MeemContractWallets_Aggregate = {
  __typename?: 'MeemContractWallets_aggregate';
  aggregate?: Maybe<MeemContractWallets_Aggregate_Fields>;
  nodes: Array<MeemContractWallets>;
};

/** aggregate fields of "MeemContractWallets" */
export type MeemContractWallets_Aggregate_Fields = {
  __typename?: 'MeemContractWallets_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<MeemContractWallets_Max_Fields>;
  min?: Maybe<MeemContractWallets_Min_Fields>;
};


/** aggregate fields of "MeemContractWallets" */
export type MeemContractWallets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemContractWallets" */
export type MeemContractWallets_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemContractWallets_Max_Order_By>;
  min?: InputMaybe<MeemContractWallets_Min_Order_By>;
};

/** input type for inserting array relation for remote table "MeemContractWallets" */
export type MeemContractWallets_Arr_Rel_Insert_Input = {
  data: Array<MeemContractWallets_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContractWallets_On_Conflict>;
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

/** unique or primary key constraints on table "MeemContractWallets" */
export enum MeemContractWallets_Constraint {
  /** unique or primary key constraint on columns "MeemContractId", "WalletId" */
  MeemContractWalletsMeemContractIdWalletIdKey = 'MeemContractWallets_MeemContractId_WalletId_key',
  /** unique or primary key constraint on columns "id" */
  MeemContractWalletsPkey = 'MeemContractWallets_pkey'
}

/** input type for inserting data into table "MeemContractWallets" */
export type MeemContractWallets_Insert_Input = {
  MeemContract?: InputMaybe<MeemContracts_Obj_Rel_Insert_Input>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  Wallet?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type MeemContractWallets_Max_Fields = {
  __typename?: 'MeemContractWallets_max_fields';
  MeemContractId?: Maybe<Scalars['uuid']>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  role?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
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

/** aggregate min on columns */
export type MeemContractWallets_Min_Fields = {
  __typename?: 'MeemContractWallets_min_fields';
  MeemContractId?: Maybe<Scalars['uuid']>;
  WalletId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  role?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "MeemContractWallets" */
export type MeemContractWallets_Mutation_Response = {
  __typename?: 'MeemContractWallets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemContractWallets>;
};

/** on_conflict condition type for table "MeemContractWallets" */
export type MeemContractWallets_On_Conflict = {
  constraint: MeemContractWallets_Constraint;
  update_columns?: Array<MeemContractWallets_Update_Column>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
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

/** primary key columns input for table: MeemContractWallets */
export type MeemContractWallets_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "MeemContractWallets" */
export type MeemContractWallets_Set_Input = {
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "MeemContractWallets" */
export type MeemContractWallets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemContractWallets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemContractWallets_Stream_Cursor_Value_Input = {
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "MeemContractWallets" */
export enum MeemContractWallets_Update_Column {
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

export type MeemContractWallets_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemContractWallets_Set_Input>;
  where: MeemContractWallets_Bool_Exp;
};

/** columns and relationships of "MeemContracts" */
export type MeemContracts = {
  __typename?: 'MeemContracts';
  /** An array relationship */
  MeemContractGuilds: Array<MeemContractGuilds>;
  /** An aggregate relationship */
  MeemContractGuilds_aggregate: MeemContractGuilds_Aggregate;
  /** An array relationship */
  MeemContractIntegrations: Array<MeemContractIntegrations>;
  /** An aggregate relationship */
  MeemContractIntegrations_aggregate: MeemContractIntegrations_Aggregate;
  /** An array relationship */
  MeemContractRoles: Array<MeemContractRoles>;
  /** An aggregate relationship */
  MeemContractRoles_aggregate: MeemContractRoles_Aggregate;
  /** An array relationship */
  MeemContractWallets: Array<MeemContractWallets>;
  /** An aggregate relationship */
  MeemContractWallets_aggregate: MeemContractWallets_Aggregate;
  /** An array relationship */
  Meems: Array<Meems>;
  /** An aggregate relationship */
  Meems_aggregate: Meems_Aggregate;
  /** An object relationship */
  Owner?: Maybe<Wallets>;
  OwnerId?: Maybe<Scalars['uuid']>;
  address: Scalars['String'];
  adminContractAddress?: Maybe<Scalars['String']>;
  chainId: Scalars['Int'];
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
  ownerFetchedAt?: Maybe<Scalars['timestamptz']>;
  slug: Scalars['String'];
  splits: Scalars['jsonb'];
  symbol: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMeemContractGuildsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractGuilds_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractGuilds_Order_By>>;
  where?: InputMaybe<MeemContractGuilds_Bool_Exp>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMeemContractGuilds_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractGuilds_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractGuilds_Order_By>>;
  where?: InputMaybe<MeemContractGuilds_Bool_Exp>;
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
export type MeemContractsMeemContractIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMeemContractRolesArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRoles_Order_By>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};


/** columns and relationships of "MeemContracts" */
export type MeemContractsMeemContractRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRoles_Order_By>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
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
export type MeemContractsMeemContractWallets_AggregateArgs = {
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
  avg?: Maybe<MeemContracts_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<MeemContracts_Max_Fields>;
  min?: Maybe<MeemContracts_Min_Fields>;
  stddev?: Maybe<MeemContracts_Stddev_Fields>;
  stddev_pop?: Maybe<MeemContracts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<MeemContracts_Stddev_Samp_Fields>;
  sum?: Maybe<MeemContracts_Sum_Fields>;
  var_pop?: Maybe<MeemContracts_Var_Pop_Fields>;
  var_samp?: Maybe<MeemContracts_Var_Samp_Fields>;
  variance?: Maybe<MeemContracts_Variance_Fields>;
};


/** aggregate fields of "MeemContracts" */
export type MeemContracts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<MeemContracts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "MeemContracts" */
export type MeemContracts_Aggregate_Order_By = {
  avg?: InputMaybe<MeemContracts_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<MeemContracts_Max_Order_By>;
  min?: InputMaybe<MeemContracts_Min_Order_By>;
  stddev?: InputMaybe<MeemContracts_Stddev_Order_By>;
  stddev_pop?: InputMaybe<MeemContracts_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<MeemContracts_Stddev_Samp_Order_By>;
  sum?: InputMaybe<MeemContracts_Sum_Order_By>;
  var_pop?: InputMaybe<MeemContracts_Var_Pop_Order_By>;
  var_samp?: InputMaybe<MeemContracts_Var_Samp_Order_By>;
  variance?: InputMaybe<MeemContracts_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type MeemContracts_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
  mintPermissions?: InputMaybe<Scalars['jsonb']>;
  splits?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "MeemContracts" */
export type MeemContracts_Arr_Rel_Insert_Input = {
  data: Array<MeemContracts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContracts_On_Conflict>;
};

/** aggregate avg on columns */
export type MeemContracts_Avg_Fields = {
  __typename?: 'MeemContracts_avg_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "MeemContracts" */
export type MeemContracts_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "MeemContracts". All fields are combined with a logical 'AND'. */
export type MeemContracts_Bool_Exp = {
  MeemContractGuilds?: InputMaybe<MeemContractGuilds_Bool_Exp>;
  MeemContractIntegrations?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
  MeemContractRoles?: InputMaybe<MeemContractRoles_Bool_Exp>;
  MeemContractWallets?: InputMaybe<MeemContractWallets_Bool_Exp>;
  Meems?: InputMaybe<Meems_Bool_Exp>;
  Owner?: InputMaybe<Wallets_Bool_Exp>;
  OwnerId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<MeemContracts_Bool_Exp>>;
  _not?: InputMaybe<MeemContracts_Bool_Exp>;
  _or?: InputMaybe<Array<MeemContracts_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  adminContractAddress?: InputMaybe<String_Comparison_Exp>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
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
  ownerFetchedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  splits?: InputMaybe<Jsonb_Comparison_Exp>;
  symbol?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "MeemContracts" */
export enum MeemContracts_Constraint {
  /** unique or primary key constraint on columns "id" */
  MeemContractsPkey = 'MeemContracts_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type MeemContracts_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']>>;
  mintPermissions?: InputMaybe<Array<Scalars['String']>>;
  splits?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type MeemContracts_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']>;
  mintPermissions?: InputMaybe<Scalars['Int']>;
  splits?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type MeemContracts_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']>;
  mintPermissions?: InputMaybe<Scalars['String']>;
  splits?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "MeemContracts" */
export type MeemContracts_Inc_Input = {
  chainId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "MeemContracts" */
export type MeemContracts_Insert_Input = {
  MeemContractGuilds?: InputMaybe<MeemContractGuilds_Arr_Rel_Insert_Input>;
  MeemContractIntegrations?: InputMaybe<MeemContractIntegrations_Arr_Rel_Insert_Input>;
  MeemContractRoles?: InputMaybe<MeemContractRoles_Arr_Rel_Insert_Input>;
  MeemContractWallets?: InputMaybe<MeemContractWallets_Arr_Rel_Insert_Input>;
  Meems?: InputMaybe<Meems_Arr_Rel_Insert_Input>;
  Owner?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  OwnerId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  adminContractAddress?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
  contractURI?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  ens?: InputMaybe<Scalars['String']>;
  ensFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  gnosisSafeAddress?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  isMaxSupplyLocked?: InputMaybe<Scalars['Boolean']>;
  isTransferrable?: InputMaybe<Scalars['Boolean']>;
  maxSupply?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  mintPermissions?: InputMaybe<Scalars['jsonb']>;
  name?: InputMaybe<Scalars['String']>;
  ownerFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  slug?: InputMaybe<Scalars['String']>;
  splits?: InputMaybe<Scalars['jsonb']>;
  symbol?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type MeemContracts_Max_Fields = {
  __typename?: 'MeemContracts_max_fields';
  OwnerId?: Maybe<Scalars['uuid']>;
  address?: Maybe<Scalars['String']>;
  adminContractAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['Int']>;
  contractURI?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  gnosisSafeAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  maxSupply?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ownerFetchedAt?: Maybe<Scalars['timestamptz']>;
  slug?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "MeemContracts" */
export type MeemContracts_Max_Order_By = {
  OwnerId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  adminContractAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  contractURI?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  ens?: InputMaybe<Order_By>;
  ensFetchedAt?: InputMaybe<Order_By>;
  gnosisSafeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  maxSupply?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ownerFetchedAt?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type MeemContracts_Min_Fields = {
  __typename?: 'MeemContracts_min_fields';
  OwnerId?: Maybe<Scalars['uuid']>;
  address?: Maybe<Scalars['String']>;
  adminContractAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['Int']>;
  contractURI?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  gnosisSafeAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  maxSupply?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ownerFetchedAt?: Maybe<Scalars['timestamptz']>;
  slug?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "MeemContracts" */
export type MeemContracts_Min_Order_By = {
  OwnerId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  adminContractAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  contractURI?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  ens?: InputMaybe<Order_By>;
  ensFetchedAt?: InputMaybe<Order_By>;
  gnosisSafeAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  maxSupply?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ownerFetchedAt?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "MeemContracts" */
export type MeemContracts_Mutation_Response = {
  __typename?: 'MeemContracts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemContracts>;
};

/** input type for inserting object relation for remote table "MeemContracts" */
export type MeemContracts_Obj_Rel_Insert_Input = {
  data: MeemContracts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemContracts_On_Conflict>;
};

/** on_conflict condition type for table "MeemContracts" */
export type MeemContracts_On_Conflict = {
  constraint: MeemContracts_Constraint;
  update_columns?: Array<MeemContracts_Update_Column>;
  where?: InputMaybe<MeemContracts_Bool_Exp>;
};

/** Ordering options when selecting data from "MeemContracts". */
export type MeemContracts_Order_By = {
  MeemContractGuilds_aggregate?: InputMaybe<MeemContractGuilds_Aggregate_Order_By>;
  MeemContractIntegrations_aggregate?: InputMaybe<MeemContractIntegrations_Aggregate_Order_By>;
  MeemContractRoles_aggregate?: InputMaybe<MeemContractRoles_Aggregate_Order_By>;
  MeemContractWallets_aggregate?: InputMaybe<MeemContractWallets_Aggregate_Order_By>;
  Meems_aggregate?: InputMaybe<Meems_Aggregate_Order_By>;
  Owner?: InputMaybe<Wallets_Order_By>;
  OwnerId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  adminContractAddress?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
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
  ownerFetchedAt?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  splits?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: MeemContracts */
export type MeemContracts_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type MeemContracts_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
  mintPermissions?: InputMaybe<Scalars['jsonb']>;
  splits?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "MeemContracts" */
export enum MeemContracts_Select_Column {
  /** column name */
  OwnerId = 'OwnerId',
  /** column name */
  Address = 'address',
  /** column name */
  AdminContractAddress = 'adminContractAddress',
  /** column name */
  ChainId = 'chainId',
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
  OwnerFetchedAt = 'ownerFetchedAt',
  /** column name */
  Slug = 'slug',
  /** column name */
  Splits = 'splits',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "MeemContracts" */
export type MeemContracts_Set_Input = {
  OwnerId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  adminContractAddress?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
  contractURI?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  ens?: InputMaybe<Scalars['String']>;
  ensFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  gnosisSafeAddress?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  isMaxSupplyLocked?: InputMaybe<Scalars['Boolean']>;
  isTransferrable?: InputMaybe<Scalars['Boolean']>;
  maxSupply?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  mintPermissions?: InputMaybe<Scalars['jsonb']>;
  name?: InputMaybe<Scalars['String']>;
  ownerFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  slug?: InputMaybe<Scalars['String']>;
  splits?: InputMaybe<Scalars['jsonb']>;
  symbol?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type MeemContracts_Stddev_Fields = {
  __typename?: 'MeemContracts_stddev_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "MeemContracts" */
export type MeemContracts_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type MeemContracts_Stddev_Pop_Fields = {
  __typename?: 'MeemContracts_stddev_pop_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "MeemContracts" */
export type MeemContracts_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type MeemContracts_Stddev_Samp_Fields = {
  __typename?: 'MeemContracts_stddev_samp_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "MeemContracts" */
export type MeemContracts_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "MeemContracts" */
export type MeemContracts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemContracts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemContracts_Stream_Cursor_Value_Input = {
  OwnerId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  adminContractAddress?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
  contractURI?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  ens?: InputMaybe<Scalars['String']>;
  ensFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  gnosisSafeAddress?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  isMaxSupplyLocked?: InputMaybe<Scalars['Boolean']>;
  isTransferrable?: InputMaybe<Scalars['Boolean']>;
  maxSupply?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  mintPermissions?: InputMaybe<Scalars['jsonb']>;
  name?: InputMaybe<Scalars['String']>;
  ownerFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  slug?: InputMaybe<Scalars['String']>;
  splits?: InputMaybe<Scalars['jsonb']>;
  symbol?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type MeemContracts_Sum_Fields = {
  __typename?: 'MeemContracts_sum_fields';
  chainId?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "MeemContracts" */
export type MeemContracts_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** update columns of table "MeemContracts" */
export enum MeemContracts_Update_Column {
  /** column name */
  OwnerId = 'OwnerId',
  /** column name */
  Address = 'address',
  /** column name */
  AdminContractAddress = 'adminContractAddress',
  /** column name */
  ChainId = 'chainId',
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
  OwnerFetchedAt = 'ownerFetchedAt',
  /** column name */
  Slug = 'slug',
  /** column name */
  Splits = 'splits',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type MeemContracts_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<MeemContracts_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<MeemContracts_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<MeemContracts_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<MeemContracts_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<MeemContracts_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<MeemContracts_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemContracts_Set_Input>;
  where: MeemContracts_Bool_Exp;
};

/** aggregate var_pop on columns */
export type MeemContracts_Var_Pop_Fields = {
  __typename?: 'MeemContracts_var_pop_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "MeemContracts" */
export type MeemContracts_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type MeemContracts_Var_Samp_Fields = {
  __typename?: 'MeemContracts_var_samp_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "MeemContracts" */
export type MeemContracts_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type MeemContracts_Variance_Fields = {
  __typename?: 'MeemContracts_variance_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "MeemContracts" */
export type MeemContracts_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** columns and relationships of "MeemIdentities" */
export type MeemIdentities = {
  __typename?: 'MeemIdentities';
  /** An object relationship */
  DefaultWallet?: Maybe<Wallets>;
  DefaultWalletId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  MeemIdentityIntegrations: Array<MeemIdentityIntegrations>;
  /** An aggregate relationship */
  MeemIdentityIntegrations_aggregate: MeemIdentityIntegrations_Aggregate;
  /** An array relationship */
  MeemIdentityWallets: Array<MeemIdentityWallets>;
  /** An aggregate relationship */
  MeemIdentityWallets_aggregate: MeemIdentityWallets_Aggregate;
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

/** input type for inserting array relation for remote table "MeemIdentities" */
export type MeemIdentities_Arr_Rel_Insert_Input = {
  data: Array<MeemIdentities_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemIdentities_On_Conflict>;
};

/** Boolean expression to filter rows from the table "MeemIdentities". All fields are combined with a logical 'AND'. */
export type MeemIdentities_Bool_Exp = {
  DefaultWallet?: InputMaybe<Wallets_Bool_Exp>;
  DefaultWalletId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemIdentityIntegrations?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
  MeemIdentityWallets?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
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

/** unique or primary key constraints on table "MeemIdentities" */
export enum MeemIdentities_Constraint {
  /** unique or primary key constraint on columns "id" */
  MeemIdentitiesPkey = 'MeemIdentities_pkey'
}

/** input type for inserting data into table "MeemIdentities" */
export type MeemIdentities_Insert_Input = {
  DefaultWallet?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  DefaultWalletId?: InputMaybe<Scalars['uuid']>;
  MeemIdentityIntegrations?: InputMaybe<MeemIdentityIntegrations_Arr_Rel_Insert_Input>;
  MeemIdentityWallets?: InputMaybe<MeemIdentityWallets_Arr_Rel_Insert_Input>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  displayName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  profilePicUrl?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "MeemIdentities" */
export type MeemIdentities_Mutation_Response = {
  __typename?: 'MeemIdentities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemIdentities>;
};

/** input type for inserting object relation for remote table "MeemIdentities" */
export type MeemIdentities_Obj_Rel_Insert_Input = {
  data: MeemIdentities_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemIdentities_On_Conflict>;
};

/** on_conflict condition type for table "MeemIdentities" */
export type MeemIdentities_On_Conflict = {
  constraint: MeemIdentities_Constraint;
  update_columns?: Array<MeemIdentities_Update_Column>;
  where?: InputMaybe<MeemIdentities_Bool_Exp>;
};

/** Ordering options when selecting data from "MeemIdentities". */
export type MeemIdentities_Order_By = {
  DefaultWallet?: InputMaybe<Wallets_Order_By>;
  DefaultWalletId?: InputMaybe<Order_By>;
  MeemIdentityIntegrations_aggregate?: InputMaybe<MeemIdentityIntegrations_Aggregate_Order_By>;
  MeemIdentityWallets_aggregate?: InputMaybe<MeemIdentityWallets_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profilePicUrl?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: MeemIdentities */
export type MeemIdentities_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "MeemIdentities" */
export type MeemIdentities_Set_Input = {
  DefaultWalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  displayName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  profilePicUrl?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "MeemIdentities" */
export type MeemIdentities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemIdentities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemIdentities_Stream_Cursor_Value_Input = {
  DefaultWalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  displayName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  profilePicUrl?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "MeemIdentities" */
export enum MeemIdentities_Update_Column {
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

export type MeemIdentities_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemIdentities_Set_Input>;
  where: MeemIdentities_Bool_Exp;
};

/** columns and relationships of "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations = {
  __typename?: 'MeemIdentityIntegrations';
  /** An object relationship */
  IdentityIntegration?: Maybe<IdentityIntegrations>;
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

/** append existing jsonb value of filtered columns with new jsonb value */
export type MeemIdentityIntegrations_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Arr_Rel_Insert_Input = {
  data: Array<MeemIdentityIntegrations_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemIdentityIntegrations_On_Conflict>;
};

/** Boolean expression to filter rows from the table "MeemIdentityIntegrations". All fields are combined with a logical 'AND'. */
export type MeemIdentityIntegrations_Bool_Exp = {
  IdentityIntegration?: InputMaybe<IdentityIntegrations_Bool_Exp>;
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

/** unique or primary key constraints on table "MeemIdentityIntegrations" */
export enum MeemIdentityIntegrations_Constraint {
  /** unique or primary key constraint on columns "MeemIdentityId", "IdentityIntegrationId" */
  MeemIdentityIntegrationsIdentityIntegrationIdMeemIdentityKey = 'MeemIdentityIntegrations_IdentityIntegrationId_MeemIdentity_key',
  /** unique or primary key constraint on columns "id" */
  MeemIdentityIntegrationsPkey = 'MeemIdentityIntegrations_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type MeemIdentityIntegrations_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type MeemIdentityIntegrations_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type MeemIdentityIntegrations_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Insert_Input = {
  IdentityIntegration?: InputMaybe<IdentityIntegrations_Obj_Rel_Insert_Input>;
  IdentityIntegrationId?: InputMaybe<Scalars['uuid']>;
  MeemIdentity?: InputMaybe<MeemIdentities_Obj_Rel_Insert_Input>;
  MeemIdentityId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  visibility?: InputMaybe<Scalars['String']>;
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

/** response of any mutation on the table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Mutation_Response = {
  __typename?: 'MeemIdentityIntegrations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemIdentityIntegrations>;
};

/** on_conflict condition type for table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_On_Conflict = {
  constraint: MeemIdentityIntegrations_Constraint;
  update_columns?: Array<MeemIdentityIntegrations_Update_Column>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
};

/** Ordering options when selecting data from "MeemIdentityIntegrations". */
export type MeemIdentityIntegrations_Order_By = {
  IdentityIntegration?: InputMaybe<IdentityIntegrations_Order_By>;
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

/** primary key columns input for table: MeemIdentityIntegrations */
export type MeemIdentityIntegrations_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type MeemIdentityIntegrations_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
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

/** input type for updating data in table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Set_Input = {
  IdentityIntegrationId?: InputMaybe<Scalars['uuid']>;
  MeemIdentityId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  visibility?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "MeemIdentityIntegrations" */
export type MeemIdentityIntegrations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemIdentityIntegrations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemIdentityIntegrations_Stream_Cursor_Value_Input = {
  IdentityIntegrationId?: InputMaybe<Scalars['uuid']>;
  MeemIdentityId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  visibility?: InputMaybe<Scalars['String']>;
};

/** update columns of table "MeemIdentityIntegrations" */
export enum MeemIdentityIntegrations_Update_Column {
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

export type MeemIdentityIntegrations_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<MeemIdentityIntegrations_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<MeemIdentityIntegrations_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<MeemIdentityIntegrations_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<MeemIdentityIntegrations_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<MeemIdentityIntegrations_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemIdentityIntegrations_Set_Input>;
  where: MeemIdentityIntegrations_Bool_Exp;
};

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

/** input type for inserting array relation for remote table "MeemIdentityWallets" */
export type MeemIdentityWallets_Arr_Rel_Insert_Input = {
  data: Array<MeemIdentityWallets_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<MeemIdentityWallets_On_Conflict>;
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

/** unique or primary key constraints on table "MeemIdentityWallets" */
export enum MeemIdentityWallets_Constraint {
  /** unique or primary key constraint on columns "MeemIdentityId", "WalletId" */
  MeemIdentityWalletsMeemIdentityIdWalletIdKey = 'MeemIdentityWallets_MeemIdentityId_WalletId_key',
  /** unique or primary key constraint on columns "id" */
  MeemIdentityWalletsPkey = 'MeemIdentityWallets_pkey'
}

/** input type for inserting data into table "MeemIdentityWallets" */
export type MeemIdentityWallets_Insert_Input = {
  MeemIdentity?: InputMaybe<MeemIdentities_Obj_Rel_Insert_Input>;
  MeemIdentityId?: InputMaybe<Scalars['uuid']>;
  Wallet?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "MeemIdentityWallets" */
export type MeemIdentityWallets_Mutation_Response = {
  __typename?: 'MeemIdentityWallets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<MeemIdentityWallets>;
};

/** on_conflict condition type for table "MeemIdentityWallets" */
export type MeemIdentityWallets_On_Conflict = {
  constraint: MeemIdentityWallets_Constraint;
  update_columns?: Array<MeemIdentityWallets_Update_Column>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
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

/** primary key columns input for table: MeemIdentityWallets */
export type MeemIdentityWallets_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "MeemIdentityWallets" */
export type MeemIdentityWallets_Set_Input = {
  MeemIdentityId?: InputMaybe<Scalars['uuid']>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "MeemIdentityWallets" */
export type MeemIdentityWallets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: MeemIdentityWallets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type MeemIdentityWallets_Stream_Cursor_Value_Input = {
  MeemIdentityId?: InputMaybe<Scalars['uuid']>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "MeemIdentityWallets" */
export enum MeemIdentityWallets_Update_Column {
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

export type MeemIdentityWallets_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<MeemIdentityWallets_Set_Input>;
  where: MeemIdentityWallets_Bool_Exp;
};

/** columns and relationships of "Meems" */
export type Meems = {
  __typename?: 'Meems';
  /** An array relationship */
  Clippings: Array<Clippings>;
  /** An aggregate relationship */
  Clippings_aggregate: Clippings_Aggregate;
  /** An object relationship */
  MeemContract?: Maybe<MeemContracts>;
  MeemContractId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  Owner?: Maybe<Wallets>;
  OwnerId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  Reactions: Array<Reactions>;
  /** An aggregate relationship */
  Reactions_aggregate: Reactions_Aggregate;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** An aggregate relationship */
  Transfers_aggregate: Transfers_Aggregate;
  /** An array relationship */
  Tweets: Array<Tweets>;
  /** An aggregate relationship */
  Tweets_aggregate: Tweets_Aggregate;
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
export type MeemsClippingsArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


/** columns and relationships of "Meems" */
export type MeemsClippings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


/** columns and relationships of "Meems" */
export type MeemsReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Reactions_Order_By>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};


/** columns and relationships of "Meems" */
export type MeemsReactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Reactions_Order_By>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
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
export type MeemsTransfers_AggregateArgs = {
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
export type MeemsTweets_AggregateArgs = {
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

/** append existing jsonb value of filtered columns with new jsonb value */
export type Meems_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "Meems" */
export type Meems_Arr_Rel_Insert_Input = {
  data: Array<Meems_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Meems_On_Conflict>;
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
  Clippings?: InputMaybe<Clippings_Bool_Exp>;
  MeemContract?: InputMaybe<MeemContracts_Bool_Exp>;
  MeemContractId?: InputMaybe<Uuid_Comparison_Exp>;
  Owner?: InputMaybe<Wallets_Bool_Exp>;
  OwnerId?: InputMaybe<Uuid_Comparison_Exp>;
  Reactions?: InputMaybe<Reactions_Bool_Exp>;
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

/** unique or primary key constraints on table "Meems" */
export enum Meems_Constraint {
  /** unique or primary key constraint on columns "id" */
  MeemsPkey = 'Meems_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Meems_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Meems_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Meems_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "Meems" */
export type Meems_Inc_Input = {
  meemType?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "Meems" */
export type Meems_Insert_Input = {
  Clippings?: InputMaybe<Clippings_Arr_Rel_Insert_Input>;
  MeemContract?: InputMaybe<MeemContracts_Obj_Rel_Insert_Input>;
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  Owner?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  OwnerId?: InputMaybe<Scalars['uuid']>;
  Reactions?: InputMaybe<Reactions_Arr_Rel_Insert_Input>;
  Transfers?: InputMaybe<Transfers_Arr_Rel_Insert_Input>;
  Tweets?: InputMaybe<Tweets_Arr_Rel_Insert_Input>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  meemType?: InputMaybe<Scalars['Int']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  mintedAt?: InputMaybe<Scalars['timestamptz']>;
  mintedBy?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
  tokenURI?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "Meems" */
export type Meems_Mutation_Response = {
  __typename?: 'Meems_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Meems>;
};

/** input type for inserting object relation for remote table "Meems" */
export type Meems_Obj_Rel_Insert_Input = {
  data: Meems_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Meems_On_Conflict>;
};

/** on_conflict condition type for table "Meems" */
export type Meems_On_Conflict = {
  constraint: Meems_Constraint;
  update_columns?: Array<Meems_Update_Column>;
  where?: InputMaybe<Meems_Bool_Exp>;
};

/** Ordering options when selecting data from "Meems". */
export type Meems_Order_By = {
  Clippings_aggregate?: InputMaybe<Clippings_Aggregate_Order_By>;
  MeemContract?: InputMaybe<MeemContracts_Order_By>;
  MeemContractId?: InputMaybe<Order_By>;
  Owner?: InputMaybe<Wallets_Order_By>;
  OwnerId?: InputMaybe<Order_By>;
  Reactions_aggregate?: InputMaybe<Reactions_Aggregate_Order_By>;
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

/** primary key columns input for table: Meems */
export type Meems_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Meems_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
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

/** input type for updating data in table "Meems" */
export type Meems_Set_Input = {
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  OwnerId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  meemType?: InputMaybe<Scalars['Int']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  mintedAt?: InputMaybe<Scalars['timestamptz']>;
  mintedBy?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
  tokenURI?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

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

/** Streaming cursor of the table "Meems" */
export type Meems_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Meems_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Meems_Stream_Cursor_Value_Input = {
  MeemContractId?: InputMaybe<Scalars['uuid']>;
  OwnerId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  meemType?: InputMaybe<Scalars['Int']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  mintedAt?: InputMaybe<Scalars['timestamptz']>;
  mintedBy?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
  tokenURI?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** update columns of table "Meems" */
export enum Meems_Update_Column {
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

export type Meems_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Meems_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Meems_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Meems_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Meems_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Meems_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Meems_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Meems_Set_Input>;
  where: Meems_Bool_Exp;
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

/** columns and relationships of "Reactions" */
export type Reactions = {
  __typename?: 'Reactions';
  /** An object relationship */
  Meem?: Maybe<Meems>;
  MeemId?: Maybe<Scalars['uuid']>;
  address: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  reactedAt: Scalars['timestamptz'];
  reaction: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "Reactions" */
export type Reactions_Aggregate = {
  __typename?: 'Reactions_aggregate';
  aggregate?: Maybe<Reactions_Aggregate_Fields>;
  nodes: Array<Reactions>;
};

/** aggregate fields of "Reactions" */
export type Reactions_Aggregate_Fields = {
  __typename?: 'Reactions_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Reactions_Max_Fields>;
  min?: Maybe<Reactions_Min_Fields>;
};


/** aggregate fields of "Reactions" */
export type Reactions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Reactions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "Reactions" */
export type Reactions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Reactions_Max_Order_By>;
  min?: InputMaybe<Reactions_Min_Order_By>;
};

/** input type for inserting array relation for remote table "Reactions" */
export type Reactions_Arr_Rel_Insert_Input = {
  data: Array<Reactions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Reactions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "Reactions". All fields are combined with a logical 'AND'. */
export type Reactions_Bool_Exp = {
  Meem?: InputMaybe<Meems_Bool_Exp>;
  MeemId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Reactions_Bool_Exp>>;
  _not?: InputMaybe<Reactions_Bool_Exp>;
  _or?: InputMaybe<Array<Reactions_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  reactedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  reaction?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "Reactions" */
export enum Reactions_Constraint {
  /** unique or primary key constraint on columns "id" */
  ReactionsPkey = 'Reactions_pkey'
}

/** input type for inserting data into table "Reactions" */
export type Reactions_Insert_Input = {
  Meem?: InputMaybe<Meems_Obj_Rel_Insert_Input>;
  MeemId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  reactedAt?: InputMaybe<Scalars['timestamptz']>;
  reaction?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Reactions_Max_Fields = {
  __typename?: 'Reactions_max_fields';
  MeemId?: Maybe<Scalars['uuid']>;
  address?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  reactedAt?: Maybe<Scalars['timestamptz']>;
  reaction?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "Reactions" */
export type Reactions_Max_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reactedAt?: InputMaybe<Order_By>;
  reaction?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Reactions_Min_Fields = {
  __typename?: 'Reactions_min_fields';
  MeemId?: Maybe<Scalars['uuid']>;
  address?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  reactedAt?: Maybe<Scalars['timestamptz']>;
  reaction?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "Reactions" */
export type Reactions_Min_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reactedAt?: InputMaybe<Order_By>;
  reaction?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "Reactions" */
export type Reactions_Mutation_Response = {
  __typename?: 'Reactions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Reactions>;
};

/** on_conflict condition type for table "Reactions" */
export type Reactions_On_Conflict = {
  constraint: Reactions_Constraint;
  update_columns?: Array<Reactions_Update_Column>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};

/** Ordering options when selecting data from "Reactions". */
export type Reactions_Order_By = {
  Meem?: InputMaybe<Meems_Order_By>;
  MeemId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reactedAt?: InputMaybe<Order_By>;
  reaction?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: Reactions */
export type Reactions_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "Reactions" */
export enum Reactions_Select_Column {
  /** column name */
  MeemId = 'MeemId',
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  ReactedAt = 'reactedAt',
  /** column name */
  Reaction = 'reaction',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "Reactions" */
export type Reactions_Set_Input = {
  MeemId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  reactedAt?: InputMaybe<Scalars['timestamptz']>;
  reaction?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "Reactions" */
export type Reactions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Reactions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Reactions_Stream_Cursor_Value_Input = {
  MeemId?: InputMaybe<Scalars['uuid']>;
  address?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  reactedAt?: InputMaybe<Scalars['timestamptz']>;
  reaction?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "Reactions" */
export enum Reactions_Update_Column {
  /** column name */
  MeemId = 'MeemId',
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  ReactedAt = 'reactedAt',
  /** column name */
  Reaction = 'reaction',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Reactions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Reactions_Set_Input>;
  where: Reactions_Bool_Exp;
};

/** columns and relationships of "RolePermissions" */
export type RolePermissions = {
  __typename?: 'RolePermissions';
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "RolePermissions" */
export type RolePermissions_Aggregate = {
  __typename?: 'RolePermissions_aggregate';
  aggregate?: Maybe<RolePermissions_Aggregate_Fields>;
  nodes: Array<RolePermissions>;
};

/** aggregate fields of "RolePermissions" */
export type RolePermissions_Aggregate_Fields = {
  __typename?: 'RolePermissions_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<RolePermissions_Max_Fields>;
  min?: Maybe<RolePermissions_Min_Fields>;
};


/** aggregate fields of "RolePermissions" */
export type RolePermissions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<RolePermissions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "RolePermissions". All fields are combined with a logical 'AND'. */
export type RolePermissions_Bool_Exp = {
  _and?: InputMaybe<Array<RolePermissions_Bool_Exp>>;
  _not?: InputMaybe<RolePermissions_Bool_Exp>;
  _or?: InputMaybe<Array<RolePermissions_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "RolePermissions" */
export enum RolePermissions_Constraint {
  /** unique or primary key constraint on columns "id" */
  RolePermissionsPkey = 'RolePermissions_pkey'
}

/** input type for inserting data into table "RolePermissions" */
export type RolePermissions_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type RolePermissions_Max_Fields = {
  __typename?: 'RolePermissions_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type RolePermissions_Min_Fields = {
  __typename?: 'RolePermissions_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "RolePermissions" */
export type RolePermissions_Mutation_Response = {
  __typename?: 'RolePermissions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<RolePermissions>;
};

/** on_conflict condition type for table "RolePermissions" */
export type RolePermissions_On_Conflict = {
  constraint: RolePermissions_Constraint;
  update_columns?: Array<RolePermissions_Update_Column>;
  where?: InputMaybe<RolePermissions_Bool_Exp>;
};

/** Ordering options when selecting data from "RolePermissions". */
export type RolePermissions_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: RolePermissions */
export type RolePermissions_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "RolePermissions" */
export enum RolePermissions_Select_Column {
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
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "RolePermissions" */
export type RolePermissions_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "RolePermissions" */
export type RolePermissions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RolePermissions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RolePermissions_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "RolePermissions" */
export enum RolePermissions_Update_Column {
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
  UpdatedAt = 'updatedAt'
}

export type RolePermissions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RolePermissions_Set_Input>;
  where: RolePermissions_Bool_Exp;
};

/** columns and relationships of "SequelizeMeta" */
export type SequelizeMeta = {
  __typename?: 'SequelizeMeta';
  name: Scalars['String'];
};

/** aggregated selection of "SequelizeMeta" */
export type SequelizeMeta_Aggregate = {
  __typename?: 'SequelizeMeta_aggregate';
  aggregate?: Maybe<SequelizeMeta_Aggregate_Fields>;
  nodes: Array<SequelizeMeta>;
};

/** aggregate fields of "SequelizeMeta" */
export type SequelizeMeta_Aggregate_Fields = {
  __typename?: 'SequelizeMeta_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<SequelizeMeta_Max_Fields>;
  min?: Maybe<SequelizeMeta_Min_Fields>;
};


/** aggregate fields of "SequelizeMeta" */
export type SequelizeMeta_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<SequelizeMeta_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "SequelizeMeta". All fields are combined with a logical 'AND'. */
export type SequelizeMeta_Bool_Exp = {
  _and?: InputMaybe<Array<SequelizeMeta_Bool_Exp>>;
  _not?: InputMaybe<SequelizeMeta_Bool_Exp>;
  _or?: InputMaybe<Array<SequelizeMeta_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "SequelizeMeta" */
export enum SequelizeMeta_Constraint {
  /** unique or primary key constraint on columns "name" */
  SequelizeMetaPkey = 'SequelizeMeta_pkey'
}

/** input type for inserting data into table "SequelizeMeta" */
export type SequelizeMeta_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SequelizeMeta_Max_Fields = {
  __typename?: 'SequelizeMeta_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SequelizeMeta_Min_Fields = {
  __typename?: 'SequelizeMeta_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "SequelizeMeta" */
export type SequelizeMeta_Mutation_Response = {
  __typename?: 'SequelizeMeta_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<SequelizeMeta>;
};

/** on_conflict condition type for table "SequelizeMeta" */
export type SequelizeMeta_On_Conflict = {
  constraint: SequelizeMeta_Constraint;
  update_columns?: Array<SequelizeMeta_Update_Column>;
  where?: InputMaybe<SequelizeMeta_Bool_Exp>;
};

/** Ordering options when selecting data from "SequelizeMeta". */
export type SequelizeMeta_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: SequelizeMeta */
export type SequelizeMeta_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "SequelizeMeta" */
export enum SequelizeMeta_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "SequelizeMeta" */
export type SequelizeMeta_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "SequelizeMeta" */
export type SequelizeMeta_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: SequelizeMeta_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type SequelizeMeta_Stream_Cursor_Value_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "SequelizeMeta" */
export enum SequelizeMeta_Update_Column {
  /** column name */
  Name = 'name'
}

export type SequelizeMeta_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SequelizeMeta_Set_Input>;
  where: SequelizeMeta_Bool_Exp;
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

/** columns and relationships of "Transactions" */
export type Transactions = {
  __typename?: 'Transactions';
  /** An object relationship */
  Wallet?: Maybe<Wallets>;
  WalletId?: Maybe<Scalars['uuid']>;
  chainId: Scalars['Int'];
  createdAt: Scalars['timestamptz'];
  hash: Scalars['String'];
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "Transactions" */
export type Transactions_Aggregate = {
  __typename?: 'Transactions_aggregate';
  aggregate?: Maybe<Transactions_Aggregate_Fields>;
  nodes: Array<Transactions>;
};

/** aggregate fields of "Transactions" */
export type Transactions_Aggregate_Fields = {
  __typename?: 'Transactions_aggregate_fields';
  avg?: Maybe<Transactions_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Transactions_Max_Fields>;
  min?: Maybe<Transactions_Min_Fields>;
  stddev?: Maybe<Transactions_Stddev_Fields>;
  stddev_pop?: Maybe<Transactions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Transactions_Stddev_Samp_Fields>;
  sum?: Maybe<Transactions_Sum_Fields>;
  var_pop?: Maybe<Transactions_Var_Pop_Fields>;
  var_samp?: Maybe<Transactions_Var_Samp_Fields>;
  variance?: Maybe<Transactions_Variance_Fields>;
};


/** aggregate fields of "Transactions" */
export type Transactions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "Transactions" */
export type Transactions_Aggregate_Order_By = {
  avg?: InputMaybe<Transactions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transactions_Max_Order_By>;
  min?: InputMaybe<Transactions_Min_Order_By>;
  stddev?: InputMaybe<Transactions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Transactions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Transactions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Transactions_Sum_Order_By>;
  var_pop?: InputMaybe<Transactions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Transactions_Var_Samp_Order_By>;
  variance?: InputMaybe<Transactions_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "Transactions" */
export type Transactions_Arr_Rel_Insert_Input = {
  data: Array<Transactions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Transactions_On_Conflict>;
};

/** aggregate avg on columns */
export type Transactions_Avg_Fields = {
  __typename?: 'Transactions_avg_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "Transactions" */
export type Transactions_Avg_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Transactions". All fields are combined with a logical 'AND'. */
export type Transactions_Bool_Exp = {
  Wallet?: InputMaybe<Wallets_Bool_Exp>;
  WalletId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Transactions_Bool_Exp>>;
  _not?: InputMaybe<Transactions_Bool_Exp>;
  _or?: InputMaybe<Array<Transactions_Bool_Exp>>;
  chainId?: InputMaybe<Int_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  hash?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "Transactions" */
export enum Transactions_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransactionsPkey = 'Transactions_pkey'
}

/** input type for incrementing numeric columns in table "Transactions" */
export type Transactions_Inc_Input = {
  chainId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "Transactions" */
export type Transactions_Insert_Input = {
  Wallet?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  chainId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Transactions_Max_Fields = {
  __typename?: 'Transactions_max_fields';
  WalletId?: Maybe<Scalars['uuid']>;
  chainId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  hash?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "Transactions" */
export type Transactions_Max_Order_By = {
  WalletId?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Transactions_Min_Fields = {
  __typename?: 'Transactions_min_fields';
  WalletId?: Maybe<Scalars['uuid']>;
  chainId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  hash?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "Transactions" */
export type Transactions_Min_Order_By = {
  WalletId?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "Transactions" */
export type Transactions_Mutation_Response = {
  __typename?: 'Transactions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Transactions>;
};

/** on_conflict condition type for table "Transactions" */
export type Transactions_On_Conflict = {
  constraint: Transactions_Constraint;
  update_columns?: Array<Transactions_Update_Column>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

/** Ordering options when selecting data from "Transactions". */
export type Transactions_Order_By = {
  Wallet?: InputMaybe<Wallets_Order_By>;
  WalletId?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: Transactions */
export type Transactions_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "Transactions" */
export enum Transactions_Select_Column {
  /** column name */
  WalletId = 'WalletId',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Hash = 'hash',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "Transactions" */
export type Transactions_Set_Input = {
  WalletId?: InputMaybe<Scalars['uuid']>;
  chainId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Transactions_Stddev_Fields = {
  __typename?: 'Transactions_stddev_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "Transactions" */
export type Transactions_Stddev_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Transactions_Stddev_Pop_Fields = {
  __typename?: 'Transactions_stddev_pop_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "Transactions" */
export type Transactions_Stddev_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Transactions_Stddev_Samp_Fields = {
  __typename?: 'Transactions_stddev_samp_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "Transactions" */
export type Transactions_Stddev_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Transactions" */
export type Transactions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transactions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transactions_Stream_Cursor_Value_Input = {
  WalletId?: InputMaybe<Scalars['uuid']>;
  chainId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type Transactions_Sum_Fields = {
  __typename?: 'Transactions_sum_fields';
  chainId?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "Transactions" */
export type Transactions_Sum_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** update columns of table "Transactions" */
export enum Transactions_Update_Column {
  /** column name */
  WalletId = 'WalletId',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Hash = 'hash',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Transactions_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Transactions_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transactions_Set_Input>;
  where: Transactions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Transactions_Var_Pop_Fields = {
  __typename?: 'Transactions_var_pop_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "Transactions" */
export type Transactions_Var_Pop_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Transactions_Var_Samp_Fields = {
  __typename?: 'Transactions_var_samp_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "Transactions" */
export type Transactions_Var_Samp_Order_By = {
  chainId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Transactions_Variance_Fields = {
  __typename?: 'Transactions_variance_fields';
  chainId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "Transactions" */
export type Transactions_Variance_Order_By = {
  chainId?: InputMaybe<Order_By>;
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

/** aggregated selection of "Transfers" */
export type Transfers_Aggregate = {
  __typename?: 'Transfers_aggregate';
  aggregate?: Maybe<Transfers_Aggregate_Fields>;
  nodes: Array<Transfers>;
};

/** aggregate fields of "Transfers" */
export type Transfers_Aggregate_Fields = {
  __typename?: 'Transfers_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Transfers_Max_Fields>;
  min?: Maybe<Transfers_Min_Fields>;
};


/** aggregate fields of "Transfers" */
export type Transfers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Transfers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "Transfers" */
export type Transfers_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transfers_Max_Order_By>;
  min?: InputMaybe<Transfers_Min_Order_By>;
};

/** input type for inserting array relation for remote table "Transfers" */
export type Transfers_Arr_Rel_Insert_Input = {
  data: Array<Transfers_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Transfers_On_Conflict>;
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

/** unique or primary key constraints on table "Transfers" */
export enum Transfers_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransfersPkey = 'Transfers_pkey'
}

/** input type for inserting data into table "Transfers" */
export type Transfers_Insert_Input = {
  Meem?: InputMaybe<Meems_Obj_Rel_Insert_Input>;
  MeemId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  from?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  to?: InputMaybe<Scalars['String']>;
  transactionHash?: InputMaybe<Scalars['String']>;
  transferredAt?: InputMaybe<Scalars['timestamptz']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Transfers_Max_Fields = {
  __typename?: 'Transfers_max_fields';
  MeemId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  from?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  to?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  transferredAt?: Maybe<Scalars['timestamptz']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
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

/** aggregate min on columns */
export type Transfers_Min_Fields = {
  __typename?: 'Transfers_min_fields';
  MeemId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  from?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  to?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  transferredAt?: Maybe<Scalars['timestamptz']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "Transfers" */
export type Transfers_Mutation_Response = {
  __typename?: 'Transfers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Transfers>;
};

/** on_conflict condition type for table "Transfers" */
export type Transfers_On_Conflict = {
  constraint: Transfers_Constraint;
  update_columns?: Array<Transfers_Update_Column>;
  where?: InputMaybe<Transfers_Bool_Exp>;
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

/** primary key columns input for table: Transfers */
export type Transfers_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "Transfers" */
export type Transfers_Set_Input = {
  MeemId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  from?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  to?: InputMaybe<Scalars['String']>;
  transactionHash?: InputMaybe<Scalars['String']>;
  transferredAt?: InputMaybe<Scalars['timestamptz']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "Transfers" */
export type Transfers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transfers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transfers_Stream_Cursor_Value_Input = {
  MeemId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  from?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  to?: InputMaybe<Scalars['String']>;
  transactionHash?: InputMaybe<Scalars['String']>;
  transferredAt?: InputMaybe<Scalars['timestamptz']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "Transfers" */
export enum Transfers_Update_Column {
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

export type Transfers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transfers_Set_Input>;
  where: Transfers_Bool_Exp;
};

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

/** aggregated selection of "TweetHashtags" */
export type TweetHashtags_Aggregate = {
  __typename?: 'TweetHashtags_aggregate';
  aggregate?: Maybe<TweetHashtags_Aggregate_Fields>;
  nodes: Array<TweetHashtags>;
};

/** aggregate fields of "TweetHashtags" */
export type TweetHashtags_Aggregate_Fields = {
  __typename?: 'TweetHashtags_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<TweetHashtags_Max_Fields>;
  min?: Maybe<TweetHashtags_Min_Fields>;
};


/** aggregate fields of "TweetHashtags" */
export type TweetHashtags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "TweetHashtags" */
export type TweetHashtags_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<TweetHashtags_Max_Order_By>;
  min?: InputMaybe<TweetHashtags_Min_Order_By>;
};

/** input type for inserting array relation for remote table "TweetHashtags" */
export type TweetHashtags_Arr_Rel_Insert_Input = {
  data: Array<TweetHashtags_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<TweetHashtags_On_Conflict>;
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

/** unique or primary key constraints on table "TweetHashtags" */
export enum TweetHashtags_Constraint {
  /** unique or primary key constraint on columns "HashtagId", "TweetId" */
  TweetHashtagsHashtagIdTweetIdKey = 'TweetHashtags_HashtagId_TweetId_key',
  /** unique or primary key constraint on columns "id" */
  TweetHashtagsPkey = 'TweetHashtags_pkey'
}

/** input type for inserting data into table "TweetHashtags" */
export type TweetHashtags_Insert_Input = {
  Hashtag?: InputMaybe<Hashtags_Obj_Rel_Insert_Input>;
  HashtagId?: InputMaybe<Scalars['uuid']>;
  Tweet?: InputMaybe<Tweets_Obj_Rel_Insert_Input>;
  TweetId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type TweetHashtags_Max_Fields = {
  __typename?: 'TweetHashtags_max_fields';
  HashtagId?: Maybe<Scalars['uuid']>;
  TweetId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
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

/** aggregate min on columns */
export type TweetHashtags_Min_Fields = {
  __typename?: 'TweetHashtags_min_fields';
  HashtagId?: Maybe<Scalars['uuid']>;
  TweetId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "TweetHashtags" */
export type TweetHashtags_Mutation_Response = {
  __typename?: 'TweetHashtags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TweetHashtags>;
};

/** on_conflict condition type for table "TweetHashtags" */
export type TweetHashtags_On_Conflict = {
  constraint: TweetHashtags_Constraint;
  update_columns?: Array<TweetHashtags_Update_Column>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
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

/** primary key columns input for table: TweetHashtags */
export type TweetHashtags_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "TweetHashtags" */
export type TweetHashtags_Set_Input = {
  HashtagId?: InputMaybe<Scalars['uuid']>;
  TweetId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "TweetHashtags" */
export type TweetHashtags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: TweetHashtags_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type TweetHashtags_Stream_Cursor_Value_Input = {
  HashtagId?: InputMaybe<Scalars['uuid']>;
  TweetId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "TweetHashtags" */
export enum TweetHashtags_Update_Column {
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

export type TweetHashtags_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TweetHashtags_Set_Input>;
  where: TweetHashtags_Bool_Exp;
};

/** columns and relationships of "Tweets" */
export type Tweets = {
  __typename?: 'Tweets';
  /** An object relationship */
  Meem?: Maybe<Meems>;
  MeemId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  TweetHashtags: Array<TweetHashtags>;
  /** An aggregate relationship */
  TweetHashtags_aggregate: TweetHashtags_Aggregate;
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


/** columns and relationships of "Tweets" */
export type TweetsTweetHashtags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TweetHashtags_Order_By>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};

/** aggregated selection of "Tweets" */
export type Tweets_Aggregate = {
  __typename?: 'Tweets_aggregate';
  aggregate?: Maybe<Tweets_Aggregate_Fields>;
  nodes: Array<Tweets>;
};

/** aggregate fields of "Tweets" */
export type Tweets_Aggregate_Fields = {
  __typename?: 'Tweets_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Tweets_Max_Fields>;
  min?: Maybe<Tweets_Min_Fields>;
};


/** aggregate fields of "Tweets" */
export type Tweets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Tweets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "Tweets" */
export type Tweets_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Tweets_Max_Order_By>;
  min?: InputMaybe<Tweets_Min_Order_By>;
};

/** input type for inserting array relation for remote table "Tweets" */
export type Tweets_Arr_Rel_Insert_Input = {
  data: Array<Tweets_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Tweets_On_Conflict>;
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

/** unique or primary key constraints on table "Tweets" */
export enum Tweets_Constraint {
  /** unique or primary key constraint on columns "id" */
  TweetsPkey = 'Tweets_pkey'
}

/** input type for inserting data into table "Tweets" */
export type Tweets_Insert_Input = {
  Meem?: InputMaybe<Meems_Obj_Rel_Insert_Input>;
  MeemId?: InputMaybe<Scalars['uuid']>;
  TweetHashtags?: InputMaybe<TweetHashtags_Arr_Rel_Insert_Input>;
  conversationId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  text?: InputMaybe<Scalars['String']>;
  tweetId?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  userProfileImageUrl?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Tweets_Max_Fields = {
  __typename?: 'Tweets_max_fields';
  MeemId?: Maybe<Scalars['uuid']>;
  conversationId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  text?: Maybe<Scalars['String']>;
  tweetId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  userProfileImageUrl?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
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

/** aggregate min on columns */
export type Tweets_Min_Fields = {
  __typename?: 'Tweets_min_fields';
  MeemId?: Maybe<Scalars['uuid']>;
  conversationId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  text?: Maybe<Scalars['String']>;
  tweetId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  userProfileImageUrl?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
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

/** response of any mutation on the table "Tweets" */
export type Tweets_Mutation_Response = {
  __typename?: 'Tweets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Tweets>;
};

/** input type for inserting object relation for remote table "Tweets" */
export type Tweets_Obj_Rel_Insert_Input = {
  data: Tweets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Tweets_On_Conflict>;
};

/** on_conflict condition type for table "Tweets" */
export type Tweets_On_Conflict = {
  constraint: Tweets_Constraint;
  update_columns?: Array<Tweets_Update_Column>;
  where?: InputMaybe<Tweets_Bool_Exp>;
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

/** primary key columns input for table: Tweets */
export type Tweets_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "Tweets" */
export type Tweets_Set_Input = {
  MeemId?: InputMaybe<Scalars['uuid']>;
  conversationId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  text?: InputMaybe<Scalars['String']>;
  tweetId?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  userProfileImageUrl?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "Tweets" */
export type Tweets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Tweets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Tweets_Stream_Cursor_Value_Input = {
  MeemId?: InputMaybe<Scalars['uuid']>;
  conversationId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  text?: InputMaybe<Scalars['String']>;
  tweetId?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  userProfileImageUrl?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

/** update columns of table "Tweets" */
export enum Tweets_Update_Column {
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

export type Tweets_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Tweets_Set_Input>;
  where: Tweets_Bool_Exp;
};

/** columns and relationships of "Twitters" */
export type Twitters = {
  __typename?: 'Twitters';
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  twitterId: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "Twitters" */
export type Twitters_Aggregate = {
  __typename?: 'Twitters_aggregate';
  aggregate?: Maybe<Twitters_Aggregate_Fields>;
  nodes: Array<Twitters>;
};

/** aggregate fields of "Twitters" */
export type Twitters_Aggregate_Fields = {
  __typename?: 'Twitters_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Twitters_Max_Fields>;
  min?: Maybe<Twitters_Min_Fields>;
};


/** aggregate fields of "Twitters" */
export type Twitters_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Twitters_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "Twitters". All fields are combined with a logical 'AND'. */
export type Twitters_Bool_Exp = {
  _and?: InputMaybe<Array<Twitters_Bool_Exp>>;
  _not?: InputMaybe<Twitters_Bool_Exp>;
  _or?: InputMaybe<Array<Twitters_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  twitterId?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "Twitters" */
export enum Twitters_Constraint {
  /** unique or primary key constraint on columns "id" */
  TwittersPkey = 'Twitters_pkey'
}

/** input type for inserting data into table "Twitters" */
export type Twitters_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  twitterId?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Twitters_Max_Fields = {
  __typename?: 'Twitters_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  twitterId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Twitters_Min_Fields = {
  __typename?: 'Twitters_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  twitterId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "Twitters" */
export type Twitters_Mutation_Response = {
  __typename?: 'Twitters_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Twitters>;
};

/** on_conflict condition type for table "Twitters" */
export type Twitters_On_Conflict = {
  constraint: Twitters_Constraint;
  update_columns?: Array<Twitters_Update_Column>;
  where?: InputMaybe<Twitters_Bool_Exp>;
};

/** Ordering options when selecting data from "Twitters". */
export type Twitters_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  twitterId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: Twitters */
export type Twitters_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "Twitters" */
export enum Twitters_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  TwitterId = 'twitterId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "Twitters" */
export type Twitters_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  twitterId?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "Twitters" */
export type Twitters_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Twitters_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Twitters_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  twitterId?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "Twitters" */
export enum Twitters_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  TwitterId = 'twitterId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Twitters_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Twitters_Set_Input>;
  where: Twitters_Bool_Exp;
};

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

/** input type for inserting array relation for remote table "WalletContractInstances" */
export type WalletContractInstances_Arr_Rel_Insert_Input = {
  data: Array<WalletContractInstances_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<WalletContractInstances_On_Conflict>;
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

/** unique or primary key constraints on table "WalletContractInstances" */
export enum WalletContractInstances_Constraint {
  /** unique or primary key constraint on columns "id" */
  WalletContractInstancesPkey = 'WalletContractInstances_pkey'
}

/** input type for inserting data into table "WalletContractInstances" */
export type WalletContractInstances_Insert_Input = {
  ContractInstance?: InputMaybe<ContractInstances_Obj_Rel_Insert_Input>;
  ContractInstanceId?: InputMaybe<Scalars['uuid']>;
  Wallet?: InputMaybe<Wallets_Obj_Rel_Insert_Input>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
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

/** response of any mutation on the table "WalletContractInstances" */
export type WalletContractInstances_Mutation_Response = {
  __typename?: 'WalletContractInstances_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<WalletContractInstances>;
};

/** on_conflict condition type for table "WalletContractInstances" */
export type WalletContractInstances_On_Conflict = {
  constraint: WalletContractInstances_Constraint;
  update_columns?: Array<WalletContractInstances_Update_Column>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
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

/** primary key columns input for table: WalletContractInstances */
export type WalletContractInstances_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "WalletContractInstances" */
export type WalletContractInstances_Set_Input = {
  ContractInstanceId?: InputMaybe<Scalars['uuid']>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "WalletContractInstances" */
export type WalletContractInstances_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: WalletContractInstances_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type WalletContractInstances_Stream_Cursor_Value_Input = {
  ContractInstanceId?: InputMaybe<Scalars['uuid']>;
  WalletId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "WalletContractInstances" */
export enum WalletContractInstances_Update_Column {
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

export type WalletContractInstances_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<WalletContractInstances_Set_Input>;
  where: WalletContractInstances_Bool_Exp;
};

/** columns and relationships of "Wallets" */
export type Wallets = {
  __typename?: 'Wallets';
  /** An array relationship */
  Bundles: Array<Bundles>;
  /** An aggregate relationship */
  Bundles_aggregate: Bundles_Aggregate;
  /** An array relationship */
  Contracts: Array<Contracts>;
  /** An aggregate relationship */
  Contracts_aggregate: Contracts_Aggregate;
  /** An array relationship */
  MeemContractWallets: Array<MeemContractWallets>;
  /** An aggregate relationship */
  MeemContractWallets_aggregate: MeemContractWallets_Aggregate;
  /** An array relationship */
  MeemContracts: Array<MeemContracts>;
  /** An aggregate relationship */
  MeemContracts_aggregate: MeemContracts_Aggregate;
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
  Transactions: Array<Transactions>;
  /** An aggregate relationship */
  Transactions_aggregate: Transactions_Aggregate;
  /** An array relationship */
  WalletContractInstances: Array<WalletContractInstances>;
  /** An aggregate relationship */
  WalletContractInstances_aggregate: WalletContractInstances_Aggregate;
  address: Scalars['String'];
  apiKey?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  dailyTXLimit: Scalars['Int'];
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  nonce?: Maybe<Scalars['String']>;
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
export type WalletsContracts_AggregateArgs = {
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
export type WalletsMeemContractWallets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractWallets_Order_By>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeemContractsArgs = {
  distinct_on?: InputMaybe<Array<MeemContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContracts_Order_By>>;
  where?: InputMaybe<MeemContracts_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsMeemContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContracts_Order_By>>;
  where?: InputMaybe<MeemContracts_Bool_Exp>;
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
export type WalletsTransactionsArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};


/** columns and relationships of "Wallets" */
export type WalletsTransactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
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
  avg?: Maybe<Wallets_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Wallets_Max_Fields>;
  min?: Maybe<Wallets_Min_Fields>;
  stddev?: Maybe<Wallets_Stddev_Fields>;
  stddev_pop?: Maybe<Wallets_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Wallets_Stddev_Samp_Fields>;
  sum?: Maybe<Wallets_Sum_Fields>;
  var_pop?: Maybe<Wallets_Var_Pop_Fields>;
  var_samp?: Maybe<Wallets_Var_Samp_Fields>;
  variance?: Maybe<Wallets_Variance_Fields>;
};


/** aggregate fields of "Wallets" */
export type Wallets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Wallets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Wallets_Avg_Fields = {
  __typename?: 'Wallets_avg_fields';
  dailyTXLimit?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "Wallets". All fields are combined with a logical 'AND'. */
export type Wallets_Bool_Exp = {
  Bundles?: InputMaybe<Bundles_Bool_Exp>;
  Contracts?: InputMaybe<Contracts_Bool_Exp>;
  MeemContractWallets?: InputMaybe<MeemContractWallets_Bool_Exp>;
  MeemContracts?: InputMaybe<MeemContracts_Bool_Exp>;
  MeemIdentities?: InputMaybe<MeemIdentities_Bool_Exp>;
  MeemIdentityWallets?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
  Meems?: InputMaybe<Meems_Bool_Exp>;
  Transactions?: InputMaybe<Transactions_Bool_Exp>;
  WalletContractInstances?: InputMaybe<WalletContractInstances_Bool_Exp>;
  _and?: InputMaybe<Array<Wallets_Bool_Exp>>;
  _not?: InputMaybe<Wallets_Bool_Exp>;
  _or?: InputMaybe<Array<Wallets_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  apiKey?: InputMaybe<Uuid_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  dailyTXLimit?: InputMaybe<Int_Comparison_Exp>;
  ens?: InputMaybe<String_Comparison_Exp>;
  ensFetchedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  nonce?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "Wallets" */
export enum Wallets_Constraint {
  /** unique or primary key constraint on columns "id" */
  WalletsPkey = 'Wallets_pkey'
}

/** input type for incrementing numeric columns in table "Wallets" */
export type Wallets_Inc_Input = {
  dailyTXLimit?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "Wallets" */
export type Wallets_Insert_Input = {
  Bundles?: InputMaybe<Bundles_Arr_Rel_Insert_Input>;
  Contracts?: InputMaybe<Contracts_Arr_Rel_Insert_Input>;
  MeemContractWallets?: InputMaybe<MeemContractWallets_Arr_Rel_Insert_Input>;
  MeemContracts?: InputMaybe<MeemContracts_Arr_Rel_Insert_Input>;
  MeemIdentities?: InputMaybe<MeemIdentities_Arr_Rel_Insert_Input>;
  MeemIdentityWallets?: InputMaybe<MeemIdentityWallets_Arr_Rel_Insert_Input>;
  Meems?: InputMaybe<Meems_Arr_Rel_Insert_Input>;
  Transactions?: InputMaybe<Transactions_Arr_Rel_Insert_Input>;
  WalletContractInstances?: InputMaybe<WalletContractInstances_Arr_Rel_Insert_Input>;
  address?: InputMaybe<Scalars['String']>;
  apiKey?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  dailyTXLimit?: InputMaybe<Scalars['Int']>;
  ens?: InputMaybe<Scalars['String']>;
  ensFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  nonce?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Wallets_Max_Fields = {
  __typename?: 'Wallets_max_fields';
  address?: Maybe<Scalars['String']>;
  apiKey?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  dailyTXLimit?: Maybe<Scalars['Int']>;
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  nonce?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Wallets_Min_Fields = {
  __typename?: 'Wallets_min_fields';
  address?: Maybe<Scalars['String']>;
  apiKey?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  dailyTXLimit?: Maybe<Scalars['Int']>;
  ens?: Maybe<Scalars['String']>;
  ensFetchedAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  nonce?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "Wallets" */
export type Wallets_Mutation_Response = {
  __typename?: 'Wallets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Wallets>;
};

/** input type for inserting object relation for remote table "Wallets" */
export type Wallets_Obj_Rel_Insert_Input = {
  data: Wallets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Wallets_On_Conflict>;
};

/** on_conflict condition type for table "Wallets" */
export type Wallets_On_Conflict = {
  constraint: Wallets_Constraint;
  update_columns?: Array<Wallets_Update_Column>;
  where?: InputMaybe<Wallets_Bool_Exp>;
};

/** Ordering options when selecting data from "Wallets". */
export type Wallets_Order_By = {
  Bundles_aggregate?: InputMaybe<Bundles_Aggregate_Order_By>;
  Contracts_aggregate?: InputMaybe<Contracts_Aggregate_Order_By>;
  MeemContractWallets_aggregate?: InputMaybe<MeemContractWallets_Aggregate_Order_By>;
  MeemContracts_aggregate?: InputMaybe<MeemContracts_Aggregate_Order_By>;
  MeemIdentities_aggregate?: InputMaybe<MeemIdentities_Aggregate_Order_By>;
  MeemIdentityWallets_aggregate?: InputMaybe<MeemIdentityWallets_Aggregate_Order_By>;
  Meems_aggregate?: InputMaybe<Meems_Aggregate_Order_By>;
  Transactions_aggregate?: InputMaybe<Transactions_Aggregate_Order_By>;
  WalletContractInstances_aggregate?: InputMaybe<WalletContractInstances_Aggregate_Order_By>;
  address?: InputMaybe<Order_By>;
  apiKey?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  dailyTXLimit?: InputMaybe<Order_By>;
  ens?: InputMaybe<Order_By>;
  ensFetchedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: Wallets */
export type Wallets_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "Wallets" */
export enum Wallets_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  ApiKey = 'apiKey',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DailyTxLimit = 'dailyTXLimit',
  /** column name */
  Ens = 'ens',
  /** column name */
  EnsFetchedAt = 'ensFetchedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Nonce = 'nonce',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "Wallets" */
export type Wallets_Set_Input = {
  address?: InputMaybe<Scalars['String']>;
  apiKey?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  dailyTXLimit?: InputMaybe<Scalars['Int']>;
  ens?: InputMaybe<Scalars['String']>;
  ensFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  nonce?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Wallets_Stddev_Fields = {
  __typename?: 'Wallets_stddev_fields';
  dailyTXLimit?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Wallets_Stddev_Pop_Fields = {
  __typename?: 'Wallets_stddev_pop_fields';
  dailyTXLimit?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Wallets_Stddev_Samp_Fields = {
  __typename?: 'Wallets_stddev_samp_fields';
  dailyTXLimit?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "Wallets" */
export type Wallets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Wallets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Wallets_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']>;
  apiKey?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  dailyTXLimit?: InputMaybe<Scalars['Int']>;
  ens?: InputMaybe<Scalars['String']>;
  ensFetchedAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  nonce?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type Wallets_Sum_Fields = {
  __typename?: 'Wallets_sum_fields';
  dailyTXLimit?: Maybe<Scalars['Int']>;
};

/** update columns of table "Wallets" */
export enum Wallets_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  ApiKey = 'apiKey',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DailyTxLimit = 'dailyTXLimit',
  /** column name */
  Ens = 'ens',
  /** column name */
  EnsFetchedAt = 'ensFetchedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Nonce = 'nonce',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Wallets_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Wallets_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Wallets_Set_Input>;
  where: Wallets_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Wallets_Var_Pop_Fields = {
  __typename?: 'Wallets_var_pop_fields';
  dailyTXLimit?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Wallets_Var_Samp_Fields = {
  __typename?: 'Wallets_var_samp_fields';
  dailyTXLimit?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Wallets_Variance_Fields = {
  __typename?: 'Wallets_variance_fields';
  dailyTXLimit?: Maybe<Scalars['Float']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
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

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "BundleContracts" */
  delete_BundleContracts?: Maybe<BundleContracts_Mutation_Response>;
  /** delete single row from the table: "BundleContracts" */
  delete_BundleContracts_by_pk?: Maybe<BundleContracts>;
  /** delete data from the table: "Bundles" */
  delete_Bundles?: Maybe<Bundles_Mutation_Response>;
  /** delete single row from the table: "Bundles" */
  delete_Bundles_by_pk?: Maybe<Bundles>;
  /** delete data from the table: "Clippings" */
  delete_Clippings?: Maybe<Clippings_Mutation_Response>;
  /** delete single row from the table: "Clippings" */
  delete_Clippings_by_pk?: Maybe<Clippings>;
  /** delete data from the table: "ContractInstances" */
  delete_ContractInstances?: Maybe<ContractInstances_Mutation_Response>;
  /** delete single row from the table: "ContractInstances" */
  delete_ContractInstances_by_pk?: Maybe<ContractInstances>;
  /** delete data from the table: "Contracts" */
  delete_Contracts?: Maybe<Contracts_Mutation_Response>;
  /** delete single row from the table: "Contracts" */
  delete_Contracts_by_pk?: Maybe<Contracts>;
  /** delete data from the table: "Discords" */
  delete_Discords?: Maybe<Discords_Mutation_Response>;
  /** delete single row from the table: "Discords" */
  delete_Discords_by_pk?: Maybe<Discords>;
  /** delete data from the table: "Hashtags" */
  delete_Hashtags?: Maybe<Hashtags_Mutation_Response>;
  /** delete single row from the table: "Hashtags" */
  delete_Hashtags_by_pk?: Maybe<Hashtags>;
  /** delete data from the table: "IdentityIntegrations" */
  delete_IdentityIntegrations?: Maybe<IdentityIntegrations_Mutation_Response>;
  /** delete single row from the table: "IdentityIntegrations" */
  delete_IdentityIntegrations_by_pk?: Maybe<IdentityIntegrations>;
  /** delete data from the table: "Integrations" */
  delete_Integrations?: Maybe<Integrations_Mutation_Response>;
  /** delete single row from the table: "Integrations" */
  delete_Integrations_by_pk?: Maybe<Integrations>;
  /** delete data from the table: "MeemContractGuilds" */
  delete_MeemContractGuilds?: Maybe<MeemContractGuilds_Mutation_Response>;
  /** delete single row from the table: "MeemContractGuilds" */
  delete_MeemContractGuilds_by_pk?: Maybe<MeemContractGuilds>;
  /** delete data from the table: "MeemContractIntegrations" */
  delete_MeemContractIntegrations?: Maybe<MeemContractIntegrations_Mutation_Response>;
  /** delete single row from the table: "MeemContractIntegrations" */
  delete_MeemContractIntegrations_by_pk?: Maybe<MeemContractIntegrations>;
  /** delete data from the table: "MeemContractRolePermissions" */
  delete_MeemContractRolePermissions?: Maybe<MeemContractRolePermissions_Mutation_Response>;
  /** delete single row from the table: "MeemContractRolePermissions" */
  delete_MeemContractRolePermissions_by_pk?: Maybe<MeemContractRolePermissions>;
  /** delete data from the table: "MeemContractRoles" */
  delete_MeemContractRoles?: Maybe<MeemContractRoles_Mutation_Response>;
  /** delete single row from the table: "MeemContractRoles" */
  delete_MeemContractRoles_by_pk?: Maybe<MeemContractRoles>;
  /** delete data from the table: "MeemContractWallets" */
  delete_MeemContractWallets?: Maybe<MeemContractWallets_Mutation_Response>;
  /** delete single row from the table: "MeemContractWallets" */
  delete_MeemContractWallets_by_pk?: Maybe<MeemContractWallets>;
  /** delete data from the table: "MeemContracts" */
  delete_MeemContracts?: Maybe<MeemContracts_Mutation_Response>;
  /** delete single row from the table: "MeemContracts" */
  delete_MeemContracts_by_pk?: Maybe<MeemContracts>;
  /** delete data from the table: "MeemIdentities" */
  delete_MeemIdentities?: Maybe<MeemIdentities_Mutation_Response>;
  /** delete single row from the table: "MeemIdentities" */
  delete_MeemIdentities_by_pk?: Maybe<MeemIdentities>;
  /** delete data from the table: "MeemIdentityIntegrations" */
  delete_MeemIdentityIntegrations?: Maybe<MeemIdentityIntegrations_Mutation_Response>;
  /** delete single row from the table: "MeemIdentityIntegrations" */
  delete_MeemIdentityIntegrations_by_pk?: Maybe<MeemIdentityIntegrations>;
  /** delete data from the table: "MeemIdentityWallets" */
  delete_MeemIdentityWallets?: Maybe<MeemIdentityWallets_Mutation_Response>;
  /** delete single row from the table: "MeemIdentityWallets" */
  delete_MeemIdentityWallets_by_pk?: Maybe<MeemIdentityWallets>;
  /** delete data from the table: "Meems" */
  delete_Meems?: Maybe<Meems_Mutation_Response>;
  /** delete single row from the table: "Meems" */
  delete_Meems_by_pk?: Maybe<Meems>;
  /** delete data from the table: "Reactions" */
  delete_Reactions?: Maybe<Reactions_Mutation_Response>;
  /** delete single row from the table: "Reactions" */
  delete_Reactions_by_pk?: Maybe<Reactions>;
  /** delete data from the table: "RolePermissions" */
  delete_RolePermissions?: Maybe<RolePermissions_Mutation_Response>;
  /** delete single row from the table: "RolePermissions" */
  delete_RolePermissions_by_pk?: Maybe<RolePermissions>;
  /** delete data from the table: "SequelizeMeta" */
  delete_SequelizeMeta?: Maybe<SequelizeMeta_Mutation_Response>;
  /** delete single row from the table: "SequelizeMeta" */
  delete_SequelizeMeta_by_pk?: Maybe<SequelizeMeta>;
  /** delete data from the table: "Transactions" */
  delete_Transactions?: Maybe<Transactions_Mutation_Response>;
  /** delete single row from the table: "Transactions" */
  delete_Transactions_by_pk?: Maybe<Transactions>;
  /** delete data from the table: "Transfers" */
  delete_Transfers?: Maybe<Transfers_Mutation_Response>;
  /** delete single row from the table: "Transfers" */
  delete_Transfers_by_pk?: Maybe<Transfers>;
  /** delete data from the table: "TweetHashtags" */
  delete_TweetHashtags?: Maybe<TweetHashtags_Mutation_Response>;
  /** delete single row from the table: "TweetHashtags" */
  delete_TweetHashtags_by_pk?: Maybe<TweetHashtags>;
  /** delete data from the table: "Tweets" */
  delete_Tweets?: Maybe<Tweets_Mutation_Response>;
  /** delete single row from the table: "Tweets" */
  delete_Tweets_by_pk?: Maybe<Tweets>;
  /** delete data from the table: "Twitters" */
  delete_Twitters?: Maybe<Twitters_Mutation_Response>;
  /** delete single row from the table: "Twitters" */
  delete_Twitters_by_pk?: Maybe<Twitters>;
  /** delete data from the table: "WalletContractInstances" */
  delete_WalletContractInstances?: Maybe<WalletContractInstances_Mutation_Response>;
  /** delete single row from the table: "WalletContractInstances" */
  delete_WalletContractInstances_by_pk?: Maybe<WalletContractInstances>;
  /** delete data from the table: "Wallets" */
  delete_Wallets?: Maybe<Wallets_Mutation_Response>;
  /** delete single row from the table: "Wallets" */
  delete_Wallets_by_pk?: Maybe<Wallets>;
  /** insert data into the table: "BundleContracts" */
  insert_BundleContracts?: Maybe<BundleContracts_Mutation_Response>;
  /** insert a single row into the table: "BundleContracts" */
  insert_BundleContracts_one?: Maybe<BundleContracts>;
  /** insert data into the table: "Bundles" */
  insert_Bundles?: Maybe<Bundles_Mutation_Response>;
  /** insert a single row into the table: "Bundles" */
  insert_Bundles_one?: Maybe<Bundles>;
  /** insert data into the table: "Clippings" */
  insert_Clippings?: Maybe<Clippings_Mutation_Response>;
  /** insert a single row into the table: "Clippings" */
  insert_Clippings_one?: Maybe<Clippings>;
  /** insert data into the table: "ContractInstances" */
  insert_ContractInstances?: Maybe<ContractInstances_Mutation_Response>;
  /** insert a single row into the table: "ContractInstances" */
  insert_ContractInstances_one?: Maybe<ContractInstances>;
  /** insert data into the table: "Contracts" */
  insert_Contracts?: Maybe<Contracts_Mutation_Response>;
  /** insert a single row into the table: "Contracts" */
  insert_Contracts_one?: Maybe<Contracts>;
  /** insert data into the table: "Discords" */
  insert_Discords?: Maybe<Discords_Mutation_Response>;
  /** insert a single row into the table: "Discords" */
  insert_Discords_one?: Maybe<Discords>;
  /** insert data into the table: "Hashtags" */
  insert_Hashtags?: Maybe<Hashtags_Mutation_Response>;
  /** insert a single row into the table: "Hashtags" */
  insert_Hashtags_one?: Maybe<Hashtags>;
  /** insert data into the table: "IdentityIntegrations" */
  insert_IdentityIntegrations?: Maybe<IdentityIntegrations_Mutation_Response>;
  /** insert a single row into the table: "IdentityIntegrations" */
  insert_IdentityIntegrations_one?: Maybe<IdentityIntegrations>;
  /** insert data into the table: "Integrations" */
  insert_Integrations?: Maybe<Integrations_Mutation_Response>;
  /** insert a single row into the table: "Integrations" */
  insert_Integrations_one?: Maybe<Integrations>;
  /** insert data into the table: "MeemContractGuilds" */
  insert_MeemContractGuilds?: Maybe<MeemContractGuilds_Mutation_Response>;
  /** insert a single row into the table: "MeemContractGuilds" */
  insert_MeemContractGuilds_one?: Maybe<MeemContractGuilds>;
  /** insert data into the table: "MeemContractIntegrations" */
  insert_MeemContractIntegrations?: Maybe<MeemContractIntegrations_Mutation_Response>;
  /** insert a single row into the table: "MeemContractIntegrations" */
  insert_MeemContractIntegrations_one?: Maybe<MeemContractIntegrations>;
  /** insert data into the table: "MeemContractRolePermissions" */
  insert_MeemContractRolePermissions?: Maybe<MeemContractRolePermissions_Mutation_Response>;
  /** insert a single row into the table: "MeemContractRolePermissions" */
  insert_MeemContractRolePermissions_one?: Maybe<MeemContractRolePermissions>;
  /** insert data into the table: "MeemContractRoles" */
  insert_MeemContractRoles?: Maybe<MeemContractRoles_Mutation_Response>;
  /** insert a single row into the table: "MeemContractRoles" */
  insert_MeemContractRoles_one?: Maybe<MeemContractRoles>;
  /** insert data into the table: "MeemContractWallets" */
  insert_MeemContractWallets?: Maybe<MeemContractWallets_Mutation_Response>;
  /** insert a single row into the table: "MeemContractWallets" */
  insert_MeemContractWallets_one?: Maybe<MeemContractWallets>;
  /** insert data into the table: "MeemContracts" */
  insert_MeemContracts?: Maybe<MeemContracts_Mutation_Response>;
  /** insert a single row into the table: "MeemContracts" */
  insert_MeemContracts_one?: Maybe<MeemContracts>;
  /** insert data into the table: "MeemIdentities" */
  insert_MeemIdentities?: Maybe<MeemIdentities_Mutation_Response>;
  /** insert a single row into the table: "MeemIdentities" */
  insert_MeemIdentities_one?: Maybe<MeemIdentities>;
  /** insert data into the table: "MeemIdentityIntegrations" */
  insert_MeemIdentityIntegrations?: Maybe<MeemIdentityIntegrations_Mutation_Response>;
  /** insert a single row into the table: "MeemIdentityIntegrations" */
  insert_MeemIdentityIntegrations_one?: Maybe<MeemIdentityIntegrations>;
  /** insert data into the table: "MeemIdentityWallets" */
  insert_MeemIdentityWallets?: Maybe<MeemIdentityWallets_Mutation_Response>;
  /** insert a single row into the table: "MeemIdentityWallets" */
  insert_MeemIdentityWallets_one?: Maybe<MeemIdentityWallets>;
  /** insert data into the table: "Meems" */
  insert_Meems?: Maybe<Meems_Mutation_Response>;
  /** insert a single row into the table: "Meems" */
  insert_Meems_one?: Maybe<Meems>;
  /** insert data into the table: "Reactions" */
  insert_Reactions?: Maybe<Reactions_Mutation_Response>;
  /** insert a single row into the table: "Reactions" */
  insert_Reactions_one?: Maybe<Reactions>;
  /** insert data into the table: "RolePermissions" */
  insert_RolePermissions?: Maybe<RolePermissions_Mutation_Response>;
  /** insert a single row into the table: "RolePermissions" */
  insert_RolePermissions_one?: Maybe<RolePermissions>;
  /** insert data into the table: "SequelizeMeta" */
  insert_SequelizeMeta?: Maybe<SequelizeMeta_Mutation_Response>;
  /** insert a single row into the table: "SequelizeMeta" */
  insert_SequelizeMeta_one?: Maybe<SequelizeMeta>;
  /** insert data into the table: "Transactions" */
  insert_Transactions?: Maybe<Transactions_Mutation_Response>;
  /** insert a single row into the table: "Transactions" */
  insert_Transactions_one?: Maybe<Transactions>;
  /** insert data into the table: "Transfers" */
  insert_Transfers?: Maybe<Transfers_Mutation_Response>;
  /** insert a single row into the table: "Transfers" */
  insert_Transfers_one?: Maybe<Transfers>;
  /** insert data into the table: "TweetHashtags" */
  insert_TweetHashtags?: Maybe<TweetHashtags_Mutation_Response>;
  /** insert a single row into the table: "TweetHashtags" */
  insert_TweetHashtags_one?: Maybe<TweetHashtags>;
  /** insert data into the table: "Tweets" */
  insert_Tweets?: Maybe<Tweets_Mutation_Response>;
  /** insert a single row into the table: "Tweets" */
  insert_Tweets_one?: Maybe<Tweets>;
  /** insert data into the table: "Twitters" */
  insert_Twitters?: Maybe<Twitters_Mutation_Response>;
  /** insert a single row into the table: "Twitters" */
  insert_Twitters_one?: Maybe<Twitters>;
  /** insert data into the table: "WalletContractInstances" */
  insert_WalletContractInstances?: Maybe<WalletContractInstances_Mutation_Response>;
  /** insert a single row into the table: "WalletContractInstances" */
  insert_WalletContractInstances_one?: Maybe<WalletContractInstances>;
  /** insert data into the table: "Wallets" */
  insert_Wallets?: Maybe<Wallets_Mutation_Response>;
  /** insert a single row into the table: "Wallets" */
  insert_Wallets_one?: Maybe<Wallets>;
  /** update data of the table: "BundleContracts" */
  update_BundleContracts?: Maybe<BundleContracts_Mutation_Response>;
  /** update single row of the table: "BundleContracts" */
  update_BundleContracts_by_pk?: Maybe<BundleContracts>;
  /** update multiples rows of table: "BundleContracts" */
  update_BundleContracts_many?: Maybe<Array<Maybe<BundleContracts_Mutation_Response>>>;
  /** update data of the table: "Bundles" */
  update_Bundles?: Maybe<Bundles_Mutation_Response>;
  /** update single row of the table: "Bundles" */
  update_Bundles_by_pk?: Maybe<Bundles>;
  /** update multiples rows of table: "Bundles" */
  update_Bundles_many?: Maybe<Array<Maybe<Bundles_Mutation_Response>>>;
  /** update data of the table: "Clippings" */
  update_Clippings?: Maybe<Clippings_Mutation_Response>;
  /** update single row of the table: "Clippings" */
  update_Clippings_by_pk?: Maybe<Clippings>;
  /** update multiples rows of table: "Clippings" */
  update_Clippings_many?: Maybe<Array<Maybe<Clippings_Mutation_Response>>>;
  /** update data of the table: "ContractInstances" */
  update_ContractInstances?: Maybe<ContractInstances_Mutation_Response>;
  /** update single row of the table: "ContractInstances" */
  update_ContractInstances_by_pk?: Maybe<ContractInstances>;
  /** update multiples rows of table: "ContractInstances" */
  update_ContractInstances_many?: Maybe<Array<Maybe<ContractInstances_Mutation_Response>>>;
  /** update data of the table: "Contracts" */
  update_Contracts?: Maybe<Contracts_Mutation_Response>;
  /** update single row of the table: "Contracts" */
  update_Contracts_by_pk?: Maybe<Contracts>;
  /** update multiples rows of table: "Contracts" */
  update_Contracts_many?: Maybe<Array<Maybe<Contracts_Mutation_Response>>>;
  /** update data of the table: "Discords" */
  update_Discords?: Maybe<Discords_Mutation_Response>;
  /** update single row of the table: "Discords" */
  update_Discords_by_pk?: Maybe<Discords>;
  /** update multiples rows of table: "Discords" */
  update_Discords_many?: Maybe<Array<Maybe<Discords_Mutation_Response>>>;
  /** update data of the table: "Hashtags" */
  update_Hashtags?: Maybe<Hashtags_Mutation_Response>;
  /** update single row of the table: "Hashtags" */
  update_Hashtags_by_pk?: Maybe<Hashtags>;
  /** update multiples rows of table: "Hashtags" */
  update_Hashtags_many?: Maybe<Array<Maybe<Hashtags_Mutation_Response>>>;
  /** update data of the table: "IdentityIntegrations" */
  update_IdentityIntegrations?: Maybe<IdentityIntegrations_Mutation_Response>;
  /** update single row of the table: "IdentityIntegrations" */
  update_IdentityIntegrations_by_pk?: Maybe<IdentityIntegrations>;
  /** update multiples rows of table: "IdentityIntegrations" */
  update_IdentityIntegrations_many?: Maybe<Array<Maybe<IdentityIntegrations_Mutation_Response>>>;
  /** update data of the table: "Integrations" */
  update_Integrations?: Maybe<Integrations_Mutation_Response>;
  /** update single row of the table: "Integrations" */
  update_Integrations_by_pk?: Maybe<Integrations>;
  /** update multiples rows of table: "Integrations" */
  update_Integrations_many?: Maybe<Array<Maybe<Integrations_Mutation_Response>>>;
  /** update data of the table: "MeemContractGuilds" */
  update_MeemContractGuilds?: Maybe<MeemContractGuilds_Mutation_Response>;
  /** update single row of the table: "MeemContractGuilds" */
  update_MeemContractGuilds_by_pk?: Maybe<MeemContractGuilds>;
  /** update multiples rows of table: "MeemContractGuilds" */
  update_MeemContractGuilds_many?: Maybe<Array<Maybe<MeemContractGuilds_Mutation_Response>>>;
  /** update data of the table: "MeemContractIntegrations" */
  update_MeemContractIntegrations?: Maybe<MeemContractIntegrations_Mutation_Response>;
  /** update single row of the table: "MeemContractIntegrations" */
  update_MeemContractIntegrations_by_pk?: Maybe<MeemContractIntegrations>;
  /** update multiples rows of table: "MeemContractIntegrations" */
  update_MeemContractIntegrations_many?: Maybe<Array<Maybe<MeemContractIntegrations_Mutation_Response>>>;
  /** update data of the table: "MeemContractRolePermissions" */
  update_MeemContractRolePermissions?: Maybe<MeemContractRolePermissions_Mutation_Response>;
  /** update single row of the table: "MeemContractRolePermissions" */
  update_MeemContractRolePermissions_by_pk?: Maybe<MeemContractRolePermissions>;
  /** update multiples rows of table: "MeemContractRolePermissions" */
  update_MeemContractRolePermissions_many?: Maybe<Array<Maybe<MeemContractRolePermissions_Mutation_Response>>>;
  /** update data of the table: "MeemContractRoles" */
  update_MeemContractRoles?: Maybe<MeemContractRoles_Mutation_Response>;
  /** update single row of the table: "MeemContractRoles" */
  update_MeemContractRoles_by_pk?: Maybe<MeemContractRoles>;
  /** update multiples rows of table: "MeemContractRoles" */
  update_MeemContractRoles_many?: Maybe<Array<Maybe<MeemContractRoles_Mutation_Response>>>;
  /** update data of the table: "MeemContractWallets" */
  update_MeemContractWallets?: Maybe<MeemContractWallets_Mutation_Response>;
  /** update single row of the table: "MeemContractWallets" */
  update_MeemContractWallets_by_pk?: Maybe<MeemContractWallets>;
  /** update multiples rows of table: "MeemContractWallets" */
  update_MeemContractWallets_many?: Maybe<Array<Maybe<MeemContractWallets_Mutation_Response>>>;
  /** update data of the table: "MeemContracts" */
  update_MeemContracts?: Maybe<MeemContracts_Mutation_Response>;
  /** update single row of the table: "MeemContracts" */
  update_MeemContracts_by_pk?: Maybe<MeemContracts>;
  /** update multiples rows of table: "MeemContracts" */
  update_MeemContracts_many?: Maybe<Array<Maybe<MeemContracts_Mutation_Response>>>;
  /** update data of the table: "MeemIdentities" */
  update_MeemIdentities?: Maybe<MeemIdentities_Mutation_Response>;
  /** update single row of the table: "MeemIdentities" */
  update_MeemIdentities_by_pk?: Maybe<MeemIdentities>;
  /** update multiples rows of table: "MeemIdentities" */
  update_MeemIdentities_many?: Maybe<Array<Maybe<MeemIdentities_Mutation_Response>>>;
  /** update data of the table: "MeemIdentityIntegrations" */
  update_MeemIdentityIntegrations?: Maybe<MeemIdentityIntegrations_Mutation_Response>;
  /** update single row of the table: "MeemIdentityIntegrations" */
  update_MeemIdentityIntegrations_by_pk?: Maybe<MeemIdentityIntegrations>;
  /** update multiples rows of table: "MeemIdentityIntegrations" */
  update_MeemIdentityIntegrations_many?: Maybe<Array<Maybe<MeemIdentityIntegrations_Mutation_Response>>>;
  /** update data of the table: "MeemIdentityWallets" */
  update_MeemIdentityWallets?: Maybe<MeemIdentityWallets_Mutation_Response>;
  /** update single row of the table: "MeemIdentityWallets" */
  update_MeemIdentityWallets_by_pk?: Maybe<MeemIdentityWallets>;
  /** update multiples rows of table: "MeemIdentityWallets" */
  update_MeemIdentityWallets_many?: Maybe<Array<Maybe<MeemIdentityWallets_Mutation_Response>>>;
  /** update data of the table: "Meems" */
  update_Meems?: Maybe<Meems_Mutation_Response>;
  /** update single row of the table: "Meems" */
  update_Meems_by_pk?: Maybe<Meems>;
  /** update multiples rows of table: "Meems" */
  update_Meems_many?: Maybe<Array<Maybe<Meems_Mutation_Response>>>;
  /** update data of the table: "Reactions" */
  update_Reactions?: Maybe<Reactions_Mutation_Response>;
  /** update single row of the table: "Reactions" */
  update_Reactions_by_pk?: Maybe<Reactions>;
  /** update multiples rows of table: "Reactions" */
  update_Reactions_many?: Maybe<Array<Maybe<Reactions_Mutation_Response>>>;
  /** update data of the table: "RolePermissions" */
  update_RolePermissions?: Maybe<RolePermissions_Mutation_Response>;
  /** update single row of the table: "RolePermissions" */
  update_RolePermissions_by_pk?: Maybe<RolePermissions>;
  /** update multiples rows of table: "RolePermissions" */
  update_RolePermissions_many?: Maybe<Array<Maybe<RolePermissions_Mutation_Response>>>;
  /** update data of the table: "SequelizeMeta" */
  update_SequelizeMeta?: Maybe<SequelizeMeta_Mutation_Response>;
  /** update single row of the table: "SequelizeMeta" */
  update_SequelizeMeta_by_pk?: Maybe<SequelizeMeta>;
  /** update multiples rows of table: "SequelizeMeta" */
  update_SequelizeMeta_many?: Maybe<Array<Maybe<SequelizeMeta_Mutation_Response>>>;
  /** update data of the table: "Transactions" */
  update_Transactions?: Maybe<Transactions_Mutation_Response>;
  /** update single row of the table: "Transactions" */
  update_Transactions_by_pk?: Maybe<Transactions>;
  /** update multiples rows of table: "Transactions" */
  update_Transactions_many?: Maybe<Array<Maybe<Transactions_Mutation_Response>>>;
  /** update data of the table: "Transfers" */
  update_Transfers?: Maybe<Transfers_Mutation_Response>;
  /** update single row of the table: "Transfers" */
  update_Transfers_by_pk?: Maybe<Transfers>;
  /** update multiples rows of table: "Transfers" */
  update_Transfers_many?: Maybe<Array<Maybe<Transfers_Mutation_Response>>>;
  /** update data of the table: "TweetHashtags" */
  update_TweetHashtags?: Maybe<TweetHashtags_Mutation_Response>;
  /** update single row of the table: "TweetHashtags" */
  update_TweetHashtags_by_pk?: Maybe<TweetHashtags>;
  /** update multiples rows of table: "TweetHashtags" */
  update_TweetHashtags_many?: Maybe<Array<Maybe<TweetHashtags_Mutation_Response>>>;
  /** update data of the table: "Tweets" */
  update_Tweets?: Maybe<Tweets_Mutation_Response>;
  /** update single row of the table: "Tweets" */
  update_Tweets_by_pk?: Maybe<Tweets>;
  /** update multiples rows of table: "Tweets" */
  update_Tweets_many?: Maybe<Array<Maybe<Tweets_Mutation_Response>>>;
  /** update data of the table: "Twitters" */
  update_Twitters?: Maybe<Twitters_Mutation_Response>;
  /** update single row of the table: "Twitters" */
  update_Twitters_by_pk?: Maybe<Twitters>;
  /** update multiples rows of table: "Twitters" */
  update_Twitters_many?: Maybe<Array<Maybe<Twitters_Mutation_Response>>>;
  /** update data of the table: "WalletContractInstances" */
  update_WalletContractInstances?: Maybe<WalletContractInstances_Mutation_Response>;
  /** update single row of the table: "WalletContractInstances" */
  update_WalletContractInstances_by_pk?: Maybe<WalletContractInstances>;
  /** update multiples rows of table: "WalletContractInstances" */
  update_WalletContractInstances_many?: Maybe<Array<Maybe<WalletContractInstances_Mutation_Response>>>;
  /** update data of the table: "Wallets" */
  update_Wallets?: Maybe<Wallets_Mutation_Response>;
  /** update single row of the table: "Wallets" */
  update_Wallets_by_pk?: Maybe<Wallets>;
  /** update multiples rows of table: "Wallets" */
  update_Wallets_many?: Maybe<Array<Maybe<Wallets_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_BundleContractsArgs = {
  where: BundleContracts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_BundleContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_BundlesArgs = {
  where: Bundles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bundles_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_ClippingsArgs = {
  where: Clippings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Clippings_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_ContractInstancesArgs = {
  where: ContractInstances_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_ContractInstances_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_ContractsArgs = {
  where: Contracts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Contracts_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_DiscordsArgs = {
  where: Discords_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Discords_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_HashtagsArgs = {
  where: Hashtags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Hashtags_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_IdentityIntegrationsArgs = {
  where: IdentityIntegrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_IdentityIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_IntegrationsArgs = {
  where: Integrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Integrations_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemContractGuildsArgs = {
  where: MeemContractGuilds_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemContractGuilds_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemContractIntegrationsArgs = {
  where: MeemContractIntegrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemContractIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemContractRolePermissionsArgs = {
  where: MeemContractRolePermissions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemContractRolePermissions_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemContractRolesArgs = {
  where: MeemContractRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemContractRoles_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemContractWalletsArgs = {
  where: MeemContractWallets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemContractWallets_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemContractsArgs = {
  where: MeemContracts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemIdentitiesArgs = {
  where: MeemIdentities_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemIdentities_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemIdentityIntegrationsArgs = {
  where: MeemIdentityIntegrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemIdentityIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemIdentityWalletsArgs = {
  where: MeemIdentityWallets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_MeemIdentityWallets_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_MeemsArgs = {
  where: Meems_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Meems_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_ReactionsArgs = {
  where: Reactions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Reactions_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_RolePermissionsArgs = {
  where: RolePermissions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_RolePermissions_By_PkArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_SequelizeMetaArgs = {
  where: SequelizeMeta_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_SequelizeMeta_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_TransactionsArgs = {
  where: Transactions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Transactions_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TransfersArgs = {
  where: Transfers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Transfers_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TweetHashtagsArgs = {
  where: TweetHashtags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_TweetHashtags_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TweetsArgs = {
  where: Tweets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Tweets_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TwittersArgs = {
  where: Twitters_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Twitters_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_WalletContractInstancesArgs = {
  where: WalletContractInstances_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_WalletContractInstances_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_WalletsArgs = {
  where: Wallets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Wallets_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_BundleContractsArgs = {
  objects: Array<BundleContracts_Insert_Input>;
  on_conflict?: InputMaybe<BundleContracts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_BundleContracts_OneArgs = {
  object: BundleContracts_Insert_Input;
  on_conflict?: InputMaybe<BundleContracts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_BundlesArgs = {
  objects: Array<Bundles_Insert_Input>;
  on_conflict?: InputMaybe<Bundles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bundles_OneArgs = {
  object: Bundles_Insert_Input;
  on_conflict?: InputMaybe<Bundles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ClippingsArgs = {
  objects: Array<Clippings_Insert_Input>;
  on_conflict?: InputMaybe<Clippings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clippings_OneArgs = {
  object: Clippings_Insert_Input;
  on_conflict?: InputMaybe<Clippings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ContractInstancesArgs = {
  objects: Array<ContractInstances_Insert_Input>;
  on_conflict?: InputMaybe<ContractInstances_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ContractInstances_OneArgs = {
  object: ContractInstances_Insert_Input;
  on_conflict?: InputMaybe<ContractInstances_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ContractsArgs = {
  objects: Array<Contracts_Insert_Input>;
  on_conflict?: InputMaybe<Contracts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Contracts_OneArgs = {
  object: Contracts_Insert_Input;
  on_conflict?: InputMaybe<Contracts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_DiscordsArgs = {
  objects: Array<Discords_Insert_Input>;
  on_conflict?: InputMaybe<Discords_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Discords_OneArgs = {
  object: Discords_Insert_Input;
  on_conflict?: InputMaybe<Discords_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_HashtagsArgs = {
  objects: Array<Hashtags_Insert_Input>;
  on_conflict?: InputMaybe<Hashtags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Hashtags_OneArgs = {
  object: Hashtags_Insert_Input;
  on_conflict?: InputMaybe<Hashtags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IdentityIntegrationsArgs = {
  objects: Array<IdentityIntegrations_Insert_Input>;
  on_conflict?: InputMaybe<IdentityIntegrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IdentityIntegrations_OneArgs = {
  object: IdentityIntegrations_Insert_Input;
  on_conflict?: InputMaybe<IdentityIntegrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IntegrationsArgs = {
  objects: Array<Integrations_Insert_Input>;
  on_conflict?: InputMaybe<Integrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Integrations_OneArgs = {
  object: Integrations_Insert_Input;
  on_conflict?: InputMaybe<Integrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractGuildsArgs = {
  objects: Array<MeemContractGuilds_Insert_Input>;
  on_conflict?: InputMaybe<MeemContractGuilds_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractGuilds_OneArgs = {
  object: MeemContractGuilds_Insert_Input;
  on_conflict?: InputMaybe<MeemContractGuilds_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractIntegrationsArgs = {
  objects: Array<MeemContractIntegrations_Insert_Input>;
  on_conflict?: InputMaybe<MeemContractIntegrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractIntegrations_OneArgs = {
  object: MeemContractIntegrations_Insert_Input;
  on_conflict?: InputMaybe<MeemContractIntegrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractRolePermissionsArgs = {
  objects: Array<MeemContractRolePermissions_Insert_Input>;
  on_conflict?: InputMaybe<MeemContractRolePermissions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractRolePermissions_OneArgs = {
  object: MeemContractRolePermissions_Insert_Input;
  on_conflict?: InputMaybe<MeemContractRolePermissions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractRolesArgs = {
  objects: Array<MeemContractRoles_Insert_Input>;
  on_conflict?: InputMaybe<MeemContractRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractRoles_OneArgs = {
  object: MeemContractRoles_Insert_Input;
  on_conflict?: InputMaybe<MeemContractRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractWalletsArgs = {
  objects: Array<MeemContractWallets_Insert_Input>;
  on_conflict?: InputMaybe<MeemContractWallets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractWallets_OneArgs = {
  object: MeemContractWallets_Insert_Input;
  on_conflict?: InputMaybe<MeemContractWallets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContractsArgs = {
  objects: Array<MeemContracts_Insert_Input>;
  on_conflict?: InputMaybe<MeemContracts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemContracts_OneArgs = {
  object: MeemContracts_Insert_Input;
  on_conflict?: InputMaybe<MeemContracts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemIdentitiesArgs = {
  objects: Array<MeemIdentities_Insert_Input>;
  on_conflict?: InputMaybe<MeemIdentities_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemIdentities_OneArgs = {
  object: MeemIdentities_Insert_Input;
  on_conflict?: InputMaybe<MeemIdentities_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemIdentityIntegrationsArgs = {
  objects: Array<MeemIdentityIntegrations_Insert_Input>;
  on_conflict?: InputMaybe<MeemIdentityIntegrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemIdentityIntegrations_OneArgs = {
  object: MeemIdentityIntegrations_Insert_Input;
  on_conflict?: InputMaybe<MeemIdentityIntegrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemIdentityWalletsArgs = {
  objects: Array<MeemIdentityWallets_Insert_Input>;
  on_conflict?: InputMaybe<MeemIdentityWallets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemIdentityWallets_OneArgs = {
  object: MeemIdentityWallets_Insert_Input;
  on_conflict?: InputMaybe<MeemIdentityWallets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MeemsArgs = {
  objects: Array<Meems_Insert_Input>;
  on_conflict?: InputMaybe<Meems_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Meems_OneArgs = {
  object: Meems_Insert_Input;
  on_conflict?: InputMaybe<Meems_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ReactionsArgs = {
  objects: Array<Reactions_Insert_Input>;
  on_conflict?: InputMaybe<Reactions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Reactions_OneArgs = {
  object: Reactions_Insert_Input;
  on_conflict?: InputMaybe<Reactions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RolePermissionsArgs = {
  objects: Array<RolePermissions_Insert_Input>;
  on_conflict?: InputMaybe<RolePermissions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RolePermissions_OneArgs = {
  object: RolePermissions_Insert_Input;
  on_conflict?: InputMaybe<RolePermissions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_SequelizeMetaArgs = {
  objects: Array<SequelizeMeta_Insert_Input>;
  on_conflict?: InputMaybe<SequelizeMeta_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_SequelizeMeta_OneArgs = {
  object: SequelizeMeta_Insert_Input;
  on_conflict?: InputMaybe<SequelizeMeta_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TransactionsArgs = {
  objects: Array<Transactions_Insert_Input>;
  on_conflict?: InputMaybe<Transactions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Transactions_OneArgs = {
  object: Transactions_Insert_Input;
  on_conflict?: InputMaybe<Transactions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TransfersArgs = {
  objects: Array<Transfers_Insert_Input>;
  on_conflict?: InputMaybe<Transfers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Transfers_OneArgs = {
  object: Transfers_Insert_Input;
  on_conflict?: InputMaybe<Transfers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TweetHashtagsArgs = {
  objects: Array<TweetHashtags_Insert_Input>;
  on_conflict?: InputMaybe<TweetHashtags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TweetHashtags_OneArgs = {
  object: TweetHashtags_Insert_Input;
  on_conflict?: InputMaybe<TweetHashtags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TweetsArgs = {
  objects: Array<Tweets_Insert_Input>;
  on_conflict?: InputMaybe<Tweets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Tweets_OneArgs = {
  object: Tweets_Insert_Input;
  on_conflict?: InputMaybe<Tweets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TwittersArgs = {
  objects: Array<Twitters_Insert_Input>;
  on_conflict?: InputMaybe<Twitters_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Twitters_OneArgs = {
  object: Twitters_Insert_Input;
  on_conflict?: InputMaybe<Twitters_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_WalletContractInstancesArgs = {
  objects: Array<WalletContractInstances_Insert_Input>;
  on_conflict?: InputMaybe<WalletContractInstances_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_WalletContractInstances_OneArgs = {
  object: WalletContractInstances_Insert_Input;
  on_conflict?: InputMaybe<WalletContractInstances_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_WalletsArgs = {
  objects: Array<Wallets_Insert_Input>;
  on_conflict?: InputMaybe<Wallets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Wallets_OneArgs = {
  object: Wallets_Insert_Input;
  on_conflict?: InputMaybe<Wallets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_BundleContractsArgs = {
  _append?: InputMaybe<BundleContracts_Append_Input>;
  _delete_at_path?: InputMaybe<BundleContracts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<BundleContracts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<BundleContracts_Delete_Key_Input>;
  _inc?: InputMaybe<BundleContracts_Inc_Input>;
  _prepend?: InputMaybe<BundleContracts_Prepend_Input>;
  _set?: InputMaybe<BundleContracts_Set_Input>;
  where: BundleContracts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_BundleContracts_By_PkArgs = {
  _append?: InputMaybe<BundleContracts_Append_Input>;
  _delete_at_path?: InputMaybe<BundleContracts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<BundleContracts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<BundleContracts_Delete_Key_Input>;
  _inc?: InputMaybe<BundleContracts_Inc_Input>;
  _prepend?: InputMaybe<BundleContracts_Prepend_Input>;
  _set?: InputMaybe<BundleContracts_Set_Input>;
  pk_columns: BundleContracts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_BundleContracts_ManyArgs = {
  updates: Array<BundleContracts_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_BundlesArgs = {
  _append?: InputMaybe<Bundles_Append_Input>;
  _delete_at_path?: InputMaybe<Bundles_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Bundles_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Bundles_Delete_Key_Input>;
  _prepend?: InputMaybe<Bundles_Prepend_Input>;
  _set?: InputMaybe<Bundles_Set_Input>;
  where: Bundles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bundles_By_PkArgs = {
  _append?: InputMaybe<Bundles_Append_Input>;
  _delete_at_path?: InputMaybe<Bundles_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Bundles_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Bundles_Delete_Key_Input>;
  _prepend?: InputMaybe<Bundles_Prepend_Input>;
  _set?: InputMaybe<Bundles_Set_Input>;
  pk_columns: Bundles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bundles_ManyArgs = {
  updates: Array<Bundles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ClippingsArgs = {
  _set?: InputMaybe<Clippings_Set_Input>;
  where: Clippings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clippings_By_PkArgs = {
  _set?: InputMaybe<Clippings_Set_Input>;
  pk_columns: Clippings_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Clippings_ManyArgs = {
  updates: Array<Clippings_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ContractInstancesArgs = {
  _inc?: InputMaybe<ContractInstances_Inc_Input>;
  _set?: InputMaybe<ContractInstances_Set_Input>;
  where: ContractInstances_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_ContractInstances_By_PkArgs = {
  _inc?: InputMaybe<ContractInstances_Inc_Input>;
  _set?: InputMaybe<ContractInstances_Set_Input>;
  pk_columns: ContractInstances_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ContractInstances_ManyArgs = {
  updates: Array<ContractInstances_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ContractsArgs = {
  _append?: InputMaybe<Contracts_Append_Input>;
  _delete_at_path?: InputMaybe<Contracts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Contracts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Contracts_Delete_Key_Input>;
  _inc?: InputMaybe<Contracts_Inc_Input>;
  _prepend?: InputMaybe<Contracts_Prepend_Input>;
  _set?: InputMaybe<Contracts_Set_Input>;
  where: Contracts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Contracts_By_PkArgs = {
  _append?: InputMaybe<Contracts_Append_Input>;
  _delete_at_path?: InputMaybe<Contracts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Contracts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Contracts_Delete_Key_Input>;
  _inc?: InputMaybe<Contracts_Inc_Input>;
  _prepend?: InputMaybe<Contracts_Prepend_Input>;
  _set?: InputMaybe<Contracts_Set_Input>;
  pk_columns: Contracts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Contracts_ManyArgs = {
  updates: Array<Contracts_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_DiscordsArgs = {
  _set?: InputMaybe<Discords_Set_Input>;
  where: Discords_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Discords_By_PkArgs = {
  _set?: InputMaybe<Discords_Set_Input>;
  pk_columns: Discords_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Discords_ManyArgs = {
  updates: Array<Discords_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_HashtagsArgs = {
  _set?: InputMaybe<Hashtags_Set_Input>;
  where: Hashtags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Hashtags_By_PkArgs = {
  _set?: InputMaybe<Hashtags_Set_Input>;
  pk_columns: Hashtags_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Hashtags_ManyArgs = {
  updates: Array<Hashtags_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_IdentityIntegrationsArgs = {
  _set?: InputMaybe<IdentityIntegrations_Set_Input>;
  where: IdentityIntegrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_IdentityIntegrations_By_PkArgs = {
  _set?: InputMaybe<IdentityIntegrations_Set_Input>;
  pk_columns: IdentityIntegrations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_IdentityIntegrations_ManyArgs = {
  updates: Array<IdentityIntegrations_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_IntegrationsArgs = {
  _set?: InputMaybe<Integrations_Set_Input>;
  where: Integrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Integrations_By_PkArgs = {
  _set?: InputMaybe<Integrations_Set_Input>;
  pk_columns: Integrations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Integrations_ManyArgs = {
  updates: Array<Integrations_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractGuildsArgs = {
  _inc?: InputMaybe<MeemContractGuilds_Inc_Input>;
  _set?: InputMaybe<MeemContractGuilds_Set_Input>;
  where: MeemContractGuilds_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractGuilds_By_PkArgs = {
  _inc?: InputMaybe<MeemContractGuilds_Inc_Input>;
  _set?: InputMaybe<MeemContractGuilds_Set_Input>;
  pk_columns: MeemContractGuilds_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractGuilds_ManyArgs = {
  updates: Array<MeemContractGuilds_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractIntegrationsArgs = {
  _append?: InputMaybe<MeemContractIntegrations_Append_Input>;
  _delete_at_path?: InputMaybe<MeemContractIntegrations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<MeemContractIntegrations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<MeemContractIntegrations_Delete_Key_Input>;
  _prepend?: InputMaybe<MeemContractIntegrations_Prepend_Input>;
  _set?: InputMaybe<MeemContractIntegrations_Set_Input>;
  where: MeemContractIntegrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractIntegrations_By_PkArgs = {
  _append?: InputMaybe<MeemContractIntegrations_Append_Input>;
  _delete_at_path?: InputMaybe<MeemContractIntegrations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<MeemContractIntegrations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<MeemContractIntegrations_Delete_Key_Input>;
  _prepend?: InputMaybe<MeemContractIntegrations_Prepend_Input>;
  _set?: InputMaybe<MeemContractIntegrations_Set_Input>;
  pk_columns: MeemContractIntegrations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractIntegrations_ManyArgs = {
  updates: Array<MeemContractIntegrations_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractRolePermissionsArgs = {
  _set?: InputMaybe<MeemContractRolePermissions_Set_Input>;
  where: MeemContractRolePermissions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractRolePermissions_By_PkArgs = {
  _set?: InputMaybe<MeemContractRolePermissions_Set_Input>;
  pk_columns: MeemContractRolePermissions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractRolePermissions_ManyArgs = {
  updates: Array<MeemContractRolePermissions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractRolesArgs = {
  _append?: InputMaybe<MeemContractRoles_Append_Input>;
  _delete_at_path?: InputMaybe<MeemContractRoles_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<MeemContractRoles_Delete_Elem_Input>;
  _delete_key?: InputMaybe<MeemContractRoles_Delete_Key_Input>;
  _inc?: InputMaybe<MeemContractRoles_Inc_Input>;
  _prepend?: InputMaybe<MeemContractRoles_Prepend_Input>;
  _set?: InputMaybe<MeemContractRoles_Set_Input>;
  where: MeemContractRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractRoles_By_PkArgs = {
  _append?: InputMaybe<MeemContractRoles_Append_Input>;
  _delete_at_path?: InputMaybe<MeemContractRoles_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<MeemContractRoles_Delete_Elem_Input>;
  _delete_key?: InputMaybe<MeemContractRoles_Delete_Key_Input>;
  _inc?: InputMaybe<MeemContractRoles_Inc_Input>;
  _prepend?: InputMaybe<MeemContractRoles_Prepend_Input>;
  _set?: InputMaybe<MeemContractRoles_Set_Input>;
  pk_columns: MeemContractRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractRoles_ManyArgs = {
  updates: Array<MeemContractRoles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractWalletsArgs = {
  _set?: InputMaybe<MeemContractWallets_Set_Input>;
  where: MeemContractWallets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractWallets_By_PkArgs = {
  _set?: InputMaybe<MeemContractWallets_Set_Input>;
  pk_columns: MeemContractWallets_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractWallets_ManyArgs = {
  updates: Array<MeemContractWallets_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContractsArgs = {
  _append?: InputMaybe<MeemContracts_Append_Input>;
  _delete_at_path?: InputMaybe<MeemContracts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<MeemContracts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<MeemContracts_Delete_Key_Input>;
  _inc?: InputMaybe<MeemContracts_Inc_Input>;
  _prepend?: InputMaybe<MeemContracts_Prepend_Input>;
  _set?: InputMaybe<MeemContracts_Set_Input>;
  where: MeemContracts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContracts_By_PkArgs = {
  _append?: InputMaybe<MeemContracts_Append_Input>;
  _delete_at_path?: InputMaybe<MeemContracts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<MeemContracts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<MeemContracts_Delete_Key_Input>;
  _inc?: InputMaybe<MeemContracts_Inc_Input>;
  _prepend?: InputMaybe<MeemContracts_Prepend_Input>;
  _set?: InputMaybe<MeemContracts_Set_Input>;
  pk_columns: MeemContracts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemContracts_ManyArgs = {
  updates: Array<MeemContracts_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentitiesArgs = {
  _set?: InputMaybe<MeemIdentities_Set_Input>;
  where: MeemIdentities_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentities_By_PkArgs = {
  _set?: InputMaybe<MeemIdentities_Set_Input>;
  pk_columns: MeemIdentities_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentities_ManyArgs = {
  updates: Array<MeemIdentities_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentityIntegrationsArgs = {
  _append?: InputMaybe<MeemIdentityIntegrations_Append_Input>;
  _delete_at_path?: InputMaybe<MeemIdentityIntegrations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<MeemIdentityIntegrations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<MeemIdentityIntegrations_Delete_Key_Input>;
  _prepend?: InputMaybe<MeemIdentityIntegrations_Prepend_Input>;
  _set?: InputMaybe<MeemIdentityIntegrations_Set_Input>;
  where: MeemIdentityIntegrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentityIntegrations_By_PkArgs = {
  _append?: InputMaybe<MeemIdentityIntegrations_Append_Input>;
  _delete_at_path?: InputMaybe<MeemIdentityIntegrations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<MeemIdentityIntegrations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<MeemIdentityIntegrations_Delete_Key_Input>;
  _prepend?: InputMaybe<MeemIdentityIntegrations_Prepend_Input>;
  _set?: InputMaybe<MeemIdentityIntegrations_Set_Input>;
  pk_columns: MeemIdentityIntegrations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentityIntegrations_ManyArgs = {
  updates: Array<MeemIdentityIntegrations_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentityWalletsArgs = {
  _set?: InputMaybe<MeemIdentityWallets_Set_Input>;
  where: MeemIdentityWallets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentityWallets_By_PkArgs = {
  _set?: InputMaybe<MeemIdentityWallets_Set_Input>;
  pk_columns: MeemIdentityWallets_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MeemIdentityWallets_ManyArgs = {
  updates: Array<MeemIdentityWallets_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MeemsArgs = {
  _append?: InputMaybe<Meems_Append_Input>;
  _delete_at_path?: InputMaybe<Meems_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Meems_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Meems_Delete_Key_Input>;
  _inc?: InputMaybe<Meems_Inc_Input>;
  _prepend?: InputMaybe<Meems_Prepend_Input>;
  _set?: InputMaybe<Meems_Set_Input>;
  where: Meems_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Meems_By_PkArgs = {
  _append?: InputMaybe<Meems_Append_Input>;
  _delete_at_path?: InputMaybe<Meems_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Meems_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Meems_Delete_Key_Input>;
  _inc?: InputMaybe<Meems_Inc_Input>;
  _prepend?: InputMaybe<Meems_Prepend_Input>;
  _set?: InputMaybe<Meems_Set_Input>;
  pk_columns: Meems_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Meems_ManyArgs = {
  updates: Array<Meems_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ReactionsArgs = {
  _set?: InputMaybe<Reactions_Set_Input>;
  where: Reactions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Reactions_By_PkArgs = {
  _set?: InputMaybe<Reactions_Set_Input>;
  pk_columns: Reactions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Reactions_ManyArgs = {
  updates: Array<Reactions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_RolePermissionsArgs = {
  _set?: InputMaybe<RolePermissions_Set_Input>;
  where: RolePermissions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_RolePermissions_By_PkArgs = {
  _set?: InputMaybe<RolePermissions_Set_Input>;
  pk_columns: RolePermissions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_RolePermissions_ManyArgs = {
  updates: Array<RolePermissions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_SequelizeMetaArgs = {
  _set?: InputMaybe<SequelizeMeta_Set_Input>;
  where: SequelizeMeta_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_SequelizeMeta_By_PkArgs = {
  _set?: InputMaybe<SequelizeMeta_Set_Input>;
  pk_columns: SequelizeMeta_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_SequelizeMeta_ManyArgs = {
  updates: Array<SequelizeMeta_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_TransactionsArgs = {
  _inc?: InputMaybe<Transactions_Inc_Input>;
  _set?: InputMaybe<Transactions_Set_Input>;
  where: Transactions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Transactions_By_PkArgs = {
  _inc?: InputMaybe<Transactions_Inc_Input>;
  _set?: InputMaybe<Transactions_Set_Input>;
  pk_columns: Transactions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Transactions_ManyArgs = {
  updates: Array<Transactions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_TransfersArgs = {
  _set?: InputMaybe<Transfers_Set_Input>;
  where: Transfers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Transfers_By_PkArgs = {
  _set?: InputMaybe<Transfers_Set_Input>;
  pk_columns: Transfers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Transfers_ManyArgs = {
  updates: Array<Transfers_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_TweetHashtagsArgs = {
  _set?: InputMaybe<TweetHashtags_Set_Input>;
  where: TweetHashtags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_TweetHashtags_By_PkArgs = {
  _set?: InputMaybe<TweetHashtags_Set_Input>;
  pk_columns: TweetHashtags_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_TweetHashtags_ManyArgs = {
  updates: Array<TweetHashtags_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_TweetsArgs = {
  _set?: InputMaybe<Tweets_Set_Input>;
  where: Tweets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Tweets_By_PkArgs = {
  _set?: InputMaybe<Tweets_Set_Input>;
  pk_columns: Tweets_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Tweets_ManyArgs = {
  updates: Array<Tweets_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_TwittersArgs = {
  _set?: InputMaybe<Twitters_Set_Input>;
  where: Twitters_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Twitters_By_PkArgs = {
  _set?: InputMaybe<Twitters_Set_Input>;
  pk_columns: Twitters_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Twitters_ManyArgs = {
  updates: Array<Twitters_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_WalletContractInstancesArgs = {
  _set?: InputMaybe<WalletContractInstances_Set_Input>;
  where: WalletContractInstances_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_WalletContractInstances_By_PkArgs = {
  _set?: InputMaybe<WalletContractInstances_Set_Input>;
  pk_columns: WalletContractInstances_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_WalletContractInstances_ManyArgs = {
  updates: Array<WalletContractInstances_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_WalletsArgs = {
  _inc?: InputMaybe<Wallets_Inc_Input>;
  _set?: InputMaybe<Wallets_Set_Input>;
  where: Wallets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Wallets_By_PkArgs = {
  _inc?: InputMaybe<Wallets_Inc_Input>;
  _set?: InputMaybe<Wallets_Set_Input>;
  pk_columns: Wallets_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Wallets_ManyArgs = {
  updates: Array<Wallets_Updates>;
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
  Clippings: Array<Clippings>;
  /** An aggregate relationship */
  Clippings_aggregate: Clippings_Aggregate;
  /** fetch data from the table: "Clippings" using primary key columns */
  Clippings_by_pk?: Maybe<Clippings>;
  /** An array relationship */
  ContractInstances: Array<ContractInstances>;
  /** An aggregate relationship */
  ContractInstances_aggregate: ContractInstances_Aggregate;
  /** fetch data from the table: "ContractInstances" using primary key columns */
  ContractInstances_by_pk?: Maybe<ContractInstances>;
  /** An array relationship */
  Contracts: Array<Contracts>;
  /** An aggregate relationship */
  Contracts_aggregate: Contracts_Aggregate;
  /** fetch data from the table: "Contracts" using primary key columns */
  Contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table: "Discords" */
  Discords: Array<Discords>;
  /** fetch aggregated fields from the table: "Discords" */
  Discords_aggregate: Discords_Aggregate;
  /** fetch data from the table: "Discords" using primary key columns */
  Discords_by_pk?: Maybe<Discords>;
  /** fetch data from the table: "Hashtags" */
  Hashtags: Array<Hashtags>;
  /** fetch aggregated fields from the table: "Hashtags" */
  Hashtags_aggregate: Hashtags_Aggregate;
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
  /** fetch aggregated fields from the table: "Integrations" */
  Integrations_aggregate: Integrations_Aggregate;
  /** fetch data from the table: "Integrations" using primary key columns */
  Integrations_by_pk?: Maybe<Integrations>;
  /** An array relationship */
  MeemContractGuilds: Array<MeemContractGuilds>;
  /** An aggregate relationship */
  MeemContractGuilds_aggregate: MeemContractGuilds_Aggregate;
  /** fetch data from the table: "MeemContractGuilds" using primary key columns */
  MeemContractGuilds_by_pk?: Maybe<MeemContractGuilds>;
  /** An array relationship */
  MeemContractIntegrations: Array<MeemContractIntegrations>;
  /** An aggregate relationship */
  MeemContractIntegrations_aggregate: MeemContractIntegrations_Aggregate;
  /** fetch data from the table: "MeemContractIntegrations" using primary key columns */
  MeemContractIntegrations_by_pk?: Maybe<MeemContractIntegrations>;
  /** An array relationship */
  MeemContractRolePermissions: Array<MeemContractRolePermissions>;
  /** An aggregate relationship */
  MeemContractRolePermissions_aggregate: MeemContractRolePermissions_Aggregate;
  /** fetch data from the table: "MeemContractRolePermissions" using primary key columns */
  MeemContractRolePermissions_by_pk?: Maybe<MeemContractRolePermissions>;
  /** An array relationship */
  MeemContractRoles: Array<MeemContractRoles>;
  /** An aggregate relationship */
  MeemContractRoles_aggregate: MeemContractRoles_Aggregate;
  /** fetch data from the table: "MeemContractRoles" using primary key columns */
  MeemContractRoles_by_pk?: Maybe<MeemContractRoles>;
  /** An array relationship */
  MeemContractWallets: Array<MeemContractWallets>;
  /** An aggregate relationship */
  MeemContractWallets_aggregate: MeemContractWallets_Aggregate;
  /** fetch data from the table: "MeemContractWallets" using primary key columns */
  MeemContractWallets_by_pk?: Maybe<MeemContractWallets>;
  /** An array relationship */
  MeemContracts: Array<MeemContracts>;
  /** An aggregate relationship */
  MeemContracts_aggregate: MeemContracts_Aggregate;
  /** fetch data from the table: "MeemContracts" using primary key columns */
  MeemContracts_by_pk?: Maybe<MeemContracts>;
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
  Reactions: Array<Reactions>;
  /** An aggregate relationship */
  Reactions_aggregate: Reactions_Aggregate;
  /** fetch data from the table: "Reactions" using primary key columns */
  Reactions_by_pk?: Maybe<Reactions>;
  /** fetch data from the table: "RolePermissions" */
  RolePermissions: Array<RolePermissions>;
  /** fetch aggregated fields from the table: "RolePermissions" */
  RolePermissions_aggregate: RolePermissions_Aggregate;
  /** fetch data from the table: "RolePermissions" using primary key columns */
  RolePermissions_by_pk?: Maybe<RolePermissions>;
  /** fetch data from the table: "SequelizeMeta" */
  SequelizeMeta: Array<SequelizeMeta>;
  /** fetch aggregated fields from the table: "SequelizeMeta" */
  SequelizeMeta_aggregate: SequelizeMeta_Aggregate;
  /** fetch data from the table: "SequelizeMeta" using primary key columns */
  SequelizeMeta_by_pk?: Maybe<SequelizeMeta>;
  /** An array relationship */
  Transactions: Array<Transactions>;
  /** An aggregate relationship */
  Transactions_aggregate: Transactions_Aggregate;
  /** fetch data from the table: "Transactions" using primary key columns */
  Transactions_by_pk?: Maybe<Transactions>;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** An aggregate relationship */
  Transfers_aggregate: Transfers_Aggregate;
  /** fetch data from the table: "Transfers" using primary key columns */
  Transfers_by_pk?: Maybe<Transfers>;
  /** An array relationship */
  TweetHashtags: Array<TweetHashtags>;
  /** An aggregate relationship */
  TweetHashtags_aggregate: TweetHashtags_Aggregate;
  /** fetch data from the table: "TweetHashtags" using primary key columns */
  TweetHashtags_by_pk?: Maybe<TweetHashtags>;
  /** An array relationship */
  Tweets: Array<Tweets>;
  /** An aggregate relationship */
  Tweets_aggregate: Tweets_Aggregate;
  /** fetch data from the table: "Tweets" using primary key columns */
  Tweets_by_pk?: Maybe<Tweets>;
  /** fetch data from the table: "Twitters" */
  Twitters: Array<Twitters>;
  /** fetch aggregated fields from the table: "Twitters" */
  Twitters_aggregate: Twitters_Aggregate;
  /** fetch data from the table: "Twitters" using primary key columns */
  Twitters_by_pk?: Maybe<Twitters>;
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


export type Query_RootClippingsArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


export type Query_RootClippings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


export type Query_RootClippings_By_PkArgs = {
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


export type Query_RootContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Query_RootContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootDiscordsArgs = {
  distinct_on?: InputMaybe<Array<Discords_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Discords_Order_By>>;
  where?: InputMaybe<Discords_Bool_Exp>;
};


export type Query_RootDiscords_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Discords_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Discords_Order_By>>;
  where?: InputMaybe<Discords_Bool_Exp>;
};


export type Query_RootDiscords_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootHashtagsArgs = {
  distinct_on?: InputMaybe<Array<Hashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Hashtags_Order_By>>;
  where?: InputMaybe<Hashtags_Bool_Exp>;
};


export type Query_RootHashtags_AggregateArgs = {
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


export type Query_RootIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Query_RootIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemContractGuildsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractGuilds_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractGuilds_Order_By>>;
  where?: InputMaybe<MeemContractGuilds_Bool_Exp>;
};


export type Query_RootMeemContractGuilds_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractGuilds_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractGuilds_Order_By>>;
  where?: InputMaybe<MeemContractGuilds_Bool_Exp>;
};


export type Query_RootMeemContractGuilds_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemContractIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


export type Query_RootMeemContractIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


export type Query_RootMeemContractIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemContractRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRolePermissions_Order_By>>;
  where?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
};


export type Query_RootMeemContractRolePermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRolePermissions_Order_By>>;
  where?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
};


export type Query_RootMeemContractRolePermissions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemContractRolesArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRoles_Order_By>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};


export type Query_RootMeemContractRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRoles_Order_By>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};


export type Query_RootMeemContractRoles_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMeemContractWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractWallets_Order_By>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
};


export type Query_RootMeemContractWallets_AggregateArgs = {
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


export type Query_RootReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Reactions_Order_By>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};


export type Query_RootReactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Reactions_Order_By>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};


export type Query_RootReactions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RolePermissions_Order_By>>;
  where?: InputMaybe<RolePermissions_Bool_Exp>;
};


export type Query_RootRolePermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RolePermissions_Order_By>>;
  where?: InputMaybe<RolePermissions_Bool_Exp>;
};


export type Query_RootRolePermissions_By_PkArgs = {
  id: Scalars['String'];
};


export type Query_RootSequelizeMetaArgs = {
  distinct_on?: InputMaybe<Array<SequelizeMeta_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<SequelizeMeta_Order_By>>;
  where?: InputMaybe<SequelizeMeta_Bool_Exp>;
};


export type Query_RootSequelizeMeta_AggregateArgs = {
  distinct_on?: InputMaybe<Array<SequelizeMeta_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<SequelizeMeta_Order_By>>;
  where?: InputMaybe<SequelizeMeta_Bool_Exp>;
};


export type Query_RootSequelizeMeta_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootTransactionsArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};


export type Query_RootTransactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};


export type Query_RootTransactions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootTransfersArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transfers_Order_By>>;
  where?: InputMaybe<Transfers_Bool_Exp>;
};


export type Query_RootTransfers_AggregateArgs = {
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


export type Query_RootTweetHashtags_AggregateArgs = {
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


export type Query_RootTweets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tweets_Order_By>>;
  where?: InputMaybe<Tweets_Bool_Exp>;
};


export type Query_RootTweets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootTwittersArgs = {
  distinct_on?: InputMaybe<Array<Twitters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitters_Order_By>>;
  where?: InputMaybe<Twitters_Bool_Exp>;
};


export type Query_RootTwitters_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Twitters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitters_Order_By>>;
  where?: InputMaybe<Twitters_Bool_Exp>;
};


export type Query_RootTwitters_By_PkArgs = {
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
  /** fetch data from the table in a streaming manner : "BundleContracts" */
  BundleContracts_stream: Array<BundleContracts>;
  /** An array relationship */
  Bundles: Array<Bundles>;
  /** An aggregate relationship */
  Bundles_aggregate: Bundles_Aggregate;
  /** fetch data from the table: "Bundles" using primary key columns */
  Bundles_by_pk?: Maybe<Bundles>;
  /** fetch data from the table in a streaming manner : "Bundles" */
  Bundles_stream: Array<Bundles>;
  /** An array relationship */
  Clippings: Array<Clippings>;
  /** An aggregate relationship */
  Clippings_aggregate: Clippings_Aggregate;
  /** fetch data from the table: "Clippings" using primary key columns */
  Clippings_by_pk?: Maybe<Clippings>;
  /** fetch data from the table in a streaming manner : "Clippings" */
  Clippings_stream: Array<Clippings>;
  /** An array relationship */
  ContractInstances: Array<ContractInstances>;
  /** An aggregate relationship */
  ContractInstances_aggregate: ContractInstances_Aggregate;
  /** fetch data from the table: "ContractInstances" using primary key columns */
  ContractInstances_by_pk?: Maybe<ContractInstances>;
  /** fetch data from the table in a streaming manner : "ContractInstances" */
  ContractInstances_stream: Array<ContractInstances>;
  /** An array relationship */
  Contracts: Array<Contracts>;
  /** An aggregate relationship */
  Contracts_aggregate: Contracts_Aggregate;
  /** fetch data from the table: "Contracts" using primary key columns */
  Contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table in a streaming manner : "Contracts" */
  Contracts_stream: Array<Contracts>;
  /** fetch data from the table: "Discords" */
  Discords: Array<Discords>;
  /** fetch aggregated fields from the table: "Discords" */
  Discords_aggregate: Discords_Aggregate;
  /** fetch data from the table: "Discords" using primary key columns */
  Discords_by_pk?: Maybe<Discords>;
  /** fetch data from the table in a streaming manner : "Discords" */
  Discords_stream: Array<Discords>;
  /** fetch data from the table: "Hashtags" */
  Hashtags: Array<Hashtags>;
  /** fetch aggregated fields from the table: "Hashtags" */
  Hashtags_aggregate: Hashtags_Aggregate;
  /** fetch data from the table: "Hashtags" using primary key columns */
  Hashtags_by_pk?: Maybe<Hashtags>;
  /** fetch data from the table in a streaming manner : "Hashtags" */
  Hashtags_stream: Array<Hashtags>;
  /** fetch data from the table: "IdentityIntegrations" */
  IdentityIntegrations: Array<IdentityIntegrations>;
  /** fetch aggregated fields from the table: "IdentityIntegrations" */
  IdentityIntegrations_aggregate: IdentityIntegrations_Aggregate;
  /** fetch data from the table: "IdentityIntegrations" using primary key columns */
  IdentityIntegrations_by_pk?: Maybe<IdentityIntegrations>;
  /** fetch data from the table in a streaming manner : "IdentityIntegrations" */
  IdentityIntegrations_stream: Array<IdentityIntegrations>;
  /** fetch data from the table: "Integrations" */
  Integrations: Array<Integrations>;
  /** fetch aggregated fields from the table: "Integrations" */
  Integrations_aggregate: Integrations_Aggregate;
  /** fetch data from the table: "Integrations" using primary key columns */
  Integrations_by_pk?: Maybe<Integrations>;
  /** fetch data from the table in a streaming manner : "Integrations" */
  Integrations_stream: Array<Integrations>;
  /** An array relationship */
  MeemContractGuilds: Array<MeemContractGuilds>;
  /** An aggregate relationship */
  MeemContractGuilds_aggregate: MeemContractGuilds_Aggregate;
  /** fetch data from the table: "MeemContractGuilds" using primary key columns */
  MeemContractGuilds_by_pk?: Maybe<MeemContractGuilds>;
  /** fetch data from the table in a streaming manner : "MeemContractGuilds" */
  MeemContractGuilds_stream: Array<MeemContractGuilds>;
  /** An array relationship */
  MeemContractIntegrations: Array<MeemContractIntegrations>;
  /** An aggregate relationship */
  MeemContractIntegrations_aggregate: MeemContractIntegrations_Aggregate;
  /** fetch data from the table: "MeemContractIntegrations" using primary key columns */
  MeemContractIntegrations_by_pk?: Maybe<MeemContractIntegrations>;
  /** fetch data from the table in a streaming manner : "MeemContractIntegrations" */
  MeemContractIntegrations_stream: Array<MeemContractIntegrations>;
  /** An array relationship */
  MeemContractRolePermissions: Array<MeemContractRolePermissions>;
  /** An aggregate relationship */
  MeemContractRolePermissions_aggregate: MeemContractRolePermissions_Aggregate;
  /** fetch data from the table: "MeemContractRolePermissions" using primary key columns */
  MeemContractRolePermissions_by_pk?: Maybe<MeemContractRolePermissions>;
  /** fetch data from the table in a streaming manner : "MeemContractRolePermissions" */
  MeemContractRolePermissions_stream: Array<MeemContractRolePermissions>;
  /** An array relationship */
  MeemContractRoles: Array<MeemContractRoles>;
  /** An aggregate relationship */
  MeemContractRoles_aggregate: MeemContractRoles_Aggregate;
  /** fetch data from the table: "MeemContractRoles" using primary key columns */
  MeemContractRoles_by_pk?: Maybe<MeemContractRoles>;
  /** fetch data from the table in a streaming manner : "MeemContractRoles" */
  MeemContractRoles_stream: Array<MeemContractRoles>;
  /** An array relationship */
  MeemContractWallets: Array<MeemContractWallets>;
  /** An aggregate relationship */
  MeemContractWallets_aggregate: MeemContractWallets_Aggregate;
  /** fetch data from the table: "MeemContractWallets" using primary key columns */
  MeemContractWallets_by_pk?: Maybe<MeemContractWallets>;
  /** fetch data from the table in a streaming manner : "MeemContractWallets" */
  MeemContractWallets_stream: Array<MeemContractWallets>;
  /** An array relationship */
  MeemContracts: Array<MeemContracts>;
  /** An aggregate relationship */
  MeemContracts_aggregate: MeemContracts_Aggregate;
  /** fetch data from the table: "MeemContracts" using primary key columns */
  MeemContracts_by_pk?: Maybe<MeemContracts>;
  /** fetch data from the table in a streaming manner : "MeemContracts" */
  MeemContracts_stream: Array<MeemContracts>;
  /** An array relationship */
  MeemIdentities: Array<MeemIdentities>;
  /** An aggregate relationship */
  MeemIdentities_aggregate: MeemIdentities_Aggregate;
  /** fetch data from the table: "MeemIdentities" using primary key columns */
  MeemIdentities_by_pk?: Maybe<MeemIdentities>;
  /** fetch data from the table in a streaming manner : "MeemIdentities" */
  MeemIdentities_stream: Array<MeemIdentities>;
  /** An array relationship */
  MeemIdentityIntegrations: Array<MeemIdentityIntegrations>;
  /** An aggregate relationship */
  MeemIdentityIntegrations_aggregate: MeemIdentityIntegrations_Aggregate;
  /** fetch data from the table: "MeemIdentityIntegrations" using primary key columns */
  MeemIdentityIntegrations_by_pk?: Maybe<MeemIdentityIntegrations>;
  /** fetch data from the table in a streaming manner : "MeemIdentityIntegrations" */
  MeemIdentityIntegrations_stream: Array<MeemIdentityIntegrations>;
  /** An array relationship */
  MeemIdentityWallets: Array<MeemIdentityWallets>;
  /** An aggregate relationship */
  MeemIdentityWallets_aggregate: MeemIdentityWallets_Aggregate;
  /** fetch data from the table: "MeemIdentityWallets" using primary key columns */
  MeemIdentityWallets_by_pk?: Maybe<MeemIdentityWallets>;
  /** fetch data from the table in a streaming manner : "MeemIdentityWallets" */
  MeemIdentityWallets_stream: Array<MeemIdentityWallets>;
  /** An array relationship */
  Meems: Array<Meems>;
  /** An aggregate relationship */
  Meems_aggregate: Meems_Aggregate;
  /** fetch data from the table: "Meems" using primary key columns */
  Meems_by_pk?: Maybe<Meems>;
  /** fetch data from the table in a streaming manner : "Meems" */
  Meems_stream: Array<Meems>;
  /** An array relationship */
  Reactions: Array<Reactions>;
  /** An aggregate relationship */
  Reactions_aggregate: Reactions_Aggregate;
  /** fetch data from the table: "Reactions" using primary key columns */
  Reactions_by_pk?: Maybe<Reactions>;
  /** fetch data from the table in a streaming manner : "Reactions" */
  Reactions_stream: Array<Reactions>;
  /** fetch data from the table: "RolePermissions" */
  RolePermissions: Array<RolePermissions>;
  /** fetch aggregated fields from the table: "RolePermissions" */
  RolePermissions_aggregate: RolePermissions_Aggregate;
  /** fetch data from the table: "RolePermissions" using primary key columns */
  RolePermissions_by_pk?: Maybe<RolePermissions>;
  /** fetch data from the table in a streaming manner : "RolePermissions" */
  RolePermissions_stream: Array<RolePermissions>;
  /** fetch data from the table: "SequelizeMeta" */
  SequelizeMeta: Array<SequelizeMeta>;
  /** fetch aggregated fields from the table: "SequelizeMeta" */
  SequelizeMeta_aggregate: SequelizeMeta_Aggregate;
  /** fetch data from the table: "SequelizeMeta" using primary key columns */
  SequelizeMeta_by_pk?: Maybe<SequelizeMeta>;
  /** fetch data from the table in a streaming manner : "SequelizeMeta" */
  SequelizeMeta_stream: Array<SequelizeMeta>;
  /** An array relationship */
  Transactions: Array<Transactions>;
  /** An aggregate relationship */
  Transactions_aggregate: Transactions_Aggregate;
  /** fetch data from the table: "Transactions" using primary key columns */
  Transactions_by_pk?: Maybe<Transactions>;
  /** fetch data from the table in a streaming manner : "Transactions" */
  Transactions_stream: Array<Transactions>;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** An aggregate relationship */
  Transfers_aggregate: Transfers_Aggregate;
  /** fetch data from the table: "Transfers" using primary key columns */
  Transfers_by_pk?: Maybe<Transfers>;
  /** fetch data from the table in a streaming manner : "Transfers" */
  Transfers_stream: Array<Transfers>;
  /** An array relationship */
  TweetHashtags: Array<TweetHashtags>;
  /** An aggregate relationship */
  TweetHashtags_aggregate: TweetHashtags_Aggregate;
  /** fetch data from the table: "TweetHashtags" using primary key columns */
  TweetHashtags_by_pk?: Maybe<TweetHashtags>;
  /** fetch data from the table in a streaming manner : "TweetHashtags" */
  TweetHashtags_stream: Array<TweetHashtags>;
  /** An array relationship */
  Tweets: Array<Tweets>;
  /** An aggregate relationship */
  Tweets_aggregate: Tweets_Aggregate;
  /** fetch data from the table: "Tweets" using primary key columns */
  Tweets_by_pk?: Maybe<Tweets>;
  /** fetch data from the table in a streaming manner : "Tweets" */
  Tweets_stream: Array<Tweets>;
  /** fetch data from the table: "Twitters" */
  Twitters: Array<Twitters>;
  /** fetch aggregated fields from the table: "Twitters" */
  Twitters_aggregate: Twitters_Aggregate;
  /** fetch data from the table: "Twitters" using primary key columns */
  Twitters_by_pk?: Maybe<Twitters>;
  /** fetch data from the table in a streaming manner : "Twitters" */
  Twitters_stream: Array<Twitters>;
  /** An array relationship */
  WalletContractInstances: Array<WalletContractInstances>;
  /** An aggregate relationship */
  WalletContractInstances_aggregate: WalletContractInstances_Aggregate;
  /** fetch data from the table: "WalletContractInstances" using primary key columns */
  WalletContractInstances_by_pk?: Maybe<WalletContractInstances>;
  /** fetch data from the table in a streaming manner : "WalletContractInstances" */
  WalletContractInstances_stream: Array<WalletContractInstances>;
  /** fetch data from the table: "Wallets" */
  Wallets: Array<Wallets>;
  /** fetch aggregated fields from the table: "Wallets" */
  Wallets_aggregate: Wallets_Aggregate;
  /** fetch data from the table: "Wallets" using primary key columns */
  Wallets_by_pk?: Maybe<Wallets>;
  /** fetch data from the table in a streaming manner : "Wallets" */
  Wallets_stream: Array<Wallets>;
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


export type Subscription_RootBundleContracts_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<BundleContracts_Stream_Cursor_Input>>;
  where?: InputMaybe<BundleContracts_Bool_Exp>;
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


export type Subscription_RootBundles_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Bundles_Stream_Cursor_Input>>;
  where?: InputMaybe<Bundles_Bool_Exp>;
};


export type Subscription_RootClippingsArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


export type Subscription_RootClippings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


export type Subscription_RootClippings_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootClippings_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Clippings_Stream_Cursor_Input>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
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


export type Subscription_RootContractInstances_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<ContractInstances_Stream_Cursor_Input>>;
  where?: InputMaybe<ContractInstances_Bool_Exp>;
};


export type Subscription_RootContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Subscription_RootContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Subscription_RootContracts_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootContracts_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Contracts_Stream_Cursor_Input>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Subscription_RootDiscordsArgs = {
  distinct_on?: InputMaybe<Array<Discords_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Discords_Order_By>>;
  where?: InputMaybe<Discords_Bool_Exp>;
};


export type Subscription_RootDiscords_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Discords_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Discords_Order_By>>;
  where?: InputMaybe<Discords_Bool_Exp>;
};


export type Subscription_RootDiscords_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootDiscords_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Discords_Stream_Cursor_Input>>;
  where?: InputMaybe<Discords_Bool_Exp>;
};


export type Subscription_RootHashtagsArgs = {
  distinct_on?: InputMaybe<Array<Hashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Hashtags_Order_By>>;
  where?: InputMaybe<Hashtags_Bool_Exp>;
};


export type Subscription_RootHashtags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Hashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Hashtags_Order_By>>;
  where?: InputMaybe<Hashtags_Bool_Exp>;
};


export type Subscription_RootHashtags_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootHashtags_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Hashtags_Stream_Cursor_Input>>;
  where?: InputMaybe<Hashtags_Bool_Exp>;
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


export type Subscription_RootIdentityIntegrations_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<IdentityIntegrations_Stream_Cursor_Input>>;
  where?: InputMaybe<IdentityIntegrations_Bool_Exp>;
};


export type Subscription_RootIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Subscription_RootIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Subscription_RootIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootIntegrations_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Integrations_Stream_Cursor_Input>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Subscription_RootMeemContractGuildsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractGuilds_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractGuilds_Order_By>>;
  where?: InputMaybe<MeemContractGuilds_Bool_Exp>;
};


export type Subscription_RootMeemContractGuilds_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractGuilds_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractGuilds_Order_By>>;
  where?: InputMaybe<MeemContractGuilds_Bool_Exp>;
};


export type Subscription_RootMeemContractGuilds_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemContractGuilds_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemContractGuilds_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemContractGuilds_Bool_Exp>;
};


export type Subscription_RootMeemContractIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


export type Subscription_RootMeemContractIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractIntegrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractIntegrations_Order_By>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


export type Subscription_RootMeemContractIntegrations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemContractIntegrations_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemContractIntegrations_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemContractIntegrations_Bool_Exp>;
};


export type Subscription_RootMeemContractRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRolePermissions_Order_By>>;
  where?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
};


export type Subscription_RootMeemContractRolePermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRolePermissions_Order_By>>;
  where?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
};


export type Subscription_RootMeemContractRolePermissions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemContractRolePermissions_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemContractRolePermissions_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemContractRolePermissions_Bool_Exp>;
};


export type Subscription_RootMeemContractRolesArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRoles_Order_By>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};


export type Subscription_RootMeemContractRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractRoles_Order_By>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};


export type Subscription_RootMeemContractRoles_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemContractRoles_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemContractRoles_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemContractRoles_Bool_Exp>;
};


export type Subscription_RootMeemContractWalletsArgs = {
  distinct_on?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractWallets_Order_By>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
};


export type Subscription_RootMeemContractWallets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<MeemContractWallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemContractWallets_Order_By>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
};


export type Subscription_RootMeemContractWallets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMeemContractWallets_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemContractWallets_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemContractWallets_Bool_Exp>;
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


export type Subscription_RootMeemContracts_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemContracts_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemContracts_Bool_Exp>;
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


export type Subscription_RootMeemIdentities_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemIdentities_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemIdentities_Bool_Exp>;
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


export type Subscription_RootMeemIdentityIntegrations_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemIdentityIntegrations_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemIdentityIntegrations_Bool_Exp>;
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


export type Subscription_RootMeemIdentityWallets_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<MeemIdentityWallets_Stream_Cursor_Input>>;
  where?: InputMaybe<MeemIdentityWallets_Bool_Exp>;
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


export type Subscription_RootMeems_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Meems_Stream_Cursor_Input>>;
  where?: InputMaybe<Meems_Bool_Exp>;
};


export type Subscription_RootReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Reactions_Order_By>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};


export type Subscription_RootReactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Reactions_Order_By>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};


export type Subscription_RootReactions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootReactions_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Reactions_Stream_Cursor_Input>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};


export type Subscription_RootRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RolePermissions_Order_By>>;
  where?: InputMaybe<RolePermissions_Bool_Exp>;
};


export type Subscription_RootRolePermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RolePermissions_Order_By>>;
  where?: InputMaybe<RolePermissions_Bool_Exp>;
};


export type Subscription_RootRolePermissions_By_PkArgs = {
  id: Scalars['String'];
};


export type Subscription_RootRolePermissions_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<RolePermissions_Stream_Cursor_Input>>;
  where?: InputMaybe<RolePermissions_Bool_Exp>;
};


export type Subscription_RootSequelizeMetaArgs = {
  distinct_on?: InputMaybe<Array<SequelizeMeta_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<SequelizeMeta_Order_By>>;
  where?: InputMaybe<SequelizeMeta_Bool_Exp>;
};


export type Subscription_RootSequelizeMeta_AggregateArgs = {
  distinct_on?: InputMaybe<Array<SequelizeMeta_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<SequelizeMeta_Order_By>>;
  where?: InputMaybe<SequelizeMeta_Bool_Exp>;
};


export type Subscription_RootSequelizeMeta_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootSequelizeMeta_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<SequelizeMeta_Stream_Cursor_Input>>;
  where?: InputMaybe<SequelizeMeta_Bool_Exp>;
};


export type Subscription_RootTransactionsArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};


export type Subscription_RootTransactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};


export type Subscription_RootTransactions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTransactions_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Transactions_Stream_Cursor_Input>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};


export type Subscription_RootTransfersArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transfers_Order_By>>;
  where?: InputMaybe<Transfers_Bool_Exp>;
};


export type Subscription_RootTransfers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Transfers_Order_By>>;
  where?: InputMaybe<Transfers_Bool_Exp>;
};


export type Subscription_RootTransfers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTransfers_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Transfers_Stream_Cursor_Input>>;
  where?: InputMaybe<Transfers_Bool_Exp>;
};


export type Subscription_RootTweetHashtagsArgs = {
  distinct_on?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TweetHashtags_Order_By>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};


export type Subscription_RootTweetHashtags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<TweetHashtags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TweetHashtags_Order_By>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};


export type Subscription_RootTweetHashtags_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTweetHashtags_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<TweetHashtags_Stream_Cursor_Input>>;
  where?: InputMaybe<TweetHashtags_Bool_Exp>;
};


export type Subscription_RootTweetsArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tweets_Order_By>>;
  where?: InputMaybe<Tweets_Bool_Exp>;
};


export type Subscription_RootTweets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tweets_Order_By>>;
  where?: InputMaybe<Tweets_Bool_Exp>;
};


export type Subscription_RootTweets_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTweets_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Tweets_Stream_Cursor_Input>>;
  where?: InputMaybe<Tweets_Bool_Exp>;
};


export type Subscription_RootTwittersArgs = {
  distinct_on?: InputMaybe<Array<Twitters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitters_Order_By>>;
  where?: InputMaybe<Twitters_Bool_Exp>;
};


export type Subscription_RootTwitters_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Twitters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitters_Order_By>>;
  where?: InputMaybe<Twitters_Bool_Exp>;
};


export type Subscription_RootTwitters_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTwitters_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Twitters_Stream_Cursor_Input>>;
  where?: InputMaybe<Twitters_Bool_Exp>;
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


export type Subscription_RootWalletContractInstances_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<WalletContractInstances_Stream_Cursor_Input>>;
  where?: InputMaybe<WalletContractInstances_Bool_Exp>;
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


export type Subscription_RootWallets_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Wallets_Stream_Cursor_Input>>;
  where?: InputMaybe<Wallets_Bool_Exp>;
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
  chainId: Scalars['Int'];
}>;


export type GetIsMemberOfClubQuery = { __typename?: 'query_root', Meems: Array<{ __typename?: 'Meems', id: any, tokenId: string, Owner?: { __typename?: 'Wallets', address: string } | null }> };

export type GetIsMemberOfClubSubscriptionSubscriptionVariables = Exact<{
  walletAddress?: InputMaybe<Scalars['String']>;
  clubSlug?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type GetIsMemberOfClubSubscriptionSubscription = { __typename?: 'subscription_root', Meems: Array<{ __typename?: 'Meems', id: any, tokenId: string, Owner?: { __typename?: 'Wallets', address: string } | null }> };

export type GetClubsAutocompleteQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type GetClubsAutocompleteQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', id: any, name: string, metadata: any, slug: string }> };

export type GetClubSlugQueryVariables = Exact<{
  contractAddress?: InputMaybe<Scalars['String']>;
}>;


export type GetClubSlugQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string }> };

export type GetClubQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type GetClubQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, metadata: any, createdAt: any, name: string, splits: any, maxSupply: string, mintPermissions: any, symbol: string, id: any, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string, Owner?: { __typename?: 'Wallets', address: string, ens?: string | null, MeemIdentities: Array<{ __typename?: 'MeemIdentities', displayName?: string | null, profilePicUrl?: string | null, MeemIdentityIntegrations: Array<{ __typename?: 'MeemIdentityIntegrations', metadata: any, visibility: string }> }> } | null }>, MeemContractIntegrations: Array<{ __typename?: 'MeemContractIntegrations', IntegrationId?: any | null, id: any, isEnabled: boolean, metadata: any, isPublic: boolean, Integration?: { __typename?: 'Integrations', description: string, guideUrl: string, icon: string, id: any, name: string } | null }> }> };

export type GetClubAsMemberQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type GetClubAsMemberQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, metadata: any, createdAt: any, name: string, gnosisSafeAddress?: string | null, splits: any, maxSupply: string, mintPermissions: any, symbol: string, id: any, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string, Owner?: { __typename?: 'Wallets', address: string, ens?: string | null, MeemIdentities: Array<{ __typename?: 'MeemIdentities', displayName?: string | null, profilePicUrl?: string | null, MeemIdentityIntegrations: Array<{ __typename?: 'MeemIdentityIntegrations', metadata: any, visibility: string }> }> } | null }>, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', address: string, ens?: string | null } | null }>, MeemContractIntegrations: Array<{ __typename?: 'MeemContractIntegrations', IntegrationId?: any | null, id: any, isEnabled: boolean, metadata: any, isPublic: boolean, Integration?: { __typename?: 'Integrations', description: string, guideUrl: string, icon: string, id: any, name: string } | null }> }> };

export type GetClubInfoQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type GetClubInfoQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, metadata: any, createdAt: any, name: string }> };

export type GetClubSubscriptionSubscriptionVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type GetClubSubscriptionSubscription = { __typename?: 'subscription_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, metadata: any, createdAt: any, name: string, splits: any, maxSupply: string, mintPermissions: any, symbol: string, id: any, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string, Owner?: { __typename?: 'Wallets', address: string, ens?: string | null, MeemIdentities: Array<{ __typename?: 'MeemIdentities', displayName?: string | null, profilePicUrl?: string | null, MeemIdentityIntegrations: Array<{ __typename?: 'MeemIdentityIntegrations', metadata: any, visibility: string }> }> } | null }>, MeemContractIntegrations: Array<{ __typename?: 'MeemContractIntegrations', IntegrationId?: any | null, id: any, isEnabled: boolean, metadata: any, isPublic: boolean, Integration?: { __typename?: 'Integrations', description: string, guideUrl: string, icon: string, id: any, name: string } | null }> }> };

export type GetClubAsMemberSubscriptionSubscriptionVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type GetClubAsMemberSubscriptionSubscription = { __typename?: 'subscription_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, metadata: any, createdAt: any, name: string, gnosisSafeAddress?: string | null, OwnerId?: any | null, splits: any, maxSupply: string, mintPermissions: any, symbol: string, id: any, Meems: Array<{ __typename?: 'Meems', OwnerId?: any | null, tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string, Owner?: { __typename?: 'Wallets', address: string, ens?: string | null, MeemIdentities: Array<{ __typename?: 'MeemIdentities', displayName?: string | null, profilePicUrl?: string | null, MeemIdentityIntegrations: Array<{ __typename?: 'MeemIdentityIntegrations', metadata: any, visibility: string }> }> } | null, MeemContract?: { __typename?: 'MeemContracts', MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string }>, MeemContractRoles: Array<{ __typename?: 'MeemContractRoles', id: any, isAdminRole: boolean, isDefaultRole: boolean, name: string, integrationsMetadata: any, MeemContractRolePermissions: Array<{ __typename?: 'MeemContractRolePermissions', RolePermissionId?: string | null }> }> } | null }>, MeemContractIntegrations: Array<{ __typename?: 'MeemContractIntegrations', IntegrationId?: any | null, id: any, isEnabled: boolean, metadata: any, isPublic: boolean, Integration?: { __typename?: 'Integrations', description: string, guideUrl: string, icon: string, id: any, name: string } | null }>, MeemContractRoles: Array<{ __typename?: 'MeemContractRoles', id: any, name: string, isAdminRole: boolean, isDefaultRole: boolean, integrationsMetadata: any, MeemContractRolePermissions: Array<{ __typename?: 'MeemContractRolePermissions', RolePermissionId?: string | null }> }>, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', Wallet?: { __typename?: 'Wallets', address: string } | null }> }> };

export type ClubSubscriptionSubscriptionVariables = Exact<{
  address?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type ClubSubscriptionSubscription = { __typename?: 'subscription_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, createdAt: any, name: string, metadata: any, splits: any, mintPermissions: any, symbol: string, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string, Owner?: { __typename?: 'Wallets', address: string, ens?: string | null } | null }>, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', ens?: string | null, address: string } | null }> }> };

export type GetIntegrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIntegrationsQuery = { __typename?: 'query_root', Integrations: Array<{ __typename?: 'Integrations', createdAt: any, deletedAt?: any | null, description: string, guideUrl: string, icon: string, id: any, name: string, updatedAt: any }> };

export type GetAvailablePermissionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailablePermissionQuery = { __typename?: 'query_root', RolePermissions: Array<{ __typename?: 'RolePermissions', description: string, id: string, name: string }> };

export type GetClubMembersForRoleQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
  roleId?: InputMaybe<Scalars['uuid']>;
}>;


export type GetClubMembersForRoleQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', Meems: Array<{ __typename?: 'Meems', Owner?: { __typename?: 'Wallets', address: string, ens?: string | null, MeemIdentities: Array<{ __typename?: 'MeemIdentities', displayName?: string | null, profilePicUrl?: string | null, MeemIdentityIntegrations: Array<{ __typename?: 'MeemIdentityIntegrations', metadata: any, visibility: string }> }> } | null }> }> };

export type AllClubsQueryVariables = Exact<{
  chainId?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type AllClubsQuery = { __typename?: 'query_root', MeemContracts: Array<{ __typename?: 'MeemContracts', slug: string, address: string, createdAt: any, name: string, metadata: any, splits: any, mintPermissions: any, symbol: string, Meems: Array<{ __typename?: 'Meems', tokenId: string, tokenURI: string, mintedAt: any, mintedBy: string, Owner?: { __typename?: 'Wallets', address: string, ens?: string | null } | null }> }> };

export type MyClubsSubscriptionSubscriptionVariables = Exact<{
  walletAddress?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['Int']>;
}>;


export type MyClubsSubscriptionSubscription = { __typename?: 'subscription_root', Meems: Array<{ __typename?: 'Meems', tokenId: string, MeemContractId?: any | null, MeemContract?: { __typename?: 'MeemContracts', id: any, slug: string, address: string, createdAt: any, name: string, metadata: any, splits: any, gnosisSafeAddress?: string | null, mintPermissions: any, symbol: string, updatedAt: any, MeemContractWallets: Array<{ __typename?: 'MeemContractWallets', role: string, Wallet?: { __typename?: 'Wallets', ens?: string | null, address: string } | null }>, Meems_aggregate: { __typename?: 'Meems_aggregate', aggregate?: { __typename?: 'Meems_aggregate_fields', count: number } | null }, Meems: Array<{ __typename?: 'Meems', Owner?: { __typename?: 'Wallets', address: string, ens?: string | null } | null }> } | null }> };

export type GetBundleByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetBundleByIdQuery = { __typename?: 'query_root', Bundles: Array<{ __typename?: 'Bundles', id: any, abi: any, BundleContracts: Array<{ __typename?: 'BundleContracts', functionSelectors: any, Contract?: { __typename?: 'Contracts', ContractInstances: Array<{ __typename?: 'ContractInstances', address: string }> } | null }> }> };

export type MeemIdSubscriptionSubscriptionVariables = Exact<{
  walletAddress?: InputMaybe<Scalars['String']>;
}>;


export type MeemIdSubscriptionSubscription = { __typename?: 'subscription_root', MeemIdentities: Array<{ __typename?: 'MeemIdentities', updatedAt: any, profilePicUrl?: string | null, id: any, displayName?: string | null, deletedAt?: any | null, createdAt: any, DefaultWallet?: { __typename?: 'Wallets', address: string, ens?: string | null } | null, MeemIdentityIntegrations: Array<{ __typename?: 'MeemIdentityIntegrations', metadata: any, visibility: string, IdentityIntegrationId?: any | null, IdentityIntegration?: { __typename?: 'IdentityIntegrations', description: string, icon: string, id: any, name: string } | null }> }> };

export type GetIdentityIntegrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIdentityIntegrationsQuery = { __typename?: 'query_root', IdentityIntegrations: Array<{ __typename?: 'IdentityIntegrations', description: string, icon: string, id: any, name: string }> };

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
    query GetIsMemberOfClub($walletAddress: String, $clubSlug: String, $chainId: Int!) {
  Meems(
    where: {MeemContractId: {_is_null: false}, MeemContract: {slug: {_eq: $clubSlug}, chainId: {_eq: $chainId}}, Owner: {address: {_ilike: $walletAddress}}}
  ) {
    id
    tokenId
    Owner {
      address
    }
  }
}
    `;

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
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetIsMemberOfClubQuery(baseOptions: Apollo.QueryHookOptions<GetIsMemberOfClubQuery, GetIsMemberOfClubQueryVariables>) {
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
export const GetIsMemberOfClubSubscriptionDocument = gql`
    subscription GetIsMemberOfClubSubscription($walletAddress: String, $clubSlug: String, $chainId: Int) {
  Meems(
    where: {MeemContractId: {_is_null: false}, MeemContract: {slug: {_eq: $clubSlug}, chainId: {_eq: $chainId}}, Owner: {address: {_ilike: $walletAddress}}}
  ) {
    id
    tokenId
    Owner {
      address
    }
  }
}
    `;

/**
 * __useGetIsMemberOfClubSubscriptionSubscription__
 *
 * To run a query within a React component, call `useGetIsMemberOfClubSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetIsMemberOfClubSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIsMemberOfClubSubscriptionSubscription({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *      clubSlug: // value for 'clubSlug'
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetIsMemberOfClubSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GetIsMemberOfClubSubscriptionSubscription, GetIsMemberOfClubSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetIsMemberOfClubSubscriptionSubscription, GetIsMemberOfClubSubscriptionSubscriptionVariables>(GetIsMemberOfClubSubscriptionDocument, options);
      }
export type GetIsMemberOfClubSubscriptionSubscriptionHookResult = ReturnType<typeof useGetIsMemberOfClubSubscriptionSubscription>;
export type GetIsMemberOfClubSubscriptionSubscriptionResult = Apollo.SubscriptionResult<GetIsMemberOfClubSubscriptionSubscription>;
export const GetClubsAutocompleteDocument = gql`
    query GetClubsAutocomplete($query: String, $chainId: Int) {
  MeemContracts(where: {name: {_ilike: $query}, chainId: {_eq: $chainId}}) {
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
 *      chainId: // value for 'chainId'
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
    query GetClub($slug: String, $chainId: Int) {
  MeemContracts(where: {slug: {_eq: $slug}, chainId: {_eq: $chainId}}) {
    slug
    address
    metadata
    createdAt
    name
    Meems {
      Owner {
        address
        ens
        MeemIdentities {
          displayName
          profilePicUrl
          MeemIdentityIntegrations {
            metadata
            visibility
          }
        }
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
 *      chainId: // value for 'chainId'
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
export const GetClubAsMemberDocument = gql`
    query GetClubAsMember($slug: String, $chainId: Int) {
  MeemContracts(where: {slug: {_eq: $slug}, chainId: {_eq: $chainId}}) {
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
        MeemIdentities {
          displayName
          profilePicUrl
          MeemIdentityIntegrations {
            metadata
            visibility
          }
        }
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
 * __useGetClubAsMemberQuery__
 *
 * To run a query within a React component, call `useGetClubAsMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClubAsMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClubAsMemberQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetClubAsMemberQuery(baseOptions?: Apollo.QueryHookOptions<GetClubAsMemberQuery, GetClubAsMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClubAsMemberQuery, GetClubAsMemberQueryVariables>(GetClubAsMemberDocument, options);
      }
export function useGetClubAsMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClubAsMemberQuery, GetClubAsMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClubAsMemberQuery, GetClubAsMemberQueryVariables>(GetClubAsMemberDocument, options);
        }
export type GetClubAsMemberQueryHookResult = ReturnType<typeof useGetClubAsMemberQuery>;
export type GetClubAsMemberLazyQueryHookResult = ReturnType<typeof useGetClubAsMemberLazyQuery>;
export type GetClubAsMemberQueryResult = Apollo.QueryResult<GetClubAsMemberQuery, GetClubAsMemberQueryVariables>;
export const GetClubInfoDocument = gql`
    query GetClubInfo($slug: String, $chainId: Int) {
  MeemContracts(where: {slug: {_eq: $slug}, chainId: {_eq: $chainId}}) {
    slug
    address
    metadata
    createdAt
    name
  }
}
    `;

/**
 * __useGetClubInfoQuery__
 *
 * To run a query within a React component, call `useGetClubInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClubInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClubInfoQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetClubInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetClubInfoQuery, GetClubInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClubInfoQuery, GetClubInfoQueryVariables>(GetClubInfoDocument, options);
      }
export function useGetClubInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClubInfoQuery, GetClubInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClubInfoQuery, GetClubInfoQueryVariables>(GetClubInfoDocument, options);
        }
export type GetClubInfoQueryHookResult = ReturnType<typeof useGetClubInfoQuery>;
export type GetClubInfoLazyQueryHookResult = ReturnType<typeof useGetClubInfoLazyQuery>;
export type GetClubInfoQueryResult = Apollo.QueryResult<GetClubInfoQuery, GetClubInfoQueryVariables>;
export const GetClubSubscriptionDocument = gql`
    subscription GetClubSubscription($slug: String, $chainId: Int) {
  MeemContracts(where: {slug: {_eq: $slug}, chainId: {_eq: $chainId}}) {
    slug
    address
    metadata
    createdAt
    name
    Meems {
      Owner {
        address
        ens
        MeemIdentities {
          displayName
          profilePicUrl
          MeemIdentityIntegrations {
            metadata
            visibility
          }
        }
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
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetClubSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GetClubSubscriptionSubscription, GetClubSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetClubSubscriptionSubscription, GetClubSubscriptionSubscriptionVariables>(GetClubSubscriptionDocument, options);
      }
export type GetClubSubscriptionSubscriptionHookResult = ReturnType<typeof useGetClubSubscriptionSubscription>;
export type GetClubSubscriptionSubscriptionResult = Apollo.SubscriptionResult<GetClubSubscriptionSubscription>;
export const GetClubAsMemberSubscriptionDocument = gql`
    subscription GetClubAsMemberSubscription($slug: String, $chainId: Int) {
  MeemContracts(where: {slug: {_eq: $slug}, chainId: {_eq: $chainId}}) {
    slug
    address
    metadata
    createdAt
    name
    gnosisSafeAddress
    OwnerId
    Meems {
      OwnerId
      Owner {
        address
        ens
        MeemIdentities {
          displayName
          profilePicUrl
          MeemIdentityIntegrations {
            metadata
            visibility
          }
        }
      }
      tokenId
      tokenURI
      mintedAt
      mintedBy
      MeemContract {
        MeemContractWallets {
          role
        }
        MeemContractRoles {
          id
          isAdminRole
          isDefaultRole
          name
          MeemContractRolePermissions {
            RolePermissionId
          }
          integrationsMetadata
        }
      }
    }
    splits
    maxSupply
    mintPermissions
    symbol
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
    MeemContractRoles {
      id
      name
      isAdminRole
      isDefaultRole
      MeemContractRolePermissions {
        RolePermissionId
      }
      integrationsMetadata
    }
    MeemContractWallets {
      Wallet {
        address
      }
    }
  }
}
    `;

/**
 * __useGetClubAsMemberSubscriptionSubscription__
 *
 * To run a query within a React component, call `useGetClubAsMemberSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetClubAsMemberSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClubAsMemberSubscriptionSubscription({
 *   variables: {
 *      slug: // value for 'slug'
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetClubAsMemberSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GetClubAsMemberSubscriptionSubscription, GetClubAsMemberSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetClubAsMemberSubscriptionSubscription, GetClubAsMemberSubscriptionSubscriptionVariables>(GetClubAsMemberSubscriptionDocument, options);
      }
export type GetClubAsMemberSubscriptionSubscriptionHookResult = ReturnType<typeof useGetClubAsMemberSubscriptionSubscription>;
export type GetClubAsMemberSubscriptionSubscriptionResult = Apollo.SubscriptionResult<GetClubAsMemberSubscriptionSubscription>;
export const ClubSubscriptionDocument = gql`
    subscription ClubSubscription($address: String, $chainId: Int) {
  MeemContracts(where: {address: {_eq: $address}, chainId: {_eq: $chainId}}) {
    slug
    address
    createdAt
    name
    metadata
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
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useClubSubscriptionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ClubSubscriptionSubscription, ClubSubscriptionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ClubSubscriptionSubscription, ClubSubscriptionSubscriptionVariables>(ClubSubscriptionDocument, options);
      }
export type ClubSubscriptionSubscriptionHookResult = ReturnType<typeof useClubSubscriptionSubscription>;
export type ClubSubscriptionSubscriptionResult = Apollo.SubscriptionResult<ClubSubscriptionSubscription>;
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
export const GetAvailablePermissionDocument = gql`
    query GetAvailablePermission {
  RolePermissions {
    description
    id
    name
  }
}
    `;

/**
 * __useGetAvailablePermissionQuery__
 *
 * To run a query within a React component, call `useGetAvailablePermissionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailablePermissionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailablePermissionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAvailablePermissionQuery(baseOptions?: Apollo.QueryHookOptions<GetAvailablePermissionQuery, GetAvailablePermissionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAvailablePermissionQuery, GetAvailablePermissionQueryVariables>(GetAvailablePermissionDocument, options);
      }
export function useGetAvailablePermissionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAvailablePermissionQuery, GetAvailablePermissionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAvailablePermissionQuery, GetAvailablePermissionQueryVariables>(GetAvailablePermissionDocument, options);
        }
export type GetAvailablePermissionQueryHookResult = ReturnType<typeof useGetAvailablePermissionQuery>;
export type GetAvailablePermissionLazyQueryHookResult = ReturnType<typeof useGetAvailablePermissionLazyQuery>;
export type GetAvailablePermissionQueryResult = Apollo.QueryResult<GetAvailablePermissionQuery, GetAvailablePermissionQueryVariables>;
export const GetClubMembersForRoleDocument = gql`
    query GetClubMembersForRole($slug: String, $chainId: Int, $roleId: uuid) {
  MeemContracts(where: {slug: {_eq: $slug}, chainId: {_eq: $chainId}}) {
    Meems(where: {MeemContract: {MeemContractRoles: {id: {_eq: $roleId}}}}) {
      Owner {
        address
        ens
        MeemIdentities {
          displayName
          profilePicUrl
          MeemIdentityIntegrations {
            metadata
            visibility
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetClubMembersForRoleQuery__
 *
 * To run a query within a React component, call `useGetClubMembersForRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClubMembersForRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClubMembersForRoleQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      chainId: // value for 'chainId'
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useGetClubMembersForRoleQuery(baseOptions?: Apollo.QueryHookOptions<GetClubMembersForRoleQuery, GetClubMembersForRoleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClubMembersForRoleQuery, GetClubMembersForRoleQueryVariables>(GetClubMembersForRoleDocument, options);
      }
export function useGetClubMembersForRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClubMembersForRoleQuery, GetClubMembersForRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClubMembersForRoleQuery, GetClubMembersForRoleQueryVariables>(GetClubMembersForRoleDocument, options);
        }
export type GetClubMembersForRoleQueryHookResult = ReturnType<typeof useGetClubMembersForRoleQuery>;
export type GetClubMembersForRoleLazyQueryHookResult = ReturnType<typeof useGetClubMembersForRoleLazyQuery>;
export type GetClubMembersForRoleQueryResult = Apollo.QueryResult<GetClubMembersForRoleQuery, GetClubMembersForRoleQueryVariables>;
export const AllClubsDocument = gql`
    query AllClubs($chainId: Int, $limit: Int, $offset: Int) {
  MeemContracts(
    where: {chainId: {_eq: $chainId}}
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
    mintPermissions
    symbol
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
 *      chainId: // value for 'chainId'
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
    subscription MyClubsSubscription($walletAddress: String, $chainId: Int) {
  Meems(
    where: {MeemContractId: {_is_null: false}, Owner: {address: {_ilike: $walletAddress}}, MeemContract: {chainId: {_eq: $chainId}}}
    order_by: {MeemContract: {Meems_aggregate: {count: desc}}}
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
      Meems {
        Owner {
          address
          ens
        }
      }
      updatedAt
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
 *      chainId: // value for 'chainId'
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
  MeemIdentities(where: {DefaultWallet: {address: {_ilike: $walletAddress}}}) {
    updatedAt
    profilePicUrl
    id
    displayName
    deletedAt
    createdAt
    DefaultWallet {
      address
      ens
    }
    MeemIdentityIntegrations {
      metadata
      visibility
      IdentityIntegrationId
      IdentityIntegration {
        description
        icon
        id
        name
      }
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
export const GetIdentityIntegrationsDocument = gql`
    query GetIdentityIntegrations {
  IdentityIntegrations {
    description
    icon
    id
    name
  }
}
    `;

/**
 * __useGetIdentityIntegrationsQuery__
 *
 * To run a query within a React component, call `useGetIdentityIntegrationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIdentityIntegrationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIdentityIntegrationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetIdentityIntegrationsQuery(baseOptions?: Apollo.QueryHookOptions<GetIdentityIntegrationsQuery, GetIdentityIntegrationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIdentityIntegrationsQuery, GetIdentityIntegrationsQueryVariables>(GetIdentityIntegrationsDocument, options);
      }
export function useGetIdentityIntegrationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIdentityIntegrationsQuery, GetIdentityIntegrationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIdentityIntegrationsQuery, GetIdentityIntegrationsQueryVariables>(GetIdentityIntegrationsDocument, options);
        }
export type GetIdentityIntegrationsQueryHookResult = ReturnType<typeof useGetIdentityIntegrationsQuery>;
export type GetIdentityIntegrationsLazyQueryHookResult = ReturnType<typeof useGetIdentityIntegrationsLazyQuery>;
export type GetIdentityIntegrationsQueryResult = Apollo.QueryResult<GetIdentityIntegrationsQuery, GetIdentityIntegrationsQueryVariables>;