import {
  DeleteObjectsCommand,
  paginateListObjectsV2,
  S3Client,
  ObjectIdentifier,
  _Object,
} from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();


export const deleteAllObjects = async (): Promise<void> => {
  const bucketName = process.env.S3_BUCKET;
  if (!bucketName) {
    throw new Error("S3_BUCKET environment variable is not defined");
  }

  const client = new S3Client({});

  try {
    console.log(`Deleting all objects in bucket: ${bucketName}`);

    const paginator = paginateListObjectsV2(
      { client },
      { Bucket: bucketName }
    );

    const objectKeys: ObjectIdentifier[] = [];

    for await (const page of paginator) {
      if (page.Contents) {
        const keys = page.Contents
          .filter((obj: _Object) => obj.Key !== undefined)
          .map((obj: _Object) => ({ Key: obj.Key! }));
        objectKeys.push(...keys);
      }
    }

    if (objectKeys.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: objectKeys },
      });

      await client.send(deleteCommand);
      console.log(`All objects deleted from bucket: ${bucketName}`);
    } else {
      console.log(`No objects found in bucket: ${bucketName}`);
    }
  } catch (caught) {
    if (caught instanceof Error) {
      console.error(
        `Failed to empty ${bucketName}. ${caught.name}: ${caught.message}`
      );
    } else {
      console.error(`Failed to empty ${bucketName}. Unknown error`, caught);
    }
  }
};
