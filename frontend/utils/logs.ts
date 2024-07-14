import { publicClient } from "./client";

import { parseAbiItem, ParseAbiItem, Log , getContract} from "viem";
import { useWatchContractEvent } from 'wagmi'
import { config } from '@/utils/config';
import { contractAbi, contractAddress } from "@/constants"



export async function getLogs(eventName: string, filterString?: string) {
  let event: ParseAbiItem<string>;

  switch (eventName) {
    case "UserRegistered":
      event = parseAbiItem("event UserRegistered(address indexed user, uint8 indexed role, string encryptedDatas)");
      break;
    case "PrescriptionMinted":
      event = parseAbiItem("event PrescriptionMinted(uint256 indexed tokenId, address indexed doctor, address indexed patient, string encryptedDetails, uint256 date_created)");
      break;
    case "PrescriptionTreated":
      event = parseAbiItem("event PrescriptionTreated(uint256 indexed tokenId, address indexed pharmacist ,uint256 date_treated)");
      break;
    default:
      throw new Error(`Event ${eventName} does not exist`);
  }


  var args: any = {}

  var deploymentBlockNumber = BigInt(0);
  if (process.env.NODE_ENV === "production") {
    deploymentBlockNumber = BigInt(12432333);
  }

  var logs: any[] = []

  if (filterString) {
    switch (filterString) {
      case "Patient":
        args = { role:3 }
        break;
      default:
        break;
    }

    if(eventName==="PrescriptionTreated"){
      args = { pharmacist: filterString }
    }

    const filter = await publicClient.createEventFilter({
      address: contractAddress,
      event: event,
      fromBlock: deploymentBlockNumber,
      toBlock: "latest",
      args: args
    })

    logs = await publicClient.getFilterLogs({ filter })



  } else {
    logs = await publicClient.getLogs({
      address: contractAddress,
      event: event,
      fromBlock: deploymentBlockNumber,
      toBlock: "latest"
    });
  }
  let newArray: any = [];
  // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
  logs.forEach(ev => {
    if (ev.args) {
      console.log(typeof ev.args.role)
      newArray.push(ev.args)
    }
  })
  return newArray;
}


