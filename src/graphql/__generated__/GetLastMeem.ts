/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetLastMeem
// ====================================================

export interface GetLastMeem_Meems {
  __typename: "Meems";
  tokenId: string;
  metadata: any;
}

export interface GetLastMeem {
  /**
   * fetch data from the table: "Meems"
   */
  Meems: GetLastMeem_Meems[];
}
