import { exec } from "child_process";
import util from "util";
import { MPUConfig, MPUResponse } from "./types";

const execAsync = util.promisify(exec);

/**
 * Generic function to get AWS resource ARN by name.
 * @param {MPUConfig} config - Configuration object containing profileName, bucketName, keyName, and uploadId.
 * @returns {Promise<MPUResponse>} - A promise that resolves to the MPUResponse object.
 */
export async function mpuAbort(config: MPUConfig): Promise<MPUResponse> {
  const { profileName = "default", bucketName, keyName, uploadId } = config;

  // Execute the command and extract the stdout, then trim any extra whitespace
  const regionResult = await execAsync(
    `aws configure --profile ${profileName} get region --output text`
  );
  const REGION = regionResult.stdout.trim();
  const accountIdResult = await execAsync(
    `aws sts --profile ${profileName} get-caller-identity  --query Account --output text`
  );
  const ACCOUNT_ID = accountIdResult.stdout.trim();
  const command = `aws s3api list-multipart-uploads --profile ${profileName} --bucket ${bucketName}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Error fetching data: ${stderr}`);
    }
    const result: MPUResponse = JSON.parse(stdout);
    if (!result.UploadId) {
      throw new Error("No UploadId found.");
    }
    return result;
  } catch (error) {
    console.error(`Failed to execute command: ${error}`);
    throw error;
  }
}

// Example usage:
async function main() {
  const config: MPUConfig = {
    profileName: "sst",
    bucketName: "bronifty-sst",
    keyName: "multipart/01",
    uploadId: "",
  };
  const MPUResponse = await mpuAbort(config);
  console.log("MPUReponse: ", MPUResponse);
  return MPUResponse;
}
main()
  .then((MPUResponse) =>
    console.log("MPUReponse in main's then: ", MPUResponse)
  )
  .catch((err) => console.error("Error in catch: ", err));

// import { exec } from "child_process";
// import util from "util";

// const execAsync = util.promisify(exec);

// /**
//  * Generic function to get AWS resource ARN by name.
//  * @param {string} profileName - Name of the profile.
//  * @param {string} bucketName - Name of the bucket.
//  * @returns {Promise<string>} - A promise that resolves to the ARN of the resource.
//  */

// export async function s3apiMPUList(
//   profileName: string = "default",
//   bucketName: string
// ) {
//   //   let command;
//   // Execute the command and extract the stdout, then trim any extra whitespace
//   const regionResult = await execAsync(
//     "aws configure get region --output text"
//   );
//   const REGION = regionResult.stdout.trim();
//   const accountIdResult = await execAsync(
//     "aws sts get-caller-identity --query Account --output text"
//   );
//   const ACCOUNT_ID = accountIdResult.stdout.trim();
//   const command = `aws s3api list-multipart-uploads --profile ${profileName} --bucket ${bucketName}`;

//   try {
//     const { stdout, stderr } = await execAsync(command);
//     if (stderr) {
//       throw new Error(`Error fetching data: ${stderr}`);
//     }
//     const resultArray = JSON.parse(stdout);
//     if (resultArray.length === 0) {
//       throw new Error("No results found.");
//     }
//     return resultArray;
//   } catch (error) {
//     console.error(`Failed to execute command: ${error}`);
//     throw error;
//   }
// }

// // Example usage:
// async function main() {
//   const { UploadId } = await s3apiMPUList("sst", "bronifty-sst");
//   return UploadId;
// }
// main()
//   .then((objects) => console.log("Objects:", objects))
//   .catch((err) => console.error(err));
