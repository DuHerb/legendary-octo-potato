export { MockUserDAO } from './user-dao'
export { MockBucketDAO } from './bucket-dao'
export { MockMoneyBucketDAO } from './money-bucket-dao'
export { MockDepositTransactionDAO } from './deposit-transaction-dao'
export { MockBucketTransactionDAO } from './bucket-transaction-dao'
export { MockMoneyBucketTransactionDAO } from './money-bucket-transaction-dao'

import { MockUserDAO } from './user-dao'
import { MockBucketDAO } from './bucket-dao'
import { MockMoneyBucketDAO } from './money-bucket-dao'
import { MockDepositTransactionDAO } from './deposit-transaction-dao'
import { MockBucketTransactionDAO } from './bucket-transaction-dao'
import { MockMoneyBucketTransactionDAO } from './money-bucket-transaction-dao'

// Convenience factory for creating all mock DAOs
export interface MockDAOFactory {
  userDAO: MockUserDAO
  bucketDAO: MockBucketDAO
  moneyBucketDAO: MockMoneyBucketDAO
  depositTransactionDAO: MockDepositTransactionDAO
  bucketTransactionDAO: MockBucketTransactionDAO
  moneyBucketTransactionDAO: MockMoneyBucketTransactionDAO
}

export function createMockDAOs(): MockDAOFactory {
  return {
    userDAO: new MockUserDAO(),
    bucketDAO: new MockBucketDAO(),
    moneyBucketDAO: new MockMoneyBucketDAO(),
    depositTransactionDAO: new MockDepositTransactionDAO(),
    bucketTransactionDAO: new MockBucketTransactionDAO(),
    moneyBucketTransactionDAO: new MockMoneyBucketTransactionDAO(),
  }
}