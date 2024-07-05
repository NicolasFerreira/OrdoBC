import { publicClient } from "./client";
import { contractAddress } from "@/constants";
import { parseAbiItem, ParseAbiItem, Log } from "viem";


export async function getLogs(eventName: string) {
  let event: ParseAbiItem<string>;

  switch (eventName) {
    case "UserRegistered":
      event = parseAbiItem("event UserRegistered(address indexed user, Roles role, string encryptedDatas)");
      break;
    case "PrescriptionMinted":
      event = parseAbiItem("event PrescriptionMinted(uint256 indexed tokenId, address indexed doctor, address indexed patient, string encryptedDetails, uint256 date_created)");
      break;
    case "PrescriptionTreated":
      event = parseAbiItem("event PrescriptionTreated(uint256 indexed tokenId)");
      break;
    default:
      throw new Error(`Event ${eventName} does not exist`);
  }

  
  const logs = await publicClient.getLogs({
    address: contractAddress,
    event: event,
    fromBlock: BigInt(0), // Replace with the actual deployment block number if known
    toBlock: 'latest'
  });

  let newArray:any = [];
    // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
    logs.forEach(ev => {
      if (ev.args) {
        newArray.push(ev.args)
      }
    })

    

  return newArray;
}
