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

/** columns and relationships of "Clippings" */
export type Clippings = {
  __typename?: 'Clippings';
  /** An object relationship */
  Meem?: Maybe<Meems>;
  MeemId?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  MeemIdentification?: Maybe<MeemIdentifications>;
  MeemIdentificationId?: Maybe<Scalars['uuid']>;
  address: Scalars['String'];
  clippedAt: Scalars['timestamptz'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** order by aggregate values of table "Clippings" */
export type Clippings_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Clippings_Max_Order_By>;
  min?: InputMaybe<Clippings_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Clippings". All fields are combined with a logical 'AND'. */
export type Clippings_Bool_Exp = {
  Meem?: InputMaybe<Meems_Bool_Exp>;
  MeemId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemIdentification?: InputMaybe<MeemIdentifications_Bool_Exp>;
  MeemIdentificationId?: InputMaybe<Uuid_Comparison_Exp>;
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

/** order by max() on columns of table "Clippings" */
export type Clippings_Max_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  clippedAt?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Clippings" */
export type Clippings_Min_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  clippedAt?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Clippings". */
export type Clippings_Order_By = {
  Meem?: InputMaybe<Meems_Order_By>;
  MeemId?: InputMaybe<Order_By>;
  MeemIdentification?: InputMaybe<MeemIdentifications_Order_By>;
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  clippedAt?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Clippings" */
export enum Clippings_Select_Column {
  /** column name */
  MeemId = 'MeemId',
  /** column name */
  MeemIdentificationId = 'MeemIdentificationId',
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

/** columns and relationships of "MeemIdentifications" */
export type MeemIdentifications = {
  __typename?: 'MeemIdentifications';
  /** An array relationship */
  Clippings: Array<Clippings>;
  /** An array relationship */
  Reactions: Array<Reactions>;
  /** An array relationship */
  Twitters: Array<Twitters>;
  /** An array relationship */
  Wallets: Array<Wallets>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  hasOnboarded: Scalars['Boolean'];
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "MeemIdentifications" */
export type MeemIdentificationsClippingsArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


/** columns and relationships of "MeemIdentifications" */
export type MeemIdentificationsReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Reactions_Order_By>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};


/** columns and relationships of "MeemIdentifications" */
export type MeemIdentificationsTwittersArgs = {
  distinct_on?: InputMaybe<Array<Twitters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitters_Order_By>>;
  where?: InputMaybe<Twitters_Bool_Exp>;
};


/** columns and relationships of "MeemIdentifications" */
export type MeemIdentificationsWalletsArgs = {
  distinct_on?: InputMaybe<Array<Wallets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Wallets_Order_By>>;
  where?: InputMaybe<Wallets_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "MeemIdentifications". All fields are combined with a logical 'AND'. */
export type MeemIdentifications_Bool_Exp = {
  Clippings?: InputMaybe<Clippings_Bool_Exp>;
  Reactions?: InputMaybe<Reactions_Bool_Exp>;
  Twitters?: InputMaybe<Twitters_Bool_Exp>;
  Wallets?: InputMaybe<Wallets_Bool_Exp>;
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
  Clippings_aggregate?: InputMaybe<Clippings_Aggregate_Order_By>;
  Reactions_aggregate?: InputMaybe<Reactions_Aggregate_Order_By>;
  Twitters_aggregate?: InputMaybe<Twitters_Aggregate_Order_By>;
  Wallets_aggregate?: InputMaybe<Wallets_Aggregate_Order_By>;
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

/** columns and relationships of "MeemProperties" */
export type MeemProperties = {
  __typename?: 'MeemProperties';
  copiesPerWallet: Scalars['String'];
  copiesPerWalletLockedBy: Scalars['String'];
  copyPermissions: Scalars['jsonb'];
  copyPermissionsLockedBy: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  readPermissions: Scalars['jsonb'];
  readPermissionsLockedBy: Scalars['String'];
  remixPermissions: Scalars['jsonb'];
  remixPermissionsLockedBy: Scalars['String'];
  remixesPerWallet: Scalars['String'];
  remixesPerWalletLockedBy: Scalars['String'];
  splits: Scalars['jsonb'];
  splitsLockedBy: Scalars['String'];
  totalCopies: Scalars['String'];
  totalCopiesLockedBy: Scalars['String'];
  totalRemixes: Scalars['String'];
  totalRemixesLockedBy: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "MeemProperties" */
export type MeemPropertiesCopyPermissionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "MeemProperties" */
export type MeemPropertiesReadPermissionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "MeemProperties" */
export type MeemPropertiesRemixPermissionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "MeemProperties" */
export type MeemPropertiesSplitsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to filter rows from the table "MeemProperties". All fields are combined with a logical 'AND'. */
export type MeemProperties_Bool_Exp = {
  _and?: InputMaybe<Array<MeemProperties_Bool_Exp>>;
  _not?: InputMaybe<MeemProperties_Bool_Exp>;
  _or?: InputMaybe<Array<MeemProperties_Bool_Exp>>;
  copiesPerWallet?: InputMaybe<String_Comparison_Exp>;
  copiesPerWalletLockedBy?: InputMaybe<String_Comparison_Exp>;
  copyPermissions?: InputMaybe<Jsonb_Comparison_Exp>;
  copyPermissionsLockedBy?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  readPermissions?: InputMaybe<Jsonb_Comparison_Exp>;
  readPermissionsLockedBy?: InputMaybe<String_Comparison_Exp>;
  remixPermissions?: InputMaybe<Jsonb_Comparison_Exp>;
  remixPermissionsLockedBy?: InputMaybe<String_Comparison_Exp>;
  remixesPerWallet?: InputMaybe<String_Comparison_Exp>;
  remixesPerWalletLockedBy?: InputMaybe<String_Comparison_Exp>;
  splits?: InputMaybe<Jsonb_Comparison_Exp>;
  splitsLockedBy?: InputMaybe<String_Comparison_Exp>;
  totalCopies?: InputMaybe<String_Comparison_Exp>;
  totalCopiesLockedBy?: InputMaybe<String_Comparison_Exp>;
  totalRemixes?: InputMaybe<String_Comparison_Exp>;
  totalRemixesLockedBy?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** Ordering options when selecting data from "MeemProperties". */
export type MeemProperties_Order_By = {
  copiesPerWallet?: InputMaybe<Order_By>;
  copiesPerWalletLockedBy?: InputMaybe<Order_By>;
  copyPermissions?: InputMaybe<Order_By>;
  copyPermissionsLockedBy?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  readPermissions?: InputMaybe<Order_By>;
  readPermissionsLockedBy?: InputMaybe<Order_By>;
  remixPermissions?: InputMaybe<Order_By>;
  remixPermissionsLockedBy?: InputMaybe<Order_By>;
  remixesPerWallet?: InputMaybe<Order_By>;
  remixesPerWalletLockedBy?: InputMaybe<Order_By>;
  splits?: InputMaybe<Order_By>;
  splitsLockedBy?: InputMaybe<Order_By>;
  totalCopies?: InputMaybe<Order_By>;
  totalCopiesLockedBy?: InputMaybe<Order_By>;
  totalRemixes?: InputMaybe<Order_By>;
  totalRemixesLockedBy?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "MeemProperties" */
export enum MeemProperties_Select_Column {
  /** column name */
  CopiesPerWallet = 'copiesPerWallet',
  /** column name */
  CopiesPerWalletLockedBy = 'copiesPerWalletLockedBy',
  /** column name */
  CopyPermissions = 'copyPermissions',
  /** column name */
  CopyPermissionsLockedBy = 'copyPermissionsLockedBy',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  ReadPermissions = 'readPermissions',
  /** column name */
  ReadPermissionsLockedBy = 'readPermissionsLockedBy',
  /** column name */
  RemixPermissions = 'remixPermissions',
  /** column name */
  RemixPermissionsLockedBy = 'remixPermissionsLockedBy',
  /** column name */
  RemixesPerWallet = 'remixesPerWallet',
  /** column name */
  RemixesPerWalletLockedBy = 'remixesPerWalletLockedBy',
  /** column name */
  Splits = 'splits',
  /** column name */
  SplitsLockedBy = 'splitsLockedBy',
  /** column name */
  TotalCopies = 'totalCopies',
  /** column name */
  TotalCopiesLockedBy = 'totalCopiesLockedBy',
  /** column name */
  TotalRemixes = 'totalRemixes',
  /** column name */
  TotalRemixesLockedBy = 'totalRemixesLockedBy',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "Meems" */
export type Meems = {
  __typename?: 'Meems';
  /** An object relationship */
  ChildProperties?: Maybe<MeemProperties>;
  ChildPropertiesId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  Clippings: Array<Clippings>;
  /** An object relationship */
  Properties?: Maybe<MeemProperties>;
  PropertiesId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  Reactions: Array<Reactions>;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** An array relationship */
  Tweets: Array<Tweets>;
  createdAt: Scalars['timestamptz'];
  data: Scalars['String'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  generation: Scalars['Int'];
  id: Scalars['uuid'];
  meemId?: Maybe<Scalars['uuid']>;
  meemType: Scalars['Int'];
  metadata: Scalars['jsonb'];
  mintedAt: Scalars['timestamptz'];
  mintedBy: Scalars['String'];
  numCopies: Scalars['Int'];
  numRemixes: Scalars['Int'];
  owner: Scalars['String'];
  parent: Scalars['String'];
  parentChain: Scalars['Int'];
  parentTokenId: Scalars['String'];
  reactionCounts: Scalars['jsonb'];
  reactionTypes: Scalars['jsonb'];
  root: Scalars['String'];
  rootChain: Scalars['Int'];
  rootTokenId: Scalars['String'];
  tokenId: Scalars['String'];
  tokenURI: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
  uriLockedBy: Scalars['String'];
  uriSource: Scalars['Int'];
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
export type MeemsReactionsArgs = {
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


/** columns and relationships of "Meems" */
export type MeemsReactionCountsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "Meems" */
export type MeemsReactionTypesArgs = {
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

/** aggregate avg on columns */
export type Meems_Avg_Fields = {
  __typename?: 'Meems_avg_fields';
  generation?: Maybe<Scalars['Float']>;
  meemType?: Maybe<Scalars['Float']>;
  numCopies?: Maybe<Scalars['Float']>;
  numRemixes?: Maybe<Scalars['Float']>;
  parentChain?: Maybe<Scalars['Float']>;
  rootChain?: Maybe<Scalars['Float']>;
  uriSource?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "Meems". All fields are combined with a logical 'AND'. */
export type Meems_Bool_Exp = {
  ChildProperties?: InputMaybe<MeemProperties_Bool_Exp>;
  ChildPropertiesId?: InputMaybe<Uuid_Comparison_Exp>;
  Clippings?: InputMaybe<Clippings_Bool_Exp>;
  Properties?: InputMaybe<MeemProperties_Bool_Exp>;
  PropertiesId?: InputMaybe<Uuid_Comparison_Exp>;
  Reactions?: InputMaybe<Reactions_Bool_Exp>;
  Transfers?: InputMaybe<Transfers_Bool_Exp>;
  Tweets?: InputMaybe<Tweets_Bool_Exp>;
  _and?: InputMaybe<Array<Meems_Bool_Exp>>;
  _not?: InputMaybe<Meems_Bool_Exp>;
  _or?: InputMaybe<Array<Meems_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<String_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  generation?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  meemId?: InputMaybe<Uuid_Comparison_Exp>;
  meemType?: InputMaybe<Int_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  mintedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  mintedBy?: InputMaybe<String_Comparison_Exp>;
  numCopies?: InputMaybe<Int_Comparison_Exp>;
  numRemixes?: InputMaybe<Int_Comparison_Exp>;
  owner?: InputMaybe<String_Comparison_Exp>;
  parent?: InputMaybe<String_Comparison_Exp>;
  parentChain?: InputMaybe<Int_Comparison_Exp>;
  parentTokenId?: InputMaybe<String_Comparison_Exp>;
  reactionCounts?: InputMaybe<Jsonb_Comparison_Exp>;
  reactionTypes?: InputMaybe<Jsonb_Comparison_Exp>;
  root?: InputMaybe<String_Comparison_Exp>;
  rootChain?: InputMaybe<Int_Comparison_Exp>;
  rootTokenId?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<String_Comparison_Exp>;
  tokenURI?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  uriLockedBy?: InputMaybe<String_Comparison_Exp>;
  uriSource?: InputMaybe<Int_Comparison_Exp>;
};

/** aggregate max on columns */
export type Meems_Max_Fields = {
  __typename?: 'Meems_max_fields';
  ChildPropertiesId?: Maybe<Scalars['uuid']>;
  PropertiesId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  data?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  generation?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  meemId?: Maybe<Scalars['uuid']>;
  meemType?: Maybe<Scalars['Int']>;
  mintedAt?: Maybe<Scalars['timestamptz']>;
  mintedBy?: Maybe<Scalars['String']>;
  numCopies?: Maybe<Scalars['Int']>;
  numRemixes?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['String']>;
  parentChain?: Maybe<Scalars['Int']>;
  parentTokenId?: Maybe<Scalars['String']>;
  root?: Maybe<Scalars['String']>;
  rootChain?: Maybe<Scalars['Int']>;
  rootTokenId?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  tokenURI?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  uriLockedBy?: Maybe<Scalars['String']>;
  uriSource?: Maybe<Scalars['Int']>;
};

/** aggregate min on columns */
export type Meems_Min_Fields = {
  __typename?: 'Meems_min_fields';
  ChildPropertiesId?: Maybe<Scalars['uuid']>;
  PropertiesId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  data?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  generation?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  meemId?: Maybe<Scalars['uuid']>;
  meemType?: Maybe<Scalars['Int']>;
  mintedAt?: Maybe<Scalars['timestamptz']>;
  mintedBy?: Maybe<Scalars['String']>;
  numCopies?: Maybe<Scalars['Int']>;
  numRemixes?: Maybe<Scalars['Int']>;
  owner?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['String']>;
  parentChain?: Maybe<Scalars['Int']>;
  parentTokenId?: Maybe<Scalars['String']>;
  root?: Maybe<Scalars['String']>;
  rootChain?: Maybe<Scalars['Int']>;
  rootTokenId?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  tokenURI?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  uriLockedBy?: Maybe<Scalars['String']>;
  uriSource?: Maybe<Scalars['Int']>;
};

/** Ordering options when selecting data from "Meems". */
export type Meems_Order_By = {
  ChildProperties?: InputMaybe<MeemProperties_Order_By>;
  ChildPropertiesId?: InputMaybe<Order_By>;
  Clippings_aggregate?: InputMaybe<Clippings_Aggregate_Order_By>;
  Properties?: InputMaybe<MeemProperties_Order_By>;
  PropertiesId?: InputMaybe<Order_By>;
  Reactions_aggregate?: InputMaybe<Reactions_Aggregate_Order_By>;
  Transfers_aggregate?: InputMaybe<Transfers_Aggregate_Order_By>;
  Tweets_aggregate?: InputMaybe<Tweets_Aggregate_Order_By>;
  createdAt?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  generation?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  meemId?: InputMaybe<Order_By>;
  meemType?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  mintedAt?: InputMaybe<Order_By>;
  mintedBy?: InputMaybe<Order_By>;
  numCopies?: InputMaybe<Order_By>;
  numRemixes?: InputMaybe<Order_By>;
  owner?: InputMaybe<Order_By>;
  parent?: InputMaybe<Order_By>;
  parentChain?: InputMaybe<Order_By>;
  parentTokenId?: InputMaybe<Order_By>;
  reactionCounts?: InputMaybe<Order_By>;
  reactionTypes?: InputMaybe<Order_By>;
  root?: InputMaybe<Order_By>;
  rootChain?: InputMaybe<Order_By>;
  rootTokenId?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  tokenURI?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uriLockedBy?: InputMaybe<Order_By>;
  uriSource?: InputMaybe<Order_By>;
};

/** select columns of table "Meems" */
export enum Meems_Select_Column {
  /** column name */
  ChildPropertiesId = 'ChildPropertiesId',
  /** column name */
  PropertiesId = 'PropertiesId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Data = 'data',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Generation = 'generation',
  /** column name */
  Id = 'id',
  /** column name */
  MeemId = 'meemId',
  /** column name */
  MeemType = 'meemType',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MintedAt = 'mintedAt',
  /** column name */
  MintedBy = 'mintedBy',
  /** column name */
  NumCopies = 'numCopies',
  /** column name */
  NumRemixes = 'numRemixes',
  /** column name */
  Owner = 'owner',
  /** column name */
  Parent = 'parent',
  /** column name */
  ParentChain = 'parentChain',
  /** column name */
  ParentTokenId = 'parentTokenId',
  /** column name */
  ReactionCounts = 'reactionCounts',
  /** column name */
  ReactionTypes = 'reactionTypes',
  /** column name */
  Root = 'root',
  /** column name */
  RootChain = 'rootChain',
  /** column name */
  RootTokenId = 'rootTokenId',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TokenUri = 'tokenURI',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UriLockedBy = 'uriLockedBy',
  /** column name */
  UriSource = 'uriSource'
}

/** aggregate stddev on columns */
export type Meems_Stddev_Fields = {
  __typename?: 'Meems_stddev_fields';
  generation?: Maybe<Scalars['Float']>;
  meemType?: Maybe<Scalars['Float']>;
  numCopies?: Maybe<Scalars['Float']>;
  numRemixes?: Maybe<Scalars['Float']>;
  parentChain?: Maybe<Scalars['Float']>;
  rootChain?: Maybe<Scalars['Float']>;
  uriSource?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Meems_Stddev_Pop_Fields = {
  __typename?: 'Meems_stddev_pop_fields';
  generation?: Maybe<Scalars['Float']>;
  meemType?: Maybe<Scalars['Float']>;
  numCopies?: Maybe<Scalars['Float']>;
  numRemixes?: Maybe<Scalars['Float']>;
  parentChain?: Maybe<Scalars['Float']>;
  rootChain?: Maybe<Scalars['Float']>;
  uriSource?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Meems_Stddev_Samp_Fields = {
  __typename?: 'Meems_stddev_samp_fields';
  generation?: Maybe<Scalars['Float']>;
  meemType?: Maybe<Scalars['Float']>;
  numCopies?: Maybe<Scalars['Float']>;
  numRemixes?: Maybe<Scalars['Float']>;
  parentChain?: Maybe<Scalars['Float']>;
  rootChain?: Maybe<Scalars['Float']>;
  uriSource?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Meems_Sum_Fields = {
  __typename?: 'Meems_sum_fields';
  generation?: Maybe<Scalars['Int']>;
  meemType?: Maybe<Scalars['Int']>;
  numCopies?: Maybe<Scalars['Int']>;
  numRemixes?: Maybe<Scalars['Int']>;
  parentChain?: Maybe<Scalars['Int']>;
  rootChain?: Maybe<Scalars['Int']>;
  uriSource?: Maybe<Scalars['Int']>;
};

/** aggregate var_pop on columns */
export type Meems_Var_Pop_Fields = {
  __typename?: 'Meems_var_pop_fields';
  generation?: Maybe<Scalars['Float']>;
  meemType?: Maybe<Scalars['Float']>;
  numCopies?: Maybe<Scalars['Float']>;
  numRemixes?: Maybe<Scalars['Float']>;
  parentChain?: Maybe<Scalars['Float']>;
  rootChain?: Maybe<Scalars['Float']>;
  uriSource?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Meems_Var_Samp_Fields = {
  __typename?: 'Meems_var_samp_fields';
  generation?: Maybe<Scalars['Float']>;
  meemType?: Maybe<Scalars['Float']>;
  numCopies?: Maybe<Scalars['Float']>;
  numRemixes?: Maybe<Scalars['Float']>;
  parentChain?: Maybe<Scalars['Float']>;
  rootChain?: Maybe<Scalars['Float']>;
  uriSource?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Meems_Variance_Fields = {
  __typename?: 'Meems_variance_fields';
  generation?: Maybe<Scalars['Float']>;
  meemType?: Maybe<Scalars['Float']>;
  numCopies?: Maybe<Scalars['Float']>;
  numRemixes?: Maybe<Scalars['Float']>;
  parentChain?: Maybe<Scalars['Float']>;
  rootChain?: Maybe<Scalars['Float']>;
  uriSource?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "Reactions" */
export type Reactions = {
  __typename?: 'Reactions';
  /** An object relationship */
  Meem?: Maybe<Meems>;
  MeemId?: Maybe<Scalars['uuid']>;
  MeemIdentificationId?: Maybe<Scalars['uuid']>;
  address: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  reactedAt: Scalars['timestamptz'];
  reaction: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};

/** order by aggregate values of table "Reactions" */
export type Reactions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Reactions_Max_Order_By>;
  min?: InputMaybe<Reactions_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Reactions". All fields are combined with a logical 'AND'. */
export type Reactions_Bool_Exp = {
  Meem?: InputMaybe<Meems_Bool_Exp>;
  MeemId?: InputMaybe<Uuid_Comparison_Exp>;
  MeemIdentificationId?: InputMaybe<Uuid_Comparison_Exp>;
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

/** order by max() on columns of table "Reactions" */
export type Reactions_Max_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reactedAt?: InputMaybe<Order_By>;
  reaction?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Reactions" */
export type Reactions_Min_Order_By = {
  MeemId?: InputMaybe<Order_By>;
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reactedAt?: InputMaybe<Order_By>;
  reaction?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Reactions". */
export type Reactions_Order_By = {
  Meem?: InputMaybe<Meems_Order_By>;
  MeemId?: InputMaybe<Order_By>;
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reactedAt?: InputMaybe<Order_By>;
  reaction?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Reactions" */
export enum Reactions_Select_Column {
  /** column name */
  MeemId = 'MeemId',
  /** column name */
  MeemIdentificationId = 'MeemIdentificationId',
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

/** Boolean expression to filter rows from the table "TweetHashtags". All fields are combined with a logical 'AND'. */
export type TweetHashtags_Bool_Exp = {
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

/** Ordering options when selecting data from "TweetHashtags". */
export type TweetHashtags_Order_By = {
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

/** columns and relationships of "Twitters" */
export type Twitters = {
  __typename?: 'Twitters';
  /** An object relationship */
  MeemIdentification?: Maybe<MeemIdentifications>;
  MeemIdentificationId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  isDefault: Scalars['Boolean'];
  twitterId: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};

/** order by aggregate values of table "Twitters" */
export type Twitters_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Twitters_Max_Order_By>;
  min?: InputMaybe<Twitters_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Twitters". All fields are combined with a logical 'AND'. */
export type Twitters_Bool_Exp = {
  MeemIdentification?: InputMaybe<MeemIdentifications_Bool_Exp>;
  MeemIdentificationId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Twitters_Bool_Exp>>;
  _not?: InputMaybe<Twitters_Bool_Exp>;
  _or?: InputMaybe<Array<Twitters_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isDefault?: InputMaybe<Boolean_Comparison_Exp>;
  twitterId?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** order by max() on columns of table "Twitters" */
export type Twitters_Max_Order_By = {
  MeemIdentificationId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  twitterId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Twitters" */
export type Twitters_Min_Order_By = {
  MeemIdentificationId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  twitterId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Twitters". */
export type Twitters_Order_By = {
  MeemIdentification?: InputMaybe<MeemIdentifications_Order_By>;
  MeemIdentificationId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isDefault?: InputMaybe<Order_By>;
  twitterId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Twitters" */
export enum Twitters_Select_Column {
  /** column name */
  MeemIdentificationId = 'MeemIdentificationId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'isDefault',
  /** column name */
  TwitterId = 'twitterId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "Wallets" */
export type Wallets = {
  __typename?: 'Wallets';
  /** An object relationship */
  MeemIdentification?: Maybe<MeemIdentifications>;
  MeemIdentificationId?: Maybe<Scalars['uuid']>;
  address: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  deletedAt?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  isDefault: Scalars['Boolean'];
  updatedAt: Scalars['timestamptz'];
};

/** order by aggregate values of table "Wallets" */
export type Wallets_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Wallets_Max_Order_By>;
  min?: InputMaybe<Wallets_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Wallets". All fields are combined with a logical 'AND'. */
export type Wallets_Bool_Exp = {
  MeemIdentification?: InputMaybe<MeemIdentifications_Bool_Exp>;
  MeemIdentificationId?: InputMaybe<Uuid_Comparison_Exp>;
  _and?: InputMaybe<Array<Wallets_Bool_Exp>>;
  _not?: InputMaybe<Wallets_Bool_Exp>;
  _or?: InputMaybe<Array<Wallets_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isDefault?: InputMaybe<Boolean_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** order by max() on columns of table "Wallets" */
export type Wallets_Max_Order_By = {
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Wallets" */
export type Wallets_Min_Order_By = {
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Wallets". */
export type Wallets_Order_By = {
  MeemIdentification?: InputMaybe<MeemIdentifications_Order_By>;
  MeemIdentificationId?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isDefault?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** select columns of table "Wallets" */
export enum Wallets_Select_Column {
  /** column name */
  MeemIdentificationId = 'MeemIdentificationId',
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'isDefault',
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
  Clippings: Array<Clippings>;
  /** fetch data from the table: "Clippings" using primary key columns */
  Clippings_by_pk?: Maybe<Clippings>;
  /** fetch data from the table: "MeemIdentifications" */
  MeemIdentifications: Array<MeemIdentifications>;
  /** fetch data from the table: "MeemIdentifications" using primary key columns */
  MeemIdentifications_by_pk?: Maybe<MeemIdentifications>;
  /** fetch data from the table: "MeemProperties" */
  MeemProperties: Array<MeemProperties>;
  /** fetch data from the table: "MeemProperties" using primary key columns */
  MeemProperties_by_pk?: Maybe<MeemProperties>;
  /** fetch data from the table: "Meems" */
  Meems: Array<Meems>;
  /** fetch aggregated fields from the table: "Meems" */
  Meems_aggregate: Meems_Aggregate;
  /** fetch data from the table: "Meems" using primary key columns */
  Meems_by_pk?: Maybe<Meems>;
  /** An array relationship */
  Reactions: Array<Reactions>;
  /** fetch data from the table: "Reactions" using primary key columns */
  Reactions_by_pk?: Maybe<Reactions>;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** fetch data from the table: "Transfers" using primary key columns */
  Transfers_by_pk?: Maybe<Transfers>;
  /** fetch data from the table: "TweetHashtags" */
  TweetHashtags: Array<TweetHashtags>;
  /** fetch aggregated fields from the table: "TweetHashtags" */
  TweetHashtags_aggregate: TweetHashtags_Aggregate;
  /** fetch data from the table: "TweetHashtags" using primary key columns */
  TweetHashtags_by_pk?: Maybe<TweetHashtags>;
  /** An array relationship */
  Tweets: Array<Tweets>;
  /** fetch data from the table: "Tweets" using primary key columns */
  Tweets_by_pk?: Maybe<Tweets>;
  /** An array relationship */
  Twitters: Array<Twitters>;
  /** fetch data from the table: "Twitters" using primary key columns */
  Twitters_by_pk?: Maybe<Twitters>;
  /** An array relationship */
  Wallets: Array<Wallets>;
  /** fetch data from the table: "Wallets" using primary key columns */
  Wallets_by_pk?: Maybe<Wallets>;
};


export type Query_RootClippingsArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


export type Query_RootClippings_By_PkArgs = {
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


export type Query_RootMeemPropertiesArgs = {
  distinct_on?: InputMaybe<Array<MeemProperties_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemProperties_Order_By>>;
  where?: InputMaybe<MeemProperties_Bool_Exp>;
};


export type Query_RootMeemProperties_By_PkArgs = {
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


export type Query_RootReactions_By_PkArgs = {
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


export type Query_RootTwitters_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootWalletsArgs = {
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
  Clippings: Array<Clippings>;
  /** fetch data from the table: "Clippings" using primary key columns */
  Clippings_by_pk?: Maybe<Clippings>;
  /** fetch data from the table: "MeemIdentifications" */
  MeemIdentifications: Array<MeemIdentifications>;
  /** fetch data from the table: "MeemIdentifications" using primary key columns */
  MeemIdentifications_by_pk?: Maybe<MeemIdentifications>;
  /** fetch data from the table: "MeemProperties" */
  MeemProperties: Array<MeemProperties>;
  /** fetch data from the table: "MeemProperties" using primary key columns */
  MeemProperties_by_pk?: Maybe<MeemProperties>;
  /** fetch data from the table: "Meems" */
  Meems: Array<Meems>;
  /** fetch aggregated fields from the table: "Meems" */
  Meems_aggregate: Meems_Aggregate;
  /** fetch data from the table: "Meems" using primary key columns */
  Meems_by_pk?: Maybe<Meems>;
  /** An array relationship */
  Reactions: Array<Reactions>;
  /** fetch data from the table: "Reactions" using primary key columns */
  Reactions_by_pk?: Maybe<Reactions>;
  /** An array relationship */
  Transfers: Array<Transfers>;
  /** fetch data from the table: "Transfers" using primary key columns */
  Transfers_by_pk?: Maybe<Transfers>;
  /** fetch data from the table: "TweetHashtags" */
  TweetHashtags: Array<TweetHashtags>;
  /** fetch aggregated fields from the table: "TweetHashtags" */
  TweetHashtags_aggregate: TweetHashtags_Aggregate;
  /** fetch data from the table: "TweetHashtags" using primary key columns */
  TweetHashtags_by_pk?: Maybe<TweetHashtags>;
  /** An array relationship */
  Tweets: Array<Tweets>;
  /** fetch data from the table: "Tweets" using primary key columns */
  Tweets_by_pk?: Maybe<Tweets>;
  /** An array relationship */
  Twitters: Array<Twitters>;
  /** fetch data from the table: "Twitters" using primary key columns */
  Twitters_by_pk?: Maybe<Twitters>;
  /** An array relationship */
  Wallets: Array<Wallets>;
  /** fetch data from the table: "Wallets" using primary key columns */
  Wallets_by_pk?: Maybe<Wallets>;
};


export type Subscription_RootClippingsArgs = {
  distinct_on?: InputMaybe<Array<Clippings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Clippings_Order_By>>;
  where?: InputMaybe<Clippings_Bool_Exp>;
};


export type Subscription_RootClippings_By_PkArgs = {
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


export type Subscription_RootMeemPropertiesArgs = {
  distinct_on?: InputMaybe<Array<MeemProperties_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<MeemProperties_Order_By>>;
  where?: InputMaybe<MeemProperties_Bool_Exp>;
};


export type Subscription_RootMeemProperties_By_PkArgs = {
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


export type Subscription_RootReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Reactions_Order_By>>;
  where?: InputMaybe<Reactions_Bool_Exp>;
};


export type Subscription_RootReactions_By_PkArgs = {
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


export type Subscription_RootTwittersArgs = {
  distinct_on?: InputMaybe<Array<Twitters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitters_Order_By>>;
  where?: InputMaybe<Twitters_Bool_Exp>;
};


export type Subscription_RootTwitters_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootWalletsArgs = {
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

export type GetLastMeemQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLastMeemQuery = { __typename?: 'query_root', Meems: Array<{ __typename?: 'Meems', tokenId: string, metadata: any }> };

export type GetMeemIdQueryVariables = Exact<{
  walletAddress: Scalars['String'];
}>;


export type GetMeemIdQuery = { __typename?: 'query_root', MeemIdentifications: Array<{ __typename?: 'MeemIdentifications', id: any, hasOnboarded: boolean, Wallets: Array<{ __typename?: 'Wallets', address: string }>, Twitters: Array<{ __typename?: 'Twitters', twitterId: string, id: any }> }> };


export const GetLastMeemDocument = gql`
    query GetLastMeem {
  Meems(limit: 1, order_by: {createdAt: desc}) {
    tokenId
    metadata
  }
}
    `;

/**
 * __useGetLastMeemQuery__
 *
 * To run a query within a React component, call `useGetLastMeemQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLastMeemQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLastMeemQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLastMeemQuery(baseOptions?: Apollo.QueryHookOptions<GetLastMeemQuery, GetLastMeemQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLastMeemQuery, GetLastMeemQueryVariables>(GetLastMeemDocument, options);
      }
export function useGetLastMeemLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLastMeemQuery, GetLastMeemQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLastMeemQuery, GetLastMeemQueryVariables>(GetLastMeemDocument, options);
        }
export type GetLastMeemQueryHookResult = ReturnType<typeof useGetLastMeemQuery>;
export type GetLastMeemLazyQueryHookResult = ReturnType<typeof useGetLastMeemLazyQuery>;
export type GetLastMeemQueryResult = Apollo.QueryResult<GetLastMeemQuery, GetLastMeemQueryVariables>;
export const GetMeemIdDocument = gql`
    query GetMeemId($walletAddress: String!) {
  MeemIdentifications(where: {Wallets: {address: {_eq: $walletAddress}}}) {
    Wallets {
      address
    }
    id
    hasOnboarded
    Twitters {
      twitterId
      id
    }
  }
}
    `;

/**
 * __useGetMeemIdQuery__
 *
 * To run a query within a React component, call `useGetMeemIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeemIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeemIdQuery({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useGetMeemIdQuery(baseOptions: Apollo.QueryHookOptions<GetMeemIdQuery, GetMeemIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeemIdQuery, GetMeemIdQueryVariables>(GetMeemIdDocument, options);
      }
export function useGetMeemIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeemIdQuery, GetMeemIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeemIdQuery, GetMeemIdQueryVariables>(GetMeemIdDocument, options);
        }
export type GetMeemIdQueryHookResult = ReturnType<typeof useGetMeemIdQuery>;
export type GetMeemIdLazyQueryHookResult = ReturnType<typeof useGetMeemIdLazyQuery>;
export type GetMeemIdQueryResult = Apollo.QueryResult<GetMeemIdQuery, GetMeemIdQueryVariables>;