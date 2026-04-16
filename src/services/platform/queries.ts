import { DocumentNode, gql } from "@apollo/client";

const workerQuery = (peerId: string): DocumentNode => gql`
  query WorkerQuery {
    workers(limit: 1, where: { peerId_eq: "${peerId}" }) {
      id
      peerId
      name
      bond
      createdAt
      storedData
      apr
      version
      totalDelegation
      delegationCount
      stakerApr
      uptime24Hours
      uptime90Days
      totalDelegationRewards
      claimableReward
      queries90Days
      queries24Hours
      servedData24Hours
      servedData90Days
    }
  }
`;

export default workerQuery;
