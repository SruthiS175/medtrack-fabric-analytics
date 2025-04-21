import { Object as ObjectType, Property } from 'fabric-contract-api';

@ObjectType()
export class TransactionMetrics {
  @Property() public transactionID: string;
  @Property() public timestamp: string;
  @Property() public blockNumber: number;
  @Property() public sender: string;
  @Property() public receiver: string;
  @Property() public amount: number;
  @Property() public latency: string;
  @Property() public throughput: number;
  @Property() public blockCreationTime: string;
  @Property() public transactionSuccessRate: string;
  @Property() public cpuUsage: string;
  @Property() public memoryUsage: string;
  @Property() public networkLatency: string;
  @Property() public consensusTime: string;
  @Property() public scenario: string;
  @Property() public description: string;
}
